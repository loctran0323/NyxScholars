export type TutorTag = "Math" | "Reading" | "Writing" | "ACT" | "AP" | "Admissions";

export type Tutor = {
  id: string;
  name: string;
  school: string;
  classOf: number;
  /** SAT score the tutor earned (digital SAT scale 1600). Optional. */
  satScore?: number;
  /** Subjects/strengths used for matching */
  tags: TutorTag[];
  /** Skill ids from constellations.ts that this tutor specialises in */
  specialties: string[];
  /** Number of one-on-one students taught */
  studentsTaught: number;
  rateUSD: number;            // hourly rate in USD
  trialRateUSD: number;       // first session, often discounted
  bio: string;
  pitch: string;              // 1-line pitch the tutor wrote
  availability: string;       // human-readable
  videoVerified: boolean;     // platform vetting flag
  bgTint: "gold" | "moon" | "violet" | "aurora";
};

export const TUTORS: Tutor[] = [
  {
    id: "loc",
    name: "Loc",
    school: "Princeton",
    classOf: 2028,
    satScore: 1580,
    tags: ["Math", "ACT"],
    specialties: ["quad", "poly", "rat", "exp", "cent"],
    studentsTaught: 52,
    rateUSD: 120,
    trialRateUSD: 0,
    bio: "Math major at Princeton. Scored 1580 on the digital SAT and tutored 50+ students through the redesigned exam. Specialises in quadratics, trig, and the algebra-to-advanced-math jump.",
    pitch: "I'll teach you the moves your textbook didn't.",
    availability: "Weekday evenings ET · weekend mornings",
    videoVerified: true,
    bgTint: "gold",
  },
  {
    id: "charles",
    name: "Charles",
    school: "Princeton",
    classOf: 2028,
    satScore: 1560,
    tags: ["Math", "Reading", "Writing"],
    specialties: ["lin-fn", "fulcrum", "beam-l", "eye-l", "shaft1"],
    studentsTaught: 38,
    rateUSD: 120,
    trialRateUSD: 0,
    bio: "CS at Princeton. Built Nyx end-to-end. I tutor a small cohort each semester — typically students who want a precise, structured plan rather than open-ended drills.",
    pitch: "Real numbers. Real plan. Cancel any session, anytime.",
    availability: "Weekend afternoons · some Wednesday evenings",
    videoVerified: true,
    bgTint: "moon",
  },
  {
    id: "maya",
    name: "Maya",
    school: "Harvard",
    classOf: 2027,
    satScore: 1550,
    tags: ["Reading", "Writing", "Admissions"],
    specialties: ["eye-l", "eye-r", "beak", "wing-l", "shaft2"],
    studentsTaught: 41,
    rateUSD: 110,
    trialRateUSD: 0,
    bio: "English concentrator at Harvard. Loves the R&W section because the strategies actually generalise — to college essays, to interviews, to thinking. Tutors humanities and admissions.",
    pitch: "If you can write a tight sentence, you can pass any verbal test.",
    availability: "Tue/Thu evenings · Sundays",
    videoVerified: true,
    bgTint: "aurora",
  },
  {
    id: "kenji",
    name: "Kenji",
    school: "MIT",
    classOf: 2027,
    satScore: 1590,
    tags: ["Math", "ACT", "AP"],
    specialties: ["quad", "poly", "exp", "rat", "apex", "cent"],
    studentsTaught: 33,
    rateUSD: 130,
    trialRateUSD: 0,
    bio: "Mech-E at MIT. ACT-trained then SAT-trained — I see the test mechanically. AP Calc + AP Physics on request.",
    pitch: "I'll show you the SAT is mostly five tricks repeated.",
    availability: "Mon-Fri evenings · weekends limited",
    videoVerified: true,
    bgTint: "violet",
  },
  {
    id: "nadia",
    name: "Nadia",
    school: "Yale",
    classOf: 2026,
    satScore: 1540,
    tags: ["Reading", "Writing", "Admissions"],
    specialties: ["eye-r", "beak", "wing-r", "foot", "plume"],
    studentsTaught: 64,
    rateUSD: 115,
    trialRateUSD: 0,
    bio: "Comparative Lit at Yale. Three years tutoring, currently a senior interviewer for Yale alumni. Specialises in the dense passages and the new writing-synthesis questions.",
    pitch: "We'll work on the questions everyone else avoids.",
    availability: "Most evenings · weekend mornings",
    videoVerified: true,
    bgTint: "moon",
  },
  {
    id: "theo",
    name: "Theo",
    school: "Stanford",
    classOf: 2027,
    satScore: 1570,
    tags: ["Math", "AP", "Admissions"],
    specialties: ["lin-eq", "lin-fn", "quad", "fulcrum", "beam-r"],
    studentsTaught: 47,
    rateUSD: 125,
    trialRateUSD: 0,
    bio: "Stanford '27, Symbolic Systems. I tutor Math 1 + 2 SAT, AP Calc, and admissions strategy. Soft spot for word problems.",
    pitch: "If a problem looks weird, the trick is in the setup. We'll drill setups.",
    availability: "Weekdays late · Sat afternoons",
    videoVerified: true,
    bgTint: "gold",
  },
];

/** Lightweight matchmaking — given the diagnostic gaps (skill ids), return
 *  the tutors whose specialties overlap most. Scores by overlap count, then
 *  by studentsTaught as a tiebreaker. */
export function matchTutors(weakSkillIds: string[], limit = 3): Tutor[] {
  const scored = TUTORS.map((t) => {
    const overlap = t.specialties.filter((s) => weakSkillIds.includes(s)).length;
    return { tutor: t, overlap };
  });
  scored.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    return b.tutor.studentsTaught - a.tutor.studentsTaught;
  });
  return scored.slice(0, limit).map((s) => s.tutor);
}
