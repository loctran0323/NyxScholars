/**
 * Infinite adaptive practice engine.
 *
 * Unlike the diagnostic (which stops once it is confident about the student's
 * ability), this engine never terminates: a student can keep answering forever
 * and every item is matched to their *current* per-skill ability. It is built to
 * be fully serializable and stateless on the server —
 *
 *   • The client carries `InfiniteState` (per-skill θ posteriors, counts, streaks).
 *     The state contains NO answer keys, so it is safe to hold in the browser.
 *   • For each step the server picks a skill + target difficulty, then either
 *     GENERATES a fresh math item (correct-by-construction, unlimited supply) or
 *     pulls a Reading & Writing item from the bridged bank.
 *   • Items are identified by an opaque token the server can deterministically
 *     resolve back to an answer when grading — so no server-side session store is
 *     needed, and the answer never travels to the browser.
 *
 * The IRT math mirrors `lib/diagnostic/adaptive-v2.ts` (1-step Bayesian MAP update
 * on a θ grid) so ability estimates stay consistent with the diagnostic.
 */

import { SKILLS, SKILL_BY_ID } from "@/lib/diagnostic/skills";

export type SectionFilter = "Math" | "Reading & Writing" | "Mixed";

export interface SkillPost {
  mean: number;
  sd: number;
  attempts: number;
}

export interface InfiniteState {
  /** Per-skill ability posterior, keyed by constellation skill id. */
  skills: Record<string, SkillPost>;
  /** Attempt-weighted global ability estimate. */
  theta: number;
  /** Coverage rotation counter per constellation. */
  constellationAttempts: Record<string, number>;
  totalAnswered: number;
  totalCorrect: number;
  /** Current consecutive-correct streak. */
  streak: number;
  bestStreak: number;
  /** Last few skill ids (anti-repetition) and recent question ids (anti-replay). */
  recentSkills: string[];
  recentAsked: string[];
  section: SectionFilter;
}

const SLOPE = 1.7;
const PRIOR_MEAN = 0;
const PRIOR_SD = 1.0;
const TARGET_P = 0.68; // aim for ~68% success — challenging but mostly right
const RECENT_SKILL_WINDOW = 3;
const RECENT_ASKED_CAP = 250;

export function difficultyToB(d: number): number {
  return (d - 3) * 0.6;
}

export function pCorrect(theta: number, b: number): number {
  return 1 / (1 + Math.exp(-SLOPE * (theta - b)));
}

export function initInfiniteState(section: SectionFilter = "Mixed"): InfiniteState {
  const skills: Record<string, SkillPost> = {};
  const constellationAttempts: Record<string, number> = {};
  for (const s of SKILLS) {
    skills[s.id] = { mean: PRIOR_MEAN, sd: PRIOR_SD, attempts: 0 };
    constellationAttempts[s.constellationId] = 0;
  }
  return {
    skills,
    theta: 0,
    constellationAttempts,
    totalAnswered: 0,
    totalCorrect: 0,
    streak: 0,
    bestStreak: 0,
    recentSkills: [],
    recentAsked: [],
    section,
  };
}

/** Normalize a state that may be missing fields (forward-compat for older clients). */
export function hydrateState(raw: Partial<InfiniteState> | null | undefined, section: SectionFilter): InfiniteState {
  const fresh = initInfiniteState(section);
  if (!raw || typeof raw !== "object") return fresh;
  const skills: Record<string, SkillPost> = { ...fresh.skills };
  if (raw.skills) {
    for (const [id, p] of Object.entries(raw.skills)) {
      if (skills[id] && p && typeof p.mean === "number" && typeof p.sd === "number") {
        skills[id] = { mean: p.mean, sd: Math.max(0.05, p.sd), attempts: Math.max(0, p.attempts | 0) };
      }
    }
  }
  return {
    skills,
    theta: typeof raw.theta === "number" ? raw.theta : 0,
    constellationAttempts: { ...fresh.constellationAttempts, ...(raw.constellationAttempts ?? {}) },
    totalAnswered: Math.max(0, raw.totalAnswered ?? 0),
    totalCorrect: Math.max(0, raw.totalCorrect ?? 0),
    streak: Math.max(0, raw.streak ?? 0),
    bestStreak: Math.max(0, raw.bestStreak ?? 0),
    recentSkills: Array.isArray(raw.recentSkills) ? raw.recentSkills.slice(-RECENT_SKILL_WINDOW) : [],
    recentAsked: Array.isArray(raw.recentAsked) ? raw.recentAsked.slice(-RECENT_ASKED_CAP) : [],
    section: section ?? raw.section ?? "Mixed",
  };
}

