import { cn } from "@/lib/utils";

type EyeletProps = {
  index?: string;
  label: string;
  className?: string;
};

export function Eyelet({ index, label, className }: EyeletProps) {
  return (
    <span
      className={cn(
        "font-mono text-[var(--fs-12)] uppercase tracking-[0.18em] text-[var(--text-3)]",
        className,
      )}
    >
      {index ? <span className="text-[var(--accent)] mr-2">{index}</span> : null}
      {label}
    </span>
  );
}
