"use client";

import { useState } from "react";
import { Compass, ArrowRight, TrendingUp, Clock, Flame, Target } from "lucide-react";
import {
  Heading, Text, Card, CTA, PlotEmbed, Eyelet,
} from "@/components/system";
import { mockDashboard, type ConsultationDashboardData } from "@/lib/mock/consultationDashboard";
import { ALL_SKILLS } from "@/lib/mock/constellations";
import { Sky, SkillSheet } from "@/components/portal/Sky";
import {
  PlayerHeader, DashTabs, DailyPlanCard, ProjectedScoreCard,
  ConstellationsCard, ActivityHeatmap, AchievementsCard,
} from "@/components/portal/SkyAccessories";

function daysUntil(iso: string | null): string {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Today";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return `in ${days}d`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function masteryToPercent(m: number): string {
  return `${Math.round(m * 100)}%`;
}

function deltaBadge(delta: number | null) {
  if (delta == null) return null;
  const isPositive = delta >= 0;
  const color = isPositive ? "text-[#7dd3fc]" : "text-red-400";
  const sign = isPositive ? "+" : "";
  return <span className={`font-mono text-[12px] ${color}`}>{sign}{delta}</span>;
}

export default function ConsultationDashboardPage() {
  const d: ConsultationDashboardData = mockDashboard;
  const [view, setView] = useState<"sky" | "metrics">("sky");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedSkill = ALL_SKILLS.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="-mx-5 md:-mx-8 -my-7 md:-my-9 flex flex-col h-[calc(100dvh-56px)] md:h-[calc(100vh-0px)] min-h-[680px]">
      {/* Top compass identity row — keeps the existing student header info */}
      <div
        className="flex items-center justify-between gap-4 px-5 sm:px-7 py-3 border-b"
        style={{ background: "#070914", borderColor: "#1e2542" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-md grid place-items-center"
            style={{ background: "rgba(125,211,252,0.10)", border: "1px solid rgba(125,211,252,0.32)" }}
          >
            <Compass size={14} className="text-[#7dd3fc]" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#7a82a0]">Consultation</p>
            <p className="text-[13px] text-[#e6e9f5]">
              {d.student.name} · {d.student.plan} plan
            </p>
          </div>
        </div>
        <p className="text-[12px] font-mono text-[#7a82a0]">
          Next session <span className="text-[#e6e9f5]">{daysUntil(d.student.nextSessionAt)}</span>
        </p>
      </div>

      {/* Player gamification strip */}
      <PlayerHeader />

      {/* Tabs */}
      <DashTabs view={view} setView={setView} />

      {/* View body */}
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
            <MetricsView d={d} onSelectSkill={setSelectedId} />
          </div>
        )}
      </div>
    </div>
  );
}

