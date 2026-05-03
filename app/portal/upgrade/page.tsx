"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/types/portal";

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  per: string;
  tagline: string;
  description: string;
  features: string[];
  addons: string[];
  cta: string;
  featured: boolean;
}

const plans: Plan[] = [
  {
    id: "session",
    name: "Session",
    price: "$100",
    per: "/ hr",
    tagline: "Pay as you go",
    description: "Book individual sessions when you need them. One subject category per enrollment.",
    features: [
      "1:1 sessions with a Princeton founder",
      "One subject focus (SAT, ACT, AP, or Admissions)",
      "Portal: upcoming sessions + messaging",
      "Subject-specific study resources",
      "No commitment",
    ],
    addons: [],
    cta: "Get Started",
    featured: false,
  },
  {
    id: "monthly",
    name: "Scholar",
    price: "$350",
    per: "/ month",
    tagline: "Most popular",
    description: "4 sessions/month with full subject flexibility. Switch between SAT, ACT, and AP freely.",
    features: [
      "4 sessions/month (any SAT / ACT / AP mix)",
      "Full practice materials library",
      "Priority scheduling",
      "Consistent founder assignment",
      "Sessions + messaging + materials portal",
      "Extra sessions at $85/hr when you need more",
    ],
    addons: ["Add College Counseling — +$150/mo ($499 total)"],
    cta: "Choose Scholar",
    featured: true,
  },
  {
    id: "counseling",
    name: "Admissions",
    price: "Custom",
    per: "quoted per case",
    tagline: "College-focused",
    description: "Pricing is determined per student based on year, school list size, and scope. We'll quote after a free intake call.",
    features: [
      "College counseling tailored to your timeline",
      "Essay review with line-level feedback",
      "School list strategy + activity review",
      "Interview prep with mock sessions",
      "Admissions materials library",
    ],
    addons: ["Pair with Scholar tutoring — combined quote"],
    cta: "Request a quote",
    featured: false,
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "1";
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: PlanType) {
    // Admissions is custom-priced — route to messaging instead of Stripe.
    if (plan === "counseling") {
      router.push("/portal/messages?topic=admissions-quote");
      return;
    }
    setError(null);
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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

  return (
    <div className="max-w-5xl mx-auto py-4">
      <div className="text-center mb-12">
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
        {error && (
          <p className="mt-4 text-[13px] text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => {
          const loading = loadingPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col",
                plan.featured
                  ? "bg-[var(--accent-dim)] border border-[var(--border-accent)]"
                  : "bg-[var(--surface)] border border-[var(--border)]"
              )}
              style={plan.featured ? { boxShadow: "0 16px 48px rgba(0,0,0,0.45)" } : {}}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[11px] font-bold whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <div className="mb-5">
                <p className="text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider mb-1">{plan.tagline}</p>
                <h2 className="text-[19px] font-bold text-[var(--text-1)] mb-3">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-[32px] font-bold text-[var(--text-1)]">{plan.price}</span>
                  <span className="text-[var(--text-3)] text-[14px]">{plan.per}</span>
                </div>
                <p className="text-[var(--text-2)] text-[13px] leading-relaxed">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span className="text-[var(--text-1)] text-[13px] leading-snug">{f}</span>
                  </li>
                ))}
                {plan.addons.length > 0 && (
                  <>
                    <li><div className="border-t border-[var(--border)] my-1" /></li>
                    {plan.addons.map((a) => (
                      <li key={a} className="flex items-start gap-2.5">
                        <div className="w-[13px] h-[13px] rounded-full border border-[var(--border-accent)] bg-[var(--accent-dim)] flex items-center justify-center shrink-0 mt-0.5">
                          <Plus size={7} strokeWidth={3} className="text-[var(--accent)]" />
                        </div>
                        <span className="text-[var(--text-2)] text-[12px] leading-snug italic">{a}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>

              <button
                onClick={() => startCheckout(plan.id)}
                disabled={loading}
                className={cn(
                  "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-60 disabled:cursor-wait",
                  plan.featured
                    ? "bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)]"
                    : "bg-white/[0.06] border border-white/[0.1] text-[var(--text-1)] hover:border-[var(--border-2)]"
                )}
              >
                {loading ? "Redirecting…" : plan.cta} {!loading && <ArrowRight size={13} />}
              </button>
            </div>
          );
        })}
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
