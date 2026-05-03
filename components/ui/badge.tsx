import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "gold" | "green" | "red" | "blue" | "purple" | "verified";
  size?: "sm" | "default";
  children: ReactNode;
  className?: string;
  title?: string;
}

const variants = {
  default:  "bg-white/[0.06] text-[var(--text-2)] border-[var(--border)]",
  gold:     "bg-[var(--gold-dim)] text-[var(--gold-soft)] border-[var(--gold-soft)]/25",
  green:    "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/25",
  red:      "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/25",
  blue:     "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--border-accent)]",
  purple:   "bg-purple-500/10 text-purple-400 border-purple-500/25",
  verified: "bg-[var(--gold-dim)] text-[var(--gold-soft)] border-[var(--gold-soft)]/35",
};

export function Badge({ variant = "default", size = "default", children, className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide uppercase",
        size === "sm" ? "px-1.5 py-px text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
