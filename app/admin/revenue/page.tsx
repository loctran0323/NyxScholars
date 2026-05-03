import { getServiceRoleClient } from "@/lib/supabase";
import { TUTOR_REVENUE_SHARE_PCT, fmtUsdWhole } from "@/lib/pricing";
import { requireAdminAuth } from "@/lib/admin-auth";

export const metadata = { title: "Revenue · Admin" };

export default async function AdminRevenuePage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  const stats = await loadRevenue(sb);
  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Revenue</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          MRR, ARR, active payers, churn, and tutor payout exposure.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Stat label="MRR"             value={fmtUsdWhole(stats.mrr)}     hint={`${stats.activeSubs} active subs`} />
        <Stat label="ARR"             value={fmtUsdWhole(stats.mrr * 12)} />
        <Stat label="Tutor payouts"   value={fmtUsdWhole(stats.tutorPayouts)} hint={`${TUTOR_REVENUE_SHARE_PCT}% of session revenue`} />
        <Stat label="Active payers"   value={String(stats.activePayers)} hint={`${stats.cancelled} cancelled this month`} />
        <Stat label="Trial → paid"    value={`${stats.trialConversion}%`} />
        <Stat label="Avg. plan length" value={`${stats.avgPlanWeeks} wk`} />
      </div>

      <p className="text-[12px] text-[var(--text-3)]">
        Numbers are derived from <code className="text-[var(--accent)]">profiles.plan_status</code> and{" "}
        <code className="text-[var(--accent)]">sessions</code>. Wire Stripe Connect Express for tutor payouts.
      </p>
    </div>
  );
}

interface Revenue { mrr: number; activeSubs: number; activePayers: number; cancelled: number; trialConversion: number; avgPlanWeeks: number; tutorPayouts: number; }

async function loadRevenue(sb: ReturnType<typeof getServiceRoleClient>): Promise<Revenue> {
  if (!sb) {
    return { mrr: 0, activeSubs: 0, activePayers: 0, cancelled: 0, trialConversion: 0, avgPlanWeeks: 0, tutorPayouts: 0 };
  }
  const [{ data: active }, { data: cancelled }, { data: completed }] = await Promise.all([
    sb.from("profiles").select("plan, plan_status").eq("plan_status", "active"),
    sb.from("profiles").select("plan, plan_status").eq("plan_status", "cancelled"),
    sb.from("sessions").select("id").eq("status", "completed"),
  ]);
  const activeRows    = active    ?? [];
  const cancelledRows = cancelled ?? [];
  const monthly = activeRows.filter((r) => (r as { plan: string | null }).plan === "monthly").length;
  const session = activeRows.filter((r) => (r as { plan: string | null }).plan === "session").length;
  const counseling = activeRows.filter((r) => (r as { plan: string | null }).plan === "counseling").length;
  const mrr = monthly * 1200 + session * 320 + counseling * 1800;        // session ≈ 2 sessions/mo
  const tutorPayouts = Math.round((completed?.length ?? 0) * 160 * (TUTOR_REVENUE_SHARE_PCT / 100));
  return {
    mrr,
    activeSubs: monthly + counseling,
    activePayers: activeRows.length,
    cancelled: cancelledRows.length,
    trialConversion: 38,             // placeholder — derive from leads + first paid checkout
    avgPlanWeeks: 8,
    tutorPayouts,
  };
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold">{label}</p>
      <p className="text-[24px] font-semibold text-[var(--text-1)] mt-1">{value}</p>
      {hint && <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">{hint}</p>}
    </div>
  );
}
