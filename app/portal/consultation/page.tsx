import { format } from "date-fns";
import { ConsultationView, type ConsultationNote } from "./ConsultationView";
import { requirePortalUser } from "@/lib/portal-auth";
import { initials, planLabel } from "@/lib/sessions";
import type { Profile } from "@/types/portal";

export const metadata = { title: "Consultation · Nyx" };

interface DiagnosticSummary {
  completed_at?:   string;
  predicted_score?: number;
  per_skill?:      Record<string, number>;
}

export default async function ConsultationDashboardPage() {
  const { supabase, user } = await requirePortalUser();

  const [
    { data: profile },
    { data: assignment },
    { data: upcoming },
    { data: notesSessions },
    { count: diagnosticAttemptCount },
  ] = await Promise.all([
    supabase
      .from("profiles").select("full_name, plan, notif_prefs")
      .eq("id", user.id).maybeSingle(),
    supabase
      .from("assignments")
      .select("subject, tutor:profiles!teacher_id(full_name)")
      .eq("student_id", user.id).eq("active", true)
      .order("created_at", { ascending: true }).limit(1).maybeSingle(),
    supabase
      .from("sessions").select("subject, scheduled_at")
      .eq("student_id", user.id)
      .in("status", ["pending", "confirmed"])
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(1).maybeSingle(),
    supabase
      .from("sessions").select("id, scheduled_at, admin_notes")
      .eq("student_id", user.id)
      .eq("status", "completed")
      .not("admin_notes", "is", null)
      .order("scheduled_at", { ascending: false })
      .limit(6),
    supabase
      .from("diagnostic_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const typedProfile = profile as Profile | null;
  const studentName = typedProfile?.full_name ?? user.email?.split("@")[0] ?? "Student";

  const tutorRow = assignment as { subject: string | null; tutor: { full_name: string | null } | null } | null;
  const tutorName = tutorRow?.tutor?.full_name ?? "Your tutor";

  const meta = (typedProfile?.notif_prefs ?? {}) as Record<string, unknown>;
  const summary = (meta.diagnostic_summary ?? null) as DiagnosticSummary | null;
  const masteryOverrides = summary?.per_skill ?? undefined;
  const hasIntake = !!summary?.completed_at || (diagnosticAttemptCount ?? 0) > 0;

  const upcomingSession = upcoming
    ? {
        topic:     (upcoming as { subject: string }).subject,
        whenISO:   (upcoming as { scheduled_at: string }).scheduled_at,
        whenLabel: format(new Date((upcoming as { scheduled_at: string }).scheduled_at), "EEE, MMM d"),
      }
    : null;

  const notes: ConsultationNote[] = ((notesSessions ?? []) as { id: string; scheduled_at: string; admin_notes: string }[])
    .map((s) => ({
      id:        s.id,
      author:    tutorName,
      createdAt: s.scheduled_at,
      body:      s.admin_notes,
    }));

  return (
    <ConsultationView
      studentName={studentName}
      studentInitials={initials(studentName)}
      tutorName={tutorName}
      packageLabel={planLabel(typedProfile?.plan ?? null).split(" · ")[0]}
      nextSession={upcomingSession}
      notes={notes}
      masteryOverrides={masteryOverrides}
      hasIntake={hasIntake}
    />
  );
}
