"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, Heading, Text, CTA, PhotoFrame, PlotEmbed,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sections = [
  {
    n: "01",
    label: "Diagnostic",
    title: "Forty minutes.",
    titleItalic: "A real number.",
    body: "The diagnostic uses a calibrated item-response model. Thirty questions converge on a section score with a published confidence interval — no \"your level is intermediate.\"",
    seed: "diagnostic",
    side: "right" as "left" | "right",
    visual: "photo" as const,
  },
  {
    n: "02",
    label: "Practice",
    title: "Targeted,",
    titleItalic: "not random.",
    body: "After the diagnostic, every practice question is selected for difficulty just above your current ability and for the skill you most need. The boring middle is gone.",
    side: "left" as "left" | "right",
    visual: "plot" as const,
  },
  {
    n: "03",
    label: "Review",
    title: "Read the report.",
    titleItalic: "Don't guess.",
    body: "The weekly study report names the three skills holding your score back, the time you spent on each, and what to work on next. Short, specific, updated automatically.",
    seed: "review",
    side: "right" as "left" | "right",
    visual: "photo" as const,
  },
];

export default function SatActPage() {
  return (
    <div className="relative overflow-hidden">

      {/* HERO */}
      <section className="relative pt-[120px] md:pt-[160px] pb-28 md:pb-36">
        <Drift density="med" seed={5} />
        <BlobGlow position="top-right" color="gold" size="xl" intensity={0.14} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow color="brass" className="mb-6">SAT &amp; ACT</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
            >
              Adaptive prep,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">not a workbook.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[19px] leading-[1.7] max-w-2xl">
              Nyx prepares you for the SAT and ACT by modeling your ability and feeding you the exact
              questions that close your gaps — section by section, week by week.
            </p>
            <SignatureLine width={180} className="mt-10" />
          </motion.div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" />

      {/* THREE FLOWING SECTIONS — alternating sides, no rectangular cards */}
      {sections.map((s, i) => (
        <section
          key={s.n}
          className={`relative py-24 md:py-32 ${i % 2 === 1 ? "bg-[var(--bg-2)]" : ""} overflow-hidden`}
        >
          <Drift density="low" seed={i * 13 + 7} className="opacity-40" />
          {i % 2 === 0 ? (
            <BlobGlow position="top-right" color="gold" size="md" intensity={0.10} />
          ) : (
            <BlobGlow position="top-left" color="moon" size="md" intensity={0.10} />
          )}

          <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-center ${s.side === "right" ? "lg:[direction:rtl]" : ""}`}
            >

              {/* Visual side */}
              <div className={`lg:col-span-7 lg:[direction:ltr] relative ${s.visual === "photo" ? "h-[420px] lg:h-[540px]" : ""}`}>
                {s.visual === "photo" ? (
                  <div className={`absolute inset-0 ${s.side === "left" ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"}`}>
                    <PhotoFrame
                      alt={s.label}
                      aspect="landscape"
                      rounded="lg"
                      seed={s.seed}
                      className="h-full"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      aria-hidden
                      className="absolute -inset-6 rounded-[40px] pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(125, 211, 252, 0.10), transparent 70%)",
                      }}
                    />
                    <PlotEmbed
                      caption="Skill mastery · four weeks"
                      source="Nyx engine"
                      aspect="landscape"
                      className="relative !rounded-[28px]"
                    />
                  </div>
                )}
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 lg:[direction:ltr] relative">
                <span className="block font-mono text-[var(--accent)] text-[12px] uppercase tracking-[0.22em] mb-5">
                  {s.n} / {s.label}
                </span>
                <h2
                  className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] mb-8"
                  style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)" }}
                >
                  {s.title}{" "}
                  <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                    {s.titleItalic}
                  </span>
                </h2>
                <Text variant="body" className="text-[16px] leading-[1.8]">{s.body}</Text>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <Arc direction="up" intensity="strong" color="accent" />

      {/* CTA — freestanding, no card */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <Drift density="high" seed={88} />
        <BlobGlow position="center" color="gold" size="xl" intensity={0.16} />

        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-8 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Start with the{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">diagnostic.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] mb-10">
              Forty minutes. Free. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href="/apply" size="lg">Take the diagnostic</CTA>
              <Link
                href="/pricing"
                className="group inline-flex items-center justify-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium px-6 py-4 transition-colors"
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
