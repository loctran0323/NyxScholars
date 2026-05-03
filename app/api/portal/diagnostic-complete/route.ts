import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { getServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const Body = z.object({
  theta:           z.number(),
  ci:              z.number(),
  questionsAsked:  z.number().int().min(0),
  predictedScore:  z.number().int().min(0).max(1700),
  perSkill:        z.record(z.string(), z.number().min(0).max(1)),
});

/**
 * POST /api/portal/diagnostic-complete
 *
 * Stamp the user's profile with a snapshot of their diagnostic outcome so
 * the constellation page (and downstream tutor matching) can read a single
 * source of truth instead of replaying every attempt row.
 *
 * Stored under `profile.notif_prefs.diagnostic_summary` to avoid an extra
 * schema migration.
 */
export async function POST(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, Body);
  if (!parsed.ok) return parsed.response;

  const admin = getServiceRoleClient() ?? auth.supabase;
  const { data: profile } = await admin
    .from("profiles").select("notif_prefs")
    .eq("id", auth.user.id).maybeSingle();
  const meta = ((profile as { notif_prefs: Record<string, unknown> | null } | null)?.notif_prefs ?? {}) as Record<string, unknown>;

  const summary = {
    completed_at:    new Date().toISOString(),
    theta:           parsed.data.theta,
    ci:              parsed.data.ci,
    questions:       parsed.data.questionsAsked,
    predicted_score: parsed.data.predictedScore,
    per_skill:       parsed.data.perSkill,
  };

  const { error } = await admin
    .from("profiles")
    .update({ notif_prefs: { ...meta, diagnostic_summary: summary } })
    .eq("id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, summary });
}
