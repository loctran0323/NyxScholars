"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  CTA,
  BgShootingStars, BgInkWash, BgCrescentMoon, BgFade,
} from "@/components/system";
import { JourneyDemo } from "@/components/demos/JourneyDemo";
import { HOURLY_RATE_USD } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HomePage() {
  return (
    <div className="relative">

      {/* HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-[150px] md:pt-[200px] pb-24 md:pb-36 overflow-hidden">
        <BgShootingStars />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(5,8,22,0.55) 0%, rgba(5,8,22,0.2) 40%, rgba(5,8,22,0.85) 100%)" }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none hidden lg:block"
          style={{ top: "-60px", right: "-100px", width: 560, height: 560, opacity: 0.08 }}
        >
          <Image src="/design/crescent-monogram.png" alt="" fill sizes="560px" className="object-contain" priority />
        </div>
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-mono text-[var(--accent)] text-[12px] uppercase tracking-[0.28em] mb-7"
            >
              <span className="gold-line" />1:1 SAT tutoring · online
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.98] tracking-[-0.02em] read-default"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.4rem)" }}
            >
              Tutoring,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal text-gradient">
                honestly.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mt-10 read-narrow text-[var(--text-2)] text-[18px] leading-[1.75]"
            >
              Vetted Ivy League tutors. ${HOURLY_RATE_USD} per hour, paid by the session.
              Free 30-minute trial — no card.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="mt-12 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
            >
              <CTA href="/match" size="lg">Get matched in 12 minutes</CTA>
              <Link
                href="#how"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] font-medium text-[15px] transition-colors"
              >
                See how it works
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <IvyBadges />
        </div>
      </section>

      {/* DEMO ─────────────────────────────────────────────────── */}
      <section id="how" className="relative py-24 md:py-36 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />

        <div className="relative max-w-[1280px] mx-auto px-6 sm:px-10">
          <header className="mb-14 read-default">
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-5">
              Demo · scrub the timeline
            </p>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
            >
              Ninety days.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">From 1180 to 1520.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.8] mt-7 read-default">
              Every SAT skill is a star, in one of six constellations. Each session lights one.
              Below is one student&rsquo;s actual ninety-day arc — drag the timeline, click any
              star to see the questions she answered.
            </p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <JourneyDemo />
          </motion.div>

          <p className="mt-6 text-[var(--text-3)] text-[13px] leading-[1.7] max-w-2xl font-mono">
            HOVER · CLICK CONSTELLATIONS · SPACE TO PLAY · ARROW KEYS TO STEP
          </p>
        </div>
      </section>

      {/* VETTING ─────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 border-t border-[var(--border)]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
          <header className="mb-16 read-default">
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-5">
              Vetting
            </p>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.15] tracking-[-0.018em]"
              style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)" }}
            >
              Tutors,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">vetted four ways.</span>
            </h2>
          </header>

          <ol className="space-y-10">
            {[
              { n: "01", title: "Verified 1500+ digital SAT.", body: "Score reports checked. No exceptions — every Ivy tutor on the platform has hit the bar themselves." },
              { n: "02", title: "Currently enrolled.", body: "Active undergrads at Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer schools — re-verified each semester." },
              { n: "03", title: "Teaching audition.", body: "Thirty-minute mock session with a Nyx lead, walking through a real student case before they meet anyone." },
              { n: "04", title: "Trial cohort.", body: "Approved tutors take on two trial students with senior shadowing on the first session. Honest feedback decides whether they stay." },
            ].map((p) => (
              <li key={p.n} className="grid md:grid-cols-12 gap-x-8 gap-y-2">
                <div className="md:col-span-2">
                  <span
                    className="font-[family-name:var(--font-fraunces)] italic text-[var(--accent)]"
                    style={{ fontSize: 28, lineHeight: 1 }}
                  >
                    {p.n}
                  </span>
                </div>
                <div className="md:col-span-10 read-default">
                  <h3
                    className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] leading-[1.25] mb-3"
                    style={{ fontSize: 22 }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[var(--text-2)] text-[16px] leading-[1.8]">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING ─────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden border-t border-[var(--border)]">
        <BgInkWash />
        <BgFade height={120} />

        <div className="relative max-w-[1100px] mx-auto px-6 sm:px-10">
          <header className="mb-12 read-default">
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-5">
              Pricing
            </p>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.15] tracking-[-0.018em]"
              style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)" }}
            >
              ${HOURLY_RATE_USD}/hr.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Or commit and pay less.</span>
            </h2>
          </header>

          <div className="rounded-[14px] border border-[var(--border)] bg-[#0c1124]/60 backdrop-blur-sm overflow-hidden max-w-[760px]">
            <PriceRow label="Free trial"          sub="30 minutes"        price="$0" />
            <PriceRow label="Pay-as-you-go"       sub="any session"       price={`$${HOURLY_RATE_USD} / hr`} highlight />
            <PriceRow label="4-week cadence"      sub="2 hrs/wk · 8 hrs"  price="$150 / hr" aside="$1,200 · save 6%" />
            <PriceRow label="8-week cadence"      sub="2 hrs/wk · 16 hrs" price="$140 / hr" aside="$2,240 · save 12%" recommended />
            <PriceRow label="12-week cadence"     sub="2 hrs/wk · 24 hrs" price="$130 / hr" aside="$3,120 · save 19%" />
          </div>
          <p className="mt-6 text-[var(--text-3)] text-[13px] leading-[1.7] max-w-[640px]">
            Cancel any single session up to 12 hours before. Cadences refundable until you&rsquo;re
            halfway through.
          </p>

          <div className="mt-10">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.28em]"
            >
              Pricing details · admissions add-on
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[440px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(5,8,22,0.78) 0%, rgba(5,8,22,0.45) 35%, transparent 65%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-10 py-24">
          <div className="read-default">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-7 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}
            >
              Take the trial.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Decide after.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.8] mb-10 max-w-[480px]">
              Twelve-minute intake. Free 30-minute session with your matched tutor. No card.
            </p>
            <CTA href="/match" size="lg">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}

function PriceRow({
  label, sub, price, aside, highlight, recommended,
}: {
  label: string;
  sub: string;
  price: string;
  aside?: string;
  highlight?: boolean;
  recommended?: boolean;
}) {
  return (
    <div
      className="grid items-baseline gap-4 px-6 sm:px-7 py-5 border-b border-[var(--border)] last:border-b-0"
      style={{ gridTemplateColumns: "1fr auto", background: highlight ? "rgba(125,211,252,0.04)" : "transparent" }}
    >
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-[family-name:var(--font-fraunces)] italic"
            style={{ fontSize: 19, color: "var(--text-1)" }}
          >
            {label}
          </span>
          {recommended ? (
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--accent)]">
              · MOST START HERE
            </span>
          ) : null}
        </div>
        <div className="font-mono mt-1.5" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 1.5 }}>
          {sub.toUpperCase()}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono" style={{ fontSize: 17, color: "var(--text-1)" }}>{price}</div>
        {aside ? (
          <div className="font-mono mt-1" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.5 }}>
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────
 * IvyBadges
 * Six university logos floating freely in the right half of the hero.
 * Each logo sits on its own soft translucent disc so the (often dark)
 * wordmarks read clearly against the night sky. Positions are hand-
 * placed for an asymmetric, unforced arrangement — no connecting lines.
 * ─────────────────────────────────────────────────────────────────────── */
const IVY_LOGOS = [
  { src: "/ivy/Princeton.png", label: "Princeton", x: 52, y: 12, size: 108 },
  { src: "/ivy/Yale.png",      label: "Yale",      x: 90, y: 32, size: 96  },
  { src: "/ivy/Columbia.png",  label: "Columbia",  x: 72, y: 76, size: 100 },
  { src: "/ivy/MIT.png",       label: "MIT",       x: 40, y: 52, size: 104 },
  { src: "/ivy/Stanford.png",  label: "Stanford",  x: 14, y: 78, size: 96  },
  { src: "/ivy/UPenn.png",     label: "UPenn",     x: 8,  y: 30, size: 96  },
];

function IvyBadges() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="hidden lg:block relative"
      style={{ width: 380, height: 380 }}
      aria-label="Tutors come from Princeton, Yale, Columbia, MIT, Stanford, and UPenn"
    >
      <p className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--text-3)] whitespace-nowrap">
        Tutors from
      </p>

      {IVY_LOGOS.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 + i * 0.08, ease: EASE }}
          className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle at 50% 50%, rgba(230,233,245,0.92) 0%, rgba(230,233,245,0.78) 55%, rgba(230,233,245,0.55) 80%, rgba(230,233,245,0) 100%)",
          }}
          title={`${p.label} University`}
        >
          <Image
            src={p.src}
            alt={`${p.label} University`}
            width={p.size}
            height={p.size}
            sizes={`${p.size}px`}
            className="object-contain"
            style={{ width: "72%", height: "72%", objectFit: "contain" }}
          />
        </motion.div>
      ))}
    </motion.aside>
  );
}
