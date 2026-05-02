import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "accent" | "feature" | "ghost";

type CardProps = {
  variant?: CardVariant;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section" | "li";
  children: ReactNode;
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6",
  elevated:
    "bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
  accent:
    "bg-[var(--accent-dim)] border border-[var(--border-accent)] rounded-2xl p-6",
  feature:
    "bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-10",
  ghost:
    "bg-transparent border border-[var(--border)] rounded-2xl p-5",
};

export function Card({
  variant = "default",
  className,
  hover = false,
  as: Tag = "div",
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        VARIANT_CLASSES[variant],
        hover && "card-hover",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
