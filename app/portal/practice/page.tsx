"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Check, X, RotateCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";

interface Card {
  id: string;
  skill_id: string;
  prompt: string;
  answer: string;
  reps: number;
}

export default function PracticePage() {
  const { toast } = useToast();
  const [cards, setCards] = React.useState<Card[]>([]);
  const [revealed, setRevealed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [startedAt, setStartedAt] = React.useState<number>(Date.now());

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portal/srs", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards as Card[]);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    setStartedAt(Date.now());
    setRevealed(false);
  }, [cards.length]);

  const current = cards[0] ?? null;

  async function grade(g: 0 | 3 | 5) {
    if (!current) return;
    const ms = Date.now() - startedAt;
    const res = await fetch("/api/portal/srs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: current.id, grade: g, ms }),
    });
    if (!res.ok) {
      toast({ title: "Couldn't save your answer", variant: "error" });
      return;
    }
    setCards((c) => c.slice(1));
    setRevealed(false);
  }

  if (loading) {
    return <div className="max-w-xl mx-auto py-12 text-center text-[var(--text-3)] text-[13px]">Loading today&apos;s queue…</div>;
  }

  if (!current) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--success-soft)] border border-[var(--success)]/25 grid place-items-center mx-auto mb-5">
          <Inbox size={26} className="text-[var(--success)]" />
        </div>
        <h1 className="text-[24px] font-semibold text-[var(--text-1)] mb-2">All caught up.</h1>
        <p className="text-[var(--text-2)] text-[14px]">
          No cards are due right now. Come back tomorrow — or push more from a session recap.
        </p>
        <div className="mt-5 flex gap-2 justify-center">
          <Link href="/portal" className="px-4 py-2 rounded-xl border border-[var(--border)] text-[13px]">Back to dashboard</Link>
          <Link href="/portal/diagnostic" className="px-4 py-2 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] text-[var(--accent)]">Take the intake</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold">Daily 8 minutes</p>
          <h1 className="text-[24px] font-semibold text-[var(--text-1)] mt-0.5 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--accent)]" />
            Spaced practice
          </h1>
        </div>
        <p className="text-[12px] text-[var(--text-3)]">
          {cards.length} card{cards.length === 1 ? "" : "s"} left
        </p>
      </header>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 min-h-72 flex flex-col">
        <p className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] mb-3">{current.skill_id}</p>
        <p className="text-[18px] leading-relaxed text-[var(--text-1)] flex-1">{current.prompt}</p>

        {revealed ? (
          <>
            <div className="mt-6 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4">
              <p className="text-[12px] text-[var(--accent)] uppercase tracking-wider mb-2">Answer</p>
              <p className="text-[15px] text-[var(--text-1)] leading-relaxed">{current.answer}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 justify-end">
              <Button variant="outline" onClick={() => grade(0)} className="border-[var(--danger)]/40 text-[var(--danger)] hover:bg-[var(--danger-soft)]">
                <X size={14} /> Forgot
              </Button>
              <Button variant="outline" onClick={() => grade(3)} className="text-[var(--text-1)]">
                <RotateCw size={14} /> Hard
              </Button>
              <Button variant="primary" onClick={() => grade(5)}>
                <Check size={14} /> Easy
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="default"
            className="mt-6 self-end"
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </Button>
        )}
      </article>

      <p className={cn("mt-4 text-[11.5px] text-[var(--text-3)] text-center")}>
        Repeats: {current.reps}. Cards re-surface based on how easily you recall them.
      </p>
    </div>
  );
}
