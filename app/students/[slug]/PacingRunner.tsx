"use client";

import * as React from "react";
import { Clock, Flag, ChevronLeft, ChevronRight, ArrowLeft, Gauge, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Stimulus } from "@/components/practice/Passage";
import { SKILL_BY_KEY, type PublicRWQuestion } from "@/lib/practice/types";

interface SavedState {
  picks: (number | null)[];
  flags: boolean[];
  times: number[];
  startedAtMs: number;
}

export function PacingRunner({
  slug,
  moduleId,
  title,
  durationMin,
  questions,
  onExit,
}: {
  slug: string;
  moduleId: string;
  title: string;
  durationMin: number;
  questions: PublicRWQuestion[];
  onExit: () => void;
}) {
  const n = questions.length;
  const totalSeconds = durationMin * 60;
  const storageKey = `nyx:rwpace:${slug}:${moduleId}`;

  function loadSaved(): SavedState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as SavedState;
    } catch {
      return null;
    }
  }
  const initial = loadSaved();

  const [picks, setPicks] = React.useState<(number | null)[]>(
    initial?.picks?.length === n ? initial.picks : Array(n).fill(null),
  );
  const [flags, setFlags] = React.useState<boolean[]>(
    initial?.flags?.length === n ? initial.flags : Array(n).fill(false),
  );
  const [times, setTimes] = React.useState<number[]>(
    initial?.times?.length === n ? initial.times : Array(n).fill(0),
  );
  const startedAtRef = React.useRef<number>(initial?.startedAtMs ?? Date.now());

  const [idx, setIdx] = React.useState(0);
  const [reviewing, setReviewing] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(() => {
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
    return Math.max(0, totalSeconds - elapsed);
  });
  const [now, setNow] = React.useState(() => Date.now());

  // Per-question dwell tracking.
  const enteredAt = React.useRef<number>(Date.now());
  const prevIdx = React.useRef<number>(0);
  React.useEffect(() => {
    const t = Date.now();
    const delta = t - enteredAt.current;
    setTimes((arr) => {
      const c = [...arr];
      c[prevIdx.current] = (c[prevIdx.current] ?? 0) + delta;
      return c;
    });
    enteredAt.current = t;
    prevIdx.current = idx;
  }, [idx]);

  // Mirror live state so the timer's submit() never reads stale values.
  const stateRef = React.useRef({ picks, flags, times, secondsLeft });
  React.useEffect(() => {
    stateRef.current = { picks, flags, times, secondsLeft };
  });

  const submit = React.useCallback(() => {
    setSubmitted(true);
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(storageKey); } catch { /* ignore */ }
    }
    const s = stateRef.current;
    const finalTimes = [...s.times];
    finalTimes[prevIdx.current] = (finalTimes[prevIdx.current] ?? 0) + (Date.now() - enteredAt.current);
    const answers = questions.map((q, i) => ({
      questionId: q.id,
      picked: s.picks[i],
      ms: Math.round(finalTimes[i] ?? 0),
      flagged: Boolean(s.flags[i]),
    }));
    const payload = {
      mode: "pacing" as const,
      moduleId,
      answers,
      durationMs: (totalSeconds - s.secondsLeft) * 1000,
    };
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `nyx:rwresult:${slug}:${Date.now()}`,
          JSON.stringify(payload),
        );
      }
    } catch { /* ignore */ }
    fetch(`/api/temp/${slug}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* best effort — Arush's report renders regardless */ });
  }, [moduleId, questions, slug, storageKey, totalSeconds]);

  // Countdown.
  React.useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setNow(Date.now());
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
  }, [submitted, submit]);

  // Persist progress.
  React.useEffect(() => {
    if (submitted || typeof window === "undefined") return;
    try {
      const payload: SavedState = { picks, flags, times, startedAtMs: startedAtRef.current };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch { /* ignore */ }
  }, [picks, flags, times, submitted, storageKey]);

  function pick(choice: number) {
    setPicks((p) => p.map((v, j) => (j === idx ? choice : v)));
  }
  function toggleFlag() {
    setFlags((f) => f.map((v, j) => (j === idx ? !v : v)));
  }

  // ── Pace report (end screen) — no correctness shown ──
  if (submitted) {
    const answered = picks.filter((p) => p !== null).length;
    const flaggedCount = flags.filter(Boolean).length;
    const used = totalSeconds - secondsLeft;
    const avg = n ? Math.round(times.reduce((a, b) => a + b, 0) / 1000 / n) : 0;
    return (
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 text-center">
          <Gauge size={30} className="mx-auto mb-3 text-[var(--accent)]" />
          <h1 className="font-[family-name:var(--font-fraunces)] text-[28px] font-light text-[var(--text-1)]">
            Module complete
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-[var(--text-2)]">
            Your answers are saved for Talija — she&apos;ll go through them with you. Here&apos;s how your{" "}
            <span className="text-[var(--text-1)]">pacing</span> looked.
          </p>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <Stat label="Time used" value={fmt(used)} sub={`of ${fmt(totalSeconds)}`} />
          <Stat label="Answered" value={`${answered}/${n}`} sub={flaggedCount ? `${flaggedCount} flagged` : "none flagged"} />
          <Stat label="Avg / question" value={`${avg}s`} sub="≈71s target" />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--text-3)]">
            Time per question
          </p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {questions.map((q, i) => {
              const secs = Math.round((times[i] ?? 0) / 1000);
              const target = q.paceSeconds;
              const slow = secs > target * 1.4;
              const rushed = picks[i] !== null && secs > 0 && secs < target * 0.45;
              const skipped = picks[i] === null;
              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-[12px]"
                >
                  <span className="flex items-center gap-2 text-[var(--text-2)]">
                    <span className="font-mono text-[var(--text-3)]">Q{i + 1}</span>
                    <span className="text-[11px] text-[var(--text-3)]">{SKILL_BY_KEY[q.skill]?.label ?? q.skill}</span>
                    {flags[i] && <Flag size={11} className="text-[var(--gold)]" />}
                  </span>
                  <span
                    className={cn(
                      "font-mono",
                      skipped ? "text-[var(--danger)]" : slow ? "text-[var(--gold)]" : rushed ? "text-[var(--accent)]" : "text-[var(--text-2)]",
                    )}
                  >
                    {skipped ? "skipped" : `${secs}s`}
                    {!skipped && slow ? " · slow" : ""}
                    {!skipped && rushed ? " · fast" : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2 text-[13px] text-[var(--text-1)]"
          >
            <ArrowLeft size={13} /> Back to menu
          </button>
          <button
            onClick={() => {
              setPicks(Array(n).fill(null));
              setFlags(Array(n).fill(false));
              setTimes(Array(n).fill(0));
              startedAtRef.current = Date.now();
              enteredAt.current = Date.now();
              prevIdx.current = 0;
              setSecondsLeft(totalSeconds);
              setIdx(0);
              setReviewing(false);
              setSubmitted(false);
            }}
            className="rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] px-4 py-2 text-[13px] font-semibold text-[var(--accent)]"
          >
            Retake module
          </button>
        </div>
      </div>
    );
  }

  // ── Review screen ──
  if (reviewing) {
    const answered = picks.filter((p) => p !== null).length;
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 font-[family-name:var(--font-fraunces)] text-[24px] font-light text-[var(--text-1)]">Review before you submit</h1>
        <p className="mb-5 text-[13px] text-[var(--text-2)]">
          {answered}/{n} answered · {flags.filter(Boolean).length} flagged · {fmt(secondsLeft)} left
        </p>
        <div className="mb-6 grid grid-cols-6 gap-2 sm:grid-cols-9">
          {questions.map((q, i) => {
            const done = picks[i] !== null;
            return (
              <button
                key={q.id}
                onClick={() => { setIdx(i); setReviewing(false); }}
                className={cn(
                  "relative grid h-10 place-items-center rounded-lg border font-mono text-[12px]",
                  done
                    ? "border-[var(--border-accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-3)]",
                )}
              >
                {i + 1}
                {flags[i] && <Flag size={9} className="absolute right-1 top-1 text-[var(--gold)]" />}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setReviewing(false)}>
            <ChevronLeft size={14} /> Keep working
          </Button>
          <Button variant="primary" onClick={submit}>Submit module</Button>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  const q = questions[idx];
  const lowTime = secondsLeft < 300;
  const liveSecs = Math.round(((times[idx] ?? 0) + (now - enteredAt.current)) / 1000);
  const overPace = liveSecs > q.paceSeconds;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]">
          <ArrowLeft size={16} />
        </button>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">{title}</p>
          <p className="text-[12px] text-[var(--text-2)]">Question {idx + 1} of {n}</p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[12.5px]",
            lowTime ? "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]" : "border-[var(--border)] text-[var(--text-2)]",
          )}
        >
          <Clock size={12} /> {fmt(secondsLeft)}
        </div>
      </header>

      {/* progress + pace bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-1 flex-1 overflow-hidden rounded-full bg-[var(--border-2)]">
          <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${((idx + 1) / n) * 100}%` }} />
        </div>
        <span className={cn("font-mono text-[11px]", overPace ? "text-[var(--gold)]" : "text-[var(--text-3)]")}>
          {liveSecs}s / {q.paceSeconds}s
        </span>
      </div>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-3)]">
            {SKILL_BY_KEY[q.skill]?.label ?? q.skill}
          </span>
          <button
            onClick={toggleFlag}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11.5px] transition-colors",
              flags[idx]
                ? "border-[var(--gold)] bg-[var(--gold-soft)]/15 text-[var(--gold)]"
                : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-1)]",
            )}
          >
            <Flag size={11} /> {flags[idx] ? "Flagged" : "Flag"}
          </button>
        </div>

        <Stimulus text={q.passage} />
        <p className="mb-5 text-[15px] font-medium leading-relaxed text-[var(--text-1)]">{q.prompt}</p>

        <div className="flex flex-col gap-2.5">
          {q.choices.map((choice, i) => {
            const active = picks[idx] === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-all",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--text-1)]"
                    : "border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold",
                    active ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-[var(--border-2)] text-[var(--text-2)]",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>
      </article>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
          <ChevronLeft size={14} /> Back
        </Button>
        {idx < n - 1 ? (
          <Button variant="default" onClick={() => setIdx((i) => Math.min(n - 1, i + 1))}>
            Next <ChevronRight size={14} />
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setReviewing(true)}>
            <CheckCircle2 size={14} /> Review &amp; submit
          </Button>
        )}
      </div>

      {lowTime && (
        <p className="mt-4 text-center text-[12px] text-[var(--danger)]">
          Under 5 minutes left — answer your flagged questions.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-3)]">{label}</p>
      <p className="mt-1 text-[20px] font-semibold text-[var(--text-1)]">{value}</p>
      {sub && <p className="text-[10.5px] text-[var(--text-3)]">{sub}</p>}
    </div>
  );
}

function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
