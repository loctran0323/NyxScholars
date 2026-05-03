import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InfoBannerProps {
  tone?: "info" | "warn";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoBanner({ tone = "info", title, children, className }: InfoBannerProps) {
  const toneClasses =
    tone === "warn"
      ? "border-[var(--border-2)] bg-[var(--surface-elevated)]"
      : "border-[var(--border-accent)] bg-[var(--accent-dim)]";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-start gap-3",
        toneClasses,
        className,
      )}
      role="status"
    >
      <Info
        size={15}
        className={cn("mt-0.5 shrink-0", tone === "warn" ? "text-[var(--text-2)]" : "text-[var(--accent)]")}
      />
      <div className="text-[13px] text-[var(--text-1)] leading-relaxed">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}
