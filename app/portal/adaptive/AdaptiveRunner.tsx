"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check, X, ChevronRight, SkipForward, Flame, Gauge, TrendingUp,
  Infinity as InfinityIcon, Loader2, RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Stimulus, Inline } from "@/components/practice/Passage";

/* ─── Types mirroring /api/practice/adaptive ─────────────────────────────── */

type SectionFilter = "Math" | "Reading & Writing" | "Mixed";

interface PublicItem {
  token: string;
  skillId: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  passage?: string;
  prompt: string;
  choices: string[];
}

interface SkillReadout {
  id: string;
  name: string;
  constellationId: string;
  constellationName: string;
  section: string;
  mastery: number;
  attempts: number;
}

interface Readout {
  score: number;
  math: number;
  rw: number;
  theta: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  skills: SkillReadout[];
  weakest: { name: string; mastery: number }[];
  strongest: { name: string; mastery: number }[];
}

interface Feedback {
  correct: boolean;
  correctIndex: number;
  rationale?: string;
}

interface ApiResponse {
  state: unknown;
  item: PublicItem;
  readout: Readout;
  feedback?: Feedback | null;
  error?: string;
}

const STORAGE_KEY = "nyx:adaptive:v2";
const SECTIONS: { key: SectionFilter; label: string }[] = [
  { key: "Mixed", label: "Mixed" },
  { key: "Math", label: "Math" },
  { key: "Reading & Writing", label: "R&W" },
];

const DIFF_LABEL = ["", "Foundational", "Easy", "Medium", "Hard", "Elite"];

/* ─── Component ───────────────────────────────────────────────────────────── */

