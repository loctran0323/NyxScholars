"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[14px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface)] border border-[var(--border-accent)] text-[var(--text-1)] hover:bg-[var(--surface-elevated)] hover:border-[var(--accent)]",
        primary:
          "bg-[var(--gold-soft)] text-[var(--on-gold)] border border-[var(--gold)] hover:bg-[var(--gold-bright)] hover:border-[var(--gold-bright)] shadow-sm",
        outline:
          "border border-[var(--border-2)] text-[var(--text-1)] hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)]",
        ghost:
          "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim)]",
        secondary:
          "bg-[var(--surface)] text-[var(--text-1)] border border-[var(--border)] hover:border-[var(--border-2)]",
        link:
          "h-auto px-0 py-0 text-[var(--accent)] hover:text-[var(--accent-bright)] underline underline-offset-4",
        destructive:
          "bg-[var(--danger)] text-white hover:opacity-90 border border-transparent",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-3 text-[12px]",
        lg:      "h-12 px-8 text-[15px]",
        xl:      "h-14 px-10 text-[16px]",
        icon:    "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
