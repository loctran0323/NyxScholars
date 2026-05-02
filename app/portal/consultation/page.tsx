import { Compass, ArrowRight, TrendingUp, Clock, Flame, Target } from "lucide-react";
import {
  Heading, Text, Card, CTA, PlotEmbed, Eyelet,
} from "@/components/system";
import { mockDashboard, type ConsultationDashboardData } from "@/lib/mock/consultationDashboard";

export const metadata = { title: "Consultation" };

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
  const color = isPositive ? "text-[var(--accent-2)]" : "text-red-400";
  const sign = isPositive ? "+" : "";
  return <span className={`font-mono text-[12px] ${color}`}>{sign}{delta}</span>;
}

export default function ConsultationDashboardPage() {
  const d: ConsultationDashboardData = mockDashboard;
  return (
    <div className="px-5 sm:px-8 py-10 md:py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center">
            <Compass size={16} className="text-[var(--accent)]" />
          </span>
          <div>
            <Heading level={3} className="!text-[18px]">Consultation</Heading>
            <p className="text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.14em]">
              {d.student.name} · {d.student.plan} plan
            </p>
          </div>
        </div>
        <p className="text-[var(--text-2)] text-[13px] font-mono">
          Next session <span className="text-[var(--text-1)]">{daysUntil(d.student.nextSessionAt)}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
        <KpiCard
          icon={Flame}
          label="Streak"
          value={`${d.kpis.streakDays}`}
          unit="days"
        />
        <KpiCard
          icon={Target}
          label="Target"
          value={`${d.kpis.targetScore}`}
          unit="goal"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card variant="default">
            <div className="flex items-center justify-between mb-5">
              <div>
                <Eyelet index="01" label="Trajectory" />
                <Heading level={4} className="mt-2">Score over the last 12 weeks</Heading>
              </div>
            </div>
            <PlotEmbed
              caption="Adaptive ability estimate · weekly"
              source="Nyx engine"
              aspect="landscape"
            />
          </Card>

          <Card variant="default">
            <div className="mb-5">
              <Eyelet index="02" label="Mastery" />
              <Heading level={4} className="mt-2">Skill heatmap</Heading>
            </div>
            <MasteryHeatmap items={d.mastery} />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {d.upcomingSession ? (
            <Card variant="elevated">
              <Eyelet index="03" label="Upcoming session" />
              <Heading level={4} className="mt-3 mb-1">{d.upcomingSession.topic}</Heading>
              <p className="text-[var(--text-2)] text-[13.5px] mb-4">
                with {d.upcomingSession.tutor}
              </p>
              <p className="text-[var(--text-1)] text-[14px] font-mono mb-5">
                {formatDate(d.upcomingSession.startsAt)}
              </p>
              <CTA href="/portal/sessions" variant="primary" size="default" className="w-full">
                View session
              </CTA>
            </Card>
          ) : null}

          <Card variant="ghost">
            <Eyelet index="04" label="Tutor notes" />
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
            <Eyelet index="05" label="Recommended" />
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
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent)]"
                      style={{ width: `${Math.round(r.mastery * 100)}%` }}
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