function sectionMatches(filter: SectionFilter, skillSection: string): boolean {
  if (filter === "Mixed") return true;
  // constellation section is "Math" | "R&W"; engine filter uses full names
  if (filter === "Math") return skillSection === "Math";
  return skillSection === "R&W";
}

/**
 * Choose the next skill to practice. Strategy: from the skills eligible under the
 * section filter (and that the caller can actually serve), prefer ones the engine
 * has seen least (coverage), nudged toward the student's weaker skills, while
 * avoiding the last few skills so the session feels varied.
 */
export function pickSkill(state: InfiniteState, servableSkillIds: string[]): string | null {
  const eligible = servableSkillIds.filter((id) => {
    const meta = SKILL_BY_ID[id];
    return meta && sectionMatches(state.section, meta.section);
  });
  if (eligible.length === 0) return null;

  let best: string | null = null;
  let bestScore = -Infinity;
  for (const id of eligible) {
    const post = state.skills[id] ?? { mean: 0, sd: PRIOR_SD, attempts: 0 };
    // Coverage: fewer attempts → higher priority.
    const coverage = 1 / (1 + post.attempts);
    // Weakness: lower ability → higher priority (gentle pull toward growth areas).
    const weakness = pCorrect(-post.mean, 0); // high when mean is low
    // Uncertainty: wide posterior → worth sampling.
    const uncertainty = post.sd;
    // Variety: penalize very recently practiced skills.
    const recencyPenalty = state.recentSkills.includes(id)
      ? 0.35 - 0.1 * state.recentSkills.lastIndexOf(id)
      : 0;
    const score = 1.0 * coverage + 0.5 * weakness + 0.4 * uncertainty - recencyPenalty + 0.001 * hashSeed(id + state.totalAnswered);
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
}

/**
 * Target difficulty for a skill: pick the 1–5 level whose IRT b lands the success
 * probability nearest TARGET_P at the student's current skill ability, with a small
 * streak-driven nudge (climb when hot, ease off after a miss) and a touch of jitter.
 */
export function targetDifficulty(state: InfiniteState, skillId: string): 1 | 2 | 3 | 4 | 5 {
  const post = state.skills[skillId] ?? { mean: 0, sd: PRIOR_SD, attempts: 0 };
  const streakNudge = Math.min(0.5, state.streak * 0.12);
  const jitter = (hashSeed(skillId + state.totalAnswered) % 100) / 100 - 0.5; // ±0.5
  const aim = post.mean + streakNudge + 0.25 * jitter;

  let bestD: 1 | 2 | 3 | 4 | 5 = 3;
  let bestGap = Infinity;
  for (let d = 1 as 1 | 2 | 3 | 4 | 5; d <= 5; d++) {
    const p = pCorrect(aim, difficultyToB(d));
    const gap = Math.abs(p - TARGET_P);
    if (gap < bestGap) {
      bestGap = gap;
      bestD = d;
    }
  }
  return bestD;
}

/** 1-step Bayesian MAP update of a skill posterior on a θ grid. */
function updatePost(post: SkillPost, b: number, correct: boolean): SkillPost {
  const grid = 41;
  const min = -3.5;
  const max = 3.5;
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
    totalSq += w * theta * theta;
  }
  if (total === 0) return post;
  const mean = totalTheta / total;
  const variance = Math.max(0.02, totalSq / total - mean * mean);
  return { mean, sd: Math.sqrt(variance), attempts: post.attempts + 1 };
}

