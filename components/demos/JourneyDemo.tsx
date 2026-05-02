"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The Journey Demo — Maya's 90-day arc from 1180 → 1520. Scrubable
 * timeline with six waypoints, constellation sky that lights up
 * over time, click any star to see sample questions.
 *
 * Each constellation is tagged with the SAT topic it represents and
 * the specific skills it tracks; hover any constellation label or
 * star for instant context, click for the full breakdown.
 */

const NIGHT = "#070914";
const NIGHT_2 = "#0c1124";
const NIGHT_3 = "#141a30";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#7a82a0";
const TEXT_FAINT = "#4a5170";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";

type Section = "Math" | "R&W";

type Star = { id: string; x: number; y: number; skill: string };
type ConstellationIcon = "owl" | "quill" | "star" | "crescent";
type Constellation = {
  id: string;
  name: string;             // mythic name ("The Lyre")
  topic: string;            // SAT topic ("Algebra")
  description: string;      // what this constellation covers
  icon: ConstellationIcon;
  section: Section;
  cx: number; cy: number;
  stars: Star[];
  edges: [number, number][];
};

const CONSTELLATIONS: Constellation[] = [
  {
    id: "lyre", name: "The Lyre", topic: "Algebra", section: "Math",
    description: "The bedrock. Linear equations, functions, systems, inequalities. Roughly 35% of the SAT Math section.",
    icon: "star", cx: 0.18, cy: 0.32,
    stars: [
      { id: "l1", x: 0.16, y: 0.26, skill: "Linear equations" },
      { id: "l2", x: 0.22, y: 0.30, skill: "Linear functions" },
      { id: "l3", x: 0.14, y: 0.36, skill: "Systems of equations" },
      { id: "l4", x: 0.20, y: 0.40, skill: "Inequalities" },
      { id: "l5", x: 0.17, y: 0.45, skill: "Slope & rate" },
    ],
    edges: [[0,1],[0,2],[2,3],[3,4],[1,3]],
  },
  {
    id: "compass", name: "The Compass", topic: "Advanced Math", section: "Math",
    description: "Where the SAT separates 1300s from 1500s. Quadratics, polynomials, exponentials, trig.",
    icon: "star", cx: 0.50, cy: 0.28,
    stars: [
      { id: "c1", x: 0.48, y: 0.18, skill: "Quadratics" },
      { id: "c2", x: 0.55, y: 0.25, skill: "Polynomials" },
      { id: "c3", x: 0.50, y: 0.30, skill: "Exponentials" },
      { id: "c4", x: 0.45, y: 0.25, skill: "Functions" },
      { id: "c5", x: 0.50, y: 0.40, skill: "Trigonometry" },
    ],
    edges: [[0,1],[0,3],[1,2],[3,2],[2,4]],
  },
  {
    id: "scales", name: "The Scales", topic: "Problem Solving & Data", section: "Math",
    description: "Word problems and statistics. Often the most missed by strong algebraists who don't slow down on the setup.",
    icon: "star", cx: 0.82, cy: 0.34,
    stars: [
      { id: "s1", x: 0.78, y: 0.30, skill: "Ratios" },
      { id: "s2", x: 0.86, y: 0.30, skill: "Percentages" },
      { id: "s3", x: 0.82, y: 0.36, skill: "Statistics" },
      { id: "s4", x: 0.78, y: 0.42, skill: "Probability" },
      { id: "s5", x: 0.86, y: 0.42, skill: "Data inference" },
    ],
    edges: [[0,1],[0,2],[1,2],[2,3],[2,4]],
  },
  {
    id: "owl", name: "The Owl", topic: "Reading", section: "R&W",
    description: "Pure comprehension. Inference, main idea, evidence, vocabulary in context, cross-text synthesis.",
    icon: "owl", cx: 0.22, cy: 0.72,
    stars: [
      { id: "o1", x: 0.18, y: 0.66, skill: "Inference" },
      { id: "o2", x: 0.26, y: 0.66, skill: "Main idea" },
      { id: "o3", x: 0.22, y: 0.72, skill: "Vocabulary in context" },
      { id: "o4", x: 0.16, y: 0.78, skill: "Command of evidence" },
      { id: "o5", x: 0.28, y: 0.78, skill: "Cross-text synthesis" },
    ],
    edges: [[0,2],[1,2],[2,3],[2,4],[0,1]],
  },
  {
    id: "quill", name: "The Quill", topic: "Writing", section: "R&W",
    description: "Standard English conventions. Punctuation, agreement, modifiers, pronouns, sentence structure.",
    icon: "quill", cx: 0.55, cy: 0.74,
    stars: [
      { id: "q1", x: 0.50, y: 0.66, skill: "Punctuation" },
      { id: "q2", x: 0.55, y: 0.70, skill: "Subject-verb agreement" },
      { id: "q3", x: 0.60, y: 0.74, skill: "Modifiers" },
      { id: "q4", x: 0.58, y: 0.80, skill: "Pronouns" },
      { id: "q5", x: 0.52, y: 0.80, skill: "Sentence structure" },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,1]],
  },
  {
    id: "triangle", name: "The Triangle", topic: "Rhetoric", section: "R&W",
    description: "Expression of ideas — transitions, rhetorical synthesis, sentence boundaries, form & purpose.",
    icon: "star", cx: 0.83, cy: 0.72,
    stars: [
      { id: "t1", x: 0.83, y: 0.65, skill: "Transitions" },
      { id: "t2", x: 0.77, y: 0.78, skill: "Rhetorical synthesis" },
      { id: "t3", x: 0.89, y: 0.78, skill: "Boundaries" },
      { id: "t4", x: 0.83, y: 0.74, skill: "Form & purpose" },
    ],
    edges: [[0,1],[1,2],[2,0],[0,3],[1,3],[2,3]],
  },
];

const ALL_STARS: string[] = CONSTELLATIONS.flatMap((c) => c.stars.map((s) => s.id));

const ICON_PATH: Record<ConstellationIcon, string> = {
  owl: "/design/icons/owl.png",
  quill: "/design/icons/quill.png",
  star: "/design/icons/star.png",
  crescent: "/design/icons/crescent.png",
};

