"use client";

import * as React from "react";
import {
  Timer, BookOpen, ChevronRight, ChevronLeft, ArrowLeft, GraduationCap,
  Sparkles, Target, ClipboardList, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Stimulus, Inline } from "@/components/practice/Passage";
import { PacingRunner } from "./PacingRunner";
import { SKILL_BY_KEY, type PublicRWQuestion, type RWDomain } from "@/lib/practice/types";
import type { StudentData, StudentSkill, StudentHomework } from "@/lib/practice/student-data";

const DOMAIN_ORDER: RWDomain[] = [
  "Craft and Structure",
  "Information and Ideas",
  "Standard English Conventions",
  "Expression of Ideas",
];

type View =
  | { kind: "home" }
  | { kind: "pacing"; moduleId: string }
  | { kind: "content"; skillKey: string }
  | { kind: "homework" };

export function StudentPortal({ data, displayName }: { data: StudentData; displayName: string }) {
  const [view, setView] = React.useState<View>({ kind: "home" });

  if (view.kind === "pacing") {
    const m = data.modules.find((x) => x.id === view.moduleId);
    if (!m) return null;
    return (
      <Shell>
        <PacingRunner
          slug={data.slug}
          moduleId={m.id}
          title={m.title}
          durationMin={m.durationMin}
          questions={m.questions}
          onExit={() => setView({ kind: "home" })}
        />
      </Shell>
    );
  }

  if (view.kind === "content") {
    const s = data.skills.find((x) => x.key === view.skillKey);
    if (!s) return null;
    return (
      <Shell>
        <SimpleRunner
          slug={data.slug}
          label={`${s.label}`}
          session={{ mode: "content", skill: s.key }}
          questions={s.questions}
          onExit={() => setView({ kind: "home" })}
        />
      </Shell>
    );
  }

  if (view.kind === "homework" && data.homework) {
    return (
      <Shell>
        <HomeworkView slug={data.slug} hw={data.homework} onExit={() => setView({ kind: "home" })} />
      </Shell>
    );
  }

  // ── Home ──
  const byDomain = (d: RWDomain) => data.skills.filter((s) => s.domain === d);

  return (
    <Shell>
      <header className="mb-8">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-[var(--accent)]">Reading &amp; Writing</p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-[30px] font-light leading-tight text-[var(--text-1)] sm:text-[36px]">
          Welcome, {displayName}.
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[var(--text-2)]">
          Hard Reading &amp; Writing practice, built for the climb from{" "}
          <span className="text-[var(--text-1)]">1500 to 1550+</span>. Pick a mode below. Talija sees your
          answers and works through them with you — so just focus on choosing your best answer.
        </p>
      </header>

      {data.homework && (
        <button
          onClick={() => setView({ kind: "homework" })}
          className="mb-7 flex w-full items-center gap-4 rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold-soft)]/10 p-5 text-left transition-colors hover:border-[var(--gold)]/70"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)]/15">
            <ClipboardList size={20} className="text-[var(--gold)]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[var(--text-1)]">Homework from Talija</p>
            <p className="text-[12.5px] text-[var(--text-2)]">
              {data.homework.questions.length} questions
              {data.homework.skills.length ? ` · ${data.homework.skills.map((s) => s.label).join(", ")}` : ""}
            </p>
          </div>
          <ChevronRight size={18} className="text-[var(--gold)]" />
        </button>
      )}

      {/* Timed modules */}
      <section className="mb-8">
        <SectionHead icon={<Timer size={15} />} title="Timed modules" sub="27 questions · 32 minutes · real test pace" />
        <div className="grid gap-3 sm:grid-cols-2">
          {data.modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setView({ kind: "pacing", moduleId: m.id })}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all hover:border-[var(--border-accent)] hover:bg-[var(--surface-elevated)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">Pacing</span>
                <Target size={15} className="text-[var(--text-3)] group-hover:text-[var(--accent)]" />
              </div>
              <p className="text-[15px] font-semibold text-[var(--text-1)]">{m.title}</p>
              <p className="mt-1 text-[12.5px] text-[var(--text-2)]">{m.questions.length} questions · {m.durationMin} min</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--accent)]">
                Start timed run <ChevronRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Practice by skill */}
      <section>
        <SectionHead icon={<BookOpen size={15} />} title="Practice by skill" sub="Untimed · focus on one skill at a time" />
        <div className="space-y-5">
          {DOMAIN_ORDER.map((domain) => {
            const skills = byDomain(domain);
            if (!skills.length) return null;
            return (
              <div key={domain}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-3)]">{domain}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {skills.map((s) => (
                    <SkillButton key={s.key} skill={s} onStart={() => setView({ kind: "content", skillKey: s.key })} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}

function SkillButton({ skill, onStart }: { skill: StudentSkill; onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      disabled={skill.count === 0}
      className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3.5 text-left transition-all hover:border-[var(--border-accent)] disabled:opacity-40"
    >
      <div className="flex-1">
        <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{skill.label}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-3)]">{skill.blurb}</p>
      </div>
      <span className="shrink-0 font-mono text-[11px] text-[var(--text-3)] group-hover:text-[var(--accent)]">{skill.count}</span>
    </button>
  );
}

