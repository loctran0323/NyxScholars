"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Lock } from "lucide-react";
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
      "Optional add-on: College Counseling +$150/mo",
    ],
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
      "Optional add-on: Academic tutoring +$200/mo",
    ],
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
        <h1 className="text-[28px] font-bold text-[#f0ece3] tracking-tight mb-3">
          Choose your plan to get started.
        </h1>
        <p className="text-[#8d9ab0] text-[15px] max-w-lg mx-auto leading-relaxed">
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
                ? "bg-[#d4a853]/[0.06] border border-[#d4a853]/30"
                : "bg-[#0f1521] border border-white/[0.07]"
            )}
            style={plan.featured ? { boxShadow: "0 0 0 1px rgba(212,168,83,0.15), 0 16px 48px rgba(0,0,0,0.4)" } : {}}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#d4a853] text-black text-[11px] font-bold whitespace-nowrap">
                Most Popular
              </span>
            )}

            <div className="mb-5">
              <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-wider mb-1">{plan.tagline}</p>
              <h2 className="text-[19px] font-bold text-[#f0ece3] mb-3">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[32px] font-bold text-[#f0ece3]">{plan.price}</span>
                <span className="text-[#4e5d72] text-[14px]">{plan.per}</span>
              </div>
              <p className="text-[#8d9ab0] text-[13px] leading-relaxed">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckCircle2 size={13} className="text-[#d4a853] shrink-0 mt-0.5" />
                  <span className="text-[#c8d0de] text-[13px] leading-snug">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/apply?plan=${plan.id}`}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all",
                plan.featured
                  ? "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/20"
                  : "bg-white/[0.06] border border-white/[0.1] text-[#c8d0de] hover:border-white/[0.18] hover:text-[#f0ece3]"
              )}
            >
              {plan.cta} <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* Already paid note */}
      <div className="text-center">
        <p className="text-[#4e5d72] text-[13px]">
          Already paid?{" "}
          <Link href="/portal/messages" className="text-[#d4a853] hover:text-[#e8c46a] transition-colors">
            Message us
          </Link>{" "}
          and your access will be activated within 24 hours.
        </p>
      </div>
    </div>
  );
}
