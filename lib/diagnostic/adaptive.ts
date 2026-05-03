/**
 * Adaptive question selector.
 *
 * Uses a simplified IRT (Item Response Theory) loop:
 *   • Each question has a difficulty d ∈ {1..5}, mapped to b = (d − 3) · 0.6.
 *   • The student has an ability θ that updates after every answer.
 *   • Probability of a correct response is the 2-PL logistic
 *       P(correct | θ, b) = 1 / (1 + exp(−1.7 · (θ − b))).
 *   • We pick the next question whose b is closest to the current θ
 *     (maximum Fisher information) AND whose skill is the most under-sampled
 *     constellation so far (coverage guard). This is much more accurate than
 *     a fixed sequence — borderline items locate the student's ability with
 *     fewer questions, while the coverage guard prevents one constellation
 *     from dominating early in the test.
 */

import type { BankQuestion } from "./bank";
import { SKILL_BY_ID, SKILLS_BY_CONSTELLATION } from "./skills";

export interface AdaptiveState {
  /** Ability estimate, roughly in [-3, +3]. */
  theta: number;
  /** Confidence interval width — narrows with each answer. */
  ci: number;
  /** Per-skill mastery in 0..1. */
  skillTheta: Record<string, number>;
  /** Per-skill attempt counts. */
  skillAttempts: Record<string, number>;
  /** Per-constellation attempt counts. */
  constellationAttempts: Record<string, number>;
  /** Question ids already asked. */
  asked: Set<string>;
}

export function initState(): AdaptiveState {
  const skillTheta: Record<string, number> = {};
  const skillAttempts: Record<string, number> = {};
  const constellationAttempts: Record<string, number> = {};
  for (const c of SKILLS_BY_CONSTELLATION) {
    constellationAttempts[c.id] = 0;
    for (const s of c.skills) {
      skillTheta[s.id] = 0;
      skillAttempts[s.id] = 0;
    }
  }
  return {
    theta: 0,
    ci: 2.0,
    skillTheta,
    skillAttempts,
    constellationAttempts,
    asked: new Set(),
  };
}

/** Map difficulty 1..5 → IRT b-parameter. */
export function difficultyToB(d: number): number {
  return (d - 3) * 0.6;
}

/** Logistic probability that ability θ answers item b correctly. */
export function pCorrect(theta: number, b: number): number {
  return 1 / (1 + Math.exp(-1.7 * (theta - b)));
}

/**
 * Update state after a response. The global θ updates with shrinkage
 * proportional to how surprising the answer was; per-skill θ is the same
 * idea localised. CI shrinks ~6% per item.
 */
export function applyAnswer(
  state: AdaptiveState,
  q: BankQuestion,
  correct: boolean,
): AdaptiveState {
  const b = difficultyToB(q.difficulty);
  const p = pCorrect(state.theta, b);
  const surprise = correct ? 1 - p : -p;
  const step = 0.45 * surprise;

  const theta = clamp(state.theta + step, -3, 3);
  const ci = Math.max(0.18, state.ci - 0.06);

  const skillStep = 0.55 * surprise;
  const next: AdaptiveState = {
    ...state,
    theta,
    ci,
    skillTheta: { ...state.skillTheta },
    skillAttempts: { ...state.skillAttempts },
    constellationAttempts: { ...state.constellationAttempts },
    asked: new Set(state.asked),
  };
  next.skillTheta[q.skillId] = clamp((state.skillTheta[q.skillId] ?? 0) + skillStep, -3, 3);
  next.skillAttempts[q.skillId] = (state.skillAttempts[q.skillId] ?? 0) + 1;
  const meta = SKILL_BY_ID[q.skillId];
  if (meta) {
    next.constellationAttempts[meta.constellationId] =
      (state.constellationAttempts[meta.constellationId] ?? 0) + 1;
  }
  next.asked.add(q.id);
  return next;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Pick the next question.
 *
 * Strategy:
 *   1. Filter the pool to items not yet asked.
 *   2. Score each candidate by:
 *        information gain = p · (1 - p), where p = pCorrect(θ, b)
 *        coverage bonus   = exp(−attempts in this constellation)
 *      Final score = information * (1 + 0.6 · coverage)
 *   3. Return the highest-scoring candidate.
 *
 * If the pool is empty, returns null (test should end).
 */
export function selectNext(
  state: AdaptiveState,
  pool: BankQuestion[],
): BankQuestion | null {
  const candidates = pool.filter((q) => !state.asked.has(q.id));
  if (candidates.length === 0) return null;

  let best: BankQuestion | null = null;
  let bestScore = -Infinity;
  for (const q of candidates) {
    const b = difficultyToB(q.difficulty);
    // Localise to the per-skill ability if we've sampled it; otherwise global θ.
    const skillTheta = state.skillTheta[q.skillId] ?? state.theta;
    const refTheta = state.skillAttempts[q.skillId] >= 1
      ? 0.4 * skillTheta + 0.6 * state.theta
      : state.theta;
    const p = pCorrect(refTheta, b);
    const info = p * (1 - p);
    const meta = SKILL_BY_ID[q.skillId];
    const constAttempts = meta ? state.constellationAttempts[meta.constellationId] ?? 0 : 0;
    const coverage = Math.exp(-constAttempts * 0.6);
    const score = info * (1 + 0.6 * coverage);
    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }
  return best;
}

/** Convert per-skill θ into per-skill mastery in [0, 1]. */
export function skillMastery(state: AdaptiveState): Record<string, number> {
  const out: Record<string, number> = {};
  for (const skillId of Object.keys(state.skillTheta)) {
    const t = state.skillTheta[skillId];
    out[skillId] = pCorrect(t, 0); // probability of getting an average item right
  }
  return out;
}
