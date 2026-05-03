"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Text, Card } from "@/components/system";
import { ALL_SKILLS } from "@/lib/mock/constellations";
import { Sky, SkillSheet } from "@/components/portal/Sky";
import {
  StudentHeader, DashTabs, EstimatedRangeCard,
  ConstellationsCard, NextSessionCard, SessionHistoryCard,
} from "@/components/portal/SkyAccessories";

export interface ConsultationNote {
  id:        string;
  author:    string;
  createdAt: string;
  body:      string;
}

export interface ConsultationSession {
  topic:    string;
  whenISO:  string;
  whenLabel: string;
}

export interface ConsultationProps {
  studentName:     string;
  studentInitials: string;
  tutorName:       string;
  packageLabel:    string;
  nextSession:     ConsultationSession | null;
  notes:           ConsultationNote[];
  /** Optional mastery overrides keyed by skill_id; passed to Sky. */
  masteryOverrides?: Record<string, number>;
  /** When true, the Sky tab gets a soft empty state instead of mock constellations. */
  hasIntake:       boolean;
}

export function ConsultationView(props: ConsultationProps) {
  const [view, setView] = useState<"sky" | "metrics">("sky");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedSkill = ALL_SKILLS.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="-mx-5 md:-mx-8 -my-7 md:-my-9 flex flex-col h-[calc(100dvh-56px)] md:h-[calc(100vh-0px)] min-h-[680px]">
      <StudentHeader
        studentName={props.studentName}
        studentInitials={props.studentInitials}
        tutorName={props.tutorName}
        packageLabel={props.packageLabel}
        nextSession={
          props.nextSession ? `IN ${formatDelta(props.nextSession.whenISO)}` : "TBD"
        }
      />

      <DashTabs view={view} setView={setView} />

      <div className="flex-1 overflow-hidden relative" style={{ background: "#070914" }}>
        {view === "sky" ? (
          props.hasIntake ? (
            <div className="relative w-full h-full">
              <Sky
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                masteryOverrides={props.masteryOverrides}
              />
              <SkillSheet skill={selectedSkill} onClose={() => setSelectedId(null)} />
            </div>
          ) : (
            <SkyEmptyState />
          )
        ) : (
          <div className="h-full overflow-y-auto px-5 md:px-7 py-7" style={{ color: "#e6e9f5" }}>
            <MetricsView {...props} onSelectSkill={setSelectedId} />
          </div>
        )}
      </div>
    </div>
  );
}

function MetricsView({
  tutorName, nextSession, notes, onSelectSkill,
}: ConsultationProps & { onSelectSkill: (id: string | null) => void }) {
  return (
    <div className="space-y-5 max-w-[1100px]">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {nextSession ? (
          <NextSessionCard
            tutorName={tutorName}
            whenLabel={nextSession.whenLabel}
            topic={nextSession.topic}
            whyLine="Picked from your most recent diagnostic and homework misses."
          />
        ) : (
          <Card variant="default">
            <div className="font-mono mb-3" style={{ fontSize: 9, letterSpacing: 4, color: "#7a82a0" }}>
              NEXT SESSION
            </div>
            <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 22, color: "#e6e9f5", lineHeight: 1.25 }}>
              No session on the books.
            </p>
            <p className="mt-2 text-[13px]" style={{ color: "#7a82a0" }}>
              Pick a slot when it suits you — your tutor will confirm in a few hours.
            </p>
            <a
              href="/portal/schedule"
              className="inline-flex items-center gap-1.5 mt-4 text-[#7dd3fc] hover:text-[#bde9ff] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              Book a session <ArrowRight size={11} />
            </a>
          </Card>
        )}
        <EstimatedRangeCard />
      </div>

      <ConstellationsCard onSelect={onSelectSkill} />

      <SessionHistoryCard />

      <Card variant="default">
        <div className="flex justify-between font-mono mb-4" style={{ fontSize: 9, letterSpacing: 4, color: "#7a82a0" }}>
          <span>NOTES FROM {tutorName.toUpperCase()}</span>
          <span>{notes.length} total</span>
        </div>
        {notes.length === 0 ? (
          <Text variant="small">
            No tutor notes yet. After your first session, recap notes will land here so you can
            reread the throughline of your sessions in one place.
          </Text>
        ) : (
          <ul className="space-y-5">
            {notes.map((n) => (
              <li key={n.id} className="pb-5" style={{ borderBottom: "1px solid #1e2542" }}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[var(--text-1)] text-[13px] font-semibold">{n.author}</span>
                  <span className="text-[var(--text-3)] text-[10px] font-mono tracking-wider">
                    {formatShortDate(n.createdAt)}
                  </span>
                </div>
                <Text variant="small">{n.body}</Text>
              </li>
            ))}
          </ul>
        )}
        <a
          href="/portal/messages"
          className="inline-flex items-center gap-1.5 mt-2 text-[#7dd3fc] hover:text-[#bde9ff] font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
        >
          Message {tutorName} <ArrowRight size={11} />
        </a>
      </Card>
    </div>
  );
}

function SkyEmptyState() {
  return (
    <div className="h-full flex items-center justify-center px-7" style={{ color: "#e6e9f5" }}>
      <div className="max-w-md text-center">
        <p className="font-mono mb-4" style={{ fontSize: 9, letterSpacing: 4, color: "#7a82a0" }}>
          YOUR SKY
        </p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontSize: 28, lineHeight: 1.15 }}>
          Take your intake to unlock the constellation map.
        </p>
        <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#7a82a0" }}>
          The sky is built from your adaptive diagnostic — every skill becomes a star, lit by
          how you handle it. Without an intake on file, there&apos;s nothing to draw yet.
        </p>
        <a
          href="/portal/diagnostic"
          className="inline-flex items-center gap-1.5 mt-6 px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors"
          style={{ background: "#7dd3fc", color: "#070914", borderRadius: 3 }}
        >
          Begin your intake <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}

function formatDelta(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "TODAY";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days >= 7) return `${Math.floor(days / 7)} WK`;
  return `${days} D`;
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
