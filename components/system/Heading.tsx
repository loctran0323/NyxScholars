import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4";

type HeadingProps = {
  /** Numeric level (1–4). Optional when `size` is provided. */
  level?: HeadingLevel;
  /** Semantic-but-bigger size variant. `display` is larger than `h1`. */
  size?: HeadingSize;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: ReactNode;
};

const LEVEL_CLASSES: Record<HeadingLevel, string> = {
  1: "font-[family-name:var(--font-fraunces)] font-medium text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] tracking-[-0.02em]",
  2: "font-[family-name:var(--font-fraunces)] font-medium text-[2rem] md:text-[3rem] leading-[1.1] tracking-[-0.015em]",
  3: "font-sans font-semibold text-[1.5rem] leading-[1.25] tracking-[-0.005em]",
  4: "font-sans font-semibold text-[1.125rem] leading-[1.35]",
};

const SIZE_TO_LEVEL: Record<HeadingSize, HeadingLevel> = {
  display: 1,
  h1: 1,
  h2: 2,
  h3: 3,
  h4: 4,
};

export function Heading({ level, size, as, className, children }: HeadingProps) {
  const resolvedLevel: HeadingLevel = level ?? (size ? SIZE_TO_LEVEL[size] : 2);
  const Tag: ElementType = as ?? (`h${resolvedLevel}` as ElementType);
  return (
    <Tag className={cn("text-[var(--text-1)]", LEVEL_CLASSES[resolvedLevel], className)}>
      {children}
    </Tag>
  );
}
