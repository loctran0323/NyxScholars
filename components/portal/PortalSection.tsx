import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PortalSectionProps {
  /** Lowercase section eyebrow. */
  label?: string;
  /** Optional title rendered alongside the eyebrow. */
  title?: ReactNode;
  /** Optional right-aligned link/action. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Inner-page section with a subtle eyebrow + optional title + slot for an
 * action link on the right. Keeps spacing rhythm consistent across the
 * portal without forcing every page to re-declare grid math.
 */
export function PortalSection({ label, title, action, className, children }: PortalSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(label || title || action) && (
        <header className="flex items-end justify-between gap-3">
          <div>
            {label && (
              <p className="text-[10.5px] uppercase tracking-[0.22em] font-semibold text-[var(--text-3)]">
                {label}
              </p>
            )}
            {title && (
              <h2 className="text-[15px] font-semibold text-[var(--text-1)] mt-0.5">{title}</h2>
            )}
          </div>
          {action && <div className="text-[12px] text-[var(--text-2)]">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
