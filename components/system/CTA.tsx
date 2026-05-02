import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CTAVariant = "primary" | "ghost";
type CTASize = "default" | "lg";

type CTAProps = {
  href: string;
  variant?: CTAVariant;
  size?: CTASize;
  trailingIcon?: boolean;
  className?: string;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<CTAVariant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black font-bold hover:from-[#e2c685] hover:to-[#cba961] shadow-[0_8px_28px_rgba(201,169,97,0.28)] hover:shadow-[0_14px_44px_rgba(201,169,97,0.42)] hover:-translate-y-0.5",
  ghost:
    "border border-[var(--border-2)] text-[var(--text-1)] font-semibold hover:bg-[var(--surface)]",
};

const SIZE_CLASSES: Record<CTASize, string> = {
  default: "px-7 py-3.5 text-[var(--fs-14)]",
  lg: "px-8 py-4 text-[var(--fs-16)]",
};

export function CTA({
  href,
  variant = "primary",
  size = "default",
  trailingIcon = true,
  className,
  children,
}: CTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-[var(--dur-hover)]",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
      {trailingIcon ? (
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
