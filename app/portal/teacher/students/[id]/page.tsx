import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile, Session, Assignment } from "@/types/portal";

function statusVariant(status: string): "gold" | "blue" | "green" | "red" | "default" {
  switch (status) {
    case "confirmed": return "blue";
    case "completed": return "green";
    case "cancelled": return "red";
    default: return "gold";
  }
}

export default async function TeacherStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // Verify the teacher has an active assignment for this student.
  const { data: assignment } = await supabase
    .from("assignments")
    .select("*")
    .eq("teacher_id", user.id)
    .eq("student_id", id)
    .eq("active", true)
    .maybeSingle();

  if (!assignment) {
    notFound();
  }

  const [{ data: studentProfile }, { data: sessionsRaw }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase
      .from("sessions")
      .select("*")
      .eq("student_id", id)
      .order("scheduled_at", { ascending: false }),
  ]);

  const profile = studentProfile as Profile | null;
  const sessions = (sessionsRaw ?? []) as Session[];
  const a = assignment as Assignment;

  if (!profile) notFound();

  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.scheduled_at) > now && s.status !== "cancelled");
  const past = sessions.filter((s) => new Date(s.scheduled_at) <= now || s.status === "completed");

  return (
    <div className="space-y-6">
      <Link
        href="/portal/teacher"
        className="inline-flex items-center gap-2 text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
      >
        <ArrowLeft size={13} />
        Back to all students
      </Link>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex items-start gap-5">
        <div className="w-14 h-14 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
          <span className="text-[16px] font-bold text-[var(--accent)]">
            {(profile.full_name ?? "?").split(" ").map((n) => n[0]).filter(Boolean).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-[22px] font-bold text-[var(--text-1)]">
            {profile.full_name ?? "(unnamed student)"}
          </h1>
          <p className="text-[13px] text-[var(--text-3)] mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {profile.grade && <span>Grade {profile.grade}</span>}
            {profile.target_test && <span>· Target: {profile.target_test}</span>}
            {profile.target_score && <span>· Goal score: {profile.target_score}</span>}
            {profile.school && <span>· {profile.school}</span>}
          </p>
          {a.subject && (
            <div className="mt-3">
              <Badge variant="blue" size="sm">Assigned for {a.subject}</Badge>
            </div>
          )}
        </div>
        <Link
          href={`/portal/messages?student=${profile.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[13px] font-semibold hover:bg-[var(--accent-bright)] transition-all"
        >
          <MessageSquare size={13} />
          Message
        </Link>
      </div>

      <SessionList title="Upcoming sessions" sessions={upcoming} emptyText="No sessions scheduled." />
      <SessionList title="Past sessions" sessions={past} emptyText="No past sessions yet." />
    </div>
  );
}

function SessionList({
  title, sessions, emptyText,
}: {
  title: string;
  sessions: Session[];
  emptyText: string;
}) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">{title}</h2>
      {sessions.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center">
          <Calendar size={22} className="text-[var(--text-3)] mx-auto mb-2" />
          <p className="text-[13px] text-[var(--text-3)]">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] text-[var(--text-3)] font-semibold uppercase">
                  {format(new Date(s.scheduled_at), "MMM")}
                </span>
                <span className="text-[16px] font-bold text-[var(--text-1)] leading-tight">
                  {format(new Date(s.scheduled_at), "d")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[13.5px] font-semibold text-[var(--text-1)]">{s.subject}</p>
                  {(() => {
                    const v = statusVariant(s.status);
                    return (
                      <Badge variant={v}>{s.status}</Badge>
                    );
                  })()}
                </div>
                <p className="text-[12px] text-[var(--text-2)] flex items-center gap-1.5">
                  <Clock size={11} />
                  {format(new Date(s.scheduled_at), "EEE, MMM d · h:mm a")} · {s.duration_minutes} min
                </p>
                {s.student_notes && (
                  <p className="text-[12.5px] text-[var(--text-3)] mt-2 italic">
                    Note from student: {s.student_notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
