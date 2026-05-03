import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ComponentType } from "react";

interface QuickLinkProps {
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  sub?: string;
}

/**
 * Compact icon-led link used in dashboard "Jump to" rows and similar grids.
 * Pulls the surface treatment from the design tokens so the gold accent stays
 * consistent with the rest of the portal.
 */
export function QuickLink({ href, icon: Icon, label, sub }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--border-accent)] transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
        <Icon size={14} className="text-[var(--accent)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">{label}</p>
        {sub && <p className="text-[11px] text-[var(--text-3)] truncate mt-0.5">{sub}</p>}
      </div>
      <ChevronRight size={13} className="text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors" />
    </Link>
  );
}
