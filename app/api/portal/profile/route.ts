import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";

const ProfilePut = z.object({
  full_name:    z.string().nullish(),
  grade:        z.string().nullish(),
  school:       z.string().nullish(),
  phone:        z.string().nullish(),
  target_test:  z.enum(["SAT", "ACT"]).nullish(),
  target_score: z.string().nullish(),
});

const ProfilePatch = z.object({
  full_name:    z.string().nullish(),
  grade:        z.string().nullish(),
  school:       z.string().nullish(),
  phone:        z.string().nullish(),
  target_test:  z.enum(["SAT", "ACT"]).nullish(),
  target_score: z.string().nullish(),
  plan:         z.enum(["session", "monthly", "counseling"]).nullish(),
  plan_status:  z.enum(["active", "paused", "cancelled"]).nullish(),
  plan_subject: z.string().nullish(),
  plan_addons:  z.array(z.string()).nullish(),
}).strict();

export async function GET() {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;
  const { supabase, user } = auth;

  const { data: profile, error } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: profile ?? null });
}

export async function PUT(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(request, ProfilePut);
  if (!parsed.ok) return parsed.response;

  const { data, error } = await auth.supabase
    .from("profiles")
    .upsert({ id: auth.user.id, ...parsed.data })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

/**
 * PATCH — partial profile update. Used by the upgrade success page to
 * activate a plan after Stripe checkout, by onboarding, etc.
 */
export async function PATCH(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(request, ProfilePatch);
  if (!parsed.ok) return parsed.response;

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined),
  );
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No allowed fields in body" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("profiles").update(updates).eq("id", auth.user.id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}
