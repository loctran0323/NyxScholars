import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import { PortalHero } from "@/components/portal/PortalHero";
import { Badge } from "@/components/ui/badge";
import { FEATURES } from "@/lib/features";
import { LESSONS } from "../content";

export const metadata = { title: "Video lesson · Nyx" };

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m} min ${s} sec` : `${m} minutes`;
}

const levelVariant = (l: "Beginner" | "Intermediate" | "Advanced"): "green" | "gold" | "red" =>
  l === "Beginner" ? "green" : l === "Advanced" ? "red" : "gold";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!FEATURES.lessons) redirect("/portal");
  const { id } = await params;
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/portal/lessons"
        className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-6"
      >
        <ArrowLeft size={12} /> Back to lessons
      </Link>

      <PortalHero
        eyebrow={lesson.skill}
        title={lesson.title}
        italic={fmtDuration(lesson.durationSec)}
        subtitle={`Taught by ${lesson.tutor}`}
      />

      {/* Video frame — when a real videoUrl is added, swap in a <video> tag. */}
      <div
        className="aspect-video w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] grid place-items-center relative overflow-hidden mb-6"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, var(--accent-dim) 0%, transparent 70%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, white, transparent 60%), radial-gradient(1px 1px at 75% 70%, white, transparent 60%), radial-gradient(1px 1px at 50% 85%, white, transparent 60%)",
            backgroundSize: "200px 200px",
          }}
        />
        {lesson.videoUrl ? (
          <video
            src={lesson.videoUrl}
            controls
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="relative text-center px-6">
            <div className="w-14 h-14 rounded-full bg-[var(--accent)]/20 grid place-items-center border border-[var(--accent)]/40 mx-auto mb-3">
              <PlayCircle size={24} className="text-[var(--accent)]" />
            </div>
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--text-3)] font-mono">
              Recording {lesson.releaseHint ? `· ${lesson.releaseHint}` : "in the studio"}
            </p>
            <p className="text-[13.5px] text-[var(--text-2)] mt-2 max-w-md leading-relaxed">
              The transcript and takeaways below cover the full lesson. The video drops the moment our sound edit clears.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={levelVariant(lesson.level)} size="sm">{lesson.level}</Badge>
        <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--text-3)]">
          <Clock size={11} /> {fmtDuration(lesson.durationSec)}
        </span>
      </div>

      <p className="text-[14px] text-[var(--text-1)] leading-relaxed mb-7">{lesson.description}</p>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-5">
        <p className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-3">
          Takeaways
        </p>
        <ul className="space-y-2.5">
          {lesson.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-[var(--text-1)] leading-relaxed">
              <CheckCircle2 size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {lesson.transcript && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-[10.5px] uppercase tracking-[0.2em] text-[var(--text-3)] font-semibold mb-3">
            Transcript excerpt
          </p>
          <p className="text-[13.5px] text-[var(--text-2)] leading-relaxed whitespace-pre-line">
            {lesson.transcript}
          </p>
        </section>
      )}
    </div>
  );
}
