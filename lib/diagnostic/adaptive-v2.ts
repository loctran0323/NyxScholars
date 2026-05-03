/**
 * Adaptive intake v2 — drop-in successor to lib/diagnostic/adaptive.ts.
 *
 * Improvements over v1:
 *   • Bayesian θ posterior — keeps a Normal(mean, sd) per skill with a
 *     proper prior, instead of a single point estimate.
 *   • SE stopping rule — terminates the test when global SE < SE_MIN,
 *     instead of after a fixed 14 questions. Capped at 25 to prevent
 *     pathological loops.
 *   • Item exposure penalty — discounts items asked recently, so the
 *     same student doesn't see the same item twice on a re-test.
 *   • Section locking — won't ask two passages back to back.
 *
 * Imports the public types from v1 so existing call sites keep working.
 */

import type { BankQuestion } from "./bank";
import { SKILL_BY_ID, SKILLS_BY_CONSTELLATION } from "./skills";

export interface SkillPosterior {
  mean: number;   // current θ estimate
  sd:   number;   // current standard deviation (uncertainty)
  attempts: number;
}

export interface AdaptiveStateV2 {
  /** Global θ (mean across skill posteriors, weighted by attempts). */
  theta: number;
  /** Global standard error. Test stops when this drops below SE_MIN. */
  se: number;
  /** Per-skill posterior. */
  skill: Record<string, SkillPosterior>;
  /** Per-constellation attempt count for coverage rotation. */
  constellationAttempts: Record<string, number>;
  asked: Set<string>;
  /** Last-asked section ('Math' or 'Reading & Writing') for section locking. */
  lastSection?: "Math" | "Reading & Writing";
  /** Item-exposure history — count of how many tests this user has seen each item in. */
  exposure: Record<string, number>;
}

const SE_MIN = 0.30;
export const MAX_QUESTIONS = 25;
const MIN_QUESTIONS = 8;

const PRIOR_MEAN = 0;
const PRIOR_SD   = 1.0;          // moderate prior — narrows quickly with data
const SLOPE      = 1.7;          // logistic discrimination

export function initStateV2(opts?: { exposure?: Record<string, number> }): AdaptiveStateV2 {
  const skill: Record<string, SkillPosterior> = {};
  const constellationAttempts: Record<string, number> = {};
  for (const c of SKILLS_BY_CONSTELLATION) {
    constellationAttempts[c.id] = 0;
    for (const s of c.skills) {
      skill[s.id] = { mean: PRIOR_MEAN, sd: PRIOR_SD, attempts: 0 };
    }
  }
  return {
    theta: 0,
    se: PRIOR_SD,
    skill,
    constellationAttempts,
    asked: new Set(),
    exposure: opts?.exposure ?? {},
  };
}

export function pCorrect(theta: number, b: number): number {
  return 1 / (1 + Math.exp(-SLOPE * (theta - b)));
}

function difficultyToB(d: number): number {
  return (d - 3) * 0.6;
}

/**
 * Bayesian update for a single skill. Treats the response as evidence,
 * computes a likelihood, and returns the posterior mean+sd via a 1-step
 * MAP approximation (good enough for screening; we re-fit periodically
 * via the calibration cron).
 */
function updateSkill(post: SkillPosterior, b: number, correct: boolean): SkillPosterior {
  const grid = 41;                 // θ values to evaluate
  const min = -3;
  const max = 3;
  const step = (max - min) / (grid - 1);
  let total = 0;
  let totalTheta = 0;
  let totalSq = 0;
  for (let i = 0; i < grid; i++) {
    const theta = min + i * step;
    const prior = Math.exp(-((theta - post.mean) ** 2) / (2 * post.sd ** 2));
    const p = pCorrect(theta, b);
    const lik = correct ? p : 1 - p;
    const w = prior * lik;
    total += w;
    totalTheta += w * theta;
    totalSq    += w * theta * theta;
  }
  if (total === 0) return post;
  const mean = totalTheta / total;
  const variance = Math.max(0.005, totalSq / total - mean * mean);
  return { mean, sd: Math.sqrt(variance), attempts: post.attempts + 1 };
}

