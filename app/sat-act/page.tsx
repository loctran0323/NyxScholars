"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { AdaptiveDemo } from "@/components/demos/AdaptiveDemo";
import { MiniSky } from "@/components/demos/MiniSky";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowItWorksPage() {
  return (
    <div className="relative">

      {/* HERO */}
      <section className="relative pt-[120px] md:pt-[160px] pb-20 overflow-hidden">
        <BgShootingStars />
        <BgFade top={false} bottom height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 35%, rgba(7,9,20,0.9) 100%)" }}
        />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow color="brass" className="mb-6">How it works</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)" }}
            >
              From signup to first session{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">in 48 hours.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Three things make Nyx work: a 12-minute adaptive intake, a tutor you actually click
              with, and a shared map between you that updates each session.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </motion.div>
        </div>
      </section>

      {/* STEP 01 — INTAKE + LIVE ADAPTIVE DEMO */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 mb-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-2">01</p>
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Intake</p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Eight adaptive questions{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">that get smarter as you answer.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">
                Each question is chosen for the edge of what you know — so we converge on a
                calibrated estimate fast. No 60-question diagnostic, no wasted time on questions
                you&rsquo;d ace or the ones way above your range. Try it below — every answer moves
                the model in real time.
              </p>
            </div>
          </div>

          {/* Live adaptive demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-[820px]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "#7dd3fc" }}>
              ↓ Try it
            </p>
            <AdaptiveDemo />
            <p className="text-[12px] text-[var(--text-3)] mt-4 leading-[1.6] max-w-xl">
              The model updates after every response. The real intake is 8 questions; this is 2.
              Your tutor sees the resulting skill summary before your first session — so they
              don&rsquo;t spend it diagnosing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STEP 02 — MATCH */}
      <section className="relative py-24 md:py-28 overflow-hidden border-t border-[var(--border)]">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 mb-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-2">02</p>
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Match</p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                You&rsquo;re matched to{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">whoever covers your gaps.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-7">
                The intake tells us where you struggle; we shortlist the vetted tutor whose
                specialties best cover those skills and whose schedule fits yours. You meet them in
                the free trial.
              </p>
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                See the vetting process
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 03 — TRIAL */}
      <section className="relative py-24 md:py-28 overflow-hidden bg-[var(--bg-2)]">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-2">03</p>
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Trial</p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Thirty minutes,{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">free.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">
                Meet your tutor over video. Drill a real problem together. Decide if it&rsquo;s the
                right fit. No card on file, no awkward upsell — if it isn&rsquo;t a fit we&rsquo;ll
                re-match you, and if Nyx isn&rsquo;t for you, we&rsquo;ll say so.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 04 — SESSIONS + LIVE SKY DEMO */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10 mb-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-2">04</p>
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Your sky</p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                One shared map.{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">You and your tutor see the same stars.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">
                Every SAT skill is a star in one of six constellations. When your tutor marks a
                skill covered or drilled, that star brightens. Both of you know what&rsquo;s next
                without re-asking. The map below is real — drag your cursor over the stars.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] mb-3" style={{ color: "#7dd3fc" }}>
              ↓ Hover any star
            </p>
            <MiniSky />
            <p className="text-[12px] text-[var(--text-3)] mt-4 leading-[1.6] max-w-2xl">
              This shows one of six constellations (Algebra · The Lyre). The full sky has 29
              skill-stars. As your mastery grows, stars move from Dormant → Kindled → Burning →
              Radiant. No XP, no badges — just an honest picture of where you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STEP 05 — PRICING */}
      <section className="relative py-24 md:py-28 overflow-hidden border-t border-[var(--border)]">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-x-12 gap-y-10">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-2">05</p>
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Pay</p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                $160/hour, or{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">commit and pay less.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-7">
                Pay-as-you-go is $160/hr. Commit to a weekly cadence — two hours a week for four,
                eight, or twelve weeks — and pay $150, $140, or $130 per hour respectively. No
                bundles, no surprise charges.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                See packages
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-16">
          <div className="max-w-xl">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-6 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Ready to start?
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-9 max-w-md">
              Twelve minutes for the intake. Free trial after that.
            </p>
            <CTA href="/match" size="lg">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
