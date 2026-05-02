"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Video, CalendarClock } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgConstellationGrid, BgCrescentMoon, BgInkWash, BgAuroraNebula,
  BgFade, SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const promises = [
  { n: "01", title: "Vetted tutors only.", body: "Every tutor scored 1500+ on the digital SAT and passed a teaching audition. We accept fewer than 8% of applicants." },
  { n: "02", title: "Truly 1:1.", body: "No group classes. No recordings repackaged as a course. Real human attention every session, online over video." },
  { n: "03", title: "Pay by the session.", body: "No thousand-dollar packages. $0 for the first 30-minute trial; $110–$130/hr after that. Cancel any session any time." },
];

const featuredTutors = [
  { name: "Loc",     school: "Princeton",  classOf: 2028, sat: 1580, focus: "Math · ACT" },
  { name: "Maya",    school: "Harvard",    classOf: 2027, sat: 1550, focus: "R&W · Admissions" },
  { name: "Kenji",   school: "MIT",        classOf: 2027, sat: 1590, focus: "Math · AP" },
  { name: "Nadia",   school: "Yale",       classOf: 2026, sat: 1540, focus: "R&W · Admissions" },
  { name: "Theo",    school: "Stanford",   classOf: 2027, sat: 1570, focus: "Math · AP" },
  { name: "Charles", school: "Princeton",  classOf: 2028, sat: 1560, focus: "Math · R&W" },
];