function SectionHead({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">{icon}</span>
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--text-1)]">{title}</h2>
        <p className="text-[11.5px] text-[var(--text-3)]">{sub}</p>
      </div>
    </div>
  );
}

// ── Homework view ──
function HomeworkView({ slug, hw, onExit }: { slug: string; hw: StudentHomework; onExit: () => void }) {
  const [started, setStarted] = React.useState(false);
  const workedMap = React.useMemo(
    () => Object.fromEntries(hw.worked.map((w) => [w.id, w])),
    [hw.worked],
  );

  if (started) {
    return (
      <SimpleRunner
        slug={slug}
        label="Homework"
        session={{ mode: "content", moduleId: "homework" }}
        questions={hw.questions}
        worked={hw.includeWorked ? workedMap : undefined}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={onExit} className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-3)] hover:text-[var(--text-1)]">
        <ArrowLeft size={12} /> Menu
      </button>
      <div className="mb-6 flex items-center gap-3">
        <GraduationCap size={22} className="text-[var(--gold)]" />
        <h1 className="font-[family-name:var(--font-fraunces)] text-[26px] font-light text-[var(--text-1)]">Homework from Talija</h1>
      </div>

      {hw.note && (
        <div className="mb-6 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4 text-[13.5px] leading-relaxed text-[var(--text-1)]">
          {hw.note}
        </div>
      )}

      {hw.concepts.length > 0 && (
        <div className="mb-6 space-y-3">
          <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)]">
            <Lightbulb size={13} className="text-[var(--accent)]" /> How to approach these
          </p>
          {hw.concepts.map((c) => (
            <div key={c.key} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{c.label}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-2)]">{c.concept.whatItTests}</p>
              {c.concept.howToAttack.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {c.concept.howToAttack.map((step, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] text-[var(--text-2)]">
                      <span className="font-mono text-[var(--accent)]">{i + 1}.</span> {step}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <Button variant="primary" onClick={() => setStarted(true)} className="w-full">
        <Sparkles size={14} /> Start {hw.questions.length} questions
      </Button>
    </div>
  );
}

// ── Simple (untimed) runner for content + homework ──
interface WorkedSolution { id: string; choices: string[]; correct: number; rationale: string }

function SimpleRunner({
  slug,
  label,
  session,
  questions,
  worked,
  onExit,
}: {
  slug: string;
  label: string;
  session: { mode: "content"; skill?: string; moduleId?: string };
  questions: PublicRWQuestion[];
  worked?: Record<string, WorkedSolution>;
  onExit: () => void;
}) {
  const n = questions.length;
  const [idx, setIdx] = React.useState(0);
  const [picks, setPicks] = React.useState<(number | null)[]>(Array(n).fill(null));
  const [times, setTimes] = React.useState<number[]>(Array(n).fill(0));
  const [revealed, setRevealed] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const enteredAt = React.useRef<number>(Date.now());

  React.useEffect(() => { enteredAt.current = Date.now(); }, [idx]);

  if (n === 0) {
    return (
      <div className="mx-auto max-w-md pt-16 text-center text-[14px] text-[var(--text-2)]">
        No questions here yet.
        <div className="mt-4"><Button variant="outline" onClick={onExit}>Back</Button></div>
      </div>
    );
  }

  const q = questions[idx];
  const w = worked?.[q.id];
  const canReveal = Boolean(w) && picks[idx] !== null && !revealed;

  function recordTime() {
    setTimes((t) => t.map((v, j) => (j === idx ? v + (Date.now() - enteredAt.current) : v)));
  }

  function submitAll(finalPicks: (number | null)[], finalTimes: number[]) {
    setDone(true);
    const answers = questions.map((qq, i) => ({
      questionId: qq.id,
      picked: finalPicks[i],
      ms: Math.round(finalTimes[i] ?? 0),
      flagged: false,
    }));
    const payload = { mode: session.mode, skill: session.skill, moduleId: session.moduleId, answers, durationMs: finalTimes.reduce((a, b) => a + b, 0) };
    fetch(`/api/temp/${slug}/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* best effort */ });
  }

  function next() {
    setRevealed(false);
    const delta = Date.now() - enteredAt.current;
    const newTimes = times.map((v, j) => (j === idx ? v + delta : v));
    setTimes(newTimes);
    if (idx + 1 >= n) submitAll(picks, newTimes);
    else setIdx((i) => i + 1);
  }

  if (done) {
    const answered = picks.filter((p) => p !== null).length;
    return (
      <div className="mx-auto max-w-md pt-16 text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-[var(--success)]/25 bg-[var(--success-soft)]">
          <BookOpen size={24} className="text-[var(--success)]" />
        </div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-[24px] font-light text-[var(--text-1)]">Nice work.</h1>
        <p className="mt-2 text-[13.5px] text-[var(--text-2)]">
          You answered {answered} of {n}. Your responses are saved — Talija will review them with you.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onExit}><ArrowLeft size={13} /> Back to menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"><ArrowLeft size={16} /></button>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">{label}</p>
          <p className="text-[12px] text-[var(--text-2)]">{idx + 1} of {n}</p>
        </div>
        <span className="w-4" />
      </header>

      <div className="mb-4 flex h-1 overflow-hidden rounded-full bg-[var(--border-2)]">
        <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${((idx + 1) / n) * 100}%` }} />
      </div>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-3)]">{SKILL_BY_KEY[q.skill]?.label ?? q.skill}</p>
        <Stimulus text={q.passage} />
        <p className="mb-5 text-[15px] font-medium leading-relaxed text-[var(--text-1)]"><Inline text={q.prompt} /></p>

        <div className="flex flex-col gap-2.5">
          {q.choices.map((choice, i) => {
            const active = picks[idx] === i;
            const isKey = revealed && w && w.correct === i;
            const isWrongPick = revealed && w && active && w.correct !== i;
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setPicks((p) => p.map((v, j) => (j === idx ? i : v)))}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-all",
                  !revealed && active && "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--text-1)]",
                  !revealed && !active && "border-[var(--border)] bg-[var(--bg-2)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                  isKey && "border-[var(--success)]/60 bg-[var(--success-soft)] text-[var(--text-1)]",
                  isWrongPick && "border-[var(--danger)]/60 bg-[var(--danger-soft)] text-[var(--text-1)]",
                  revealed && !isKey && !isWrongPick && "border-[var(--border)] opacity-60",
                )}
              >
                <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold", active && !revealed ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-[var(--border-2)] text-[var(--text-2)]")}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {revealed && w && (
          <div className="mt-5 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4 text-[13px] leading-relaxed text-[var(--text-2)]">
            <span className="font-semibold text-[var(--accent)]">Worked answer ({String.fromCharCode(65 + w.correct)}): </span>
            {w.rationale}
          </div>
        )}
      </article>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" disabled={idx === 0} onClick={() => { recordTime(); setIdx((i) => Math.max(0, i - 1)); }}>
          <ChevronLeft size={14} /> Back
        </Button>
        {canReveal ? (
          <Button variant="default" onClick={() => { recordTime(); setRevealed(true); }}>Check answer</Button>
        ) : (
          <Button variant="primary" disabled={picks[idx] === null && !revealed} onClick={next}>
            {idx + 1 >= n ? "Finish" : "Next"} <ChevronRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Page shell ──
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:py-12">
      <div className="mx-auto mb-8 flex max-w-2xl items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--gold)]/40 text-[13px] text-[var(--gold)]">☾</span>
        <span className="font-[family-name:var(--font-fraunces)] text-[15px] tracking-wide text-[var(--text-1)]">Nyx Scholars</span>
      </div>
      {children}
    </main>
  );
}
