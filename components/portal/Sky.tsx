"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONSTELLATIONS, ALL_SKILLS, levelFor, type Constellation, type FlatSkill, type SkyLevel } from "@/lib/mock/constellations";

const NIGHT_2 = "#0c1124";
const NIGHT_3 = "#141a30";
const LINE = "#1e2542";
const TEXT = "#e6e9f5";
const TEXT_DIM = "#7a82a0";
const TEXT_FAINT = "#4a5170";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";
const VIOLET = "#a78bfa";
const AURORA = "#67e8f9";

function levelColor(lvl: SkyLevel): string {
  switch (lvl.name) {
    case "Radiant": return MOON_HI;
    case "Burning": return MOON;
    case "Kindled": return MOON_DIM;
    case "Dormant": return TEXT_FAINT;
  }
}

type SkyProps = {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  /** Optional override map: skill_id → mastery in [0,1]. Defaults to the
   *  static value baked into CONSTELLATIONS when missing. */
  masteryOverrides?: Record<string, number>;
};

export function Sky({ hoveredId, setHoveredId, selectedId, setSelectedId, masteryOverrides }: SkyProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 720 });
  const [hoveredConstId, setHoveredConstId] = useState<string | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const r = e.contentRect;
        setSize({ w: Math.max(400, r.width), h: Math.max(300, r.height) });
      }
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  // Apply per-skill mastery overrides (from /api/portal/skill-mastery) on
  // top of the static constellation data. This is what makes the sky
  // reflect the actual student instead of the seed sample.
  const liveConstellations = useMemo<Constellation[]>(() => {
    if (!masteryOverrides || Object.keys(masteryOverrides).length === 0) return CONSTELLATIONS;
    return CONSTELLATIONS.map((c) => ({
      ...c,
      stars: c.stars.map((s) => ({
        ...s,
        mastery: masteryOverrides[s.id] ?? s.mastery,
      })),
    }));
  }, [masteryOverrides]);

  const liveAllSkills = useMemo<FlatSkill[]>(() => {
    if (!masteryOverrides || Object.keys(masteryOverrides).length === 0) return ALL_SKILLS;
    return ALL_SKILLS.map((s) => ({
      ...s,
      mastery: masteryOverrides[s.id] ?? s.mastery,
    }));
  }, [masteryOverrides]);

  const bgStars = useMemo(() => {
    const arr: { x: number; y: number; s: number; twinkle: boolean }[] = [];
    for (let i = 0; i < 180; i++) {
      const seed = i * 9301 + 49297;
      arr.push({
        x: ((seed * 233 + 1) % 1000) / 1000,
        y: ((seed * 977 + 7) % 1000) / 1000,
        s: ((seed * 7 + 3) % 100) / 100,
        twinkle: i % 5 === 0,
      });
    }
    return arr;
  }, []);

  const litStars = liveAllSkills.filter((s) => s.mastery > 0.5).length;
  const totalStars = liveAllSkills.length;
  const radiantConsts = liveConstellations.filter((c) => {
    const avg = c.stars.reduce((a, s) => a + s.mastery, 0) / c.stars.length;
    return avg >= 0.85;
  }).length;
  const totalLit = Math.round((litStars / totalStars) * 100);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, #11183a 0%, #0a0e26 35%, #050816 70%, #03050e 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 25% 70%, ${VIOLET}11 0%, transparent 40%), radial-gradient(circle at 75% 30%, ${AURORA}0e 0%, transparent 45%)`,
        }}
      />

      <svg width={w} height={h} className="absolute inset-0">
        {bgStars.map((s, i) => (
          <circle
            key={`bg-${i}`}
            cx={s.x * w}
            cy={s.y * h}
            r={s.s * 0.9 + 0.2}
            fill={TEXT_FAINT}
            opacity={s.s * 0.5 + 0.1}
          >
            {s.twinkle ? (
              <animate
                attributeName="opacity"
                values={`${s.s * 0.3};${s.s * 0.85};${s.s * 0.3}`}
                dur={`${3 + (i % 5)}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </circle>
        ))}

        <line
          x1="40"
          y1={h * 0.535}
          x2={w - 40}
          y2={h * 0.535}
          stroke={LINE}
          strokeWidth="0.4"
          strokeDasharray="2 8"
          opacity="0.5"
        />
        <text
          x="40"
          y={h * 0.535 - 8}
          fill={TEXT_FAINT}
          fontSize="9"
          letterSpacing="5"
          fontFamily="Inter, system-ui, sans-serif"
        >
          MATHEMATICS · NORTHERN SKY
        </text>
        <text
          x="40"
          y={h * 0.535 + 18}
          fill={TEXT_FAINT}
          fontSize="9"
          letterSpacing="5"
          fontFamily="Inter, system-ui, sans-serif"
        >
          READING &amp; WRITING · SOUTHERN SKY
        </text>

        {liveConstellations.map((c) => (
          <ConstellationGlyph
            key={c.id}
            c={c}
            w={w}
            h={h}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            hoveredConstId={hoveredConstId}
            setHoveredConstId={setHoveredConstId}
          />
        ))}

        {(() => {
          if (!hoveredId) return null;
          const s = ALL_SKILLS.find((x) => x.id === hoveredId);
          if (!s) return null;
          const cx = s.absX * w;
          const cy = s.absY * h;
          const onLeft = cx > w * 0.65;
          const tx = onLeft ? cx - 16 : cx + 16;
          return (
            <g pointerEvents="none">
              <text
                x={tx}
                y={cy - 4}
                fill={TEXT}
                fontFamily="Inter, system-ui, sans-serif"
                fontSize="11"
                textAnchor={onLeft ? "end" : "start"}
              >
                {s.name}
              </text>
              <text
                x={tx}
                y={cy + 10}
                fill={MOON}
                fontFamily="Inter, system-ui, sans-serif"
                fontSize="9"
                letterSpacing="2"
                textAnchor={onLeft ? "end" : "start"}
              >
                {Math.round(s.mastery * 100)}% · {s.attempted} attempted
              </text>
            </g>
          );
        })()}
      </svg>

      <div className="absolute top-4 left-5 pointer-events-none rounded-xl px-4 py-3" style={{ background: "rgba(5,8,22,0.65)", backdropFilter: "blur(10px)" }}>
        <div className="font-mono text-[9px] tracking-[0.32em]" style={{ color: TEXT_DIM }}>
          YOUR SKY · MAY 2026
        </div>
        <div
          className="mt-1.5 italic"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, color: TEXT }}
        >
          {totalLit}% lit
        </div>
        <div className="mt-1 text-[11px]" style={{ color: TEXT_DIM }}>
          {litStars} of {totalStars} stars · {radiantConsts} of {CONSTELLATIONS.length} constellations{" "}
          <span style={{ color: MOON }}>radiant</span>
        </div>
      </div>

      <div className="absolute bottom-5 left-7 hidden md:flex gap-5 text-[9px] tracking-[0.16em]" style={{ color: TEXT_DIM, fontFamily: "Inter, system-ui, sans-serif" }}>
        <LegendDot color={TEXT_FAINT} label="DORMANT" />
        <LegendDot color={MOON_DIM}   label="KINDLED"  glow />
        <LegendDot color={MOON}       label="BURNING"  glow />
        <LegendDot color={MOON_HI}    label="RADIANT"  glow strong />
      </div>

    </div>
  );
}

function LegendDot({ color, label, glow, strong }: { color: string; label: string; glow?: boolean; strong?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: glow ? `0 0 ${strong ? 8 : 4}px ${color}` : "none",
        }}
      />
      {label}
    </span>
  );
}

function ConstellationGlyph({
  c, w, h, hoveredId, setHoveredId, selectedId, setSelectedId, hoveredConstId, setHoveredConstId,
}: {
  c: Constellation;
  w: number;
  h: number;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredConstId: string | null;
  setHoveredConstId: (id: string | null) => void;
}) {
  const avg = c.stars.reduce((a, s) => a + s.mastery, 0) / c.stars.length;
  const level = levelFor(avg);
  const lvlColor = levelColor(level);
  const isHovered = hoveredConstId === c.id;
  const isFocused = isHovered || c.stars.some((s) => s.id === hoveredId || s.id === selectedId);

  const bx = c.box.x * w;
  const by = c.box.y * h;
  const bw = c.box.w * w;
  const bh = c.box.h * h;
  const opacity = hoveredConstId && !isHovered ? 0.35 : 1;

  return (
    <g
      style={{ opacity, transition: "opacity 0.25s" }}
      onMouseEnter={() => setHoveredConstId(c.id)}
      onMouseLeave={() => setHoveredConstId(null)}
    >
      {isFocused ? (
        <rect
          x={bx - 8}
          y={by - 8}
          width={bw + 16}
          height={bh + 16}
          fill="none"
          stroke={MOON_DIM}
          strokeWidth="0.4"
          strokeDasharray="2 4"
          opacity="0.4"
          rx="4"
        />
      ) : null}

      {c.edges.map(([a, b], i) => {
        const sa = c.stars.find((s) => s.id === a);
        const sb = c.stars.find((s) => s.id === b);
        if (!sa || !sb) return null;
        const x1 = bx + sa.x * bw;
        const y1 = by + sa.y * bh;
        const x2 = bx + sb.x * bw;
        const y2 = by + sb.y * bh;
        const edgeM = (sa.mastery + sb.mastery) / 2;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isFocused ? MOON : MOON_DIM}
            strokeWidth={isFocused ? 0.8 : 0.5}
            opacity={Math.max(0.18, edgeM * 0.85)}
            strokeLinecap="round"
          />
        );
      })}

      {c.stars.map((s) => {
        const cx = bx + s.x * bw;
        const cy = by + s.y * bh;
        const isHover = hoveredId === s.id;
        const isSel = selectedId === s.id;
        const m = s.mastery;
        const r = 1.5 + m * 4;
        const glow = 6 + m * 22;
        const color = m > 0.7 ? MOON_HI : m > 0.35 ? MOON : MOON_DIM;
        return (
          <g
            key={s.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoveredId(s.id);
              setHoveredConstId(c.id);
            }}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedId(s.id)}
          >
            <circle cx={cx} cy={cy} r={glow} fill={color} opacity={m * 0.12} />
            <circle cx={cx} cy={cy} r={glow * 0.55} fill={color} opacity={m * 0.2} />
            <line x1={cx - r * 2.5} y1={cy} x2={cx + r * 2.5} y2={cy} stroke={color} strokeWidth="0.4" opacity={m * 0.6} />
            <line x1={cx} y1={cy - r * 2.5} x2={cx} y2={cy + r * 2.5} stroke={color} strokeWidth="0.4" opacity={m * 0.6} />
            <circle cx={cx} cy={cy} r={r} fill={color}>
              {m > 0.4 ? (
                <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite" />
              ) : null}
            </circle>
            {(isHover || isSel) ? (
              <>
                <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={MOON_HI} strokeWidth="0.8" opacity="0.9" />
                <circle cx={cx} cy={cy} r={r + 11} fill="none" stroke={MOON} strokeWidth="0.4" opacity="0.5" />
              </>
            ) : null}
            <circle cx={cx} cy={cy} r="14" fill="transparent" />
          </g>
        );
      })}

      <g pointerEvents="none">
        <text
          x={bx + bw / 2}
          y={Math.max(by - 18, (bx + bw / 2) < w * 0.25 ? 140 : 20)}
          fill={TEXT}
          fontFamily="var(--font-fraunces), serif"
          fontStyle="italic"
          fontSize={isFocused ? 15 : 13}
          textAnchor="middle"
          style={{ transition: "font-size 0.25s" }}
        >
          {c.glyph}
        </text>
        <g transform={`translate(${bx + bw / 2} ${by + bh + 16})`}>
          <rect x="-44" y="-8" width="88" height="16" rx="8" fill={NIGHT_2} stroke={lvlColor} strokeWidth="0.5" opacity="0.95" />
          <circle cx="-32" cy="0" r="2.5" fill={lvlColor} opacity="0.95">
            {level.tier > 1 ? (
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            ) : null}
          </circle>
          <text x="-24" y="3" fill={lvlColor} fontFamily="Inter, system-ui, sans-serif" fontSize="8" letterSpacing="2" textAnchor="start">
            {level.name.toUpperCase()}
          </text>
          <text x="36" y="3" fill={TEXT_DIM} fontFamily="Inter, system-ui, sans-serif" fontSize="8" letterSpacing="1" textAnchor="end">
            {Math.round(avg * 100)}%
          </text>
        </g>
      </g>
    </g>
  );
}

/* ───────────────────────────────────────────────────────────
 * SkillSheet — overlays the sky when a star is clicked.
 * ─────────────────────────────────────────────────────────── */
type SkillSheetProps = {
  skill: FlatSkill | null;
  onClose: () => void;
  onDrill?: (skill: FlatSkill) => void;
};
export function SkillSheet({ skill, onClose, onDrill }: SkillSheetProps) {
  if (!skill) return null;
  const m = skill.mastery;
  return (
    <div
      className="absolute top-6 right-6 w-[320px] p-6 z-30 pointer-events-auto"
      style={{
        background: NIGHT_2,
        border: `1px solid ${MOON_DIM}`,
        boxShadow: `0 0 40px ${MOON}33`,
        borderRadius: 4,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div className="flex justify-between font-mono text-[9px] tracking-[0.32em]" style={{ color: TEXT_DIM }}>
        <span>SKILL</span>
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer text-[14px] p-0"
          style={{ color: TEXT_DIM }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="mt-3 text-[10px] tracking-[0.24em]" style={{ color: MOON }}>
        {skill.constellationGlyph.toUpperCase()} · {skill.constellationName.toUpperCase()}
      </div>
      <div
        className="mt-1 leading-[1.1]"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: TEXT }}
      >
        {skill.name}
      </div>
      <div className="mt-5">
        <div className="flex justify-between font-mono text-[10px] tracking-[0.2em] mb-1.5" style={{ color: TEXT_DIM }}>
          <span>MASTERY</span>
          <span>{Math.round(m * 100)}%</span>
        </div>
        <div className="h-1 rounded overflow-hidden" style={{ background: NIGHT_3 }}>
          <div className="h-full" style={{ width: `${m * 100}%`, background: MOON, boxShadow: `0 0 8px ${MOON}` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <div className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>ATTEMPTED</div>
          <div className="mt-1" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}>
            {skill.attempted}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] tracking-[0.28em]" style={{ color: TEXT_DIM }}>LAST 7D</div>
          <div className="mt-1" style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: MOON }}>
            +{Math.round(m * 8)}%
          </div>
        </div>
      </div>
      <button
        onClick={() => onDrill?.(skill)}
        className="w-full mt-5 py-2.5 px-5 cursor-pointer font-mono text-[11px] tracking-[0.24em] font-medium rounded-[3px] transition-colors hover:brightness-110"
        style={{ background: MOON, color: "#070914", border: "none" }}
      >
        DRILL THIS SKILL →
      </button>
    </div>
  );
}
