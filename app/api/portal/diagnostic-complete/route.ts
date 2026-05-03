import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const Body = z.object({
  theta:        z.number(),
  ci:           z.number(),
  questionsAsked: z.number().int().min(0),
  predictedScore: z.number().int().min(0).max(1700),
  perSkill:     z.record(z.string(), z.number().min(0).max(1)),
});

/**
 * POST /api/portal/diagnostic-complete
 *
 * Stamp the user's profile with a snapshot of their diagnostic outcome so
 * the constellation page (and downstream tutor matching) can read a single
 * source of truth instead of replaying every attempt row.
 *
 * Stored under `profile.notif_prefs.diagnostic_summary` to avoid an
 * additional schema migration.
 */
export async function POST(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const admin = getServiceRoleClient() ?? sb;
  const { data: profile } = await admin
    .from("profiles")
    .select("notif_prefs")
    .eq("id", user.id)
    .maybeSingle();
  const meta = ((profile as { notif_prefs: Record<string, unknown> | null } | null)?.notif_prefs ?? {}) as Record<string, unknown>;

  const summary = {
    completed_at:   new Date().toISOString(),
    theta:          parsed.data.theta,
    ci:             parsed.data.ci,
    questions:      parsed.data.questionsAsked,
    predicted_score: parsed.data.predictedScore,
    per_skill:      parsed.data.perSkill,
  };

  const { error } = await admin
    .from("profiles")
    .update({
      notif_prefs: { ...meta, diagnostic_summary: summary },
    })
    .eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, summary });
}
