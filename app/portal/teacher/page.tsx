import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Users, MessageSquare, Calendar, ChevronRight, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile, Session, Assignment } from "@/types/portal";

interface AssignedStudent {
  assignment: Assignment;
  profile: Profile;
  upcomingSession: Session | null;
}

export default async function TeacherDashboard() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if ((profile as Profile | null)?.role !== "teacher") {
    redirect("/portal");
  }

  // Pull all active assignments → student profiles → next upcoming session.
  const { data: assignmentsRaw } = await supabase
    .from("assignments")
    .select("*")
    .eq("teacher_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: true });

  const assignments = (assignmentsRaw ?? []) as Assignment[];
  const studentIds = Array.from(new Set(assignments.map((a) => a.student_id)));

  const [{ data: profilesData }, { data: sessionsData }] = await Promise.all([
    studentIds.length
      ? supabase.from("profiles").select("*").in("id", studentIds)
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase
          .from("sessions")
          .select("*")
          .in("student_id", studentIds)
          .gte("scheduled_at", new Date().toISOString())
          .in("status", ["pending", "confirmed"])
          .order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] }),
  ]);

  const profilesById = new Map(
    (profilesData ?? []).map((p) => [(p as Profile).id, p as Profile])
  );
  const nextSessionByStudent = new Map<string, Session>();
  for (const s of (sessionsData ?? []) as Session[]) {
    if (!nextSessionByStudent.has(s.student_id)) {
      nextSessionByStudent.set(s.student_id, s);
    }
  }

  const students: AssignedStudent[] = assignments
    .map((a) => {
      const p = profilesById.get(a.student_id);
      if (!p) return null;
      return {
        assignment: a,
        profile: p,
        upcomingSession: nextSessionByStudent.get(a.student_id) ?? null,
      };
    })
    .filter((x): x is AssignedStudent => x !== null);

  const teacherName =
    (profile as Profile | null)?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "Teacher";

  const totalUpcoming = nextSessionByStudent.size;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[13px] text-[var(--text-3)] uppercase tracking-wider font-semibold mb-1">
          Teacher Portal
        </p>
        <h1 className="text-[28px] font-bold text-[var(--text-1)] leading-tight">
          Welcome back, {teacherName}.
        </h1>
        <p className="text-[var(--text-2)] mt-1 text-[15px]">
          {students.length === 0
            ? "No students have been assigned to you yet."
            : `You have ${students.length} active student${students.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Active Students" value={students.length} icon={Users} />
        <StatCard label="Upcoming Sessions" value={totalUpcoming} icon={Calendar} />
        <StatCard label="Subjects" value={countSubjects(assignments)} icon={GraduationCap} />
      </div>

      <div>
        <h2 className="text-[13px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">
          Your Students
        </h2>
        {students.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
            <Users size={28} className="text-[var(--text-3)] mx-auto mb-3" />
            <p className="text-[14px] text-[var(--text-2)] mb-1">No assignments yet</p>
            <p className="text-[12.5px] text-[var(--text-3)] max-w-md mx-auto leading-relaxed">
              An admin will assign students to you. You&apos;ll see them here as soon as they are added.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {students.map((s) => (
              <Link
                key={s.assignment.id}
                href={`/portal/teacher/students/${s.profile.id}`}
                className="flex items-start gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-2)] transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-bold text-[var(--accent)]">
                    {initials(s.profile.full_name) || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[14.5px] font-semibold text-[var(--text-1)] truncate">
                      {s.profile.full_name ?? "(unnamed student)"}
                    </p>
                    {s.assignment.subject && (
                      <Badge variant="blue" size="sm">{s.assignment.subject}</Badge>
                    )}
                  </div>
                  <p className="text-[12px] text-[var(--text-3)]">
                    {[
                      s.profile.grade ? `Grade ${s.profile.grade}` : null,
                      s.profile.target_test ? `Target: ${s.profile.target_test}` : null,
                      s.profile.target_score ? s.profile.target_score : null,
                    ].filter(Boolean).join(" · ") || "No profile details"}
                  </p>
                  {s.upcomingSession && (
                    <p className="text-[12px] text-[var(--text-2)] mt-1.5 flex items-center gap-1.5">
                      <Calendar size={11} className="text-[var(--accent)]" />
                      Next: {format(new Date(s.upcomingSession.scheduled_at), "EEE MMM d · h:mm a")}
                    </p>
                  )}
                </div>
                <ChevronRight size={15} className="text-[var(--text-3)] mt-1 shrink-0 group-hover:text-[var(--text-2)]" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-[13px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/portal/messages"
            className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-accent)] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
              <MessageSquare size={17} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Messages</p>
              <p className="text-[12px] text-[var(--text-3)]">Talk to your students</p>
            </div>
            <ChevronRight size={14} className="text-[var(--text-3)] ml-auto group-hover:text-[var(--accent)]" />
          </Link>
          <Link
            href="/portal/profile"
            className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-2)] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[var(--border)] flex items-center justify-center shrink-0">
              <GraduationCap size={17} className="text-[var(--text-2)]" />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Profile</p>
              <p className="text-[12px] text-[var(--text-3)]">Update your details</p>
            </div>
            <ChevronRight size={14} className="text-[var(--text-3)] ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider">{label}</p>
        <Icon size={14} className="text-[var(--text-3)]" />
      </div>
      <p className="text-[24px] font-bold text-[var(--text-1)]">{value}</p>
    </div>
  );
}

function initials(name: string | null): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function countSubjects(assignments: Assignment[]): number {
  const set = new Set(
    assignments.map((a) => a.subject).filter((s): s is string => !!s)
  );
  return set.size;
}
