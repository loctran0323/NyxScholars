"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Video, CalendarClock } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { TUTORS, HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const promises = [
  { n: "01", title: "Two of us, for now.", body: "Loc and Charles, both Princeton '28. We're hiring carefully — one tutor at a time, only people we'd trust to teach our siblings." },
  { n: "02", title: "One-on-one, online.", body: "Every session is over video with a shared whiteboard. No group classes, no recorded courses sold as 'tutoring,' no third-party assignments." },
  { n: "03", title: "One honest rate.", body: `$${HOURLY_RATE_USD} per hour pay-as-you-go. Or commit to a weekly cadence and pay less per hour. Free 30-minute trial either way.` },
];

export default function HomePage() {
  return (
    <div className="relative">

      {/* HERO — calmer headline, fewer competing claims */}
      <section className="relative min-h-[820px] md:min-h-[880px] flex items-center pt-[100px] md:pt-0 overflow-hidden">
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
            <Eyebrow color="brass">1:1 SAT tutoring · Princeton students · Online</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.96] tracking-[-0.02em] max-w-4xl"
            style={{ fontSize: "clamp(2.6rem, 6.5vw, 6rem)" }}
          >
            Tutoring,{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic font-normal text-gradient">honestly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-10 max-w-[560px] text-[var(--text-2)] text-[18px] leading-[1.7]"
          >
            Two Princeton students teaching SAT, ACT, AP, and admissions one student at a time —
            online, by the session, with a free 30-minute trial.
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
              Or just pick one of us
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-20 flex flex-wrap gap-x-8 gap-y-3 max-w-3xl"
          >
            {[
              { icon: Video,         label: "Online video sessions" },
              { icon: CalendarClock, label: `$${HOURLY_RATE_USD}/hr · cancel any session` },
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

      {/* PROMISES — three short, factual lines, no fake stats */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <BgInkWash />
        <BgFade height={96} />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Eyebrow color="brass" className="mb-6">What we do</Eyebrow>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.08] tracking-[-0.018em] mb-14 max-w-3xl"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              The parts of test prep{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic text-[var(--accent)]">
                that don&apos;t work
              </span>{" "}
              — removed.
            </h2>

            <div className="space-y-12 max-w-3xl">
              {promises.map((p) => (
                <div key={p.n} className="grid md:grid-cols-12 gap-4 md:gap-8">
                  <div className="md:col-span-1">
                    <span
                      className="font-[family-name:var(--font-fraunces)] italic text-[#7dd3fc]"
                      style={{ fontSize: 28, lineHeight: 1 }}
                    >
                      {p.n}
                    </span>
                  </div>
                  <div className="md:col-span-11">
                    <h3
                      className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.2] mb-2.5"
                      style={{ fontSize: 22 }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-[var(--text-2)] text-[16px] leading-[1.8]">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/sat-act"
              className="inline-flex items-center gap-2 mt-14 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
            >
              See the full process
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* THE TUTORS — two cards, real, no fabricated stats */}
      <section className="relative py-24 md:py-32 overflow-hidden border-t border-[var(--border)]">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
          >
            <div>
              <Eyebrow color="moon" className="mb-4">The tutors</Eyebrow>
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] max-w-2xl"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Two Princeton students.{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">That&rsquo;s it.</span>
              </h2>
            </div>
            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[14px] font-medium transition-colors shrink-0"
            >
              Read our bios
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {TUTORS.map((t) => (
              <article
                key={t.id}
                className="p-7 md:p-8 transition-colors duration-300 hover:border-[#7dd3fc]/40"
                style={{
                  background: "rgba(12, 17, 36, 0.7)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(30, 37, 66, 1)",
                  borderRadius: 6,
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="grid place-items-center shrink-0"
                    style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: "#141a30", border: "1px solid #3b7a99",
                      fontFamily: "var(--font-fraunces)", fontSize: 18, color: "#e6e9f5",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <h3
                      className="italic"
                      style={{ fontFamily: "var(--font-fraunces)", fontSize: 26, color: "#e6e9f5", lineHeight: 1, marginBottom: 4 }}
                    >
                      {t.name}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#7a82a0]">
                      {t.school.toUpperCase()} · CLASS OF {t.classOf} · SAT {t.satScore}
                    </p>
                  </div>
                </div>

                <p
                  className="italic mb-5"
                  style={{ fontFamily: "var(--font-fraunces)", fontSize: 15, color: "#e6e9f5", lineHeight: 1.45 }}
                >
                  &ldquo;{t.pitch}&rdquo;
                </p>
                <p className="text-[#9aa5b8] text-[14px] leading-[1.7] mb-6">{t.bio}</p>

                <Link
                  href={`/portal/schedule?tutor=${t.id}`}
                  className="inline-flex items-center gap-1.5 text-[#7dd3fc] hover:text-[#bde9ff] font-mono text-[11px] tracking-[0.16em] uppercase transition-colors group"
                >
                  Book free trial
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
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

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-2xl"
          >
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-9 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.4rem)" }}
            >
              Book a free trial.<br />
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Decide after.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] max-w-md mb-10">
              Thirty minutes with one of us. No card, no commitment. We&rsquo;ll be honest if Nyx
              isn&rsquo;t the right fit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/match" size="lg">Get matched</CTA>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                See pricing
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
