"use client";

import type { ReactNode } from "react";
import {
  CONSTELLATIONS, ALL_SKILLS, levelFor, PLAYER, ACHIEVEMENTS, DAILY_PLAN, SCORE_HISTORY, SCORE_TARGET, ACTIVITY,
  type Constellation, type Achievement, type SkyLevel,
} from "@/lib/mock/constellations";

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

function levelColor(lvl: SkyLevel): string {
  switch (lvl.name) {
    case "Radiant": return MOON_HI;
    case "Burning": return MOON;
    case "Kindled": return MOON_DIM;
    case "Dormant": return TEXT_FAINT;
  }
}

/* ───────────────────────────────────────────────────────────
 * PlayerHeader — gamification strip at the top of the dashboard.
 * Avatar, name, rank, level, XP bar, stardust, streak, days-left,
 * and the "Begin session" CTA.
 * ─────────────────────────────────────────────────────────── */
export function PlayerHeader({ onBegin }: { onBegin?: () => void }) {
  const pct = (PLAYER.xpInLevel / PLAYER.xpToLevel) * 100;
  return (
    <div
      className="flex items-center gap-6 px-7 py-4 border-b"
      style={{ background: NIGHT, borderColor: LINE }}
    >
      <div
        className="grid place-items-center shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: NIGHT_3,
          border: `1px solid ${MOON_DIM}`,
          fontFamily: "var(--font-fraunces)",
          fontSize: 13,
          color: TEXT,
        }}
      >
        {PLAYER.initials}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex justify-between items-baseline gap-3">
          <div className="min-w-0 truncate">
            <span style={{ fontSize: 13, color: TEXT }}>{PLAYER.name}</span>
            <span className="ml-3" style={{ fontSize: 10, letterSpacing: 3, color: MOON }}>
              {PLAYER.rank.toUpperCase()} · LV {PLAYER.level}
            </span>
          </div>
          <div className="hidden sm:block font-mono" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>
            {PLAYER.xpInLevel} / {PLAYER.xpToLevel} XP TO LV {PLAYER.level + 1}
          </div>
        </div>
        <div className="h-[3px] rounded-sm overflow-hidden" style={{ background: NIGHT_3 }}>
          <div
            className="h-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${MOON_DIM}, ${MOON} 50%, ${MOON_HI})`,
              boxShadow: `0 0 6px ${MOON}`,
            }}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Stat label="STARDUST" value={PLAYER.totalStardust.toLocaleString()} />
        <Stat label="STREAK" value={`${PLAYER.streak}D`} accent />
        <Stat label="DAYS LEFT" value={`${PLAYER.daysLeft}`} />
      </div>

      <button
        onClick={onBegin}
        className="shrink-0 cursor-pointer font-mono font-medium transition-colors hover:brightness-110"
        style={{
          padding: "10px 20px",
          background: MOON,
          color: NIGHT,
          fontSize: 11,
          letterSpacing: 3,
          borderRadius: 3,
          border: "none",
        }}
      >
        BEGIN SESSION →
      </button>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center min-w-[68px]">
      <div className="font-mono" style={{ fontSize: 9, letterSpacing: 3, color: TEXT_DIM }}>{label}</div>
      <div className="mt-0.5" style={{ fontFamily: "var(--font-fraunces)", fontSize: 17, color: accent ? MOON : TEXT }}>
        {value}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Card primitives matching the dashboard-v2 card style.
 * Sharp corners, hairline border, NIGHT_2 background.
 * ─────────────────────────────────────────────────────────── */
export function SkyCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: NIGHT_2,
        border: `1px solid ${LINE}`,
        borderRadius: 4,
        padding: 22,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex justify-between font-mono" style={{ fontSize: 9, letterSpacing: 4, color: TEXT_DIM }}>
      <span>{title}</span>
      <span>{right}</span>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * DailyPlanCard — today's session plan with reasoning.
 * ─────────────────────────────────────────────────────────── */
