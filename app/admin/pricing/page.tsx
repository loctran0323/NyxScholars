import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { DEFAULT_PACKAGES } from "@/lib/pricing";
import { PricingEditor } from "./PricingEditor";

export const metadata = { title: "Pricing · Admin" };

export default async function AdminPricingPage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  let rows: { id: string; name: string | null; weeks: number | null; total_hours: number | null; total_price: number | null; effective_hourly: number | null; discount_pct: number | null; summary: string | null; recommended: boolean | null; enabled: boolean }[] = [];
  if (sb) {
    const { data } = await sb.from("pricing_config").select("*").order("id");
    rows = (data ?? []) as typeof rows;
  }

  // Merge defaults with DB rows so the editor always has all packages.
  const packages = DEFAULT_PACKAGES.map((p) => {
    const dbRow = rows.find((r) => r.id === p.id);
    return {
      id:               p.id,
      name:             dbRow?.name             ?? p.name,
      weeks:            dbRow?.weeks            ?? p.weeks,
      total_hours:      dbRow?.total_hours      ?? p.totalHours,
      total_price:      dbRow?.total_price      ?? p.totalPrice,
      effective_hourly: dbRow?.effective_hourly ?? p.effectiveHourly,
      discount_pct:     dbRow?.discount_pct     ?? p.discountPct,
      summary:          dbRow?.summary          ?? p.summary,
      recommended:      dbRow?.recommended      ?? !!p.recommended,
      enabled:          dbRow?.enabled          ?? true,
    };
  });

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Pricing</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Edit live plan prices, hours, summaries, and which one is marked Most Popular.
          Changes take effect immediately on <code className="text-[var(--accent)]">/portal/upgrade</code>.
        </p>
      </header>
      <PricingEditor initial={packages} />
    </div>
  );
}
