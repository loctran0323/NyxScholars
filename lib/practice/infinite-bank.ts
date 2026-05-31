/**
 * Servable bank for the infinite practice engine (SERVER-ONLY).
 *
 * `import "server-only"` is load-bearing: this module holds answer keys (it imports
 * the Reading & Writing bank, which is itself server-only) and resolves item tokens
 * back to correct answers for grading. None of it may ever reach the browser.
 *
 * It unifies two supplies under one skill taxonomy (the constellation `skillId`s):
 *   • MATH — generated on demand by `lib/practice/generators.ts`. Truly unbounded
 *     and correct-by-construction; served via "gen" tokens (skill, difficulty, seed).
 *   • READING & WRITING — a curated pool: every authored `RWQuestion` from the
 *     practice bank, bridged into `BankQuestion` shape, plus any static R&W items
 *     in the diagnostic bank. Served via "pool" tokens (question id). Large and
 *     ever-growing; cycles by least-recently-seen so a session effectively never
 *     repeats.
 */
import "server-only";

import type { BankQuestion } from "@/lib/diagnostic/bank";
import { SKILL_BY_ID } from "@/lib/diagnostic/skills";
import { RW_QUESTIONS } from "@/lib/practice/rw-bank";
import type { RWQuestion, RWSkillKey } from "@/lib/practice/types";
import { generateMathItem, isGeneratable, MATH_SKILL_IDS } from "@/lib/practice/generators";
import { type ItemToken, hashSeed } from "@/lib/practice/infinite-engine";

/* ─── Reading & Writing skill → constellation star mapping ───────────────── */

const RW_TO_STAR: Record<RWSkillKey, string> = {
  "words-in-context": "wing-l",       // Vocabulary
  "text-structure": "wing-r",         // Text structure
  "cross-text": "foot",               // Cross-text synthesis
  "central-ideas": "eye-l",           // Main idea
  "evidence-textual": "beak",         // Evidence (textual)
  "evidence-quantitative": "beak-q",  // Evidence (data) — its own star so the signal isn't blended
  inferences: "eye-r",                // Inference
  transitions: "shaft2",              // Transitions
  "rhetorical-synthesis": "plume",    // Rhetorical synthesis
  boundaries: "barb",                 // Boundaries
  "form-structure-sense": "tip",      // Grammar & usage
};

function rwToBank(q: RWQuestion): BankQuestion {
  const star = RW_TO_STAR[q.skill];
  const meta = SKILL_BY_ID[star];
  return {
    id: q.id,
    skillId: star,
    skill: meta?.name ?? q.skill,
    section: "Reading & Writing",
    difficulty: q.difficulty,
    prompt: q.prompt,
    choices: [...q.choices],
    correct: q.correct,
    rationale: q.rationale,
    origin: "static",
    passage: q.passage || undefined,
  };
}

/* ─── Reading & Writing pool, indexed by constellation skill ─────────────── */

// Only the authored R&W bank (server-only, answers never bundled) feeds the engine.
// We deliberately DON'T mix in the diagnostic POOL's R&W items: those ids are also
// shipped to the browser via the diagnostic page, so serving them here through an
// (opaque but unsigned) token would let a client map the id back to the answer key.
// The authored bank is ~1,860 items, so there is no coverage cost to excluding them.
const RW_BRIDGED: BankQuestion[] = RW_QUESTIONS.map(rwToBank);

const RW_POOL: BankQuestion[] = [...RW_BRIDGED];

/** R&W items grouped by skill id. */
const RW_BY_SKILL: Record<string, BankQuestion[]> = (() => {
  const out: Record<string, BankQuestion[]> = {};
  for (const q of RW_POOL) (out[q.skillId] ??= []).push(q);
  return out;
})();

/** Every served item, indexed by id, for token resolution. */
const BY_ID: Map<string, BankQuestion> = new Map(RW_POOL.map((q) => [q.id, q]));

