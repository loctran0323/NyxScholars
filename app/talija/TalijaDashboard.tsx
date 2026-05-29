"use client";

import * as React from "react";
import {
  RefreshCw, ChevronDown, CheckCircle2, XCircle, Clock, ClipboardList,
  BookOpen, Activity, Flag, Send, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/system/Toast";
import { Passage } from "@/components/practice/Passage";
import type { TalijaBank } from "@/lib/practice/talija-data";

const LETTER = (i: number) => String.fromCharCode(65 + i);

interface ResultAnswer {
  questionId: string;
  picked: number | null;
  ms: number;
  flagged: boolean;
  skill: string | null;
  difficulty: number | null;
  passage: string;
  prompt: string;
  choices: string[];
  correct: number | null;
  rationale: string;
  isCorrect: boolean;
}
interface ResultSession {
  id: string;
  mode: string;
  moduleId: string | null;
  skill: string | null;
  total: number;
  correctCount: number;
  durationMs: number | null;
  createdAt: string;
  answers: ResultAnswer[];
}

export function TalijaDashboard({ slug, bank }: { slug: string; bank: TalijaBank }) {
  const [tab, setTab] = React.useState<"results" | "bank">("results");

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--gold)]/40 text-[13px] text-[var(--gold)]">☾</span>
            <div>
              <p className="font-[family-name:var(--font-fraunces)] text-[15px] text-[var(--text-1)]">Nyx · Tutor view</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-3)]">Talija · student: {slug}</p>
            </div>
          </div>
          <div className="flex rounded-xl border border-[var(--border)] p-1">
            <TabButton active={tab === "results"} onClick={() => setTab("results")} icon={<Activity size={13} />}>Results</TabButton>
            <TabButton active={tab === "bank"} onClick={() => setTab("bank")} icon={<BookOpen size={13} />}>Question bank</TabButton>
          </div>
        </header>

        {tab === "results" ? <ResultsTab slug={slug} bank={bank} /> : <BankTab bank={bank} />}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
        active ? "bg-[var(--accent-dim)] text-[var(--accent)]" : "text-[var(--text-3)] hover:text-[var(--text-1)]",
      )}
    >
      {icon} {children}
    </button>
  );
}