export function DailyPlanCard({ todayLabel = "TODAY · MAY 02" }: { todayLabel?: string }) {
  return (
    <SkyCard>
      <CardHeader title={todayLabel} right={<span style={{ color: MOON }}>+85 XP AVAILABLE</span>} />
      <div
        className="mt-2.5 leading-[1.25]"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}
      >
        24 minutes to ignite{" "}
        <span style={{ fontStyle: "italic", color: MOON }}>Trigonometry</span>.
      </div>
      <div className="mt-4">
        {DAILY_PLAN.map((t, i) => (
          <div
            key={i}
            className="grid items-center gap-3 py-3"
            style={{
              gridTemplateColumns: "1fr auto auto",
              borderTop: i === 0 ? `1px solid ${LINE}` : "none",
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: TEXT }}>{t.skill}</div>
              <div className="mt-0.5 font-mono" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>
                {t.why.toUpperCase()}
              </div>
            </div>
            <div className="font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM }}>
              {t.questions} q
            </div>
            <div className="font-mono tabular-nums" style={{ fontSize: 11, color: TEXT_DIM }}>
              {t.minutes} min
            </div>
          </div>
        ))}
      </div>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * ProjectedScoreCard — Fraunces big number, sparkline, target line.
 * ─────────────────────────────────────────────────────────── */
export function ProjectedScoreCard() {
  const current = SCORE_HISTORY[SCORE_HISTORY.length - 1];
  const minS = Math.min(...SCORE_HISTORY) - 40;
  const maxS = SCORE_TARGET + 20;
  const range = maxS - minS;
  const w = 280;
  const h = 100;
  const points: [number, number][] = SCORE_HISTORY.map((s, i) => [
    (i / (SCORE_HISTORY.length - 1)) * w,
    h - ((s - minS) / range) * h,
  ]);
  const targetY = h - ((SCORE_TARGET - minS) / range) * h;
  const last = points[points.length - 1];

  return (
    <SkyCard>
      <CardHeader title="PROJECTED SCORE" right="JUN 7 · 36 DAYS" />
      <div className="flex items-baseline gap-2 mt-3">
        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 56, color: TEXT, lineHeight: 1 }}>
          {current}
        </div>
        <div style={{ fontSize: 12, color: TEXT_DIM }}>± 40</div>
      </div>
      <div className="mt-1" style={{ fontSize: 11, color: TEXT_DIM }}>
        80% confidence · target {SCORE_TARGET}
      </div>
      <svg width={w} height={h + 12} className="mt-4 block" style={{ width: "100%", maxWidth: w }}>
        <defs>
          <linearGradient id="ps-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={MOON} stopOpacity="0.3" />
            <stop offset="100%" stopColor={MOON} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={targetY} x2={w} y2={targetY} stroke={MOON_DIM} strokeWidth="0.5" strokeDasharray="2 4" />
        <text x={w} y={targetY - 4} fill={TEXT_DIM} fontSize="8" textAnchor="end">
          TARGET {SCORE_TARGET}
        </text>
        <path
          d={`M 0 ${h} L ${points.map((p) => p.join(",")).join(" L ")} L ${w} ${h} Z`}
          fill="url(#ps-fill)"
        />
        <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={MOON} strokeWidth="1.2" />
        <circle cx={last[0]} cy={last[1]} r="3" fill={MOON_HI} />
        <circle cx={last[0]} cy={last[1]} r="6" fill={MOON} opacity="0.3" />
      </svg>
      <div className="mt-1 pt-2.5" style={{ borderTop: `1px solid ${LINE}`, fontSize: 11, color: TEXT_DIM, lineHeight: 1.5 }}>
        At your current pace, you&apos;ll reach {SCORE_TARGET} in <span style={{ color: TEXT }}>~5 weeks</span>.
      </div>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * Tiny inline constellation glyph — reused in the list card and
 * potentially elsewhere.
 * ─────────────────────────────────────────────────────────── */
function ConstellationMiniGlyph({ c }: { c: Constellation }) {
  return (
    <svg width={24} height={24} viewBox="0 0 100 100" aria-hidden>
      {c.edges.map(([a, b], i) => {
        const sa = c.stars.find((s) => s.id === a);
        const sb = c.stars.find((s) => s.id === b);
        if (!sa || !sb) return null;
        return (
          <line
            key={i}
            x1={sa.x * 100}
            y1={sa.y * 100}
            x2={sb.x * 100}
            y2={sb.y * 100}
            stroke={MOON_DIM}
            strokeWidth="1"
            opacity="0.7"
          />
        );
      })}
      {c.stars.map((s) => (
        <circle
          key={s.id}
          cx={s.x * 100}
          cy={s.y * 100}
          r={s.mastery > 0.5 ? 3.5 : 2}
          fill={s.mastery > 0.7 ? MOON_HI : s.mastery > 0.35 ? MOON : MOON_DIM}
        />
      ))}
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * ConstellationsCard — list of all constellations w/ mini glyph,
 * level chip, mastery bar.
 * ─────────────────────────────────────────────────────────── */
export function ConstellationsCard({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <SkyCard>
      <CardHeader title="YOUR CONSTELLATIONS" right={`${CONSTELLATIONS.length} TRACKED`} />
      <div className="flex flex-col mt-3.5">
        {CONSTELLATIONS.map((c) => {
          const avg = c.stars.reduce((a, s) => a + s.mastery, 0) / c.stars.length;
          const lvl = levelFor(avg);
          const lvlColor = levelColor(lvl);
          const lit = c.stars.filter((s) => s.mastery > 0.5).length;
          return (
            <button
              key={c.id}
              onClick={() => onSelect?.(c.id)}
              className="grid items-center gap-3.5 py-3.5 text-left bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80"
              style={{
                gridTemplateColumns: "24px 1fr 100px 70px",
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <ConstellationMiniGlyph c={c} />
              <div>
                <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, color: TEXT }}>
                  {c.glyph}
                </div>
                <div className="mt-0.5 font-mono" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 2 }}>
                  {c.name.toUpperCase()} · {lit}/{c.stars.length} LIT
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[3px] rounded-sm" style={{ background: NIGHT_3 }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${avg * 100}%`,
                      background: lvlColor,
                      boxShadow: `0 0 4px ${lvlColor}`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right font-mono" style={{ fontSize: 10, letterSpacing: 2, color: lvlColor }}>
                {lvl.name.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * ActivityHeatmap — 13-week × 7-day GitHub-style grid.
 * ─────────────────────────────────────────────────────────── */
export function ActivityHeatmap() {
  const data = ACTIVITY;
  const cell = 11;
  const gap = 3;
  const cols = 13;
  const rows = 7;
  const total = data.reduce((a, b) => a + b, 0);
  const days = data.filter((d) => d > 0).length;

  return (
    <SkyCard>
      <CardHeader title="ACTIVITY · 13 WEEKS" right={`${days} ACTIVE · ${Math.round(total / 60)}H`} />
      <svg width={cols * (cell + gap)} height={rows * (cell + gap)} className="mt-4">
        {data.map((m, i) => {
          const col = Math.floor(i / rows);
          const row = i % rows;
          const x = col * (cell + gap);
          const y = row * (cell + gap);
          const intensity = Math.min(1, m / 40);
          const isToday = i === data.length - 1;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={cell}
                height={cell}
                rx="1.5"
                fill={m === 0 ? NIGHT_3 : MOON}
                opacity={m === 0 ? 0.4 : 0.2 + intensity * 0.8}
              />
              {isToday ? (
                <rect
                  x={x - 1}
                  y={y - 1}
                  width={cell + 2}
                  height={cell + 2}
                  rx="2"
                  fill="none"
                  stroke={MOON_HI}
                  strokeWidth="1"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="mt-2.5 font-mono" style={{ fontSize: 10, color: TEXT_DIM, letterSpacing: 1 }}>
        <span style={{ color: MOON }}>● {PLAYER.streak}-DAY STREAK</span> · longest 22 days
      </div>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * AchievementsCard — 5 badge slots with custom glyphs.
 * ─────────────────────────────────────────────────────────── */
export function AchievementsCard() {
  return (
    <SkyCard>
      <CardHeader
        title="ACHIEVEMENTS"
        right={`${ACHIEVEMENTS.filter((a) => a.earned).length} / ${ACHIEVEMENTS.length}`}
      />
      <div className="grid grid-cols-5 gap-3 mt-4">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.id}
            className="flex flex-col items-center gap-1.5"
            style={{ opacity: a.earned ? 1 : 0.35 }}
            title={a.desc}
          >
            <div
              className="grid place-items-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `1px solid ${a.earned ? MOON : TEXT_FAINT}`,
                background: NIGHT_3,
                boxShadow: a.earned ? `0 0 12px ${MOON}33` : "none",
              }}
            >
              <AchievementGlyph kind={a.glyph} on={a.earned} />
            </div>
            <div
              className="text-center font-mono"
              style={{ fontSize: 9, letterSpacing: 1, color: a.earned ? TEXT : TEXT_DIM }}
            >
              {a.name.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </SkyCard>
  );
}

function AchievementGlyph({ kind, on }: { kind: Achievement["glyph"]; on: boolean }) {
  const c = on ? MOON : TEXT_DIM;
  const s = 24;
  if (kind === "star") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <path d="M 12 3 L 13.5 10.5 L 21 12 L 13.5 13.5 L 12 21 L 10.5 13.5 L 3 12 L 10.5 10.5 Z" fill={c} />
      </svg>
    );
  }
  if (kind === "compass") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="1.2" />
        <path d="M 12 4 L 14 12 L 12 20 L 10 12 Z" fill={c} />
      </svg>
    );
  }
  if (kind === "aurora") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <path d="M 4 16 Q 8 6 12 16 Q 16 6 20 16" fill="none" stroke={c} strokeWidth="1.2" />
        <circle cx="6" cy="20" r="0.8" fill={c} />
        <circle cx="18" cy="20" r="0.8" fill={c} />
      </svg>
    );
  }
  if (kind === "eclipse") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="8" fill="none" stroke={c} strokeWidth="1.2" />
        <circle cx="14" cy="12" r="6.5" fill={c} />
      </svg>
    );
  }
  // map
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
      <circle cx="6" cy="8" r="1.5" fill={c} />
      <circle cx="18" cy="8" r="1.5" fill={c} />
      <circle cx="12" cy="16" r="1.5" fill={c} />
      <line x1="6" y1="8" x2="12" y2="16" stroke={c} strokeWidth="0.8" />
      <line x1="18" y1="8" x2="12" y2="16" stroke={c} strokeWidth="0.8" />
      <line x1="6" y1="8" x2="18" y2="8" stroke={c} strokeWidth="0.8" />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * Sky / Plan tab switcher
 * ─────────────────────────────────────────────────────────── */
export function DashTabs({
  view,
  setView,
}: {
  view: "sky" | "metrics";
  setView: (v: "sky" | "metrics") => void;
}) {
  return (
    <div
      className="flex px-7 border-b"
      style={{ borderColor: LINE, background: NIGHT, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {([
        { id: "sky", label: "The Sky" },
        { id: "metrics", label: "Plan & Metrics" },
      ] as const).map((t) => (
        <button
          key={t.id}
          onClick={() => setView(t.id)}
          className="bg-transparent border-none cursor-pointer mr-7"
          style={{
            padding: "14px 0",
            color: view === t.id ? TEXT : TEXT_DIM,
            fontSize: 11,
            letterSpacing: 4,
            borderBottom: `1px solid ${view === t.id ? MOON : "transparent"}`,
            marginBottom: -1,
          }}
        >
          {t.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
