import Link from "next/link";
import { Play, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Video micro-lessons",
  description: "3–5 minute videos by Nyx tutors covering one skill at a time.",
};

interface Lesson {
  id: string;
  title: string;
  tutor: string;
  durationSec: number;
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  thumbnail: string;
}

const LESSONS: Lesson[] = [
  {
    id: "sat-quad-1",
    title: "Quadratics: the discriminant trick",
    tutor: "Anika, Princeton '26",
    durationSec: 280,
    skill: "Algebra & functions",
    level: "Intermediate",
    description: "A 4-minute walkthrough of when the discriminant tells you the answer faster than factoring.",
    thumbnail: "/design/lesson-quadratics.jpg",
  },
  {
    id: "sat-rw-pacing",
    title: "Reading & Writing pacing under timer",
    tutor: "Ben, Yale '25",
    durationSec: 320,
    skill: "Pacing",
    level: "Beginner",
    description: "How to budget 53 seconds per question without rushing the long-passage questions.",
    thumbnail: "/design/lesson-pacing.jpg",
  },
  {
    id: "act-science",
    title: "ACT Science: skim the chart, skip the prose",
    tutor: "Anika, Princeton '26",
    durationSec: 240,
    skill: "ACT Science strategy",
    level: "Beginner",
    description: "Most ACT Science questions are answerable from charts alone. Here's the order.",
    thumbnail: "/design/lesson-act-science.jpg",
  },
  {
    id: "essay-hook",
    title: "Personal statement: the first sentence",
    tutor: "Daniela, Stanford '24",
    durationSec: 360,
    skill: "Admissions essays",
    level: "Advanced",
    description: "Five hooks that work, two that don't, and how to pick yours.",
    thumbnail: "/design/lesson-essay.jpg",
  },
];

export default function LessonsPage() {
  return (
    <div className="max-w-4xl">
      <header className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight flex items-center gap-2">
          <BookOpen size={20} className="text-[var(--accent)]" />
          Video micro-lessons
        </h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Three- to five-minute videos by Nyx tutors. One skill, one walkthrough, no fluff.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {LESSONS.map((l) => (
          <Link
            key={l.id}
            href={`/portal/lessons/${l.id}`}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--border-2)] transition-colors"
          >
            <div className="relative aspect-video bg-[var(--bg-2)] overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[var(--accent-dim)] via-transparent to-[var(--gold-dim)] opacity-60"
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)]/90 border border-[var(--border-accent)] grid place-items-center group-hover:scale-105 transition-transform">
                  <Play size={18} className="text-[var(--accent)] ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10.5px] font-mono">
                {Math.floor(l.durationSec / 60)}:{String(l.durationSec % 60).padStart(2, "0")}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Badge variant="default">{l.skill}</Badge>
                <Badge variant={l.level === "Advanced" ? "purple" : l.level === "Intermediate" ? "blue" : "green"}>
                  {l.level}
                </Badge>
              </div>
              <p className="text-[14px] font-semibold text-[var(--text-1)] leading-snug">{l.title}</p>
              <p className="text-[12.5px] text-[var(--text-2)] mt-1 line-clamp-2 leading-snug">{l.description}</p>
              <p className="text-[11.5px] text-[var(--text-3)] mt-2 flex items-center gap-1">
                <Clock size={11} /> {l.tutor}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
