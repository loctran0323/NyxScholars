/**
 * Generator integrity test — proves the infinite math bank is correct-by-construction.
 *
 * Run: npx tsx scripts/validate-generators.ts
 *
 * For every rich generator, mints many items across every difficulty and a wide
 * seed range, then asserts each item is well-formed: exactly 4 distinct non-empty
 * choices, a valid in-range answer key, no NaN/Infinity/undefined leaking into any
 * rendered string, a prompt and rationale present, and a non-degenerate answer-key
 * distribution (the key must not always land in the same position).
 */
import { RICH_MATH_GENERATORS } from "../lib/practice/generators.ts";
import type { Difficulty } from "../lib/practice/generators.ts";

const SEEDS_PER_DIFF = 200;
const BAD_TOKENS = ["NaN", "undefined", "Infinity", "null", "[object"];

let total = 0;
const errors: string[] = [];
const keyHistogramBySkill: Record<string, number[]> = {};

function checkString(tag: string, label: string, s: unknown) {
  if (typeof s !== "string" || s.trim().length === 0) {
    errors.push(`${tag}: ${label} missing/empty`);
    return;
  }
  for (const t of BAD_TOKENS) {
    if (s.includes(t)) errors.push(`${tag}: ${label} contains "${t}" → "${s.slice(0, 80)}"`);
  }
}

for (const [skillId, gen] of Object.entries(RICH_MATH_GENERATORS)) {
  keyHistogramBySkill[skillId] = [0, 0, 0, 0];
  for (let diff = 1 as Difficulty; diff <= 5; diff++) {
    for (let i = 0; i < SEEDS_PER_DIFF; i++) {
      const seed = diff * 100003 + i * 31 + 7;
      let q;
      try {
        q = gen(seed, diff as Difficulty);
      } catch (e) {
        errors.push(`${skillId} d${diff} seed${seed}: threw ${(e as Error).message}`);
        continue;
      }
      total++;
      const tag = `${skillId} d${diff} seed${seed}`;

      checkString(tag, "prompt", q.prompt);
      if (q.rationale !== undefined) checkString(tag, "rationale", q.rationale);

      if (!Array.isArray(q.choices) || q.choices.length !== 4) {
        errors.push(`${tag}: must have exactly 4 choices (has ${q.choices?.length})`);
      } else {
        q.choices.forEach((c, ci) => checkString(tag, `choice[${ci}]`, c));
        const lower = q.choices.map((c) => String(c).trim().toLowerCase());
        if (new Set(lower).size !== 4) errors.push(`${tag}: duplicate choices → [${q.choices.join(" | ")}]`);
      }

      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) {
        errors.push(`${tag}: correct index ${q.correct} out of range`);
      } else {
        keyHistogramBySkill[skillId][q.correct]++;
      }

      if (q.skillId !== skillId) errors.push(`${tag}: skillId "${q.skillId}" != "${skillId}"`);
      if (q.difficulty !== diff) errors.push(`${tag}: difficulty ${q.difficulty} != requested ${diff}`);
      if (q.section !== "Math") errors.push(`${tag}: section "${q.section}" != Math`);
    }
  }
}

// Answer-key distribution: no skill should key the same position for >60% of items.
for (const [skillId, hist] of Object.entries(keyHistogramBySkill)) {
  const sum = hist.reduce((a, b) => a + b, 0);
  if (sum === 0) continue;
  const max = Math.max(...hist);
  if (max / sum > 0.6) {
    errors.push(`${skillId}: answer key lands in one position ${((max / sum) * 100).toFixed(0)}% of the time (${hist.join("/")})`);
  }
}

console.log(`\nMath generators — minted ${total} items across ${Object.keys(RICH_MATH_GENERATORS).length} skills (${SEEDS_PER_DIFF}/difficulty)`);
const globalHist = [0, 0, 0, 0];
for (const hist of Object.values(keyHistogramBySkill)) hist.forEach((n, i) => (globalHist[i] += n));
console.log(`Global answer-key positions: A:${globalHist[0]} B:${globalHist[1]} C:${globalHist[2]} D:${globalHist[3]}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s) (showing first 40):`);
  for (const e of errors.slice(0, 40)) console.error(`   - ${e}`);
  process.exit(1);
}
console.log(`\n✓ All ${total} generated items well-formed.\n`);
