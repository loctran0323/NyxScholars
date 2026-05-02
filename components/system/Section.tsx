import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionVariant = "default" | "elevated" | "accent";
type SectionSpacing = "default" | "tight" | "loose";
type SectionGlow = "top" | "bottom" | "side" | "none";

type SectionProps = {
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  glow?: SectionGlow;
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: ReactNode;
};

const VARIANT_BG: Record<SectionVariant, string> = {
  default: "bg-transparent",
  elevated: "bg-[var(--bg-2)]",
  accent: "bg-[var(--accent-dim)]",
};

const SPACING: Record<SectionSpacing, string> = {
  default: "py-32 md:py-36",
  tight: "py-20 md:py-24",
  loose: "py-40 md:py-48",
};

const GLOW_STYLE: Record<SectionGlow, string | null> = {
  top: "var(--glow-hero)",
  bottom: "var(--glow-accent)",
  side: "var(--glow-side)",
  none: null,
};

export function Section({
  variant = "default",
  spacing = "default",
  glow = "none",
  bordered = false,
  className,
  containerClassName,
  id,
  children,
}: SectionProps) {
  const glowImage = GLOW_STYLE[glow];
  return (
    <section
      id={id}
      className={cn(
        "relative",
        VARIANT_BG[variant],
        SPACING[spacing],
        className,
      )}
    >
      {bordered ? (
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--border-2) 50%, transparent 100%)",
          }}
        />
      ) : null}
      {glowImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: glowImage }}
        />
      ) : null}
      <div
        className={cn(
          "relative max-w-7xl mx-auto px-5 sm:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
