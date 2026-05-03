"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[14px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] hover:bg-[#141a30] hover:border-[var(--accent)]",
        outline:
          "border border-white/10 text-[#c8d0de] hover:border-white/20 hover:bg-white/[0.04]",
        ghost: "text-[#8d9ab0] hover:text-[#f0ece3] hover:bg-white/[0.05]",
        secondary:
          "bg-[#0f1521] text-[#c8d0de] border border-white/[0.07] hover:border-white/[0.12]",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-[12px]",
        lg: "h-12 px-8 text-[15px]",
        xl: "h-14 px-10 text-[16px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
