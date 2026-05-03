import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex min-h-[110px] w-full rounded-xl border bg-[var(--bg-2)] px-3.5 py-3 text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
        "border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40 focus:border-[var(--gold-soft)]/40",
        invalid && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/30",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
export { Textarea };
