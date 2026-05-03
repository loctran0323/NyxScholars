"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface ComboboxProps<T extends string = string> {
  options: ComboboxOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Accessible, keyboard-driven combobox built on plain divs + ARIA. Filters
 * options on `label` and `description` via case-insensitive substring match.
 */
export function Combobox<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Search…",
  emptyMessage = "No results.",
  disabled,
  className,
  ariaLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const listId = React.useId();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.description ?? "").toLowerCase().includes(q),
    );
  }, [options, query]);

  // Reset highlight when results or open state changes — derive-state-from-
  // props pattern (state pair, not useEffect/useRef).
  const nextResetKey = `${open}:${filtered.length}`;
  const [prevResetKey, setPrevResetKey] = React.useState(nextResetKey);
  if (prevResetKey !== nextResetKey) {
    setPrevResetKey(nextResetKey);
    setHighlight(0);
  }

  React.useEffect(() => {
    if (!open) return;
    function onClickAway(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClickAway);
    return () => window.removeEventListener("mousedown", onClickAway);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  function commit(opt: ComboboxOption<T>) {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && filtered[highlight]) {
      e.preventDefault();
      commit(filtered[highlight]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          setOpen((v) => !v);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="flex h-10 w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3.5 text-[14px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40 focus:border-[var(--gold-soft)]/40 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <span className={cn("truncate text-left", !selectedLabel && "text-[var(--text-3)]")}>
          {selectedLabel || placeholder}
        </span>
        <ChevronsUpDown size={14} className="text-[var(--text-3)] shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_18px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
            <Search size={13} className="text-[var(--text-3)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              aria-controls={listId}
              aria-autocomplete="list"
              className="w-full bg-transparent text-[13.5px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none"
            />
          </div>
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto p-1"
          >
            {filtered.length === 0 ? (
              <li role="presentation" className="px-3 py-3 text-[12.5px] text-[var(--text-3)]">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((opt, idx) => {
                const Icon = opt.icon;
                const selected = opt.value === value;
                const active = highlight === idx;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlight(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commit(opt);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors",
                      active ? "bg-[var(--accent-dim)] text-[var(--text-1)]" : "text-[var(--text-2)]",
                    )}
                  >
                    {Icon && <Icon size={14} className="text-[var(--text-3)] shrink-0" />}
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-[var(--text-1)]">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-[11.5px] text-[var(--text-3)] truncate">{opt.description}</span>
                      )}
                    </span>
                    {selected && <Check size={13} className="text-[var(--gold-soft)]" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
