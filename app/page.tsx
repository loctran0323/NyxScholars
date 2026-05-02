"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Video, CalendarClock } from "lucide-react";
import {
  Eyebrow, CTA,
  BgShootingStars, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const promises = [
  { n: "01", title: "Vetted, not listed.", body: "Every tutor scored 1500+ on the digital SAT, is currently enrolled at a top-tier university, and ran a 30-minute teaching audition with the founders before taking on a student." },
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

      {/* VETTING PROMISE — replaces named tutor cards */}
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
              <Eyebrow color="moon" className="mb-4">Vetting</Eyebrow>
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] max-w-2xl"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                You meet your tutor{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">in the trial.</span>
              </h2>
            </div>
            <Link
              href="/tutors"
              className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[14px] font-medium transition-colors shrink-0"
            >
              Read the vetting process
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl">
            {[
              { n: "01", title: "Score floor", body: "Verified 1500+ on the digital SAT. No exceptions, including for the founders." },
              { n: "02", title: "Currently enrolled", body: "Active undergraduates at Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer schools." },
              { n: "03", title: "Teaching audition", body: "Thirty-minute mock session with the founders. We hire only people we'd book ourselves." },
            ].map((p) => (
              <article
                key={p.n}
                className="p-6 md:p-7"
                style={{
                  background: "rgba(12, 17, 36, 0.7)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(30, 37, 66, 1)",
                  borderRadius: 6,
                }}
              >
                <span
                  className="font-[family-name:var(--font-fraunces)] italic block mb-4"
                  style={{ color: "#7dd3fc", fontSize: 28, lineHeight: 1 }}
                >
                  {p.n}
                </span>
                <h3
                  className="font-[family-name:var(--font-fraunces)] font-medium mb-3"
                  style={{ fontSize: 20, color: "#e6e9f5" }}
                >
                  {p.title}
                </h3>
                <p className="text-[#9aa5b8] text-[14px] leading-[1.7]">{p.body}</p>
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
