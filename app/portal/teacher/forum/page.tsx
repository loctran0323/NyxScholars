import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, Pin, ChevronRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Tutor forum" };

interface Thread {
  id: string;
  title: string;
  body: string;
  category: "approach" | "lesson_plan" | "win_story" | "tools" | "other";
  pinned: boolean;
  reply_count: number;
  last_reply_at: string;
  created_at: string;
}

const CATEGORY_LABEL: Record<Thread["category"], string> = {
  approach:    "Approach",
  lesson_plan: "Lesson plan",
  win_story:   "Win story",
  tools:       "Tools",
  other:       "Other",
};

export default async function TutorForumPage() {
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "teacher") redirect("/portal");

  const { data } = await sb
    .from("forum_threads")
    .select("*")
    .order("pinned", { ascending: false })
    .order("last_reply_at", { ascending: false })
    .limit(60);
  const threads = (data ?? []) as unknown as Thread[];

  return (
    <div className="max-w-3xl">
      <header className="mb-7">
        <p className="text-[12px] text-[var(--text-3)] uppercase tracking-[0.18em] font-semibold mb-1">Tutors</p>
        <h1 className="text-[26px] font-semibold text-[var(--text-1)] leading-tight flex items-center gap-2">
          <MessageSquare size={20} className="text-[var(--accent)]" />
          Tutor forum
        </h1>
        <p className="text-[var(--text-2)] mt-1.5 text-[14.5px]">
          Share approaches, lesson plans, and win stories. Tutor-only.
        </p>
      </header>

      <div className="flex justify-end mb-3">
        <Link
          href="/portal/teacher/forum/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--gold-soft)] text-[var(--on-gold)] text-[13px] font-semibold"
        >
          <Sparkles size={13} /> New thread
        </Link>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center text-[14px] text-[var(--text-2)]">
          The forum is fresh. Start the first thread.
        </div>
      ) : (
        <ul className="space-y-2">
          {threads.map((t) => (
            <li key={t.id}>
              <Link
                href={`/portal/teacher/forum/${t.id}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--border-2)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {t.pinned && <Pin size={10} className="text-[var(--gold-soft)]" />}
                      <Badge variant="default">{CATEGORY_LABEL[t.category]}</Badge>
                    </div>
                    <p className="text-[14.5px] font-semibold text-[var(--text-1)] truncate">{t.title}</p>
                    <p className="text-[12.5px] text-[var(--text-2)] mt-0.5 line-clamp-2">{t.body}</p>
                  </div>
                  <div className="text-right text-[11px] text-[var(--text-3)] shrink-0">
                    {t.reply_count} {t.reply_count === 1 ? "reply" : "replies"}
                    <p className="mt-0.5">{format(new Date(t.last_reply_at), "MMM d")}</p>
                  </div>
                  <ChevronRight size={13} className="text-[var(--text-3)] mt-1 shrink-0" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
