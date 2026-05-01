"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight, GraduationCap, Target, BookOpen, Award,
  CheckCircle2, Zap, Users, Shield,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const steps = [
  { n: "01", title: "Submit an Inquiry", body: "Tell us your subject, goals, and test date. Takes two minutes." },
  { n: "02", title: "Free Consultation", body: "A focused 20-minute call to map out your plan." },
  { n: "03", title: "Get Matched", body: "Paired with a tutor who knows your exam and your gaps." },
  { n: "04", title: "Start Prep", body: "Structured sessions, practice plans, weekly progress." },
];

const services = [
  {
    icon: Target,
    label: "SAT Tutoring",
    desc: "Math, Reading, and Writing strategy from students who recently scored in the top percentiles.",
    href: "/sat-act",
  },
  {
    icon: BookOpen,
    label: "ACT Tutoring",
    desc: "Speed, accuracy, and section-specific prep tailored to the ACT format.",
    href: "/sat-act",
  },
  {
    icon: GraduationCap,
    label: "AP Tutoring",
    desc: "10+ subjects covered. AP Calc, Physics, Biology, English, History, and more.",
    href: "/services#ap",
  },
  {
    icon: Award,
    label: "Admissions Consulting",
    desc: "Essay review, brainstorming, school list strategy, and interview prep from students who just got in.",
    href: "/college-admissions",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-[68px]">

        {/* Radial glow — behind everything */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,168,83,0.22) 0%, rgba(212,168,83,0.06) 35%, transparent 65%)",
          }}
        />

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#060912] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 md:py-32">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex"
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d4a853]/25 bg-[#d4a853]/8 text-[#d4a853] text-[12.5px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-pulse" />
              Ivy League+ Tutors · SAT · ACT · AP · Admissions
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.6rem,6vw,5.5rem)] font-bold text-[#f0ece3] leading-[1.07] tracking-tight mb-7 max-w-3xl"
          >
            Elite test prep,{" "}
            <span className="text-gradient">taught by</span>{" "}
            Ivy League+ students.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-[17px] text-[#8d9ab0] leading-relaxed max-w-xl mb-10"
          >
            Nyx Scholars connects ambitious students with high-performing college mentors
            for SAT, ACT, AP, and future college admissions support.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/apply"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold text-[15px] hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:shadow-[0_12px_40px_rgba(212,168,83,0.45)] hover:-translate-y-0.5"
            >
              Book a Free Consultation
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-[#c8d0de] font-semibold text-[15px] hover:border-white/20 hover:bg-white/[0.04] transition-all"
            >
              Explore Services
            </Link>
          </motion.div>

          {/* Trust micro-strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-3"
          >
            {[
              "Princeton · Harvard · Yale",
              "MIT · Columbia · Stanford",
              "1:1 Personalized Sessions",
              "Free Consultation",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2 text-[#4e5d72] text-[12.5px]">
                <CheckCircle2 size={13} className="text-[#d4a853]/60" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ────────────────────────────────────── */}
      <section className="relative border-y border-white/[0.06] bg-[#0b0f1a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
            {[
              { stat: "Ivy League+", label: "Tutor network" },
              { stat: "SAT · ACT · AP", label: "Exams covered" },
              { stat: "1:1 Only", label: "No group classes" },
              { stat: "Free", label: "First consultation" },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-[#0b0f1a] px-8 py-6 flex flex-col justify-center">
                <p className="text-[#f0ece3] font-bold text-xl mb-0.5">{stat}</p>
                <p className="text-[#4e5d72] text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Problem */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            custom={0} variants={fadeUp}
          >
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">
              The Problem
            </p>
            <h2 className="text-[2.1rem] font-bold text-[#f0ece3] leading-tight mb-6 tracking-tight">
              Generic tutoring doesn&apos;t move the needle.
            </h2>
            <p className="text-[#8d9ab0] leading-[1.8] mb-8 text-[15px]">
              Most test prep is recycled material, overpriced packages, and tutors who took the SAT
              a decade ago. The admissions landscape has changed. The tests have changed. Generic prep hasn&apos;t.
            </p>
            <div className="space-y-3.5">
              {[
                "One-size-fits-all prep that ignores individual gaps",
                "Tutors disconnected from today's exams and process",
                "No strategy beyond 'do more practice problems'",
                "Programs that cost thousands but deliver average results",
              ].map((p) => (
                <div key={p} className="flex items-start gap-3.5 p-4 rounded-xl border border-white/[0.05] bg-[#0b0f1a]">
                  <div className="mt-0.5 w-5 h-5 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                  <p className="text-[#8d9ab0] text-[14px] leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            custom={1} variants={fadeUp}
          >
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">
              Our Approach
            </p>
            <h2 className="text-[2.1rem] font-bold text-[#f0ece3] leading-tight mb-6 tracking-tight">
              Tutored by students who just did it.
            </h2>
            <p className="text-[#8d9ab0] leading-[1.8] mb-8 text-[15px]">
              Nyx Scholars tutors are Ivy League+ college students who recently aced the same tests.
              They know what actually works — and they can explain it clearly.
            </p>
            <div className="space-y-3.5">
              {[
                { icon: Zap, text: "Strategies built on real, recent test experience" },
                { icon: Target, text: "Focused prep targeting your specific score gaps" },
                { icon: Users, text: "Clear explanations from people who genuinely get it" },
                { icon: Shield, text: "Full strategy from diagnostic through exam day" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d4a853]/15 bg-[#d4a853]/[0.04]">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#d4a853]/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#d4a853]" />
                  </div>
                  <p className="text-[#c8d0de] text-[14px] leading-relaxed mt-1">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section className="relative py-24 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-4 gold-line">
                Services
              </p>
              <h2 className="text-[2.2rem] font-bold text-[#f0ece3] leading-tight tracking-tight">
                What we offer
              </h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-[#d4a853] text-[13.5px] font-medium hover:text-[#e8c46a] transition-colors shrink-0">
              View all services <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(({ icon: Icon, label, desc, href }) => (
              <Link key={label} href={href} className="group">
                <div className="relative h-full rounded-2xl border border-white/[0.07] bg-[#0f1521] p-6 transition-all duration-300 card-hover">
                  <div className="w-11 h-11 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br from-[#d4a853]/15 to-[#d4a853]/5 border border-[#d4a853]/10 group-hover:from-[#d4a853]/25 group-hover:to-[#d4a853]/10 transition-all">
                    <Icon size={20} className="text-[#d4a853]" />
                  </div>
                  <h3 className="text-[#f0ece3] font-semibold text-[16px] mb-2.5">{label}</h3>
                  <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-[#d4a853] text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-all group-hover:gap-1.5">
                    Learn more <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">
            How It Works
          </p>
          <h2 className="text-[2.2rem] font-bold text-[#f0ece3] tracking-tight">
            From inquiry to first session
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              custom={i} variants={fadeUp}
              className="relative p-6 rounded-2xl border border-white/[0.07] bg-[#0f1521]"
            >
              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[38px] right-0 translate-x-1/2 w-4 h-px bg-gradient-to-r from-[#d4a853]/30 to-[#d4a853]/10 z-10" />
              )}
              <div className="text-[#d4a853]/40 font-black text-4xl font-mono leading-none mb-5 select-none">
                {step.n}
              </div>
              <h3 className="text-[#f0ece3] font-semibold text-[15.5px] mb-2">{step.title}</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TUTOR QUALITY ────────────────────────────────────────── */}
      <section className="relative py-24 border-y border-white/[0.05] overflow-hidden">

        {/* Side glow */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#d4a853]/6 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">
                Our Tutors
              </p>
              <h2 className="text-[2.2rem] font-bold text-[#f0ece3] leading-tight mb-6 tracking-tight">
                Selected for results,<br />not just credentials.
              </h2>
              <p className="text-[#8d9ab0] text-[15px] leading-[1.8] mb-8">
                Every Nyx Scholars tutor is a current student at an Ivy League or top-tier university.
                Chosen for strong academic track records, clear communication, and the ability to
                translate high-level thinking into real prep strategy.
              </p>
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 text-[#d4a853] font-medium text-[14px] hover:text-[#e8c46a] transition-colors"
              >
                Meet the tutors <ArrowRight size={14} />
              </Link>
            </div>

            {/* School badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { school: "Princeton", color: "#e87722" },
                { school: "Harvard", color: "#a51c30" },
                { school: "Yale", color: "#00356b" },
                { school: "MIT", color: "#a31f34" },
                { school: "Columbia", color: "#75aadb" },
                { school: "Stanford", color: "#8c1515" },
              ].map(({ school, color }) => (
                <div
                  key={school}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-[#0f1521] hover:border-white/[0.12] transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-black"
                    style={{ background: `${color}22`, border: `1px solid ${color}30` }}
                  >
                    <span style={{ color: `${color}dd` }}>{school[0]}</span>
                  </div>
                  <div>
                    <p className="text-[#f0ece3] font-semibold text-[13.5px]">{school}</p>
                    <p className="text-[#4e5d72] text-[11.5px]">Active tutors</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="relative py-28 px-5 sm:px-8 overflow-hidden">

        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(212,168,83,0.14) 0%, transparent 60%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
              Get Started
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-[#f0ece3] mb-6 leading-tight tracking-tight">
              Start with a free consultation.
            </h2>
            <p className="text-[#8d9ab0] text-[17px] leading-relaxed mb-10 max-w-xl mx-auto">
              Tell us your goals and test date. We&apos;ll match you with the right tutor and build a plan from there.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/apply"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold text-[15px] hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:shadow-[0_16px_48px_rgba(212,168,83,0.45)] hover:-translate-y-0.5"
              >
                Book Free Consultation
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-[#c8d0de] font-semibold text-[15px] hover:border-white/20 hover:bg-white/[0.04] transition-all"
              >
                Meet the Tutors
              </Link>
            </div>

            <p className="mt-8 text-[#4e5d72] text-[12px]">
              Nyx Scholars does not guarantee test score increases or admissions outcomes.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
