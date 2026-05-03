import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TextVariant = "body" | "lead" | "caption" | "small";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  body: "text-[var(--fs-16)] leading-[1.7] text-[var(--text-2)]",
  lead: "text-[var(--fs-18)] leading-[1.7] text-[var(--text-2)]",
  caption: "text-[var(--fs-12)] uppercase tracking-[0.12em] text-[var(--text-3)] font-mono",
  small: "text-[var(--fs-14)] leading-[1.65] text-[var(--text-2)]",
};

type TextProps = {
  variant?: TextVariant;
  /** Force the muted text token regardless of variant. */
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

export function Text({ variant = "body", muted, className, children }: TextProps) {
  return (
    <p
      className={cn(
        VARIANT_CLASSES[variant],
        muted && "text-[var(--text-3)]",
        className,
      )}
    >
      {children}
    </p>
  );
}
