import { cn } from "@/lib/utils";

export interface NavBadgeProps {
  variant?: "soon" | "new";
  className?: string;
  children?: React.ReactNode;
}

const STYLES: Record<NonNullable<NavBadgeProps["variant"]>, string> = {
  soon: "bg-[var(--surface-elevated)] border-[var(--border-2)] text-[var(--text-3)]",
  new: "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--accent)]",
};

const DEFAULT_LABELS: Record<NonNullable<NavBadgeProps["variant"]>, string> = {
  soon: "Soon",
  new: "New",
};

export function NavBadge({ variant = "soon", className, children }: NavBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 h-4 rounded border text-[9px] font-semibold uppercase tracking-wider",
        STYLES[variant],
        className,
      )}
    >
      {children ?? DEFAULT_LABELS[variant]}
    </span>
  );
}
