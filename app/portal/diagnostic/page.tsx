"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NyxMark } from "@/components/system";
import {
  POST_DIAGNOSTIC_SKILLS,
  type DiagnosticAnswer,
} from "@/lib/mock/diagnostic";
import {
  POOL,
  initState,
  applyAnswer,
  selectNext,
  type AdaptiveState,
  type BankQuestion,
} from "@/lib/diagnostic";
import { matchTutors, HOURLY_RATE_USD, type Tutor } from "@/lib/mock/tutors";

/** A diagnostic question shape compatible with the existing Runner UI. */
type DiagnosticQuestion = BankQuestion;

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

type Phase = "welcome" | "calibration" | "running" | "paused" | "results";

const TOTAL = 14;

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [pool, setPool] = useState<BankQuestion[]>(POOL);
  const [state, setState] = useState<AdaptiveState>(() => initState());
  const [current, setCurrent] = useState<BankQuestion | null>(() => selectNext(initState(), POOL));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([]);

  // Optionally fold in admin-curated DB items once on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/diagnostic/pool")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (cancelled || !d?.pool) return;
        const merged: BankQuestion[] = d.pool;
        setPool(merged);
        setCurrent((cur) => cur ?? selectNext(initState(), merged));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  function recordAnswer(picked: number, ms: number) {
    if (!current) return;
    const correct = picked === current.correct;
    // Compute next state synchronously so the setTimeout below sees fresh
    // values — avoids the stale-closure bug that caused question repeats.
    const next = applyAnswer(state, current, correct);
    const capturedIndex = questionIndex;
    const capturedPool = pool;

    setState(next);
    setAnswers((a) => [
      ...a,
      {
        qid: current.id, picked, correct, ms,
        theta: next.theta, ci: next.ci,
        skill: current.skill, difficulty: current.difficulty,
      },
    ]);

    fetch("/api/diagnostic/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: current.id,
        skill_id: current.skillId,
        picked_index: picked,
        correct,
        ms,
        theta_after: next.theta,
        ci_after: next.ci,
      }),
    }).catch(() => {});

    // Advance after the brief "Recording…" feedback delay.
    // Uses `next` (fresh) so asked-set is up-to-date — no repeats.
    setTimeout(() => {
      if (capturedIndex >= TOTAL - 1) {
        finalizeWithState(next, capturedIndex + 1);
        return;
      }
      const nxt = selectNext(next, capturedPool);
      if (!nxt) {
        finalizeWithState(next, capturedIndex + 1);
        return;
      }
      setCurrent(nxt);
      setQuestionIndex(capturedIndex + 1);
    }, 700);
  }

  function finalizeWithState(freshState: AdaptiveState, count: number) {
    setPhase("results");
    const perSkill: Record<string, number> = {};
    for (const skillId of Object.keys(freshState.skillTheta)) {
      const t = freshState.skillTheta[skillId];
      const m = 1 / (1 + Math.exp(-1.7 * t));
      perSkill[skillId] = Math.max(0, Math.min(1, m));
    }
    const predictedScore = Math.round(1200 + freshState.theta * 130);
    void fetch("/api/portal/diagnostic-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theta: freshState.theta,
        ci: freshState.ci,
        questionsAsked: count,
        predictedScore,
        perSkill,
      }),
    }).catch(() => {});
  }

  function reset() {
    const fresh = initState();
    setPhase("welcome");
    setQuestionIndex(0);
    setAnswers([]);
    setState(fresh);
    setCurrent(selectNext(fresh, pool));
  }

  return (
    <div
      className="-mx-5 md:-mx-8 -my-7 md:-my-9 relative h-[calc(100dvh-56px)] md:h-[calc(100vh-0px)] min-h-[680px] overflow-hidden"
      style={{ background: NIGHT, color: TEXT, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <BackgroundStars />
      <TopChrome
        phase={phase}
        questionIndex={questionIndex}
        total={TOTAL}
        theta={state.theta}
        ci={state.ci}
        onPause={() => setPhase("paused")}
      />

      {phase === "welcome" && <Welcome onStart={() => setPhase("calibration")} />}
      {phase === "calibration" && <Calibration onContinue={() => setPhase("running")} />}
      {phase === "running" && current && (
        <Runner
          q={current}
          questionIndex={questionIndex}
          onAnswer={recordAnswer}
        />
      )}
      {phase === "paused" && <Paused onResume={() => setPhase("running")} />}
      {phase === "results" && (
        <Results theta={state.theta} ci={state.ci} answers={answers} onRestart={reset} />
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Background Stars
 * ─────────────────────────────────────────────────────────── */
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
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, #0f1530 0%, #07091a 50%, #03050e 100%)",
        }}
      />
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
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

/* ───────────────────────────────────────────────────────────
 * Top Chrome — varies by phase
 * ─────────────────────────────────────────────────────────── */
function TopChrome({
  phase, questionIndex, total, theta, ci, onPause,
}: {
  phase: Phase;
  questionIndex: number;
  total: number;
  theta: number;
  ci: number;
  onPause: () => void;
}) {
  if (phase === "welcome" || phase === "paused") {
    return (
      <div className="absolute top-0 left-0 right-0 px-8 py-5 flex justify-between items-center z-10">
        <Logo />
        <div className="font-mono text-[10px] tracking-[0.32em]" style={{ color: TEXT_DIM }}>
          INTAKE · CALIBRATION
        </div>
      </div>
    );
  }
  if (phase === "results") {
    return (
      <div className="absolute top-0 left-0 right-0 px-8 py-5 flex justify-between items-center z-10">
        <Logo />
        <div className="font-mono text-[10px] tracking-[0.32em]" style={{ color: MOON }}>
          ● MATCHED
        </div>
      </div>
    );
  }
  return (
    <div
      className="absolute top-0 left-0 right-0 px-8 py-4 z-10 grid items-center gap-8 backdrop-blur"
      style={{
        gridTemplateColumns: "1fr auto 1fr",
        borderBottom: `1px solid ${LINE}`,
        background: `${NIGHT}e6`,
      }}
    >
      <div className="flex items-center gap-4">
        <Logo />
        <div
          className="font-mono pl-4 text-[10px] tracking-[0.32em]"
          style={{ color: TEXT_DIM, borderLeft: `1px solid ${LINE}` }}
        >
          INTAKE · QUESTION {questionIndex + 1} / {total}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
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
        <span
          className="ml-3 font-mono tabular-nums"
          style={{ fontSize: 10, letterSpacing: 2, color: TEXT_DIM }}
        >
          {String(questionIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="flex justify-end items-center gap-4">
        <SignalIndicator theta={theta} ci={ci} />
        <button
          onClick={onPause}
          className="cursor-pointer font-mono"
          style={{
            padding: "8px 14px",
            background: "transparent",
            border: `1px solid ${LINE}`,
            color: TEXT_DIM,
            fontSize: 10,
            letterSpacing: 3,
            borderRadius: 3,
          }}
        >
          PAUSE
        </button>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <NyxMark size={22} />
      <div
        className="italic"
        style={{ color: TEXT, fontFamily: "var(--font-fraunces)", fontSize: 17 }}
      >
        Nyx
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Signal Indicator — CI converging on theta
 * ─────────────────────────────────────────────────────────── */
function SignalIndicator({ theta, ci }: { theta: number; ci: number }) {
  const norm = (v: number) => Math.max(0, Math.min(1, (v + 3) / 6));
  const center = norm(theta);
  const left = norm(theta - ci);
  const right = norm(theta + ci);
  const trackW = 200;
  const confidence = Math.max(0, Math.min(100, Math.round((1 - ci / 2) * 100)));

  return (
    <div className="flex items-center gap-3.5">
      <div className="text-right">
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_DIM }}>SIGNAL</div>
        <div
          className="mt-0.5 font-mono tabular-nums"
          style={{ fontSize: 11, color: MOON, letterSpacing: 1 }}
        >
          {confidence}% ± {Math.round(ci * 65)}
        </div>
      </div>
      <div className="relative flex items-center" style={{ width: trackW, height: 24 }}>
        <div className="absolute left-0 right-0 h-px" style={{ background: LINE }} />
        <div
          className="absolute"
          style={{
            left: `${left * 100}%`,
            width: `${(right - left) * 100}%`,
            height: 4,
            background: MOON,
            opacity: 0.25,
            borderRadius: 2,
            transition: "all 0.4s ease-out",
          }}
        />
        <div
          className="absolute"
          style={{
            left: `calc(${center * 100}% - 1px)`,
            width: 2,
            height: 14,
            background: MOON_HI,
            boxShadow: `0 0 6px ${MOON}`,
            transition: "all 0.4s ease-out",
          }}
        />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Welcome
 * ─────────────────────────────────────────────────────────── */
function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 overflow-y-auto">
      <div className="max-w-[640px] py-24 text-center">
        <div className="font-mono text-[10px] tracking-[0.42em]" style={{ color: MOON }}>
          STEP ONE · INTAKE
        </div>
        <h1
          className="mt-6 mb-0 font-light leading-[1.1]"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            color: TEXT,
          }}
        >
          Let&rsquo;s find your{" "}
          <span style={{ fontStyle: "italic", color: MOON }}>true</span>{" "}
          starting point.
        </h1>
        <p className="mt-6 leading-[1.7]" style={{ fontSize: 16, color: TEXT_DIM }}>
          Eight quick questions. Adaptive — they tune to your level. We use this to match you with
          the right Ivy tutor and to give them a head start on your first session.
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-12 text-left"
          style={{ background: LINE, border: `1px solid ${LINE}` }}
        >
          {[
            { n: "01", t: "It adapts", d: "Each question is chosen for the edge of what you know." },
            { n: "02", t: "Tutors see it", d: "Your matched tutor receives a privacy-aware summary." },
            { n: "03", t: "Pause anytime", d: "Nothing is graded. Come back whenever you want." },
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
          className="mt-10 cursor-pointer font-mono font-medium hover:brightness-110 transition-all"
          style={{
            padding: "16px 44px",
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
          ESTIMATED TIME · 12 MINUTES
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Calibration
 * ─────────────────────────────────────────────────────────── */
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
    <div className="absolute inset-0 flex items-center justify-center">
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
          The first questions span the difficulty spectrum so we find your starting point fast.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Question Runner
 * ─────────────────────────────────────────────────────────── */
function Runner({
  q, questionIndex, onAnswer,
}: {
  q: DiagnosticQuestion;
  questionIndex: number;
  onAnswer: (picked: number, ms: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setPicked(null);
    setSubmitted(false);
    setElapsed(0);
    setStartTime(Date.now());
  }, [questionIndex]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [questionIndex]);

  function submit() {
    if (picked === null || submitted) return;
    setSubmitted(true);
    onAnswer(picked, Date.now() - startTime);
  }

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="absolute inset-0 pt-20 pb-6 flex flex-col">
      <div className="flex-1 flex justify-center px-6 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-[760px]">
          <div
            className="flex justify-between items-baseline pb-4"
            style={{ borderBottom: `1px solid ${LINE}` }}
          >
            <div className="flex gap-4 sm:gap-5 items-baseline flex-wrap">
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: 4, color: TEXT_DIM }}>
                {q.section.toUpperCase()}
              </span>
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: 4, color: MOON }}>
                {q.skill.toUpperCase()}
              </span>
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: 2, color: TEXT_FAINT }}>
                DIFFICULTY <DiffPips d={q.difficulty} />
              </span>
            </div>
            <div className="font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 1 }}>
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
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
      </div>
    </div>
  );
}

function DiffPips({ d }: { d: number }) {
  return (
    <span className="inline-flex gap-0.5 ml-1.5 align-middle">
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
  );
}

/* ───────────────────────────────────────────────────────────
 * Paused
 * ─────────────────────────────────────────────────────────── */
function Paused({ onResume }: { onResume: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-center px-6">
      <div>
        <div className="font-mono" style={{ fontSize: 10, letterSpacing: 6, color: MOON, marginBottom: 14 }}>PAUSED</div>
        <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 36, color: TEXT }}>
          The sky waits.
        </div>
        <p className="mt-4 leading-[1.6] mx-auto" style={{ fontSize: 13, color: TEXT_DIM, maxWidth: 380 }}>
          Your progress is saved. Pick up where you left off whenever you&rsquo;re ready.
        </p>
        <button
          onClick={onResume}
          className="mt-7 cursor-pointer font-mono font-medium"
          style={{
            padding: "14px 36px",
            background: MOON,
            border: "none",
            color: NIGHT,
            fontSize: 11,
            letterSpacing: 4,
            borderRadius: 3,
          }}
        >
          RESUME →
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Results — score reveal + matched tutors (the matchmaking pivot)
 * ─────────────────────────────────────────────────────────── */
function Results({
  theta, ci, answers, onRestart,
}: {
  theta: number;
  ci: number;
  answers: DiagnosticAnswer[];
  onRestart: () => void;
}) {
  const [revealStep, setRevealStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStep(1), 600),
      setTimeout(() => setRevealStep(2), 1600),
      setTimeout(() => setRevealStep(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const score = Math.round(1200 + theta * 130);
  const ciScore = Math.round(ci * 60);

  const skills = POST_DIAGNOSTIC_SKILLS;
  const gaps = [...skills].sort((a, b) => a.mastery - b.mastery).slice(0, 3);

  // Matchmaking — derive weak skill ids from the most-missed question skills
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
    <div className="absolute inset-0 pt-20 pb-12 flex flex-col overflow-y-auto">
      <div className="flex-none text-center px-6 sm:px-8 pt-10 pb-5">
        <div
          className="font-mono"
          style={{ fontSize: 10, letterSpacing: 6, color: MOON, opacity: revealStep >= 1 ? 1 : 0, transition: "opacity 0.6s" }}
        >
          INTAKE COMPLETE
        </div>
        <h1
          className="font-light mt-4 mb-0 leading-[1.05]"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(2.6rem, 5.5vw, 4rem)",
            color: TEXT,
            opacity: revealStep >= 1 ? 1 : 0,
            transform: `translateY(${revealStep >= 1 ? 0 : 12}px)`,
            transition: "all 0.7s ease-out",
          }}
        >
          Estimated range{" "}
          <span style={{ fontStyle: "italic", color: MOON }}>~{score}</span>
        </h1>
        <p
          className="mt-3"
          style={{
            fontSize: 14, color: TEXT_DIM,
            opacity: revealStep >= 1 ? 1 : 0,
            transition: "opacity 0.7s 0.2s",
          }}
        >
          Rough estimate from {answers.length} answered questions. Your tutor will refine this in your first session.
        </p>
      </div>

      {/* Sky reveal strip */}
      <div className="flex-none px-6 sm:px-8">
        <RevealSky revealStep={revealStep} skills={skills} />
      </div>

      {/* Matched tutors — the actual product output */}
      <div
        className="px-6 sm:px-8 pt-10 mx-auto w-full"
        style={{
          maxWidth: 1180,
          opacity: revealStep >= 3 ? 1 : 0,
          transform: `translateY(${revealStep >= 3 ? 0 : 16}px)`,
          transition: "all 0.8s 0.2s",
        }}
      >
        <div className="flex justify-between items-baseline mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: 6, color: MOON }}>
              YOUR THREE BEST MATCHES
            </div>
            <h2
              className="font-light mt-2"
              style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, color: TEXT }}
            >
              Tutors who specialise in your gaps.
            </h2>
          </div>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: 3, color: TEXT_DIM }}>
            FREE FIRST SESSION · 30 MIN
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {matched.map((t, i) => (
            <TutorMatchCard key={t.id} tutor={t} weakSkills={gaps.map((g) => g.name)} index={i} />
          ))}
        </div>
      </div>

      <div
        className="mt-8 px-6 sm:px-8 flex flex-wrap justify-center gap-3"
        style={{ opacity: revealStep >= 3 ? 1 : 0, transition: "opacity 0.8s 0.4s" }}
      >
        <Link
          href="/tutors"
          className="font-mono"
          style={{
            padding: "10px 16px", background: "transparent", color: TEXT_DIM,
            border: `1px solid ${LINE}`, fontSize: 10, letterSpacing: 3, borderRadius: 3,
          }}
        >
          SEE VETTING PROCESS →
        </Link>
        <button
          onClick={onRestart}
          className="font-mono cursor-pointer"
          style={{
            padding: "10px 16px", background: "transparent", color: TEXT_DIM,
            border: `1px solid ${LINE}`, fontSize: 10, letterSpacing: 3, borderRadius: 3,
          }}
        >
          RETAKE INTAKE
        </button>
        <Link
          href="/portal/consultation"
          className="font-mono"
          style={{
            padding: "10px 16px", background: "transparent", color: TEXT_DIM,
            border: `1px solid ${LINE}`, fontSize: 10, letterSpacing: 3, borderRadius: 3,
          }}
        >
          GO TO YOUR SKY
        </Link>
      </div>
    </div>
  );
}

