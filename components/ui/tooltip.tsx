"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight, dependency-free tooltip. Anchored to the trigger via
 * absolute positioning. For richer needs (collision detection, sub-menus)
 * swap to @radix-ui/react-tooltip.
 *
 *   <Tooltip content="Tutor verified by Nyx">…</Tooltip>
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 350,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = React.useId();

  function show() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delayMs);
  }
  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={open ? id : undefined}
    >
      {children}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-[11.5px] font-medium text-[var(--text-1)] shadow-md",
            "animate-[fade-in_0.15s_var(--ease-out-soft)]",
            side === "top"    && "left-1/2 -translate-x-1/2 -top-1.5 -translate-y-full",
            side === "bottom" && "left-1/2 -translate-x-1/2 -bottom-1.5 translate-y-full",
            side === "left"   && "top-1/2 -translate-y-1/2 -left-1.5 -translate-x-full",
            side === "right"  && "top-1/2 -translate-y-1/2 -right-1.5 translate-x-full",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
