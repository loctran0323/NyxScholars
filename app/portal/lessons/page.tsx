import Link from "next/link";
import { redirect } from "next/navigation";
import { PlayCircle, Clock, ChevronRight } from "lucide-react";
import { PortalHero } from "@/components/portal/PortalHero";
import { Badge } from "@/components/ui/badge";
import { FEATURES } from "@/lib/features";
import { LESSONS } from "./content";

export const metadata = {
  title: "Video lessons · Nyx",
  description: "Three-minute walkthroughs from Nyx tutors, one skill at a time.",
};

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m} min`;
}

const levelVariant = (l: "Beginner" | "Intermediate" | "Advanced"): "green" | "gold" | "red" =>
  l === "Beginner" ? "green" : l === "Advanced" ? "red" : "gold";

export default function LessonsPage() {
  // No videos are published yet — keep this tab out of production.
  if (!FEATURES.lessons) redirect("/portal");
  return (
    <div className="space-y-8">
      <PortalHero
        eyebrow="Library"
        title="Three-minute walkthroughs,"
        italic="one skill at a time"
        subtitle="Tight, transcribed micro-lessons from your Nyx tutors. Each one cracks one skill — a pacing trick, a problem type, a writing move."
      />

      <ul className="grid gap-3 md:grid-cols-2">
        {LESSONS.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/portal/lessons/${lesson.id}`}
              className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--border-2)] transition-colors"
            >
              <div
                className="aspect-[16/9] relative bg-[var(--surface-elevated)] grid place-items-center"
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
                      "radial-gradient(1px 1px at 20% 30%, white, transparent 60%), radial-gradient(1px 1px at 70% 60%, white, transparent 60%), radial-gradient(1px 1px at 40% 80%, white, transparent 60%)",
                    backgroundSize: "180px 180px",
                  }}
                />
                <div className="relative w-12 h-12 rounded-full bg-[var(--accent)]/20 backdrop-blur grid place-items-center border border-[var(--accent)]/40 group-hover:scale-110 transition-transform">
                  <PlayCircle size={22} className="text-[var(--accent)]" />
                </div>
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-[10.5px] text-[var(--text-1)] font-mono">
                  <Clock size={10} /> {fmtDuration(lesson.durationSec)}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-1.5">{lesson.skill}</p>
                <p className="text-[14px] font-semibold text-[var(--text-1)] leading-snug">{lesson.title}</p>
                <p className="text-[12px] text-[var(--text-2)] mt-1.5 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={levelVariant(lesson.level)} size="sm">{lesson.level}</Badge>
                    <span className="text-[11px] text-[var(--text-3)]">· {lesson.tutor}</span>
                  </div>
                  <ChevronRight size={14} className="text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
