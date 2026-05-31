import Link from "next/link";
import { format, formatDistanceToNow, formatDistanceToNowStrict, differenceInMinutes } from "date-fns";
import {
  CalendarPlus, BookOpen, MessageSquare, Calendar, ChevronRight, Clock,
  Sparkles, Target, CheckCircle2, PlayCircle, Infinity as InfinityIcon,
} from "lucide-react";
import { FEATURES } from "@/lib/features";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalSection } from "@/components/portal/PortalSection";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { Stat } from "@/components/portal/Stat";
import { QuickLink } from "@/components/portal/QuickLink";
import { EmptyTile } from "@/components/portal/EmptyTile";
import {
  NextSessionCard, DailyReviewCard, MessagesPreviewCard,
} from "@/components/portal/TodayCards";
import { Badge } from "@/components/ui/badge";
import { requirePortalUser } from "@/lib/portal-auth";
import { sessionStatusVariant, planLabel, initials } from "@/lib/sessions";
import type { Profile, Session, Message, Assignment } from "@/types/portal";

export default async function PortalDashboard() {
  const { supabase, user } = await requirePortalUser();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const dueCutoff = new Date().toISOString();

  const [
    { data: profile },
    { data: upcomingSessionsRaw },
    { data: completedRowsRaw },
    { data: messagesRaw },
    { data: assignmentsRaw },
    { data: lastDiagnostic },
    { count: dueCardCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("sessions").select("*")
      .eq("student_id", user.id)
      .in("status", ["pending", "confirmed"])
      .gte("scheduled_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(4),
    supabase
      .from("sessions").select("id, scheduled_at, duration_minutes, subject")
      .eq("student_id", user.id)
      .eq("status", "completed")
      .gte("scheduled_at", sevenDaysAgo)
      .order("scheduled_at", { ascending: false }),
    supabase
      .from("messages").select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("assignments").select("*").eq("student_id", user.id).eq("active", true),
    supabase
      .from("diagnostic_attempts").select("created_at, theta_after")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("srs_cards").select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("due_at", dueCutoff),
  ]);

  const typedProfile     = profile as Profile | null;
  const upcomingSessions = (upcomingSessionsRaw ?? []) as Session[];
  const messages         = (messagesRaw ?? []) as Message[];
  const assignments      = (assignmentsRaw ?? []) as Assignment[];
  const completedRows    = (completedRowsRaw ?? []) as Pick<Session, "id" | "scheduled_at" | "duration_minutes" | "subject">[];
  const latest           = lastDiagnostic as { created_at: string; theta_after: number | null } | null;

  const completedHoursThisWeek = completedRows.reduce((sum, s) => sum + (s.duration_minutes ?? 60) / 60, 0);
  const teacherIds = Array.from(new Set(assignments.map((a) => a.teacher_id)));
  const { data: teacherProfiles } = teacherIds.length
    ? await supabase.from("profiles").select("id, full_name, school").in("id", teacherIds)
    : { data: [] };
  const teacherById = new Map((teacherProfiles ?? []).map((t) => [t.id, t as Profile]));

  const unreadCount = messages.filter((m) => m.sender === "nyx" && !m.read).length;
  const displayName = typedProfile?.full_name || user.email?.split("@")[0] || "Student";
  const firstName   = displayName.split(" ")[0];

  const nextSession = upcomingSessions[0] ?? null;
  const minsToNext  = nextSession ? differenceInMinutes(new Date(nextSession.scheduled_at), new Date()) : null;
  const isLive      = minsToNext != null && minsToNext <= 15 && minsToNext >= -90;

  const today = format(new Date(), "EEEE, MMMM d");
  const targetLine = typedProfile?.target_test
    ? `${typedProfile.target_test} ${typedProfile.target_score ?? ""}`.trim()
    : "your sky";
  const subtitleLine = typedProfile?.target_test
    ? `Two sessions a week and your daily eight-minute deck. You're on the arc.`
    : "Set a target test in your profile so we can shape the next ninety days around it.";

  return (
    <div className="space-y-10">
      <PortalHero
        eyebrow={today}
        title={`Welcome back, ${firstName}.`}
        italic={targetLine}
        subtitle={subtitleLine}
        actions={
          <Link
            href="/portal/upgrade"
            className="text-[11.5px] font-mono uppercase tracking-[0.2em] px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-accent)] hover:text-[var(--accent)] transition-colors"
          >
            {planLabel(typedProfile?.plan)}
          </Link>
        }
      />

      <OnboardingChecklist profile={typedProfile} />

      <PortalSection label="Today">
        <div className="grid lg:grid-cols-3 gap-3">
          <NextSessionCard session={nextSession} live={isLive} minutesUntil={minsToNext} />
          <DailyReviewCard dueCount={dueCardCount ?? 0} />
          <MessagesPreviewCard messages={messages.slice(0, 1)} unreadCount={unreadCount} />
        </div>
      </PortalSection>

      <PortalSection
        label="This week"
        action={
          <Link href="/portal/sessions" className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors">
            All sessions →
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Hours studied" value={completedHoursThisWeek.toFixed(1)} sub="last 7 days" />
          <Stat label="Sessions done" value={String(completedRows.length)} sub="this week" />
          <Stat label="Cards due"     value={String(dueCardCount ?? 0)}     sub="practice queue" href="/portal/practice" />
          <Stat
            label={latest ? "Last intake" : "Take intake"}
            value={latest ? formatDistanceToNowStrict(new Date(latest.created_at)) : "—"}
            sub={latest ? "tap to retake" : "14 questions"}
            href="/portal/diagnostic"
          />
        </div>
      </PortalSection>

      {assignments.length > 0 && (
        <PortalSection label="Your tutor">
          <div className="space-y-2">
            {assignments.map((a) => {
              const tutor = teacherById.get(a.teacher_id);
              return (
                <article
                  key={a.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex items-center gap-5"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center text-[var(--accent)] text-[18px] font-semibold uppercase">
                    {initials(tutor?.full_name ?? null)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-semibold text-[var(--text-1)] truncate">
                      {tutor?.full_name ?? "Tutor TBD"}
                    </p>
                    <p className="text-[12.5px] text-[var(--text-3)] truncate mt-0.5">
                      {[a.subject ?? "All subjects", tutor?.school].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Link
                    href="/portal/messages"
                    className="text-[12.5px] font-semibold text-[var(--accent)] hover:text-[var(--accent-bright)] px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-accent)] transition-colors flex items-center gap-1"
                  >
                    Message
                    <ChevronRight size={12} />
                  </Link>
                </article>
              );
            })}
          </div>
        </PortalSection>
      )}

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-3">
        <PortalSection
          label="Upcoming sessions"
          action={
            <Link href="/portal/schedule" className="text-[var(--accent)] hover:text-[var(--accent-bright)] inline-flex items-center gap-1">
              <CalendarPlus size={11} /> Schedule
            </Link>
          }
        >
          {upcomingSessions.length === 0 ? (
            <EmptyTile
              icon={Calendar}
              title="Nothing booked yet."
              body="Pick a slot when it suits you — your matched tutor will confirm in a few hours."
              cta={{ href: "/portal/schedule", label: "Schedule a session" }}
            />
          ) : (
            <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
              {upcomingSessions.map((session) => (
                <li key={session.id}>
                  <Link
                    href={`/portal/sessions/${session.id}`}
                    className="flex items-start gap-4 px-4 py-3.5 hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9.5px] text-[var(--text-3)] font-semibold uppercase">
                        {format(new Date(session.scheduled_at), "MMM")}
                      </span>
                      <span className="text-[16px] font-semibold text-[var(--text-1)] leading-tight">
                        {format(new Date(session.scheduled_at), "d")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-[13.5px] font-semibold text-[var(--text-1)] truncate">{session.subject}</p>
                        <Badge variant={sessionStatusVariant(session.status)} size="sm">{session.status}</Badge>
                      </div>
                      <p className="text-[12px] text-[var(--text-2)] mt-0.5 flex items-center gap-1.5">
                        <Clock size={11} className="text-[var(--text-3)]" />
                        {format(new Date(session.scheduled_at), "EEE h:mm a")} · {session.duration_minutes}m
                        {session.tutor_name && (
                          <>
                            <span className="text-[var(--text-3)]">·</span>
                            <span className="text-[var(--text-3)]">{session.tutor_name}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <ChevronRight size={13} className="text-[var(--text-3)] mt-1 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PortalSection>

        <PortalSection
          label="Recent activity"
          action={
            <Link href="/portal/messages" className="text-[var(--accent)] hover:text-[var(--accent-bright)]">
              All →
            </Link>
          }
        >
          {messages.length === 0 && completedRows.length === 0 ? (
            <EmptyTile
              icon={MessageSquare}
              title="Quiet week."
              body="Once your sessions and messages start flowing they'll appear here."
            />
          ) : (
            <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
              {messages.slice(0, 3).map((msg) => (
                <li key={msg.id}>
                  <Link
                    href="/portal/messages"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className={
                      "w-7 h-7 rounded-full grid place-items-center shrink-0 text-[10px] font-semibold border " +
                      (msg.sender === "nyx"
                        ? "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--border-accent)]"
                        : "bg-white/[0.05] text-[var(--text-2)] border-[var(--border)]")
                    }>
                      {msg.sender === "nyx" ? "N" : "You"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] text-[var(--text-1)] truncate">{msg.content}</p>
                      <p className="text-[10.5px] text-[var(--text-3)] mt-0.5">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {msg.sender === "nyx" && !msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                    )}
                  </Link>
                </li>
              ))}
              {completedRows.slice(0, 2).map((s) => (
                <li key={`done-${s.id}`}>
                  <Link
                    href={`/portal/sessions/${s.id}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full grid place-items-center shrink-0 bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/25">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] text-[var(--text-1)] truncate">
                        Completed <span className="text-[var(--text-2)]">{s.subject}</span>
                      </p>
                      <p className="text-[10.5px] text-[var(--text-3)] mt-0.5">
                        {formatDistanceToNow(new Date(s.scheduled_at), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </PortalSection>
      </div>

      <PortalSection label="Jump to">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <QuickLink href="/portal/adaptive"   icon={InfinityIcon} label="Endless practice" />
          <QuickLink href="/portal/diagnostic" icon={Sparkles}   label="Adaptive intake" />
          {FEATURES.lessons ? (
            <QuickLink href="/portal/lessons"  icon={PlayCircle} label="Video lessons" />
          ) : (
            <QuickLink href="/portal/mock-tests" icon={Target}   label="Mock tests" />
          )}
          <QuickLink href="/portal/materials"  icon={BookOpen}   label="Practice library" />
        </div>
      </PortalSection>
    </div>
  );
}