export default function HomePage() {
  return (
    <div className="relative">

      {/* HERO */}
      <section className="relative min-h-[860px] md:min-h-[920px] flex items-center pt-[100px] md:pt-0 overflow-hidden">
        <BgShootingStars />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,9,20,0.85) 0%, rgba(7,9,20,0.55) 35%, transparent 70%)",
          }}
        />
        <BgFade top={false} bottom height={120} />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-7"
          >
            <Eyebrow color="brass">1:1 SAT tutoring · Vetted Ivy League students · Online</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.96] tracking-[-0.02em] max-w-5xl"
            style={{ fontSize: "clamp(2.6rem, 6.8vw, 6.2rem)" }}
          >
            The right tutor,<br />
            <span className="font-[family-name:var(--font-cormorant)] italic font-normal text-gradient">one</span>{" "}
            <span className="relative inline-block">
              session
              <SignatureLine width={240} className="absolute -bottom-3 left-0 hidden md:block" />
            </span>{" "}
            at a time.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-10 max-w-[560px] text-[var(--text-2)] text-[18px] leading-[1.7]"
          >
            Nyx connects students with Ivy League undergraduates who recently aced the SAT.
            Online, one-on-one, by the session — with a free 30-minute trial to make sure your
            tutor is the right fit before you pay a cent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
            className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <CTA href="/match" size="lg">Get matched in 12 minutes</CTA>
            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] font-medium text-[15px] transition-colors"
            >
              Or browse tutors
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-20 flex flex-wrap gap-x-8 gap-y-4 max-w-3xl"
          >
            {[
              { icon: ShieldCheck,    label: "8% acceptance · Every tutor 1500+ SAT" },
              { icon: Video,          label: "Online video sessions · Online whiteboard" },
              { icon: CalendarClock,  label: "Book by the session · Cancel anytime" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2.5 font-mono text-[var(--text-2)] text-[12px] uppercase tracking-[0.16em]"
              >
                <Icon size={14} className="text-[#7dd3fc]" />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS — three promises, editorial */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <BgInkWash />
        <BgFade height={96} />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="grid md:grid-cols-12 gap-8"
          >
            <div className="md:col-span-2">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">01</span>
              <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em]">How it works</span>
            </div>

            <div className="md:col-span-10">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.08] tracking-[-0.018em] mb-14 max-w-3xl"
                style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
              >
                Tutoring,{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic text-[var(--accent)]">
                  with the parts that don&apos;t work removed.
                </span>
              </h2>

              <div className="space-y-12">
                {promises.map((p) => (
                  <div key={p.n} className="grid md:grid-cols-12 gap-6 md:gap-10">
                    <div className="md:col-span-1">
                      <span
                        className="font-[family-name:var(--font-fraunces)] italic text-[#7dd3fc]"
                        style={{ fontSize: 32, lineHeight: 1 }}
                      >
                        {p.n}
                      </span>
                    </div>
                    <div className="md:col-span-11">
                      <h3
                        className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.2] mb-3"
                        style={{ fontSize: 22 }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/sat-act"
                className="inline-flex items-center gap-2 mt-16 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                Read the full process
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TUTOR ROSTER — full-bleed constellation grid bg, list of real tutor cards */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <BgConstellationGrid />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,9,20,0.55) 0%, rgba(7,9,20,0.3) 30%, rgba(7,9,20,0.55) 100%)",
          }}
        />

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-4">
                02 / The roster
              </span>
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] max-w-2xl"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3.6rem)" }}
              >
                Tutors taught by{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">the test they just took.</span>
              </h2>
            </div>
            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[14px] font-medium transition-colors shrink-0"
            >
              Browse all tutors
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTutors.map((t) => (
              <article
                key={t.name}
                className="p-6 transition-all duration-300 hover:border-[#7dd3fc]/40"
                style={{
                  background: "rgba(12, 17, 36, 0.7)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(30, 37, 66, 1)",
                  borderRadius: 4,
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid place-items-center"
                      style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "#141a30", border: "1px solid #3b7a99",
                        fontFamily: "var(--font-fraunces)", fontSize: 14, color: "#e6e9f5",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p
                        className="italic"
                        style={{ fontFamily: "var(--font-fraunces)", fontSize: 19, color: "#e6e9f5", lineHeight: 1 }}
                      >
                        {t.name}
                      </p>
                      <p className="font-mono mt-1 text-[10px] tracking-[0.18em] text-[#7a82a0]">
                        {t.school.toUpperCase()} · &lsquo;{String(t.classOf).slice(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-[#7a82a0]">SAT</p>
                    <p className="font-mono text-[14px] tabular-nums text-[#7dd3fc]">{t.sat}</p>
                  </div>
                </div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-[#7a82a0] mb-5">
                  {t.focus.toUpperCase()}
                </p>
                <Link
                  href={`/tutors#${t.name.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-[#7dd3fc] hover:text-[#bde9ff] font-mono text-[11px] tracking-[0.16em] uppercase transition-colors group"
                >
                  View profile
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS / PROVENANCE */}
      <section className="relative pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden">
        <BgAuroraNebula />
        <BgFade height={120} />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="grid md:grid-cols-12 gap-8 md:gap-16 items-start"
          >
            <div className="md:col-span-4">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">03</span>
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em]">Why us</span>
            </div>
            <div className="md:col-span-8">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.08] tracking-[-0.015em] mb-7"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)" }}
              >
                Two Princeton students started this{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">because every other tutoring agency was a scam.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-6">
                Loc and Charles built Nyx to fix what they hated about the prep industry: opaque
                pricing, $4,000 packages, tutors who hadn&apos;t taken the test in a decade. Nyx
                hires only current undergraduates from top schools, vets each one, and lets students
                pay for what they actually use.
              </p>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-9">
                Both founders still tutor on the platform. So do their classmates.
              </p>
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                Meet the founders &amp; tutors
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[700px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 65%)",
          }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-2xl"
          >
            <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-6">
              04 / Begin
            </span>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-10 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.4rem)" }}
            >
              Book a free trial.<br />
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Then decide.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-lg mb-12">
              Thirty minutes with a vetted Ivy tutor. No card, no commitment. If it&apos;s not the
              right fit we&apos;ll re-match you, or you walk away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/match" size="lg">Take the 12-min intake</CTA>
              <Link
                href="/tutors"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                Browse tutors instead
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-14 font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em]">
              Per noctem ad lucem · Nyx does not guarantee score increases or admissions outcomes
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
