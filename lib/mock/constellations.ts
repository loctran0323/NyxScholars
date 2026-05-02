export type Section = "Math" | "R&W";

export type ConstellationStar = {
  id: string;
  name: string;
  mastery: number;        // 0..1
  attempted: number;
  /** local 0..1 within the constellation's bounding box */
  x: number;
  y: number;
};

export type Constellation = {
  id: string;
  name: string;
  glyph: string;          // editorial italic name ("The Lyre")
  section: Section;
  /** bounding box on the sky in normalized 0..1 coords */
  box: { x: number; y: number; w: number; h: number };
  stars: ConstellationStar[];
  edges: [string, string][];
};

export type SkyLevel = {
  name: "Dormant" | "Kindled" | "Burning" | "Radiant";
  tier: 1 | 2 | 3 | 4;
};

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "algebra",
    name: "Algebra",
    glyph: "The Lyre",
    section: "Math",
    box: { x: 0.06, y: 0.18, w: 0.22, h: 0.30 },
    stars: [
      { id: "lin-eq",   name: "Linear equations",     mastery: 0.92, attempted: 84, x: 0.30, y: 0.10 },
      { id: "lin-sys",  name: "Systems of equations", mastery: 0.78, attempted: 52, x: 0.70, y: 0.10 },
      { id: "lin-ineq", name: "Linear inequalities",  mastery: 0.66, attempted: 38, x: 0.20, y: 0.50 },
      { id: "lin-fn",   name: "Linear functions",     mastery: 0.84, attempted: 46, x: 0.80, y: 0.50 },
      { id: "abs-val",  name: "Absolute value",       mastery: 0.55, attempted: 24, x: 0.50, y: 0.95 },
    ],
    edges: [
      ["lin-eq", "lin-sys"], ["lin-eq", "lin-ineq"], ["lin-sys", "lin-fn"],
      ["lin-ineq", "abs-val"], ["lin-fn", "abs-val"], ["lin-ineq", "lin-fn"],
    ],
  },
  {
    id: "advmath",
    name: "Advanced Math",
    glyph: "The Compass",
    section: "Math",
    box: { x: 0.34, y: 0.14, w: 0.22, h: 0.36 },
    stars: [
      { id: "quad", name: "Quadratics",           mastery: 0.54, attempted: 42, x: 0.50, y: 0.05 },
      { id: "poly", name: "Polynomials",          mastery: 0.38, attempted: 28, x: 0.50, y: 0.45 },
      { id: "exp",  name: "Exponentials",         mastery: 0.61, attempted: 31, x: 0.10, y: 0.85 },
      { id: "rat",  name: "Rational expressions", mastery: 0.22, attempted: 18, x: 0.90, y: 0.85 },
    ],
    edges: [["quad", "poly"], ["poly", "exp"], ["poly", "rat"]],
  },
  {
    id: "data",
    name: "Problem Solving & Data",
    glyph: "The Scales",
    section: "Math",
    box: { x: 0.62, y: 0.16, w: 0.30, h: 0.30 },
    stars: [
      { id: "fulcrum", name: "Ratios & rates", mastery: 0.71, attempted: 36, x: 0.50, y: 0.05 },
      { id: "beam-l",  name: "Percentages",    mastery: 0.88, attempted: 44, x: 0.20, y: 0.40 },
      { id: "beam-r",  name: "Statistics",     mastery: 0.56, attempted: 28, x: 0.80, y: 0.40 },
      { id: "pan-l",   name: "Probability",    mastery: 0.43, attempted: 21, x: 0.20, y: 0.85 },
      { id: "pan-r",   name: "Data inference", mastery: 0.66, attempted: 26, x: 0.80, y: 0.85 },
    ],
    edges: [
      ["fulcrum", "beam-l"], ["fulcrum", "beam-r"],
      ["beam-l", "pan-l"], ["beam-r", "pan-r"], ["beam-l", "beam-r"],
    ],
  },
  {
    id: "geo",
    name: "Geometry & Trig",
    glyph: "The Triangle",
    section: "Math",
    box: { x: 0.10, y: 0.62, w: 0.22, h: 0.30 },
    stars: [
      { id: "apex", name: "Angles & lines", mastery: 0.68, attempted: 32, x: 0.50, y: 0.05 },
      { id: "b-l",  name: "Triangles",      mastery: 0.52, attempted: 26, x: 0.05, y: 0.92 },
      { id: "b-r",  name: "Circles",        mastery: 0.34, attempted: 17, x: 0.95, y: 0.92 },
      { id: "cent", name: "Trigonometry",   mastery: 0.18, attempted: 12, x: 0.50, y: 0.62 },
    ],
    edges: [["apex", "b-l"], ["apex", "b-r"], ["b-l", "b-r"], ["cent", "apex"], ["cent", "b-l"], ["cent", "b-r"]],
  },
  {
    id: "reading",
    name: "Reading",
    glyph: "The Owl",
    section: "R&W",
    box: { x: 0.36, y: 0.58, w: 0.26, h: 0.34 },
    stars: [
      { id: "eye-l",  name: "Main idea",            mastery: 0.81, attempted: 48, x: 0.30, y: 0.20 },
      { id: "eye-r",  name: "Inference",            mastery: 0.62, attempted: 36, x: 0.70, y: 0.20 },
      { id: "beak",   name: "Command of evidence",  mastery: 0.49, attempted: 28, x: 0.50, y: 0.45 },
      { id: "wing-l", name: "Vocabulary",           mastery: 0.74, attempted: 32, x: 0.10, y: 0.65 },
      { id: "wing-r", name: "Text structure",       mastery: 0.58, attempted: 22, x: 0.90, y: 0.65 },
      { id: "foot",   name: "Cross-text synthesis", mastery: 0.36, attempted: 14, x: 0.50, y: 0.95 },
    ],
    edges: [["eye-l", "eye-r"], ["eye-l", "beak"], ["eye-r", "beak"], ["eye-l", "wing-l"], ["eye-r", "wing-r"], ["beak", "foot"]],
  },
  {
    id: "writing",
    name: "Writing",
    glyph: "The Quill",
    section: "R&W",
    box: { x: 0.68, y: 0.58, w: 0.24, h: 0.34 },
    stars: [
      { id: "tip",    name: "Grammar & usage",      mastery: 0.72, attempted: 42, x: 0.10, y: 0.92 },
      { id: "shaft1", name: "Punctuation",          mastery: 0.85, attempted: 38, x: 0.40, y: 0.62 },
      { id: "shaft2", name: "Transitions",          mastery: 0.41, attempted: 22, x: 0.65, y: 0.38 },
      { id: "plume",  name: "Rhetorical synthesis", mastery: 0.28, attempted: 14, x: 0.90, y: 0.10 },
      { id: "barb",   name: "Boundaries",           mastery: 0.50, attempted: 18, x: 0.30, y: 0.20 },
    ],
    edges: [["tip", "shaft1"], ["shaft1", "shaft2"], ["shaft2", "plume"], ["plume", "barb"]],
  },
];

