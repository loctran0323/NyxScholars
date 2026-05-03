import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import { seedSrsCards } from "@/lib/srs-seed";

export const runtime = "nodejs";

const QuestionSchema = z.object({
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2).max(6),
  correct_index: z.number().int().min(0),
  rationale: z.string().optional(),
});

const Create = z.object({
  student_id: z.string().uuid(),
  session_id: z.string().uuid().optional(),
  title:      z.string().min(1).max(160),
  body:       z.string().max(2000).optional(),
  due_at:     z.string().datetime().optional(),
  questions:  z.array(QuestionSchema).max(20),
});

const Submit = z.object({
  homework_id: z.string().uuid(),
  results: z.array(z.object({
    picked_index: z.number().int().min(0),
    correct: z.boolean(),
    ms: z.number().int().nonnegative(),
  })),
});

export async function GET() {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ homework: [] });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await sb
    .from("homework")
    .select("*")
    .or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ homework: data ?? [] });
}

export async function POST(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Create.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const { error, data } = await sb
    .from("homework")
    .insert({
      tutor_id:   user.id,
      student_id: parsed.data.student_id,
      session_id: parsed.data.session_id ?? null,
      title:      parsed.data.title,
      body:       parsed.data.body ?? null,
      due_at:     parsed.data.due_at ?? null,
      questions:  parsed.data.questions,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notify({
    userId: parsed.data.student_id,
    kind:   "homework.assigned",
    title:  parsed.data.title,
    body:   `${parsed.data.questions.length} question${parsed.data.questions.length === 1 ? "" : "s"} from your tutor.`,
    href:   `/portal/homework/${data.id}`,
  });

  return NextResponse.json({ homework: data });
}

export async function PATCH(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Submit.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  // Load the homework first so we can map results back to questions and
  // surface the missed concepts as SRS cards.
  const { data: hw } = await sb
    .from("homework")
    .select("id, questions, session_id")
    .eq("id", parsed.data.homework_id)
    .eq("student_id", user.id)
    .maybeSingle();
  if (!hw) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await sb
    .from("homework")
    .update({
      results:      parsed.data.results,
      completed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.homework_id)
    .eq("student_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Seed SRS cards for every wrong answer so the concept resurfaces in
  // /portal/practice over the next few days. Best-effort, never blocks.
  const questions = (hw as { questions: { prompt: string; choices: string[]; correct_index: number; rationale?: string }[] }).questions ?? [];
  const wrong: { userId: string; skillId: string; prompt: string; answer: string }[] = [];
  parsed.data.results.forEach((r, i) => {
    if (r.correct) return;
    const q = questions[i];
    if (!q) return;
    const correctChoice = q.choices[q.correct_index] ?? "";
    wrong.push({
      userId: user.id,
      skillId: "homework",
      prompt: q.prompt,
      answer: q.rationale ? `${correctChoice} — ${q.rationale}` : correctChoice,
    });
  });
  if (wrong.length > 0) {
    void seedSrsCards(wrong);
  }

  return NextResponse.json({ ok: true, seededForReview: wrong.length });
}
