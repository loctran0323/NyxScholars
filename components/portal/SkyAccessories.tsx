"use client";

import type { ReactNode } from "react";
import {
  CONSTELLATIONS, levelFor, DAILY_PLAN, SCORE_HISTORY, SCORE_TARGET, ACTIVITY,
  type Constellation, type SkyLevel,
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
 * StudentHeader — calm, factual top strip. Replaces the prior
 * gamified PlayerHeader (XP/Stardust/Streak removed — those felt
 * Duolingo-cosplay on a real human-tutor product).
 * ─────────────────────────────────────────────────────────── */
export function StudentHeader({
  studentName,
  studentInitials,
  tutorName,
  packageLabel,
  nextSession,
  onBegin,
}: {
  studentName: string;
  studentInitials: string;
  tutorName: string;
  packageLabel: string;
  nextSession: string;
  onBegin?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-5 px-7 py-4 border-b"
      style={{ background: NIGHT, borderColor: LINE }}
    >
      <div
        className="grid place-items-center shrink-0"
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: NIGHT_3, border: `1px solid ${MOON_DIM}`,
          fontFamily: "var(--font-fraunces)", fontSize: 13, color: TEXT,
        }}
      >
        {studentInitials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span style={{ fontSize: 13, color: TEXT }}>{studentName}</span>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: 3, color: MOON }}>
            WITH {tutorName.toUpperCase()} · {packageLabel.toUpperCase()}
          </span>
        </div>
        <div className="mt-1 font-mono" style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 1 }}>
          NEXT SESSION · {nextSession.toUpperCase()}
        </div>
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
        OPEN NEXT SESSION →
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Card primitives matching the dashboard-v2 card style.
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
 * NextSessionCard — the most important card on the dashboard.
 * What is your tutor doing with you next.
 * ─────────────────────────────────────────────────────────── */
export function NextSessionCard({
  tutorName,
  whenLabel,
  topic,
  whyLine,
}: {
  tutorName: string;
  whenLabel: string;
  topic: string;
  whyLine: string;
}) {
  return (
    <SkyCard>
      <CardHeader title="NEXT SESSION" right={whenLabel.toUpperCase()} />
      <p
        className="mt-3 leading-[1.25]"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: TEXT }}
      >
        {topic}
      </p>
      <p className="mt-3 text-[13px] leading-[1.65]" style={{ color: TEXT_DIM }}>
        With <span style={{ color: TEXT }}>{tutorName}</span> · {whyLine}
      </p>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * AssignedDrillsCard — what your tutor wants you to do
 * before/after the session. Replaces the prior "DailyPlanCard"
 * which framed it as engine-generated.
 * ─────────────────────────────────────────────────────────── */
