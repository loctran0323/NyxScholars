import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * POST /api/portal/welcome
 *
 * Called once after a successful signup (from the signup page) to fire
 * the welcome email. Idempotent via a `welcome_sent_at` field on the
 * profile — re-calls within 60 days are no-ops.
 */
export async function POST() {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ ok: true, sent: false, reason: "auth-unconfigured" });
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return NextResponse.json({ ok: true, sent: false, reason: "no-email" });

  const { data: profile } = await sb
    .from("profiles")
    .select("full_name, notif_prefs")
    .eq("id", user.id)
    .maybeSingle();
  const meta = ((profile as { notif_prefs: Record<string, unknown> | null } | null)?.notif_prefs ?? {}) as Record<string, unknown>;

  // Idempotent: skip if welcomed within the last 60 days.
  const last = meta.welcome_sent_at ? new Date(String(meta.welcome_sent_at)).getTime() : 0;
  if (last && Date.now() - last < 60 * 24 * 3600 * 1000) {
    return NextResponse.json({ ok: true, sent: false, reason: "recently-sent" });
  }

  const result = await sendEmail({
    to: user.email,
    subject: "Welcome to Nyx Scholars",
    template: "welcome",
    props: {
      recipientName: ((profile as { full_name: string | null } | null)?.full_name) ?? user.email.split("@")[0],
      ctaUrl: `${SITE_URL}/portal`,
    },
  });

  if (result.ok) {
    await sb
      .from("profiles")
      .update({ notif_prefs: { ...meta, welcome_sent_at: new Date().toISOString() } })
      .eq("id", user.id);
  }

  return NextResponse.json({ ok: true, sent: result.ok });
}
