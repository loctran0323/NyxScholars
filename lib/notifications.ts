import { getServiceRoleClient } from "@/lib/supabase";

/**
 * Server-side helper: write a notification to the in-app feed (and, in the
 * future, fan it out to email/SMS channels based on profile.notif_prefs).
 *
 * Safe to call without configured Supabase — becomes a no-op so dev paths
 * keep flowing.
 */

export interface NotificationInput {
  userId: string;
  kind:
    | "session.reminder"
    | "session.confirmed"
    | "session.cancelled"
    | "session.summary"
    | "message.tutor"
    | "message.team"
    | "billing.success"
    | "billing.failed"
    | "billing.dunning"
    | "onboarding.step"
    | "diagnostic.complete"
    | "homework.assigned"
    | "review.requested"
    | "staff.message"
    | "staff.session_request"
    | "staff.diagnostic"
    | "system.announcement";
  title: string;
  body?: string;
  href?: string;
  meta?: Record<string, unknown>;
}

export async function notify(n: NotificationInput): Promise<void> {
  const sb = getServiceRoleClient();
  if (!sb) return;
  const { error } = await sb.from("notifications").insert({
    user_id: n.userId,
    kind:    n.kind,
    title:   n.title,
    body:    n.body  ?? null,
    href:    n.href  ?? null,
    meta:    n.meta  ?? null,
  });
  if (error) console.warn("[notifications] insert failed", error.message);
}

export async function notifyMany(notifications: NotificationInput[]): Promise<void> {
  const sb = getServiceRoleClient();
  if (!sb || notifications.length === 0) return;
  const rows = notifications.map((n) => ({
    user_id: n.userId,
    kind:    n.kind,
    title:   n.title,
    body:    n.body  ?? null,
    href:    n.href  ?? null,
    meta:    n.meta  ?? null,
  }));
  const { error } = await sb.from("notifications").insert(rows);
  if (error) console.warn("[notifications] bulk insert failed", error.message);
}

/**
 * Notify the staff responsible for a student about an inbound event (a new
 * message to the Nyx team, a scheduling request, etc.). Targets the student's
 * active assigned tutor(s); if none are assigned yet, falls back to every
 * teacher so nothing slips through. Best-effort — never throws into the caller.
 */
export async function notifyStudentTutors(
  studentId: string,
  n: Omit<NotificationInput, "userId">,
): Promise<void> {
  try {
    const sb = getServiceRoleClient();
    if (!sb) return;
    const { data: assigns } = await sb
      .from("assignments")
      .select("teacher_id")
      .eq("student_id", studentId)
      .eq("active", true);
    let ids = [...new Set((assigns ?? []).map((a) => a.teacher_id as string).filter(Boolean))];
    if (ids.length === 0) {
      const { data: teachers } = await sb.from("profiles").select("id").eq("role", "teacher");
      ids = (teachers ?? []).map((t) => t.id as string);
    }
    if (ids.length === 0) return;
    await notifyMany(ids.map((id) => ({ ...n, userId: id })));
  } catch (e) {
    console.warn("[notifications] notifyStudentTutors failed", (e as Error).message);
  }
}
