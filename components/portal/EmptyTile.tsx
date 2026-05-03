import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ComponentType } from "react";

interface EmptyTileProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  body?: string;
  cta?: { href: string; label: string };
}

/**
 * Empty-state placeholder used in PortalSection bodies. Keeps the tone calm
 * (dashed border, centered icon, single sentence) instead of the "shouty"
 * empty states common on dashboards.
 */
export function EmptyTile({ icon: Icon, title, body, cta }: EmptyTileProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)]/50 p-7 text-center">
      <Icon size={22} className="text-[var(--text-3)] mx-auto mb-3" />
      <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{title}</p>
      {body && (
        <p className="text-[12.5px] text-[var(--text-2)] mt-1.5 max-w-xs mx-auto leading-relaxed">{body}</p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent)] text-[12.5px] font-semibold"
        >
          {cta.label}
          <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}