type Mastery = Record<string, number>;
function makeMastery(fn: (id: string, i: number) => number): Mastery {
  const m: Mastery = {};
  ALL_STARS.forEach((id, i) => {
    m[id] = Math.max(0, Math.min(1, fn(id, i)));
  });
  return m;
}

type Stat = { score: number; ci: number; lit: number; total: number; sessions: number };

type Waypoint = {
  day: number; label: string; title: string; caption: string;
  stat: Stat; mastery: Mastery;
};

const EMPTY_MASTERY: Mastery = (() => {
  const m: Mastery = {};
  ALL_STARS.forEach((id) => { m[id] = 0; });
  return m;
})();

const FALLBACK_WAYPOINT: Waypoint = {
  day: 0, label: "—", title: "—", caption: "—",
  stat: { score: 1180, ci: 90, lit: 0, total: ALL_STARS.length, sessions: 0 },
  mastery: EMPTY_MASTERY,
};

const WAYPOINTS: Waypoint[] = [
  {
    day: 0, label: "Diagnostic Day",
    title: "The first measurement.",
    caption: "Maya took the 30-question adaptive intake. Every star measured, most still dim. Estimated range: ~1180.",
    stat: { score: 1180, ci: 90, lit: 0, total: 29, sessions: 1 },
    mastery: makeMastery((_id, i) => 0.10 + (i % 7) * 0.04),
  },
  {
    day: 7, label: "Week 1",
    title: "A daily rhythm.",
    caption: "Seven sessions in seven days. Linear equations and punctuation — Maya's easiest wins — locked in. The Lyre is the first constellation to kindle.",
    stat: { score: 1230, ci: 70, lit: 4, total: 29, sessions: 8 },
    mastery: makeMastery((id, i) => {
      const base = 0.15 + (i % 7) * 0.04;
      if (id.startsWith("l")) return base + 0.45;
      if (id === "q1" || id === "q2") return base + 0.40;
      return base + 0.10;
    }),
  },
  {
    day: 21, label: "Week 3",
    title: "Edges grow brighter.",
    caption: "Twenty-one sessions. The Quill is now kindled and the Owl is close behind. Maya started flagging hard inference questions — they're cycling back via spaced review.",
    stat: { score: 1310, ci: 55, lit: 11, total: 29, sessions: 23 },
    mastery: makeMastery((id, i) => {
      if (id.startsWith("l")) return 0.78;
      if (id.startsWith("q")) return 0.65;
      if (id.startsWith("o")) return 0.50;
      if (id.startsWith("s")) return 0.45;
      if (id === "c1") return 0.55;
      return 0.20 + (i % 5) * 0.05;
    }),
  },
  {
    day: 45, label: "Week 6",
    title: "Constellations burning.",
    caption: "The Compass is the first to reach burning. Trigonometry — Maya's deepest gap — finally moved. Quadratics and polynomials clicked in a single weekend session.",
    stat: { score: 1400, ci: 40, lit: 19, total: 29, sessions: 51 },
    mastery: makeMastery((id) => {
      if (id.startsWith("l")) return 0.88;
      if (id.startsWith("q")) return 0.78;
      if (id.startsWith("o")) return 0.72;
      if (id.startsWith("s")) return 0.65;
      if (id.startsWith("c")) return 0.70;
      if (id.startsWith("t")) return 0.42;
      return 0.30;
    }),
  },
  {
    day: 75, label: "Week 11",
    title: "First radiance.",
    caption: "The Lyre reaches radiant — every linear-equation star at mastery. The Triangle still needs work, especially rhetorical synthesis. One mock test scored 1480.",
    stat: { score: 1470, ci: 30, lit: 25, total: 29, sessions: 82 },
    mastery: makeMastery((id) => {
      if (id.startsWith("l")) return 0.96;
      if (id.startsWith("q")) return 0.88;
      if (id.startsWith("o")) return 0.85;
      if (id.startsWith("s")) return 0.80;
      if (id.startsWith("c")) return 0.85;
      if (id.startsWith("t")) return 0.55;
      return 0.50;
    }),
  },
  {
    day: 90, label: "Test Eve",
    title: "Maya's sky is full.",
    caption: "Five constellations radiant, one burning. Estimated range: ~1520. The night before the SAT, every star Maya needs is lit.",
    stat: { score: 1520, ci: 20, lit: 28, total: 29, sessions: 98 },
    mastery: makeMastery((id) => {
      if (id.startsWith("l")) return 0.98;
      if (id.startsWith("q")) return 0.94;
      if (id.startsWith("o")) return 0.92;
      if (id.startsWith("s")) return 0.90;
      if (id.startsWith("c")) return 0.92;
      if (id.startsWith("t")) return 0.78;
      return 0.85;
    }),
  },
];

type SampleQ = { prompt: string; choices: string[]; correct: number; d: 1|2|3|4|5 };
const SAMPLE_QUESTIONS: Record<string, SampleQ[]> = {
  "Linear equations": [
    { prompt: "If 3x + 7 = 22, what is x?", choices: ["3", "5", "7", "15"], correct: 1, d: 1 },
    { prompt: "If 2(x − 3) = 4x + 2, what is x?", choices: ["−4", "−2", "2", "4"], correct: 0, d: 2 },
  ],
  "Quadratics": [
    { prompt: "x² − 6x + k = 0 has exactly one real solution. What is k?", choices: ["3", "6", "9", "12"], correct: 2, d: 4 },
    { prompt: "What are the roots of x² − 5x + 6 = 0?", choices: ["1, 6", "2, 3", "−2, −3", "−1, −6"], correct: 1, d: 2 },
  ],
  "Inference": [
    { prompt: "Based on the passage, the author would most likely agree that ______ is essential to civic institutions.", choices: ["large-scale federal funding", "sustained volunteer engagement", "centralized oversight", "strict membership requirements"], correct: 1, d: 2 },
  ],
  "Punctuation": [
    { prompt: "Which choice conforms to Standard English?\n\n\"The committee's report ______ which was released yesterday, recommends three changes.\"", choices: [", ", " — ", "; ", ": "], correct: 0, d: 2 },
  ],
  "Trigonometry": [
    { prompt: "In triangle ABC, angle B is a right angle, AB = 6, BC = 8. What is sin(A)?", choices: ["3/5", "4/5", "3/4", "4/3"], correct: 1, d: 5 },
  ],
  "Percentages": [
    { prompt: "A jacket originally priced at $80 is on sale for $60. By what percent has the price been reduced?", choices: ["15%", "20%", "25%", "33%"], correct: 2, d: 2 },
  ],
};

