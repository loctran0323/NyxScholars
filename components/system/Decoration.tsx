import { cn } from "@/lib/utils";

/* ───────────────────────────────────────────────────────────
 * Drift — a sparse layer of stars + faint constellation lines
 * placed behind a section. Always pointer-events-none.
 * ─────────────────────────────────────────────────────────── */
type DriftProps = {
  density?: "low" | "med" | "high";
  className?: string;
  seed?: number;
};
export function Drift({ density = "med", className, seed = 7 }: DriftProps) {
  const count = density === "low" ? 14 : density === "high" ? 60 : 32;
  const rng = mulberry32(seed);
  const stars = Array.from({ length: count }, (_, i) => ({
    cx: rng() * 100,
    cy: rng() * 100,
    r: 0.4 + rng() * 1.2,
    o: 0.2 + rng() * 0.5,
    pulse: rng() > 0.7,
    key: i,
  }));
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className={cn("pointer-events-none absolute inset-0 w-full h-full", className)}
    >
      {stars.map((s) => (
        <circle
          key={s.key}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#ede7d6"
          opacity={s.o}
          className={s.pulse ? "twinkle" : undefined}
        />
      ))}
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────
 * Arc — a curved hairline divider that replaces the straight
 * horizon line between sections. The curve points up or down.
 * ─────────────────────────────────────────────────────────── */
type ArcProps = {
  direction?: "up" | "down";
  intensity?: "subtle" | "medium" | "strong";
  color?: "border" | "accent" | "moon";
  className?: string;
};
export function Arc({
  direction = "up",
  intensity = "medium",
  color = "border",
  className,
}: ArcProps) {
  const depth = intensity === "subtle" ? 8 : intensity === "strong" ? 32 : 18;
  const stroke =
    color === "accent"
      ? "var(--accent)"
      : color === "moon"
        ? "var(--accent-2)"
        : "rgba(237, 231, 214, 0.18)";
  const path =
    direction === "up"
      ? `M 0 ${50 + depth / 2} Q 500 ${50 - depth / 2}, 1000 ${50 + depth / 2}`
      : `M 0 ${50 - depth / 2} Q 500 ${50 + depth / 2}, 1000 ${50 - depth / 2}`;
  const gradId = `arc-grad-${direction}-${intensity}-${color}`;
  return (
    <div className={cn("relative w-full h-[1px]", className)} aria-hidden>
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-[100px] -translate-y-1/2"
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={stroke} stopOpacity="0" />
            <stop offset="50%" stopColor={stroke} stopOpacity="1" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke={`url(#${gradId})`} strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * BlobGlow — large organic gradient blob, used at section
 * corners for atmospheric depth. Filter-blurred for softness.
 * ─────────────────────────────────────────────────────────── */
type BlobGlowProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  color?: "gold" | "moon" | "ink";
  size?: "sm" | "md" | "lg" | "xl";
  intensity?: number;
  className?: string;
};
const POS: Record<NonNullable<BlobGlowProps["position"]>, string> = {
  "top-left": "top-[-20%] left-[-15%]",
  "top-right": "top-[-20%] right-[-15%]",
  "bottom-left": "bottom-[-20%] left-[-15%]",
  "bottom-right": "bottom-[-20%] right-[-15%]",
  "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};
const SIZE: Record<NonNullable<BlobGlowProps["size"]>, string> = {
  sm: "w-[420px] h-[420px]",
  md: "w-[640px] h-[640px]",
  lg: "w-[860px] h-[860px]",
  xl: "w-[1100px] h-[1100px]",
};
export function BlobGlow({
  position = "top-right",
  color = "gold",
  size = "lg",
  intensity = 0.18,
  className,
}: BlobGlowProps) {
  const fill =
    color === "gold"
      ? `rgba(200, 162, 75, ${intensity})`
      : color === "moon"
        ? `rgba(125, 211, 252, ${intensity})`
        : `rgba(13, 18, 36, ${intensity})`;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full",
        POS[position],
        SIZE[size],
        className,
      )}
      style={{
        background: `radial-gradient(circle, ${fill} 0%, transparent 60%)`,
        filter: "blur(40px)",
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────
 * SignatureLine — a single hand-drawn-feel curved accent,
 * used to underline section eyebrows or break up flow.
 * ─────────────────────────────────────────────────────────── */
type SignatureLineProps = {
  width?: number;
  className?: string;
};
export function SignatureLine({ width = 220, className }: SignatureLineProps) {
  return (
    <svg
      width={width}
      height="14"
      viewBox={`0 0 ${width} 14`}
      aria-hidden
      className={cn("text-[var(--accent)]", className)}
    >
      <defs>
        <linearGradient id={`sig-${width}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 4 7 Q ${width / 4} 2, ${width / 2} 7 T ${width - 4} 7`}
        fill="none"
        stroke={`url(#sig-${width})`}
        strokeWidth="0.8"
      />
      <circle cx={width / 2} cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

/* deterministic PRNG, same as PhotoFrame */
function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
