import { cn } from "@/lib/utils";

export type StatItem = {
  stat: string;
  label: string;
  mono?: boolean;
};

type StatBlockProps = {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
};

const COLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function StatBlock({ items, columns = 4, className }: StatBlockProps) {
  return (
    <div
      className={cn(
        "grid gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden",
        COLS[columns],
        className,
      )}
    >
      {items.map(({ stat, label, mono }) => (
        <div
          key={`${label}-${stat}`}
          className="bg-[var(--bg-2)] px-6 py-5 flex flex-col justify-center"
        >
          <p
            className={cn(
              "text-[var(--text-1)] font-semibold mb-1",
              mono ? "font-mono text-[var(--fs-18)]" : "text-[var(--fs-18)]",
            )}
          >
            {stat}
          </p>
          <p className="text-[var(--text-3)] text-[var(--fs-12)] uppercase tracking-[0.12em]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
