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
      "peer h-[18px] w-[18px] shrink-0 rounded-md border border-white/[0.12] bg-[#0b0f1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#d4a853] data-[state=checked]:border-[#d4a853] transition-all cursor-pointer",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-black">
      <Check className="h-3 w-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };
