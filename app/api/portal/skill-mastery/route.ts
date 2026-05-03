import { NextResponse } from "next/server";
import { getPortalApi } from "@/lib/portal-auth";

export const runtime = "nodejs";

/**
 * GET /api/portal/skill-mastery — aggregates the authenticated user's
 * diagnostic_attempts into per-skill mastery values in [0, 1]. The
 * /portal/consultation page consumes this to render the student's actual
 * constellation map instead of the mocked sample data.
 */
export async function GET() {
  const auth = await getPortalApi({ onMissing: NextResponse.json({ mastery: {}, attempts: 0 }) });
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("diagnostic_attempts")
    .select("skill_id, correct")
    .eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts = new Map<string, { right: number; total: number }>();
  for (const row of (data ?? []) as { skill_id: string; correct: boolean }[]) {
    const cur = counts.get(row.skill_id) ?? { right: 0, total: 0 };
    cur.total += 1;
    if (row.correct) cur.right += 1;
    counts.set(row.skill_id, cur);
  }

  // Bayesian smoothing toward 0.5 with a virtual 4-attempt prior so a single
  // right/wrong doesn't yank the bar to 0% or 100%.
  const mastery: Record<string, number> = {};
  let totalAttempts = 0;
  for (const [skill, c] of counts) {
    mastery[skill] = Math.max(0, Math.min(1, (c.right + 2) / (c.total + 4)));
    totalAttempts += c.total;
  }

  return NextResponse.json({ mastery, attempts: totalAttempts });
}
