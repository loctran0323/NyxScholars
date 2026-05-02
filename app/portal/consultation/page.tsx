"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Text, Card } from "@/components/system";
import { mockDashboard, type ConsultationDashboardData } from "@/lib/mock/consultationDashboard";
import { ALL_SKILLS } from "@/lib/mock/constellations";
import { Sky, SkillSheet } from "@/components/portal/Sky";
import {
  StudentHeader, DashTabs, AssignedDrillsCard, EstimatedRangeCard,
  ConstellationsCard, NextSessionCard, SessionHistoryCard,
} from "@/components/portal/SkyAccessories";

function daysUntil(iso: string | null): string {
  if (!iso) return "TBD";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "today";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ConsultationDashboardPage() {
  const d: ConsultationDashboardData = mockDashboard;
  const [view, setView] = useState<"sky" | "metrics">("sky");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedSkill = ALL_SKILLS.find((s) => s.id === selectedId) ?? null;
  const tutorName = "Loc";

  return (
    <div className="-mx-5 md:-mx-8 -my-7 md:-my-9 flex flex-col h-[calc(100dvh-56px)] md:h-[calc(100vh-0px)] min-h-[680px]">
      <StudentHeader
        studentName={d.student.name}
        studentInitials={d.student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        tutorName={tutorName}
        packageLabel={`${d.student.plan} package`}
        nextSession={daysUntil(d.student.nextSessionAt)}
      />

      <DashTabs view={view} setView={setView} />

      <div className="flex-1 overflow-hidden relative" style={{ background: "#070914" }}>
        {view === "sky" ? (
          <div className="relative w-full h-full">
            <Sky
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <SkillSheet skill={selectedSkill} onClose={() => setSelectedId(null)} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-5 md:px-7 py-7" style={{ color: "#e6e9f5" }}>
            <MetricsView d={d} tutorName={tutorName} onSelectSkill={setSelectedId} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Metrics view — slimmed from 9 cards to 5: the things a real
 * student / parent / tutor actually look at.
 * ─────────────────────────────────────────────────────────── */
function MetricsView({
  d, tutorName, onSelectSkill,
}: {
  d: ConsultationDashboardData;
  tutorName: string;
  onSelectSkill: (id: string | null) => void;
}) {
  return (
    <div className="space-y-5 max-w-[1100px]">
      {/* Top row — the two most-looked-at cards */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {d.upcomingSession ? (
          <NextSessionCard
            tutorName={tutorName}
            whenLabel={formatDate(d.upcomingSession.startsAt)}
            topic={d.upcomingSession.topic}
            whyLine="Setup strategies on word problems — the lowest mastery from your last drill."
          />
        ) : null}
        <EstimatedRangeCard />
      </div>

      {/* What your tutor assigned */}
      <AssignedDrillsCard assignedBy={tutorName} />

      {/* The constellation list — single picture of the whole sky */}
      <ConstellationsCard onSelect={onSelectSkill} />

      {/* Session history — calm, no streak boasting */}
      <SessionHistoryCard />

      {/* Tutor notes — the actual conversation, not a "feed" */}
      <Card variant="default">
        <div className="flex justify-between font-mono mb-4" style={{ fontSize: 9, letterSpacing: 4, color: "#7a82a0" }}>
          <span>NOTES FROM {tutorName.toUpperCase()}</span>
          <span>{d.notes.length} total</span>
        </div>
        <ul className="space-y-5">
          {d.notes.map((n) => (
            <li key={n.id} className="pb-5" style={{ borderBottom: "1px solid #1e2542" }}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[var(--text-1)] text-[13px] font-semibold">{n.author}</span>
                <span className="text-[var(--text-3)] text-[10px] font-mono tracking-wider">{formatDate(n.createdAt)}</span>
              </div>
              <Text variant="small">{n.body}</Text>
            </li>
          ))}
        </ul>
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
