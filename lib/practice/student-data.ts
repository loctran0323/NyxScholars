/**
 * Server-only loader for Arush's portal. Produces ONLY answer-free data
 * (public questions, skill metadata, concept "context"). The only place an
 * answer key is ever attached is a homework assignment where Talija explicitly
 * opted to release worked solutions.
 */
import "server-only";

import { getServiceRoleClient } from "@/lib/supabase";
import {
  RW_MODULES,
  RW_CONCEPTS,
  publicModuleQuestions,
  publicQuestionsForSkill,
  publicQuestions,
  getQuestion,
  countForSkill,
  SKILL_META,
} from "./rw-bank";
import type {
  PublicRWQuestion,
  RWConcept,
  RWSkillKey,
  RWDomain,
} from "./types";

export function cleanSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
}

export interface StudentModule {
  id: string;
  title: string;
  durationMin: number;
  questions: PublicRWQuestion[];
}

export interface StudentSkill {
  key: RWSkillKey;
  label: string;
  domain: RWDomain;
  blurb: string;
  count: number;
  questions: PublicRWQuestion[];
}

export interface StudentWorked {
  id: string;
  choices: string[];
  correct: number;
  rationale: string;
}

export interface StudentHomework {
  note: string;
  includeWorked: boolean;
  skills: Array<{ key: RWSkillKey; label: string }>;
  concepts: Array<{ key: RWSkillKey; label: string; concept: RWConcept }>;
  questions: PublicRWQuestion[];
  /** Only present when Talija opted to release worked solutions. */
  worked: StudentWorked[];
  assignedAt: string | null;
}

export interface StudentData {
  slug: string;
  modules: StudentModule[];
  skills: StudentSkill[];
  homework: StudentHomework | null;
}

const LABEL = new Map(SKILL_META.map((s) => [s.key, s.label]));

export async function loadStudentData(rawSlug: string): Promise<StudentData> {
  const slug = cleanSlug(rawSlug);

  const modules: StudentModule[] = RW_MODULES.map((m) => ({
    id: m.id,
    title: m.title,
    durationMin: m.durationMin,
    questions: publicModuleQuestions(m.id),
  }));

  const skills: StudentSkill[] = SKILL_META.map((s) => ({
    key: s.key,
    label: s.label,
    domain: s.domain,
    blurb: s.blurb,
    count: countForSkill(s.key),
    questions: publicQuestionsForSkill(s.key),
  }));

  const homework = await loadHomework(slug);

  return { slug, modules, skills, homework };
}

async function loadHomework(slug: string): Promise<StudentHomework | null> {
  const client = getServiceRoleClient();
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("temp_homework")
      .select("*")
      .eq("slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;

    const skillKeys = (Array.isArray(data.skills) ? data.skills : []) as RWSkillKey[];
    const questionIds = (Array.isArray(data.question_ids) ? data.question_ids : []) as string[];
    const includeWorked = Boolean(data.include_worked);

    const questions = publicQuestions(questionIds);
    const worked: StudentWorked[] = includeWorked
      ? questionIds
          .map((id) => getQuestion(id))
          .filter((q): q is NonNullable<ReturnType<typeof getQuestion>> => Boolean(q))
          .map((q) => ({ id: q.id, choices: [...q.choices], correct: q.correct, rationale: q.rationale }))
      : [];

    return {
      note: typeof data.note === "string" ? data.note : "",
      includeWorked,
      skills: skillKeys.map((k) => ({ key: k, label: LABEL.get(k) ?? k })),
      concepts: skillKeys.map((k) => ({ key: k, label: LABEL.get(k) ?? k, concept: RW_CONCEPTS[k] })),
      questions,
      worked,
      assignedAt: typeof data.created_at === "string" ? data.created_at : null,
    };
  } catch {
    return null;
  }
}
