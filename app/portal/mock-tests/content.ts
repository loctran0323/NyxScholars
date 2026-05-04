import { POOL, type BankQuestion } from "@/lib/diagnostic";

export interface MockSection {
  name: string;
  questions: number;
  minutes: number;
  scaledMin: number;
  scaledMax: number;
}

export interface MockTest {
  id: string;
  title: string;
  test: "SAT" | "ACT";
  durationMin: number;
  questions: number;
  released: string;
  status: "available" | "coming-soon" | "completed";
  scoreRange?: { math: number; rw: number; composite: number };
  sections: MockSection[];
  /** Skills weight: which sections to draw from. */
  weight?: { math: number; rw: number };
}

const SAT_SECTIONS: MockSection[] = [
  { name: "Module 1 · R&W",  questions: 6, minutes: 8,  scaledMin: 200, scaledMax: 800 },
  { name: "Module 2 · R&W",  questions: 6, minutes: 8,  scaledMin: 200, scaledMax: 800 },
  { name: "Module 1 · Math", questions: 7, minutes: 10, scaledMin: 200, scaledMax: 800 },
  { name: "Module 2 · Math", questions: 6, minutes: 9,  scaledMin: 200, scaledMax: 800 },
];

const ACT_SECTIONS: MockSection[] = [
  { name: "English", questions: 8, minutes: 9,  scaledMin: 1, scaledMax: 36 },
  { name: "Math",    questions: 9, minutes: 12, scaledMin: 1, scaledMax: 36 },
  { name: "Reading", questions: 6, minutes: 8,  scaledMin: 1, scaledMax: 36 },
  { name: "Science", questions: 5, minutes: 6,  scaledMin: 1, scaledMax: 36 },
];

export const MOCKS: MockTest[] = [
  {
    id: "nyx-sat-mini-1",
    title: "Nyx SAT skills exam · 25Q",
    test: "SAT",
    durationMin: 35,
    questions: 25,
    released: "Apr 28, 2026",
    status: "available",
    sections: SAT_SECTIONS,
    weight: { math: 13, rw: 12 },
  },
  {
    id: "nyx-sat-mini-2",
    title: "Nyx SAT skills exam · Math focus",
    test: "SAT",
    durationMin: 30,
    questions: 20,
    released: "Apr 14, 2026",
    status: "available",
    sections: SAT_SECTIONS,
    weight: { math: 16, rw: 4 },
  },
  {
    id: "nyx-act-mini-1",
    title: "Nyx ACT skills exam · 28Q",
    test: "ACT",
    durationMin: 38,
    questions: 28,
    released: "Apr 7, 2026",
    status: "available",
    sections: ACT_SECTIONS,
    weight: { math: 13, rw: 15 },
  },
  {
    id: "nyx-sat-mini-3",
    title: "Nyx SAT skills exam · R&W focus",
    test: "SAT",
    durationMin: 28,
    questions: 20,
    released: "Apr 21, 2026",
    status: "available",
    sections: SAT_SECTIONS,
    weight: { math: 4, rw: 16 },
  },
  {
    id: "nyx-sat-mini-4",
    title: "Nyx SAT skills exam · Hard set",
    test: "SAT",
    durationMin: 40,
    questions: 22,
    released: "Apr 30, 2026",
    status: "available",
    sections: SAT_SECTIONS,
    weight: { math: 11, rw: 11 },
  },
  {
    id: "nyx-act-mini-2",
    title: "Nyx ACT skills exam · Math + Science",
    test: "ACT",
    durationMin: 32,
    questions: 22,
    released: "Apr 14, 2026",
    status: "available",
    sections: ACT_SECTIONS,
    weight: { math: 14, rw: 8 },
  },
  {
    id: "nyx-act-mini-3",
    title: "Nyx ACT skills exam · English + Reading",
    test: "ACT",
    durationMin: 30,
    questions: 22,
    released: "Apr 21, 2026",
    status: "available",
    sections: ACT_SECTIONS,
    weight: { math: 6, rw: 16 },
  },
  {
    id: "nyx-sat-archive-1",
    title: "Nyx SAT skills exam · March set",
    test: "SAT",
    durationMin: 32,
    questions: 22,
    released: "Mar 7, 2026",
    status: "completed",
    scoreRange: { math: 740, rw: 700, composite: 1440 },
    sections: SAT_SECTIONS,
    weight: { math: 11, rw: 11 },
  },
  {
    id: "nyx-sat-archive-2",
    title: "Nyx SAT skills exam · February set",
    test: "SAT",
    durationMin: 32,
    questions: 22,
    released: "Feb 9, 2026",
    status: "completed",
    scoreRange: { math: 700, rw: 680, composite: 1380 },
    sections: SAT_SECTIONS,
    weight: { math: 11, rw: 11 },
  },
  {
    id: "nyx-act-archive-1",
    title: "Nyx ACT skills exam · February set",
    test: "ACT",
    durationMin: 35,
    questions: 26,
    released: "Feb 23, 2026",
    status: "completed",
    scoreRange: { math: 30, rw: 28, composite: 29 },
    sections: ACT_SECTIONS,
    weight: { math: 12, rw: 14 },
  },
];

export interface MockQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  rationale?: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  skill: string;
}

/** Stable hash so the same mock always produces the same question set. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

/** Mulberry32 — small deterministic PRNG. */
function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toMockQuestion(q: BankQuestion): MockQuestion {
  return {
    id: q.id,
    prompt: q.prompt,
    choices: q.choices,
    correctIndex: q.correct,
    rationale: q.rationale,
    section: q.section,
    difficulty: q.difficulty,
    skill: q.skill,
  };
}

/** Builds a question set for a mock, deterministic by mock id. */
export function buildMockQuestions(mock: MockTest): MockQuestion[] {
  const rng = makeRng(hashStr(mock.id));
  const mathPool = POOL.filter((q) => q.section === "Math");
  const rwPool   = POOL.filter((q) => q.section === "Reading & Writing");

  const wantMath = mock.weight?.math ?? Math.floor(mock.questions / 2);
  const wantRw   = mock.weight?.rw   ?? mock.questions - wantMath;

  const math = shuffle(mathPool, rng).slice(0, wantMath);
  const rw   = shuffle(rwPool,   rng).slice(0, wantRw);

  // Interleave roughly so a section's not all up front.
  const merged: BankQuestion[] = [];
  let mi = 0, ri = 0;
  const ratio = math.length / Math.max(1, rw.length);
  while (mi < math.length || ri < rw.length) {
    if (mi < math.length && (ri >= rw.length || (mi + 1) / Math.max(1, ri + 1) <= ratio)) {
      merged.push(math[mi++]);
    } else if (ri < rw.length) {
      merged.push(rw[ri++]);
    }
  }
  return merged.map(toMockQuestion);
}

export function getMockById(id: string): MockTest | undefined {
  return MOCKS.find((m) => m.id === id);
}