function tierFor(avg: number): { name: string; color: string; glow: number } {
  if (avg >= 0.85) return { name: "RADIANT", color: MOON_HI, glow: 14 };
  if (avg >= 0.65) return { name: "BURNING", color: MOON, glow: 10 };
  if (avg >= 0.35) return { name: "KINDLED", color: MOON_DIM, glow: 6 };
  return { name: "DORMANT", color: TEXT_FAINT, glow: 2 };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function safeWp(idx: number): Waypoint {
  if (idx < 0 || idx >= WAYPOINTS.length) return FALLBACK_WAYPOINT;
  return WAYPOINTS[idx] ?? FALLBACK_WAYPOINT;
}

function interpolate(a: Waypoint, b: Waypoint | undefined, f: number): Waypoint {
  if (!a) return FALLBACK_WAYPOINT;
  if (!b) return a;
  const m: Mastery = {};
  ALL_STARS.forEach((id) => {
    m[id] = lerp(a.mastery[id] ?? 0, b.mastery[id] ?? 0, f);
  });
  return {
    day: lerp(a.day, b.day, f),
    label: f > 0.5 ? b.label : a.label,
    title: f > 0.5 ? b.title : a.title,
    caption: f > 0.5 ? b.caption : a.caption,
    stat: {
      score: Math.round(lerp(a.stat.score, b.stat.score, f)),
      ci: Math.round(lerp(a.stat.ci, b.stat.ci, f)),
      lit: Math.round(lerp(a.stat.lit, b.stat.lit, f)),
      total: a.stat.total,
      sessions: Math.round(lerp(a.stat.sessions, b.stat.sessions, f)),
    },
    mastery: m,
  };
}

type SelectedStar = {
  id: string; skill: string; section: Section; constellation: string; constellationId: string;
};

type FocusedConstellation = string | null;

export function JourneyDemo() {
  const [wpIdx, setWpIdxRaw] = useState(0);
  const [interp, setInterp] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<SelectedStar | null>(null);
  const [focusedConst, setFocusedConst] = useState<FocusedConstellation>(null);
  const [hoveredStar, setHoveredStar] = useState<{ id: string; skill: string; section: Section; constellation: string } | null>(null);
  const [openConst, setOpenConst] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  function setWpIdx(v: number | ((prev: number) => number)) {
    setWpIdxRaw((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      return Math.max(0, Math.min(WAYPOINTS.length - 1, next));
    });
  }

  function goTo(i: number) {
    setWpIdx(i);
    setInterp(0);
    setPlaying(false);
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goTo(Math.min(WAYPOINTS.length - 1, wpIdx + 1));
      if (e.key === "ArrowLeft") goTo(Math.max(0, wpIdx - 1));
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wpIdx]);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      setInterp((prev) => {
        const next = prev + dt * 0.4;
        if (next >= 1) {
          if (wpIdx >= WAYPOINTS.length - 1) {
            setPlaying(false);
            return 0;
          }
          setWpIdx((i) => i + 1);
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, wpIdx]);

  const current = useMemo(() => {
    const a = safeWp(wpIdx);
    const b = wpIdx + 1 < WAYPOINTS.length ? safeWp(wpIdx + 1) : undefined;
    return interpolate(a, b, interp);
  }, [wpIdx, interp]);

  // Track previous mastery so we can flag stars that just crossed thresholds
  const prevMasteryRef = useRef<Mastery>(current.mastery);
  const justIgnited = useRef<Record<string, number>>({});
  useEffect(() => {
    const prev = prevMasteryRef.current;
    const now = current.mastery;
    const newlyIgnited: Record<string, number> = {};
    ALL_STARS.forEach((id) => {
      const p = prev[id] ?? 0;
      const c = now[id] ?? 0;
      // A star "ignites" when crossing tier thresholds during scrub
      const crossings = [0.35, 0.65, 0.85];
      for (const t of crossings) {
        if (p < t && c >= t) {
          newlyIgnited[id] = performance.now();
          break;
        }
      }
    });
    if (Object.keys(newlyIgnited).length > 0) {
      justIgnited.current = { ...justIgnited.current, ...newlyIgnited };
    }
    prevMasteryRef.current = now;
  }, [current]);

  const overallProgress = (wpIdx + interp) / (WAYPOINTS.length - 1);
  const currentLabel = safeWp(wpIdx).label;

  return (
    <div
      className="rounded-[6px] overflow-hidden border"
      style={{ borderColor: LINE, background: NIGHT, color: TEXT, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <TopBar current={current} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] min-h-[560px] relative" style={{ borderTop: `1px solid ${LINE}` }}>
        <SkyCanvas
          mastery={current.mastery}
          stats={current.stat}
          onStarClick={(s) => { setSelected(s); setFocusedConst(s.constellationId); }}
          onConstClick={(id) => setOpenConst(id)}
          selectedStarId={selected?.id ?? null}
          focusedConst={focusedConst}
          setFocusedConst={setFocusedConst}
          hoveredStar={hoveredStar}
          setHoveredStar={setHoveredStar}
          justIgnited={justIgnited.current}
        />
        <RightRail
          current={current}
          waypointLabel={currentLabel}
          focusedConst={focusedConst}
          setFocusedConst={setFocusedConst}
          onConstClick={(id) => setOpenConst(id)}
        />
        {selected ? (
          <SkillPanel
            star={selected}
            mastery={current.mastery[selected.id] || 0}
            onClose={() => setSelected(null)}
          />
        ) : null}
        {openConst && !selected ? (
          <TopicPanel
            constellation={CONSTELLATIONS.find((c) => c.id === openConst)!}
            current={current}
            onClose={() => setOpenConst(null)}
            onSkillClick={(starId, skill, section, constellation, constellationId) => {
              setSelected({ id: starId, skill, section, constellation, constellationId });
              setOpenConst(null);
            }}
          />
        ) : null}
      </div>
      <Timeline
        wpIdx={wpIdx}
        playing={playing}
        progress={overallProgress}
        onPlay={() => setPlaying((p) => !p)}
        onWaypoint={goTo}
        onScrub={(v) => {
          const total = WAYPOINTS.length - 1;
          const pos = v * total;
          const idx = Math.floor(pos);
          const frac = pos - idx;
          if (idx >= total) { setWpIdx(total); setInterp(0); }
          else { setWpIdx(idx); setInterp(frac); }
          setPlaying(false);
        }}
      />
    </div>
  );
}

/* ─── TopBar ─── */
function TopBar({ current }: { current: Waypoint }) {
  return (
    <div className="flex justify-between items-center px-5 py-3.5" style={{ background: NIGHT }}>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.32em]" style={{ color: TEXT_DIM }}>
          MAYA&rsquo;S 90 DAYS
        </span>
      </div>
      <div className="flex gap-5 sm:gap-7 items-baseline">
        <Stat label="DAY" value={`${Math.round(current.day)}`} />
        <Stat label="STARS" value={`${current.stat.lit}/${current.stat.total}`} />
        <Stat label="SESSIONS" value={`${current.stat.sessions}`} />
        <Stat label="ESTIMATED" value={`~${current.stat.score}`} accent />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_DIM }}>{label}</div>
      <div
        className="mt-0.5 tabular-nums"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: 19,
          color: accent ? MOON : TEXT,
          fontStyle: accent ? "italic" : "normal",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── SkyCanvas ─── */
const NYX_CURSOR =
  "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2226%22 height=%2226%22 viewBox=%220 0 26 26%22><circle cx=%2213%22 cy=%2213%22 r=%2210%22 fill=%22none%22 stroke=%22%237dd3fc%22 stroke-width=%221%22 opacity=%220.6%22/><circle cx=%2213%22 cy=%2213%22 r=%221.5%22 fill=%22%23bde9ff%22/><line x1=%2213%22 y1=%224%22 x2=%2213%22 y2=%229%22 stroke=%22%237dd3fc%22 stroke-width=%221%22/><line x1=%2213%22 y1=%2217%22 x2=%2213%22 y2=%2222%22 stroke=%22%237dd3fc%22 stroke-width=%221%22/><line x1=%224%22 y1=%2213%22 x2=%229%22 y2=%2213%22 stroke=%22%237dd3fc%22 stroke-width=%221%22/><line x1=%2217%22 y1=%2213%22 x2=%2222%22 y2=%2213%22 stroke=%22%237dd3fc%22 stroke-width=%221%22/></svg>') 13 13, crosshair";

function SkyCanvas({
  mastery, stats, onStarClick, onConstClick, selectedStarId, focusedConst, setFocusedConst,
  hoveredStar, setHoveredStar, justIgnited,
}: {
  mastery: Mastery;
  stats: Stat;
  onStarClick: (s: SelectedStar) => void;
  onConstClick: (id: string) => void;
  selectedStarId: string | null;
  focusedConst: FocusedConstellation;
  setFocusedConst: (id: FocusedConstellation) => void;
  hoveredStar: { id: string; skill: string; section: Section; constellation: string } | null;
  setHoveredStar: (s: { id: string; skill: string; section: Section; constellation: string } | null) => void;
  justIgnited: Record<string, number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1000, h: 540 });
  useEffect(() => {
    function measure() {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const bgStars = useMemo(() => {
    const arr: { x: number; y: number; s: number; twinkle: boolean }[] = [];
    for (let i = 0; i < 200; i++) {
      const seed = i * 9301 + 49297;
      arr.push({
        x: ((seed * 233 + 1) % 1000) / 1000,
        y: ((seed * 977 + 7) % 1000) / 1000,
        s: ((seed * 7 + 3) % 100) / 100,
        twinkle: i % 7 === 0,
      });
    }
    return arr;
  }, []);

  const focusedC = focusedConst ? CONSTELLATIONS.find((c) => c.id === focusedConst) ?? null : null;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-[480px] lg:min-h-[540px]"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #0f1530 0%, #060a1f 60%, #03050e 100%)",
        cursor: NYX_CURSOR,
      }}
    >
      {/* horizon */}
      <div
        className="absolute left-0 right-0 z-[1]"
        style={{ top: "50%", height: 1, background: `linear-gradient(90deg, transparent, ${LINE}, transparent)`, opacity: 0.6 }}
      />
      <div
        className="absolute z-[2] font-mono"
        style={{ left: 18, top: "calc(50% - 12px)", fontSize: 9, letterSpacing: 4, color: TEXT_FAINT }}
      >
        MATH
      </div>
      <div
        className="absolute z-[2] font-mono"
        style={{ left: 18, top: "calc(50% + 5px)", fontSize: 9, letterSpacing: 4, color: TEXT_FAINT }}
      >
        R&amp;W
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
      >
        {bgStars.map((s, i) => (
          <circle
            key={`bg${i}`}
            cx={s.x * size.w}
            cy={s.y * size.h}
            r={s.s * 0.9 + 0.2}
            fill={TEXT_FAINT}
            opacity={s.s * 0.4 + 0.1}
          >
            {s.twinkle ? (
              <animate attributeName="opacity" values={`${s.s * 0.2};${s.s * 0.7};${s.s * 0.2}`} dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
            ) : null}
          </circle>
        ))}

        {CONSTELLATIONS.map((c) => {
          const masteries = c.stars.map((s) => mastery[s.id] || 0);
          const avg = masteries.reduce((a, b) => a + b, 0) / masteries.length;
          const tier = tierFor(avg);
          const isFocused = focusedConst === c.id;
          const isDimmed = focusedConst !== null && !isFocused;
          return (
            <g
              key={c.id}
              opacity={isDimmed ? 0.35 : 1}
              style={{ transition: "opacity 0.3s" }}
              onMouseEnter={() => setFocusedConst(c.id)}
              onMouseLeave={() => setFocusedConst(null)}
            >
              {c.edges.map(([a, b], i) => {
                const sa = c.stars[a]; const sb = c.stars[b];
                const ma = mastery[sa.id] || 0;
                const mb = mastery[sb.id] || 0;
                const litness = Math.min(ma, mb);
                return (
                  <line
                    key={i}
                    x1={sa.x * size.w} y1={sa.y * size.h}
                    x2={sb.x * size.w} y2={sb.y * size.h}
                    stroke={tier.color}
                    strokeWidth={(0.5 + litness * 0.6) * (isFocused ? 1.8 : 1)}
                    opacity={0.15 + litness * 0.55}
                    style={{ transition: "all 0.6s ease-out" }}
                  />
                );
              })}

              {/* clickable label group */}
              <g
                style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); onConstClick(c.id); }}
              >
                <text
                  x={c.cx * size.w}
                  y={(c.section === "Math" ? c.cy - 0.16 : c.cy + 0.18) * size.h}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                    fontSize: isFocused ? 15 : 13,
                    fill: avg > 0.3 || isFocused ? TEXT : TEXT_FAINT,
                    letterSpacing: 1,
                    transition: "all 0.3s",
                  }}
                >
                  {c.name}
                </text>
                <text
                  x={c.cx * size.w}
                  y={(c.section === "Math" ? c.cy - 0.135 : c.cy + 0.21) * size.h}
                  textAnchor="middle"
                  style={{
                    fontSize: 8,
                    letterSpacing: 3,
                    fill: tier.color,
                    opacity: 0.85,
                    transition: "fill 0.6s",
                  }}
                >
                  {c.topic.toUpperCase()} · {tier.name} · {Math.round(avg * 100)}%
                </text>
              </g>

              {c.stars.map((s) => {
                const m = mastery[s.id] || 0;
                const r = 1 + m * 4;
                const glow = 4 + m * 18;
                const color = m > 0.85 ? MOON_HI : m > 0.45 ? MOON : m > 0.2 ? MOON_DIM : TEXT_FAINT;
                const isSelected = selectedStarId === s.id;
                const isHovered = hoveredStar?.id === s.id;
                const ignitedAt = justIgnited[s.id];
                const sinceIgnite = ignitedAt ? performance.now() - ignitedAt : Infinity;
                const isIgniting = sinceIgnite < 1200;
                return (
                  <g
                    key={s.id}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredStar({ id: s.id, skill: s.skill, section: c.section, constellation: c.name })}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarClick({
                        id: s.id, skill: s.skill, section: c.section,
                        constellation: c.name, constellationId: c.id,
                      });
                    }}
                  >
                    {isIgniting ? (
                      <circle cx={s.x * size.w} cy={s.y * size.h} r={r + 4} fill="none" stroke={MOON_HI} strokeWidth="1.2">
                        <animate attributeName="r" values={`${r + 4};${r + 22}`} dur="1.0s" begin="0s" />
                        <animate attributeName="opacity" values="1;0" dur="1.0s" begin="0s" />
                      </circle>
                    ) : null}
                    {isSelected ? (
                      <circle cx={s.x * size.w} cy={s.y * size.h} r={r + 8} fill="none" stroke={MOON_HI} strokeWidth="1" opacity="0.9">
                        <animate attributeName="r" values={`${r + 6};${r + 12};${r + 6}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    ) : null}
                    {isHovered && !isSelected ? (
                      <circle cx={s.x * size.w} cy={s.y * size.h} r={r + 5} fill="none" stroke={MOON} strokeWidth="0.8" opacity="0.7" />
                    ) : null}
                    {m > 0.1 ? (
                      <circle cx={s.x * size.w} cy={s.y * size.h} r={glow} fill={color} opacity={m * 0.18} style={{ transition: "all 0.6s" }} />
                    ) : null}
                    <circle cx={s.x * size.w} cy={s.y * size.h} r={r * 1.5} fill={color} opacity={0.3 + m * 0.4} style={{ transition: "all 0.6s" }} />
                    <circle cx={s.x * size.w} cy={s.y * size.h} r={r} fill={color} style={{ transition: "all 0.6s" }} />
                    <circle cx={s.x * size.w} cy={s.y * size.h} r={Math.max(r + 10, 14)} fill="transparent" />
                    {m > 0.5 ? (
                      <>
                        <line x1={s.x * size.w - r * 3} y1={s.y * size.h} x2={s.x * size.w + r * 3} y2={s.y * size.h} stroke={color} strokeWidth="0.4" opacity={m * 0.7} pointerEvents="none" />
                        <line x1={s.x * size.w} y1={s.y * size.h - r * 3} x2={s.x * size.w} y2={s.y * size.h + r * 3} stroke={color} strokeWidth="0.4" opacity={m * 0.7} pointerEvents="none" />
                      </>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Hovered-star tooltip */}
      {hoveredStar ? (
        <div
          className="absolute pointer-events-none"
          style={{
            top: 14, left: "50%", transform: "translateX(-50%)",
            background: `${NIGHT_2}f0`, border: `1px solid ${MOON_DIM}`,
            padding: "8px 14px", borderRadius: 4,
            backdropFilter: "blur(6px)", zIndex: 5,
          }}
        >
          <div className="font-mono mb-0.5" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_DIM }}>
            {hoveredStar.section.toUpperCase()} · {hoveredStar.constellation.toUpperCase()}
          </div>
          <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, color: TEXT }}>
            {hoveredStar.skill}
          </div>
        </div>
      ) : null}

      {/* Focused-constellation badge */}
      {focusedC && !hoveredStar ? (
        <div
          className="absolute pointer-events-none"
          style={{
            top: 14, left: "50%", transform: "translateX(-50%)",
            background: `${NIGHT_2}f0`, border: `1px solid ${MOON_DIM}`,
            padding: "8px 14px", borderRadius: 4,
            backdropFilter: "blur(6px)", maxWidth: 360, zIndex: 4,
          }}
        >
          <div className="flex items-center gap-2.5">
            <Image src={ICON_PATH[focusedC.icon]} alt="" width={16} height={16} className="opacity-90" />
            <div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: MOON }}>
                {focusedC.topic.toUpperCase()}
              </div>
              <div className="italic mt-0.5" style={{ fontFamily: "var(--font-fraunces)", fontSize: 13, color: TEXT, lineHeight: 1.2 }}>
                {focusedC.name} · {focusedC.stars.length} skills
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="absolute italic"
        style={{
          left: 16, bottom: 14,
          fontFamily: "var(--font-fraunces)", color: TEXT, fontSize: 12,
          background: `${NIGHT}cc`, padding: "6px 12px", border: `1px solid ${LINE}`, borderRadius: 3,
        }}
      >
        {Math.round((stats.lit / stats.total) * 100)}% lit · {stats.lit} of {stats.total} stars
      </div>

      <div
        className="absolute font-mono"
        style={{
          right: 16, bottom: 14,
          fontSize: 10, letterSpacing: 3, color: MOON,
          background: `${NIGHT_2}e6`, padding: "5px 10px",
          border: `1px solid ${MOON_DIM}`, borderRadius: 20,
        }}
      >
        ✦ hover · click any star or constellation
      </div>
    </div>
  );
}

/* ─── Right rail ─── */
function RightRail({
  current, waypointLabel, focusedConst, setFocusedConst, onConstClick,
}: {
  current: Waypoint;
  waypointLabel: string;
  focusedConst: FocusedConstellation;
  setFocusedConst: (id: FocusedConstellation) => void;
  onConstClick: (id: string) => void;
}) {
  return (
    <div
      className="p-5 overflow-y-auto flex flex-col gap-5"
      style={{ background: NIGHT_2, borderLeft: `1px solid ${LINE}` }}
    >
      <div>
        <div className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: 4, color: MOON }}>
          {waypointLabel.toUpperCase()}
        </div>
        <div
          className="italic leading-[1.2]"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}
        >
          {current.title}
        </div>
        <div className="mt-3 leading-[1.6]" style={{ fontSize: 12, color: TEXT_DIM }}>
          {current.caption}
        </div>
      </div>

      <div>
        <div className="font-mono mb-2.5" style={{ fontSize: 9, letterSpacing: 4, color: TEXT_FAINT }}>
          CONSTELLATIONS · CLICK FOR DETAIL
        </div>
        <div className="flex flex-col gap-1">
          {CONSTELLATIONS.map((c) => {
            const ms = c.stars.map((s) => current.mastery[s.id] || 0);
            const avg = ms.reduce((a, b) => a + b, 0) / ms.length;
            const tier = tierFor(avg);
            const isFocused = focusedConst === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onConstClick(c.id)}
                onMouseEnter={() => setFocusedConst(c.id)}
                onMouseLeave={() => setFocusedConst(null)}
                className="grid items-center text-left bg-transparent border-none cursor-pointer transition-all"
                style={{
                  gridTemplateColumns: "20px 1fr 60px 32px",
                  gap: 10,
                  padding: "8px 6px",
                  borderRadius: 3,
                  background: isFocused ? `${MOON}0f` : "transparent",
                }}
              >
                <Image
                  src={ICON_PATH[c.icon]}
                  alt=""
                  width={18}
                  height={18}
                  style={{
                    opacity: 0.4 + Math.min(0.6, avg),
                    filter: avg > 0.7 ? "drop-shadow(0 0 4px #7dd3fc)" : "none",
                    transition: "all 0.6s",
                  }}
                />
                <div>
                  <div className="italic flex items-baseline gap-2" style={{ fontFamily: "var(--font-fraunces)", fontSize: 13, color: TEXT }}>
                    {c.name}
                    <span className="font-mono not-italic" style={{ fontSize: 9, letterSpacing: 1.5, color: TEXT_DIM }}>
                      · {c.topic}
                    </span>
                  </div>
                </div>
                <div className="font-mono" style={{ fontSize: 8, letterSpacing: 2, color: tier.color }}>
                  {tier.name}
                </div>
                <div className="text-right tabular-nums font-mono" style={{ fontSize: 11, color: TEXT_DIM }}>
                  {Math.round(avg * 100)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 grid grid-cols-2 gap-3" style={{ borderTop: `1px solid ${LINE}` }}>
        <div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_FAINT }}>SESSIONS</div>
          <div className="mt-0.5" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}>
            {current.stat.sessions}
          </div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_FAINT }}>RANGE</div>
          <div className="mt-0.5 italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: MOON }}>
            ±{current.stat.ci}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline ─── */
function Timeline({
  wpIdx, playing, progress, onPlay, onWaypoint, onScrub,
}: {
  wpIdx: number;
  playing: boolean;
  progress: number;
  onPlay: () => void;
  onWaypoint: (i: number) => void;
  onScrub: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleMouse(e: { clientX: number }) {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onScrub(v);
  }

  useEffect(() => {
    if (!dragging) return;
    function move(e: MouseEvent) { handleMouse(e); }
    function up() { setDragging(false); }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging]);

  return (
    <div className="px-5 py-4 flex items-center gap-5" style={{ borderTop: `1px solid ${LINE}`, background: NIGHT }}>
      <button
        onClick={onPlay}
        className="grid place-items-center cursor-pointer"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: `1px solid ${MOON}`,
          background: playing ? MOON : "transparent",
          color: playing ? NIGHT : MOON,
          flex: "0 0 auto",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 14 14"><rect x="2" y="2" width="3.5" height="10" fill="currentColor" /><rect x="8.5" y="2" width="3.5" height="10" fill="currentColor" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14"><polygon points="3,2 12,7 3,12" fill="currentColor" /></svg>
        )}
      </button>

      <div className="flex-1">
        <div className="hidden sm:flex justify-between mb-2">
          {WAYPOINTS.map((wp, i) => {
            const active = i === wpIdx;
            return (
              <button
                key={i}
                onClick={() => onWaypoint(i)}
                className="bg-transparent border-none cursor-pointer"
                style={{
                  padding: 0,
                  textAlign: i === 0 ? "left" : i === WAYPOINTS.length - 1 ? "right" : "center",
                  flex: 1,
                }}
              >
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: 2, color: active ? MOON : TEXT_DIM, transition: "color 0.3s" }}>
                  {wp.label}
                </div>
                <div className="font-mono mt-0.5" style={{ fontSize: 9, color: TEXT_FAINT }}>
                  Day {wp.day}
                </div>
              </button>
            );
          })}
        </div>
        <div
          ref={trackRef}
          onMouseDown={(e) => { setDragging(true); handleMouse(e); }}
          className="relative cursor-pointer flex items-center"
          style={{ height: 22 }}
        >
          <div className="absolute left-0 right-0" style={{ height: 1, background: LINE }} />
          <div
            className="absolute left-0"
            style={{
              height: 2,
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${MOON_DIM}, ${MOON_HI})`,
              boxShadow: `0 0 8px ${MOON}`,
              transition: playing ? "none" : "width 0.3s",
            }}
          />
          {WAYPOINTS.map((wp, i) => {
            const x = (i / (WAYPOINTS.length - 1)) * 100;
            const passed = i <= wpIdx;
            return (
              <div
                key={i}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: `calc(${x}% - 4px)`,
                  width: 8, height: 8,
                  background: passed ? MOON : NIGHT_3,
                  border: `1px solid ${passed ? MOON_HI : LINE}`,
                  boxShadow: passed ? `0 0 6px ${MOON}` : "none",
                  transition: "all 0.3s",
                }}
              />
            );
          })}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `calc(${progress * 100}% - 1px)`,
              width: 2, height: 16,
              background: MOON_HI,
              boxShadow: `0 0 8px ${MOON_HI}`,
              transition: playing ? "none" : "left 0.3s",
            }}
          />
        </div>
      </div>

      <div className="hidden md:block text-right shrink-0">
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_FAINT }}>USE</div>
        <div className="font-mono mt-0.5" style={{ fontSize: 10, color: TEXT_DIM }}>
          ← → · scrub · space
        </div>
      </div>
    </div>
  );
}

