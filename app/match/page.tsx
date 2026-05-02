"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NyxMark } from "@/components/system";
import {
  DIAGNOSTIC_QUESTIONS, POST_DIAGNOSTIC_SKILLS,
  type DiagnosticQuestion, type DiagnosticAnswer,
} from "@/lib/mock/diagnostic";
import { matchTutors, type Tutor } from "@/lib/mock/tutors";

const NIGHT = "#070914";
const NIGHT_2 = "#0c1124";
const NIGHT_3 = "#141a30";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#7a82a0";
const TEXT_FAINT = "#4a5170";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";

type Phase = "welcome" | "calibration" | "running" | "results";
const TOTAL = 8;

/**
 * Public, unauthenticated matchmaking flow. Same diagnostic mechanics as
 * /portal/diagnostic but designed as the primary top-of-funnel conversion
 * path: prospect arrives → 12-min intake → 3 matched tutors → click a
 * tutor → /portal/schedule?tutor=<id> (which auto-prompts signup to
 * confirm the held slot).
 */
export default function MatchPage() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);
  const [theta, setTheta] = useState(0);
  const [ci, setCI] = useState(2.0);

  function recordAnswer(picked: number, ms: number) {
    const q = DIAGNOSTIC_QUESTIONS[questionIndex % DIAGNOSTIC_QUESTIONS.length];
    const correct = picked === q.correct;
    const diff = (q.difficulty - 3) * 0.6;
    const delta = correct
      ? Math.max(0.08, 0.35 - Math.abs(theta - diff) * 0.1)
      : -Math.max(0.08, 0.35 - Math.abs(theta - diff) * 0.1);
    const newTheta = Math.max(-3, Math.min(3, theta + delta));
    const newCI = Math.max(0.18, ci - 0.06);
    setTheta(newTheta);
    setCI(newCI);
    setAnswers((a) => [
      ...a,
      { qid: q.id, picked, correct, ms, theta: newTheta, ci: newCI, skill: q.skill, difficulty: q.difficulty },
    ]);
  }

  function nextQuestion() {
    if (questionIndex >= TOTAL - 1) setPhase("results");
    else setQuestionIndex((i) => i + 1);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: NIGHT, color: TEXT, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <BackgroundStars />
      <TopBar phase={phase} questionIndex={questionIndex} total={TOTAL} theta={theta} ci={ci} />

      {phase === "welcome" && <Welcome onStart={() => setPhase("calibration")} />}
      {phase === "calibration" && <Calibration onContinue={() => setPhase("running")} />}
      {phase === "running" && (
        <Runner
          q={DIAGNOSTIC_QUESTIONS[questionIndex % DIAGNOSTIC_QUESTIONS.length]}
          questionIndex={questionIndex}
          onAnswer={recordAnswer}
          onNext={nextQuestion}
        />
      )}
      {phase === "results" && (
        <Results theta={theta} ci={ci} answers={answers} />
      )}
    </div>
  );
}