function TutorMatchCard({ tutor, weakSkills, index }: { tutor: Tutor; weakSkills: string[]; index: number }) {
  return (
    <article
      className="p-5 flex flex-col"
      style={{
        background: NIGHT_2, border: `1px solid ${MOON_DIM}`, borderRadius: 4,
        boxShadow: `0 0 24px ${MOON}22`,
      }}
    >
      <div className="mb-4">
        <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 3 }}>
          MATCH {String(index + 1).padStart(2, "0")}
        </div>
        <div
          className="italic mt-1"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT, lineHeight: 1 }}
        >
          {tutor.school} undergrad
        </div>
        <div className="font-mono mt-1.5" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
          CLASS OF {tutor.classOf}
        </div>
      </div>
      <p className="mb-4 leading-[1.6]" style={{ fontSize: 13, color: TEXT_DIM }}>
        Vetted via the four-step process — verified 1500+ SAT, currently enrolled, passed the
        teaching audition.
      </p>
      <div className="font-mono mb-4" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
        SPECIALISES IN <span style={{ color: MOON }}>{weakSkills.slice(0, 2).join(" · ")}</span>
      </div>
      <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>AVAILABLE</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 13, color: TEXT, lineHeight: 1.3 }}>{tutor.availability.split(" · ")[0]}</div>
          </div>
          <div className="text-right">
            <div className="font-mono" style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: 2 }}>RATE</div>
            <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: TEXT }}>${HOURLY_RATE_USD}<span style={{ fontSize: 11, color: TEXT_DIM }}>/hr</span></div>
          </div>
        </div>
        <Link
          href={`/portal/schedule?tutor=${tutor.id}`}
          className="block text-center font-mono font-medium hover:brightness-110 transition-all"
          style={{
            padding: 12, background: MOON, color: NIGHT,
            fontSize: 11, letterSpacing: 4, borderRadius: 3,
          }}
        >
          BOOK FREE TRIAL →
        </Link>
        <p className="mt-3 text-center font-mono" style={{ fontSize: 9, letterSpacing: 1.5, color: TEXT_FAINT }}>
          You meet your tutor at the trial.
        </p>
      </div>
    </article>
  );
}

