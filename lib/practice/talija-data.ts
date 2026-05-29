import "server-only";

import {
  RW_MODULES,
  RW_CONCEPTS,
  questionsForSkill,
  SKILL_META,
} from "./rw-bank";
import type { RWQuestion, RWConcept, RWDomain, RWSkillKey } from "./types";

export interface TalijaSkill {
  key: RWSkillKey;
  label: string;
  domain: RWDomain;
  blurb: string;
  concept: RWConcept;
  questions: RWQuestion[];
}

export interface TalijaModuleMeta {
  id: string;
  title: string;
  questionCount: number;
}

export interface TalijaBank {
  skills: TalijaSkill[];
  modules: TalijaModuleMeta[];
  totalQuestions: number;
}

export function loadTalijaBank(): TalijaBank {
  const skills: TalijaSkill[] = SKILL_META.map((s) => ({
    key: s.key,
    label: s.label,
    domain: s.domain,
    blurb: s.blurb,
    concept: RW_CONCEPTS[s.key],
    questions: [...questionsForSkill(s.key)].sort((a, b) => a.difficulty - b.difficulty),
  }));

  return {
    skills,
    modules: RW_MODULES.map((m) => ({ id: m.id, title: m.title, questionCount: m.questionIds.length })),
    totalQuestions: skills.reduce((n, s) => n + s.questions.length, 0),
  };
}
