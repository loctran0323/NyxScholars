"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CTA,
  BgShootingStars, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { JourneyDemo } from "@/components/demos/JourneyDemo";
import { HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HomePage() {
  return (
    <div className="relative">

      {/* HERO */}
      <section className="relative pt-[140px] md:pt-[180px] pb-20 md:pb-28 overflow-hidden">
        <BgShootingStars />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(7,9,20,0.55) 0%, rgba(7,9,20,0.2) 40%, rgba(7,9,20,0.75) 100%)" }}
        />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.96] tracking-[-0.02em] max-w-4xl"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.8rem)" }}
          >
            1:1 SAT tutoring,{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic font-normal text-gradient">
              honestly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-8 max-w-[560px] text-[var(--text-2)] text-[18px] leading-[1.7]"
          >
            Online sessions with vetted Princeton-tier undergrads. ${HOURLY_RATE_USD}/hr.
            Free 30-minute trial — no card.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <CTA href="/match" size="lg">Get matched in 12 minutes</CTA>
            <Link
              href="#how"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] font-medium text-[15px] transition-colors"
            >
              See how it works
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <SignatureLine width={180} className="mt-12" />
        </div>
      </section>

      {/* THE DEMO — Maya's 90 days */}
      <section id="how" className="relative py-16 md:py-24 overflow-hidden">
        <BgInkWash />
        <BgFade height={96} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-3">
              How it works · scrub the timeline
            </p>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              Ninety days.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">From 1180 to 1520.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[15.5px] leading-[1.7] mt-5 max-w-2xl">
              Every SAT skill is a star. Each session lights one. Below is one student&apos;s
              actual arc — scrub the timeline, click any star to see the questions she answered.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <JourneyDemo />
          </motion.div>
        </div>
      </section>

      {/* VETTING + PRICING — single condensed strip */}
      <section className="relative py-24 md:py-32 border-t border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-x-16 gap-y-12">

          <div>
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-4">Vetting</p>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] mb-6"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              Tutors,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">vetted four ways.</span>
            </h3>
            <ol className="space-y-3 text-[var(--text-2)] text-[15px] leading-[1.7]">
              <li><span className="text-[var(--text-1)]">Verified 1500+ digital SAT.</span> No exceptions.</li>
              <li><span className="text-[var(--text-1)]">Currently enrolled.</span> Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer.</li>
              <li><span className="text-[var(--text-1)]">Teaching audition.</span> 30-minute mock with the founders.</li>
              <li><span className="text-[var(--text-1)]">Trial cohort.</span> Founder shadowing on the first session.</li>
            </ol>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 mt-7 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
            >
              The full vetting process
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div>
            <p className="font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-4">Pricing</p>
            <h3
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] mb-6"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              ${HOURLY_RATE_USD}/hr.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Or commit and pay less.</span>
            </h3>
            <dl className="space-y-2 text-[var(--text-2)] text-[15px]">
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--border)]/60">
                <dt>Pay-as-you-go</dt>
                <dd className="font-mono text-[var(--text-1)]">${HOURLY_RATE_USD} / hr</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--border)]/60">
                <dt>4-week cadence (8 hrs)</dt>
                <dd className="font-mono text-[var(--text-1)]">$150 / hr</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--border)]/60">
                <dt>8-week cadence (16 hrs)</dt>
                <dd className="font-mono text-[var(--text-1)]">$140 / hr</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--border)]/60">
                <dt>12-week cadence (24 hrs)</dt>
                <dd className="font-mono text-[var(--text-1)]">$130 / hr</dd>
              </div>
              <div className="flex justify-between gap-4 py-2 border-b border-[var(--border)]/60">
                <dt>Free trial</dt>
                <dd className="font-mono text-[#7dd3fc]">$0</dd>
              </div>
            </dl>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 mt-7 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
            >
              Pricing details
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 65%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-16">
          <div className="max-w-xl">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-6 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
            >
              Take the trial.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Decide after.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-9 max-w-md">
              Twelve-minute intake. Free 30-minute session with your matched tutor. No card.
            </p>
            <CTA href="/match" size="lg">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
