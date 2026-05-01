import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-white/[0.08] bg-[#0b0f1a] px-3.5 py-2 text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
