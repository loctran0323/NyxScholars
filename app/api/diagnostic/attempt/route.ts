import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { POOL } from "@/lib/diagnostic";
import { seedSrsCard } from "@/lib/srs-seed";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: true, persisted: false });

  const { data: { user } } = await supabase.auth.getUser();
  // Anonymous attempts are accepted but not persisted (RLS would reject them).
  if (!user) return NextResponse.json({ ok: true, persisted: false });

  const questionId = String(body.question_id ?? "");
  const skillId    = String(body.skill_id    ?? "");
  const correct    = Boolean(body.correct);

  const { error } = await supabase.from("diagnostic_attempts").insert({
    user_id: user.id,
    question_id: questionId,
    skill_id: skillId,
    picked_index: Number(body.picked_index ?? -1),
    correct,
    ms: body.ms != null ? Number(body.ms) : null,
    theta_after: body.theta_after != null ? Number(body.theta_after) : null,
    ci_after: body.ci_after != null ? Number(body.ci_after) : null,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Wrong answer → seed a spaced-repetition card so this concept resurfaces
  // in /portal/practice. Best-effort, never blocks the response.
  if (!correct && questionId && skillId) {
    const item = POOL.find((q) => q.id === questionId);
    if (item) {
      const correctChoice = item.choices[item.correct] ?? "";
      const promptText = `${item.prompt}`;
      const answerText = item.rationale
        ? `${correctChoice} — ${item.rationale}`
        : correctChoice;
      // Run after the response — async fire-and-forget pattern via service role.
      void seedSrsCard({
        userId: user.id,
        skillId,
        prompt: promptText,
        answer: answerText,
      });
    } else {
      // DB-sourced item — look it up server-side via the service role.
      const admin = getServiceRoleClient();
      if (admin && questionId.startsWith("db-")) {
        const dbId = questionId.replace(/^db-/, "");
        const { data: row } = await admin
          .from("diagnostic_questions")
          .select("prompt, choices, correct_index, rationale")
          .eq("id", dbId)
          .maybeSingle();
        if (row) {
          const r = row as { prompt: string; choices: string[]; correct_index: number; rationale: string | null };
          const correctChoice = r.choices[r.correct_index] ?? "";
          void seedSrsCard({
            userId: user.id,
            skillId,
            prompt: r.prompt,
            answer: r.rationale ? `${correctChoice} — ${r.rationale}` : correctChoice,
          });
        }
      }
    }
  }

  return NextResponse.json({ ok: true, persisted: true });
}
