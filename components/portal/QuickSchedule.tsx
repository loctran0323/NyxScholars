"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, Sparkles, Check } from "lucide-react";

const SUBJECTS = ["SAT Math", "SAT R&W", "ACT", "AP", "Admissions"];

/**
 * One-click "next available slot" booking right on the dashboard, so the
 * student doesn't have to context-switch to /portal/schedule for the
 * common case. Falls through to the full scheduler for power users.
 *
 * Slots = next 3 weekday evenings at 7:30 PM local time (a sensible
 * starting heuristic — admin can confirm or shift in the back-office).
 */
export function QuickSchedule({ defaultSubject }: { defaultSubject?: string | null }) {
  const router = useRouter();
  const [subject, setSubject] = useState(defaultSubject ?? "SAT Math");
  const [picked, setPicked] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slots = useMemo(() => buildEveningSlots(3), []);

  async function book() {
    if (picked == null) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          scheduled_at: slots[picked].iso,
          duration_minutes: 60,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not book");
      } else {
        setDone(true);
        setTimeout(() => router.refresh(), 800);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border-accent)] rounded-2xl p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center">
          <Check size={15} className="text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[var(--text-1)]">Request submitted.</p>
          <p className="text-[12px] text-[var(--text-3)]">We&apos;ll confirm within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--accent)]" />
          <h2 className="font-semibold text-[var(--text-1)] text-[14.5px]">Quick book</h2>
        </div>
        <Link
          href="/portal/schedule"
          className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
        >
          Full scheduler →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-4">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] px-3 text-[13.5px] text-[var(--text-1)]"
        >
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          disabled={picked == null || submitting}
          onClick={book}
          className="h-10 px-4 rounded-lg bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] text-[13px] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          <CalendarPlus size={13} />
          {submitting ? "Booking…" : "Request"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {slots.map((s, i) => (
          <button
            key={s.iso}
            onClick={() => setPicked(i)}
            className="text-left rounded-lg p-3 transition-all border"
            style={{
              background: picked === i ? "rgba(125,211,252,0.10)" : "var(--bg-2)",
              borderColor: picked === i ? "var(--border-accent)" : "var(--border)",
              color: picked === i ? "var(--accent)" : "var(--text-1)",
            }}
          >
            <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[var(--text-3)]">{s.dayLabel}</p>
            <p className="text-[14px] font-semibold mt-0.5">{s.timeLabel}</p>
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-[12px] text-red-400">{error}</p>}
    </div>
  );
}

function buildEveningSlots(count: number): { iso: string; dayLabel: string; timeLabel: string }[] {
  const out: { iso: string; dayLabel: string; timeLabel: string }[] = [];
  const d = new Date();
  d.setSeconds(0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // weekdays only
    const slot = new Date(d);
    slot.setHours(19, 30, 0, 0);
    out.push({
      iso: slot.toISOString(),
      dayLabel: slot.toLocaleDateString(undefined, { weekday: "short" }),
      timeLabel: slot.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    });
  }
  return out;
}
