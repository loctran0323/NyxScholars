"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Aspect = "auto" | "square" | "portrait" | "landscape" | "wide";
type Mask = "none" | "top" | "bottom" | "both";

type PhotoFrameProps = {
  src?: string;
  alt: string;
  index?: string;
  caption?: string;
  aspect?: Aspect;
  mask?: Mask;
  priority?: boolean;
  hoverZoom?: boolean;
  className?: string;
  rounded?: "default" | "lg" | "none";
  fill?: boolean;
  /** Deterministic seed for the constellation fallback. Defaults to alt. */
  seed?: string;
  /** Force the fallback even when src is provided (useful while assets aren't ready). */
  forceFallback?: boolean;
};

const ASPECT_CLASSES: Record<Aspect, string> = {
  auto: "",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[21/9]",
};

const MASK_CLASSES: Record<Mask, string> = {
  none: "",
  top: "photo-mask-top",
  bottom: "photo-mask-bottom",
  both: "photo-mask-both",
};

const ROUNDED: Record<"default" | "lg" | "none", string> = {
  default: "rounded-[28px]",
  lg: "rounded-[40px]",
  none: "rounded-none",
};

export function PhotoFrame({
  src,
  alt,
  index,
  caption,
  aspect = "landscape",
  mask = "none",
  priority = false,
  hoverZoom = false,
  className,
  rounded = "default",
  fill = true,
  seed,
  forceFallback = false,
}: PhotoFrameProps) {
  const [errored, setErrored] = useState(false);
  const showFallback = forceFallback || !src || errored;

  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--border)] bg-[var(--surface)]",
          ASPECT_CLASSES[aspect],
          ROUNDED[rounded],
        )}
      >
        {showFallback ? (
          <ConstellationFallback seed={seed ?? alt} />
        ) : (
          <Image
            src={src!}
            alt={alt}
            fill={fill}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setErrored(true)}
            className={cn(
              "object-cover transition-transform duration-[var(--dur-transform)] ease-[var(--ease-out-soft)]",
              MASK_CLASSES[mask],
              hoverZoom && "hover:scale-[1.02]",
            )}
          />
        )}
        {/* Soft inner glow on every frame for warmth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(232, 204, 126, 0.08), transparent 60%), radial-gradient(ellipse 80% 50% at 50% 110%, rgba(10, 14, 26, 0.6), transparent 50%)",
          }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 flex items-center gap-3 font-mono text-[var(--fs-12)] uppercase tracking-[0.18em] text-[var(--text-3)]">
          {index ? <span className="text-[var(--accent)]">{index}</span> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ───────────────────────────────────────────────────────────
 * Constellation fallback — deterministic SVG art per seed.
 * Uses brand palette (ink, gold, ivory) and feels like a sky
 * detail rather than a broken image box.
 * ─────────────────────────────────────────────────────────── */
function ConstellationFallback({ seed }: { seed: string }) {
  const rng = mulberry32(hashSeed(seed));
  const W = 800;
  const H = 500;

  // Star cluster
  const stars = Array.from({ length: 24 }, (_, i) => ({
    cx: rng() * W,
    cy: rng() * H,
    r: 0.5 + rng() * 1.6,
    o: 0.35 + rng() * 0.55,
    key: i,
  }));

  // Pick 5 stars to connect into a constellation
  const constellation = [0, 4, 9, 13, 18, 22]
    .map((i) => stars[i] ?? stars[0])
    .filter(Boolean);

  // Crescent in one of two corners
  const crescentInTopRight = rng() > 0.5;
  const cx = crescentInTopRight ? W - 110 : 110;
  const cy = crescentInTopRight ? 110 : H - 110;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`pf-bg-${seed.length}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1a2238" />
          <stop offset="60%" stopColor="#0c1220" />
          <stop offset="100%" stopColor="#06090f" />
        </radialGradient>
        <linearGradient id={`pf-cresc-${seed.length}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8cc7e" />
          <stop offset="60%" stopColor="#c8a24b" />
          <stop offset="100%" stopColor="#8c6f2e" />
        </linearGradient>
        <filter id={`pf-glow-${seed.length}`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* sky */}
      <rect width={W} height={H} fill={`url(#pf-bg-${seed.length})`} />

      {/* nebulous wash */}
      <ellipse
        cx={W * (crescentInTopRight ? 0.3 : 0.7)}
        cy={H * 0.55}
        rx={W * 0.4}
        ry={H * 0.3}
        fill="rgba(125, 211, 252, 0.05)"
      />
      <ellipse
        cx={W * (crescentInTopRight ? 0.7 : 0.3)}
        cy={H * 0.3}
        rx={W * 0.3}
        ry={H * 0.2}
        fill="rgba(200, 162, 75, 0.04)"
      />

      {/* faint horizon arc */}
      <path
        d={`M -20 ${H * 0.78} Q ${W / 2} ${H * 0.62}, ${W + 20} ${H * 0.78}`}
        fill="none"
        stroke="rgba(237, 231, 214, 0.06)"
        strokeWidth="1"
      />

      {/* connecting constellation lines */}
      {constellation.slice(0, -1).map((s, i) => {
        const next = constellation[i + 1];
        return (
          <line
            key={`l-${i}`}
            x1={s.cx}
            y1={s.cy}
            x2={next.cx}
            y2={next.cy}
            stroke="rgba(232, 204, 126, 0.25)"
            strokeWidth="0.6"
          />
        );
      })}

      {/* stars */}
      {stars.map((s) => (
        <circle
          key={s.key}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#ede7d6"
          opacity={s.o}
        />
      ))}

      {/* highlighted stars (constellation nodes) */}
      {constellation.map((s, i) => (
        <g key={`h-${i}`}>
          <circle cx={s.cx} cy={s.cy} r={s.r * 2.2} fill="rgba(232, 204, 126, 0.18)" filter={`url(#pf-glow-${seed.length})`} />
          <circle cx={s.cx} cy={s.cy} r={s.r * 1.1} fill="#e8cc7e" />
        </g>
      ))}

      {/* crescent */}
      <g transform={`translate(${cx} ${cy})`}>
        <circle r="58" fill="none" stroke="rgba(200, 162, 75, 0.35)" strokeWidth="0.6" />
        <circle r="48" fill="none" stroke="rgba(200, 162, 75, 0.2)" strokeWidth="0.4" />
        <path
          d="M 22 -28 A 32 32 0 1 0 22 28 A 24 28 0 1 1 22 -28 Z"
          fill={`url(#pf-cresc-${seed.length})`}
        />
        <g transform="translate(-14 0)">
          <path d="M 0 -3 L 0.7 -0.7 L 3 0 L 0.7 0.7 L 0 3 L -0.7 0.7 L -3 0 L -0.7 -0.7 Z" fill="#e8cc7e" />
        </g>
      </g>
    </svg>
  );
}

/* deterministic PRNG so the same seed always produces the same art */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
