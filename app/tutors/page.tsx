"use client";

import { motion } from "framer-motion";
import {
  Eyebrow, Heading, Text, CTA, PhotoFrame, NyxMark,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const founders = [
  {
    name: "Loc",
    role: "Co-founder · Product & Curriculum",
    school: "Princeton, Class of 2028",
    seed: "loc-spread",
    bio: "Loc designs the adaptive engine and authors much of the SAT bank. He recently scored in the 99th percentile on the digital SAT and has tutored over 50 students one-on-one through the redesigned exam.",
    quote: "The fastest path to a higher score is the question you can almost answer.",
  },
  {
    name: "Charles",
    role: "Co-founder · Engineering & Operations",
    school: "Princeton, Class of 2028",
    seed: "charles-spread",
    bio: "Charles built the Nyx platform end to end and runs ops. Princeton class of 2028, he handles the engineering side of every adaptive feature — from IRT calibration to the dashboard you read each week.",
    quote: "We owe students a number, not a vibe.",
  },
];

export default function FoundersPage() {
  return (
    <div className="relative overflow-hidden">

      {/* HERO */}
      <section className="relative pt-[120px] md:pt-[160px] pb-28 md:pb-32">
        <Drift density="med" seed={17} />
        <BlobGlow position="top-right" color="gold" size="xl" intensity={0.14} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow color="brass" className="mb-6">The Founders</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
            >
              Two students.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                One product they wished they&apos;d had.
              </span>
            </h1>
            <Text variant="lead" className="max-w-2xl">
              Nyx was built by Loc and Charles — Princeton classmates who started where you are
              and built the prep platform they wanted.
            </Text>
            <SignatureLine width={180} className="mt-10" />
          </motion.div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" />

      {/* MAGAZINE SPREAD — alternating sides, large rotated photos, oversized italic names */}
      {founders.map((f, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        return (
          <section
            key={f.name}
            className={`relative py-28 md:py-36 ${i % 2 === 1 ? "bg-[var(--bg-2)]" : ""} overflow-hidden`}
          >
            <Drift density="low" seed={i * 31 + 4} className="opacity-40" />
            <BlobGlow
              position={side === "left" ? "top-right" : "top-left"}
              color={i === 1 ? "moon" : "gold"}
              size="md"
              intensity={0.10}
            />

            <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={`relative grid lg:grid-cols-12 gap-8 items-center ${side === "right" ? "lg:[direction:rtl]" : ""}`}
              >
                {/* Photo with brand crescent ornament */}
                <div className="lg:col-span-7 lg:[direction:ltr] relative h-[480px] lg:h-[640px]">
                  <NyxMark
                    size={300}
                    showRing
                    className={`absolute ${side === "left" ? "-right-12 -top-12" : "-left-12 -top-12"} opacity-15 pointer-events-none`}
                  />
                  <div className={`absolute inset-0 ${side === "left" ? "rotate-[-2.5deg]" : "rotate-[2.5deg]"}`}>
                    <PhotoFrame
                      alt={f.name}
                      aspect="portrait"
                      rounded="lg"
                      seed={f.seed}
                      className="h-full"
                    />
                  </div>
                  {/* index marker */}
                  <div className={`absolute ${side === "left" ? "-left-2 lg:-left-6" : "-right-2 lg:-right-6"} top-12 z-10`}>
                    <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.22em]">
                      0{i + 1} / Founder
                    </span>
                    <span className="block w-px h-20 bg-gradient-to-b from-[var(--accent)] to-transparent mt-3 ml-2" />
                  </div>
                </div>

                {/* Text overlapping the photo edge */}
                <div className={`lg:col-span-5 lg:[direction:ltr] relative ${side === "left" ? "lg:-ml-24" : "lg:-mr-24"} z-10`}>
                  <div className="bg-[var(--surface-elevated)]/92 backdrop-blur-md border border-[var(--border-2)] rounded-[28px] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
                    <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.22em] mb-3">{f.role}</p>
                    <h2
                      className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-none mb-4"
                      style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)" }}
                    >
                      {f.name}
                    </h2>
                    <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.16em] mb-6">{f.school}</p>
                    <p className="text-[var(--text-2)] text-[15px] leading-[1.8] mb-7">{f.bio}</p>
                    <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] text-[18px] leading-[1.5] border-l-2 border-[var(--accent)] pl-5">
                      &ldquo;{f.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      <Arc direction="up" intensity="strong" color="accent" />

      {/* CTA */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <Drift density="high" seed={71} />
        <BlobGlow position="center" color="gold" size="xl" intensity={0.18} />

        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <NyxMark size={72} showRing className="mx-auto mb-8 opacity-90" />
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-8 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Work with us{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">directly.</span>
            </h2>
            <Text variant="lead" className="mb-10 text-[var(--text-2)]">
              Loc and Charles still tutor a small number of students each semester. Spots are limited.
            </Text>
            <CTA href="/apply" size="lg">Apply for 1:1 tutoring</CTA>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
