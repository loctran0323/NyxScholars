import { getServiceRoleClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { requireAdminAuth } from "@/lib/admin-auth";

export const metadata = { title: "Students · Admin" };

export default async function AdminStudentsPage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  if (!sb) {
    return (
      <Empty>
        Service role key not configured. Add <code className="text-[var(--accent)]">SUPABASE_SERVICE_ROLE_KEY</code> to
        load the student roster.
      </Empty>
    );
  }
  const { data } = await sb
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <div className="max-w-6xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Student roster</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Active students, plan state, and target test. Click any row to drill into their portal view.
        </p>
      </header>
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--bg-2)] text-[11.5px] uppercase tracking-wider text-[var(--text-3)]">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Target</th>
              <th className="text-left px-4 py-3">Grade</th>
              <th className="text-left px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--text-3)]">No students yet.</td></tr>
            )}
            {rows.map((p) => {
              const profile = p as { id: string; full_name: string | null; plan: string | null; plan_status: string | null; target_test: string | null; target_score: string | null; grade: string | null; created_at: string };
              return (
                <tr key={profile.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-[var(--text-1)] font-semibold">{profile.full_name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {profile.plan ? (
                      <Badge variant={profile.plan_status === "active" ? "green" : "default"}>{profile.plan}</Badge>
                    ) : (
                      <span className="text-[var(--text-3)]">none</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-2)]">
                    {profile.target_test ? `${profile.target_test} ${profile.target_score ?? ""}`.trim() : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-2)]">{profile.grade ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-3)] font-mono">{format(new Date(profile.created_at), "MMM d")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center text-[var(--text-2)] text-[14px]">{children}</div>
  );
}
