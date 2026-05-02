"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

const NIGHT_2 = "#0c1124";
const NIGHT_3 = "#141a30";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#7a82a0";
const TEXT_FAINT = "#4a5170";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";

type Step = {
  prompt: string;
  skill: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  choices: string[];
  correct: number;
  /** how the engine reacts after the answer — narrated to the user */
  explainOnRight: string;
  explainOnWrong: string;
};

const STEPS: Step[] = [
  {
    skill: "Linear equations",
    difficulty: 2,
    prompt: "If 3x + 7 = 22, what is x?",
    choices: ["3", "5", "7", "15"],
    correct: 1,
    explainOnRight: "Confident on linears. The next question will probe a harder skill — quadratics or systems.",
    explainOnWrong: "Linears need work. The next question stays in the same family but easier, so we anchor your range.",
  },
  {
    skill: "Quadratics",
    difficulty: 4,
    prompt: "x² − 6x + k = 0 has exactly one real solution. What is k?",
    choices: ["3", "6", "9", "12"],
    correct: 2,
    explainOnRight: "Strong quadratic intuition. We'll move on to polynomials and trig.",
    explainOnWrong: "Discriminant gap. We'll book sessions on this with your tutor and revisit at lower difficulty soon.",
  },
];

/**
 * AdaptiveDemo — clean, public, calm preview of the adaptive engine.
 * Two questions; after each answer we visualise the ability estimate
 * (theta) and the confidence interval narrowing on a track. Users can
 * actually move the model with their click.
 */
