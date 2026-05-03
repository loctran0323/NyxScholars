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
}

const SAT_SECTIONS: MockSection[] = [
  { name: "Module 1 · R&W", questions: 27, minutes: 32, scaledMin: 200, scaledMax: 800 },
  { name: "Module 2 · R&W", questions: 27, minutes: 32, scaledMin: 200, scaledMax: 800 },
  { name: "Module 1 · Math", questions: 22, minutes: 35, scaledMin: 200, scaledMax: 800 },
  { name: "Module 2 · Math", questions: 22, minutes: 35, scaledMin: 200, scaledMax: 800 },
];

const ACT_SECTIONS: MockSection[] = [
  { name: "English",  questions: 75, minutes: 45, scaledMin: 1, scaledMax: 36 },
  { name: "Math",     questions: 60, minutes: 60, scaledMin: 1, scaledMax: 36 },
  { name: "Reading",  questions: 40, minutes: 35, scaledMin: 1, scaledMax: 36 },
  { name: "Science",  questions: 40, minutes: 35, scaledMin: 1, scaledMax: 36 },
];

export const MOCKS: MockTest[] = [
  {
    id: "nyx-sat-2026-04",
    title: "Nyx SAT Mock #4 (April 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "Apr 4, 2026",
    status: "available",
    sections: SAT_SECTIONS,
  },
  {
    id: "nyx-sat-2026-03",
    title: "Nyx SAT Mock #3 (March 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "Mar 7, 2026",
    status: "completed",
    scoreRange: { math: 740, rw: 700, composite: 1440 },
    sections: SAT_SECTIONS,
  },
  {
    id: "nyx-act-2026-04",
    title: "Nyx ACT Mock #2 (April 2026)",
    test: "ACT",
    durationMin: 175,
    questions: 215,
    released: "Apr 18, 2026",
    status: "available",
    sections: ACT_SECTIONS,
  },
  {
    id: "nyx-sat-2026-05",
    title: "Nyx SAT Mock #5 (May 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "May 2, 2026",
    status: "coming-soon",
    sections: SAT_SECTIONS,
  },
];
