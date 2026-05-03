import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServiceRoleClient } from "@/lib/supabase";
import { mint, GENERATORS, SKILL_BY_ID, poolStats } from "@/lib/diagnostic";

async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === adminPassword;
}

/**
 * Diagnostic question pipeline endpoints.
 *
 *   GET    /api/admin/questions               → bank stats + DB questions
 *   POST   /api/admin/questions               → insert a hand-written question
 *     body: { skill_id, difficulty, prompt, choices: string[], correct_index, rationale?, status? }
 *   POST   /api/admin/questions?action=mint   → batch-mint generated items into the DB
 *     body: { skill_id, count?: number }
 *   PATCH  /api/admin/questions               → update a DB question
 *     body: { id, ...fields }
 *   DELETE /api/admin/questions?id=…          → retire a question
 */

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = poolStats();
  const client = getServiceRoleClient();
  let dbQuestions: unknown[] = [];
  if (client) {
    const { data } = await client
      .from("diagnostic_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    dbQuestions = data ?? [];
  }
  return NextResponse.json({ stats, dbQuestions });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const action = request.nextUrl.searchParams.get("action");
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ── batch mint generated questions ──
  if (action === "mint") {
    const skillId = String(body.skill_id ?? "");
    const count = Math.max(1, Math.min(20, Number(body.count ?? 5)));
    if (!GENERATORS[skillId]) {
      return NextResponse.json(
        { error: `No generator registered for skill "${skillId}"` },
        { status: 400 }
      );
    }
    const items = mint(skillId, count, Date.now() % 1_000_000);
    const meta = SKILL_BY_ID[skillId];
    if (!meta) return NextResponse.json({ error: "Unknown skill" }, { status: 400 });

    const rows = items.map((q) => ({
      skill_id: skillId,
      skill_name: meta.name,
      section: meta.section === "Math" ? "Math" : "Reading & Writing",
      difficulty: q.difficulty,
      prompt: q.prompt,
      choices: q.choices,
      correct_index: q.correct,
      rationale: q.rationale ?? null,
      source: "auto-generator",
      status: "active",
      origin: "generated",
    }));

    const { data, error } = await client
      .from("diagnostic_questions")
      .insert(rows)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ inserted: data?.length ?? 0 });
  }

  // ── insert one hand-written question ──
  const required = ["skill_id", "difficulty", "prompt", "choices", "correct_index"];
  for (const k of required) {
    if (body[k] === undefined || body[k] === null) {
      return NextResponse.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }
  if (!Array.isArray(body.choices) || body.choices.length < 2) {
    return NextResponse.json({ error: "`choices` must be an array of ≥ 2 strings" }, { status: 400 });
  }
  const skillMeta = SKILL_BY_ID[String(body.skill_id)];
  if (!skillMeta) {
    return NextResponse.json({ error: `Unknown skill_id: ${body.skill_id}` }, { status: 400 });
  }

  const { data, error } = await client
    .from("diagnostic_questions")
    .insert({
      skill_id: skillMeta.id,
      skill_name: skillMeta.name,
      section: skillMeta.section === "Math" ? "Math" : "Reading & Writing",
      difficulty: Math.max(1, Math.min(5, Number(body.difficulty))),
      prompt: String(body.prompt),
      choices: body.choices,
      correct_index: Math.max(0, Math.min((body.choices as string[]).length - 1, Number(body.correct_index))),
      rationale: body.rationale ? String(body.rationale) : null,
      source: body.source ? String(body.source) : null,
      status: (body.status as string) ?? "active",
      origin: "admin",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ question: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: "Question id required" }, { status: 400 });

  const allowed = ["prompt", "choices", "correct_index", "difficulty", "rationale", "status"] as const;
  const updates: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) updates[k] = body[k];
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No allowed fields" }, { status: 400 });
  }

  const { data, error } = await client
    .from("diagnostic_questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ question: data });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  // Soft-delete: flip to retired so historical attempt logs still resolve.
  const { error } = await client
    .from("diagnostic_questions")
    .update({ status: "retired" })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
