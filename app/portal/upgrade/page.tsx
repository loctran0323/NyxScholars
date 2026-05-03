"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Lock, Plus, Gift, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/types/portal";
import {
  ANNUAL_PREPAY_DISCOUNT_PCT,
  HOURLY_RATE,
  PACKAGES as DEFAULT_PACKAGES,
  type Package,
  annualPrepayPricing,
  fmtUsdWhole,
  revenueShareCopy,
} from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { track, EVENTS } from "@/lib/analytics";

interface PlanCard {
  id: PlanType;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  addons: string[];
  cta: string;
  featured?: boolean;
}

const fourWeekDefault  = DEFAULT_PACKAGES.find((p) => p.id === "month")!;
const eightWeekDefault = DEFAULT_PACKAGES.find((p) => p.id === "two-month")!;

function buildPlans(scholar: Package): PlanCard[] {
  return [
    {
      id: "session",
      name: "Session",
      tagline: "Pay as you go",
      description: "Book individual sessions when you need them. One subject category per enrollment.",
      features: [
        "1:1 sessions with an Ivy League tutor",
        "One subject focus (SAT, ACT, AP, or Admissions)",
        "Portal: upcoming sessions + messaging",
        "Subject-specific study resources",
        "No commitment",
      ],
      addons: [],
      cta: "Get Started",
    },
    {
      id: "monthly",
      name: "Scholar",
      tagline: "Most popular",
      description: `Recurring 2-session-per-week cadence with full subject flexibility — packaged at $${scholar.effectiveHourly}/hr (${scholar.discountPct}% off pay-as-you-go).`,
      features: [
        `${scholar.totalHours} sessions over ${scholar.weeks} weeks (any SAT / ACT / AP mix)`,
        `Effective rate of $${scholar.effectiveHourly}/hr — ${scholar.discountPct}% off pay-as-you-go`,
        "Full practice materials library",
        "Priority scheduling",
        "Consistent tutor assignment",
        "Pause once per term, no penalty",
      ],
      addons: ["Add Admissions counseling — quoted per case"],
      cta: "Choose Scholar",
      featured: true,
    },
    {
      id: "counseling",
      name: "Concierge",
      tagline: "College-focused",
      description: "Dedicated lead tutor + admissions counseling, scoped to your timeline. We quote after a free intake call.",
      features: [
        "Dedicated lead tutor + admissions counselor",
        "Essay review with line-level feedback",
        "School list strategy + activity review",
        "Interview prep with mock sessions",
        "Admissions materials library",
      ],
      addons: ["Pair with Scholar tutoring — combined quote"],
      cta: "Request a quote",
    },
  ];
}

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [annualPrepay, setAnnualPrepay] = useState(false);
  const [scholar, setScholar] = useState<Package>(eightWeekDefault);

  // Pull live pricing so admin edits in /admin/pricing reflect immediately.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.packages) return;
        const live = (d.packages as Package[]).find((p) => p.id === "two-month");
        if (live) setScholar(live);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const plans = useMemo(() => buildPlans(scholar), [scholar]);
  const monthlyPricing = useMemo(() => annualPrepayPricing(scholar), [scholar]);
  const revShare = useMemo(revenueShareCopy, []);

  async function startCheckout(plan: PlanType) {
    if (plan === "counseling") {
      router.push("/portal/messages?topic=admissions-quote");
      return;
    }
    setError(null);
    setLoadingPlan(plan);
    track(EVENTS.CHECKOUT_INITIATED, { plan, annualPrepay });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, annualPrepay }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        setLoadingPlan(null);
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
      } else {
        setError("No checkout URL returned");
        setLoadingPlan(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setLoadingPlan(null);
    }
  }

  function priceFor(plan: PlanType): { primary: string; secondary: string } {
    if (plan === "session") return { primary: `$${HOURLY_RATE}`, secondary: "/ hour" };
    if (plan === "counseling") return { primary: "Custom", secondary: "quoted per case" };
    if (annualPrepay) {
      return {
        primary: fmtUsdWhole(monthlyPricing.monthlyEquivalent),
        secondary: `/ month — ${ANNUAL_PREPAY_DISCOUNT_PCT}% off, billed yearly`,
      };
    }
    return { primary: fmtUsdWhole(scholar.totalPrice), secondary: `/ ${scholar.weeks} weeks` };
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent)] text-[12px] font-medium mb-5">
          <Lock size={11} />
          Access Required
        </div>
        <h1 className="text-[28px] font-bold text-[var(--text-1)] tracking-tight mb-3">
          Choose your plan to get started.
        </h1>
        <p className="text-[var(--text-2)] text-[15px] max-w-lg mx-auto leading-relaxed">
          All plans include direct access to your vetted matched tutor — no intermediaries, no
          shifting tutors mid-package. Payment is processed securely through Stripe.
        </p>

        {cancelled && (
          <p className="mt-4 text-[13px] text-[var(--text-2)]">
            Checkout was cancelled. Pick a plan to try again.
          </p>
        )}
        {error && <p className="mt-4 text-[13px] text-[var(--danger)]">{error}</p>}
      </div>

      {/* Annual prepay toggle */}
      <div className="mb-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-2)] border border-[var(--border)] p-1">
          <button
            type="button"
            onClick={() => setAnnualPrepay(false)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors",
              !annualPrepay ? "bg-[var(--surface)] text-[var(--text-1)]" : "text-[var(--text-2)]",
            )}
          >
            By cadence
          </button>
          <button
            type="button"
            onClick={() => setAnnualPrepay(true)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors",
              annualPrepay ? "bg-[var(--surface)] text-[var(--text-1)]" : "text-[var(--text-2)]",
            )}
          >
            Annual prepay <span className="ml-1 text-[var(--gold-soft)]">−{ANNUAL_PREPAY_DISCOUNT_PCT}%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => {
          const loading = loadingPlan === plan.id;
          const { primary, secondary } = priceFor(plan.id);
          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col",
                plan.featured
                  ? "bg-[var(--accent-dim)] border border-[var(--border-accent)] shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                  : "bg-[var(--surface)] border border-[var(--border)]",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--accent)] text-[var(--text-1)] text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <div className="mb-5">
                <p className="text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider mb-1">{plan.tagline}</p>
                <h2 className="text-[19px] font-bold text-[var(--text-1)] mb-3">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-[32px] font-bold text-[var(--text-1)]">{primary}</span>
                  <span className="text-[var(--text-3)] text-[13px]">{secondary}</span>
                </div>
                <p className="text-[var(--text-2)] text-[13px] leading-relaxed">{plan.description}</p>
                {plan.id === "monthly" && annualPrepay && (
                  <p className="text-[12px] text-[var(--gold-soft)] mt-3">
                    Save {fmtUsdWhole(monthlyPricing.annualGross - monthlyPricing.annualNet)} vs.
                    paying by cadence ({fmtUsdWhole(monthlyPricing.annualNet)} total).
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[var(--text-1)] text-[13px] leading-snug">{f}</span>
                  </li>
                ))}
                {plan.addons.map((a) => (
                  <li key={a} className="flex items-start gap-2.5">
                    <div className="w-[13px] h-[13px] rounded-full border border-[var(--border-accent)] bg-[var(--accent-dim)] flex items-center justify-center shrink-0 mt-0.5">
                      <Plus size={7} strokeWidth={3} className="text-[var(--accent)]" />
                    </div>
                    <span className="text-[var(--text-2)] text-[12px] leading-snug italic">{a}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.featured ? "primary" : "default"}
                loading={loading}
                onClick={() => startCheckout(plan.id)}
                className="w-full"
              >
                {loading ? "Redirecting…" : plan.cta} <ArrowRight size={14} />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Trust + revenue-share + gift card row */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Tooltip content="Tutors at Nyx keep the majority of the session rate. We keep enough to vet them, build the software, and run concierge support.">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 cursor-help w-full">
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={14} className="text-[var(--gold-soft)]" />
              <p className="text-[12.5px] font-semibold text-[var(--text-1)]">Tutors keep {revShare.tutorPct}%</p>
            </div>
            <p className="text-[11.5px] text-[var(--text-2)] leading-snug">{revShare.line}</p>
          </div>
        </Tooltip>
        <Link
          href="/portal/gift"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-accent)] transition-colors"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Gift size={14} className="text-[var(--accent)]" />
            <p className="text-[12.5px] font-semibold text-[var(--text-1)]">Send a Nyx gift card</p>
          </div>
          <p className="text-[11.5px] text-[var(--text-2)] leading-snug">
            $100–$2,500 — emailed to the recipient with a code redeemable at checkout.
          </p>
        </Link>
        <Link
          href="/portal/billing"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-accent)] transition-colors"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-[var(--accent-2)]" />
            <p className="text-[12.5px] font-semibold text-[var(--text-1)]">Manage existing plan</p>
          </div>
          <p className="text-[11.5px] text-[var(--text-2)] leading-snug">
            Update card, change plan, or pause through the Stripe customer portal.
          </p>
        </Link>
      </div>

      <div className="text-center">
        <p className="text-[var(--text-3)] text-[13px]">
          Already paid?{" "}
          <Link href="/portal/messages" className="text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors">
            Message us
          </Link>{" "}
          and your access will be activated within 24 hours.
        </p>
      </div>
    </div>
  );
}
