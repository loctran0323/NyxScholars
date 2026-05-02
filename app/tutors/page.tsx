"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, CTA, NyxMark,
  BgAuroraNebula, BgNorthStar, BgEclipse, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const founders = [
  {
    name: "Loc",
    role: "Co-founder · Product & Curriculum",
    school: "Princeton, Class of 2028",
    bg: "north" as const,
    bio: "Loc designs the adaptive engine and authors much of the SAT bank. He scored in the 99th percentile on the digital SAT and has tutored 50+ students one-on-one through the redesigned exam.",
    quote: "The fastest path to a higher score is the question you can almost answer.",
    detail: "Studies math · Reads too much science fiction",
  },
  {
    name: "Charles",
    role: "Co-founder · Engineering & Operations",
    school: "Princeton, Class of 2028",
    bg: "eclipse" as const,
    bio: "Charles built the Nyx platform end to end and runs ops. He handles every adaptive feature — IRT calibration, the dashboard you read each week, the scheduling that gets a tutor on a call within forty-eight hours.",
    quote: "We owe students a real number, not a vibe.",
    detail: "Studies CS · Cooks better than Loc",
  },
];

export default function FoundersPage() {
  return (
    <div className="relative">

      <section className="relative min-h-[680px] flex items-center overflow-hidden pt-[100px] md:pt-0">
        <BgAuroraNebula />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(7,9,20,0.45) 0%, rgba(7,9,20,0.25) 40%, rgba(7,9,20,0.85) 100%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Eyebrow color="brass" className="mb-7 mx-auto">The Founders</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8 max-w-4xl mx-auto"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.4rem)" }}
            >
              Two students.<br />
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                One product they wished they&apos;d had.
              </span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl mx-auto">
              Nyx was built by Loc and Charles — Princeton classmates who started where you are
              and built the prep platform they wanted.
            </p>
            <SignatureLine width={200} className="mt-10 mx-auto" />
          </motion.div>
        </div>
      </section>

      {founders.map((f, i) => (
        <section key={f.name} className="relative pt-12 md:pt-20 pb-20 md:pb-28 overflow-hidden">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className={`grid md:grid-cols-12 gap-x-8 gap-y-12 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="md:col-span-6 md:[direction:ltr] relative">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {f.bg === "north" ? <BgNorthStar /> : <BgEclipse />}
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, transparent 60%, rgba(7,9,20,0.85) 100%)" }}
                  />
                  <div className="absolute inset-0 border border-[var(--border)] pointer-events-none" />
                  <div className="absolute top-7 left-7 z-10">
                    <span className="block font-mono text-[var(--text-1)]/80 text-[10px] uppercase tracking-[0.28em]">
                      0{i + 1} · Founder
                    </span>
                    <span className="block w-12 h-px bg-[#7dd3fc]/60 mt-3" />
                  </div>
                  <div className="absolute bottom-7 right-7 z-10 text-right">
                    <span className="block font-mono text-[var(--text-1)]/60 text-[10px] uppercase tracking-[0.22em]">
                      {f.detail}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-6 md:[direction:ltr] relative">
                <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-5">
                  {f.role}
                </p>
                <h2
                  className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-[0.9] mb-7"
                  style={{ fontSize: "clamp(4.5rem, 10vw, 9rem)" }}
                >
                  {f.name}
                </h2>
                <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.18em] mb-9">
                  {f.school}
                </p>
                <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-[500px] mb-10">
                  {f.bio}
                </p>
                <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] text-[20px] leading-[1.5] max-w-[460px] border-l border-[var(--accent)] pl-6">
                  &ldquo;{f.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="relative min-h-[640px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-left" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl ml-auto"
          >
            <NyxMark size={64} showRing className="mb-8 opacity-90" />
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-7 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Work with us{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">directly.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Loc and Charles still tutor a small number of students each semester. Spots are limited.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/apply" size="lg">Apply for 1:1 tutoring</CTA>
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
