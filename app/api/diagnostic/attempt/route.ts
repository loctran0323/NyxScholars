import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ok: true, persisted: false });

  const { data: { user } } = await supabase.auth.getUser();
  // Anonymous attempts are accepted but not persisted (RLS would reject them).
  if (!user) return NextResponse.json({ ok: true, persisted: false });

  const { error } = await supabase.from("diagnostic_attempts").insert({
    user_id: user.id,
    question_id: String(body.question_id ?? ""),
    skill_id: String(body.skill_id ?? ""),
    picked_index: Number(body.picked_index ?? -1),
    correct: Boolean(body.correct),
    ms: body.ms != null ? Number(body.ms) : null,
    theta_after: body.theta_after != null ? Number(body.theta_after) : null,
    ci_after: body.ci_after != null ? Number(body.ci_after) : null,
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, persisted: true });
}
