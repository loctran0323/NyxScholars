"use client";

/**
 * Backgrounds — full-page atmospheric backdrops, ported from the brand
 * `backgrounds.jsx` reference. Each component is meant to fill a parent
 * `relative` container as `absolute inset-0`. They are pointer-events-none
 * by default; if a background is interactive (ParallaxStars), it sets
 * pointer-events itself.
 *
 * Palette is the cool "moon" variant from the brand reference, sitting
 * underneath the warm typography layer. Ivory text reads beautifully on
 * the deep blue sky.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NIGHT = "#070914";
const NIGHT_2 = "#0c1124";
const LINE = "#1e2542";
const TEXT_FAINT = "#4a5170";
const TEXT_DIM = "#7a82a0";
const MOON = "#7dd3fc";
const MOON_DIM = "#3b7a99";
const MOON_HI = "#bde9ff";
const VIOLET = "#a78bfa";
const AURORA = "#67e8f9";

/* deterministic PRNG so seeded layouts are stable across renders */
function rand(i: number, salt = 1) {
  const s = (i * 9301 + salt * 49297) % 233280;
  return s / 233280;
}

type Common = { className?: string };

/* ───────────────────────────────────────────────────────────
 * BackgroundStars — shared, used by several composite scenes.
 * ─────────────────────────────────────────────────────────── */
