"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, CalendarPlus, Download } from "lucide-react";
import { buildIcs, downloadIcs } from "@/lib/calendar";
import type { Session } from "@/types/portal";

const SUBJECTS = ["All", "SAT Math", "SAT R&W", "ACT", "AP", "Admissions"];
const STATUSES: { id: Session["status"] | "all"; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "pending",   label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/**
 * Sessions list toolbar: search box, subject + status filters, bulk
 * "Export upcoming as .ics" download. Hides matching session cards via
 * `data-session-id` attributes that the parent renders.
 */
export function SessionsToolbar({ sessions }: { sessions: Session[] }) {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("All");
  const [status, setStatus] = useState<typeof STATUSES[number]["id"]>("all");

  const visible = useMemo(() => {
    const lq = q.trim().toLowerCase();
    return new Set(
      sessions
        .filter((s) => (subject === "All" ? true : s.subject.toLowerCase().includes(subject.toLowerCase())))
        .filter((s) => (status === "all" ? true : s.status === status))
        .filter((s) => {
          if (!lq) return true;
          return (
            s.subject.toLowerCase().includes(lq) ||
            (s.tutor_name ?? "").toLowerCase().includes(lq) ||
            (s.student_notes ?? "").toLowerCase().includes(lq)
          );
        })
        .map((s) => s.id)
    );
  }, [q, subject, status, sessions]);

  // Toggle visibility of session cards in the parent.
  useEffect(() => {
    const all = document.querySelectorAll<HTMLElement>("[data-session-id]");
    all.forEach((el) => {
      const id = el.dataset.sessionId!;
      el.style.display = visible.has(id) ? "" : "none";
    });
  }, [visible]);

  function exportUpcoming() {
    const upcoming = sessions.filter(
      (s) => new Date(s.scheduled_at).getTime() > Date.now() && s.status !== "cancelled"
    );
    if (!upcoming.length) return;
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nyx Scholars//Sessions//EN"];
    for (const s of upcoming) {
      const ics = buildIcs({
        uid: s.id,
        title: `Nyx · ${s.subject}`,
        description: s.tutor_name ? `1:1 session with ${s.tutor_name}` : "1:1 Nyx tutoring session",
        start: new Date(s.scheduled_at),
        durationMinutes: s.duration_minutes,
        url: s.meeting_link ?? undefined,
      });
      // Strip the wrapping VCALENDAR so we can concat events.
      const inner = ics
        .split("\r\n")
        .filter((l) => !["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nyx Scholars//Sessions//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "END:VCALENDAR"].includes(l))
        .join("\r\n");
      lines.push(inner);
    }
    lines.push("END:VCALENDAR");
    downloadIcs("nyx-upcoming-sessions", lines.join("\r\n"));
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 mb-5">
      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-2.5 items-center">
        <label className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject, tutor, notes…"
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[13.5px] text-[var(--text-1)] placeholder:text-[var(--text-3)]"
          />
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] px-3 text-[13.5px] text-[var(--text-1)]"
        >
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={exportUpcoming}
          className="h-10 px-3 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:border-[var(--border-2)] transition-colors"
        >
          <Download size={13} /> Export .ics
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <Filter size={11} className="text-[var(--text-3)] mr-1" />
        {STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatus(s.id)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors"
            style={{
              background: status === s.id ? "var(--accent-dim)" : "transparent",
              borderColor: status === s.id ? "var(--border-accent)" : "var(--border)",
              color: status === s.id ? "var(--accent)" : "var(--text-2)",
            }}
          >
            {s.label}
          </button>
        ))}
        <a
          href="/portal/schedule"
          className="ml-auto inline-flex items-center gap-1 text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
        >
          <CalendarPlus size={11} /> Schedule new
        </a>
      </div>
    </div>
  );
}
