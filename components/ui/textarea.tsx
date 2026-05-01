import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[110px] w-full rounded-xl border border-white/[0.08] bg-[#0b0f1a] px-3.5 py-3 text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
export { Textarea };
