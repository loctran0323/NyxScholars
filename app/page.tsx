"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, Heading, Text, CTA, PhotoFrame, PlotEmbed, NyxMark,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: EASE },
  }),
};

const principles = [
  { n: "01", title: "Diagnose first.", body: "Thirty adaptive questions converge on a calibrated section score in under forty minutes — no guessing what to study." },
  { n: "02", title: "Practice the gaps.", body: "Each session targets the skills at the edge of your ability, not the ones you have already mastered." },
  { n: "03", title: "See the trajectory.", body: "Score curves, mastery heatmaps, time-to-target estimates — calibrated, not vibes." },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════════
         HERO — asymmetric, oversized italic display headline,
         photo offset behind glow, eyebrow drifts in from the side
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-[120px] md:pt-[160px] pb-32 md:pb-40">
        <Drift density="med" seed={11} />
        <BlobGlow position="top-right" color="gold" size="xl" intensity={0.16} />
        <BlobGlow position="bottom-left" color="moon" size="lg" intensity={0.10} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* left rail — eyebrow + headline + CTAs */}
            <div className="lg:col-span-7 relative">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-8 flex items-center gap-4"
              >
                <Eyebrow color="brass">Adaptive SAT prep · Calibrated by Ivy-tier students</Eyebrow>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
              >
                The SAT,<br />
                mapped to{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic font-normal text-gradient">your</span>{" "}
                <span className="relative inline-block">
                  gaps.
                  <SignatureLine width={260} className="absolute -bottom-3 left-0 hidden md:block" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                className="mt-10 max-w-[520px] text-[var(--text-2)] text-[18px] leading-[1.7]"
              >
                Nyx is an adaptive preparation system that learns where you struggle, hands you the
                exact questions that grow your score, and shows you the trajectory in real time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                <CTA href="/apply" size="lg">Take the free diagnostic</CTA>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] font-medium text-[15px] transition-colors"
                >
                  How it works
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* drifting micro-trust strip — one inline line, not a card grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-[var(--text-3)] text-[13px] font-mono uppercase tracking-[0.18em]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  Adaptive · IRT
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  Free diagnostic
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  Cancel anytime
                </span>
              </motion.div>
            </div>

            {/* right rail — offset photo + crescent overlay + drifting score callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
              className="lg:col-span-5 relative h-[440px] lg:h-[560px]"
            >
              {/* main hero photo — rotated slightly off-axis */}
              <div className="absolute inset-0 lg:right-[-40px] lg:left-[20px] rotate-[1.5deg]">
                <PhotoFrame
                  alt="Late-night study"
                  aspect="portrait"
                  rounded="lg"
                  seed="hero-primary"
                  className="h-full"
                />
              </div>

              {/* large floating crescent ornament behind */}
              <NyxMark
                size={200}
                showRing
                showStar
                className="absolute -top-10 -left-10 opacity-30 pointer-events-none"
              />

              {/* floating score-callout card */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                className="absolute -bottom-6 -left-4 lg:-left-12 z-10 bg-[var(--surface-elevated)]/95 backdrop-blur-md border border-[var(--border-2)] rounded-2xl px-6 py-5 shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
              >
                <p className="text-[var(--text-3)] text-[10px] font-mono uppercase tracking-[0.2em]">Diagnostic</p>
                <p className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] text-[44px] leading-none mt-1">
                  1,310<span className="text-[var(--text-3)] text-[18px]"> / 1600</span>
                </p>
                <p className="text-[var(--accent-2)] text-[12px] font-mono mt-2">+40 from last attempt</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* curved transition into manifesto */}
      <Arc direction="up" intensity="medium" />

      {/* ═══════════════════════════════════════════════════════════════
         MANIFESTO — pull-quote-led, no card around it.
         Oversized italic display, photo bleeds in from the right edge.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 bg-[var(--bg-2)] overflow-hidden">
        <Drift density="low" seed={3} className="opacity-50" />
        <BlobGlow position="top-left" color="gold" size="md" intensity={0.10} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
              custom={0} variants={fadeUp}
              className="lg:col-span-7 relative"
            >
              <Eyebrow color="brass" className="mb-8">Manifesto</Eyebrow>

              <blockquote className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] tracking-[-0.015em]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
              >
                Generic prep is recycled noise.{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic text-[var(--accent)]">
                  We built the prep we wished we&apos;d had.
                </span>
              </blockquote>

              <div className="mt-12 max-w-xl space-y-6 text-[var(--text-2)] text-[16px] leading-[1.8]">
                <p>
                  Most test prep is the same questions in a new wrapper, sold by tutors who took the
                  SAT a decade ago. The exam has changed. The bar has changed. The prep hasn&apos;t.
                </p>
                <p>
                  Nyx is built around one idea: the fastest way to a higher score is the question
                  you can&apos;t quite answer yet — delivered at the moment you&apos;re ready for it.
                </p>
              </div>

              <Link
                href="/sat-act"
                className="inline-flex items-center gap-2 mt-10 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[14px] font-medium transition-colors group"
              >
                Read the approach
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* photo bleeds out the right edge, tilted */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
              custom={1} variants={fadeUp}
              className="lg:col-span-5 relative h-[420px] lg:h-[600px] lg:-mr-12"
            >
              <div className="absolute inset-0 -rotate-[2deg]">
                <PhotoFrame alt="Study scene" aspect="portrait" rounded="lg" seed="manifesto" mask="bottom" className="h-full" />
              </div>
              {/* dotted index marker */}
              <div className="absolute top-8 -left-4 lg:-left-8 z-10">
                <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.22em]">01 / Why Nyx</span>
                <span className="block w-px h-16 bg-gradient-to-b from-[var(--accent)] to-transparent ml-3 mt-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Arc direction="down" intensity="subtle" />

      {/* ═══════════════════════════════════════════════════════════════
         TRAJECTORY — full-bleed plot with copy floating in negative space.
         No card wrapping the plot — let the gradient breathe.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <BlobGlow position="bottom-right" color="moon" size="lg" intensity={0.10} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
              custom={0} variants={fadeUp}
              className="lg:col-span-4 lg:sticky lg:top-32"
            >
              <span className="block font-mono text-[var(--accent)] text-[12px] uppercase tracking-[0.22em] mb-4">02 / Trajectory</span>
              <Heading level={2} className="mb-6">
                You&apos;ll see your score{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">move.</span>
              </Heading>
              <Text variant="body" className="mb-10">
                Every session updates a calibrated estimate of your ability.
                The trajectory plot shows you the path — and the time-to-target — without speculation.
              </Text>

              <ul className="space-y-7">
                {principles.map((p) => (
                  <li key={p.n} className="flex gap-5">
                    <span className="font-[family-name:var(--font-fraunces)] text-[var(--accent)] text-[28px] leading-none italic">
                      {p.n}
                    </span>
                    <span>
                      <span className="block text-[var(--text-1)] font-semibold mb-1.5 text-[16px]">{p.title}</span>
                      <span className="block text-[var(--text-2)] text-[14px] leading-[1.7]">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
              custom={1} variants={fadeUp}
              className="lg:col-span-8 relative"
            >
              {/* faint ambient ring behind the plot */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[40px] pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(232, 204, 126, 0.08), transparent 70%)",
                }}
              />
              <PlotEmbed
                caption="Score trajectory · sample student"
                source="Nyx adaptive engine"
                aspect="landscape"
                className="relative !rounded-[28px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" color="accent" />

      {/* ═══════════════════════════════════════════════════════════════
         FOUNDERS — magazine spread. Two large rotated photos behind
         oversized italic names; bios overlap the photo edges.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 bg-[var(--bg-2)] overflow-hidden">
        <Drift density="low" seed={42} className="opacity-40" />
        <BlobGlow position="top-right" color="gold" size="md" intensity={0.08} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20">
            <div>
              <Eyebrow color="moon" className="mb-5">The Founders</Eyebrow>
              <Heading level={2} className="max-w-2xl">
                Built by students who{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">just did it.</span>
              </Heading>
            </div>
            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[14px] font-medium transition-colors shrink-0"
            >
              Meet the founders
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* alternating spread */}
          <div className="space-y-24 md:space-y-32">
            {[
              { name: "Loc",     role: "Product · Curriculum",   school: "Princeton, Class of 2028", side: "left" as const,  seed: "loc",     line: "The fastest path to a higher score is the question you can almost answer." },
              { name: "Charles", role: "Engineering · Operations", school: "Princeton, Class of 2028", side: "right" as const, seed: "charles", line: "We owe students a real number, not a vibe." },
            ].map((f, i) => (
              <motion.div
                key={f.name}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
                custom={i} variants={fadeUp}
                className={`relative grid md:grid-cols-12 gap-8 md:gap-4 items-center ${f.side === "right" ? "md:[direction:rtl]" : ""}`}
              >
                {/* Photo, rotated, with brand crescent ornament behind */}
                <div className="md:col-span-7 md:[direction:ltr] relative h-[420px] md:h-[520px]">
                  <NyxMark
                    size={260}
                    showRing
                    className={`absolute ${f.side === "left" ? "-right-8 -top-8" : "-left-8 -top-8"} opacity-15 pointer-events-none`}
                  />
                  <div className={`absolute inset-0 ${f.side === "left" ? "rotate-[-2deg]" : "rotate-[2deg]"}`}>
                    <PhotoFrame
                      alt={f.name}
                      aspect="portrait"
                      rounded="lg"
                      seed={f.seed}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Text overlay — name in oversized Cormorant italic, bio bleeds onto photo */}
                <div className={`md:col-span-5 md:[direction:ltr] relative ${f.side === "left" ? "md:-ml-20" : "md:-mr-20"} z-10`}>
                  <div className="bg-[var(--surface-elevated)]/90 backdrop-blur-md border border-[var(--border-2)] rounded-[28px] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                    <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.22em] mb-2">
                      0{i + 1} / {f.role}
                    </span>
                    <h3
                      className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-none mb-4"
                      style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
                    >
                      {f.name}
                    </h3>
                    <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.16em] mb-6">{f.school}</p>
                    <p className="text-[var(--text-2)] text-[15px] leading-[1.8] mb-6">
                      Authored and calibrated questions for the Nyx bank. Mentors students one-on-one
                      in addition to platform sessions.
                    </p>
                    <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] text-[18px] leading-[1.5] border-l-2 border-[var(--accent)] pl-5">
                      &ldquo;{f.line}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="strong" color="accent" />

      {/* ═══════════════════════════════════════════════════════════════
         FINAL CTA — no card, large italic display, freestanding.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-36 md:py-48 overflow-hidden">
        <Drift density="high" seed={99} />
        <BlobGlow position="center" color="gold" size="xl" intensity={0.18} />

        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            custom={0} variants={fadeUp}
          >
            <NyxMark size={88} showRing className="mx-auto mb-10 opacity-90" />

            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-8 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Take the diagnostic.<br />
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Then decide.
              </span>
            </h2>

            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-xl mx-auto mb-12">
              Thirty adaptive questions. Forty minutes. A calibrated score and a real plan — at no cost.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href="/apply" size="lg">Start the diagnostic</CTA>
              <Link
                href="/pricing"
                className="group inline-flex items-center justify-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-7 py-4"
              >
                See plans
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="mt-12 text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.18em]">
              Nyx does not guarantee score increases or admissions outcomes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