export type FlatSkill = ConstellationStar & {
  absX: number;
  absY: number;
  constellationId: string;
  constellationGlyph: string;
  constellationName: string;
  section: Section;
};

export const ALL_SKILLS: FlatSkill[] = CONSTELLATIONS.flatMap((c) =>
  c.stars.map((s) => ({
    ...s,
    absX: c.box.x + s.x * c.box.w,
    absY: c.box.y + s.y * c.box.h,
    constellationId: c.id,
    constellationGlyph: c.glyph,
    constellationName: c.name,
    section: c.section,
  })),
);

export function levelFor(avg: number): SkyLevel {
  if (avg >= 0.85) return { name: "Radiant", tier: 4 };
  if (avg >= 0.60) return { name: "Burning", tier: 3 };
  if (avg >= 0.30) return { name: "Kindled", tier: 2 };
  return { name: "Dormant", tier: 1 };
}

export type Player = {
  name: string;
  initials: string;
  level: number;
  xpInLevel: number;
  xpToLevel: number;
  totalStardust: number;
  streak: number;
  rank: string;
  daysLeft: number;
};

export const PLAYER: Player = {
  name: "Avery Chen",
  initials: "AC",
  level: 7,
  xpInLevel: 420,
  xpToLevel: 600,
  totalStardust: 4280,
  streak: 14,
  rank: "Astronomer",
  daysLeft: 36,
};

export type Achievement = {
  id: string;
  name: string;
  desc: string;
  earned: boolean;
  glyph: "star" | "compass" | "aurora" | "eclipse" | "map";
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-light",  name: "First Light",  desc: "Light your first star",      earned: true,  glyph: "star" },
  { id: "pathfinder",   name: "Pathfinder",   desc: "Complete a constellation",   earned: true,  glyph: "compass" },
  { id: "aurora",       name: "Aurora",       desc: "3-day perfect streak",       earned: true,  glyph: "aurora" },
  { id: "eclipse",      name: "Eclipse",      desc: "Master a hard skill",        earned: false, glyph: "eclipse" },
  { id: "cartographer", name: "Cartographer", desc: "All constellations kindled", earned: false, glyph: "map" },
];

export type DailyTask = {
  skill: string;
  questions: number;
  minutes: number;
  why: string;
};

export const DAILY_PLAN: DailyTask[] = [
  { skill: "Trigonometry",        questions: 8, minutes: 12, why: "Lowest mastery" },
  { skill: "Rational expressions", questions: 6, minutes: 8,  why: "Edge of ability" },
  { skill: "Mixed review",         questions: 4, minutes: 4,  why: "Spaced repetition" },
];

export const SCORE_HISTORY: number[] = [
  1180, 1210, 1240, 1235, 1280, 1310, 1305, 1340, 1370, 1380, 1410, 1420,
];
export const SCORE_TARGET = 1500;

/** 91-cell activity heatmap, 13 weeks × 7 days, deterministic */
export const ACTIVITY: number[] = (() => {
  const out: number[] = [];
  for (let i = 0; i < 91; i++) {
    const v = Math.sin(i * 0.4) * 0.3 + ((i * 9301 + 49297) % 100) / 100;
    out.push(Math.max(0, Math.floor(v * 50)));
  }
  for (let i = 80; i < 91; i++) out[i] = 20 + ((i * 13 + 7) % 30);
  return out;
})();
