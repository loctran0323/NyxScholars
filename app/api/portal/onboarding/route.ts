import { NextResponse } from "next/server";
import { OnboardingPatch } from "@/lib/zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { track, EVENTS } from "@/lib/analytics";

export const runtime = "nodejs";

/**
 * PATCH /api/portal/onboarding — mark a single step complete (or undone).
 * Stores under profile.onboarding_state, a JSONB blob.
 */
export async function PATCH(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, OnboardingPatch);
  if (!parsed.ok) return parsed.response;

  const { step, done, context } = parsed.data;
  const current = await auth.supabase
    .from("profiles").select("onboarding_state")
    .eq("id", auth.user.id).maybeSingle();
  const state = (current.data?.onboarding_state ?? {}) as Record<string, unknown>;
  state[step] = done;
  if (context) state[`${step}_ctx`] = context;

  const { error } = await auth.supabase
    .from("profiles").update({ onboarding_state: state })
    .eq("id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  track(EVENTS.ONBOARDING_STEP, { step, done });
  return NextResponse.json({ ok: true, state });
}
