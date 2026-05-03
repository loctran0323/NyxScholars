import { requireAdminAuth } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { poolStats } from "@/lib/diagnostic";
import { QuestionsEditor } from "./QuestionsEditor";

export const metadata = { title: "Question bank · Admin" };

interface QuestionRow {
  id: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string | null;
  status: "active" | "draft" | "retired";
  origin: "admin" | "generated" | "static" | "community";
  created_at: string;
}

export default async function AdminQuestionsPage() {
  await requireAdminAuth();
  const stats = poolStats();
  const sb = getServiceRoleClient();
  let dbQuestions: QuestionRow[] = [];
  if (sb) {
    const { data } = await sb
      .from("diagnostic_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    dbQuestions = (data ?? []) as unknown as QuestionRow[];
  }

  return (
    <div className="max-w-6xl mx-auto py-6">
      <header className="mb-6">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Admin</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)]">Question bank</h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          {stats.total} items live ({stats.skillsCovered}/{stats.skillsTotal} skills covered).
          Add hand-written questions, mint generated batches, edit, or retire below.
        </p>
      </header>
      <QuestionsEditor stats={stats} initial={dbQuestions} />
    </div>
  );
}
