import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "gold" | "green" | "red" | "blue" | "purple";
  size?: "sm" | "default";
  children: ReactNode;
  className?: string;
}

const variants = {
  default: "bg-white/[0.06] text-[#8d9ab0] border-white/[0.1]",
  gold: "bg-[#d4a853]/10 text-[#d4a853] border-[#d4a853]/25",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function Badge({ variant = "default", size = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tracking-wide uppercase",
        size === "sm" ? "px-1.5 py-px text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