function BackgroundStars() {
  const stars = useMemo(() => {
    const arr: { x: number; y: number; s: number; twinkle: boolean }[] = [];
    for (let i = 0; i < 140; i++) {
      const seed = i * 9301 + 49297;
      arr.push({
        x: ((seed * 233 + 1) % 1000) / 1000,
        y: ((seed * 977 + 7) % 1000) / 1000,
        s: ((seed * 7 + 3) % 100) / 100,
        twinkle: i % 6 === 0,
      });
    }
    return arr;
  }, []);
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 35%, #0f1530 0%, #07091a 50%, #03050e 100%)" }}
      />
      <svg width="100%" height="100%" className="fixed inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x * 100}%`}
            cy={`${s.y * 100}%`}
            r={s.s * 0.9 + 0.2}
            fill={TEXT_FAINT}
            opacity={s.s * 0.5 + 0.1}
          >
            {s.twinkle ? (
              <animate
                attributeName="opacity"
                values={`${s.s * 0.3};${s.s * 0.85};${s.s * 0.3}`}
                dur={`${3 + (i % 5)}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        ))}
      </svg>
    </>
  );
}

function TopBar({
  phase, questionIndex, total, theta, ci,
}: {
  phase: Phase;
  questionIndex: number;
  total: number;
  theta: number;
  ci: number;
}) {
  const isRunning = phase === "running" || phase === "calibration";
  return (
    <div
      className="relative z-10 px-6 sm:px-8 py-5 flex items-center justify-between gap-6"
      style={isRunning ? { borderBottom: `1px solid ${LINE}`, background: `${NIGHT}cc`, backdropFilter: "blur(8px)" } : undefined}
    >
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <NyxMark size={22} />
        <span
          className="italic"
          style={{ color: TEXT, fontFamily: "var(--font-fraunces)", fontSize: 17 }}
        >
          Nyx
        </span>
      </Link>

      {isRunning ? (
        <div className="hidden md:flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => {
            const done = i < questionIndex;
            const current = i === questionIndex;
            return (
              <div
                key={i}
                style={{
                  width: current ? 14 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: done ? MOON : current ? MOON_HI : NIGHT_3,
                  boxShadow: current ? `0 0 6px ${MOON_HI}` : "none",
                  transition: "all 0.3s",
                }}
              />
            );
          })}
        </div>
      ) : null}

      <div className="font-mono text-[10px] tracking-[0.32em]" style={{ color: phase === "results" ? MOON : TEXT_DIM }}>
        {phase === "welcome" && "INTAKE · MATCH"}
        {phase === "calibration" && "CALIBRATING…"}
        {phase === "running" && `QUESTION ${questionIndex + 1} / ${total}`}
        {phase === "results" && "● MATCHED"}
      </div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative z-10 max-w-[700px] mx-auto px-6 sm:px-8 py-16 sm:py-24 text-center">
      <div className="font-mono text-[10px] tracking-[0.42em]" style={{ color: MOON }}>
        FREE · NO ACCOUNT NEEDED
      </div>
      <h1
        className="mt-6 mb-0 font-light leading-[1.05]"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
          color: TEXT,
        }}
      >
        Get matched with{" "}
        <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: MOON }}>
          your tutor
        </span>{" "}
        in 12 minutes.
      </h1>
      <p className="mt-7 leading-[1.7] max-w-xl mx-auto" style={{ fontSize: 17, color: TEXT_DIM }}>
        Eight quick adaptive questions. We use them to shortlist the three Ivy tutors who best
        cover your gaps and fit your schedule. Your free 30-minute trial is with one of them.
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-12 text-left"
        style={{ background: LINE, border: `1px solid ${LINE}` }}
      >
        {[
          { n: "01", t: "It adapts", d: "Each question is chosen for the edge of what you know — fast and accurate." },
          { n: "02", t: "Tutors are vetted", d: "Every tutor scored 1500+ on the SAT. Acceptance rate under 8%." },
          { n: "03", t: "Free trial", d: "Your first 30-minute video session is on us. No card on file." },
        ].map((p) => (
          <div key={p.n} style={{ background: NIGHT_2, padding: 22 }}>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: 4, color: MOON, marginBottom: 10 }}>{p.n}</div>
            <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, color: TEXT }}>{p.t}</div>
            <div className="mt-2 leading-[1.5]" style={{ fontSize: 12, color: TEXT_DIM }}>{p.d}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="mt-12 cursor-pointer font-mono font-medium hover:brightness-110 transition-all"
        style={{
          padding: "18px 48px",
          background: MOON,
          border: "none",
          color: NIGHT,
          fontSize: 12,
          letterSpacing: 4,
          borderRadius: 3,
        }}
      >
        BEGIN INTAKE →
      </button>
      <div className="mt-3 font-mono" style={{ fontSize: 10, color: TEXT_FAINT, letterSpacing: 2 }}>
        ESTIMATED TIME · 12 MINUTES · PAUSE ANYTIME
      </div>

      <div className="mt-14 pt-8 border-t border-[#1e2542]/60 text-[12px] text-[#7a82a0]">
        Already know what you need?{" "}
        <Link href="/tutors" className="text-[#7dd3fc] hover:text-[#bde9ff] transition-colors">
          Browse tutors directly →
        </Link>
      </div>
    </div>
  );
}

function Calibration({ onContinue }: { onContinue: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => {
        if (step < 2) setStep((s) => s + 1);
        else onContinue();
      },
      step === 0 ? 1500 : step === 1 ? 1800 : 1500,
    );
    return () => clearTimeout(t);
  }, [step, onContinue]);

  return (
    <div className="relative z-10 min-h-[600px] flex items-center justify-center">
      <div className="text-center max-w-[480px] px-6">
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid place-items-center"
              style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `1px solid ${step >= i ? MOON : LINE}`,
                background: step >= i ? `${MOON}22` : "transparent",
                transition: "all 0.4s",
              }}
            >
              <div
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: step >= i ? MOON_HI : LINE,
                  boxShadow: step >= i ? `0 0 8px ${MOON}` : "none",
                  transition: "all 0.4s",
                }}
              />
            </div>
          ))}
        </div>
        <div className="mb-4 font-mono" style={{ fontSize: 10, letterSpacing: 6, color: MOON }}>CALIBRATING</div>
        <div className="italic leading-[1.2]" style={{ fontFamily: "var(--font-fraunces)", fontSize: 30, color: TEXT }}>
          {step === 0 && "Setting your range…"}
          {step === 1 && "Probing the edges…"}
          {step === 2 && "Tuning the engine."}
        </div>
        <p className="mt-4 leading-[1.6]" style={{ fontSize: 13, color: TEXT_DIM }}>
          The first few questions span the difficulty spectrum so we find your starting point fast.
        </p>
      </div>
    </div>
  );
}

function Runner({
  q, questionIndex, onAnswer, onNext,
}: {
  q: DiagnosticQuestion;
  questionIndex: number;
  onAnswer: (picked: number, ms: number) => void;
  onNext: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setPicked(null);
    setSubmitted(false);
    setStartTime(Date.now());
  }, [questionIndex]);

  function submit() {
    if (picked === null || submitted) return;
    setSubmitted(true);
    onAnswer(picked, Date.now() - startTime);
    setTimeout(() => onNext(), 700);
  }

  return (
    <div className="relative z-10 max-w-[760px] mx-auto px-6 sm:px-8 py-12">
      <div
        className="flex justify-between items-baseline pb-4 flex-wrap gap-3"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        <div className="flex gap-4 items-baseline flex-wrap">
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: 4, color: TEXT_DIM }}>
            {q.section.toUpperCase()}
          </span>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: 4, color: MOON }}>
            {q.skill.toUpperCase()}
          </span>
          <DiffPips d={q.difficulty} />
        </div>
      </div>
      <div className="mt-3.5 italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 11, color: TEXT_FAINT }}>
        We&rsquo;re probing your ability around the edge of{" "}
        <span style={{ color: MOON }}>{q.skill.toLowerCase()}</span>.
      </div>

      <div
        className="mt-7 whitespace-pre-wrap"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, lineHeight: 1.5, color: TEXT }}
      >
        {q.prompt}
      </div>

      <div className="flex flex-col gap-2.5 mt-8">
        {q.choices.map((c, i) => {
          const isPicked = picked === i;
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setPicked(i)}
              className="text-left flex items-start gap-3.5 transition-all"
              style={{
                padding: "16px 18px",
                background: isPicked ? `${MOON}1a` : NIGHT_2,
                border: `1px solid ${isPicked ? MOON : LINE}`,
                borderRadius: 4,
                cursor: submitted ? "default" : "pointer",
                color: TEXT,
              }}
            >
              <span
                className="grid place-items-center font-mono shrink-0"
                style={{
                  width: 22, height: 22,
                  border: `1px solid ${isPicked ? MOON : TEXT_FAINT}`,
                  background: isPicked ? MOON : "transparent",
                  color: isPicked ? NIGHT : TEXT_DIM,
                  fontSize: 11, letterSpacing: 1, borderRadius: 2,
                  marginTop: 1,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5 }}>{c}</span>
            </button>
          );
        })}
      </div>

      <div
        className="flex justify-between items-center mt-8 pt-5 gap-4 flex-wrap"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 11, color: TEXT_DIM }}>
          {submitted ? "Recording…" : picked === null ? "Choose an answer to continue." : "Confirm to submit."}
        </div>
        <button
          onClick={submit}
          disabled={picked === null || submitted}
          className="font-mono font-medium transition-colors"
          style={{
            padding: "12px 28px",
            background: picked !== null ? MOON : NIGHT_3,
            border: "none",
            color: picked !== null ? NIGHT : TEXT_FAINT,
            fontSize: 11, letterSpacing: 4, borderRadius: 3,
            cursor: picked !== null && !submitted ? "pointer" : "not-allowed",
          }}
        >
          {submitted ? "RECORDED" : "CONFIRM →"}
        </button>
      </div>
    </div>
  );
}

function DiffPips({ d }: { d: number }) {
  return (
    <span className="font-mono inline-flex items-baseline gap-1" style={{ fontSize: 10, letterSpacing: 2, color: TEXT_FAINT }}>
      DIFFICULTY
      <span className="inline-flex gap-0.5 ml-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: i <= d ? MOON : NIGHT_3,
              boxShadow: i <= d ? `0 0 3px ${MOON}` : "none",
            }}
          />
        ))}
      </span>
    </span>
  );
}

function Results({ theta, ci, answers }: { theta: number; ci: number; answers: DiagnosticAnswer[] }) {
  const [revealStep, setRevealStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStep(1), 400),
      setTimeout(() => setRevealStep(2), 1200),
      setTimeout(() => setRevealStep(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const score = Math.round(1200 + theta * 130);
  const ciScore = Math.round(ci * 60);
  const skills = POST_DIAGNOSTIC_SKILLS;
  const gaps = [...skills].sort((a, b) => a.mastery - b.mastery).slice(0, 3);

  const weakSkillIds = useMemo(() => {
    const skillToId: Record<string, string> = {
      "Quadratics": "quad",
      "Polynomials": "poly",
      "Trigonometry": "cent",
      "Rational expressions": "rat",
      "Inference": "eye-r",
      "Command of evidence": "beak",
      "Rhetorical synthesis": "plume",
      "Punctuation": "shaft1",
    };
    const ids = new Set<string>();
    answers.filter((a) => !a.correct).forEach((a) => {
      const id = skillToId[a.skill];
      if (id) ids.add(id);
    });
    if (ids.size === 0) {
      ids.add("quad");
      ids.add("cent");
      ids.add("plume");
    }
    return Array.from(ids);
  }, [answers]);

  const matched: Tutor[] = useMemo(() => matchTutors(weakSkillIds, 3), [weakSkillIds]);

  return (
    <div className="relative z-10 max-w-[1180px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <div
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: 6, color: MOON, opacity: revealStep >= 1 ? 1 : 0, transition: "opacity 0.6s" }}
        >
          INTAKE COMPLETE · 3 MATCHES
        </div>
        <h1
          className="font-light mt-4 mb-0 leading-[1.05]"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
            color: TEXT,
            opacity: revealStep >= 1 ? 1 : 0,
            transform: `translateY(${revealStep >= 1 ? 0 : 12}px)`,
            transition: "all 0.7s ease-out",
          }}
        >
          Starting score{" "}
          <span style={{ fontStyle: "italic", color: MOON, fontFamily: "var(--font-cormorant)" }}>{score}</span>
          <span className="ml-2" style={{ fontSize: 22, color: TEXT_DIM }}>± {ciScore}</span>
        </h1>
        <p
          className="mt-3 max-w-2xl mx-auto"
          style={{
            fontSize: 15, color: TEXT_DIM, lineHeight: 1.6,
            opacity: revealStep >= 1 ? 1 : 0,
            transition: "opacity 0.7s 0.2s",
          }}
        >
          Below are the three tutors whose specialties best cover your gaps. Pick one and book your
          free 30-minute trial — we&apos;ll set up your account when you confirm.
        </p>
      </div>

      <div
        className="grid md:grid-cols-3 gap-4"
        style={{
          opacity: revealStep >= 2 ? 1 : 0,
          transform: `translateY(${revealStep >= 2 ? 0 : 16}px)`,
          transition: "all 0.8s 0.2s",
        }}
      >
        {matched.map((t, i) => (
          <TutorMatchCard key={t.id} tutor={t} weakSkills={gaps.map((g) => g.name)} primary={i === 0} />
        ))}
      </div>

      <div
        className="mt-12 pt-8 border-t border-[#1e2542]/60 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-mono tracking-[0.18em]"
        style={{
          color: TEXT_DIM,
          opacity: revealStep >= 3 ? 1 : 0,
          transition: "opacity 0.7s 0.2s",
        }}
      >
        <span>● 1500+ SAT MINIMUM</span>
        <span>● {"<"}8% ACCEPTANCE</span>
        <span>● ALL CURRENTLY ENROLLED IVY</span>
        <span>● FREE TRIAL · NO CARD</span>
      </div>

      <div
        className="mt-10 text-center"
        style={{ opacity: revealStep >= 3 ? 1 : 0, transition: "opacity 0.7s 0.4s" }}
      >
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-1)] text-[12px] font-medium transition-colors group font-mono uppercase tracking-[0.24em]"
        >
          See the full roster
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function TutorMatchCard({ tutor, weakSkills, primary }: { tutor: Tutor; weakSkills: string[]; primary?: boolean }) {
  return (
    <article
      className="p-5 flex flex-col"
      style={{
        background: NIGHT_2,
        border: `1px solid ${primary ? MOON : MOON_DIM}`,
        borderRadius: 4,
        boxShadow: primary ? `0 0 32px ${MOON}33` : `0 0 16px ${MOON}11`,
      }}
    >
      {primary ? (
        <div
          className="font-mono mb-4 self-start"
          style={{
            fontSize: 9, letterSpacing: 3, color: MOON_HI,
            background: `${MOON}22`, border: `1px solid ${MOON}`,
            padding: "3px 8px", borderRadius: 2,
          }}
        >
          ★ BEST MATCH
        </div>
      ) : null}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center shrink-0"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: NIGHT_3, border: `1px solid ${MOON_DIM}`,
              fontFamily: "var(--font-fraunces)", fontSize: 14, color: TEXT,
            }}
          >
            {tutor.name[0]}
          </div>
          <div>
            <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 18, color: TEXT }}>
              {tutor.name}
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
              {tutor.school.toUpperCase()} · &lsquo;{String(tutor.classOf).slice(2)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>SAT</div>
          <div className="font-mono tabular-nums" style={{ fontSize: 14, color: MOON }}>{tutor.satScore}</div>
        </div>
      </div>
      <p className="italic mb-3" style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, color: TEXT, lineHeight: 1.4 }}>
        &ldquo;{tutor.pitch}&rdquo;
      </p>
      <p className="mb-4" style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>
        {tutor.bio}
      </p>
      <div className="font-mono mb-4" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
        SPECIALISES IN <span style={{ color: MOON }}>{weakSkills.slice(0, 2).join(" · ")}</span>
      </div>
      <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>STUDENTS</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: TEXT }}>{tutor.studentsTaught}</div>
          </div>
          <div className="text-right">
            <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>RATE</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: TEXT }}>${tutor.rateUSD}<span style={{ fontSize: 11, color: TEXT_DIM }}>/hr</span></div>
          </div>
        </div>
        <Link
          href={`/portal/schedule?tutor=${tutor.id}`}
          className="block text-center font-mono font-medium transition-all hover:brightness-110"
          style={{
            padding: 12,
            background: primary ? MOON_HI : MOON,
            color: NIGHT,
            fontSize: 11,
            letterSpacing: 4,
            borderRadius: 3,
          }}
        >
          BOOK FREE TRIAL →
        </Link>
      </div>
    </article>
  );
}
