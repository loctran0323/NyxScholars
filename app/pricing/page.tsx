import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import PricingCard from "@/components/shared/PricingCard";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Flexible SAT, ACT, and AP tutoring pricing. Book a free consultation to discuss your needs.",
};

const plans = [
  {
    tier: "Starter",
    tagline: "Best for light support",
    description: "Ideal for students who want periodic guidance — a session to reinforce a concept or review a practice test.",
    features: ["1:1 tutoring sessions", "Flexible scheduling", "Session notes and follow-up", "No long-term commitment"],
    cta: "Ask About Pricing",
    ctaHref: "/apply",
    featured: false,
  },
  {
    tier: "Core Prep",
    tagline: "Best for SAT/ACT students",
    description: "A structured weekly cadence for students preparing for an upcoming exam who need a real plan.",
    features: ["Weekly 1:1 tutoring", "Diagnostic planning session", "Custom practice schedule", "Error log review", "Test strategy coaching"],
    cta: "Book Consultation",
    ctaHref: "/apply",
    featured: true,
  },
  {
    tier: "Intensive Prep",
    tagline: "Best for exam urgency",
    description: "For students with a near-term test date who need fast, concentrated improvement.",
    features: ["Multiple sessions per week", "Personalized study plan", "Daily practice guidance", "Score tracking & benchmarks", "Priority tutor availability"],
    cta: "Get Matched",
    ctaHref: "/apply",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-[68px]">

      {/* Header */}
      <section className="relative py-24 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.13) 0%, transparent 60%)" }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">Pricing</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-5">
            Plans built around your goals.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8] mb-6">
            We don&apos;t believe in packages that lock you in. Pricing is transparent, flexible, and discussed during your free consultation.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-[#0f1521] text-[#8d9ab0] text-[13px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]/60" />
            Pricing depends on subject, tutor, and prep intensity.
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24 px-5 sm:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => <PricingCard key={plan.tier} {...plan} />)}
        </div>
      </section>

      {/* Why no prices */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h3 className="text-[1.4rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Why we discuss pricing in consultation</h3>
          <p className="text-[#8d9ab0] leading-[1.8] text-[15px]">
            Tutoring isn&apos;t one-size-fits-all. A student with two months to exam day has different needs than
            one doing weekly AP support throughout a semester. We want to build a plan that fits your goals and budget — not sell you something you don&apos;t need.
          </p>
          <Link href="/apply" className="inline-flex items-center gap-2 mt-8 text-[#d4a853] font-medium text-[14px] hover:text-[#e8c46a] transition-colors">
            Talk to us about pricing <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-5 sm:px-8 max-w-3xl mx-auto">
        <h3 className="text-[1.2rem] font-bold text-[#f0ece3] mb-6 tracking-tight">Common pricing questions</h3>
        <div className="space-y-3.5">
          {[
            { q: "How much does tutoring cost?", a: "Pricing depends on subject, tutor, and prep intensity. Book a free consultation and we'll walk through options that fit your budget and goals." },
            { q: "Is there a minimum commitment?", a: "No. We can work session-by-session or on a regular schedule — whatever makes sense for your situation." },
            { q: "Can I change my plan?", a: "Yes. As your prep evolves, you can adjust session frequency and focus at any time." },
          ].map(({ q, a }) => (
            <div key={q} className="p-5 rounded-xl border border-white/[0.07] bg-[#0f1521]">
              <p className="text-[#f0ece3] font-semibold mb-2 text-[14.5px]">{q}</p>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5 bg-[#0b0f1a] border-t border-white/[0.05]">
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Start with a free conversation.</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">No commitment. We&apos;ll talk through your goals and put together a plan that fits.</p>
        <Link href="/apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5">
          Book Free Consultation <ArrowRight size={16} />
        </Link>
        <p className="mt-6 text-[#4e5d72] text-[12px]">Nyx Scholars does not guarantee test score increases or admissions outcomes.</p>
      </section>
    </div>
  );
}
