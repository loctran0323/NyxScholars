import { cn } from "@/lib/utils";

type NyxMarkProps = {
  size?: number;
  showRing?: boolean;
  showStar?: boolean;
  className?: string;
};

/**
 * Refined crescent brand mark — eclipse style with hairline outer ring,
 * antique gold crescent, and a tiny star inside the negative space.
 * Adapted from the brand family reference (Images/Claude_Desing/family.jsx).
 */
export function NyxMark({
  size = 32,
  showRing = false,
  showStar = true,
  className,
}: NyxMarkProps) {
  const id = `nm-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-bright)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-deep)" />
        </linearGradient>
      </defs>
      {showRing ? (
        <>
          <circle cx="44" cy="44" r="40" fill="none" stroke="var(--accent-deep)" strokeWidth="0.5" opacity="0.55" />
          <circle cx="44" cy="44" r="36" fill="none" stroke="var(--accent-deep)" strokeWidth="0.4" opacity="0.35" />
        </>
      ) : null}
      <path
        d="M 58 22 A 24 24 0 1 0 58 66 A 18 22 0 1 1 58 22 Z"
        fill={`url(#${id}-fill)`}
      />
      <path
        d="M 58 22 A 24 24 0 1 0 58 66"
        fill="none"
        stroke="var(--accent-bright)"
        strokeWidth="0.6"
        opacity="0.7"
      />
      {showStar ? (
        <g transform="translate(34 44)">
          <path
            d="M 0 -3 L 0.7 -0.7 L 3 0 L 0.7 0.7 L 0 3 L -0.7 0.7 L -3 0 L -0.7 -0.7 Z"
            fill="var(--accent-bright)"
          />
        </g>
      ) : null}
    </svg>
  );
}

type NyxLockupProps = {
  variant?: "horizontal" | "stacked" | "monogram";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

/**
 * Crescent + Cormorant Garamond italic "Nyx" wordmark.
 * Editorial, restrained, used in nav/footer and auth pages.
 */
export function NyxLockup({
  variant = "horizontal",
  size = "md",
  showTagline = false,
  className,
}: NyxLockupProps) {
  const markSize = size === "sm" ? 24 : size === "lg" ? 56 : 32;
  const wordSize = size === "sm" ? "text-[20px]" : size === "lg" ? "text-[44px]" : "text-[26px]";

  if (variant === "monogram") {
    return <NyxMark size={markSize * 1.4} showRing className={className} />;
  }

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex flex-col items-center gap-3", className)}>
        <NyxMark size={markSize * 1.6} showRing />
        <span
          className={cn(
            "font-[family-name:var(--font-cormorant)] italic font-normal tracking-[0.04em] text-[var(--text-1)] leading-none",
            wordSize,
          )}
        >
          Nyx
        </span>
        {showTagline ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-3)]">
            Per noctem ad lucem
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <NyxMark size={markSize} />
      <span
        className={cn(
          "font-[family-name:var(--font-cormorant)] italic font-normal tracking-[0.02em] text-[var(--text-1)] leading-none",
          wordSize,
        )}
      >
        Nyx
      </span>
    </div>
  );
}
