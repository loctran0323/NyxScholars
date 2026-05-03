"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/system/Toast";

export interface QueueSuggestion {
  tutor_id: string;
  tutor_profile_id: string;
  tutor_name: string;
  headline: string | null;
  subjects: string[];
  reasons: string[];
}

export interface QueueRow {
  student: {
    id: string;
    name: string;
    email: string;
    target_test: "sat" | "act";
    target_score: string | null;
    weak_skills: string[];
    waiting_days: number;
  };
  suggestions: QueueSuggestion[];
}

export function MatchQueueClient({ initialQueue }: { initialQueue: QueueRow[] }) {
  const { toast } = useToast();
  const [queue, setQueue] = React.useState<QueueRow[]>(initialQueue);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function assign(studentId: string, tutorProfileId: string) {
    setBusy(`${studentId}:${tutorProfileId}`);
    const res = await fetch("/api/admin/match-queue/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, tutor_profile_id: tutorProfileId }),
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Couldn't assign", description: data.error ?? "—", variant: "error" });
      return;
    }
    setQueue((q) => q.filter((row) => row.student.id !== studentId));
    toast({ title: "Assigned", variant: "success", durationMs: 1500 });
  }

  if (queue.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-[var(--text-3)] text-[13px]">
        Queue is empty — every student with a completed diagnostic already has an active tutor.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {queue.map((row) => (
        <li
          key={row.student.id}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <header className="flex items-start justify-between gap-3 mb-4 flex-wrap">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-1)]">{row.student.name}</p>
              <p className="text-[12px] text-[var(--text-3)]">
                {row.student.email} · target {row.student.target_test.toUpperCase()}
                {row.student.target_score ? ` · ${row.student.target_score}` : ""}
                {" · waiting "}
                {row.student.waiting_days}d
              </p>
              {row.student.weak_skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {row.student.weak_skills.slice(0, 5).map((s) => (
                    <Badge key={s} variant="default">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </header>

          <ol className="space-y-2">
            {row.suggestions.length === 0 ? (
              <li className="text-[13px] text-[var(--text-3)] italic">
                No active tutors match this student&apos;s target test. Add a tutor from /admin/tutors.
              </li>
            ) : (
              row.suggestions.map((s, i) => (
                <li
                  key={s.tutor_id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 py-3 flex-wrap"
                >
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--text-1)]">
                      <span className="text-[var(--text-3)] mr-2 font-mono text-[11px]">#{i + 1}</span>
                      {s.tutor_name}
                    </p>
                    {s.headline && (
                      <p className="text-[12px] text-[var(--text-2)]">{s.headline}</p>
                    )}
                    <p className="text-[11.5px] text-[var(--text-3)] mt-1">
                      {s.reasons.join(" · ")}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={busy === `${row.student.id}:${s.tutor_profile_id}`}
                    onClick={() => assign(row.student.id, s.tutor_profile_id)}
                  >
                    Assign
                  </Button>
                </li>
              ))
            )}
          </ol>
        </li>
      ))}
    </ul>
  );
}
