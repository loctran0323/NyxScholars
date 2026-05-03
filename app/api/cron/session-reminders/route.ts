import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { notify } from "@/lib/notifications";
import { captureException } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * GET /api/cron/session-reminders
 *
 * Bearer-token-gated cron endpoint: emits the 1-hour-before reminder
 * email + in-app notification for any sessions starting in the next 60
 * minutes. Idempotent via a `reminded_1h` flag stored on
 * `sessions.admin_notes` (we keep state inline to avoid another column).
 *
 * Hit hourly from a routine: `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const now = new Date();
  const horizon = new Date(now.getTime() + 60 * 60 * 1000);

  const { data: sessions, error } = await sb
    .from("sessions")
    .select("*")
    .in("status", ["confirmed", "pending"])
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", horizon.toISOString());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let processed = 0;
  let emails = 0;
  const errors: string[] = [];

  for (const row of sessions ?? []) {
    const s = row as {
      id: string;
      student_id: string;
      subject: string;
      scheduled_at: string;
      tutor_name: string | null;
      meeting_link: string | null;
      admin_notes: string | null;
    };

    // Idempotency: a `[reminded_1h]` marker baked into admin_notes.
    if (s.admin_notes?.includes("[reminded_1h]")) continue;

    try {
      const minutesUntil = Math.max(0, Math.round((new Date(s.scheduled_at).getTime() - Date.now()) / 60000));

      // Look up student email + tz.
      const { data: profile } = await sb
        .from("profiles")
        .select("full_name, timezone, parent_email")
        .eq("id", s.student_id)
        .maybeSingle();

      // Auth email.
      const { data: userRow } = await sb.auth.admin.getUserById(s.student_id);
      const studentEmail = userRow?.user?.email ?? null;

      if (studentEmail) {
        await sendEmail({
          to: studentEmail,
          subject: `Your session with ${s.tutor_name ?? "your tutor"} starts in ${minutesUntil} min`,
          template: "session.reminder",
          props: {
            recipientName: (profile as { full_name: string | null } | null)?.full_name ?? undefined,
            sessionDate: new Date(s.scheduled_at).toLocaleString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: (profile as { timezone: string | null } | null)?.timezone ?? undefined,
            }),
            tutorName: s.tutor_name ?? "your tutor",
            joinUrl: s.meeting_link ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portal/sessions/${s.id}`,
            minutesUntil,
          },
        });
        emails += 1;
      }

      await notify({
        userId: s.student_id,
        kind: "session.reminder",
        title: `Session in ${minutesUntil} min`,
        body: `${s.subject}${s.tutor_name ? ` with ${s.tutor_name}` : ""}.`,
        href: `/portal/sessions/${s.id}`,
      });

      await sb
        .from("sessions")
        .update({ admin_notes: `${s.admin_notes ?? ""}\n[reminded_1h]`.trim() })
        .eq("id", s.id);

      processed += 1;
    } catch (err) {
      captureException(err, { route: "cron.session-reminders", sessionId: s.id });
      errors.push(`${s.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({ processed, emails, errors });
}
