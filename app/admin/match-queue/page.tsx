import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { listAdminTutors, countLoadThisWeek } from "@/lib/tutors/repo";
import { rankTutors, type StudentForMatch } from "@/lib/match/rank";
import { MatchQueueClient, type QueueRow } from "./MatchQueueClient";

export const metadata = { title: "Match queue · Admin" };

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  target_test: string | null;
  target_score: string | null;
  notif_prefs: Record<string, unknown> | null;
  created_at: string;
}

interface DiagnosticSummary {
  weakSkills?: string[];
  targetSubjects?: string[];
}

export default async function MatchQueuePage() {
  await requireAdminAuth();
  const sb = getServiceRoleClient();
  const queue: QueueRow[] = [];

  if (sb) {
    const { data: rawStudents } = await sb
      .from("profiles")
      .select("id, full_name, email, target_test, target_score, notif_prefs, created_at")
      .eq("role", "student");

    const students = (rawStudents ?? []) as unknown as ProfileRow[];

    // Only include students who have completed a diagnostic.
    const finished = students.filter((s) => {
      const meta = (s.notif_prefs ?? {}) as { diagnostic_summary?: DiagnosticSummary };
      return Boolean(meta.diagnostic_summary);
    });

    let assigned = new Set<string>();
    if (finished.length > 0) {
      const { data: existing } = await sb
        .from("assignments")
        .select("student_id")
        .in("student_id", finished.map((s) => s.id))
        .eq("active", true);
      assigned = new Set(
        (existing ?? []).map((r) => (r as { student_id: string }).student_id),
      );
    }

    const unmatched = finished.filter((s) => !assigned.has(s.id));

    const tutors = await listAdminTutors();
    const loads: Record<string, number> = {};
    await Promise.all(
      tutors.map(async (t) => {
        loads[t.profile_id] = await countLoadThisWeek(t.profile_id);
      }),
    );

    for (const s of unmatched) {
      const meta = (s.notif_prefs ?? {}) as { diagnostic_summary?: DiagnosticSummary };
      const ds = meta.diagnostic_summary ?? {};
      const targetTest: "sat" | "act" =
        s.target_test === "ACT" ? "act" : "sat";
      const studentForMatch: StudentForMatch = {
        id: s.id,
        target_test: targetTest,
        target_subjects: ds.targetSubjects ?? [],
        diagnostic_weak_skills: ds.weakSkills ?? [],
      };
      const ranked = rankTutors(studentForMatch, tutors, loads).slice(0, 3);

      queue.push({
        student: {
          id: s.id,
          name: s.full_name ?? s.email ?? "Student",
          email: s.email ?? "",
          target_test: targetTest,
          target_score: s.target_score ?? null,
          weak_skills: studentForMatch.diagnostic_weak_skills,
          waiting_days: Math.floor(
            (Date.now() - new Date(s.created_at).getTime()) / 86_400_000,
          ),
        },
        suggestions: ranked.map((r) => ({
          tutor_id: r.tutor.id,
          tutor_profile_id: r.tutor.profile_id,
          tutor_name: r.tutor.display_name,
          headline: r.tutor.headline ?? null,
          subjects: r.tutor.subjects,
          reasons: r.reasons,
        })),
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">
          Admin
        </p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Match queue</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Students who finished the diagnostic and don&apos;t yet have an active tutor assignment.
          Top three are ranked by subject overlap and weekly capacity.
        </p>
      </header>

      <MatchQueueClient initialQueue={queue} />
    </div>
  );
}