function BackgroundStars({ n = 120, twinkleEvery = 6 }: { n?: number; twinkleEvery?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: n }, (_, i) => ({
      x: rand(i, 11),
      y: rand(i, 22),
      s: rand(i, 33),
      twinkle: i % twinkleEvery === 0,
    }));
  }, [n, twinkleEvery]);
  return (
    <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x * 100}%`}
          cy={`${s.y * 100}%`}
          r={s.s * 1.0 + 0.2}
          fill={TEXT_FAINT}
          opacity={s.s * 0.5 + 0.15}
        >
          {s.twinkle ? (
            <animate
              attributeName="opacity"
              values={`${s.s * 0.3};${s.s * 0.85};${s.s * 0.3}`}
              dur={`${3 + (i % 4)}s`}
              repeatCount="indefinite"
            />
          ) : null}
        </circle>
      ))}
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * 01 · DEEP NIGHT — base star field, twinkling.
 * Use behind any section that wants a calm sky.
 * ─────────────────────────────────────────────────────────── */
export function BgDeepNight({ className }: Common) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #11183a 0%, #0a0e26 35%, #050816 70%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={200} twinkleEvery={5} />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 02 · AURORA NEBULA — drifting cyan/violet washes, soft and organic.
 * ─────────────────────────────────────────────────────────── */
export function BgAuroraNebula({ className }: Common) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ background: NIGHT }} aria-hidden>
      <div
        className="absolute"
        style={{
          inset: "-20%",
          background: `
            radial-gradient(ellipse 50% 40% at 25% 30%, ${MOON}33 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 75% 70%, ${VIOLET}33 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 50% 90%, ${AURORA}22 0%, transparent 55%)`,
          animation: "nyxAuroraDrift 24s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 30%, ${NIGHT}aa 100%)`,
        }}
      />
      <BackgroundStars n={120} />
      <style>{`
        @keyframes nyxAuroraDrift {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-3%, 2%) rotate(3deg); }
          100% { transform: translate(2%, -2%) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 03 · SHOOTING STARS — periodic streaks across the sky.
 * ─────────────────────────────────────────────────────────── */
export function BgShootingStars({ className }: Common) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #0e1330 0%, #06091c 60%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={140} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${10 + i * 18}%`,
            left: "-10%",
            width: 200,
            height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${MOON_HI} 50%, transparent 100%)`,
            boxShadow: `0 0 6px ${MOON}`,
            transform: "rotate(-20deg)",
            animation: `nyxShoot 7s ${i * 2.2}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes nyxShoot {
          0% { transform: translateX(0) rotate(-20deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(120vw) rotate(-20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 04 · CONSTELLATION GRID — repeating star+line motif wallpaper.
 * Vignetted at edges. Calm, structural.
 * ─────────────────────────────────────────────────────────── */
export function BgConstellationGrid({ className }: Common) {
  return (
    <div className={cn("absolute inset-0", className)} style={{ background: NIGHT }} aria-hidden>
      <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
        <defs>
          <pattern id="nyx-cgrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="60" x2="120" y2="60" stroke={LINE} strokeWidth="0.4" />
            <line x1="60" y1="0" x2="60" y2="120" stroke={LINE} strokeWidth="0.4" />
            <line x1="30" y1="40" x2="90" y2="50" stroke={MOON_DIM} strokeWidth="0.3" opacity="0.6" />
            <line x1="90" y1="50" x2="80" y2="90" stroke={MOON_DIM} strokeWidth="0.3" opacity="0.6" />
            <line x1="80" y1="90" x2="30" y2="40" stroke={MOON_DIM} strokeWidth="0.3" opacity="0.4" />
            <circle cx="30" cy="40" r="1.8" fill={MOON_HI} />
            <circle cx="30" cy="40" r="4" fill={MOON} opacity="0.2" />
            <circle cx="90" cy="50" r="1.4" fill={MOON} />
            <circle cx="80" cy="90" r="1" fill={MOON_DIM} />
            <circle cx="60" cy="60" r="0.6" fill={TEXT_FAINT} />
          </pattern>
          <radialGradient id="nyx-cgrad" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor={NIGHT} />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#nyx-cgrid)" />
        <rect width="100%" height="100%" fill="url(#nyx-cgrad)" />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 05 · CRESCENT MOON — large crescent with cyan atmospheric glow.
 * The moon sits in the upper-right by default.
 * ─────────────────────────────────────────────────────────── */
export function BgCrescentMoon({ className, position = "upper-right" }: Common & { position?: "upper-right" | "upper-left" }) {
  const cx = position === "upper-left" ? "30" : "70";
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, #0f1532 0%, #05071a 60%, #02040c 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={100} />
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`nyx-cm-glow-${position}`} cx={`${parseInt(cx, 10) / 100}`} cy="0.4" r="0.4">
            <stop offset="0%" stopColor={MOON} stopOpacity="0.25" />
            <stop offset="100%" stopColor={MOON} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`nyx-cm-fill-${position}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={MOON_HI} />
            <stop offset="100%" stopColor={MOON_DIM} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy="40" r="40" fill={`url(#nyx-cm-glow-${position})`} />
        <g transform={`translate(${cx} 40)`}>
          <path
            d="M 8 -18 A 18 18 0 1 0 8 18 A 13 18 0 1 1 8 -18 Z"
            fill={`url(#nyx-cm-fill-${position})`}
          />
        </g>
        <circle cx="20" cy="20" r="0.6" fill={MOON_HI} />
        <circle cx="30" cy="60" r="0.4" fill={MOON} />
        <circle cx="15" cy="75" r="0.5" fill={MOON_HI} />
        <circle cx="80" cy="80" r="0.5" fill={MOON_DIM} />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 06 · ORBITAL — concentric rings rotating slowly, like an astrolabe.
 * Centered. Dramatic. Use for product / dashboard sections.
 * ─────────────────────────────────────────────────────────── */
export function BgOrbital({ className }: Common) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden grid place-items-center", className)}
      style={{
        background:
          "radial-gradient(ellipse at center, #0e1330 0%, #050816 70%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={80} />
      <svg
        width="600"
        height="600"
        viewBox="-300 -300 600 600"
        className="absolute max-w-[120%] max-h-[120%]"
      >
        {[80, 130, 180, 230, 280].map((r, i) => (
          <g
            key={r}
            style={{
              animation: `nyxOrbit ${20 + i * 6}s linear ${i % 2 ? "" : "reverse"} infinite`,
              transformOrigin: "0 0",
            }}
          >
            <circle
              cx="0"
              cy="0"
              r={r}
              fill="none"
              stroke={LINE}
              strokeWidth="0.4"
              strokeDasharray={i % 2 ? "2 4" : "0"}
              opacity="0.6"
            />
            <circle cx={r} cy="0" r="2" fill={MOON} opacity={0.8 - i * 0.1}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            {i === 1 && <circle cx={-r} cy="0" r="1.5" fill={MOON_HI} />}
            {i === 3 && <circle cx="0" cy={r} r="1.5" fill={MOON_DIM} />}
          </g>
        ))}
        <circle cx="0" cy="0" r="3" fill={MOON_HI} />
        <circle cx="0" cy="0" r="8" fill={MOON} opacity="0.3" />
      </svg>
      <style>{`@keyframes nyxOrbit { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 07 · STARDUST FIELD — particles drifting upward, ascending stardust.
 * ─────────────────────────────────────────────────────────── */
export function BgStardustField({ className }: Common) {
  const parts = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      left: rand(i, 7) * 100,
      size: rand(i, 8) * 2 + 0.5,
      delay: rand(i, 9) * 8,
      duration: 6 + rand(i, 10) * 6,
      color: i % 3 === 0 ? MOON_HI : i % 3 === 1 ? MOON : MOON_DIM,
    }));
  }, []);
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "radial-gradient(ellipse at center bottom, #0e1530 0%, #050816 70%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={60} />
      {parts.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `nyxRise ${p.duration}s ${p.delay}s linear infinite`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes nyxRise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 08 · NORTH STAR — single dominant star with radial rays. Centered.
 * ─────────────────────────────────────────────────────────── */
export function BgNorthStar({ className }: Common) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden grid place-items-center", className)}
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #0f1838 0%, #060920 50%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={140} />
      <svg width="400" height="400" viewBox="-200 -200 400 400" className="absolute">
        <defs>
          <radialGradient id="nyx-ns-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={MOON_HI} stopOpacity="0.6" />
            <stop offset="40%" stopColor={MOON} stopOpacity="0.15" />
            <stop offset="100%" stopColor={MOON} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="180" fill="url(#nyx-ns-glow)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const long = i % 2 === 0;
          const len = long ? 160 : 90;
          const x = Math.cos(angle) * len;
          const y = Math.sin(angle) * len;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke={MOON}
              strokeWidth={long ? 0.8 : 0.4}
              opacity={long ? 0.5 : 0.3}
            />
          );
        })}
        <circle cx="0" cy="0" r="5" fill={MOON_HI}>
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="14" fill={MOON} opacity="0.4" />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 09 · PARALLAX STARS — depth effect, mouse-aware (interactive).
 * Pointer-events ENABLED on this one (it tracks the mouse).
 * ─────────────────────────────────────────────────────────── */
export function BgParallaxStars({ className }: Common) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setM({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const layers = [
    { depth: 0.3, n: 80, size: 0.5 },
    { depth: 0.6, n: 50, size: 1.0 },
    { depth: 1.0, n: 25, size: 1.5 },
  ];

  return (
    <div
      ref={wrapRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background:
          "radial-gradient(ellipse at center, #0e1330 0%, #050816 70%, #03050e 100%)",
      }}
      aria-hidden
    >
      {layers.map((L, li) => {
        const dx = (m.x - 0.5) * 30 * L.depth;
        const dy = (m.y - 0.5) * 30 * L.depth;
        const stars = Array.from({ length: L.n }, (_, i) => ({
          x: rand(i + li * 100, 1) * 100,
          y: rand(i + li * 100, 2) * 100,
          s: rand(i + li * 100, 3),
        }));
        return (
          <div
            key={li}
            className="absolute inset-0"
            style={{
              transform: `translate(${dx}px, ${dy}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <svg width="100%" height="100%" preserveAspectRatio="none">
              {stars.map((s, i) => (
                <circle
                  key={i}
                  cx={`${s.x}%`}
                  cy={`${s.y}%`}
                  r={s.s * L.size + 0.3}
                  fill={li === 2 ? MOON_HI : li === 1 ? MOON_DIM : TEXT_FAINT}
                  opacity={s.s * 0.4 + 0.4 * L.depth}
                />
              ))}
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 10 · ECLIPSE — large dark disk with a corona. Moody, central.
 * ─────────────────────────────────────────────────────────── */
export function BgEclipse({ className }: Common) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden grid place-items-center", className)}
      style={{
        background:
          "radial-gradient(ellipse at center, #14193a 0%, #06091c 70%, #03050e 100%)",
      }}
      aria-hidden
    >
      <BackgroundStars n={100} />
      <svg width="500" height="500" viewBox="-250 -250 500 500" className="absolute">
        <defs>
          <radialGradient id="nyx-ec-corona" cx="0.5" cy="0.5" r="0.5">
            <stop offset="40%" stopColor="transparent" />
            <stop offset="50%" stopColor={MOON_HI} stopOpacity="0.7" />
            <stop offset="60%" stopColor={MOON} stopOpacity="0.3" />
            <stop offset="100%" stopColor={MOON} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="240" fill="url(#nyx-ec-corona)" />
        <circle cx="0" cy="0" r="100" fill={NIGHT} stroke={MOON} strokeWidth="0.6" />
        <circle cx="0" cy="0" r="100" fill="none" stroke={MOON_HI} strokeWidth="0.4" opacity="0.6" />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * 11 · INK WASH — minimal hairline grid with two soft color washes.
 * For content-heavy pages where stars would compete with text.
 * ─────────────────────────────────────────────────────────── */
export function BgInkWash({ className }: Common) {
  return (
    <div className={cn("absolute inset-0", className)} style={{ background: NIGHT }} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, ${MOON}14 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 80% 80%, ${VIOLET}10 0%, transparent 60%)`,
        }}
      />
      <svg width="100%" height="100%" className="absolute inset-0 opacity-50" preserveAspectRatio="none">
        <defs>
          <pattern id="nyx-iw-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="64" y2="0" stroke={LINE} strokeWidth="0.3" />
            <line x1="0" y1="0" x2="0" y2="64" stroke={LINE} strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nyx-iw-grid)" />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Helper — soft section fade overlay. Eases any background into
 * the page bg above and below, killing the rectangular framing.
 * ─────────────────────────────────────────────────────────── */
export function BgFade({
  top = true,
  bottom = true,
  height = 96,
}: {
  top?: boolean;
  bottom?: boolean;
  height?: number;
}) {
  return (
    <>
      {top ? (
        <div
          aria-hidden
          className="absolute left-0 right-0 top-0 pointer-events-none"
          style={{
            height,
            background: `linear-gradient(180deg, var(--bg) 0%, transparent 100%)`,
          }}
        />
      ) : null}
      {bottom ? (
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height,
            background: `linear-gradient(0deg, var(--bg) 0%, transparent 100%)`,
          }}
        />
      ) : null}
    </>
  );
}
