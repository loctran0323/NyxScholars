import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
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
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SessionRowActions } from "@/components/portal/SessionRowActions";
import { QuickSchedule } from "@/components/portal/QuickSchedule";
import type { Profile, Session, Message, Assignment } from "@/types/portal";

function statusVariant(status: string) {
  switch (status) {
    case "confirmed": return "blue";
    case "completed": return "green";
    case "cancelled": return "red";
    default: return "gold";
  }
}

function planLabel(plan: string | null | undefined): string {
  switch (plan) {
    case "session":    return "Session Plan · pay as you go";
    case "monthly":    return "Scholar Plan · 4 sessions/mo";
    case "counseling": return "Admissions Plan · custom-quoted";
    default:           return "No active plan";
  }
}

export default async function PortalDashboard() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const [
    { data: profile },
    { data: upcomingSessions },
    { data: completedCount },
    { data: messages },
    { data: assignments },
    { data: lastDiagnostic },
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
      .select("id", { count: "exact", head: false })
      .eq("student_id", user.id)
      .eq("status", "completed"),
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
  ]);

  const typedProfile = profile as Profile | null;
  const typedSessions = (upcomingSessions ?? []) as Session[];
  const typedMessages = (messages ?? []) as Message[];
  const typedAssignments = (assignments ?? []) as Assignment[];
  const completedSessionsCount = (completedCount as unknown as { length?: number })?.length ?? 0;
  const latestDiagnostic = (lastDiagnostic as unknown as { created_at: string; theta_after: number | null }[] | null)?.[0] ?? null;

  const teacherIds = Array.from(new Set(typedAssignments.map((a) => a.teacher_id)));
  const { data: teacherProfiles } = teacherIds.length
    ? await supabase.from("profiles").select("id, full_name, school").in("id", teacherIds)
    : { data: [] };
  const teacherById = new Map((teacherProfiles ?? []).map((t) => [t.id, t as Profile]));

  const unreadCount = typedMessages.filter((m) => m.sender === "nyx" && !m.read).length;
  const displayName = typedProfile?.full_name || user.email?.split("@")[0] || "Student";
  const firstName = displayName.split(" ")[0];

  const nextSession = typedSessions[0] ?? null;
  const minsToNext = nextSession
    ? Math.round((new Date(nextSession.scheduled_at).getTime() - Date.now()) / 60_000)
    : null;
  const showJoinHero = nextSession && minsToNext != null && Math.abs(minsToNext) <= 30;

  return (
    <div className="space-y-7 pb-10">
      {/* Hero strip with personalized greeting + plan */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">
            Dashboard
          </p>
          <h1 className="text-[28px] font-semibold text-[var(--text-1)] leading-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
            {typedProfile?.target_test
              ? `${typedProfile.target_test} prep${typedProfile.target_score ? ` · target ${typedProfile.target_score}` : ""}`
              : "Set a target test in your profile to personalize this view."}
          </p>
        </div>
        <Link
          href="/portal/upgrade"
          className="text-[12px] font-mono uppercase tracking-[0.2em] px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-accent)] hover:text-[var(--accent)] transition-colors"
        >
          {planLabel(typedProfile?.plan)}
        </Link>
      </div>

      {/* Live "join now" hero — only renders within 30 minutes of a session */}
      {showJoinHero && nextSession && (
        <div className="rounded-2xl p-5 border border-[var(--border-accent)] bg-[var(--accent-dim)] flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] mb-1">
              {minsToNext! >= 1 ? `Starts in ${minsToNext}m` : minsToNext! >= -15 ? "Live now" : "Recently started"}
            </p>
            <p className="text-[16px] font-semibold text-[var(--text-1)]">{nextSession.subject}</p>
            <p className="text-[12.5px] text-[var(--text-2)]">
              {format(new Date(nextSession.scheduled_at), "EEE, MMM d · h:mm a")}
              {nextSession.tutor_name && ` · with ${nextSession.tutor_name}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {nextSession.meeting_link ? (
              <a
                href={nextSession.meeting_link}
                target="_blank"
                rel="noreferrer noopener"
                className="px-4 py-2.5 rounded-xl bg-[#0c1124] border border-[var(--accent)] text-[var(--text-1)] font-semibold text-[13px] hover:bg-[#141a30] transition-colors"
              >
                Join meeting
              </a>
            ) : (
              <Link
                href={`/portal/sessions/${nextSession.id}`}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-accent)] text-[var(--accent)] font-semibold text-[13px]"
              >
                Awaiting link
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Tutor card */}
      {typedAssignments.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-3">
            {typedAssignments.length === 1 ? "Your Tutor" : "Your Tutors"}
          </p>
          <div className="space-y-2.5">
            {typedAssignments.map((a) => {
              const tutor = teacherById.get(a.teacher_id);
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
                    <GraduationCap size={16} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--text-1)] truncate">
                      {tutor?.full_name ?? "Tutor (unnamed)"}
                    </p>
                    <p className="text-[11.5px] text-[var(--text-3)] truncate">
                      {[a.subject ?? "All subjects", tutor?.school].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Link
                    href="/portal/messages"
                    className="text-[12px] text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors px-3 py-1.5 rounded-lg border border-[var(--border)]"
                  >
                    Message →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats row — every tile is a real link */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Upcoming"
          value={typedSessions.length}
          icon={Calendar}
          href="/portal/sessions"
          accent="var(--accent)"
        />
        <StatTile
          label="Completed"
          value={completedSessionsCount}
          icon={CheckCircle2}
          href="/portal/sessions"
          accent="#34d399"
        />
        <StatTile
          label="Unread"
          value={unreadCount}
          icon={MessageSquare}
          href="/portal/messages"
          accent={unreadCount > 0 ? "var(--accent)" : "var(--text-3)"}
          highlight={unreadCount > 0}
        />
        <StatTile
          label={latestDiagnostic ? "Last intake" : "Take intake"}
          value={latestDiagnostic
            ? formatDistanceToNow(new Date(latestDiagnostic.created_at), { addSuffix: false })
            : "—"}
          icon={Sparkles}
          href="/portal/diagnostic"
          accent="#a78bfa"
        />
      </div>

      {/* Two-column main row: quick schedule + sessions */}
      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-5">
        <QuickSchedule defaultSubject={typedProfile?.target_test ?? null} />

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[var(--text-3)]" />
              <h2 className="font-semibold text-[var(--text-1)] text-[14.5px]">Upcoming sessions</h2>
            </div>
            <Link
              href="/portal/sessions"
              className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight size={12} />
            </Link>
          </div>
          {typedSessions.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Calendar size={26} className="text-[var(--text-3)] mx-auto mb-3" />
              <p className="text-[13px] text-[var(--text-2)] mb-4">Nothing booked yet.</p>
              <Link
                href="/portal/schedule"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[13px] transition-all"
              >
                <CalendarPlus size={13} />
                Schedule one
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {typedSessions.map((session) => (
                <div key={session.id} className="px-5 py-4">
                  <Link
                    href={`/portal/sessions/${session.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-[var(--text-3)] font-medium uppercase">
                        {format(new Date(session.scheduled_at), "MMM")}
                      </span>
                      <span className="text-[15px] font-semibold text-[var(--text-1)] leading-tight">
                        {format(new Date(session.scheduled_at), "d")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13.5px] font-semibold text-[var(--text-1)] truncate">{session.subject}</p>
                        <Badge variant={statusVariant(session.status)} size="sm">{session.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={11} className="text-[var(--text-3)]" />
                        <span className="text-[12px] text-[var(--text-2)]">
                          {format(new Date(session.scheduled_at), "EEE h:mm a")} · {session.duration_minutes}m
                        </span>
                      </div>
                      {session.tutor_name && (
                        <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">with {session.tutor_name}</p>
                      )}
                    </div>
                  </Link>
                  <SessionRowActions session={session} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages + study plan */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent messages */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[var(--text-3)]" />
              <h2 className="font-semibold text-[var(--text-1)] text-[14.5px]">Messages</h2>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-[#050816] text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <Link href="/portal/messages" className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
              Open chat <ChevronRight size={12} />
            </Link>
          </div>
          {typedMessages.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <MessageSquare size={26} className="text-[var(--text-3)] mx-auto mb-3" />
              <p className="text-[13px] text-[var(--text-2)] mb-3">No messages yet.</p>
              <Link
                href="/portal/messages"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-1)] text-[13px] font-medium hover:border-[var(--border-2)] transition-all"
              >
                Say hello
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {typedMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/portal/messages"
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    msg.sender === "nyx"
                      ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--border-accent)]"
                      : "bg-white/[0.07] text-[var(--text-2)] border border-white/[0.1]"
                  }`}>
                    {msg.sender === "nyx" ? "N" : "Me"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-[var(--text-2)]">
                        {msg.sender === "nyx" ? "Nyx" : "You"}
                      </span>
                      <span className="text-[10.5px] text-[var(--text-3)]">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--text-1)] truncate mt-0.5">{msg.content}</p>
                  </div>
                  {msg.sender === "nyx" && !msg.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Today's study plan / next steps */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-[var(--text-3)]" />
              <h2 className="font-semibold text-[var(--text-1)] text-[14.5px]">Next steps</h2>
            </div>
          </div>
          <ul className="divide-y divide-white/[0.04]">
            {nextStepsFor({
              hasDiagnostic: !!latestDiagnostic,
              hasUpcoming: typedSessions.length > 0,
              hasTutor: typedAssignments.length > 0,
              hasTargetTest: !!typedProfile?.target_test,
              unreadCount,
            }).map((step) => (
              <li key={step.label}>
                <Link
                  href={step.href}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full grid place-items-center shrink-0 ${
                    step.done
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--accent)]"
                  }`}>
                    {step.done ? <CheckCircle2 size={13} /> : <Flame size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{step.label}</p>
                    <p className="text-[11.5px] text-[var(--text-3)]">{step.detail}</p>
                  </div>
                  <ChevronRight size={13} className="text-[var(--text-3)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-[12px] font-semibold text-[var(--text-3)] uppercase tracking-[0.18em] mb-3">
          Quick links
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLink href="/portal/diagnostic" icon={Sparkles} label="Adaptive intake"        sub="14-question test" />
          <QuickLink href="/portal/schedule"   icon={CalendarPlus} label="Full scheduler"     sub="Pick any time" />
          <QuickLink href="/portal/materials"  icon={BookOpen}     label="Practice library"   sub="SAT · ACT · AP" />
          <QuickLink href="/portal/profile"    icon={Target}       label="Update target"      sub="Score, test date" />
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label, value, icon: Icon, href, accent, highlight,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--border-2)] transition-all group block"
      style={highlight ? { background: "var(--accent-dim)", borderColor: "var(--border-accent)" } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10.5px] text-[var(--text-3)] font-semibold uppercase tracking-[0.16em]">{label}</p>
        <span style={{ color: accent }}>
          <Icon size={14} />
        </span>
      </div>
      <p className="text-[22px] font-semibold" style={{ color: accent }}>{value}</p>
    </Link>
  );
}

function QuickLink({
  href, icon: Icon, label, sub,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-accent)] transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
        <Icon size={15} className="text-[var(--accent)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[var(--text-1)] truncate">{label}</p>
        <p className="text-[11px] text-[var(--text-3)] truncate">{sub}</p>
      </div>
      <ChevronRight size={13} className="text-[var(--text-3)] ml-auto group-hover:text-[var(--accent)] transition-colors" />
    </Link>
  );
}