export function AdaptiveDemo() {
  const [stepIdx, setStepIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [theta, setTheta] = useState(0);          // -3..+3
  const [ci, setCI] = useState(2.0);
  const [history, setHistory] = useState<{ correct: boolean; theta: number; ci: number }[]>([]);

  const step = STEPS[stepIdx];
  const isCorrect = submitted && picked === step.correct;

  function answer(idx: number) {
    if (submitted) return;
    setPicked(idx);
    const correct = idx === step.correct;
    const diff = (step.difficulty - 3) * 0.6;
    const delta = correct
      ? Math.max(0.18, 0.55 - Math.abs(theta - diff) * 0.1)
      : -Math.max(0.18, 0.55 - Math.abs(theta - diff) * 0.1);
    const newTheta = Math.max(-2.4, Math.min(2.4, theta + delta));
    const newCI = Math.max(0.45, ci - 0.5);
    setTheta(newTheta);
    setCI(newCI);
    setHistory((h) => [...h, { correct, theta: newTheta, ci: newCI }]);
    setSubmitted(true);
  }

  function next() {
    if (stepIdx >= STEPS.length - 1) return;
    setStepIdx((i) => i + 1);
    setPicked(null);
    setSubmitted(false);
  }

  function reset() {
    setStepIdx(0);
    setPicked(null);
    setSubmitted(false);
    setTheta(0);
    setCI(2.0);
    setHistory([]);
  }

  const norm = (v: number) => Math.max(0, Math.min(1, (v + 3) / 6));
  const center = norm(theta);
  const left = norm(theta - ci);
  const right = norm(theta + ci);
  const score = Math.round(1200 + theta * 130);
  const ciScore = Math.round(ci * 65);

  return (
    <div
      className="rounded-[18px] overflow-hidden"
      style={{ background: NIGHT_2, border: `1px solid ${LINE}` }}
    >
      {/* Top: signal indicator (the live estimate) */}
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${LINE}`, background: "#080d1c" }}>
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <div>
            <p className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>
              ESTIMATED RANGE
            </p>
            <p
              className="mt-1"
              style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, color: TEXT, lineHeight: 1 }}
            >
              {history.length > 0 ? score : "—"}
              <span className="ml-2 text-[14px]" style={{ color: TEXT_DIM }}>
                {history.length > 0 ? `± ${ciScore}` : "± 195"}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>
              CONFIDENCE
            </p>
            <p
              className="mt-1 font-mono"
              style={{ fontSize: 16, color: history.length > 0 ? MOON : TEXT_DIM, letterSpacing: 1 }}
            >
              {Math.round((1 - ci / 2) * 100)}%
            </p>
          </div>
        </div>

        {/* Track + CI band + center marker */}
        <div className="relative mt-4 h-6" aria-hidden>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px" style={{ background: LINE }} />
          {/* tick labels */}
          <div className="absolute left-0 -top-0.5 font-mono text-[9px]" style={{ color: TEXT_FAINT }}>
            400
          </div>
          <div className="absolute right-0 -top-0.5 font-mono text-[9px]" style={{ color: TEXT_FAINT }}>
            1600
          </div>
          {/* CI band */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
            style={{
              left: `${left * 100}%`,
              width: `${(right - left) * 100}%`,
              background: MOON,
              opacity: 0.22,
              transition: "all 0.5s ease-out",
            }}
          />
          {/* center marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${center * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 2,
              height: 16,
              background: MOON_HI,
              boxShadow: `0 0 8px ${MOON}`,
              transition: "all 0.5s ease-out",
            }}
          />
        </div>

        <p className="mt-3 text-[11px] leading-[1.6]" style={{ color: TEXT_DIM }}>
          {history.length === 0
            ? "Answer a question — watch the bar move and the band tighten."
            : `${history.length} answered · band tightening with each response.`}
        </p>
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="font-mono text-[10px] tracking-[0.28em]" style={{ color: MOON }}>
              {step.skill.toUpperCase()}
            </span>
            <span className="font-mono inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em]" style={{ color: TEXT_FAINT }}>
              DIFFICULTY
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: i <= step.difficulty ? MOON : NIGHT_3,
                    boxShadow: i <= step.difficulty ? `0 0 3px ${MOON}` : "none",
                  }}
                />
              ))}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em]" style={{ color: TEXT_DIM }}>
            {stepIdx + 1} / {STEPS.length}
          </span>
        </div>

        <p
          className="mb-6 leading-[1.4]"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, color: TEXT }}
        >
          {step.prompt}
        </p>

        <div className="space-y-2 mb-5">
          {step.choices.map((c, i) => {
            const isPicked = picked === i;
            const isRight = submitted && i === step.correct;
            const isWrongPick = submitted && isPicked && i !== step.correct;
            const baseBg = isPicked ? `${MOON}1a` : NIGHT_3;
            const showRight = isRight ? `rgba(125,211,252,0.16)` : baseBg;
            const showWrong = isWrongPick ? `rgba(251,113,133,0.14)` : showRight;
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={submitted}
                className="w-full text-left flex items-center gap-3 transition-all"
                style={{
                  padding: "13px 14px",
                  background: showWrong,
                  border: `1px solid ${
                    isRight ? MOON : isWrongPick ? "rgba(251,113,133,0.5)" : isPicked ? MOON : LINE
                  }`,
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
                    color: isPicked ? "#070914" : TEXT_DIM,
                    fontSize: 11, letterSpacing: 1, borderRadius: 2,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: 14 }}>{c}</span>
                {isRight ? <Check size={14} className="ml-auto" style={{ color: MOON }} /> : null}
                {isWrongPick ? <X size={14} className="ml-auto text-rose-400" /> : null}
              </button>
            );
          })}
        </div>

        {/* Reaction line — what the engine does next */}
        {submitted ? (
          <div
            className="px-4 py-3 rounded-[8px] mb-5 flex items-start gap-3"
            style={{
              background: isCorrect ? "rgba(125,211,252,0.08)" : "rgba(251,113,133,0.08)",
              border: `1px solid ${isCorrect ? "rgba(125,211,252,0.30)" : "rgba(251,113,133,0.28)"}`,
            }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.24em] shrink-0 mt-0.5"
              style={{ color: isCorrect ? MOON : "#fb7185" }}
            >
              {isCorrect ? "ENGINE" : "ENGINE"}
            </span>
            <p className="text-[13px] leading-[1.6]" style={{ color: TEXT }}>
              {isCorrect ? step.explainOnRight : step.explainOnWrong}
            </p>
          </div>
        ) : null}

        <div className="flex justify-between items-center gap-3 flex-wrap">
          <p className="text-[12px] italic" style={{ fontFamily: "var(--font-fraunces)", color: TEXT_DIM }}>
            {!submitted && picked === null && "Pick an answer to update the model."}
            {!submitted && picked !== null && "Click again to confirm…"}
            {submitted && stepIdx < STEPS.length - 1 && "Next question is chosen by the engine →"}
            {submitted && stepIdx >= STEPS.length - 1 && "End of demo. The real intake is 8 questions."}
          </p>
          <div className="flex gap-2">
            {submitted && stepIdx < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="font-mono font-medium transition-all hover:brightness-110"
                style={{
                  padding: "10px 18px",
                  background: MOON,
                  color: "#070914",
                  fontSize: 11,
                  letterSpacing: 4,
                  borderRadius: 3,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                NEXT QUESTION →
              </button>
            ) : null}
            {submitted ? (
              <button
                onClick={reset}
                className="font-mono transition-colors"
                style={{
                  padding: "10px 14px",
                  background: "transparent",
                  color: TEXT_DIM,
                  border: `1px solid ${LINE}`,
                  fontSize: 10,
                  letterSpacing: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                RESET
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
