import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { z } from "zod";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/portal";

type Sb = SupabaseClient;

export interface PortalContext {
  supabase: Sb;
  user: User;
}

/**
 * Server-page guard. Returns the supabase client + authed user, or redirects
 * to /portal/login. Use at the top of every authenticated portal page so the
 * boilerplate disappears.
 */
export async function requirePortalUser(): Promise<PortalContext> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  return { supabase, user };
}

/**
 * Same as requirePortalUser, but additionally fetches the profile row.
 * Pages that need plan / role / target_test info should use this so they
 * don't make a second round trip themselves.
 */
export async function requirePortalProfile(): Promise<PortalContext & { profile: Profile | null }> {
  const { supabase, user } = await requirePortalUser();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return { supabase, user, profile: (data as Profile | null) ?? null };
}

/**
 * Tutor-only server-page guard. Redirects students back to the student
 * dashboard so the URL doesn't 404 on them.
 */
export async function requireTutorUser(): Promise<PortalContext & { profile: Profile }> {
  const { supabase, user, profile } = await requirePortalProfile();
  if (profile?.role !== "teacher") redirect("/portal");
  return { supabase, user, profile: profile as Profile };
}

/* ─────────── API route helpers ─────────── */

export type ApiAuthResult =
  | { ok: true; supabase: Sb; user: User }
  | { ok: false; response: NextResponse };

/**
 * API-route guard. Returns either { ok: true, supabase, user } so the route
 * can do its work, or { ok: false, response } that the route must return.
 * Encodes the standard 503 (not configured) / 401 (unauthorized) responses.
 *
 * Pass `onMissing` to override the no-config response (e.g. a 200 with an
 * empty list payload so consumer GETs degrade gracefully).
 */
export async function getPortalApi(opts?: { onMissing?: NextResponse }): Promise<ApiAuthResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false,
      response: opts?.onMissing ?? NextResponse.json({ error: "Not configured" }, { status: 503 }),
    };
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, supabase, user };
}

/**
 * Parse + validate a JSON body with a Zod schema. Returns either the parsed
 * data or a NextResponse the route should return immediately.
 */
export async function readJson<T>(
  req: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }),
    };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid", details: parsed.error.issues },
        { status: 400 },
      ),
    };
  }
  return { ok: true, data: parsed.data };
}

/**
 * Wrap a Supabase error into a NextResponse — keeps route bodies focused on
 * the happy path.
 */
export function dbError(error: { message: string; code?: string }, status = 500): NextResponse {
  return NextResponse.json({ error: error.message }, { status });
}
