import Link from "next/link";
import { ClipboardList, ArrowRight, CheckCircle2 } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Homework" };

interface HomeworkRow {
  id: string;
  title: string;
  body: string | null;
  due_at: string | null;
  questions: { prompt: string }[];
  results: { picked_index: number; correct: boolean }[] | null;
  completed_at: string | null;
  created_at: string;
}

export default async function HomeworkPage() {
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data } = await sb
    .from("homework")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(40);

  const items = (data ?? []) as unknown as HomeworkRow[];

  return (
    <div className="max-w-3xl">
      <header className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight flex items-center gap-2">
          <ClipboardList size={20} className="text-[var(--accent)]" />
          Homework
        </h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Sets pushed by your tutor at the end of each session. Results flow back into your sky.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <ClipboardList size={26} className="text-[var(--text-3)] mx-auto mb-3" />
          <p className="text-[13.5px] text-[var(--text-2)]">
            Nothing assigned yet. After your next session, your tutor can push 3–5 questions here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((h) => {
            const total = h.questions?.length ?? 0;
            const correct = (h.results ?? []).filter((r) => r.correct).length;
            const done = !!h.completed_at;
            return (
              <li key={h.id}>
                <Link
                  href={`/portal/homework/${h.id}`}
                  className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-2)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[var(--text-1)]">{h.title}</p>
                      {h.body && <p className="text-[12.5px] text-[var(--text-2)] mt-1 line-clamp-2">{h.body}</p>}
                      <p className="text-[11.5px] text-[var(--text-3)] mt-1.5">
                        {h.due_at ? `Due ${formatDistanceToNow(new Date(h.due_at), { addSuffix: true })}` : `Assigned ${formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {done ? (
                        <p className="inline-flex items-center gap-1 text-[12px] text-[var(--success)] font-semibold">
                          <CheckCircle2 size={13} /> {correct}/{total}
                        </p>
                      ) : (
                        <p className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] font-semibold">
                          {total} q <ArrowRight size={12} />
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
