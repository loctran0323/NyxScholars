"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-[18px] w-[18px] shrink-0 rounded-md border border-[var(--border-2)] bg-[var(--bg-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)]/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--gold-soft)] data-[state=checked]:border-[var(--gold-soft)] transition-colors cursor-pointer",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--on-gold)]">
      <Check className="h-3 w-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };
