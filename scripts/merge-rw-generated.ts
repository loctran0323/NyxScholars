/**
 * Merge workflow-authored R&W batches into lib/practice/data/_generated.ts.
 *
 * Reads every cleaned batch JSON the verification workflow wrote to
 * /tmp/nyx_rw/clean/*.json, then acts as the FINAL quality gate:
 *   • validates each item against the RWQuestion contract,
 *   • forces the domain to match the skill,
 *   • de-duplicates by passage+prompt (against the hand-authored bank and within
 *     the new set),
 *   • shuffles each item's choices with a seeded RNG so the answer-key positions
 *     come out evenly distributed (preserving correctness),
 *   • caps per skill, assigns collision-free ids,
 *   • and writes a typed _generated.ts.
 *
 * Run: npx tsx scripts/merge-rw-generated.ts [inputDir]
 * Then: npm run validate:rw
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SKILL_META } from "../lib/practice/types.ts";
import { DATA as inferences } from "../lib/practice/data/inferences.ts";
import { DATA as evidenceTextual } from "../lib/practice/data/evidence-textual.ts";
import { DATA as evidenceQuantitative } from "../lib/practice/data/evidence-quantitative.ts";
import { DATA as centralIdeas } from "../lib/practice/data/central-ideas.ts";
import { DATA as wordsInContext } from "../lib/practice/data/words-in-context.ts";
import { DATA as textStructure } from "../lib/practice/data/text-structure.ts";
import { DATA as crossText } from "../lib/practice/data/cross-text.ts";
import { DATA as transitions } from "../lib/practice/data/transitions.ts";
import { DATA as rhetoricalSynthesis } from "../lib/practice/data/rhetorical-synthesis.ts";
import { DATA as boundaries } from "../lib/practice/data/boundaries.ts";
import { DATA as formStructureSense } from "../lib/practice/data/form-structure-sense.ts";

const RAW = {
  "words-in-context": wordsInContext, "text-structure": textStructure, "cross-text": crossText,
  "central-ideas": centralIdeas, "evidence-textual": evidenceTextual,
  "evidence-quantitative": evidenceQuantitative, inferences, boundaries,
  "form-structure-sense": formStructureSense, transitions, "rhetorical-synthesis": rhetoricalSynthesis,
};

const DOMAIN_BY_KEY = Object.fromEntries(SKILL_META.map((s) => [s.key, s.domain]));
const VALID_KEYS = new Set(SKILL_META.map((s) => s.key));
const PER_SKILL_CAP = 240;

const INPUT_DIR = process.argv[2] || "/tmp/nyx_rw/clean";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.join(__dirname, "../lib/practice/data/_generated.ts");

/* seeded RNG so the merge is reproducible */
function rng(seed: number) {
  let s = (Math.abs(seed) % 2147483646) + 1;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
function shuffleChoices(choices: string[], correct: number, seed: number) {
  const r = rng(seed);
  const idx = choices.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const newChoices = idx.map((i) => choices[i]);
  const newCorrect = idx.indexOf(correct);
  return { newChoices, newCorrect, idx };
}

/**
 * After choices are shuffled, rationales that cite a choice LETTER ("choice A",
 * "option C") would point at the wrong option. Remap those letters through the
 * same permutation so they keep pointing at the same TEXT.
 */
function remapLetters(text: string, idx: number[]): string {
  return text.replace(/\b([Cc]hoice|[Oo]ption)\s+([A-D])\b/g, (m, word, L) => {
    const oldPos = (L as string).charCodeAt(0) - 65;
    const newPos = idx.indexOf(oldPos);
    return newPos < 0 ? m : `${word} ${String.fromCharCode(65 + newPos)}`;
  });
}

// Existing passage+prompt fingerprints (dedupe target).
const existing = new Set<string>();
for (const data of Object.values(RAW)) {
  for (const q of data.questions) existing.add(`${q.passage} ${q.prompt}`.trim());
}

const drops: Record<string, number> = {};
function drop(reason: string) {
  drops[reason] = (drops[reason] ?? 0) + 1;
}

interface RawItem {
  skill?: string; domain?: string; difficulty?: number; passage?: string;
  prompt?: string; choices?: unknown; correct?: number; rationale?: string; paceSeconds?: number;
}

const bySkill: Record<string, unknown[]> = {};
const counters: Record<string, number> = {};
const seenNew = new Set<string>();

let files: string[] = [];
try {
  files = fs.readdirSync(INPUT_DIR).filter((f) => f.endsWith(".json"));
} catch {
  console.error(`✗ Input dir not found: ${INPUT_DIR}`);
  process.exit(1);
}

let totalRead = 0;
let kept = 0;

for (const file of files.sort()) {
  let arr: RawItem[];
  try {
    arr = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, file), "utf8"));
  } catch {
    drop("unparseable-file");
    continue;
  }
  if (!Array.isArray(arr)) { drop("not-an-array"); continue; }

  for (const it of arr) {
    totalRead++;
    const skill = String(it.skill ?? "");
    if (!VALID_KEYS.has(skill)) { drop("bad-skill"); continue; }
    const difficulty = Number(it.difficulty);
    if (![3, 4, 5].includes(difficulty)) { drop("bad-difficulty"); continue; }
    if (!Array.isArray(it.choices) || it.choices.length !== 4) { drop("not-4-choices"); continue; }
    const choices = it.choices.map((c) => String(c).trim());
    if (choices.some((c) => c.length === 0)) { drop("empty-choice"); continue; }
    if (new Set(choices.map((c) => c.toLowerCase())).size !== 4) { drop("dup-choices"); continue; }
    const correct = Number(it.correct);
    if (!Number.isInteger(correct) || correct < 0 || correct > 3) { drop("bad-correct"); continue; }
    const prompt = String(it.prompt ?? "").trim();
    if (prompt.length < 5) { drop("short-prompt"); continue; }
    const passage = typeof it.passage === "string" ? it.passage : "";
    const rationale = String(it.rationale ?? "").trim();
    if (rationale.length < 15) { drop("short-rationale"); continue; }
    let pace = Number(it.paceSeconds);
    if (!Number.isFinite(pace)) pace = 60;
    pace = Math.max(30, Math.min(120, Math.round(pace)));

    const fp = `${passage} ${prompt}`.trim();
    if (existing.has(fp) || seenNew.has(fp)) { drop("duplicate"); continue; }
    seenNew.add(fp);

    if ((counters[skill] ?? 0) >= PER_SKILL_CAP) { drop("over-cap"); continue; }

    // Balance: shuffle choices so the key position distribution is even.
    counters[skill] = (counters[skill] ?? 0) + 1;
    const n = counters[skill];
    const { newChoices, newCorrect, idx } = shuffleChoices(choices, correct, hash(`${skill}-${n}-${prompt}`));

    (bySkill[skill] ??= []).push({
      id: `${skill}-g${n}`,
      skill,
      domain: DOMAIN_BY_KEY[skill],
      difficulty,
      passage,
      prompt,
      choices: newChoices,
      correct: newCorrect,
      // Keep any "choice A/option B" references in the rationale pointing at the same text.
      rationale: remapLetters(rationale, idx),
      paceSeconds: pace,
    });
    kept++;
  }
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

