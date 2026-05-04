import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Target, PlayCircle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMockById, buildMockQuestions } from "../content";

export const metadata = {
  title: "Mock test · Nyx",
};

export default async function MockTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mock = getMockById(id);
  if (!mock) notFound();

  const questions = buildMockQuestions(mock);
  const sectionMix = (() => {
    const m = questions.filter((q) => q.section === "Math").length;
    const r = questions.filter((q) => q.section === "Reading & Writing").length;
    return { m, r };
  })();

  const isCompleted = mock.status === "completed";

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/portal/mock-tests"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-6"
      >
        <ArrowLeft size={12} /> Back to mock tests
      </Link>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={mock.test === "SAT" ? "gold" : "green"} size="sm">{mock.test}</Badge>
          {isCompleted && (
            <Badge variant="green" size="sm">Completed</Badge>
          )}
        </div>
        <h1 className="text-[26px] sm:text-[30px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
          {mock.title}
        </h1>
        <p className="text-[12px] text-[var(--text-3)] mt-2">Released {mock.released}</p>

        <div className="mt-7 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Questions</p>
            <p className="text-[18px] font-semibold text-[var(--text-1)] mt-1 inline-flex items-center gap-1.5">
              <Target size={13} className="text-[var(--accent)]" />
              {questions.length}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Time</p>
            <p className="text-[18px] font-semibold text-[var(--text-1)] mt-1 inline-flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--accent)]" />
              {mock.durationMin} min
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Mix</p>
            <p className="text-[12.5px] text-[var(--text-1)] mt-1.5 font-medium leading-tight">
              {sectionMix.m} Math<br />
              <span className="text-[var(--text-2)]">{sectionMix.r} R&W</span>
            </p>
          </div>
        </div>

        <ol className="mt-7 space-y-2 text-[13px] text-[var(--text-2)] leading-relaxed">
          <li className="flex gap-2.5">
            <span className="text-[var(--accent)] font-semibold shrink-0">01.</span>
            Timer starts the moment you tap <em>Begin</em> and persists across refreshes.
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--accent)] font-semibold shrink-0">02.</span>
            You can move forward and back; your picks autosave as you go.
          </li>
          <li className="flex gap-2.5">
            <span className="text-[var(--accent)] font-semibold shrink-0">03.</span>
            Submit (or run out of time) and you'll see every question, your answer, and a rationale.
          </li>
        </ol>

        {mock.scoreRange && (
          <div className="mt-7 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4 flex items-center gap-3">
            <Trophy size={16} className="text-[var(--accent)] shrink-0" />
            <p className="text-[12.5px] text-[var(--text-1)]">
              Last attempt scored <span className="font-semibold">{mock.scoreRange.composite}</span> ·
              <span className="text-[var(--text-2)] ml-1">Math {mock.scoreRange.math} · R&W {mock.scoreRange.rw}</span>
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <Link
            href={`/portal/mock-tests/${mock.id}/run`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] text-[13px] font-semibold hover:bg-[var(--accent-bright)] transition-colors"
          >
            <PlayCircle size={14} />
            {isCompleted ? "Retake mock" : "Begin mock"}
          </Link>
          <Link
            href="/portal/mock-tests"
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[13px] text-[var(--text-2)] hover:border-[var(--border-2)] hover:text-[var(--text-1)] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