function RevealSky({ revealStep, skills }: { revealStep: number; skills: typeof POST_DIAGNOSTIC_SKILLS }) {
  const w = 900;
  const h = 200;
  const positions = [
    { x: 0.08, y: 0.5 }, { x: 0.22, y: 0.3 }, { x: 0.34, y: 0.65 },
    { x: 0.48, y: 0.4 }, { x: 0.6, y: 0.7 }, { x: 0.74, y: 0.35 }, { x: 0.88, y: 0.55 },
  ];
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: "100%", maxWidth: 900, height: 200,
        background: NIGHT_2, border: `1px solid ${LINE}`, borderRadius: 4,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #11183a 0%, #07091a 70%, #03050e 100%)" }}
      />
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        {revealStep >= 2 &&
          positions.map((p, i) => {
            if (i === 0) return null;
            const prev = positions[i - 1];
            return (
              <line
                key={i}
                x1={prev.x * w}
                y1={prev.y * h}
                x2={p.x * w}
                y2={p.y * h}
                stroke={MOON_DIM}
                strokeWidth="0.5"
                opacity="0.6"
                style={{ animation: `nyxRevealFade 0.6s ${i * 0.08}s both` }}
              />
            );
          })}
        {positions.map((p, i) => {
          const skill = skills[i];
          const m = skill ? skill.mastery : 0.5;
          const lit = revealStep >= 2;
          const r = 1.5 + m * 4;
          const glow = 6 + m * 18;
          const color = m > 0.65 ? MOON_HI : m > 0.35 ? MOON : MOON_DIM;
          return (
            <g
              key={i}
              opacity={lit ? 1 : 0}
              style={{ transition: `opacity 0.5s ${0.2 + i * 0.12}s` }}
            >
              <circle cx={p.x * w} cy={p.y * h} r={glow} fill={color} opacity={m * 0.18} />
              <circle cx={p.x * w} cy={p.y * h} r={r * 1.6} fill={color} opacity={0.4} />
              <circle cx={p.x * w} cy={p.y * h} r={r} fill={color} />
              <line x1={p.x * w - r * 3} y1={p.y * h} x2={p.x * w + r * 3} y2={p.y * h} stroke={color} strokeWidth="0.4" opacity="0.6" />
              <line x1={p.x * w} y1={p.y * h - r * 3} x2={p.x * w} y2={p.y * h + r * 3} stroke={color} strokeWidth="0.4" opacity="0.6" />
            </g>
          );
        })}
      </svg>
      <style>{`@keyframes nyxRevealFade { from { opacity: 0 } to { opacity: 0.6 } }`}</style>
      {revealStep >= 2 ? (
        <div
          className="absolute bottom-3 left-0 right-0 text-center font-mono"
          style={{
            fontSize: 10, letterSpacing: 4, color: TEXT_DIM,
            opacity: revealStep >= 3 ? 1 : 0, transition: "opacity 0.6s",
          }}
        >
          7 STARS LIT · YOUR SKY HAS BEGUN
        </div>
      ) : null}
    </div>
  );
}
