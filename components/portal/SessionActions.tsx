"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  Copy,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import type { Session } from "@/types/portal";

/**
 * Session-detail page action bar:
 *   • Add to calendar (.ics)
 *   • Copy meeting link
 *   • Reschedule (deep-link into /portal/schedule with prefill)
 *   • Cancel (with confirm, calls PATCH /api/portal/sessions)
 */
export function SessionActions({ session }: { session: Session }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const cancellable =
    session.status !== "cancelled" &&
    session.status !== "completed" &&
    new Date(session.scheduled_at).getTime() - Date.now() > 12 * 60 * 60 * 1000;

  function addToCalendar() {
    const ics = buildIcs({
      uid: session.id,
      title: `Nyx · ${session.subject}`,
      description: session.tutor_name
        ? `1:1 session with ${session.tutor_name}`
        : "1:1 Nyx tutoring session",
      start: new Date(session.scheduled_at),
      durationMinutes: session.duration_minutes,
      url: session.meeting_link ?? undefined,
    });
    downloadIcs(`nyx-${session.subject.toLowerCase().replace(/\s+/g, "-")}`, ics);
  }

  async function copyLink() {
    if (!session.meeting_link) return;
    try {
      await navigator.clipboard.writeText(session.meeting_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {/* ignore */}
  }

  async function cancel() {
    setError(null);
    start(async () => {
      const res = await fetch("/api/portal/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, status: "cancelled" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not cancel.");
        return;
      }
      router.refresh();
      setConfirmCancel(false);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={addToCalendar}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-medium hover:border-[var(--border-2)] transition-colors"
      >
        <CalendarPlus size={13} />
        Add to calendar
      </button>

      {session.meeting_link && (
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-medium hover:border-[var(--border-2)] transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      )}

      {cancellable && (
        <a
          href={`/portal/schedule?reschedule=${session.id}&subject=${encodeURIComponent(session.subject)}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-medium hover:border-[var(--border-2)] transition-colors"
        >
          <RotateCcw size={13} />
          Reschedule
        </a>
      )}

      {cancellable && (
        confirmCancel ? (
          <span className="inline-flex items-center gap-2 ml-auto">
            <span className="text-[12px] text-[var(--text-2)]">Are you sure?</span>
            <button
              onClick={cancel}
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-400/40 text-red-300 text-[12.5px] font-semibold hover:bg-red-500/15 transition-colors disabled:opacity-50"
            >
              {pending ? "Cancelling…" : "Yes, cancel"}
            </button>
            <button
              onClick={() => setConfirmCancel(false)}
              className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
            >
              Keep it
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmCancel(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-red-300/80 text-[12.5px] font-medium hover:border-red-400/40 hover:text-red-300 transition-colors ml-auto"
          >
            <X size={13} />
            Cancel session
          </button>
        )
      )}

      {error && <p className="basis-full text-[12px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
