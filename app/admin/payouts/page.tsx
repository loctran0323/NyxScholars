import { getServiceRoleClient } from "@/lib/supabase";
import { TUTOR_REVENUE_SHARE_PCT, fmtUsdWhole } from "@/lib/pricing";
import { requireAdminAuth } from "@/lib/admin-auth";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = { title: "Payouts · Admin" };

interface TutorRow {
  id: string;
  full_name: string | null;
  stripe_account_id: string | null;
  stripe_account_status: string | null;
  verified_at: string | null;
}

export default async function AdminPayoutsPage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  if (!sb) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-[var(--text-2)] text-[14px]">
        Add <code className="text-[var(--accent)]">SUPABASE_SERVICE_ROLE_KEY</code> + Stripe Connect
        credentials to enable tutor payouts.
      </div>
    );
  }

  const { data } = await sb
    .from("profiles")
    .select("id, full_name, stripe_account_id, stripe_account_status, verified_at")
    .eq("role", "teacher")
    .order("full_name");
  const tutors = (data ?? []) as unknown as TutorRow[];

  // Sum payouts owed: (completed sessions × hourly × revenue share). In a
  // real implementation, run this via a batch job that ledgers each session
  // payout in a `tutor_payouts` table and reconciles weekly.
  const { data: completed } = await sb
    .from("sessions")
    .select("id, tutor_name, duration_minutes")
    .eq("status", "completed");
  const completedRows = completed ?? [];
  const totalDue = completedRows.reduce(
    (sum, r) => sum + ((r as { duration_minutes: number | null }).duration_minutes ?? 60) / 60 * 160 * (TUTOR_REVENUE_SHARE_PCT / 100),
    0,
  );

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Tutor payouts</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Stripe Connect Express splits the session rate {TUTOR_REVENUE_SHARE_PCT}% to the tutor,{" "}
          {100 - TUTOR_REVENUE_SHARE_PCT}% to Nyx, automatically when a session is marked completed.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Completed sessions" value={String(completedRows.length)} />
        <Stat label="Total payouts owed" value={fmtUsdWhole(totalDue)} />
        <Stat label="Active tutors"      value={String(tutors.filter((t) => t.stripe_account_status === "complete").length)} />
      </div>

      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--bg-2)] text-[11.5px] uppercase tracking-wider text-[var(--text-3)]">
            <tr>
              <th className="text-left px-4 py-3">Tutor</th>
              <th className="text-left px-4 py-3">Connect status</th>
              <th className="text-left px-4 py-3">Verified</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tutors.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--text-3)]">No tutors yet.</td></tr>
            )}
            {tutors.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-[var(--text-1)] font-semibold">{t.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  {t.stripe_account_status === "complete" ? (
                    <Badge variant="green">Connected</Badge>
                  ) : t.stripe_account_id ? (
                    <Badge variant="gold">Pending</Badge>
                  ) : (
                    <Badge variant="red">Not started</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {t.verified_at ? (
                    <Badge variant="verified"><ShieldCheck size={10} /> Verified</Badge>
                  ) : (
                    <span className="text-[var(--text-3)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/api/admin/payouts/connect?tutor_id=${t.id}`}
                    className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] hover:text-[var(--accent-bright)]"
                  >
                    {t.stripe_account_id ? "Open dashboard" : "Send onboarding link"}
                    <ExternalLink size={11} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[12px] text-[var(--text-3)] mt-3">
        Stripe Connect Express auto-splits via{" "}
        <code className="text-[var(--accent)]">application_fee_amount</code> on every charge. Hook the
        endpoint in <code className="text-[var(--accent)]">/api/admin/payouts/connect</code> to your
        Stripe account once Connect is enabled.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">{label}</p>
      <p className="text-[22px] font-semibold text-[var(--text-1)] mt-1">{value}</p>
    </div>
  );
}
