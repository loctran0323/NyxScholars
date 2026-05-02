"use client";

import { useState } from "react";

const NIGHT = "#070914";
const NIGHT_2 = "#0c1124";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#7a82a0";
const TEXT_FAINT = "#4a5170";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";

/**
 * Simplified sample constellation for the public demo. One constellation
 * (Algebra · The Lyre), 5 stars, edges drawn. Each star has a real skill
 * name + mastery level so the demo behaves exactly like the real /portal
 * dashboard but without authentication.
 */
const DEMO_STARS = [
  { id: "lin-eq",   name: "Linear equations",     mastery: 0.92, attempted: 84, x: 0.30, y: 0.18 },
  { id: "lin-sys",  name: "Systems of equations", mastery: 0.78, attempted: 52, x: 0.74, y: 0.22 },
  { id: "lin-fn",   name: "Linear functions",     mastery: 0.84, attempted: 46, x: 0.82, y: 0.62 },
  { id: "lin-ineq", name: "Linear inequalities",  mastery: 0.55, attempted: 24, x: 0.18, y: 0.68 },
  { id: "abs-val",  name: "Absolute value",       mastery: 0.34, attempted: 14, x: 0.50, y: 0.92 },
];

const DEMO_EDGES: [string, string][] = [
  ["lin-eq", "lin-sys"], ["lin-sys", "lin-fn"], ["lin-fn", "abs-val"],
  ["abs-val", "lin-ineq"], ["lin-ineq", "lin-eq"], ["lin-eq", "lin-fn"],
];

function levelLabel(m: number): { name: string; color: string } {
  if (m >= 0.85) return { name: "Radiant", color: MOON_HI };
  if (m >= 0.60) return { name: "Burning", color: MOON };
  if (m >= 0.30) return { name: "Kindled", color: MOON_DIM };
  return { name: "Dormant", color: TEXT_FAINT };
}

/**
 * MiniSky — public, calm preview of the constellation map.
 * Hover any star to read its details on the side panel.
 */