/* ─── Topic Panel — opens when a constellation label/row is clicked ─── */
function TopicPanel({
  constellation: c, current, onClose, onSkillClick,
}: {
  constellation: Constellation;
  current: Waypoint;
  onClose: () => void;
  onSkillClick: (starId: string, skill: string, section: Section, constellation: string, constellationId: string) => void;
}) {
  const ms = c.stars.map((s) => current.mastery[s.id] || 0);
  const avg = ms.reduce((a, b) => a + b, 0) / ms.length;
  const tier = tierFor(avg);
  return (
    <div
      className="absolute inset-y-0 z-[20] overflow-y-auto"
      style={{
        right: 0,
        width: "min(100%, 440px)",
        background: NIGHT_2,
        borderLeft: `1px solid ${LINE}`,
        boxShadow: `-20px 0 40px ${NIGHT}`,
        animation: "nyxSlideIn 0.3s ease-out",
      }}
    >
      <style>{`@keyframes nyxSlideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

      <div className="p-5 sticky top-0 z-[2]" style={{ background: NIGHT_2, borderBottom: `1px solid ${LINE}` }}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            <Image src={ICON_PATH[c.icon]} alt="" width={36} height={36} className="opacity-95 mt-0.5" />
            <div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: 4, color: MOON }}>
                {c.section.toUpperCase()} · {c.topic.toUpperCase()}
              </div>
              <div className="italic mt-1.5 leading-[1.2]" style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: TEXT }}>
                {c.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer grid place-items-center"
            style={{
              background: "transparent",
              border: `1px solid ${LINE}`,
              color: TEXT_DIM,
              width: 26, height: 26, borderRadius: "50%",
              fontSize: 14, lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="mt-4 leading-[1.65]" style={{ fontSize: 13, color: TEXT_DIM }}>
          {c.description}
        </p>
        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: tier.color }}>
              {tier.name}
            </span>
            <span className="font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM }}>
              {Math.round(avg * 100)}% average mastery
            </span>
          </div>
          <div className="h-[3px] rounded overflow-hidden" style={{ background: NIGHT_3 }}>
            <div
              className="h-full"
              style={{
                width: `${avg * 100}%`,
                background: tier.color,
                boxShadow: avg > 0.5 ? `0 0 4px ${tier.color}` : "none",
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="font-mono mb-3" style={{ fontSize: 10, letterSpacing: 4, color: TEXT_DIM }}>
          {c.stars.length} SKILLS · CLICK FOR QUESTIONS
        </div>
        <div className="flex flex-col gap-2">
          {c.stars.map((s) => {
            const m = current.mastery[s.id] || 0;
            const t = tierFor(m);
            return (
              <button
                key={s.id}
                onClick={() => onSkillClick(s.id, s.skill, c.section, c.name, c.id)}
                className="grid items-center text-left bg-transparent cursor-pointer transition-colors"
                style={{
                  gridTemplateColumns: "10px 1fr 80px 36px",
                  gap: 12,
                  padding: "10px 12px",
                  border: `1px solid ${LINE}`,
                  borderRadius: 3,
                  background: NIGHT_3,
                  color: TEXT,
                }}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: 8, height: 8,
                    background: t.color,
                    boxShadow: `0 0 ${t.glow * 0.6}px ${t.color}`,
                    transition: "all 0.6s",
                  }}
                />
                <span style={{ fontSize: 13 }}>{s.skill}</span>
                <span className="font-mono" style={{ fontSize: 9, letterSpacing: 2, color: t.color }}>
                  {t.name}
                </span>
                <span className="text-right font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM }}>
                  {Math.round(m * 100)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Skill Panel — slide-in showing sample questions ─── */
function SkillPanel({
  star, mastery, onClose,
}: {
  star: SelectedStar;
  mastery: number;
  onClose: () => void;
}) {
  const questions = SAMPLE_QUESTIONS[star.skill] ?? [];
  const tier = mastery > 0.85 ? "RADIANT" : mastery > 0.65 ? "BURNING" : mastery > 0.35 ? "KINDLED" : "DORMANT";
  const tierColor = mastery > 0.85 ? MOON_HI : mastery > 0.45 ? MOON : mastery > 0.2 ? MOON_DIM : TEXT_FAINT;
  const constellation = CONSTELLATIONS.find((c) => c.id === star.constellationId);

  return (
    <div
      className="absolute inset-y-0 z-[20] overflow-y-auto"
      style={{
        right: 0,
        width: "min(100%, 440px)",
        background: NIGHT_2,
        borderLeft: `1px solid ${LINE}`,
        boxShadow: `-20px 0 40px ${NIGHT}`,
        animation: "nyxSlideIn 0.3s ease-out",
      }}
    >
      <style>{`@keyframes nyxSlideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

      <div className="p-5 sticky top-0 z-[2]" style={{ background: NIGHT_2, borderBottom: `1px solid ${LINE}` }}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3">
            {constellation ? (
              <Image src={ICON_PATH[constellation.icon]} alt="" width={28} height={28} className="opacity-90 mt-1" />
            ) : null}
            <div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: 4, color: TEXT_DIM }}>
                {star.section.toUpperCase()} · {constellation?.topic.toUpperCase() ?? star.constellation.toUpperCase()}
              </div>
              <div className="italic mt-1.5 leading-[1.2]" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}>
                {star.skill}
              </div>
              <div className="font-mono mt-1" style={{ fontSize: 10, letterSpacing: 2, color: TEXT_FAINT }}>
                in {star.constellation}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer grid place-items-center"
            style={{
              background: "transparent",
              border: `1px solid ${LINE}`,
              color: TEXT_DIM,
              width: 26, height: 26, borderRadius: "50%",
              fontSize: 14, lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: tierColor }}>{tier}</span>
            <span className="font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM }}>
              {Math.round(mastery * 100)}% mastery
            </span>
          </div>
          <div className="h-[3px] rounded overflow-hidden" style={{ background: NIGHT_3 }}>
            <div
              className="h-full"
              style={{
                width: `${mastery * 100}%`,
                background: tierColor,
                boxShadow: mastery > 0.5 ? `0 0 4px ${tierColor}` : "none",
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="font-mono mb-1" style={{ fontSize: 10, letterSpacing: 4, color: TEXT_DIM }}>
          QUESTIONS MAYA ANSWERED
        </div>
        <div className="italic mb-4" style={{ fontSize: 11, color: TEXT_FAINT, fontFamily: "var(--font-fraunces)" }}>
          Sampled from her sessions on this skill.
        </div>

        {questions.length === 0 ? (
          <div className="p-3.5 italic" style={{ fontSize: 12, color: TEXT_DIM, border: `1px dashed ${LINE}`, borderRadius: 3, fontFamily: "var(--font-fraunces)" }}>
            Sample questions for this skill coming soon.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => <QuestionCard key={i} q={q} index={i} />)}
          </div>
        )}

        <div
          className="mt-5 p-3.5 italic"
          style={{ background: NIGHT_3, borderRadius: 3, fontSize: 11, color: TEXT_DIM, lineHeight: 1.6, fontFamily: "var(--font-fraunces)" }}
        >
          The adaptive engine selects each question to probe the edge of what Maya knows about{" "}
          <span style={{ color: MOON }}>{star.skill.toLowerCase()}</span>. As she answers, this star gets brighter.
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ q, index }: { q: SampleQ; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="p-4" style={{ border: `1px solid ${LINE}`, borderRadius: 4, background: NIGHT }}>
      <div className="flex justify-between items-center mb-2.5">
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_DIM }}>
          QUESTION {index + 1}
        </div>
        <div className="font-mono flex items-center gap-1" style={{ fontSize: 9, letterSpacing: 2, color: TEXT_FAINT }}>
          DIFFICULTY
          <span className="inline-flex gap-0.5 ml-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: i <= q.d ? MOON : NIGHT_3,
                  boxShadow: i <= q.d ? `0 0 2px ${MOON}` : "none",
                }}
              />
            ))}
          </span>
        </div>
      </div>
      <div
        className="mb-3 whitespace-pre-wrap"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, lineHeight: 1.5, color: TEXT }}
      >
        {q.prompt}
      </div>
      <div className="flex flex-col gap-1.5">
        {q.choices.map((c, i) => {
          const isPicked = picked === i;
          const isCorrect = i === q.correct;
          const showResult = revealed;
          let bg = NIGHT_2;
          let border = LINE;
          let textColor = TEXT;
          if (showResult) {
            if (isCorrect) { bg = `${MOON}1a`; border = MOON; textColor = MOON_HI; }
            else if (isPicked) { bg = "#3a1518"; border = "#9f4148"; textColor = "#fca5a5"; }
          } else if (isPicked) {
            bg = `${MOON}1a`; border = MOON;
          }
          return (
            <button
              key={i}
              onClick={() => { if (!revealed) { setPicked(i); setRevealed(true); } }}
              disabled={revealed}
              className="text-left flex items-start gap-2.5 transition-all"
              style={{
                padding: "8px 10px",
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 3,
                color: textColor,
                fontSize: 12,
                lineHeight: 1.4,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              <span
                className="grid place-items-center font-mono shrink-0"
                style={{
                  width: 18, height: 18,
                  border: `1px solid ${isPicked || (showResult && isCorrect) ? border : TEXT_FAINT}`,
                  background: (showResult && isCorrect) ? MOON : isPicked ? MOON : "transparent",
                  color: (showResult && isCorrect) || isPicked ? NIGHT : TEXT_DIM,
                  fontSize: 9, borderRadius: 2,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{c}</span>
              {showResult && isCorrect ? <span style={{ fontSize: 10, color: MOON_HI }}>✓</span> : null}
            </button>
          );
        })}
      </div>
      {revealed ? (
        <button
          onClick={() => { setPicked(null); setRevealed(false); }}
          className="mt-2.5 cursor-pointer font-mono"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            fontSize: 9, letterSpacing: 3, color: TEXT_DIM,
          }}
        >
          ↻ TRY AGAIN
        </button>
      ) : null}
    </div>
  );
}
