import { getServiceRoleClient } from "@/lib/supabase";
import { format } from "date-fns";
import { requireAdminAuth } from "@/lib/admin-auth";

export const metadata = { title: "Audit log · Admin" };

interface AuditRow {
  id: string;
  actor_email: string | null;
  action: string;
  details: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

export default async function AdminAuditPage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  if (!sb) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-[var(--text-2)] text-[14px]">
        Service role key not configured. Add <code className="text-[var(--accent)]">SUPABASE_SERVICE_ROLE_KEY</code> to view the audit log.
      </div>
    );
  }
  const { data } = await sb
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as unknown as AuditRow[];

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Audit log</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Every meaningful change to user records, billing, role, or auth. Tail of 200 most recent.
        </p>
      </header>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center text-[var(--text-3)] text-[14px]">
          Nothing audited yet.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {rows.map((row) => (
            <li key={row.id} className="px-4 py-3 grid sm:grid-cols-[160px_1fr_180px] gap-3 items-start">
              <p className="text-[12.5px] font-mono text-[var(--accent)]">{row.action}</p>
              <div className="min-w-0">
                <p className="text-[13px] text-[var(--text-1)] truncate">
                  {row.actor_email ?? "system"}
                </p>
                {row.details && (
                  <p className="text-[11.5px] text-[var(--text-3)] mt-0.5 line-clamp-1 font-mono">
                    {JSON.stringify(row.details)}
                  </p>
                )}
              </div>
              <p className="text-[11.5px] text-[var(--text-3)] sm:text-right">
                {format(new Date(row.created_at), "MMM d, h:mm:ss a")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