/** Apply a graded answer and return the next state (immutably). */
export function applyResult(
  state: InfiniteState,
  args: { skillId: string; difficulty: number; correct: boolean; questionId: string },
): InfiniteState {
  const { skillId, difficulty, correct, questionId } = args;
  const meta = SKILL_BY_ID[skillId];
  const skills = { ...state.skills };
  const old = skills[skillId] ?? { mean: PRIOR_MEAN, sd: PRIOR_SD, attempts: 0 };
  skills[skillId] = updatePost(old, difficultyToB(difficulty), correct);

  const constellationAttempts = { ...state.constellationAttempts };
  if (meta) constellationAttempts[meta.constellationId] = (constellationAttempts[meta.constellationId] ?? 0) + 1;

  // Recompute global θ as the attempt-weighted mean of skill posteriors.
  let totW = 0;
  let weighted = 0;
  for (const p of Object.values(skills)) {
    if (p.attempts === 0) continue;
    totW += p.attempts;
    weighted += p.attempts * p.mean;
  }
  const theta = totW > 0 ? weighted / totW : 0;

  const streak = correct ? state.streak + 1 : 0;
  const recentSkills = [...state.recentSkills, skillId].slice(-RECENT_SKILL_WINDOW);
  const recentAsked = [...state.recentAsked, questionId].slice(-RECENT_ASKED_CAP);

  return {
    ...state,
    skills,
    theta,
    constellationAttempts,
    totalAnswered: state.totalAnswered + 1,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    recentSkills,
    recentAsked,
  };
}

/** Estimated SAT-scale score (400–1600) from the global ability estimate. */
export function estimatedScore(state: InfiniteState): number {
  if (state.totalAnswered < 3) return 0; // not enough signal yet
  const raw = 1050 + state.theta * 200;
  return Math.max(400, Math.min(1600, Math.round(raw / 10) * 10));
}

/** Section-specific estimated subscore (200–800). */
export function estimatedSubscore(state: InfiniteState, section: "Math" | "R&W"): number {
  let totW = 0;
  let weighted = 0;
  for (const [id, p] of Object.entries(state.skills)) {
    if (p.attempts === 0) continue;
    const meta = SKILL_BY_ID[id];
    if (!meta || meta.section !== section) continue;
    totW += p.attempts;
    weighted += p.attempts * p.mean;
  }
  if (totW === 0) return 0;
  const theta = weighted / totW;
  return Math.max(200, Math.min(800, Math.round((525 + theta * 100) / 10) * 10));
}

export interface SkillReadout {
  id: string;
  name: string;
  constellationId: string;
  constellationName: string;
  section: string;
  mastery: number; // 0..1
  attempts: number;
}

/** Per-skill mastery readout (0..1), for the live ability panel. */
export function masteryReadout(state: InfiniteState): SkillReadout[] {
  return SKILLS.map((s) => {
    const post = state.skills[s.id] ?? { mean: 0, sd: PRIOR_SD, attempts: 0 };
    return {
      id: s.id,
      name: s.name,
      constellationId: s.constellationId,
      constellationName: s.constellationName,
      section: s.section,
      mastery: pCorrect(post.mean, 0),
      attempts: post.attempts,
    };
  });
}

/* ─── Opaque item tokens (server-resolvable, client-opaque) ──────────────── */

export interface ItemToken {
  kind: "gen" | "pool";
  skillId: string;
  difficulty: number;
  /** For generated items: the seed. For pool items: ignored. */
  seed?: number;
  /** For pool items: the question id. */
  qid?: string;
}

export function encodeToken(t: ItemToken): string {
  // Base64url of compact JSON. Not a security boundary — answers are simply never
  // sent to the client and the generator module is server-only — but it keeps the
  // wire format tidy and tamper-evident enough for a practice tool.
  const json = JSON.stringify(t);
  if (typeof btoa === "function") return btoa(unescape(encodeURIComponent(json)));
  return Buffer.from(json, "utf8").toString("base64");
}

export function decodeToken(s: string): ItemToken | null {
  try {
    const json = typeof atob === "function"
      ? decodeURIComponent(escape(atob(s)))
      : Buffer.from(s, "base64").toString("utf8");
    const t = JSON.parse(json) as ItemToken;
    if (t && (t.kind === "gen" || t.kind === "pool") && typeof t.skillId === "string") return t;
    return null;
  } catch {
    return null;
  }
}

/** Deterministic small hash for seeds/jitter. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) || 1;
}
