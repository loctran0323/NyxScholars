"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, UserCheck, Calendar, MessageSquare, BarChart3 } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgInkWash, BgConstellationGrid, BgOrbital, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  {
    n: "01", icon: Sparkles,
    label: "Intake",
    title: "Eight questions.",
    titleItalic: "Twelve minutes.",
    body: "We ask a short adaptive set so we know your actual baseline — not a self-reported one. Your matched tutor receives a privacy-aware summary, so your first session doesn't begin with another diagnostic.",
    cta: { label: "Take the intake", href: "/portal/diagnostic" },
  },
  {
    n: "02", icon: UserCheck,
    label: "Match",
    title: "We pick three.",
    titleItalic: "You pick one.",
    body: "Our matchmaker shortlists three Ivy tutors whose specialties cover your gaps, schedules align with yours, and styles fit how you like to learn. You meet them in your trial session.",
    cta: { label: "Browse the roster", href: "/tutors" },
  },
  {
    n: "03", icon: Calendar,
    label: "Trial",
    title: "Free first session.",
    titleItalic: "30 minutes.",
    body: "Meet your tutor over video. Drill a real problem together, ask anything, and decide if it's the right fit — at no cost. If it isn't, we re-match. No card on file, no awkward upsell.",
    cta: { label: "Book free trial", href: "/apply" },
  },
  {
    n: "04", icon: MessageSquare,
    label: "Sessions",
    title: "Pay by the session.",
    titleItalic: "Cancel any time.",
    body: "After the trial, sessions are $110–$130/hr depending on the tutor. Book one or twelve. Bundle for a discount or stay flexible — both work. Your tutor sets your assignments and updates your sky after every meeting.",
    cta: { label: "See packages", href: "/pricing" },
  },
  {
    n: "05", icon: BarChart3,
    label: "Sky",
    title: "Track your stars.",
    titleItalic: "Watch them ignite.",
    body: "Every session lights skills on your shared sky — six constellations covering all the SAT skills. You and your tutor see the same map; you both know what's next. Your projected score updates each week.",
    cta: { label: "See an example sky", href: "/portal/consultation" },
  },
];

export default function HowItWorksPage() {
  return (
    <div className="relative">

      <section className="relative min-h-[640px] flex items-end overflow-hidden pt-[100px] md:pt-0">
        <BgShootingStars />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(7,9,20,0.85) 80%, var(--bg) 100%)" }}
        />

        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow color="brass" className="mb-6">How it works</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.98] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.4rem)" }}
            >
              From signup to first session{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">in 48 hours.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Five steps. The first three are free. After that you only pay for the sessions you book.
            </p>
            <SignatureLine width={180} className="mt-10" />
          </motion.div>
        </div>
      </section>

      {/* Five-step long-form */}
      {steps.map((s, i) => {
        const Bg = i === 0 ? BgInkWash : i === 1 ? BgConstellationGrid : i === 2 ? BgInkWash : i === 3 ? BgOrbital : BgConstellationGrid;
        return (
          <section
            key={s.n}
            className="relative py-24 md:py-28 overflow-hidden"
          >
            <Bg />
            <BgFade height={120} />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, rgba(7,9,20,0.78) 0%, rgba(7,9,20,0.45) 35%, transparent 65%)"
                    : "linear-gradient(225deg, rgba(7,9,20,0.78) 0%, rgba(7,9,20,0.45) 35%, transparent 65%)",
              }}
            />
            <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: EASE }}
                className={`grid md:grid-cols-12 gap-8 md:gap-12 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              >
                <div className="md:col-span-2 md:[direction:ltr]">
                  <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-3">
                    {s.n}
                  </span>
                  <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-6">
                    {s.label}
                  </span>
                  <s.icon size={24} className="text-[#7dd3fc]" />
                </div>
                <div className="md:col-span-10 md:[direction:ltr]">
                  <h2
                    className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-7"
                    style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}
                  >
                    {s.title}{" "}
                    <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                      {s.titleItalic}
                    </span>
                  </h2>
                  <p className="text-[var(--text-2)] text-[16.5px] leading-[1.8] max-w-2xl mb-8">{s.body}</p>
                  <Link
                    href={s.cta.href}
                    className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
                  >
                    {s.cta.label}
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl"
          >
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-8 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Start with the{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">trial.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Thirty minutes with a vetted Ivy tutor. No card. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/apply" size="lg">Book free trial</CTA>
              <Link
                href="/tutors"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                Browse tutors
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
