import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { POOL, SKILLS } from "@/lib/diagnostic";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const metadata = { title: "Diagnostics · Admin" };

interface CheckResult {
  name: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

export default async function AdminDiagnosticsPage() {
  await requireAdminAuth();
  const checks: CheckResult[] = [];

  // 1. Static + generated bank.
  checks.push({
    name: "Question pool",
    status: POOL.length >= 20 ? "ok" : "warn",
    detail: `${POOL.length} items across ${SKILLS.length} skills.`,
  });

  // 2. Supabase service role.
  const sb = getServiceRoleClient();
  if (!sb) {
    checks.push({ name: "Supabase service role", status: "fail", detail: "SUPABASE_SERVICE_ROLE_KEY not set." });
  } else {
    checks.push({ name: "Supabase service role", status: "ok", detail: "Connected." });

    // 3. Each table reachable.
    const tables = [
      "profiles", "sessions", "messages", "diagnostic_questions", "diagnostic_attempts",
      "notifications", "audit_log", "webhook_events", "homework", "srs_cards",
      "tutor_availability", "gift_cards", "experiment_assignments", "pricing_config",
      "forum_threads", "forum_replies",
    ];
    for (const t of tables) {
      const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
      if (error) {
        checks.push({ name: `Table: ${t}`, status: "fail", detail: error.message });
      } else {
        checks.push({ name: `Table: ${t}`, status: "ok", detail: `${count ?? 0} rows.` });
      }
    }

    // 4. Pricing seeded.
    const { count: pricingCount } = await sb.from("pricing_config").select("id", { count: "exact", head: true });
    checks.push({
      name: "Pricing seeded",
      status: (pricingCount ?? 0) >= 3 ? "ok" : "warn",
      detail: `${pricingCount ?? 0}/3 packages in pricing_config (run supabase-pricing-schema.sql).`,
    });
  }

  // 5. Vendor keys present? (fail = unconfigured; warn = optional).
  const vendor = (key: string, optional = false): CheckResult => ({
    name: `Env: ${key}`,
    status: process.env[key] ? "ok" : optional ? "warn" : "fail",
    detail: process.env[key] ? "set" : optional ? "optional, not set" : "not set",
  });
  checks.push(
    vendor("STRIPE_SECRET_KEY"),
    vendor("STRIPE_WEBHOOK_SECRET"),
    vendor("ANTHROPIC_API_KEY", true),
    vendor("OPENAI_API_KEY", true),
    vendor("RESEND_API_KEY", true),
    vendor("UPSTASH_REDIS_REST_URL", true),
    vendor("CRON_SECRET", true),
  );

  return (
    <div className="max-w-4xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Diagnostics</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Live health of every wired feature. Run after every migration or deploy.
        </p>
      </header>

      <ul className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] overflow-hidden">
        {checks.map((c) => (
          <li key={c.name} className="px-5 py-3 flex items-center gap-3">
            <span aria-hidden>
              {c.status === "ok"   && <CheckCircle2 size={15} className="text-[var(--success)]" />}
              {c.status === "warn" && <AlertCircle  size={15} className="text-[var(--warning)]" />}
              {c.status === "fail" && <XCircle      size={15} className="text-[var(--danger)]" />}
            </span>
            <span className="text-[13.5px] font-semibold text-[var(--text-1)] w-72 shrink-0">{c.name}</span>
            <span className="text-[12.5px] text-[var(--text-2)]">{c.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
