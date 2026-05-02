import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PricingCard from "@/components/shared/PricingCard";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for SAT, ACT, AP tutoring, and college admissions consulting.",
};

const plans = [
  {
    tier: "Session",
    tagline: "Pay per session",
    price: "$100",
    priceNote: "/ hr",
    description: "Book individual sessions when you need them. Best for students who want targeted help without a recurring commitment.",
    features: [
      "1-on-1 sessions with a Princeton tutor",
      "One subject area (SAT, ACT, AP, or Admissions)",
      "Flexible scheduling — book as needed",
      "Session recap & follow-up notes",
      "Portal access: sessions & messaging",
    ],
    addons: [] as string[],
    cta: "Get Started",
    ctaHref: "/apply?plan=session",
    featured: false,
  },
  {
    tier: "Scholar Monthly",
    tagline: "Best for consistent prep",
    price: "$350",
    priceNote: "/ mo",
    description: "Four tutoring sessions per month with full flexibility across SAT, ACT, and AP subjects. The plan serious students choose.",
    features: [
      "4 sessions per month (60 min each)",
      "Any subject: SAT, ACT, or AP courses",
      "Diagnostic + personalized prep plan",
      "Custom practice schedule & error log review",
      "Full portal access: sessions, materials & messaging",
      "Extra sessions at $85/hr when you need more",
    ],
    addons: ["Add College Counseling — +$150/mo ($499 total)"],
    cta: "Start Scholar Plan",
    ctaHref: "/apply?plan=monthly",
    featured: true,
  },
  {
    tier: "Admissions Monthly",
    tagline: "College counseling",
    price: "$449",
    priceNote: "/ mo",
    description: "Four dedicated counseling meetings per month covering essays, school list, activities, and full application strategy.",
    features: [
      "4 counseling sessions per month",
      "Essay brainstorming & review",
      "School list & fit strategy",
      "Activity list refinement",
      "Interview preparation",
      "Full portal access: sessions, materials & messaging",
    ],
    addons: ["Add Academic Tutoring — +$200/mo ($649 total)"],
    cta: "Start Admissions Plan",
    ctaHref: "/apply?plan=counseling",
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
            Straightforward plans. No surprises.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8] mb-6">
            Every plan is built around your goals — not locked into a rigid package. Book a free consultation to figure out what fits.
          </p>
        </div>
      </section>

      {/* Main plans */}
      <section className="pb-24 px-5 sm:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => <PricingCard key={plan.tier} {...plan} />)}
        </div>
      </section>

      {/* Extra sessions note */}
      <section className="py-16 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">Scholar Monthly Members</p>
          <h3 className="text-[1.4rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Used all your sessions? Book more at a discount.</h3>
          <p className="text-[#8d9ab0] leading-[1.8] text-[15px]">
            Scholar Monthly subscribers who need additional sessions beyond their 4/month can book extras at{" "}
            <span className="text-[#f0ece3] font-semibold">$85/hr</span> — a 15% discount off the standard session rate. No hoops, just message us or book directly through the portal.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-5 sm:px-8 max-w-3xl mx-auto">
        <h3 className="text-[1.2rem] font-bold text-[#f0ece3] mb-6 tracking-tight">Common questions</h3>
        <div className="space-y-3.5">
          {[
            { q: "How do I get started?", a: "Fill out our application form — it takes about 2 minutes. We'll reach out within 24 hours to confirm your plan and handle payment (Venmo or bank transfer)." },
            { q: "When does my portal activate?", a: "We manually activate your portal within 24 hours of confirmed payment. You'll get an email with your login link." },
            { q: "Can I switch plans?", a: "Yes. Message us at any point to upgrade, add the counseling add-on, or adjust your plan." },
            { q: "What if I need more than 4 sessions in a month?", a: "Scholar Monthly members can book extra sessions at $85/hr — 15% off the standard rate. Just request it through the portal." },
            { q: "Is there a long-term commitment?", a: "Monthly plans are billed month-to-month. Cancel or pause at any time — just let us know before your next billing date." },
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
