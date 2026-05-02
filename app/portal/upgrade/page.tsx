"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
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
    addons: [] as string[],
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
    price: "$449",
    per: "/ month",
    tagline: "College-focused",
    description: "4 monthly meetings focused on getting into your top schools — essays, strategy, and more.",
    features: [
      "4 college counseling sessions/month",
      "Essay review with line-level feedback",
      "School list strategy + activity review",
      "Interview prep with mock sessions",
      "Admissions materials library",
    ],
    addons: ["Add Academic Tutoring — +$200/mo ($649 total)"],
    cta: "Choose Admissions",
    featured: false,
  },
];

export default function UpgradePage() {
  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[12px] font-medium mb-5">
          <Lock size={11} />
          Access Required
        </div>
        <h1 className="text-[28px] font-bold text-[var(--text-1)] tracking-tight mb-3">
          Choose your plan to get started.
        </h1>
        <p className="text-[var(--text-2)] text-[15px] max-w-lg mx-auto leading-relaxed">
          All plans include direct access to Loc and Charles — no intermediaries, no matching algorithms.
          Book a free call and we&apos;ll activate your access within 24 hours of payment.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative rounded-2xl p-6 flex flex-col",
              plan.featured
                ? "bg-[var(--accent)]/[0.06] border border-[var(--border-accent)]"
                : "bg-[var(--surface)] border border-[var(--border)]"
            )}
            style={plan.featured ? { boxShadow: "0 0 0 1px rgba(212,168,83,0.15), 0 16px 48px rgba(0,0,0,0.4)" } : {}}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--accent)] text-black text-[11px] font-bold whitespace-nowrap">
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
                      <div className="w-[13px] h-[13px] rounded-full border border-[var(--border-accent)] bg-[var(--accent)]/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                        <Plus size={7} strokeWidth={3} className="text-[var(--accent)]" />
                      </div>
                      <span className="text-[var(--text-2)] text-[12px] leading-snug italic">{a}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>

            <Link
              href={`/apply?plan=${plan.id}`}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all",
                plan.featured
                  ? "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black hover:from-[#e2c685] hover:to-[#cba961] shadow-lg shadow-[var(--accent-dim)]"
                  : "bg-white/[0.06] border border-white/[0.1] text-[var(--text-1)] hover:border-[var(--border-2)] hover:text-[var(--text-1)]"
              )}
            >
              {plan.cta} <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* Already paid note */}
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