/* ─── Public surface ─────────────────────────────────────────────────────── */

/** Skill ids the engine can serve: all generatable math skills + any R&W skill with a pool. */
export function servableSkillIds(): string[] {
  const ids = new Set<string>(MATH_SKILL_IDS);
  for (const id of Object.keys(RW_BY_SKILL)) if (RW_BY_SKILL[id].length > 0) ids.add(id);
  return [...ids];
}

/** Public (answer-free) shape sent to the browser. */
export interface PublicItem {
  token: string;
  skillId: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  passage?: string;
  prompt: string;
  choices: string[];
}

function isMathSkill(skillId: string): boolean {
  return isGeneratable(skillId);
}

/**
 * Produce a full item (WITH answer) for a skill at a target difficulty, plus the
 * token a client returns to have it graded. Math is generated fresh; R&W is drawn
 * from the pool avoiding recently-asked ids, at the nearest available difficulty.
 */
export function serveItem(
  skillId: string,
  difficulty: number,
  ctx: { recentAsked: string[]; step: number },
): { item: BankQuestion; token: ItemToken } | null {
  if (isMathSkill(skillId)) {
    const seed = hashSeed(`${skillId}:${difficulty}:${ctx.step}:${ctx.recentAsked.length}`);
    const item = generateMathItem(skillId, seed, difficulty);
    if (!item) return null;
    return { item, token: { kind: "gen", skillId, difficulty, seed } };
  }

  const pool = RW_BY_SKILL[skillId];
  if (!pool || pool.length === 0) return null;
  const recent = new Set(ctx.recentAsked);
  // Candidates not seen recently; fall back to the whole pool if all are recent.
  let candidates = pool.filter((q) => !recent.has(q.id));
  if (candidates.length === 0) candidates = pool;

  // Choose the candidate whose difficulty is closest to the target; break ties
  // deterministically by a step-rotated hash so we cycle through the pool.
  const targetClamped = Math.max(3, Math.min(5, difficulty)); // R&W items live at 3–5
  let best: BankQuestion | null = null;
  let bestScore = Infinity;
  for (const q of candidates) {
    const diffGap = Math.abs(q.difficulty - targetClamped);
    const rot = (hashSeed(q.id) + ctx.step) % 997 / 997; // 0..1 deterministic jitter
    const score = diffGap * 10 + rot;
    if (score < bestScore) {
      bestScore = score;
      best = q;
    }
  }
  if (!best) return null;
  return { item: best, token: { kind: "pool", skillId, difficulty: best.difficulty, qid: best.id } };
}

/** Resolve a token back to its full item (WITH answer) for grading. */
export function resolveItem(token: ItemToken): BankQuestion | null {
  if (token.kind === "gen") {
    if (typeof token.seed !== "number") return null;
    return generateMathItem(token.skillId, token.seed, token.difficulty);
  }
  if (token.kind === "pool" && token.qid) {
    return BY_ID.get(token.qid) ?? null;
  }
  return null;
}

/** Strip an item down to what is safe for the browser. */
export function toPublicItem(item: BankQuestion, token: string): PublicItem {
  return {
    token,
    skillId: item.skillId,
    skill: item.skill,
    section: item.section,
    difficulty: item.difficulty,
    passage: item.passage,
    prompt: item.prompt,
    choices: [...item.choices],
  };
}

/** Coverage stats for diagnostics / the admin pipeline panel. */
export function infiniteBankStats() {
  const rwBySkill: Record<string, number> = {};
  for (const [id, list] of Object.entries(RW_BY_SKILL)) rwBySkill[id] = list.length;
  return {
    mathSkills: MATH_SKILL_IDS.length,
    mathSupply: "unbounded (generated)",
    rwPool: RW_POOL.length,
    rwAuthored: RW_BRIDGED.length,
    rwBySkill,
    servableSkills: servableSkillIds().length,
  };
}
