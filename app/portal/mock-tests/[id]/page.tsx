import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Trophy, Timer as TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCKS } from "../content";

interface RouteCtx { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return MOCKS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: RouteCtx) {
  const { id } = await params;
  const m = MOCKS.find((x) => x.id === id);
  if (!m) return {};
  return { title: m.title };
}

export default async function MockTestPage({ params }: RouteCtx) {
  const { id } = await params;
  const m = MOCKS.find((x) => x.id === id);
  if (!m) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/portal/mock-tests" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-4">
        <ArrowLeft size={12} /> all mocks
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Badge variant={m.test === "SAT" ? "blue" : "purple"}>{m.test}</Badge>
          {m.status === "completed" && m.scoreRange && (
            <Badge variant="green"><Trophy size={10} /> {m.scoreRange.composite}</Badge>
          )}
        </div>
        <h1 className="text-[26px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
          {m.title}
        </h1>
        <p className="text-[13px] text-[var(--text-3)] mt-2">
          {m.questions} questions · {Math.floor(m.durationMin / 60)}h {m.durationMin % 60}m total · released {m.released}
        </p>
      </header>

      {m.status === "completed" && m.scoreRange ? (
        <section className="rounded-2xl border border-[var(--success)]/35 bg-[var(--success-soft)] p-6 mb-6 text-center">
          <Trophy size={28} className="text-[var(--success)] mx-auto mb-2" />
          <p className="text-[14px] font-semibold text-[var(--text-1)]">Last score: {m.scoreRange.composite}</p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-1">
            Math {m.scoreRange.math} · R&W {m.scoreRange.rw}
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-5 mb-6 flex items-start gap-3">
          <AlertCircle size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
          <div className="text-[13px] text-[var(--text-1)] leading-relaxed">
            We pause the timer if you close the tab, but your scaled score reflects total elapsed time
            (the way College Board does it). Allocate the full duration in one sitting if you can.
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-4">
        <h2 className="text-[14px] font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
          <TimerIcon size={14} className="text-[var(--accent)]" /> Sections
        </h2>
        <ul className="space-y-3">
          {m.sections.map((s) => (
            <li key={s.name} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-4 py-3">
              <div>
                <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{s.name}</p>
                <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">{s.questions} questions · {s.minutes} min</p>
              </div>
              <span className="font-mono text-[11.5px] text-[var(--text-3)]">{s.scaledMin}–{s.scaledMax}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        {m.status !== "coming-soon" && (
          <Button variant="primary" asChild>
            <Link href={`/portal/mock-tests/${m.id}/run`}>
              {m.status === "completed" ? "Re-take" : "Start mock"}
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/portal/messages?topic=mock-help">Ask a question</Link>
        </Button>
      </div>

      <p className="text-[11.5px] text-[var(--text-3)] mt-6">
        The mock-runner page is the live test surface — adaptive timing, auto-save, and section breaks
        are wired there. This page is the brief.
      </p>
    </div>
  );
}
