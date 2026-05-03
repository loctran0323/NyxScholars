import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PortalHero } from "@/components/portal/PortalHero";

export const metadata = {
  title: "Video micro-lessons",
  description: "3–5 minute videos by Nyx tutors covering one skill at a time.",
};

import { LESSONS } from "./content";

export default function LessonsPage() {
  return (
    <div className="max-w-4xl">
      <PortalHero
        eyebrow="Portal"
        title="Video lessons"
        italic="three minutes each"
        subtitle="One skill, one walkthrough, no fluff. Recorded by the tutors actually working with students this week."
      />

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
