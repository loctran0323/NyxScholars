"use client";

import * as React from "react";
import { CreditCard, FileText, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function openCustomerPortal() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/billing", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not open billing portal.");
        return;
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight">Billing & invoices</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Manage your payment method, view receipts, change plan, or cancel — all in Stripe&apos;s secure portal.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
            <CreditCard size={18} className="text-[var(--accent)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-[var(--text-1)]">Open the customer portal</h2>
            <p className="text-[13px] text-[var(--text-2)] mt-0.5">
              You&apos;ll be redirected to Stripe&apos;s hosted portal. Returns you here when you&apos;re done.
            </p>
            {error && <p className="text-[12.5px] text-[var(--danger)] mt-3">{error}</p>}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="primary" loading={loading} onClick={openCustomerPortal}>
                Open billing portal <ExternalLink size={14} />
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:hello@nyxscholars.com?subject=Billing%20question">Email billing</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <BillingFeature
          icon={FileText}
          title="Invoices & receipts"
          description="Every charge is tax-receipted. Download PDFs from the portal anytime."
        />
        <BillingFeature
          icon={ShieldCheck}
          title="PCI-safe by Stripe"
          description="We never see your card number. Stripe stores it under PCI DSS Level 1."
        />
      </div>
    </div>
  );
}

function BillingFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[var(--text-3)]" />
        <p className="text-[13px] font-semibold text-[var(--text-1)]">{title}</p>
      </div>
      <p className="text-[12.5px] text-[var(--text-2)] leading-relaxed">{description}</p>
    </div>
  );
}
