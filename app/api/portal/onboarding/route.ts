import { NextResponse } from "next/server";
import { OnboardingPatch, safeParseJson } from "@/lib/zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { track, EVENTS } from "@/lib/analytics";

export const runtime = "nodejs";

/**
 * PATCH /api/portal/onboarding — mark a single step complete (or undone).
 * Stores under profile.onboarding_state, a JSONB blob.
 */
export async function PATCH(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = safeParseJson(OnboardingPatch, body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 });

  const { step, done, context } = parsed.data;

  const current = await sb.from("profiles").select("onboarding_state").eq("id", user.id).maybeSingle();
  const state = (current.data?.onboarding_state ?? {}) as Record<string, unknown>;
  state[step] = done;
  if (context) state[`${step}_ctx`] = context;

  const { error } = await sb.from("profiles").update({ onboarding_state: state }).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  track(EVENTS.ONBOARDING_STEP, { step, done });
  return NextResponse.json({ ok: true, state });
}