function nextStepsFor(s: {
  hasDiagnostic: boolean;
  hasUpcoming: boolean;
  hasTutor: boolean;
  hasTargetTest: boolean;
  unreadCount: number;
}) {
  const out: { label: string; detail: string; href: string; done: boolean }[] = [];
  out.push({
    label: "Set your target test",
    detail: s.hasTargetTest ? "Already configured." : "SAT or ACT, plus your goal score.",
    href: "/portal/profile",
    done: s.hasTargetTest,
  });
  out.push({
    label: "Take the adaptive intake",
    detail: s.hasDiagnostic
      ? "We've already mapped your starting sky."
      : "Pinpoint strengths in ~14 questions.",
    href: "/portal/diagnostic",
    done: s.hasDiagnostic,
  });
  out.push({
    label: s.hasTutor ? "Book your next session" : "Meet your matched tutor",
    detail: s.hasTutor
      ? (s.hasUpcoming ? "You already have one on the calendar." : "Pick a slot when it suits you.")
      : "An admin will assign one within a day of your first session request.",
    href: "/portal/schedule",
    done: s.hasUpcoming,
  });
  if (s.unreadCount > 0) {
    out.push({
      label: `Reply to ${s.unreadCount} unread message${s.unreadCount === 1 ? "" : "s"}`,
      detail: "Your tutor or the Nyx team is waiting.",
      href: "/portal/messages",
      done: false,
    });
  }
  return out;
}
