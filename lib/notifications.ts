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
