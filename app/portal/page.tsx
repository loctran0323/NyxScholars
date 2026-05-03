import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow, formatDistanceToNowStrict, differenceInMinutes } from "date-fns";
import {
  CalendarPlus,
  BookOpen,
  MessageSquare,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Sparkles,
  Target,
  CheckCircle2,
  ClipboardList,
  PlayCircle,
} from "lucide-react";
import { PortalHero } from "@/components/portal/PortalHero";
import { PortalSection } from "@/components/portal/PortalSection";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { Badge } from "@/components/ui/badge";
import type { Profile, Session, Message, Assignment } from "@/types/portal";

function statusVariant(status: string): "gold" | "blue" | "green" | "red" | "default" {
  switch (status) {
    case "confirmed": return "blue";
    case "completed": return "green";
    case "cancelled": return "red";
    default: return "gold";
  }
}

function planLabel(plan: string | null | undefined): string {
  switch (plan) {
    case "session":    return "Session · pay as you go";
    case "monthly":    return "Scholar · 4 sessions / month";
    case "counseling": return "Concierge · custom-quoted";
    default:           return "Trial — choose a plan to begin";
  }
}

export default async function PortalDashboard() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: profile },
    { data: upcomingSessions },
    { data: completedThisWeek },
    { data: messages },
    { data: assignments },
    { data: lastDiagnostic },
    { data: dueCards },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("sessions")
      .select("*")
      .eq("student_id", user.id)
      .in("status", ["pending", "confirmed"])
      .gte("scheduled_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(4),
    supabase
      .from("sessions")
      .select("id, scheduled_at, duration_minutes, subject")
      .eq("student_id", user.id)
      .eq("status", "completed")
      .gte("scheduled_at", sevenDaysAgo)
      .order("scheduled_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("assignments")
      .select("*")
      .eq("student_id", user.id)
      .eq("active", true),
    supabase
      .from("diagnostic_attempts")
      .select("created_at, theta_after")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("srs_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("due_at", new Date().toISOString()),
  ]);

  const typedProfile = profile as Profile | null;
  const typedSessions = (upcomingSessions ?? []) as Session[];
  const typedMessages = (messages ?? []) as Message[];
  const typedAssignments = (assignments ?? []) as Assignment[];
  const completedRows = (completedThisWeek ?? []) as Pick<Session, "id" | "scheduled_at" | "duration_minutes" | "subject">[];
  const completedHoursThisWeek = completedRows.reduce((sum, s) => sum + (s.duration_minutes ?? 60) / 60, 0);
  const latestDiagnostic = (lastDiagnostic as unknown as { created_at: string; theta_after: number | null }[] | null)?.[0] ?? null;
  const dueCardCount = (dueCards as unknown as { length?: number; count?: number } | null)?.count ?? 0;

  const teacherIds = Array.from(new Set(typedAssignments.map((a) => a.teacher_id)));
  const { data: teacherProfiles } = teacherIds.length
    ? await supabase.from("profiles").select("id, full_name, school").in("id", teacherIds)
    : { data: [] };
  const teacherById = new Map((teacherProfiles ?? []).map((t) => [t.id, t as Profile]));

  const unreadCount = typedMessages.filter((m) => m.sender === "nyx" && !m.read).length;
  const displayName = typedProfile?.full_name || user.email?.split("@")[0] || "Student";
  const firstName = displayName.split(" ")[0];

  const nextSession = typedSessions[0] ?? null;
  const minsToNext = nextSession ? differenceInMinutes(new Date(nextSession.scheduled_at), new Date()) : null;
  const isLive = minsToNext != null && minsToNext <= 15 && minsToNext >= -90;

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="space-y-10">
      <PortalHero
        eyebrow={today}
        title={`Welcome back, ${firstName}.`}
        italic={typedProfile?.target_test ? `${typedProfile.target_test} ${typedProfile.target_score ?? ""}`.trim() : "your sky"}
        subtitle={typedProfile?.target_test
          ? `Two sessions a week and your daily eight-minute deck. You're on the arc.`
          : "Set a target test in your profile so we can shape the next ninety days around it."}
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

      {/* Today — composite hero with three lanes */}
      <PortalSection label="Today">
        <div className="grid lg:grid-cols-3 gap-3">
          <NextSessionCard session={nextSession} live={isLive} minutesUntil={minsToNext} />
          <DailyReviewCard dueCount={dueCardCount} />
          <MessagesCard
            messages={typedMessages.slice(0, 3)}
            unreadCount={unreadCount}
          />
        </div>
      </PortalSection>

      {/* This week trajectory */}
      <PortalSection
        label="This week"
        action={
          <Link href="/portal/sessions" className="text-[var(--text-2)] hover:text-[var(--accent)] transition-colors">
            All sessions →
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Hours studied"  value={completedHoursThisWeek.toFixed(1)} sub="last 7 days" />
          <Stat label="Sessions done"  value={String(completedRows.length)}      sub="this week" />
          <Stat label="Cards due"      value={String(dueCardCount)}              sub="practice queue" href="/portal/practice" />
          <Stat
            label={latestDiagnostic ? "Last intake" : "Take intake"}
            value={latestDiagnostic ? formatDistanceToNowStrict(new Date(latestDiagnostic.created_at)) : "—"}
            sub={latestDiagnostic ? "tap to retake" : "14 questions"}
            href="/portal/diagnostic"
          />
        </div>
      </PortalSection>

      {/* Tutor card */}
      {typedAssignments.length > 0 && (
        <PortalSection label="Your tutor">
          <div className="space-y-2">
            {typedAssignments.map((a) => {
              const tutor = teacherById.get(a.teacher_id);
              const tutorInitials = (tutor?.full_name ?? "—")
                .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <article
                  key={a.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex items-center gap-5"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center text-[var(--accent)] text-[18px] font-semibold uppercase">
                    {tutorInitials}
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

      {/* Upcoming + activity */}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-3">
        <PortalSection
          label="Upcoming sessions"
          action={
            <Link href="/portal/schedule" className="text-[var(--accent)] hover:text-[var(--accent-bright)] inline-flex items-center gap-1">
              <CalendarPlus size={11} /> Schedule
            </Link>
          }
        >
          {typedSessions.length === 0 ? (
            <EmptyTile
              icon={Calendar}
              title="Nothing booked yet."
              body="Pick a slot when it suits you — your matched tutor will confirm in a few hours."
              cta={{ href: "/portal/schedule", label: "Schedule a session" }}
            />
          ) : (
            <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
              {typedSessions.map((session) => (
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
                        <Badge variant={statusVariant(session.status)} size="sm">{session.status}</Badge>
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
          {typedMessages.length === 0 && completedRows.length === 0 ? (
            <EmptyTile
              icon={MessageSquare}
              title="Quiet week."
              body="Once your sessions and messages start flowing they'll appear here."
            />
          ) : (
            <ul className="rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden">
              {typedMessages.slice(0, 3).map((msg) => (
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

      {/* Quick paths */}
      <PortalSection label="Jump to">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <QuickLink href="/portal/diagnostic" icon={Sparkles}     label="Adaptive intake" />
          <QuickLink href="/portal/lessons"    icon={PlayCircle}   label="Video lessons" />
          <QuickLink href="/portal/mock-tests" icon={Target}       label="Mock tests" />
          <QuickLink href="/portal/materials"  icon={BookOpen}     label="Practice library" />
        </div>
      </PortalSection>
    </div>
  );
}

function NextSessionCard({
  session,
  live,
  minutesUntil,
}: {
  session: Session | null;
  live: boolean;
  minutesUntil: number | null;
}) {
  if (!session) {
    return (
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)] font-semibold mb-2">
          <Calendar size={12} />
          Next session
        </div>
        <p className="text-[15px] font-semibold text-[var(--text-1)] flex-1 mt-2">No session scheduled.</p>
        <Link
          href="/portal/schedule"
          className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--gold-soft)] text-[var(--on-gold)] text-[12.5px] font-semibold"
        >
          <CalendarPlus size={12} />
          Book a slot
        </Link>
      </article>
    );
  }
  const liveLabel = minutesUntil != null && minutesUntil >= 1
    ? `Starts in ${minutesUntil}m`
    : minutesUntil != null && minutesUntil >= -15
      ? "Live now"
      : "Recently started";
  return (
    <article
      className={
        "rounded-2xl border p-5 flex flex-col transition-colors " +
        (live ? "border-[var(--border-accent)] bg-[var(--accent-dim)]" : "border-[var(--border)] bg-[var(--surface)]")
      }
    >
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] font-semibold mb-2"
        style={{ color: live ? "var(--accent)" : "var(--text-3)" }}
      >
        {live ? <span className="live-dot" /> : <Calendar size={12} />}
        {live ? liveLabel : "Next session"}
      </div>
      <p className="text-[15px] font-semibold text-[var(--text-1)] truncate">{session.subject}</p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">
        {format(new Date(session.scheduled_at), "EEE, MMM d · h:mm a")}
        {session.tutor_name && ` · ${session.tutor_name}`}
      </p>
      <div className="mt-auto pt-4">
        {live && session.meeting_link ? (
          <a
            href={session.meeting_link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] text-[12.5px] font-semibold w-full"
          >
            Join now <ChevronRight size={12} />
          </a>
        ) : (
          <Link
            href={`/portal/sessions/${session.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-semibold hover:border-[var(--border-2)] w-full transition-colors"
          >
            Open session <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </article>
  );
}

function DailyReviewCard({ dueCount }: { dueCount: number }) {
  const empty = dueCount === 0;
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)] font-semibold mb-2">
        <Sparkles size={12} />
        Daily review
      </div>
      <p className="text-[15px] font-semibold text-[var(--text-1)]">
        {empty ? "All caught up." : `${dueCount} card${dueCount === 1 ? "" : "s"} waiting.`}
      </p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">
        {empty
          ? "Come back tomorrow — or push more from a session recap."
          : "Eight focused minutes — re-surface what you got wrong."}
      </p>
      <div className="mt-auto pt-4">
        <Link
          href="/portal/practice"
          className={
            "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold w-full transition-colors " +
            (empty
              ? "border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)]"
              : "bg-[var(--gold-soft)] text-[var(--on-gold)]")
          }
        >
          {empty ? "Review history" : "Start review"} <ChevronRight size={12} />
        </Link>
      </div>
    </article>
  );
}

function MessagesCard({ messages, unreadCount }: { messages: Message[]; unreadCount: number }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-[var(--text-3)] font-semibold">
          <MessageSquare size={12} />
          Messages
        </div>
        {unreadCount > 0 && (
          <Badge variant="blue" size="sm">{unreadCount} new</Badge>
        )}
      </div>
      {messages.length === 0 ? (
        <>
          <p className="text-[15px] font-semibold text-[var(--text-1)]">Nothing new.</p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">Open chat to ping your tutor.</p>
        </>
      ) : (
        <>
          <p className="text-[13.5px] text-[var(--text-1)] line-clamp-2 leading-snug">{messages[0].content}</p>
          <p className="text-[10.5px] text-[var(--text-3)] mt-1.5">
            {messages[0].sender === "nyx" ? "Nyx · " : "You · "}
            {formatDistanceToNow(new Date(messages[0].created_at), { addSuffix: true })}
          </p>
        </>
      )}
      <div className="mt-auto pt-4">
        <Link
          href="/portal/messages"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-semibold hover:border-[var(--border-2)] w-full transition-colors"
        >
          Open messages <ChevronRight size={12} />
        </Link>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string;
  sub: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-3)] font-semibold">{label}</p>
      <p className="text-[26px] sm:text-[30px] font-light text-[var(--text-1)] mt-1.5 leading-none font-[family-name:var(--font-fraunces)]">
        {value}
      </p>
      <p className="text-[11.5px] text-[var(--text-3)] mt-2">{sub}</p>
    </>
  );
  const className =
    "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors";
  if (href) {
    return (
      <Link href={href} className={className + " hover:border-[var(--border-2)] block"}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--border-accent)] transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
        <Icon size={14} className="text-[var(--accent)]" />
      </div>
      <p className="text-[13px] font-semibold text-[var(--text-1)] truncate flex-1">{label}</p>
      <ChevronRight size={13} className="text-[var(--text-3)] group-hover:text-[var(--accent)] transition-colors" />
    </Link>
  );
}

function EmptyTile({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)]/50 p-7 text-center">
      <Icon size={22} className="text-[var(--text-3)] mx-auto mb-3" />
      <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{title}</p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-1.5 max-w-xs mx-auto leading-relaxed">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent)] text-[12.5px] font-semibold"
        >
          <CalendarPlus size={12} />
          {cta.label}
        </Link>
      )}
    </div>
  );
}