// Per-skill answer-key distribution report.
const distLines: string[] = [];
for (const meta of SKILL_META) {
  const items = (bySkill[meta.key] as Array<{ correct: number }>) ?? [];
  const hist = [0, 0, 0, 0];
  for (const q of items) hist[q.correct]++;
  distLines.push(`  · ${meta.label.padEnd(34)} ${String(items.length).padStart(4)}   keys ${hist.join("/")}`);
}

const body = `/**
 * Workflow-authored Reading & Writing questions, grouped by skill. GENERATED FILE.
 * Authored + adversarially verified by a multi-agent workflow, then balanced and
 * de-duplicated by scripts/merge-rw-generated.ts. Do not edit by hand.
 */
import type { RWQuestion, RWSkillKey } from "../types";

export const GENERATED = ${JSON.stringify(bySkill, null, 2)} as unknown as Partial<Record<RWSkillKey, RWQuestion[]>>;
`;

fs.writeFileSync(OUT_FILE, body);

console.log(`\nMerged ${kept} of ${totalRead} authored items from ${files.length} batch file(s).`);
console.log(distLines.join("\n"));
if (Object.keys(drops).length) {
  console.log("\nDropped:");
  for (const [reason, n] of Object.entries(drops).sort((a, b) => b[1] - a[1])) console.log(`   - ${reason}: ${n}`);
}
console.log(`\n✓ Wrote ${OUT_FILE}\n  Next: npm run validate:rw\n`);
