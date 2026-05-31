/**
 * Reading & Writing question bank — ASSEMBLY + ANSWER KEY.
 *
 * `import "server-only"` is load-bearing: it guarantees this module (which holds
 * every correct-answer index and rationale) can only be imported from Server
 * Components and Route Handlers. If anything in a "use client" file tries to
 * import it, the build fails. That is how we keep answers out of Arush's browser.
 *
 * Per-skill questions live in ./data/<skill>.ts. Each exports `DATA: RWSkillData`.
 */
import "server-only";

import {
  type RWQuestion,
  type RWConcept,
  type RWModule,
  type RWSkillKey,
  type PublicRWQuestion,
  type RWSkillData,
  SKILL_META,
  SKILL_BY_KEY,
  toPublic,
} from "./types";

import { DATA as inferences } from "./data/inferences";
import { DATA as evidenceTextual } from "./data/evidence-textual";
import { DATA as evidenceQuantitative } from "./data/evidence-quantitative";
import { DATA as centralIdeas } from "./data/central-ideas";
import { DATA as wordsInContext } from "./data/words-in-context";
import { DATA as textStructure } from "./data/text-structure";
import { DATA as crossText } from "./data/cross-text";
import { DATA as transitions } from "./data/transitions";
import { DATA as rhetoricalSynthesis } from "./data/rhetorical-synthesis";
import { DATA as boundaries } from "./data/boundaries";
import { DATA as formStructureSense } from "./data/form-structure-sense";
import { GENERATED } from "./data/_generated";

/** Hand-authored skill data, keyed for lookup. Order follows the SAT R&W domain order. */
const RAW_SKILL_DATA: Record<RWSkillKey, RWSkillData> = {
  "words-in-context": wordsInContext,
  "text-structure": textStructure,
  "cross-text": crossText,
  "central-ideas": centralIdeas,
  "evidence-textual": evidenceTextual,
  "evidence-quantitative": evidenceQuantitative,
  inferences,
  boundaries,
  "form-structure-sense": formStructureSense,
  transitions,
  "rhetorical-synthesis": rhetoricalSynthesis,
};

/**
 * Live skill data = hand-authored questions + workflow-authored questions
 * (`GENERATED`). The two pools share the exact same `RWQuestion` shape and are
 * validated together by `scripts/validate-rw-bank.ts`.
 */
const SKILL_DATA: Record<RWSkillKey, RWSkillData> = Object.fromEntries(
  SKILL_META.map((s) => [
    s.key,
    {
      concept: RAW_SKILL_DATA[s.key].concept,
      questions: [...RAW_SKILL_DATA[s.key].questions, ...(GENERATED[s.key] ?? [])],
    },
  ]),
) as Record<RWSkillKey, RWSkillData>;

export const RW_QUESTIONS: RWQuestion[] = SKILL_META.flatMap(
  (s) => SKILL_DATA[s.key].questions,
);

export const RW_CONCEPTS: Record<RWSkillKey, RWConcept> = Object.fromEntries(
  SKILL_META.map((s) => [s.key, SKILL_DATA[s.key].concept]),
) as Record<RWSkillKey, RWConcept>;

const BY_ID = new Map<string, RWQuestion>(RW_QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id: string): RWQuestion | undefined {
  return BY_ID.get(id);
}

export function questionsForSkill(key: RWSkillKey): RWQuestion[] {
  return SKILL_DATA[key]?.questions ?? [];
}

export function countForSkill(key: RWSkillKey): number {
  return SKILL_DATA[key]?.questions.length ?? 0;
}

/** Public (answer-free) list for a skill, ordered easy → hard. */
export function publicQuestionsForSkill(key: RWSkillKey): PublicRWQuestion[] {
  return [...questionsForSkill(key)]
    .sort((a, b) => a.difficulty - b.difficulty)
    .map(toPublic);
}

export function publicQuestions(ids: string[]): PublicRWQuestion[] {
  return ids
    .map((id) => BY_ID.get(id))
    .filter((q): q is RWQuestion => Boolean(q))
    .map(toPublic);
}

// ── Pacing modules — two non-overlapping 27-question sets in SAT domain order ──

const MODULE_PLAN: Array<[RWSkillKey, number]> = [
  // Craft and Structure
  ["words-in-context", 3],
  ["text-structure", 2],
  ["cross-text", 2],
  // Information and Ideas
  ["central-ideas", 2],
  ["evidence-textual", 3],
  ["evidence-quantitative", 2],
  ["inferences", 3],
  // Standard English Conventions
  ["boundaries", 2],
  ["form-structure-sense", 2],
  // Expression of Ideas
  ["transitions", 3],
  ["rhetorical-synthesis", 3],
];

const MODULE_TARGET = 27;

function buildModules(): RWModule[] {
  const used = new Set<string>();

  function take(key: RWSkillKey, n: number): RWQuestion[] {
    const pool = questionsForSkill(key)
      .filter((q) => !used.has(q.id))
      .sort((a, b) => a.difficulty - b.difficulty);
    const picked = pool.slice(0, n);
    picked.forEach((q) => used.add(q.id));
    return picked;
  }

  function buildOne(id: string, title: string): RWModule {
    const qs: RWQuestion[] = [];
    for (const [key, n] of MODULE_PLAN) qs.push(...take(key, n));
    // Top up from any remaining unused question so a thin skill never shrinks the module.
    if (qs.length < MODULE_TARGET) {
      const extra = RW_QUESTIONS.filter((q) => !used.has(q.id)).slice(
        0,
        MODULE_TARGET - qs.length,
      );
      extra.forEach((q) => used.add(q.id));
      qs.push(...extra);
    }
    return { id, title, durationMin: 32, questionIds: qs.map((q) => q.id) };
  }

  return [
    buildOne("rw-module-1", "Reading & Writing · Module A"),
    buildOne("rw-module-2", "Reading & Writing · Module B"),
  ];
}

export const RW_MODULES: RWModule[] = buildModules();

export function getModule(id: string): RWModule | undefined {
  return RW_MODULES.find((m) => m.id === id);
}

/** Public, ordered questions for a module (answer-free). */
export function publicModuleQuestions(id: string): PublicRWQuestion[] {
  const m = getModule(id);
  if (!m) return [];
  return publicQuestions(m.questionIds);
}

/** Score a set of picks against the key (server-side only). */
export function scoreAnswers(
  answers: Array<{ questionId: string; picked: number | null }>,
): Array<{ questionId: string; picked: number | null; correct: boolean; skill: RWSkillKey | null }> {
  return answers.map((a) => {
    const q = BY_ID.get(a.questionId);
    return {
      questionId: a.questionId,
      picked: a.picked,
      correct: q ? a.picked === q.correct : false,
      skill: q ? q.skill : null,
    };
  });
}

export { SKILL_META, SKILL_BY_KEY };