export function MiniSky() {
  const [hovered, setHovered] = useState<string | null>("lin-eq");
  const focused = DEMO_STARS.find((s) => s.id === hovered) ?? DEMO_STARS[0];
  const avg = DEMO_STARS.reduce((a, s) => a + s.mastery, 0) / DEMO_STARS.length;
  const lit = DEMO_STARS.filter((s) => s.mastery > 0.5).length;

  return (
    <div
      className="grid lg:grid-cols-12 gap-6 rounded-[18px] overflow-hidden"
      style={{ background: NIGHT_2, border: `1px solid ${LINE}` }}
    >
      {/* Sky canvas */}
      <div
        className="lg:col-span-8 relative"
        style={{
          height: 380,
          background: "radial-gradient(ellipse at 50% 35%, #11183a 0%, #0a0e26 35%, #050816 70%, #03050e 100%)",
        }}
      >
        {/* Faint background stars (deterministic pattern) */}
        <svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="none">
          {[
            [12, 14, 0.7], [86, 8, 0.9], [42, 6, 0.6], [70, 18, 0.5],
            [22, 36, 0.8], [88, 32, 0.6], [58, 46, 0.5], [8, 58, 0.7],
            [38, 72, 0.6], [92, 70, 0.8], [16, 88, 0.5], [62, 86, 0.6],
            [78, 92, 0.4], [4, 26, 0.4], [50, 28, 0.55],
          ].map(([x, y, r], i) => (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill={TEXT_FAINT}
              opacity={0.45}
            />
          ))}
        </svg>

        {/* Constellation */}
        <svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
          {/* Edges */}
          {DEMO_EDGES.map(([a, b], i) => {
            const sa = DEMO_STARS.find((s) => s.id === a)!;
            const sb = DEMO_STARS.find((s) => s.id === b)!;
            const edgeM = (sa.mastery + sb.mastery) / 2;
            const focusedHere = hovered === a || hovered === b;
            return (
              <line
                key={i}
                x1={sa.x * 100}
                y1={sa.y * 100}
                x2={sb.x * 100}
                y2={sb.y * 100}
                stroke={focusedHere ? MOON : MOON_DIM}
                strokeWidth={focusedHere ? 0.4 : 0.25}
                opacity={Math.max(0.25, edgeM * 0.85)}
                strokeLinecap="round"
              />
            );
          })}

          {/* Stars */}
          {DEMO_STARS.map((s) => {
            const m = s.mastery;
            const r = 0.9 + m * 1.6;
            const glow = 3 + m * 6;
            const color = m > 0.7 ? MOON_HI : m > 0.35 ? MOON : MOON_DIM;
            const isHover = hovered === s.id;
            return (
              <g key={s.id} onMouseEnter={() => setHovered(s.id)} style={{ cursor: "pointer" }}>
                <circle cx={s.x * 100} cy={s.y * 100} r={glow} fill={color} opacity={m * 0.18} />
                <circle cx={s.x * 100} cy={s.y * 100} r={r} fill={color}>
                  {m > 0.4 ? (
                    <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />
                  ) : null}
                </circle>
                {isHover ? (
                  <circle cx={s.x * 100} cy={s.y * 100} r={r + 1.6} fill="none" stroke={MOON_HI} strokeWidth="0.3" opacity="0.9" />
                ) : null}
                {/* generous hover hit area */}
                <circle cx={s.x * 100} cy={s.y * 100} r="3.5" fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Constellation label */}
        <div className="absolute top-5 left-5 pointer-events-none">
          <div className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>
            ALGEBRA · THE LYRE
          </div>
          <div className="mt-1 italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}>
            {Math.round(avg * 100)}% lit
          </div>
          <div className="mt-1 text-[10px]" style={{ color: TEXT_DIM }}>
            {lit} of {DEMO_STARS.length} stars · {levelLabel(avg).name.toLowerCase()}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between flex-wrap gap-3 font-mono text-[8.5px] tracking-[0.2em] pointer-events-none" style={{ color: TEXT_DIM }}>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: TEXT_FAINT }} /> DORMANT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: MOON_DIM, boxShadow: `0 0 4px ${MOON_DIM}` }} /> KINDLED
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: MOON, boxShadow: `0 0 4px ${MOON}` }} /> BURNING
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: MOON_HI, boxShadow: `0 0 6px ${MOON_HI}` }} /> RADIANT
          </span>
        </div>
      </div>

      {/* Side panel — focused star detail */}
      <div className="lg:col-span-4 p-6 flex flex-col gap-4" style={{ borderLeft: `1px solid ${LINE}` }}>
        <p className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>
          STAR
        </p>
        <p
          className="leading-[1.15]"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}
        >
          {focused.name}
        </p>

        <div>
          <div className="flex justify-between font-mono text-[10px] tracking-[0.2em] mb-1.5" style={{ color: TEXT_DIM }}>
            <span>MASTERY</span>
            <span style={{ color: levelLabel(focused.mastery).color }}>
              {Math.round(focused.mastery * 100)}% · {levelLabel(focused.mastery).name.toUpperCase()}
            </span>
          </div>
          <div className="h-1 rounded overflow-hidden" style={{ background: LINE }}>
            <div
              className="h-full"
              style={{
                width: `${focused.mastery * 100}%`,
                background: levelLabel(focused.mastery).color,
                boxShadow: `0 0 8px ${levelLabel(focused.mastery).color}`,
                transition: "all 0.3s",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em]" style={{ color: TEXT_DIM }}>
              ATTEMPTED
            </p>
            <p className="mt-0.5" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}>
              {focused.attempted}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em]" style={{ color: TEXT_DIM }}>
              EDGE
            </p>
            <p className="mt-0.5" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: MOON }}>
              {focused.mastery > 0.85 ? "—" : focused.mastery > 0.5 ? "Near" : "Open"}
            </p>
          </div>
        </div>

        <p className="text-[12px] leading-[1.7] mt-2" style={{ color: TEXT_DIM }}>
          Hover any star above. Each session with your tutor lights more of these — both you and
          your tutor see the same map.
        </p>
      </div>
    </div>
  );
}
