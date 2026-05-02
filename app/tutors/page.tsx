"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, GraduationCap, Video, ClipboardCheck } from "lucide-react";
import {
  Eyebrow, CTA, NyxMark,
  BgInkWash, BgConstellationGrid, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const vettingSteps = [
  {
    n: "01",
    icon: ClipboardCheck,
    title: "Score floor.",
    body: "Every applicant must have scored 1500 or higher on the digital SAT, with a verified score report. No exceptions, including for the founders themselves.",
  },
  {
    n: "02",
    icon: GraduationCap,
    title: "Currently enrolled.",
    body: "Tutors must be active undergraduates at a top-tier university — Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer schools. We re-verify each semester.",
  },
  {
    n: "03",
    icon: Video,
    title: "Teaching audition.",
    body: "Applicants run a 30-minute mock session with one of the founders, walking through a real student case. We're looking for clarity, patience, and the ability to find the next question to ask — not the answer.",
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Trial cohort.",
    body: "Approved tutors take on two trial students with founder shadowing on the first session. Honest student feedback determines whether they stay on the platform.",
  },
];

export default function TutorsPage() {
  return (
    <div className="relative">

      {/* HERO */}
      <section className="relative pt-[120px] md:pt-[160px] pb-20 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Vetting</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)" }}
            >
              How we hire tutors.
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              We don&rsquo;t list our tutors publicly — partly because we&rsquo;re early and the
              roster is small, partly because the people who matter to your sessions are the ones we
              put through this process before they ever meet a student. You meet your matched tutor
              when you book a free trial.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      {/* THE FOUR STEPS */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <BgConstellationGrid />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,9,20,0.65) 0%, rgba(7,9,20,0.4) 40%, rgba(7,9,20,0.85) 100%)",
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="space-y-14 md:space-y-20 max-w-3xl">
            {vettingSteps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.04 }}
                className="grid md:grid-cols-12 gap-x-10 gap-y-5"
              >
                <div className="md:col-span-2 flex md:flex-col gap-4 md:gap-6 items-baseline md:items-start">
                  <span
                    className="font-[family-name:var(--font-fraunces)] italic text-[#7dd3fc]"
                    style={{ fontSize: 32, lineHeight: 1 }}
                  >
                    {s.n}
                  </span>
                  <s.icon size={22} className="text-[#7dd3fc] opacity-80" />
                </div>
                <div className="md:col-span-10">
                  <h3
                    className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.2] mb-3"
                    style={{ fontSize: 24 }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE STRIP — calm, just the numerical commitments */}
      <section className="relative py-20 md:py-24 border-y border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-12 md:gap-16">
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--text-3)] mb-3">SCORE FLOOR</p>
              <p
                className="leading-none"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 42, color: "var(--text-1)" }}
              >
                1500+
              </p>
              <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-2)]">
                Verified digital SAT score, no exceptions.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--text-3)] mb-3">SESSIONS</p>
              <p
                className="leading-none"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 42, color: "var(--text-1)" }}
              >
                1:1
              </p>
              <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-2)]">
                Online video, never group classes or recordings.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[var(--text-3)] mb-3">RATE</p>
              <p
                className="leading-none"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 42, color: "var(--text-1)" }}
              >
                ${HOURLY_RATE_USD}<span style={{ fontSize: 18, color: "var(--text-3)" }}>/hr</span>
              </p>
              <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-2)]">
                One honest rate; cadences pay less per hour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY-TO-TUTOR PATH */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[900px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-2">
                Tutoring with us
              </p>
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em]">
                Apply
              </p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] tracking-[-0.015em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}
              >
                Want to teach{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">on Nyx?</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-6">
                If you cleared the criteria above and you&rsquo;d teach our siblings the way
                you&rsquo;d want them taught — write to us.
              </p>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-9">
                We pay tutors well, take a small platform cut, and only onboard people we&rsquo;d
                book ourselves.
              </p>
              <Link
                href="mailto:tutors@nyxscholars.com"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                tutors@nyxscholars.com
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[460px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-left" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-16">
          <div className="max-w-xl ml-auto">
            <NyxMark size={56} showRing className="mb-7 opacity-90" />
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-6 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Meet your tutor in the trial.
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-9">
              The 12-minute intake matches you to whoever covers your gaps. Free 30 minutes after
              that, no card.
            </p>
            <CTA href="/match" size="lg">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