export function AssignedDrillsCard({ assignedBy = "your tutor" }: { assignedBy?: string }) {
  return (
    <SkyCard>
      <CardHeader title="ASSIGNED" right={`BY ${assignedBy.toUpperCase()}`} />
      <ul className="mt-3">
        {DAILY_PLAN.map((t, i) => (
          <li
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
          </li>
        ))}
      </ul>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * EstimatedRangeCard — replaces the prior ProjectedScoreCard.
 * Calmer copy: "estimated SAT range" not "projected score" with
 * fake confidence intervals. Sparkline kept because it's real data.
 * ─────────────────────────────────────────────────────────── */
export function EstimatedRangeCard() {
  const current = SCORE_HISTORY[SCORE_HISTORY.length - 1];
  const minS = Math.min(...SCORE_HISTORY) - 40;
  const maxS = SCORE_TARGET + 20;
  const range = maxS - minS;
  const w = 280;
  const h = 80;
  const points: [number, number][] = SCORE_HISTORY.map((s, i) => [
    (i / (SCORE_HISTORY.length - 1)) * w,
    h - ((s - minS) / range) * h,
  ]);
  const targetY = h - ((SCORE_TARGET - minS) / range) * h;
  const last = points[points.length - 1];

  return (
    <SkyCard>
      <CardHeader title="ESTIMATED RANGE" right="UPDATED EACH SESSION" />
      <div className="flex items-baseline gap-2 mt-3">
        <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 44, color: TEXT, lineHeight: 1 }}>
          ~{current}
        </div>
      </div>
      <div className="mt-1" style={{ fontSize: 11, color: TEXT_DIM, lineHeight: 1.6 }}>
        From your intake plus {SCORE_HISTORY.length - 1} sessions. Target {SCORE_TARGET}.
      </div>
      <svg width="100%" height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} className="mt-4 block">
        <defs>
          <linearGradient id="er-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={MOON} stopOpacity="0.25" />
            <stop offset="100%" stopColor={MOON} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1={targetY} x2={w} y2={targetY} stroke={MOON_DIM} strokeWidth="0.5" strokeDasharray="2 4" />
        <text x={w} y={targetY - 4} fill={TEXT_DIM} fontSize="8" textAnchor="end">
          TARGET {SCORE_TARGET}
        </text>
        <path
          d={`M 0 ${h} L ${points.map((p) => p.join(",")).join(" L ")} L ${w} ${h} Z`}
          fill="url(#er-fill)"
        />
        <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={MOON} strokeWidth="1.4" />
        <circle cx={last[0]} cy={last[1]} r="3" fill={MOON_HI} />
      </svg>
    </SkyCard>
  );
}

/* ───────────────────────────────────────────────────────────
 * Tiny inline constellation glyph
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
 * ConstellationsCard — list of all constellations. Calm.
 * ─────────────────────────────────────────────────────────── */
export function ConstellationsCard({ onSelect }: { onSelect?: (id: string) => void }) {
  return (
    <SkyCard>
      <CardHeader title="ALL CONSTELLATIONS" right={`${CONSTELLATIONS.length} TRACKED`} />
      <div className="flex flex-col mt-3">
        {CONSTELLATIONS.map((c) => {
          const avg = c.stars.reduce((a, s) => a + s.mastery, 0) / c.stars.length;
          const lvl = levelFor(avg);
          const lvlColor = levelColor(lvl);
          const lit = c.stars.filter((s) => s.mastery > 0.5).length;
          return (
            <button
              key={c.id}
              onClick={() => onSelect?.(c.id)}
              className="grid items-center gap-3 py-3 text-left bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80"
              style={{
                gridTemplateColumns: "24px 1fr 80px 60px",
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <ConstellationMiniGlyph c={c} />
              <div>
                <div className="italic" style={{ fontFamily: "var(--font-fraunces)", fontSize: 14, color: TEXT }}>
                  {c.glyph}
                </div>
                <div className="mt-0.5 font-mono" style={{ fontSize: 9.5, color: TEXT_DIM, letterSpacing: 1.5 }}>
                  {c.name.toUpperCase()} · {lit}/{c.stars.length} LIT
                </div>
              </div>
              <div className="flex items-center">
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
              <div className="text-right font-mono" style={{ fontSize: 10, letterSpacing: 1.5, color: lvlColor }}>
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
 * SessionHistoryCard — replaces ActivityHeatmap.
 * Calm 13-week × 7-day grid, kept because it visualises real
 * session frequency. No streaks, no longest-streak boasting.
 * ─────────────────────────────────────────────────────────── */
export function SessionHistoryCard() {
  const data = ACTIVITY;
  const cell = 11;
  const gap = 3;
  const cols = 13;
  const rows = 7;
  const sessions = data.filter((d) => d > 0).length;
  const totalH = Math.round(data.reduce((a, b) => a + b, 0) / 60);

  return (
    <SkyCard>
      <CardHeader title="SESSION HISTORY · 13 WEEKS" right={`${sessions} SESSIONS · ${totalH}H`} />
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
    </SkyCard>
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
        { id: "metrics", label: "Plan & Notes" },
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