function MetricsView({
  d,
  onSelectSkill,
}: {
  d: ConsultationDashboardData;
  onSelectSkill: (id: string | null) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Existing KPI strip preserved */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={TrendingUp}
          label="Diagnostic"
          value={`${d.kpis.diagnosticScore.value}`}
          unit={`/ ${d.kpis.diagnosticScore.outOf}`}
          delta={deltaBadge(d.kpis.diagnosticScore.deltaFromLast)}
        />
        <KpiCard
          icon={Clock}
          label={`Practice · ${d.kpis.practiceHours.window}`}
          value={`${d.kpis.practiceHours.value}`}
          unit="hrs"
        />
        <KpiCard icon={Flame} label="Streak" value={`${d.kpis.streakDays}`} unit="days" />
        <KpiCard icon={Target} label="Target" value={`${d.kpis.targetScore}`} unit="goal" />
      </div>

      {/* Top row: Daily plan + Projected score (dashboard-v2 cards) */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <DailyPlanCard />
        <ProjectedScoreCard />
      </div>

      {/* Existing trajectory plot kept — second-tier visual for those who like the wide view */}
      <Card variant="default">
        <div className="mb-5">
          <Eyelet index="03" label="Trajectory · wide" />
          <Heading level={4} className="mt-2">Score over the last 12 weeks</Heading>
        </div>
        <PlotEmbed
          caption="Adaptive ability estimate · weekly"
          source="Nyx engine"
          aspect="landscape"
        />
      </Card>

      {/* Mid row: Constellations card + Activity / Achievements stacked */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 items-start">
        <ConstellationsCard onSelect={onSelectSkill} />
        <div className="flex flex-col gap-5">
          <ActivityHeatmap />
          <AchievementsCard />
        </div>
      </div>

      {/* Existing skill heatmap kept — distinct from the constellation list */}
      <Card variant="default">
        <div className="mb-5">
          <Eyelet index="04" label="Skill mastery · linear view" />
          <Heading level={4} className="mt-2">Heatmap by section</Heading>
        </div>
        <MasteryHeatmap items={d.mastery} />
      </Card>

      {/* Existing rail (upcoming session, notes, recommendations) */}
      <div className="grid lg:grid-cols-3 gap-5">
        {d.upcomingSession ? (
          <Card variant="elevated">
            <Eyelet index="05" label="Upcoming session" />
            <Heading level={4} className="mt-3 mb-1">{d.upcomingSession.topic}</Heading>
            <p className="text-[var(--text-2)] text-[13.5px] mb-4">with {d.upcomingSession.tutor}</p>
            <p className="text-[var(--text-1)] text-[14px] font-mono mb-5">
              {formatDate(d.upcomingSession.startsAt)}
            </p>
            <CTA href="/portal/sessions" variant="primary" size="default" className="w-full">
              View session
            </CTA>
          </Card>
        ) : null}

        <Card variant="ghost">
          <Eyelet index="06" label="Tutor notes" />
          <ul className="mt-4 space-y-4">
            {d.notes.map((n) => (
              <li key={n.id} className="border-l-2 border-[var(--border-accent)] pl-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[var(--text-1)] text-[13.5px] font-semibold">{n.author}</span>
                  <span className="text-[var(--text-3)] text-[11px] font-mono">{formatDate(n.createdAt)}</span>
                </div>
                <Text variant="small">{n.body}</Text>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="accent">
          <Eyelet index="07" label="Recommended" />
          <ul className="mt-4 space-y-3">
            {d.recommendations.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 py-2">
                <span className="text-[var(--text-1)] text-[14px]">{r.title}</span>
                <a
                  href={r.href}
                  className="inline-flex items-center gap-1 text-[var(--accent)] text-[12px] font-semibold hover:text-[var(--accent-bright)] transition-colors"
                >
                  {r.cta}
                  <ArrowRight size={12} />
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, unit, delta,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  unit?: string;
  delta?: React.ReactNode;
}) {
  return (
    <Card variant="ghost">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--text-3)] text-[11px] font-mono uppercase tracking-[0.14em]">{label}</span>
        <Icon size={14} className="text-[var(--text-3)]" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] text-[36px] leading-none">{value}</span>
        {unit ? <span className="text-[var(--text-3)] text-[12px]">{unit}</span> : null}
      </div>
      {delta ? <div className="mt-2">{delta}</div> : null}
    </Card>
  );
}

function MasteryHeatmap({ items }: { items: ConsultationDashboardData["mastery"] }) {
  const sections: ("Math" | "RW")[] = ["Math", "RW"];
  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const rows = items.filter((i) => i.section === section);
        return (
          <div key={section}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--text-2)] text-[12px] uppercase tracking-[0.16em] font-mono">{section}</span>
            </div>
            <div className="space-y-2.5">
              {rows.map((r) => (
                <div key={r.skill} className="grid grid-cols-12 items-center gap-3">
                  <span className="col-span-5 text-[var(--text-1)] text-[13.5px] truncate">{r.skill}</span>
                  <div className="col-span-6 h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(r.mastery * 100)}%`,
                        background: "linear-gradient(90deg, #3b7a99, #7dd3fc 60%, #bde9ff)",
                      }}
                    />
                  </div>
                  <span className="col-span-1 text-right text-[var(--text-3)] text-[12px] font-mono">
                    {masteryToPercent(r.mastery)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
