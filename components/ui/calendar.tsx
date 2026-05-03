"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  value?: Date | null;
  onChange?: (d: Date) => void;
  /** Hide cells before this date. */
  minDate?: Date;
  /** Hide cells after this date. */
  maxDate?: Date;
  /** Cells matching this predicate render disabled. */
  disabled?: (d: Date) => boolean;
  /** Highlight cells matching this predicate (e.g. has availability). */
  highlight?: (d: Date) => boolean;
  className?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  highlight,
  className,
}: CalendarProps) {
  // Cursor follows `value` when the controlled prop changes, but the user
  // can navigate months independently. React-recommended derive-state-from-
  // props pattern (state pair, not useEffect): see
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [cursor, setCursor] = React.useState<Date>(value ?? new Date());
  const [prevValue, setPrevValue] = React.useState<Date | null>(value ?? null);
  if (value && value !== prevValue) {
    setPrevValue(value);
    setCursor(value);
  }

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let d = gridStart;
  while (d <= gridEnd) {
    days.push(d);
    d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
  }

  function isDisabled(day: Date): boolean {
    if (minDate && day < startOfDayOnly(minDate)) return true;
    if (maxDate && day > endOfDayOnly(maxDate)) return true;
    if (disabled?.(day)) return true;
    return false;
  }

  return (
    <div className={cn("rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 select-none w-full max-w-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor((c) => subMonths(c, 1))}
          className="w-8 h-8 grid place-items-center rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim)] transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <p className="text-[13.5px] font-semibold text-[var(--text-1)]">
          {format(cursor, "MMMM yyyy")}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          className="w-8 h-8 grid place-items-center rounded-lg text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim)] transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {WEEKDAYS.map((w, i) => (
          <span
            key={`${w}-${i}`}
            aria-hidden
            className="text-center text-[10.5px] font-semibold uppercase tracking-wider text-[var(--text-3)]"
          >
            {w}
          </span>
        ))}
      </div>
      <div role="grid" className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, cursor);
          const isSelected = value ? isSameDay(day, value) : false;
          const today = isToday(day);
          const dis = isDisabled(day);
          const hl = !dis && highlight?.(day);
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-disabled={dis}
              disabled={dis}
              onClick={() => onChange?.(day)}
              className={cn(
                "h-9 rounded-lg text-[12.5px] font-medium transition-colors relative",
                !inMonth && "text-[var(--text-3)] opacity-50",
                inMonth && "text-[var(--text-1)]",
                today && !isSelected && "ring-1 ring-[var(--border-accent)]",
                isSelected && "bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold",
                !isSelected && hl && "bg-[var(--accent-dim)] text-[var(--accent)]",
                !dis && !isSelected && "hover:bg-[var(--accent-dim)] hover:text-[var(--text-1)]",
                dis && "text-[var(--text-3)] cursor-not-allowed line-through opacity-40",
              )}
            >
              {format(day, "d")}
              {hl && !isSelected && <span aria-hidden className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function startOfDayOnly(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDayOnly(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
