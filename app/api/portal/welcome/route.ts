import { NextResponse } from "next/server";
import { getPortalApi } from "@/lib/portal-auth";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WELCOME_REPEAT_DAYS = 60;

/**
 * POST /api/portal/welcome — fires the welcome email after signup. Idempotent:
 * tracks `welcome_sent_at` under notif_prefs and no-ops within 60 days.
 */
export async function POST() {
  const auth = await getPortalApi({
    onMissing: NextResponse.json({ ok: true, sent: false, reason: "auth-unconfigured" }),
  });
  if (!auth.ok) return auth.response;
  if (!auth.user.email) {
    return NextResponse.json({ ok: true, sent: false, reason: "no-email" });
  }

  const { data: profile } = await auth.supabase
    .from("profiles").select("full_name, notif_prefs")
    .eq("id", auth.user.id).maybeSingle();
  const meta = ((profile as { notif_prefs: Record<string, unknown> | null } | null)?.notif_prefs ?? {}) as Record<string, unknown>;

  const last = meta.welcome_sent_at ? new Date(String(meta.welcome_sent_at)).getTime() : 0;
  if (last && Date.now() - last < WELCOME_REPEAT_DAYS * 24 * 3600 * 1000) {
    return NextResponse.json({ ok: true, sent: false, reason: "recently-sent" });
  }

  const result = await sendEmail({
    to: auth.user.email,
    subject: "Welcome to Nyx Scholars",
    template: "welcome",
    props: {
      recipientName: ((profile as { full_name: string | null } | null)?.full_name) ?? auth.user.email.split("@")[0],
      ctaUrl: `${SITE_URL}/portal`,
    },
  });

  if (result.ok) {
    await auth.supabase
      .from("profiles")
      .update({ notif_prefs: { ...meta, welcome_sent_at: new Date().toISOString() } })
      .eq("id", auth.user.id);
  }

  return NextResponse.json({ ok: true, sent: result.ok });
}