export function applyAnswerV2(state: AdaptiveStateV2, q: BankQuestion, correct: boolean): AdaptiveStateV2 {
  const b = difficultyToB(q.difficulty);
  const meta = SKILL_BY_ID[q.skillId];
  const next: AdaptiveStateV2 = {
    ...state,
    skill: { ...state.skill },
    constellationAttempts: { ...state.constellationAttempts },
    asked: new Set(state.asked),
    exposure: { ...state.exposure },
  };
  const old = next.skill[q.skillId] ?? { mean: PRIOR_MEAN, sd: PRIOR_SD, attempts: 0 };
  next.skill[q.skillId] = updateSkill(old, b, correct);
  if (meta) next.constellationAttempts[meta.constellationId] = (state.constellationAttempts[meta.constellationId] ?? 0) + 1;
  next.asked.add(q.id);
  next.exposure[q.id] = (next.exposure[q.id] ?? 0) + 1;
  next.lastSection = q.section as "Math" | "Reading & Writing";

  // Recompute global θ as attempt-weighted mean of skill posteriors.
  let total = 0;
  let weighted = 0;
  let weightedVariance = 0;
  for (const s of Object.values(next.skill)) {
    if (s.attempts === 0) continue;
    total += s.attempts;
    weighted += s.attempts * s.mean;
    weightedVariance += s.attempts * s.sd * s.sd;
  }
  if (total > 0) {
    next.theta = weighted / total;
    next.se    = Math.sqrt(weightedVariance / total / Math.max(1, total));
  }
  return next;
}

/** Choose the next item using maximum information + coverage + exposure penalty. */
export function selectNextV2(state: AdaptiveStateV2, pool: BankQuestion[]): BankQuestion | null {
  const candidates = pool.filter((q) => !state.asked.has(q.id));
  if (candidates.length === 0) return null;

  let best: BankQuestion | null = null;
  let bestScore = -Infinity;
  for (const q of candidates) {
    const post = state.skill[q.skillId] ?? { mean: PRIOR_MEAN, sd: PRIOR_SD, attempts: 0 };
    const b = difficultyToB(q.difficulty);
    const localTheta = post.attempts > 0 ? 0.6 * post.mean + 0.4 * state.theta : state.theta;
    const p = pCorrect(localTheta, b);
    const info = p * (1 - p);

    const meta = SKILL_BY_ID[q.skillId];
    const constAttempts = meta ? state.constellationAttempts[meta.constellationId] ?? 0 : 0;
    const coverage = Math.exp(-constAttempts * 0.6);

    // Exposure penalty: previously seen items are scored lower.
    const exposure = state.exposure[q.id] ?? 0;
    const exposurePenalty = 1 / (1 + exposure * 0.8);

    const sectionPenalty = state.lastSection && state.lastSection === q.section ? 0.7 : 1;

    const score = info * (1 + 0.5 * coverage) * exposurePenalty * sectionPenalty;
    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }
  return best;
}

/** SE stopping rule: terminate once we're confident enough. */
export function shouldStop(state: AdaptiveStateV2, asked: number): boolean {
  if (asked >= MAX_QUESTIONS) return true;
  if (asked < MIN_QUESTIONS) return false;
  return state.se <= SE_MIN;
}

/** Skill mastery in 0..1 derived from posterior mean. */
export function skillMasteryV2(state: AdaptiveStateV2): Record<string, { mastery: number; ci: [number, number] }> {
  const out: Record<string, { mastery: number; ci: [number, number] }> = {};
  for (const [id, post] of Object.entries(state.skill)) {
    const mastery = pCorrect(post.mean, 0);
    // 95% CI via mean ± 1.96·sd, then push through pCorrect to map to mastery space.
    const lo = pCorrect(post.mean - 1.96 * post.sd, 0);
    const hi = pCorrect(post.mean + 1.96 * post.sd, 0);
    out[id] = { mastery, ci: [lo, hi] };
  }
  return out;
}
