import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pin } from "lucide-react";
import { format } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ThreadReplies } from "./ThreadReplies";

interface RouteCtx { params: Promise<{ id: string }> }

interface Thread {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  created_at: string;
  author_id: string;
}

interface Reply {
  id: string;
  body: string;
  author_id: string;
  created_at: string;
}

export default async function Page({ params }: RouteCtx) {
  const { id } = await params;
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "teacher") redirect("/portal");

  const [{ data: thread }, { data: replies }] = await Promise.all([
    sb.from("forum_threads").select("*").eq("id", id).maybeSingle(),
    sb.from("forum_replies").select("*").eq("thread_id", id).order("created_at", { ascending: true }),
  ]);
  if (!thread) notFound();
  const t = thread as unknown as Thread;
  const r = (replies ?? []) as unknown as Reply[];

  // Resolve author display names in one query.
  const authorIds = Array.from(new Set([t.author_id, ...r.map((x) => x.author_id)]));
  const { data: authors } = await sb
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);
  const nameById = new Map((authors ?? []).map((a) => [(a as { id: string; full_name: string | null }).id, (a as { full_name: string | null }).full_name ?? "Tutor"]));

  return (
    <div className="max-w-3xl">
      <Link href="/portal/teacher/forum" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-3)] hover:text-[var(--text-1)] uppercase tracking-[0.2em] font-mono mb-4">
        <ArrowLeft size={12} /> back to forum
      </Link>

      <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-6">
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {t.pinned && <Pin size={11} className="text-[var(--gold-soft)]" />}
          <Badge variant="default">{t.category}</Badge>
          <span className="text-[11.5px] text-[var(--text-3)]">
            {nameById.get(t.author_id) ?? "Tutor"} · {format(new Date(t.created_at), "MMM d, yyyy")}
          </span>
        </div>
        <h1 className="text-[24px] font-semibold text-[var(--text-1)] mb-4 leading-tight">{t.title}</h1>
        <div className="text-[14px] text-[var(--text-1)] leading-relaxed whitespace-pre-wrap">{t.body}</div>
      </article>

      <h2 className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[var(--text-3)] mb-3">
        {r.length} {r.length === 1 ? "reply" : "replies"}
      </h2>
      <ul className="space-y-3 mb-6">
        {r.map((reply) => (
          <li key={reply.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-[12px] text-[var(--text-3)] mb-2">
              <span className="text-[var(--text-1)] font-semibold">{nameById.get(reply.author_id) ?? "Tutor"}</span>
              {" · "}
              {format(new Date(reply.created_at), "MMM d, h:mm a")}
            </p>
            <div className="text-[13.5px] text-[var(--text-1)] leading-relaxed whitespace-pre-wrap">{reply.body}</div>
          </li>
        ))}
      </ul>

      <ThreadReplies threadId={id} />
    </div>
  );
}
