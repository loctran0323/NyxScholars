import { cn } from "@/lib/utils";

type EyebrowProps = {
  color?: "brass" | "moon";
  className?: string;
  children: React.ReactNode;
};

export function Eyebrow({ color = "brass", className, children }: EyebrowProps) {
  const colorClass = color === "brass" ? "text-[var(--accent)] gold-line" : "text-[var(--accent-2)] moon-line";
  return (
    <p
      className={cn(
        "inline-flex items-center font-semibold uppercase tracking-[0.16em]",
        "text-[var(--fs-12)]",
        colorClass,
        className,
      )}
    >
      {children}
    </p>
  );
}
