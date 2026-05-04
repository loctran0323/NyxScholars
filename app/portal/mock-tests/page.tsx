import Link from "next/link";
import { Clock, Target, Trophy, ChevronRight, CheckCircle2 } from "lucide-react";
import { PortalHero } from "@/components/portal/PortalHero";
import { Badge } from "@/components/ui/badge";
import { MOCKS } from "./content";

export const metadata = {
  title: "Mock tests · Nyx",
  description: "Timed Nyx skills exams. Pull from the same bank that powers your sky map.",
};

export default function MockTestsPage() {
  const available = MOCKS.filter((m) => m.status === "available");
  const completed = MOCKS.filter((m) => m.status === "completed");

  return (
    <div className="space-y-8">
      <PortalHero
        eyebrow="Practice"
        title="Skills exams,"
        italic="timed and scored"
        subtitle="Short, focused mock exams that pull from the same question bank powering your sky. Each one auto-saves and shows a per-question review at the end."
      />

      <section>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)] mb-3">
          Available now
        </p>
        {available.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[13px] text-[var(--text-2)]">
            Nothing live this week — check back Monday.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {available.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/portal/mock-tests/${m.id}`}
                  className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-2)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <Badge variant={m.test === "SAT" ? "gold" : "green"} size="sm">{m.test}</Badge>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-3)] group-hover:text-[var(--accent)] mt-1 transition-colors" />
                  </div>
                  <p className="text-[15px] font-semibold text-[var(--text-1)] leading-snug">{m.title}</p>
                  <p className="text-[11.5px] text-[var(--text-3)] mt-1">Released {m.released}</p>
                  <div className="mt-4 flex items-center gap-4 text-[12px] text-[var(--text-2)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Target size={12} className="text-[var(--text-3)]" /> {m.questions} questions
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} className="text-[var(--text-3)]" /> {m.durationMin} min
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)] mb-3">
            Recent
          </p>
          <ul className="space-y-2">
            {completed.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/portal/mock-tests/${m.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-2)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--success-soft)] border border-[var(--success)]/25 grid place-items-center shrink-0">
                    <CheckCircle2 size={16} className="text-[var(--success)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-[var(--text-1)] truncate">{m.title}</p>
                    <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">{m.released} · {m.questions} questions</p>
                  </div>
                  {m.scoreRange && (
                    <p className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--text-1)] font-semibold shrink-0">
                      <Trophy size={12} className="text-[var(--accent)]" />
                      {m.scoreRange.composite}
                    </p>
                  )}
                  <ChevronRight size={14} className="text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
