/**
 * Single source of truth for the diagnostic's skill universe.
 * Mirrors `lib/mock/constellations.ts` so each star (skill) in every
 * constellation has at least one bank entry, and so the adaptive engine
 * can reason about coverage.
 */

import { CONSTELLATIONS, type Section } from "@/lib/mock/constellations";

export type SkillKey = string;

export interface SkillMeta {
  /** Star id, e.g. "lin-eq". */
  id: SkillKey;
  /** Human-readable name, e.g. "Linear equations". */
  name: string;
  /** "algebra" | "advmath" | … */
  constellationId: string;
  constellationName: string;
  constellationGlyph: string;
  section: Section;
}

export const SKILLS: SkillMeta[] = CONSTELLATIONS.flatMap((c) =>
  c.stars.map((s) => ({
    id: s.id,
    name: s.name,
    constellationId: c.id,
    constellationName: c.name,
    constellationGlyph: c.glyph,
    section: c.section,
  })),
);

export const SKILL_BY_NAME: Record<string, SkillMeta> = Object.fromEntries(
  SKILLS.map((s) => [s.name.toLowerCase(), s]),
);

export const SKILL_BY_ID: Record<string, SkillMeta> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);

/** Skills grouped by constellation, in display order. */
export const SKILLS_BY_CONSTELLATION = CONSTELLATIONS.map((c) => ({
  id: c.id,
  name: c.name,
  glyph: c.glyph,
  section: c.section,
  skills: c.stars.map((s) => SKILL_BY_ID[s.id]).filter(Boolean),
}));
