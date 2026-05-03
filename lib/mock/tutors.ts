export type TutorTag = "Math" | "Reading" | "Writing" | "ACT" | "AP" | "Admissions";

export type Tutor = {
  id: string;
  name: string;
  school: string;
  classOf: number;
  satScore: number;
  tags: TutorTag[];
  /** Skill ids from constellations.ts that this tutor specialises in */
  specialties: string[];
  bio: string;
  pitch: string;
  availability: string;
};

/**
 * The actual roster, honestly. Two Ivy League tutors.
 * No fabricated headcount, no invented acceptance rates, no fake bios.
 */
export const TUTORS: Tutor[] = [
  {
    id: "loc",
    name: "Loc",
    school: "Princeton",
    classOf: 2028,
    satScore: 1580,
    tags: ["Math", "ACT"],
    specialties: ["quad", "poly", "rat", "exp", "cent", "lin-fn"],
    bio: "Math at Princeton. Scored 1580 on the digital SAT in 2024. Tutored a small handful of students through the redesigned exam — most of what I do is help people see the structure underneath the question, not memorise tricks.",
    pitch: "I'll teach you the moves your textbook didn't.",
    availability: "Weekday evenings ET · weekend mornings",
  },
  {
    id: "charles",
    name: "Charles",
    school: "Princeton",
    classOf: 2028,
    satScore: 1560,
    tags: ["Math", "Reading", "Writing"],
    specialties: ["lin-fn", "fulcrum", "beam-l", "eye-l", "shaft1", "wing-l"],
    bio: "CS at Princeton. Built Nyx end-to-end. I tutor a small cohort each semester — usually students who want a precise, structured plan rather than open-ended drills.",
    pitch: "Real numbers. Real plan. Cancel any session, anytime.",
    availability: "Weekend afternoons · some Wednesday evenings",
  },
];

/** Single, honest hourly rate. */
export const HOURLY_RATE_USD = 160;

/** Lightweight matchmaking — given the diagnostic gaps (skill ids), return
 *  the tutors whose specialties overlap most. Currently returns both
 *  founders ranked by overlap; in a future world this returns top-N from
 *  a real roster. */
export function matchTutors(weakSkillIds: string[], limit = 2): Tutor[] {
  const scored = TUTORS.map((t) => ({
    tutor: t,
    overlap: t.specialties.filter((s) => weakSkillIds.includes(s)).length,
  }));
  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, limit).map((s) => s.tutor);
}
