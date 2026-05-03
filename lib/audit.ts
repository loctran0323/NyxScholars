/**
 * Server-side audit log writer. Anything that mutates a user record,
 * touches billing, or changes a role should call audit().
 */

import { getServiceRoleClient } from "@/lib/supabase";

interface AuditInput {
  actorId?: string | null;
  actorEmail?: string | null;
  subjectId?: string | null;
  action: string;          // e.g. "session.cancel", "profile.update", "admin.role.change"
  details?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

export async function audit(input: AuditInput): Promise<void> {
  const sb = getServiceRoleClient();
  if (!sb) {
    console.log("[audit:dev]", JSON.stringify(input));
    return;
  }
  const { error } = await sb.from("audit_log").insert({
    actor_id:   input.actorId   ?? null,
    actor_email: input.actorEmail ?? null,
    subject_id: input.subjectId ?? null,
    action:     input.action,
    details:    input.details   ?? null,
    ip:         input.ip        ?? null,
    user_agent: input.userAgent ?? null,
  });
  if (error) console.warn("[audit] failed", error.message);
}