export function AdaptiveRunner() {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [item, setItem] = React.useState<PublicItem | null>(null);
  const [readout, setReadout] = React.useState<Readout | null>(null);
  const [section, setSection] = React.useState<SectionFilter>("Mixed");
  const [picked, setPicked] = React.useState<number | null>(null);
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);
  const [phase, setPhase] = React.useState<"answering" | "reviewing">("answering");
  const [busy, setBusy] = React.useState(false);

  const stateRef = React.useRef<unknown>(null);
  const nextItemRef = React.useRef<PublicItem | null>(null);

  const persist = React.useCallback((s: unknown, sec: SectionFilter) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: s, section: sec }));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, []);

  const post = React.useCallback(
    async (payload: Record<string, unknown>): Promise<ApiResponse | null> => {
      try {
        const res = await fetch("/api/practice/adaptive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as ApiResponse;
      } catch {
        return null;
      }
    },
    [],
  );

  // Initial load: resume saved progress if present, else start fresh.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      let saved: { state: unknown; section: SectionFilter } | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch {
        saved = null;
      }
      const sec = saved?.section ?? "Mixed";
      const res = saved?.state
        ? await post({ action: "answer", state: saved.state, section: sec, token: null, picked: null })
        : await post({ action: "start", section: sec });
      if (cancelled) return;
      if (!res?.item) {
        setStatus("error");
        return;
      }
      stateRef.current = res.state;
      setSection(sec);
      setItem(res.item);
      setReadout(res.readout);
      setPicked(null);
      setFeedback(null);
      setPhase("answering");
      persist(res.state, sec);
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirm = React.useCallback(async () => {
    if (picked === null || !item || busy || phase !== "answering") return;
    setBusy(true);
    const res = await post({
      action: "answer",
      state: stateRef.current,
      section,
      token: item.token,
      picked,
    });
    setBusy(false);
    if (!res?.item) return;
    stateRef.current = res.state;
    setReadout(res.readout);
    setFeedback(res.feedback ?? null);
    nextItemRef.current = res.item;
    setPhase("reviewing");
    persist(res.state, section);
  }, [picked, item, busy, phase, post, section, persist]);

  const advance = React.useCallback(() => {
    const next = nextItemRef.current;
    if (!next) return;
    setItem(next);
    nextItemRef.current = null;
    setPicked(null);
    setFeedback(null);
    setPhase("answering");
  }, []);

  const skip = React.useCallback(async () => {
    if (!item || busy) return;
    setBusy(true);
    const res = await post({
      action: "answer",
      state: stateRef.current,
      section,
      token: item.token,
      picked: null,
    });
    setBusy(false);
    if (!res?.item) return;
    stateRef.current = res.state;
    setReadout(res.readout);
    setItem(res.item);
    setPicked(null);
    setFeedback(null);
    setPhase("answering");
    persist(res.state, section);
  }, [item, busy, post, section, persist]);

  const changeSection = React.useCallback(
    async (sec: SectionFilter) => {
      if (sec === section || busy) return;
      setSection(sec);
      setBusy(true);
      const res = await post({
        action: "answer",
        state: stateRef.current,
        section: sec,
        token: null,
        picked: null,
      });
      setBusy(false);
      if (!res?.item) return;
      stateRef.current = res.state;
      setReadout(res.readout);
      setItem(res.item);
      setPicked(null);
      setFeedback(null);
      setPhase("answering");
      persist(res.state, sec);
    },
    [section, busy, post, persist],
  );

  const reset = React.useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const res = await post({ action: "start", section });
    setBusy(false);
    if (!res?.item) return;
    stateRef.current = res.state;
    setItem(res.item);
    setReadout(res.readout);
    setPicked(null);
    setFeedback(null);
    setPhase("answering");
    persist(res.state, section);
  }, [busy, post, section, persist]);

  // Keyboard: 1–4 / A–D pick, Enter confirm/continue, S skip.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (status !== "ready" || !item) return;
      const k = e.key.toLowerCase();
      if (phase === "answering") {
        const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
        if (k in map && map[k] < item.choices.length) {
          setPicked(map[k]);
          e.preventDefault();
        } else if (k === "enter" && picked !== null) {
          confirm();
          e.preventDefault();
        } else if (k === "s") {
          skip();
          e.preventDefault();
        }
      } else if (phase === "reviewing" && (k === "enter" || k === " ")) {
        advance();
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, item, phase, picked, confirm, skip, advance]);

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto pt-24 text-center text-[var(--text-3)] text-[13px] flex flex-col items-center gap-3">
        <Loader2 size={22} className="animate-spin text-[var(--accent)]" />
        Calibrating your first question…
      </div>
    );
  }

  if (status === "error" || !item) {
    return (
      <div className="max-w-md mx-auto pt-20 text-center">
        <h1 className="text-[22px] font-semibold text-[var(--text-1)] mb-2">Couldn&apos;t start practice</h1>
        <p className="text-[var(--text-2)] text-[14px] mb-5">
          Something went wrong reaching the question engine. Please try again.
        </p>
        <Button variant="primary" onClick={reset}>
          <RotateCw size={14} /> Retry
        </Button>
      </div>
    );
  }

  const submitted = phase === "reviewing";

  return (
    <div className="max-w-6xl mx-auto">
      <Header
        section={section}
        onSection={changeSection}
        readout={readout}
        busy={busy}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* ── Question column ── */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono tracking-[0.24em] text-[var(--text-3)] uppercase truncate">
                {item.section} · {item.skill}
              </span>
            </div>
            <DifficultyMeter difficulty={item.difficulty} />
          </div>

          <article
            key={item.token}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 flex flex-col gap-6 animate-[fade-in_0.25s_ease]"
          >
            {item.passage ? <Stimulus text={item.passage} /> : null}
            <p className="text-[17px] sm:text-[18px] leading-relaxed text-[var(--text-1)]">
              <Inline text={item.prompt} />
            </p>

            <div className="flex flex-col gap-2.5">
              {item.choices.map((choice, i) => {
                const isPicked = picked === i;
                const isCorrect = submitted && feedback?.correctIndex === i;
                const isWrongPick = submitted && isPicked && feedback && !feedback.correct;
                return (
                  <button
                    key={i}
                    disabled={submitted}
                    onClick={() => setPicked(i)}
                    className={cn(
                      "text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border text-[14px] transition-all",
                      !submitted && isPicked && "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--text-1)]",
                      !submitted && !isPicked && "border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] hover:border-[var(--border-2)]",
                      isCorrect && "border-green-500/55 bg-green-500/10 text-[var(--text-1)]",
                      isWrongPick && "border-red-500/55 bg-red-500/10 text-[var(--text-1)]",
                      submitted && !isCorrect && !isWrongPick && "border-[var(--border)] opacity-55 text-[var(--text-2)]",
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5 border",
                        isCorrect ? "border-green-500 bg-green-500 text-white"
                          : isWrongPick ? "border-red-500 bg-red-500 text-white"
                          : isPicked ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                          : "border-[var(--border-2)] text-[var(--text-3)]",
                      )}
                    >
                      {isCorrect ? <Check size={12} /> : isWrongPick ? <X size={12} /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="pt-0.5"><Inline text={choice} /></span>
                  </button>
                );
              })}
            </div>

            {submitted && feedback && (
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-[13px] leading-relaxed",
                  feedback.correct
                    ? "border-green-500/30 bg-green-500/5 text-[var(--text-2)]"
                    : "border-[var(--border-accent)] bg-[var(--accent-dim)] text-[var(--text-2)]",
                )}
              >
                <span className={cn("font-semibold", feedback.correct ? "text-green-500" : "text-[var(--accent)]")}>
                  {feedback.correct ? "Correct. " : "Not quite. "}
                </span>
                {feedback.rationale || (feedback.correct ? "Nicely done." : "Review the worked reasoning and keep going.")}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              {!submitted ? (
                <>
                  <button
                    onClick={skip}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors disabled:opacity-50"
                  >
                    <SkipForward size={13} /> Skip
                  </button>
                  <Button variant="primary" disabled={picked === null || busy} onClick={confirm} className="gap-1.5">
                    {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                    Confirm <ChevronRight size={14} />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-[11.5px] text-[var(--text-3)] font-mono">
                    {readout ? `${readout.totalCorrect}/${readout.totalAnswered} correct` : ""}
                  </span>
                  <Button variant="primary" onClick={advance} className="gap-1.5" disabled={busy}>
                    Continue <ChevronRight size={14} />
                  </Button>
                </>
              )}
            </div>
          </article>

          <p className="mt-3 text-center text-[11px] text-[var(--text-3)]">
            Keys: <kbd className="font-mono">1–4</kbd> choose · <kbd className="font-mono">Enter</kbd> confirm · <kbd className="font-mono">S</kbd> skip · runs forever, adjusting to you.
          </p>
        </div>

        {/* ── Ability panel ── */}
        <AbilityPanel readout={readout} onReset={reset} busy={busy} />
      </div>
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────────────────────── */

function Header({
  section,
  onSection,
  readout,
  busy,
}: {
  section: SectionFilter;
  onSection: (s: SectionFilter) => void;
  readout: Readout | null;
  busy: boolean;
}) {
  return (
    <header className="mb-7">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[var(--text-3)] mb-1.5 flex items-center gap-1.5">
            <InfinityIcon size={13} className="text-[var(--accent)]" /> Endless practice
          </p>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[28px] sm:text-[32px] text-[var(--text-1)] leading-[1.05] tracking-[-0.015em]"
          >
            Practice that{" "}
            <span className="italic font-light text-[var(--accent)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              never runs out
            </span>
          </h1>
          <p className="text-[13.5px] text-[var(--text-2)] leading-relaxed mt-2 max-w-xl">
            Every question is matched to your current level and the engine re-tunes after each answer. Go as long as you like — it never ends.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              disabled={busy}
              onClick={() => onSection(s.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all disabled:opacity-50",
                section === s.key
                  ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-accent)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-1)] border border-transparent",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={<TrendingUp size={14} />} label="Est. score" value={readout && readout.score ? String(readout.score) : "—"} hint={readout?.score ? "of 1600" : "answer a few"} />
        <StatTile icon={<Gauge size={14} />} label="Accuracy" value={readout && readout.totalAnswered ? `${readout.accuracy}%` : "—"} hint={readout ? `${readout.totalAnswered} answered` : ""} />
        <StatTile icon={<Flame size={14} />} label="Streak" value={readout ? String(readout.streak) : "0"} hint={readout ? `best ${readout.bestStreak}` : ""} accent={Boolean(readout && readout.streak >= 3)} />
        <StatTile icon={<InfinityIcon size={14} />} label="Answered" value={readout ? String(readout.totalAnswered) : "0"} hint="no limit" />
      </div>
    </header>
  );
}

function StatTile({ icon, label, value, hint, accent }: { icon: React.ReactNode; label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-xl border bg-[var(--surface)] px-4 py-3", accent ? "border-[var(--border-accent)]" : "border-[var(--border)]")}>
      <div className="flex items-center gap-1.5 text-[var(--text-3)] mb-1">
        <span className={cn(accent && "text-[var(--accent)]")}>{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold">{label}</span>
      </div>
      <div className="text-[22px] font-semibold text-[var(--text-1)] leading-none tabular-nums">{value}</div>
      {hint ? <div className="text-[10.5px] text-[var(--text-3)] mt-1">{hint}</div> : null}
    </div>
  );
}

/* ─── Difficulty meter ────────────────────────────────────────────────────── */

function DifficultyMeter({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[10px] font-mono tracking-[0.14em] text-[var(--text-3)] uppercase hidden sm:inline">
        {DIFF_LABEL[difficulty] ?? "—"}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="w-1.5 h-4 rounded-full transition-colors"
            style={{ background: n <= difficulty ? "var(--accent)" : "var(--border-2)", opacity: n <= difficulty ? 1 : 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Ability panel ───────────────────────────────────────────────────────── */

function AbilityPanel({ readout, onReset, busy }: { readout: Readout | null; onReset: () => void; busy: boolean }) {
  const constellations = React.useMemo(() => {
    if (!readout) return [];
    const map = new Map<string, { name: string; section: string; mastery: number; attempts: number; weight: number }>();
    for (const s of readout.skills) {
      if (s.attempts === 0) continue;
      const cur = map.get(s.constellationId) ?? { name: s.constellationName, section: s.section, mastery: 0, attempts: 0, weight: 0 };
      cur.mastery += s.mastery * s.attempts;
      cur.weight += s.attempts;
      cur.attempts += s.attempts;
      map.set(s.constellationId, cur);
    }
    return [...map.values()].map((c) => ({ ...c, mastery: c.weight ? c.mastery / c.weight : 0 })).sort((a, b) => b.attempts - a.attempts);
  }, [readout]);

  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[12px] uppercase tracking-[0.16em] font-semibold text-[var(--text-2)]">Your sky tonight</h2>
        <button onClick={onReset} disabled={busy} className="text-[11px] text-[var(--text-3)] hover:text-[var(--text-1)] inline-flex items-center gap-1 disabled:opacity-50">
          <RotateCw size={11} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Dial label="Math" value={readout?.math ?? 0} />
        <Dial label="R&W" value={readout?.rw ?? 0} />
      </div>

      {constellations.length === 0 ? (
        <p className="text-[12.5px] text-[var(--text-3)] leading-relaxed">
          Answer a few questions and your strengths across each constellation will light up here.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {constellations.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between text-[11.5px] mb-1">
                <span className="text-[var(--text-2)]">{c.name}</span>
                <span className="text-[var(--text-3)] tabular-nums">{Math.round(c.mastery * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--border-2)]/40 overflow-hidden">
                <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${Math.max(4, Math.round(c.mastery * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {readout && readout.weakest.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[var(--border)]">
          <p className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-[var(--text-3)] mb-2">Focus next</p>
          <div className="flex flex-wrap gap-1.5">
            {readout.weakest.map((w) => (
              <span key={w.name} className="text-[11px] px-2 py-1 rounded-lg border border-[var(--border)] text-[var(--text-2)]">
                {w.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link href="/portal/consultation" className="mt-5 block text-center text-[12px] text-[var(--accent)] hover:underline">
        See your full constellation map →
      </Link>
    </aside>
  );
}

function Dial({ label, value }: { label: string; value: number }) {
  const shown = value || 0;
  const pct = shown ? Math.round(((shown - 200) / 600) * 100) : 0;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)]/40 px-3 py-3 text-center">
      <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--text-3)] mb-1">{label}</div>
      <div className="text-[20px] font-semibold text-[var(--text-1)] leading-none tabular-nums">{shown || "—"}</div>
      <div className="mt-2 h-1 rounded-full bg-[var(--border-2)]/40 overflow-hidden">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </div>
  );
}
