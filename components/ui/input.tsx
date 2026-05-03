import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-10 w-full rounded-xl border bg-[var(--bg-2)] px-3.5 py-2 text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        "border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40 focus:border-[var(--gold-soft)]/40",
        invalid && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/30",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