// ── Results tab ──
function ResultsTab({ slug, bank }: { slug: string; bank: TalijaBank }) {
  const [sessions, setSessions] = React.useState<ResultSession[]>([]);
  const [configured, setConfigured] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const r = await fetch(`/api/temp/${slug}/results`, { cache: "no-store" });
      if (!r.ok) { setLoading(false); return; }
      const data = await r.json();
      setConfigured(Boolean(data.configured));
      setSessions((data.results ?? []) as ResultSession[]);
    } catch { /* ignore */ }
    setLoading(false);
  }, [slug]);

  React.useEffect(() => {
    load();
    const id = setInterval(load, 12000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div>
      <AssignHomework slug={slug} bank={bank} />

      <div className="mb-3 mt-6 flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)]">
          {slug}&apos;s sessions {sessions.length ? `· ${sessions.length}` : ""}
        </p>
        <button onClick={() => { setLoading(true); load(); }} className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)]">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {!configured && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)]/10 p-4 text-[12.5px] text-[var(--text-2)]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--gold)]" />
          <span>
            Result syncing isn&apos;t active yet — run <code className="rounded bg-[var(--bg-2)] px-1 text-[var(--text-1)]">supabase-temp-practice-schema.sql</code> in Supabase.
            You can still watch Arush&apos;s screen and use the question bank below.
          </span>
        </div>
      )}

      {loading && sessions.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[var(--text-3)]">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[var(--text-3)]">No sessions yet. They&apos;ll appear here the moment Arush submits one.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} s={s} open={open === s.id} onToggle={() => setOpen(open === s.id ? null : s.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ s, open, onToggle }: { s: ResultSession; open: boolean; onToggle: () => void }) {
  const pct = s.total ? Math.round((s.correctCount / s.total) * 100) : 0;
  const when = safeDate(s.createdAt);
  const kind = s.moduleId === "homework" ? "Homework" : s.mode === "pacing" ? "Timed module" : "Skill practice";
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[13px] font-bold", pct >= 80 ? "bg-[var(--success-soft)] text-[var(--success)]" : pct >= 60 ? "bg-[var(--gold-soft)]/20 text-[var(--gold)]" : "bg-[var(--danger-soft)] text-[var(--danger)]")}>
          {pct}%
        </div>
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{kind} · {s.correctCount}/{s.total}</p>
          <p className="text-[11.5px] text-[var(--text-3)]">
            {when}{s.durationMs ? ` · ${Math.round(s.durationMs / 60000)} min` : ""}
          </p>
        </div>
        <ChevronDown size={16} className={cn("text-[var(--text-3)] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-[var(--border)] p-4">
          {s.answers.map((a, i) => (
            <div key={a.questionId} className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-4">
              <div className="mb-2 flex items-center gap-2">
                {a.picked === null ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[var(--danger-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--danger)]">skipped</span>
                ) : a.isCorrect ? (
                  <CheckCircle2 size={15} className="text-[var(--success)]" />
                ) : (
                  <XCircle size={15} className="text-[var(--danger)]" />
                )}
                <span className="font-mono text-[11px] text-[var(--text-3)]">Q{i + 1} · {a.skill ?? "—"} · d{a.difficulty ?? "?"}</span>
                {a.flagged && <Flag size={11} className="text-[var(--gold)]" />}
                <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-3)]"><Clock size={10} />{Math.round(a.ms / 1000)}s</span>
              </div>
              <Passage text={a.passage} className="mb-2" />
              <p className="mb-2 text-[13.5px] font-medium text-[var(--text-1)]">{a.prompt}</p>
              <div className="space-y-1.5">
                {a.choices.map((c, ci) => {
                  const isKey = a.correct === ci;
                  const isPick = a.picked === ci;
                  return (
                    <div key={ci} className={cn(
                      "flex items-start gap-2 rounded-lg border px-3 py-2 text-[12.5px]",
                      isKey && "border-[var(--success)]/50 bg-[var(--success-soft)] text-[var(--text-1)]",
                      isPick && !isKey && "border-[var(--danger)]/50 bg-[var(--danger-soft)] text-[var(--text-1)]",
                      !isKey && !isPick && "border-[var(--border)] text-[var(--text-2)]",
                    )}>
                      <span className="font-mono font-bold">{LETTER(ci)}</span>
                      <span className="flex-1">{c}</span>
                      {isKey && <span className="font-mono text-[10px] text-[var(--success)]">KEY</span>}
                      {isPick && !isKey && <span className="font-mono text-[10px] text-[var(--danger)]">PICKED</span>}
                    </div>
                  );
                })}
              </div>
              {a.rationale && (
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-3)]"><span className="font-semibold text-[var(--accent)]">Why: </span>{a.rationale}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Homework assigner ──
function AssignHomework({ slug, bank }: { slug: string; bank: TalijaBank }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [count, setCount] = React.useState(12);
  const [includeWorked, setIncludeWorked] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function toggle(key: string) {
    setSelected((s) => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }

  async function assign() {
    setBusy(true);
    try {
      const r = await fetch(`/api/temp/${slug}/homework`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: [...selected], count, includeWorked, note }),
      });
      const data = await r.json();
      if (r.ok && data.ok) {
        toast({ title: `Homework assigned (${data.assigned} questions)`, variant: "success" });
        setOpen(false); setNote(""); setSelected(new Set());
      } else {
        toast({ title: data.reason === "not-configured" ? "Run the Supabase migration to enable homework" : "Couldn't assign homework", variant: "error" });
      }
    } catch {
      toast({ title: "Couldn't assign homework", variant: "error" });
    }
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)]/15 text-[var(--gold)]"><ClipboardList size={17} /></div>
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Assign homework</p>
          <p className="text-[11.5px] text-[var(--text-3)]">Push a question set to {slug}&apos;s portal</p>
        </div>
        <ChevronDown size={16} className={cn("text-[var(--text-3)] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--border)] p-4">
          <div>
            <p className="mb-2 text-[12px] text-[var(--text-2)]">Skills <span className="text-[var(--text-3)]">(none selected = all)</span></p>
            <div className="flex flex-wrap gap-1.5">
              {bank.skills.map((s) => (
                <button
                  key={s.key}
                  onClick={() => toggle(s.key)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11.5px] transition-colors",
                    selected.has(s.key) ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)]",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[12.5px] text-[var(--text-2)]">
              Questions
              <input type="number" min={4} max={40} value={count} onChange={(e) => setCount(Math.max(4, Math.min(40, Number(e.target.value) || 12)))}
                className="h-9 w-16 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-2 text-center text-[var(--text-1)]" />
            </label>
            <label className="flex items-center gap-2 text-[12.5px] text-[var(--text-2)]">
              <input type="checkbox" checked={includeWorked} onChange={(e) => setIncludeWorked(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
              Also release worked solutions to {slug}
            </label>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note for Arush (e.g. focus on eliminating the trap answer first)…"
            rows={2}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)]"
          />

          <Button variant="primary" loading={busy} onClick={assign} className="w-full">
            <Send size={14} /> Assign to {slug}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Question bank tab ──
function BankTab({ bank }: { bank: TalijaBank }) {
  const [open, setOpen] = React.useState<string | null>(bank.skills[0]?.key ?? null);
  return (
    <div>
      <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)]">
        {bank.totalQuestions} questions · {bank.modules.map((m) => `${m.title} (${m.questionCount})`).join(" · ")}
      </p>
      <div className="space-y-2">
        {bank.skills.map((s) => (
          <div key={s.key} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <button onClick={() => setOpen(open === s.key ? null : s.key)} className="flex w-full items-center gap-3 p-4 text-left">
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{s.label}</p>
                <p className="text-[11px] text-[var(--text-3)]">{s.domain} · {s.questions.length} questions</p>
              </div>
              <ChevronDown size={16} className={cn("text-[var(--text-3)] transition-transform", open === s.key && "rotate-180")} />
            </button>
            {open === s.key && (
              <div className="border-t border-[var(--border)] p-4">
                <div className="mb-4 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-3">
                  <p className="text-[12.5px] text-[var(--text-1)]">{s.concept.whatItTests}</p>
                  {s.concept.traps.length > 0 && (
                    <p className="mt-2 text-[11.5px] text-[var(--text-2)]"><span className="font-semibold text-[var(--accent)]">Traps: </span>{s.concept.traps.join("; ")}</p>
                  )}
                </div>
                <div className="space-y-3">
                  {s.questions.map((q, i) => (
                    <div key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-4">
                      <p className="mb-2 font-mono text-[10.5px] text-[var(--text-3)]">Q{i + 1} · difficulty {q.difficulty} · {q.paceSeconds}s</p>
                      <Passage text={q.passage} className="mb-2" />
                      <p className="mb-2 text-[13px] font-medium text-[var(--text-1)]">{q.prompt}</p>
                      <div className="space-y-1">
                        {q.choices.map((c, ci) => (
                          <div key={ci} className={cn("flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px]", ci === q.correct ? "bg-[var(--success-soft)] text-[var(--text-1)]" : "text-[var(--text-2)]")}>
                            <span className="font-mono font-bold">{LETTER(ci)}</span>
                            <span className="flex-1">{c}</span>
                            {ci === q.correct && <span className="font-mono text-[10px] text-[var(--success)]">KEY</span>}
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-3)]"><span className="font-semibold text-[var(--accent)]">Why: </span>{q.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function safeDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return iso;
  }
}
