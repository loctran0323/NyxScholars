"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";

interface Question {
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale?: string;
}

interface HomeworkRow {
  id: string;
  title: string;
  body: string | null;
  questions: Question[];
  results: { picked_index: number; correct: boolean }[] | null;
  completed_at: string | null;
}

export function HomeworkRunner({ homework }: { homework: HomeworkRow }) {
  const { toast } = useToast();
  const [picks, setPicks] = React.useState<number[]>(() => homework.results?.map((r) => r.picked_index) ?? []);
  const [idx, setIdx] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(!!homework.completed_at);
  const [submitting, setSubmitting] = React.useState(false);
  const startedRef = React.useRef<number>(Date.now());

  const total = homework.questions.length;
  const q = homework.questions[idx];

  function pick(i: number) {
    setPicks((p) => {
      const next = [...p];
      next[idx] = i;
      return next;
    });
  }

  function next() { setIdx((i) => Math.min(total - 1, i + 1)); startedRef.current = Date.now(); }
  function back() { setIdx((i) => Math.max(0, i - 1)); startedRef.current = Date.now(); }

  async function submit() {
    if (picks.length < total || picks.some((p) => p == null)) {
      toast({ title: "Answer every question first.", variant: "warning" });
      return;
    }
    setSubmitting(true);
    const results = picks.map((p, i) => ({
      picked_index: p,
      correct:      p === homework.questions[i].correct_index,
      ms:           Date.now() - startedRef.current,
    }));
    const res = await fetch("/api/portal/homework", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homework_id: homework.id, results }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast({ title: "Couldn't submit. Try again.", variant: "error" });
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    const correct = picks.filter((p, i) => p === homework.questions[i].correct_index).length;
    return (
      <div className="max-w-2xl mx-auto pt-4">
        <header className="mb-6">
          <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold">Homework</p>
          <h1 className="text-[26px] font-semibold text-[var(--text-1)] mt-1">{homework.title}</h1>
        </header>
        <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success-soft)] p-6 mb-6 text-center">
          <CheckCircle2 size={28} className="text-[var(--success)] mx-auto mb-2" />
          <p className="text-[15px] font-semibold text-[var(--text-1)]">
            {correct}/{total} correct
          </p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-1">
            We've sent your results to your tutor and added the missed concepts to your spaced-repetition queue.
          </p>
        </div>
        <ul className="space-y-3">
          {homework.questions.map((qi, i) => {
            const wasCorrect = picks[i] === qi.correct_index;
            return (
              <li key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold",
                    wasCorrect ? "bg-[var(--success)] text-[var(--on-gold)]" : "bg-[var(--danger)] text-white",
                  )}>{wasCorrect ? "✓" : "✕"}</span>
                  <p className="text-[12.5px] uppercase tracking-wider text-[var(--text-3)]">Question {i + 1}</p>
                </div>
                <p className="text-[14px] text-[var(--text-1)] mb-3">{qi.prompt}</p>
                {qi.rationale && (
                  <p className="text-[12.5px] text-[var(--text-2)] leading-relaxed">
                    <strong className="text-[var(--text-1)]">Why:</strong> {qi.rationale}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-center">
          <Link href="/portal/homework" className="px-4 py-2 rounded-xl border border-[var(--border)] text-[13px]">Back to homework</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-4">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold">Homework · {idx + 1}/{total}</p>
        <h1 className="text-[24px] font-semibold text-[var(--text-1)] mt-1">{homework.title}</h1>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
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

      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={idx === 0}>
          <ChevronLeft size={14} /> Back
        </Button>
        {idx < total - 1 ? (
          <Button variant="default" onClick={next} disabled={picks[idx] == null}>
            Next <ChevronRight size={14} />
          </Button>
        ) : (
          <Button variant="primary" loading={submitting} onClick={submit}>
            Submit set
          </Button>
        )}
      </div>
    </div>
  );
}
