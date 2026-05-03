"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { track, EVENTS } from "@/lib/analytics";

const STORAGE_KEY = "nyx:nps:v1";
const COOLDOWN_DAYS = 60;
const ELIGIBILITY_KEY = "nyx:nps:eligible";

interface NpsState { lastShownAt?: string; lastScore?: number; dismissedAt?: string; }

function readState(): NpsState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NpsState) : {};
  } catch { return {}; }
}
function writeState(s: NpsState) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

/**
 * Mark the visitor eligible to see the NPS prompt — call this from
 * surfaces where you want the request to fire (e.g. session completion).
 */
export function markNpsEligible() {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(ELIGIBILITY_KEY, String(Date.now())); } catch {}
}

export function NpsPrompt() {
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const eligible = window.localStorage.getItem(ELIGIBILITY_KEY);
    if (!eligible) return;

    const state = readState();
    const last = state.lastShownAt ? new Date(state.lastShownAt).getTime() : 0;
    if (Date.now() - last < COOLDOWN_DAYS * 24 * 3600 * 1000) return;

    const id = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(id);
  }, []);

  function dismiss() {
    setOpen(false);
    writeState({ ...readState(), lastShownAt: new Date().toISOString(), dismissedAt: new Date().toISOString() });
  }

  async function submit() {
    if (score == null) return;
    setSubmitting(true);
    track(EVENTS.NPS_SUBMITTED, { score, hasReason: Boolean(reason) });
    try {
      await fetch("/api/portal/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, reason: reason || undefined }),
      });
    } finally {
      writeState({ lastShownAt: new Date().toISOString(), lastScore: score });
      setOpen(false);
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="One quick question"
      className="fixed bottom-5 left-5 z-[110] max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_24px_48px_rgba(0,0,0,0.55)] p-5 animate-[slide-up-in_0.3s_var(--ease-out-soft)]"
    >
      <button
        aria-label="Dismiss survey"
        onClick={dismiss}
        className="absolute right-3 top-3 text-[var(--text-3)] hover:text-[var(--text-1)]"
      >
        <X size={14} />
      </button>
      <p className="text-[12px] text-[var(--accent)] uppercase tracking-wider font-semibold mb-1">One quick question</p>
      <p className="text-[14px] font-semibold text-[var(--text-1)] leading-snug">
        How likely are you to recommend Nyx to a friend?
      </p>
      <div className="mt-4 flex flex-wrap gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setScore(i)}
            aria-label={`Score ${i}`}
            className={cn(
              "w-7 h-7 rounded-md text-[12.5px] font-semibold transition-colors",
              score === i
                ? "bg-[var(--accent)] text-[var(--on-accent)]"
                : "bg-[var(--bg-2)] text-[var(--text-2)] hover:bg-[var(--accent-dim)] hover:text-[var(--accent)]",
            )}
          >
            {i}
          </button>
        ))}
      </div>
      {score != null && (
        <>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={score >= 9 ? "What worked best?" : score <= 6 ? "What would have to change?" : "Anything you want us to know?"}
            rows={2}
            className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40 resize-none"
          />
          <button
            onClick={submit}
            disabled={submitting}
            className="mt-3 w-full h-9 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[13px] disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Send"}
          </button>
        </>
      )}
    </div>
  );
}
