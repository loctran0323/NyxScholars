/**
 * Reading & Writing practice — shared types.
 *
 * IMPORTANT: this file holds TYPES and answer-free metadata ONLY. It is safe to
 * import from client components. The actual question data (which contains the
 * correct-answer index and rationales) lives in `lib/practice/rw-bank.ts`, which
 * is marked `server-only` so answers can never reach Arush's browser bundle.
 */

export type RWDomain =
  | "Information and Ideas"
  | "Craft and Structure"
  | "Expression of Ideas"
  | "Standard English Conventions";

/** Stable keys — used for routing, data file names, and result tagging. */
export type RWSkillKey =
  | "inferences"
  | "evidence-textual"
  | "evidence-quantitative"
  | "central-ideas"
  | "words-in-context"
  | "text-structure"
  | "cross-text"
  | "transitions"
  | "rhetorical-synthesis"
  | "boundaries"
  | "form-structure-sense";

export interface RWSkillMeta {
  key: RWSkillKey;
  label: string;
  domain: RWDomain;
  /** One-line, student-facing description (no answers). */
  blurb: string;
}

/** Answer-free metadata, safe for the client. Order follows the real SAT R&W domain order. */
export const SKILL_META: RWSkillMeta[] = [
  // ── Craft and Structure ──
  { key: "words-in-context", label: "Words in Context", domain: "Craft and Structure",
    blurb: "Choose the word or phrase that best fits a precise, often subtle context." },
  { key: "text-structure", label: "Text Structure & Purpose", domain: "Craft and Structure",
    blurb: "Pin down the function of a sentence or the overall purpose of a passage." },
  { key: "cross-text", label: "Cross-Text Connections", domain: "Craft and Structure",
    blurb: "Relate two short texts that take different angles on one topic." },
  // ── Information and Ideas ──
  { key: "central-ideas", label: "Central Ideas & Details", domain: "Information and Ideas",
    blurb: "Track the main claim and the details that do (and don't) support it." },
  { key: "evidence-textual", label: "Command of Evidence — Textual", domain: "Information and Ideas",
    blurb: "Find the detail that most directly supports or weakens a given claim." },
  { key: "evidence-quantitative", label: "Command of Evidence — Quantitative", domain: "Information and Ideas",
    blurb: "Read a table or graph and pick the data point that backs the argument." },
  { key: "inferences", label: "Inferences", domain: "Information and Ideas",
    blurb: "Complete the text with the conclusion the passage most logically supports." },
  // ── Standard English Conventions ──
  { key: "boundaries", label: "Boundaries", domain: "Standard English Conventions",
    blurb: "Join, split, and punctuate clauses so sentence boundaries are correct." },
  { key: "form-structure-sense", label: "Form, Structure & Sense", domain: "Standard English Conventions",
    blurb: "Subject-verb agreement, verb tense, pronouns, modifiers, and parallel form." },
  // ── Expression of Ideas ──
  { key: "transitions", label: "Transitions", domain: "Expression of Ideas",
    blurb: "Choose the logical connector that matches the relationship between ideas." },
  { key: "rhetorical-synthesis", label: "Rhetorical Synthesis", domain: "Expression of Ideas",
    blurb: "Use bulleted notes to accomplish a specific rhetorical goal in one sentence." },
];

export const SKILL_BY_KEY: Record<RWSkillKey, RWSkillMeta> = Object.fromEntries(
  SKILL_META.map((s) => [s.key, s]),
) as Record<RWSkillKey, RWSkillMeta>;

export type RWDifficulty = 3 | 4 | 5;

/** Full question, including the answer key. Server-only — never sent to Arush. */
export interface RWQuestion {
  id: string;
  skill: RWSkillKey;
  domain: RWDomain;
  difficulty: RWDifficulty;
  /** Stimulus text. May be empty for pure-grammar items that are self-contained in `prompt`. */
  passage: string;
  /** The question stem. */
  prompt: string;
  /** Exactly four options. */
  choices: [string, string, string, string];
  /** Index into `choices` of the single correct option. */
  correct: 0 | 1 | 2 | 3;
  /** Tutor-facing: why the key is right and why the strongest trap is wrong. */
  rationale: string;
  /** Tutor-facing target time in seconds. */
  paceSeconds: number;
}

/** The shape Arush's browser receives — no correct index, no rationale. */
export interface PublicRWQuestion {
  id: string;
  skill: RWSkillKey;
  domain: RWDomain;
  difficulty: RWDifficulty;
  passage: string;
  prompt: string;
  choices: string[];
  paceSeconds: number;
}

/** Strip a question down to what is safe to send to the student. */
export function toPublic(q: RWQuestion): PublicRWQuestion {
  return {
    id: q.id,
    skill: q.skill,
    domain: q.domain,
    difficulty: q.difficulty,
    passage: q.passage,
    prompt: q.prompt,
    choices: [...q.choices],
    paceSeconds: q.paceSeconds,
  };
}

/** Per-skill strategy notes. Tutor-facing; the answer-free parts double as student homework "context". */
export interface RWConcept {
  whatItTests: string;
  howToAttack: string[];
  traps: string[];
}

/** A self-contained skill data file exports one of these. */
export interface RWSkillData {
  concept: RWConcept;
  questions: RWQuestion[];
}

export interface RWModule {
  id: string;
  title: string;
  durationMin: number;
  questionIds: string[];
}

// ── Sync payloads (Arush → Talija) ──

export interface RWAnswerLog {
  questionId: string;
  picked: number | null;
  ms: number;
  flagged?: boolean;
}

export interface RWResultPayload {
  mode: "pacing" | "content";
  moduleId?: string;
  skill?: RWSkillKey;
  answers: RWAnswerLog[];
  durationMs: number;
}

export interface RWHomeworkAssignment {
  skills: RWSkillKey[];
  questionIds: string[];
  includeWorked: boolean;
  note: string;
}
