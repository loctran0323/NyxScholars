"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, CTA, NyxMark,
  BgInkWash, BgConstellationGrid, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { TUTORS, HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TutorsPage() {
  return (
    <div className="relative">

      {/* HERO */}
      <section className="relative pt-[120px] md:pt-[160px] pb-24 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">The tutors</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)" }}
            >
              Two of us, for now.
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Nyx is two Princeton classmates tutoring SAT, ACT, AP, and admissions one student at
              a time. We&rsquo;re hiring carefully. No mass-market roster, no commission tier of
              random tutors — just us, until we find people we&rsquo;d trust to teach our siblings.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      {/* FOUNDERS — clean magazine spreads, no fabricated stats */}
      {TUTORS.map((t, i) => (
        <section
          key={t.id}
          className={`relative pt-12 md:pt-16 pb-16 md:pb-24 overflow-hidden ${i % 2 === 1 ? "bg-[var(--bg-2)]" : ""}`}
        >
          {i === 0 ? <BgConstellationGrid /> : null}
          {i === 0 ? <BgFade height={120} /> : null}
          {i === 0 ? (
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(7,9,20,0.65) 0%, rgba(7,9,20,0.4) 40%, rgba(7,9,20,0.85) 100%)",
              }}
            />
          ) : null}

          <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`grid md:grid-cols-12 gap-x-12 gap-y-10 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              {/* Left rail — name + key facts only */}
              <div className="md:col-span-4 md:[direction:ltr]">
                <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-4">
                  Founder · {t.tags.join(", ")}
                </p>
                <h2
                  className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-[0.9] mb-6"
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
                >
                  {t.name}
                </h2>
                <dl className="space-y-3 text-[14px]">
                  <Row label="School" value={`${t.school}, Class of ${t.classOf}`} />
                  <Row label="SAT" value={`${t.satScore} (digital)`} />
                  <Row label="Available" value={t.availability} />
                  <Row label="Rate" value={`$${HOURLY_RATE_USD}/hr · free trial`} />
                </dl>
              </div>

              {/* Right rail — bio + quote + book */}
              <div className="md:col-span-8 md:[direction:ltr]">
                <p className="text-[var(--text-2)] text-[16px] leading-[1.8] mb-8 max-w-2xl">
                  {t.bio}
                </p>
                <p
                  className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] leading-[1.45] border-l border-[var(--accent)] pl-6 mb-10 max-w-xl"
                  style={{ fontSize: 20 }}
                >
                  &ldquo;{t.pitch}&rdquo;
                </p>
                <div className="flex items-center gap-5 flex-wrap">
                  <Link
                    href={`/portal/schedule?tutor=${t.id}`}
                    className="inline-flex items-center gap-2 font-mono font-medium px-6 py-3 rounded-[3px] transition-all hover:brightness-110"
                    style={{ background: "#7dd3fc", color: "#070914", fontSize: 11, letterSpacing: 4 }}
                  >
                    BOOK FREE TRIAL →
                  </Link>
                  <Link
                    href={`/match`}
                    className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.16em] text-[12px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
                  >
                    or get matched first
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* HONEST HIRING NOTE — replaces fake roster */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[900px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-2">
                Hiring
              </p>
              <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em]">
                Carefully
              </p>
            </div>
            <div className="md:col-span-9">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] tracking-[-0.015em] mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}
              >
                We&rsquo;re adding tutors{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">one at a time.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-6">
                If you&rsquo;re an undergrad at an Ivy or peer school who scored 1500+ on the digital
                SAT, has tutored before, and would teach our siblings the way we&rsquo;d want them
                taught — write to us.
              </p>
              <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-2xl mb-9">
                We pay tutors well, take a small cut to keep the platform running, and don&rsquo;t
                onboard anyone we wouldn&rsquo;t book ourselves.
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
              Pick one of us.
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-9">
              Or take the 12-minute intake and we&rsquo;ll suggest who you&rsquo;d click with first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/match" size="lg">Get matched</CTA>
              <Link
                href="/portal/schedule?tutor=loc"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                Or pick a tutor
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1 border-b border-[var(--border)]/60">
      <dt className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-3)]">
        {label}
      </dt>
      <dd className="text-[var(--text-1)] text-[14px]">{value}</dd>
    </div>
  );
}
