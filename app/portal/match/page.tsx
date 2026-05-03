import Link from "next/link";
import {
  ShieldCheck, CalendarPlus, MessageSquare, Sparkles, Award, Users, Hourglass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalSection } from "@/components/portal/PortalSection";
import { EmptyTile } from "@/components/portal/EmptyTile";
import { requirePortalUser } from "@/lib/portal-auth";
import { initials } from "@/lib/sessions";

export const metadata = { title: "Your tutor match · Nyx" };

interface AssignmentRow {
  id:         string;
  teacher_id: string;
  subject:    string | null;
  created_at: string;
  tutor: {
    full_name:    string | null;
    school:       string | null;
    verified_at:  string | null;
  } | null;
}

export default async function MatchPage() {
  const { supabase, user } = await requirePortalUser();

  const { data: assignmentsRaw } = await supabase
    .from("assignments")
    .select("id, teacher_id, subject, created_at, tutor:profiles!teacher_id(full_name, school, verified_at)")
    .eq("student_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: true });

  const assignments = (assignmentsRaw ?? []) as unknown as AssignmentRow[];

  return (
    <div className="space-y-10 max-w-3xl">
      <PortalHero
        eyebrow="Tutor matchmaking"
        title={assignments.length === 0 ? "Your match" : "Your tutor"}
        italic={assignments.length === 0 ? "is being chosen." : "team."}
        subtitle={
          assignments.length === 0
            ? "We hand-match every student. No marketplaces, no algorithm-only picks — a real Nyx founder reviews your intake and pairs you with someone who's been where you're going."
            : "Each tutor was scored on subject overlap, schedule fit, and prior outcomes with students like you. Book a free 15-minute coffee chat or message them directly."
        }
      />

      {assignments.length === 0 ? (
        <PortalSection label="Status">
          <MatchInProgress />
        </PortalSection>
      ) : (
        <PortalSection label={assignments.length === 1 ? "Your tutor" : "Your tutors"}>
          <div className="space-y-4">
            {assignments.map((a) => <MatchedTutorCard key={a.id} assignment={a} />)}
          </div>
        </PortalSection>
      )}

      <PortalSection label="Don't feel a click?">
        <EmptyTile
          icon={Sparkles}
          title="Re-match, no awkwardness."
          body="Tell us what wasn't working — pace, style, schedule, subject — and we'll re-run the search within a day. No charge until you've had a productive session."
          cta={{ href: "/portal/messages?topic=re-match", label: "Request a re-match" }}
        />
      </PortalSection>
    </div>
  );
}

function MatchedTutorCard({ assignment }: { assignment: AssignmentRow }) {
  const t = assignment.tutor;
  const name = t?.full_name ?? "Tutor TBD";
  const subjects = assignment.subject ?? "All subjects";

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex gap-5 flex-wrap sm:flex-nowrap">
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center text-[var(--accent)] text-[24px] font-semibold uppercase">
        {initials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--text-1)]">{name}</h2>
            {t?.school && <p className="text-[12.5px] text-[var(--text-3)] mt-0.5">{t.school}</p>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {t?.verified_at && (
              <Tooltip content="Verified by Nyx: official score report, current enrollment, and a passing teaching audition.">
                <Badge variant="verified" className="cursor-help">
                  <ShieldCheck size={10} /> Verified
                </Badge>
              </Tooltip>
            )}
            <Badge variant="blue">Assigned</Badge>
            {subjects && <Badge variant="default">{subjects}</Badge>}
          </div>
        </div>

        <p className="text-[13px] text-[var(--text-2)] mt-3 leading-relaxed">
          {t?.school
            ? `Verified ${t.school} tutor — paired with you after a hand review of your intake and target test.`
            : "Paired with you after a hand review of your intake and target test."}
        </p>

        <div className="grid sm:grid-cols-2 gap-2 mt-4">
          <TutorStat icon={Award}       label="Specialty" value={subjects} />
          <TutorStat icon={ShieldCheck} label="Vetted"    value="4-step audit" />
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <Link
            href={`/portal/schedule?tutor=${assignment.teacher_id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[12.5px] hover:bg-[var(--gold-bright)] transition-colors"
          >
            <CalendarPlus size={13} />
            Book a session
          </Link>
          <Link
            href={`/portal/messages?tutor=${assignment.teacher_id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-1)] font-medium text-[12.5px] hover:border-[var(--border-2)] transition-colors"
          >
            <MessageSquare size={13} />
            Send a question
          </Link>
        </div>
      </div>
    </article>
  );
}

function TutorStat({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">
        <Icon size={11} />
        {label}
      </div>
      <p className="text-[13px] font-semibold text-[var(--text-1)]">{value}</p>
    </div>
  );
}

function MatchInProgress() {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
          <Hourglass size={18} className="text-[var(--accent)]" />
        </div>
        <div className="flex-1">
          <p className="text-[14.5px] font-semibold text-[var(--text-1)]">Match in progress</p>
          <p className="text-[13px] text-[var(--text-2)] mt-1 leading-relaxed">
            We typically pair within one business day after your intake is complete. You'll get an email and a portal notification the moment your tutor is set.
          </p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5 text-[12.5px] text-[var(--text-2)]">
        <li className="flex items-start gap-2">
          <Users size={13} className="text-[var(--text-3)] mt-0.5 shrink-0" />
          <span>A Nyx founder reads your diagnostic, target test, and notes — no algorithm-only matches.</span>
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck size={13} className="text-[var(--text-3)] mt-0.5 shrink-0" />
          <span>Every tutor is verified — score report on file, current Ivy enrollment, and a passing teaching audition.</span>
        </li>
        <li className="flex items-start gap-2">
          <Sparkles size={13} className="text-[var(--text-3)] mt-0.5 shrink-0" />
          <span>If the first call doesn't click, the re-match is free.</span>
        </li>
      </ul>
      <div className="flex flex-wrap gap-2 mt-5">
        <Link
          href="/portal/diagnostic"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[12.5px] hover:bg-[var(--gold-bright)] transition-colors"
        >
          <Sparkles size={13} />
          Finish your intake
        </Link>
        <Link
          href="/portal/messages"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border)] text-[var(--text-1)] font-medium text-[12.5px] hover:border-[var(--border-2)] transition-colors"
        >
          <MessageSquare size={13} />
          Add context for your tutor
        </Link>
      </div>
    </article>
  );
}
