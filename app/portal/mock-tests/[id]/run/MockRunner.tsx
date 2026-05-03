"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";

interface MockQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  rationale?: string;
}

const STORAGE_PREFIX = "nyx:mock:";

export function MockRunner({
  mockId,
  title,
  questions,
  durationMin,
}: {
  mockId: string;
  title: string;
  questions: MockQuestion[];
  durationMin: number;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const storageKey = `${STORAGE_PREFIX}${mockId}`;
  const totalSeconds = durationMin * 60;

  // Persist both the picks AND the start time so the timer survives a
  // refresh — students don't get a free reset by reloading.
  interface SavedState { picks: (number | null)[]; startedAtMs: number }
  function loadSaved(): SavedState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Back-compat with the old shape (just the picks array).
      if (Array.isArray(parsed)) return { picks: parsed as (number | null)[], startedAtMs: Date.now() };
      return parsed as SavedState;
    } catch {
      return null;
    }
  }
  const initial = loadSaved();
  const [picks, setPicks] = React.useState<(number | null)[]>(initial?.picks ?? Array(questions.length).fill(null));
  const startedAtRef = React.useRef<number>(initial?.startedAtMs ?? Date.now());
  const [idx, setIdx] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(() => {
    if (!initial) return totalSeconds;
    const elapsed = Math.floor((Date.now() - initial.startedAtMs) / 1000);
    return Math.max(0, totalSeconds - elapsed);
  });

  React.useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          submit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload: SavedState = { picks, startedAtMs: startedAtRef.current };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch { /* ignore */ }
  }, [picks, storageKey]);

  function pick(i: number) {
    setPicks((p) => p.map((v, j) => (j === idx ? i : v)));
  }

  function submit() {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(storageKey); } catch { /* ignore */ }
    }
    toast({ title: "Submitted", variant: "success", durationMs: 1800 });
  }

  if (submitted) {
    const correct = picks.filter((p, i) => p === questions[i].correctIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 text-center">
          <Trophy size={32} className="text-[var(--success)] mx-auto mb-3" />
          <h1 className="text-[28px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)]">
            {correct}/{questions.length} correct
          </h1>
          <p className="text-[13.5px] text-[var(--text-2)] mt-1">{pct}% on this mock — review every miss below.</p>
        </header>
        <ul className="space-y-3 mb-6">
          {questions.map((q, i) => {
            const wasCorrect = picks[i] === q.correctIndex;
            return (
              <li key={q.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold",
                    wasCorrect ? "bg-[var(--success)] text-[var(--on-gold)]" : "bg-[var(--danger)] text-white",
                  )}>{wasCorrect ? "✓" : "✕"}</span>
                  <p className="text-[12.5px] uppercase tracking-wider text-[var(--text-3)]">Q{i + 1}</p>
                </div>
                <p className="text-[14px] text-[var(--text-1)] mb-2">{q.prompt}</p>
                <p className="text-[12.5px] text-[var(--text-2)]">
                  Correct: <span className="text-[var(--success)] font-semibold">{q.choices[q.correctIndex]}</span>
                </p>
                {q.rationale && (
                  <p className="text-[12.5px] text-[var(--text-3)] mt-1.5 italic">{q.rationale}</p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex justify-center gap-2">
          <Link href="/portal/mock-tests" className="px-4 py-2 rounded-xl border border-[var(--border)] text-[13px] font-semibold text-[var(--text-1)]">
            Back to mocks
          </Link>
          <Link href="/portal/practice" className="px-4 py-2 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] font-semibold text-[var(--accent)]">
            Review missed concepts
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const lowTime = secondsLeft < 300;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] font-semibold">{title}</p>
          <p className="text-[13px] text-[var(--text-2)] mt-0.5">Question {idx + 1} of {questions.length}</p>
        </div>
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12.5px] font-mono",
          lowTime ? "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]" : "border-[var(--border)] text-[var(--text-2)]",
        )}>
          <Clock size={12} />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-5">
        <p className="text-[15px] text-[var(--text-1)] leading-relaxed">{q.prompt}</p>
        <div className="mt-5 space-y-2">
          {q.choices.map((c, i) => {
            const active = picks[idx] === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-start gap-3",
                  active
                    ? "bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--text-1)]"
                    : "bg-[var(--bg-2)] border-[var(--border)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                )}
              >
                <span className={cn(
                  "w-6 h-6 rounded-full border grid place-items-center text-[11px] font-bold shrink-0 mt-0.5",
                  active ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-[var(--border-2)] text-[var(--text-2)]",
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[14px]">{c}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
          <ChevronLeft size={14} /> Back
        </Button>
        <p className="text-[11.5px] text-[var(--text-3)]">Auto-saved as you go</p>
        {idx < questions.length - 1 ? (
          <Button variant="default" onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}>
            Next <ChevronRight size={14} />
          </Button>
        ) : (
          <Button variant="primary" onClick={submit}>
            Submit mock
          </Button>
        )}
      </div>

      {lowTime && (
        <p className="text-[12px] text-[var(--danger)] text-center mt-4 inline-flex items-center gap-1.5 justify-center">
          <AlertCircle size={12} /> Less than 5 minutes left — wrap any open question soon.
        </p>
      )}
    </div>
  );
}
