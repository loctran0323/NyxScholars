"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, X, RotateCw, Inbox, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";
import { PortalHero } from "@/components/portal/PortalHero";
import { InfoBanner } from "@/components/portal/InfoBanner";
import { POOL, type BankQuestion } from "@/lib/diagnostic";

interface SrsCard {
  id: string;
  skill_id: string;
  prompt: string;
  answer: string;
  reps: number;
}

// ─── Skill Drill Mode ───────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SkillDrill({ skillId }: { skillId: string }) {
  const questions = React.useMemo(
    () => shuffle(POOL.filter((q) => q.skillId === skillId)),
    [skillId],
  );

  const [index, setIndex] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const q: BankQuestion | undefined = questions[index];
  const skillName = q?.skill ?? skillId;

  React.useEffect(() => {
    setPicked(null);
  }, [index]);

  function confirm() {
    if (picked === null || !q) return;
    const correct = picked === q.correct;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 800);
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--surface)] border border-[var(--border)] grid place-items-center mx-auto mb-5">
          <Inbox size={26} className="text-[var(--text-3)]" />
        </div>
        <h1 className="text-[22px] font-semibold text-[var(--text-1)] mb-2">No questions yet</h1>
        <p className="text-[var(--text-2)] text-[14px]">
          We don&apos;t have drill questions for <strong>{skillId}</strong> in the bank yet.
          Try the adaptive intake to build your sky first.
        </p>
        <div className="mt-5 flex gap-2 justify-center">
          <Link href="/portal/consultation" className="px-4 py-2 rounded-xl border border-[var(--border)] text-[13px]">Back to sky</Link>
          <Link href="/portal/diagnostic" className="px-4 py-2 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] text-[var(--accent)]">Take the intake</Link>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-[var(--text-3)] mb-4">DRILL COMPLETE · {skillName.toUpperCase()}</p>
        <div className="text-[56px] font-semibold text-[var(--text-1)] leading-none mb-2">{pct}%</div>
        <p className="text-[var(--text-2)] text-[14px] mb-8">
          {score} of {questions.length} correct
        </p>
        <div className="flex gap-2 justify-center">
          <Link href="/portal/consultation" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-[13px] text-[var(--text-1)]">
            <ArrowLeft size={13} /> Back to sky
          </Link>
          <button
            onClick={() => { setIndex(0); setScore(0); setDone(false); setPicked(null); }}
            className="px-4 py-2 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[13px] text-[var(--accent)]"
          >
            Drill again
          </button>
        </div>
      </div>
    );
  }

  const submitted = picked !== null;

  return (
    <div className="max-w-xl mx-auto">
      <InfoBanner tone="warn" className="mb-5">
        Expanded question bank is being prepped — the current pool is a hand-built
        starter set. New items roll in over the next few weeks.
      </InfoBanner>

      <div className="flex items-center gap-3 mb-6">
        <Link href="/portal/consultation" className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-[10px] font-mono tracking-[0.28em] text-[var(--text-3)]">SKILL DRILL · {skillName.toUpperCase()}</p>
          <p className="text-[12px] text-[var(--text-2)] mt-0.5">{index + 1} of {questions.length}</p>
        </div>
        <div className="ml-auto flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === index ? 18 : 6,
                background: i < index ? "var(--accent)" : i === index ? "var(--accent)" : "var(--border-2)",
                opacity: i < index ? 0.5 : 1,
              }}
            />
          ))}
        </div>
      </div>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col gap-6">
        <p className="text-[18px] leading-relaxed text-[var(--text-1)]">{q.prompt}</p>

        <div className="flex flex-col gap-2.5">
          {q.choices.map((choice, i) => {
            const isPicked = picked === i;
            const isCorrect = i === q.correct;
            const showResult = submitted;
            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setPicked(i)}
                className={cn(
                  "text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border text-[14px] transition-all",
                  !showResult && isPicked && "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--text-1)]",
                  !showResult && !isPicked && "border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                  showResult && isPicked && isCorrect && "border-green-500/50 bg-green-500/10 text-[var(--text-1)]",
                  showResult && isPicked && !isCorrect && "border-red-500/50 bg-red-500/10 text-[var(--text-1)]",
                  showResult && !isPicked && isCorrect && "border-green-500/30 bg-green-500/5 text-[var(--text-1)]",
                  showResult && !isPicked && !isCorrect && "border-[var(--border)] opacity-50 text-[var(--text-2)]",
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5 border",
                  isPicked ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border-2)] text-[var(--text-3)]",
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {q.rationale && submitted && (
          <div className="rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] px-4 py-3 text-[13px] text-[var(--text-2)] leading-relaxed">
            <span className="text-[var(--accent)] font-semibold">Why: </span>{q.rationale}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={picked === null}
            onClick={confirm}
            className="gap-1.5"
          >
            {submitted ? "Next" : "Confirm"} <ChevronRight size={14} />
          </Button>
        </div>
      </article>

      <p className="mt-3 text-center text-[11.5px] text-[var(--text-3)]">
        Score: {score} correct so far
      </p>
    </div>
  );
}

// ─── SRS Daily Review Mode ───────────────────────────────────────────────────

function SrsReview() {
  const { toast } = useToast();
  const [cards, setCards] = React.useState<SrsCard[]>([]);
  const [revealed, setRevealed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [startedAt, setStartedAt] = React.useState<number>(Date.now());

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portal/srs", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCards(data.cards as SrsCard[]);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);
  React.useEffect(() => { setStartedAt(Date.now()); setRevealed(false); }, [cards.length]);

  const current = cards[0] ?? null;

  async function grade(g: 0 | 3 | 5) {
    if (!current) return;
    const ms = Date.now() - startedAt;
    const res = await fetch("/api/portal/srs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_id: current.id, grade: g, ms }),
    });
    if (!res.ok) { toast({ title: "Couldn't save your answer", variant: "error" }); return; }
    setCards((c) => c.slice(1));
    setRevealed(false);
  }

  if (loading) return <div className="max-w-xl mx-auto py-12 text-center text-[var(--text-3)] text-[13px]">Loading today&apos;s queue…</div>;

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
      <PortalHero
        eyebrow="Daily 8 minutes"
        title="Spaced practice"
        italic="re-surface what slipped"
        actions={
          <span className="text-[11.5px] font-mono uppercase tracking-[0.18em] text-[var(--text-3)]">
            {cards.length} card{cards.length === 1 ? "" : "s"} left
          </span>
        }
      />
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
          <Button variant="default" className="mt-6 self-end" onClick={() => setRevealed(true)}>
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const searchParams = useSearchParams();
  const skillId = searchParams.get("skill");

  if (skillId) return <SkillDrill skillId={skillId} />;
  return <SrsReview />;
}
