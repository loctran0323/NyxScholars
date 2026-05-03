import type { DbTutor } from "@/lib/tutors/repo";

export interface StudentForMatch {
  id: string;
  target_test: "sat" | "act" | null;
  target_subjects: string[];
  diagnostic_weak_skills: string[];
}

export interface RankedTutor {
  tutor: DbTutor;
  score: number;
  reasons: string[];
}

export function rankTutors(
  student: StudentForMatch,
  tutors: DbTutor[],
  loads: Record<string, number>,
): RankedTutor[] {
  const eligible = tutors.filter((t) => {
    if (t.status !== "active") return false;
    if (student.target_test && t.tests.length > 0 && !t.tests.includes(student.target_test)) {
      return false;
    }
    return true;
  });

  const ranked: RankedTutor[] = eligible.map((t) => {
    const overlap = student.target_subjects.filter((s) => t.subjects.includes(s)).length;
    const capacity = t.capacity_weekly ?? 8;
    const load = loads[t.profile_id] ?? 0;
    const slack = Math.max(0, capacity - load);

    const ageEps = 1 / (Date.now() - new Date(t.created_at).getTime() + 1);
    const score = overlap * 100 + slack * 10 + ageEps;

    const reasons: string[] = [];
    if (overlap > 0) {
      reasons.push(
        `${overlap} of ${student.target_subjects.length} target subjects match`,
      );
    } else if (student.target_subjects.length === 0) {
      reasons.push("subject not yet specified");
    } else {
      reasons.push("no subject overlap");
    }
    reasons.push(`${load} of ${capacity} weekly slots used`);

    return { tutor: t, score, reasons };
  });

  return ranked.sort((a, b) => b.score - a.score);
}
