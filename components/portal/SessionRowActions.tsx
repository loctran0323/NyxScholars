"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, Video, Copy, Check } from "lucide-react";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import type { Session } from "@/types/portal";

/**
 * QoL row attached to every upcoming session: live countdown, "Join now"
 * button (enabled within ±15 min), .ics download, copy-link.
 */
export function SessionRowActions({ session }: { session: Session }) {
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const start = new Date(session.scheduled_at).getTime();
  const diff = start - now;
  const minsTo = Math.round(diff / 60_000);
  const inJoinWindow = Math.abs(minsTo) <= 15;
  const past = diff < -session.duration_minutes * 60_000;

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

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {!past && (
        <span
          className="font-mono text-[10.5px] uppercase tracking-[0.16em] px-2 py-1 rounded-md"
          style={{
            color: inJoinWindow ? "var(--accent)" : "var(--text-3)",
            background: inJoinWindow ? "var(--accent-dim)" : "transparent",
            border: `1px solid ${inJoinWindow ? "var(--border-accent)" : "var(--border)"}`,
          }}
        >
          {countdownLabel(minsTo)}
        </span>
      )}

      {session.meeting_link && inJoinWindow && (
        <a
          href={session.meeting_link}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] text-[12px] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] transition-colors"
        >
          <Video size={12} />
          Join now
        </a>
      )}

      {!past && (
        <button
          onClick={addToCalendar}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-2)] text-[12px] hover:border-[var(--border-2)] hover:text-[var(--text-1)] transition-colors"
        >
          <CalendarPlus size={12} />
          .ics
        </button>
      )}

      {session.meeting_link && (
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-2)] text-[12px] hover:border-[var(--border-2)] hover:text-[var(--text-1)] transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Link"}
        </button>
      )}
    </div>
  );
}

function countdownLabel(minsTo: number): string {
  if (minsTo > 60 * 24) return `In ${Math.round(minsTo / 60 / 24)}d`;
  if (minsTo > 60) return `In ${Math.round(minsTo / 60)}h`;
  if (minsTo >= 1) return `In ${minsTo}m`;
  if (minsTo >= -15) return "Live now";
  if (minsTo >= -120) return "Just ended";
  return "";
}
