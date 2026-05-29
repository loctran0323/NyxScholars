import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { scoreAnswers, getQuestion } from "@/lib/practice/rw-bank";
import { cleanSlug } from "@/lib/practice/student-data";
import { isTalijaAuthed } from "@/lib/talija-auth";

interface RouteCtx {
  params: Promise<{ slug: string }>;
}

/**
 * POST: Arush's client submits a finished session. Correctness is computed
 * server-side from the answer key (never trusting the client) and stored for
 * Talija. Best-effort: if Supabase is not configured or the table is missing,
 * we return 200 with synced:false so the student flow never breaks.
 */
export async function POST(req: NextRequest, { params }: RouteCtx) {
  const { slug } = await params;
  const cleaned = cleanSlug(slug);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ synced: false, reason: "bad-json" }, { status: 400 });
  }

  const rawAnswers = Array.isArray(body.answers) ? body.answers : [];
  const answers = rawAnswers.map((a: Record<string, unknown>) => ({
    questionId: String(a.questionId ?? ""),
    picked: a.picked === null || a.picked === undefined ? null : Number(a.picked),
    ms: Number(a.ms ?? 0),
    flagged: Boolean(a.flagged),
  }));
  const scored = scoreAnswers(answers.map((a) => ({ questionId: a.questionId, picked: a.picked })));
  const correctCount = scored.filter((s) => s.correct).length;

  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ synced: false, reason: "not-configured" });

  const { error } = await client.from("temp_practice_results").insert({
    slug: cleaned,
    mode: body.mode === "content" ? "content" : "pacing",
    module_id: body.moduleId ? String(body.moduleId) : null,
    skill: body.skill ? String(body.skill) : null,
    answers,
    total: answers.length,
    correct_count: correctCount,
    duration_ms: body.durationMs ? Number(body.durationMs) : null,
  });

  if (error) return NextResponse.json({ synced: false, reason: error.message });
  return NextResponse.json({ synced: true });
}

/**
 * GET: Talija (authenticated) pulls Arush's recent sessions, enriched with the
 * full question detail and answer key for review.
 */
export async function GET(req: NextRequest, { params }: RouteCtx) {
  const { slug } = await params;
  if (!(await isTalijaAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ configured: false, results: [] });

  const { data, error } = await client
    .from("temp_practice_results")
    .select("*")
    .eq("slug", cleanSlug(slug))
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ configured: false, results: [], reason: error.message });

  const results = (data ?? []).map((row: Record<string, unknown>) => {
    const answers = (Array.isArray(row.answers) ? row.answers : []) as Array<Record<string, unknown>>;
    return {
      id: row.id,
      mode: row.mode,
      moduleId: row.module_id,
      skill: row.skill,
      total: row.total,
      correctCount: row.correct_count,
      durationMs: row.duration_ms,
      createdAt: row.created_at,
      answers: answers.map((a) => {
        const q = getQuestion(String(a.questionId ?? ""));
        const picked = a.picked === null || a.picked === undefined ? null : Number(a.picked);
        return {
          questionId: a.questionId,
          picked,
          ms: Number(a.ms ?? 0),
          flagged: Boolean(a.flagged),
          skill: q?.skill ?? null,
          difficulty: q?.difficulty ?? null,
          passage: q?.passage ?? "",
          prompt: q?.prompt ?? "(question not found)",
          choices: q?.choices ?? [],
          correct: q?.correct ?? null,
          rationale: q?.rationale ?? "",
          isCorrect: q ? picked === q.correct : false,
        };
      }),
    };
  });

  return NextResponse.json({ configured: true, results });
}
