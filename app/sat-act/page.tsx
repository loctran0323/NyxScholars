"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgInkWash, BgConstellationGrid, BgOrbital, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SatActPage() {
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
            <Eyebrow color="brass" className="mb-6">SAT &amp; ACT</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.98] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.4rem)" }}
            >
              Adaptive prep,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">not a workbook.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Nyx prepares you for the SAT and ACT by modeling your ability and feeding you the
              questions that close your gaps — section by section, week by week.
            </p>
            <SignatureLine width={180} className="mt-10" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-28 md:py-36 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-2">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">01</span>
              <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em]">Diagnostic</span>
            </div>
            <div className="md:col-span-10">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-10 max-w-3xl"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.8rem)" }}
              >
                Forty minutes.{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">A real number.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl text-[var(--text-2)] text-[16px] leading-[1.8]">
                <p>
                  The diagnostic uses a calibrated item-response model. Thirty questions converge on
                  a section score with a published confidence interval.
                </p>
                <p>
                  No &quot;your level is intermediate.&quot; You see the score, the interval, and a
                  weekly forecast — measured against your target.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        <BgConstellationGrid />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(7,9,20,0.78) 0%, rgba(7,9,20,0.45) 35%, transparent 65%)" }}
        />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-[520px]"
          >
            <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-5">
              02 / Practice
            </span>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-7"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              Targeted,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">not random.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.8]">
              After the diagnostic, every practice question is chosen for difficulty just above
              your current ability and for the skill you most need. The boring middle is gone.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        <BgOrbital />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.85) 0%, rgba(7,9,20,0.55) 45%, transparent 75%)" }}
        />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-[500px]"
          >
            <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-5">
              03 / Review
            </span>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-7"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              Read the report.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Don&apos;t guess.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.8]">
              The weekly study report names the three skills holding your score back, the time
              you spent on each, and what to work on next. Short, specific, updated automatically.
            </p>
          </motion.div>
        </div>
      </section>

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
              <span className="font-[family-name:var(--font-cormorant)] italic">diagnostic.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Forty minutes. Free. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/apply" size="lg">Take the diagnostic</CTA>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                See plans
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
