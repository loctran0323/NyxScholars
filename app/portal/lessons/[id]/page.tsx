import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LESSONS } from "../content";

interface RouteCtx { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: RouteCtx) {
  const { id } = await params;
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) return {};
  return { title: lesson.title, description: lesson.description };
}

export default async function LessonPage({ params }: RouteCtx) {
  const { id } = await params;
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/portal/lessons" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-4">
        <ArrowLeft size={12} /> back to lessons
      </Link>

      <header className="mb-6">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Badge variant="default">{lesson.skill}</Badge>
          <Badge variant={lesson.level === "Advanced" ? "purple" : lesson.level === "Intermediate" ? "blue" : "green"}>
            {lesson.level}
          </Badge>
        </div>
        <h1 className="text-[28px] font-light font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-tight">
          {lesson.title}
        </h1>
        <p className="text-[13.5px] text-[var(--text-2)] mt-2 leading-relaxed">{lesson.description}</p>
        <p className="text-[12px] text-[var(--text-3)] mt-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5"><GraduationCap size={12} /> {lesson.tutor}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {Math.floor(lesson.durationSec / 60)}:{String(lesson.durationSec % 60).padStart(2, "0")}</span>
        </p>
      </header>

      {lesson.videoUrl ? (
        <div className="aspect-video rounded-2xl overflow-hidden border border-[var(--border)] bg-black mb-6">
          <video controls poster={lesson.thumbnail} src={lesson.videoUrl} className="w-full h-full" />
        </div>
      ) : (
        <div className="aspect-video rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)] grid place-items-center text-center px-6 mb-6">
          <div>
            <p className="text-[13px] text-[var(--text-1)] font-semibold mb-1">Video uploading.</p>
            <p className="text-[12.5px] text-[var(--text-2)] max-w-sm">
              We're encoding this lesson on Mux. The transcript and chapter markers below stay accurate either way.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 mb-4">
        <p className="text-[10.5px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-3">What you'll learn</p>
        <ul className="space-y-2 text-[13.5px] text-[var(--text-1)] leading-relaxed">
          {lesson.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {lesson.transcript && (
        <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="text-[13px] font-semibold text-[var(--text-1)] cursor-pointer">Read the transcript</summary>
          <div className="mt-4 text-[13px] text-[var(--text-2)] leading-relaxed whitespace-pre-wrap">{lesson.transcript}</div>
        </details>
      )}
    </div>
  );
}
