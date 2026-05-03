import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
  className?: string;
}

/**
 * Editorial stat tile used across the dashboard, teacher view, and section
 * footers. Optionally a link — when href is set the whole tile becomes a
 * clickable Link with hover affordance.
 */
export function Stat({ label, value, sub, href, className }: StatProps) {
  const inner = (
    <>
      <p className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-3)] font-semibold">{label}</p>
      <p className="text-[26px] sm:text-[30px] font-light text-[var(--text-1)] mt-1.5 leading-none font-[family-name:var(--font-fraunces)]">
        {value}
      </p>
      {sub && <p className="text-[11.5px] text-[var(--text-3)] mt-2">{sub}</p>}
    </>
  );
  const base = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors";
  if (href) {
    return (
      <Link href={href} className={cn(base, "hover:border-[var(--border-2)] block", className)}>
        {inner}
      </Link>
    );
  }
  return <div className={cn(base, className)}>{inner}</div>;
}
