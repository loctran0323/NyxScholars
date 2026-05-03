import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/portal/skill-mastery
 *
 * Aggregates the authenticated user's diagnostic_attempts and homework
 * results into per-skill mastery values, returning a `Record<skill_id, number>`
 * in [0, 1]. The /portal/consultation page consumes this to render the
 * student's actual constellation map (instead of the mocked sample data).
 *
 * Skills with zero attempts are omitted; the consumer can fall back to
 * the default mastery from the static constellation data.
 */
export async function GET() {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ mastery: {}, attempts: 0 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("diagnostic_attempts")
    .select("skill_id, correct")
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = new Map<string, { right: number; total: number }>();
  for (const row of (data ?? []) as { skill_id: string; correct: boolean }[]) {
    const cur = counts.get(row.skill_id) ?? { right: 0, total: 0 };
    cur.total += 1;
    if (row.correct) cur.right += 1;
    counts.set(row.skill_id, cur);
  }

  const mastery: Record<string, number> = {};
  let totalAttempts = 0;
  for (const [skill, c] of counts) {
    // Bayesian smoothing toward 0.5 with a virtual 4-attempt prior so a
    // single right/wrong doesn't yank the bar to 0% or 100%.
    const smoothed = (c.right + 2) / (c.total + 4);
    mastery[skill] = Math.max(0, Math.min(1, smoothed));
    totalAttempts += c.total;
  }

  return NextResponse.json({ mastery, attempts: totalAttempts });
}
