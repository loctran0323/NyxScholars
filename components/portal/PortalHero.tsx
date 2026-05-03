import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PortalHeroProps {
  /** Tiny eyebrow above the title — usually a section name. */
  eyebrow?: string;
  /** Display title, rendered in the editorial display face. */
  title: ReactNode;
  /** Optional italic flourish appended to the title. */
  italic?: string;
  /** One-line subtitle below the title. */
  subtitle?: ReactNode;
  /** Right-aligned actions (buttons, status pills). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Editorial header used at the top of every portal page. Pairs a Fraunces
 * display title with a small eyebrow + sans subtitle. Establishes the
 * visual rhythm so all inner pages feel like they belong to the same book.
 */
export function PortalHero({ eyebrow, title, italic, subtitle, actions, className }: PortalHeroProps) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4 mb-7", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[var(--text-3)] mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1
          className="font-[family-name:var(--font-fraunces)] font-light text-[28px] sm:text-[32px] text-[var(--text-1)] leading-[1.05] tracking-[-0.015em]"
        >
          {title}
          {italic && (
            <>
              {" "}
              <span
                className="italic font-light text-[var(--accent)]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {italic}
              </span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] text-[var(--text-2)] leading-relaxed mt-2 max-w-xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
