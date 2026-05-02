"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Eyebrow, CTA, NyxMark,
  BgAuroraNebula, BgShootingStars, BgConstellationGrid,
  BgCrescentMoon, BgOrbital, BgNorthStar, BgInkWash, BgEclipse,
  BgFade, SignatureLine,
} from "@/components/system";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const principles = [
  { n: "01", title: "Diagnose first.", body: "Thirty adaptive questions converge on a calibrated section score in under forty minutes." },
  { n: "02", title: "Practice the gaps.", body: "Each session targets the skills at the edge of your ability, not the ones you already own." },
  { n: "03", title: "See the trajectory.", body: "Score curves, mastery heatmaps, time-to-target — calibrated, not vibes." },
];

export default function HomePage() {
  return (
    <div className="relative">

      {/* ═══════════════════════════════════════════════════════════════
         HERO — full-bleed shooting-stars background, typography sits
         on the dark sky directly. No glass card on the score callout.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[860px] md:min-h-[920px] flex items-center pt-[100px] md:pt-0 overflow-hidden">
        <BgShootingStars />
        {/* atmospheric darken on the typography side */}
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
            <Eyebrow color="brass">Adaptive SAT prep · Calibrated by Ivy-tier students</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.05, ease: EASE }}
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[0.96] tracking-[-0.02em] max-w-5xl"
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

          {/* Score callout — no card, lives on the sky itself */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-20 flex items-end gap-8 max-w-2xl"
          >
            <div>
              <p className="font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-2">Diagnostic · 6 weeks in</p>
              <p
                className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-none"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)" }}
              >
                1,310<span className="text-[var(--text-3)] text-[55%]">/1600</span>
              </p>
            </div>
            <div className="pb-2">
              <span className="font-mono text-[#7dd3fc] text-[13px]">+40</span>
              <span className="block font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.16em] mt-0.5">vs. last</span>
            </div>
            <div className="hidden sm:block w-px h-12 bg-[var(--border)]" />
            <div className="hidden sm:block">
              <p className="font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-2">Target</p>
              <p className="font-[family-name:var(--font-fraunces)] text-[var(--text-2)] text-[28px] leading-none">1,480</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         MANIFESTO — InkWash bg (calm grid + soft washes, no stars
         competing with text). Editorial typography column.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 overflow-hidden">
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
              <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em]">Manifesto</span>
            </div>
            <div className="md:col-span-10">
              <blockquote
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.08] tracking-[-0.018em]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)" }}
              >
                Generic prep is recycled noise.{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic text-[var(--accent)]">
                  We built the prep we wished we&apos;d had.
                </span>
              </blockquote>
              <div className="mt-14 grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl text-[var(--text-2)] text-[16px] leading-[1.8]">
                <p>
                  Most test prep is the same questions in a new wrapper, sold by tutors who took
                  the SAT a decade ago. The exam has changed. The bar has changed.
                </p>
                <p>
                  Nyx is built around one idea: the fastest way to a higher score is the question
                  you can&apos;t quite answer yet — delivered the moment you&apos;re ready for it.
                </p>
              </div>
              <Link
                href="/sat-act"
                className="inline-flex items-center gap-2 mt-12 text-[var(--accent)] hover:text-[var(--accent-bright)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
              >
                Read the approach
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         TRAJECTORY — Constellation Grid background (structural,
         calm pattern). Score visualization sits over it as a real
         drawn chart in the foreground.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[760px] flex items-center overflow-hidden">
        <BgConstellationGrid />
        <BgFade height={120} />
        {/* darken upper-left for typography */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(7,9,20,0.78) 0%, rgba(7,9,20,0.45) 35%, transparent 65%)",
          }}
        />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="lg:col-span-6"
            >
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-5">
                02 / Trajectory
              </span>
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.018em] mb-7"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3.6rem)" }}
              >
                You&apos;ll see your score{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">move.</span>
              </h2>
              <p className="text-[var(--text-2)] text-[17px] leading-[1.8] max-w-[440px] mb-12">
                Every session updates a calibrated estimate of your ability. The trajectory plot
                shows the path, the current confidence interval, and a real time-to-target.
              </p>
              <ul className="space-y-7 max-w-[460px]">
                {principles.map((p) => (
                  <li key={p.n} className="flex gap-5">
                    <span className="font-[family-name:var(--font-fraunces)] italic text-[var(--accent)] text-[26px] leading-none pt-1">
                      {p.n}
                    </span>
                    <span>
                      <span className="block text-[var(--text-1)] font-semibold mb-1.5 text-[15.5px]">{p.title}</span>
                      <span className="block text-[var(--text-2)] text-[14px] leading-[1.7]">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Score curve drawn directly on the page, no card frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: EASE }}
              className="lg:col-span-6 relative h-[420px] hidden lg:block"
            >
              <TrajectoryChart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         FOUNDERS — AuroraNebula bg (drifting cyan/violet, organic).
         Each founder is a vignette with the bg tinted toward them, no
         glass card overlays.
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 md:pt-32 pb-24 md:pb-32 overflow-hidden">
        <BgAuroraNebula />
        <BgFade height={120} />

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-20 grid md:grid-cols-12 gap-8"
          >
            <div className="md:col-span-2">
              <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-3">03</span>
              <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em]">Founders</span>
            </div>
            <div className="md:col-span-10">
              <h2
                className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.08] tracking-[-0.015em] max-w-3xl"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3.6rem)" }}
              >
                Built by students who{" "}
                <span className="font-[family-name:var(--font-cormorant)] italic">just did it.</span>
              </h2>
            </div>
          </motion.div>

          <div className="space-y-32 md:space-y-40">
            {[
              {
                name: "Loc",
                role: "Product · Curriculum",
                school: "Princeton, Class of 2028",
                accent: "moon" as const,
                bio: "Loc designs the adaptive engine and authors much of the SAT bank. He scored in the 99th percentile on the digital SAT and has tutored 50+ students through the redesigned exam.",
                quote: "The fastest path to a higher score is the question you can almost answer.",
              },
              {
                name: "Charles",
                role: "Engineering · Operations",
                school: "Princeton, Class of 2028",
                accent: "violet" as const,
                bio: "Charles built the Nyx platform end to end and runs ops. He handles every adaptive feature — IRT calibration, dashboards, the report you read each week.",
                quote: "We owe students a real number, not a vibe.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: EASE }}
                className={`grid md:grid-cols-12 gap-x-12 gap-y-10 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              >
                {/* Portrait — uses Eclipse OR NorthStar mini-bg as a personal "sky" per founder */}
                <div className="md:col-span-5 md:[direction:ltr] relative">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {i === 0 ? <BgNorthStar /> : <BgEclipse />}
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(7,9,20,0.85) 100%)",
                      }}
                    />
                    <div className="absolute inset-0 border border-[var(--border)] pointer-events-none" />
                    <div className="absolute top-6 left-6 z-10">
                      <span className="block font-mono text-[var(--text-1)]/70 text-[10px] uppercase tracking-[0.28em]">
                        0{i + 1} · Founder
                      </span>
                      <span className="block w-12 h-px bg-[#7dd3fc]/60 mt-3" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 md:[direction:ltr] relative">
                  <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-4">
                    {f.role}
                  </p>
                  <h3
                    className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-[0.92] mb-6"
                    style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}
                  >
                    {f.name}
                  </h3>
                  <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.18em] mb-8">
                    {f.school}
                  </p>
                  <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-[480px] mb-10">
                    {f.bio}
                  </p>
                  <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] text-[20px] leading-[1.45] max-w-[440px] border-l border-[var(--accent)] pl-6">
                    &ldquo;{f.quote}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         FINAL CTA — CrescentMoon background, brand-anchoring close.
         ═══════════════════════════════════════════════════════════════ */}
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
              Take the diagnostic.<br />
              <span className="font-[family-name:var(--font-cormorant)] italic font-normal">
                Then decide.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-lg mb-12">
              Thirty adaptive questions. Forty minutes. A calibrated score and a real plan — at no cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/apply" size="lg">Start the diagnostic</CTA>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                See plans
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

/* ───────────────────────────────────────────────────────────
 * Inline trajectory chart — drawn directly into the section so
 * it doesn't read as a card "embed". Soft glow background, line
 * that climbs from lower-left to upper-right with star data points.
 * ─────────────────────────────────────────────────────────── */
function TrajectoryChart() {
  const pts = [
    [40, 380], [120, 360], [200, 340], [280, 305], [360, 270],
    [440, 240], [520, 205], [600, 175], [680, 140], [760, 110],
    [840, 92], [920, 78],
  ];
  const path =
    `M ${pts[0][0]} ${pts[0][1]} ` +
    pts.slice(1).map(([x, y], i) => {
      const [px, py] = pts[i];
      const cx1 = px + 40;
      const cx2 = x - 40;
      return `C ${cx1} ${py}, ${cx2} ${y}, ${x} ${y}`;
    }).join(" ");
  const fill = `${path} L 920 420 L 40 420 Z`;
  return (
    <svg viewBox="0 0 960 440" className="w-full h-full">
      <defs>
        <linearGradient id="hp-tr" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#bde9ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e8cc7e" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="hp-tr-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hp-tr-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bde9ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#bde9ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* faint horizontal guides */}
      {[120, 200, 280, 360].map((y) => (
        <line key={y} x1="40" x2="920" y1={y} y2={y} stroke="#e6e9f5" strokeWidth="0.4" opacity="0.05" />
      ))}
      <path d={fill} fill="url(#hp-tr-fill)" />
      <path d={path} fill="none" stroke="url(#hp-tr)" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="url(#hp-tr-burst)" />
          <path
            d={`M ${x} ${y - 3.5} L ${x + 0.9} ${y - 0.9} L ${x + 3.5} ${y} L ${x + 0.9} ${y + 0.9} L ${x} ${y + 3.5} L ${x - 0.9} ${y + 0.9} L ${x - 3.5} ${y} L ${x - 0.9} ${y - 0.9} Z`}
            fill={i === pts.length - 1 ? "#bde9ff" : "#e6e9f5"}
            opacity={i === pts.length - 1 ? 1 : 0.85}
          />
        </g>
      ))}
      {/* target marker */}
      <line x1="920" y1="40" x2="920" y2="78" stroke="#c8a24b" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7" />
      <text x="884" y="36" fill="#c8a24b" fontSize="10" fontFamily="monospace" letterSpacing="2" opacity="0.85">TARGET 1480</text>
      <text x="40" y="408" fill="#7a82a0" fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.6">12 WEEKS</text>
    </svg>
  );
}
