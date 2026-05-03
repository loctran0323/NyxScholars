/**
 * Diagnostic public API.
 *
 *   import { POOL, selectNext, applyAnswer, initState } from "@/lib/diagnostic";
 *
 * The POOL is the combined static + auto-generated bank, with at least
 * MIN_PER_SKILL questions for every skill that has a generator.
 */

import { QUESTION_BANK, type BankQuestion } from "./bank";
import { mint, GENERATORS } from "./generators";
import { SKILLS } from "./skills";

const MIN_PER_SKILL = 4;

function combineBank(): BankQuestion[] {
  const out: BankQuestion[] = [...QUESTION_BANK];
  // For every skill that has a generator and < MIN_PER_SKILL static items,
  // mint enough generated items to top it up.
  for (const skill of SKILLS) {
    if (!GENERATORS[skill.id]) continue;
    const have = out.filter((q) => q.skillId === skill.id).length;
    const need = Math.max(0, MIN_PER_SKILL - have);
    if (need > 0) out.push(...mint(skill.id, need, hashStr(skill.id)));
  }
  return out;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

export const POOL: BankQuestion[] = combineBank();

/** Stats for /api/diagnostic/stats and the admin pipeline panel. */
export function poolStats() {
  const bySkill: Record<string, { skill: string; static: number; generated: number; total: number }> = {};
  for (const s of SKILLS) bySkill[s.id] = { skill: s.name, static: 0, generated: 0, total: 0 };
  for (const q of POOL) {
    if (!bySkill[q.skillId]) continue;
    bySkill[q.skillId].total += 1;
    if (q.origin === "generated") bySkill[q.skillId].generated += 1;
    else bySkill[q.skillId].static += 1;
  }
  return {
    total: POOL.length,
    skillsCovered: Object.values(bySkill).filter((b) => b.total > 0).length,
    skillsTotal: SKILLS.length,
    bySkill,
  };
}

export type { BankQuestion } from "./bank";
export {
  initState, applyAnswer, selectNext, pCorrect,
  difficultyToB, skillMastery, type AdaptiveState,
} from "./adaptive";
export { mint, GENERATORS } from "./generators";
export { SKILLS, SKILL_BY_ID, SKILL_BY_NAME, SKILLS_BY_CONSTELLATION } from "./skills";
