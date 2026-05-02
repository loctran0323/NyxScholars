"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import {
  Eyebrow, CTA, NyxMark,
  BgAuroraNebula, BgConstellationGrid, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { TUTORS } from "@/lib/mock/tutors";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const founders = TUTORS.filter((t) => t.id === "loc" || t.id === "charles");
const otherTutors = TUTORS.filter((t) => t.id !== "loc" && t.id !== "charles");

export default function TutorsPage() {
  return (
    <div className="relative">

      {/* HERO — vetting promise */}
      <section className="relative min-h-[600px] flex items-end overflow-hidden pt-[100px] md:pt-0">
        <BgAuroraNebula />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(7,9,20,0.85) 80%, var(--bg) 100%)" }}
        />

        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-3xl"
          >
            <Eyebrow color="brass" className="mb-6">The Roster</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
            >
              Six Ivy tutors,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">vetted line by line.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Every Nyx tutor is a current undergraduate at Princeton, Harvard, Yale, MIT, Stanford,
              or Columbia. Each scored 1500+ on the digital SAT and passed a teaching audition. We
              accept fewer than 8% of applicants.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </motion.div>
        </div>
      </section>

      {/* VETTING PROMISE STRIP */}
      <section className="relative py-16 overflow-hidden">
        <BgInkWash />
        <BgFade height={96} />
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-px" style={{ background: "#1e2542", border: "1px solid #1e2542" }}>
            {[
              { v: "1500+", l: "Minimum SAT score · digital scale" },
              { v: "<8%",   l: "Application acceptance rate" },
              { v: "100%",  l: "Currently enrolled at Princeton / Harvard / Yale / MIT / Stanford / Columbia" },
            ].map((s) => (
              <div key={s.l} className="p-7" style={{ background: "#0c1124" }}>
                <div className="font-mono text-[10px] tracking-[0.24em] text-[#7a82a0] mb-3">VETTING</div>
                <div
                  className="mb-3"
                  style={{ fontFamily: "var(--font-fraunces)", fontSize: 44, color: "#e6e9f5", lineHeight: 1 }}
                >
                  {s.v}
                </div>
                <div className="text-[#7a82a0] text-[13px] leading-[1.6]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS — keep magazine spread but recast */}
      {founders.map((f, i) => (
        <section key={f.id} className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden">
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

          <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className={`grid md:grid-cols-12 gap-x-8 gap-y-12 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="md:col-span-5 md:[direction:ltr] relative">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <BgCrescentMoon position={i % 2 === 0 ? "upper-right" : "upper-left"} />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, transparent 60%, rgba(7,9,20,0.85) 100%)" }}
                  />
                  <div className="absolute inset-0 border border-[var(--border)] pointer-events-none" />
                  <div className="absolute top-7 left-7 z-10">
                    <span className="block font-mono text-[var(--text-1)]/80 text-[10px] uppercase tracking-[0.28em]">
                      Founder · {f.school.toUpperCase()}
                    </span>
                    <span className="block w-12 h-px bg-[#7dd3fc]/60 mt-3" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 md:[direction:ltr] relative">
                <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-5">
                  {f.tags.join(" · ").toUpperCase()}
                </p>
                <h2
                  className="font-[family-name:var(--font-cormorant)] italic font-normal text-[var(--text-1)] leading-[0.9] mb-7"
                  style={{ fontSize: "clamp(4.5rem, 10vw, 9rem)" }}
                >
                  {f.name}
                </h2>
                <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.18em] mb-7">
                  {f.school}, Class of {f.classOf} · SAT {f.satScore} · {f.studentsTaught} students taught
                </p>
                <p className="text-[var(--text-2)] text-[16px] leading-[1.8] max-w-[560px] mb-8">
                  {f.bio}
                </p>
                <p className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-1)] text-[20px] leading-[1.5] max-w-[460px] border-l border-[var(--accent)] pl-6 mb-8">
                  &ldquo;{f.pitch}&rdquo;
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/portal/schedule?tutor=${f.id}`}
                    className="inline-flex items-center gap-2 font-mono font-medium px-6 py-3 rounded-[3px] transition-colors hover:brightness-110"
                    style={{ background: "#7dd3fc", color: "#070914", fontSize: 11, letterSpacing: 4 }}
                  >
                    BOOK FREE TRIAL →
                  </Link>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--text-3)]">
                    ${f.rateUSD}/HR · {f.availability.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* THE ROSTER — other tutors */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <BgConstellationGrid />
        <BgFade height={120} />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(7,9,20,0.55) 0%, rgba(7,9,20,0.3) 30%, rgba(7,9,20,0.85) 100%)" }}
        />

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="mb-14 max-w-3xl">
            <span className="block font-mono text-[#7dd3fc] text-[11px] uppercase tracking-[0.24em] mb-4">
              The roster
            </span>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em]"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)" }}
            >
              Plus four{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">classmates from across the Ivy.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {otherTutors.map((t) => (
              <article
                key={t.id}
                id={t.name.toLowerCase()}
                className="p-7 transition-all duration-300 hover:border-[#7dd3fc]/40"
                style={{
                  background: "rgba(12, 17, 36, 0.7)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(30, 37, 66, 1)",
                  borderRadius: 6,
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
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
                        {t.school.toUpperCase()} · CLASS OF {t.classOf}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-[#7a82a0]">SAT</p>
                    <p className="font-mono text-[16px] tabular-nums text-[#7dd3fc]">{t.satScore}</p>
                    {t.videoVerified ? (
                      <span className="mt-2 inline-flex items-center gap-1 text-[#7dd3fc] text-[10px] font-mono tracking-[0.16em]">
                        <ShieldCheck size={11} /> VETTED
                      </span>
                    ) : null}
                  </div>
                </div>

                <p
                  className="italic mb-4"
                  style={{ fontFamily: "var(--font-fraunces)", fontSize: 15, color: "#e6e9f5", lineHeight: 1.45 }}
                >
                  &ldquo;{t.pitch}&rdquo;
                </p>
                <p className="text-[#9aa5b8] text-[14px] leading-[1.7] mb-5">{t.bio}</p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5 font-mono text-[11px] tracking-[0.14em] text-[#7a82a0]">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    {t.studentsTaught} students
                  </span>
                  <span>${t.rateUSD}/hr</span>
                  <span>{t.availability}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono"
                      style={{
                        padding: "4px 10px", border: "1px solid #1e2542", borderRadius: 3,
                        fontSize: 10, letterSpacing: 1.5, color: "#7a82a0",
                      }}
                    >
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

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

      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-left" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(270deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />

        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-xl ml-auto">
            <NyxMark size={64} showRing className="mb-8 opacity-90" />
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-7 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Pick a tutor.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Or let us match you.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Take the 12-minute intake and we&apos;ll shortlist your three best matches. The first
              session is free either way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="/portal/diagnostic" size="lg">Take the intake</CTA>
              <Link
                href="/apply"
                className="group inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] text-[15px] font-medium transition-colors px-3 py-4"
              >
                Or just inquire
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
