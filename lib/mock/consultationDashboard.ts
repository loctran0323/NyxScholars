export type Section = "Math" | "RW";

export type ConsultationDashboardData = {
  student: {
    name: string;
    plan: "Free" | "Scholar" | "Constellation";
    nextSessionAt: string | null;
  };
  kpis: {
    diagnosticScore: { value: number; outOf: 1600; deltaFromLast: number | null };
    practiceHours: { value: number; window: "7d" | "30d" };
    streakDays: number;
    targetScore: number;
  };
  trajectory: { date: string; score: number }[];
  mastery: { skill: string; section: Section; mastery: number }[];
  upcomingSession: { tutor: string; topic: string; startsAt: string } | null;
  notes: { id: string; author: string; createdAt: string; body: string }[];
  recommendations: { id: string; title: string; cta: string; href: string }[];
};

export const mockDashboard: ConsultationDashboardData = {
  student: {
    name: "Arush Roy",
    plan: "Scholar",
    nextSessionAt: "2026-05-05T17:00:00-04:00",
  },
  kpis: {
    diagnosticScore: { value: 1490, outOf: 1600, deltaFromLast: 40 },
    practiceHours: { value: 6.5, window: "7d" },
    streakDays: 12,
    targetScore: 1480,
  },
  trajectory: [
    { date: "2026-02-09", score: 1230 },
    { date: "2026-02-23", score: 1255 },
    { date: "2026-03-09", score: 1270 },
    { date: "2026-03-23", score: 1285 },
    { date: "2026-04-06", score: 1290 },
    { date: "2026-04-20", score: 1310 },
  ],
  mastery: [
    { skill: "Linear equations",        section: "Math", mastery: 0.86 },
    { skill: "Systems",                  section: "Math", mastery: 0.72 },
    { skill: "Quadratics",               section: "Math", mastery: 0.55 },
    { skill: "Word problems",            section: "Math", mastery: 0.41 },
    { skill: "Geometry",                 section: "Math", mastery: 0.63 },
    { skill: "Statistics",               section: "Math", mastery: 0.58 },
    { skill: "Information & Ideas",      section: "RW",   mastery: 0.78 },
    { skill: "Craft & Structure",        section: "RW",   mastery: 0.62 },
    { skill: "Expression of Ideas",      section: "RW",   mastery: 0.49 },
    { skill: "Standard English",         section: "RW",   mastery: 0.71 },
  ],
  upcomingSession: {
    tutor: "Your tutor",
    topic: "Word problems · setup strategies",
    startsAt: "2026-05-05T17:00:00-04:00",
  },
  notes: [
    { id: "n1", author: "Your tutor", createdAt: "2026-04-29", body: "Strong on linear systems this week. Focus next on translating word problems before computation." },
    { id: "n2", author: "Your tutor", createdAt: "2026-04-25", body: "Reading passages: pace is good; second-pass close-reading still costs 4–5 min on long passages. Drill skim-then-locate." },
    { id: "n3", author: "Your tutor", createdAt: "2026-04-22", body: "Great mock score. Math was up 30; RW flat. Investigate whether grammar drills are pulling time from passage practice." },
  ],
  recommendations: [
    { id: "r1", title: "Drill word problems",    cta: "Start drill",   href: "/portal/sessions" },
    { id: "r2", title: "Review last mock",       cta: "Open report",   href: "/portal/sessions" },
    { id: "r3", title: "Schedule next session",  cta: "Pick a time",   href: "/portal/schedule" },
  ],
};
