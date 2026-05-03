import Link from "next/link";
import { Timer, FileCheck, Trophy, AlertCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Mock tests",
  description: "Full-length digital SAT/ACT mocks, scored within the portal.",
};

interface MockTest {
  id: string;
  title: string;
  test: "SAT" | "ACT";
  durationMin: number;
  questions: number;
  released: string;
  status: "available" | "coming-soon" | "completed";
  scoreRange?: { math: number; rw: number; composite: number };
}

const MOCKS: MockTest[] = [
  {
    id: "nyx-sat-2026-04",
    title: "Nyx SAT Mock #4 (April 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "Apr 4, 2026",
    status: "available",
  },
  {
    id: "nyx-sat-2026-03",
    title: "Nyx SAT Mock #3 (March 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "Mar 7, 2026",
    status: "completed",
    scoreRange: { math: 740, rw: 700, composite: 1440 },
  },
  {
    id: "nyx-act-2026-04",
    title: "Nyx ACT Mock #2 (April 2026)",
    test: "ACT",
    durationMin: 175,
    questions: 215,
    released: "Apr 18, 2026",
    status: "available",
  },
  {
    id: "nyx-sat-2026-05",
    title: "Nyx SAT Mock #5 (May 2026)",
    test: "SAT",
    durationMin: 134,
    questions: 98,
    released: "May 2, 2026",
    status: "coming-soon",
  },
];

export default function MockTestsPage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight flex items-center gap-2">
          <Timer size={20} className="text-[var(--accent)]" />
          Full-length mock tests
        </h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Adaptive digital SAT and ACT mocks — timed, branded, scored within the portal. New mock every two weeks.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4 mb-6 flex items-start gap-3">
        <AlertCircle size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
        <div className="text-[13px] text-[var(--text-1)] leading-relaxed">
          Allocate the full duration in one sitting. We pause the timer if you close the tab, but
          your scaled score reflects total elapsed time (the way College Board does it).
        </div>
      </div>

      <div className="space-y-3">
        {MOCKS.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Badge variant={m.test === "SAT" ? "blue" : "purple"}>{m.test}</Badge>
                  {m.status === "completed" && m.scoreRange && (
                    <Badge variant="green">
                      <Trophy size={10} /> {m.scoreRange.composite}
                    </Badge>
                  )}
                  {m.status === "coming-soon" && <Badge variant="gold">Coming soon</Badge>}
                </div>
                <h2 className="text-[15px] font-semibold text-[var(--text-1)]">{m.title}</h2>
                <p className="text-[12.5px] text-[var(--text-3)] mt-1">
                  {m.questions} questions · {Math.floor(m.durationMin / 60)}h {m.durationMin % 60}m · released {m.released}
                </p>
                {m.status === "completed" && m.scoreRange && (
                  <p className="text-[12.5px] text-[var(--text-2)] mt-2">
                    Last attempt: <span className="text-[var(--text-1)] font-semibold">{m.scoreRange.composite}</span>{" "}
                    (Math {m.scoreRange.math}, R&W {m.scoreRange.rw})
                  </p>
                )}
              </div>
              {m.status === "available" || m.status === "completed" ? (
                <Link
                  href={`/portal/mock-tests/${m.id}`}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-accent)] text-[12.5px] font-semibold text-[var(--accent)]"
                >
                  {m.status === "completed" ? "Review" : "Start"} <ChevronRight size={12} />
                </Link>
              ) : (
                <span className="px-3 py-2 rounded-xl border border-[var(--border)] text-[12.5px] text-[var(--text-3)]">
                  Soon
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-[14px] font-semibold text-[var(--text-1)] mb-2 flex items-center gap-2">
          <FileCheck size={14} className="text-[var(--text-3)]" />
          How scoring works
        </h2>
        <p className="text-[13px] text-[var(--text-2)] leading-relaxed">
          Each mock is hand-calibrated against three real test forms. We report a <strong>scaled score</strong> with
          ±15-point precision (SAT) and ±1-point precision (ACT). Your section breakdowns flow back into your
          constellation map and your weekly digest.
        </p>
      </div>
    </div>
  );
}
