import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar, CalendarPlus, ChevronRight, MessageSquare, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Session, Message } from "@/types/portal";

/** Shared card chrome for the dashboard "Today" row. */
function CardShell({
  accent,
  eyebrow,
  icon: Icon,
  trailing,
  children,
}: {
  accent?: boolean;
  eyebrow: string;
  icon?: React.ComponentType<{ size?: number; className?: string }> | "live";
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article
      className={
        "rounded-2xl border p-5 flex flex-col transition-colors " +
        (accent ? "border-[var(--border-accent)] bg-[var(--accent-dim)]" : "border-[var(--border)] bg-[var(--surface)]")
      }
    >
      <div
        className="flex items-center justify-between gap-2 text-[10.5px] uppercase tracking-[0.22em] font-semibold mb-2"
        style={{ color: accent ? "var(--accent)" : "var(--text-3)" }}
      >
        <span className="flex items-center gap-2">
          {Icon === "live" ? <span className="live-dot" /> : Icon ? <Icon size={12} /> : null}
          {eyebrow}
        </span>
        {trailing}
      </div>
      {children}
    </article>
  );
}

/* ─────────── Next session ─────────── */

export function NextSessionCard({
  session,
  live,
  minutesUntil,
}: {
  session: Session | null;
  live: boolean;
  minutesUntil: number | null;
}) {
  if (!session) {
    return (
      <CardShell eyebrow="Next session" icon={Calendar}>
        <p className="text-[15px] font-semibold text-[var(--text-1)] flex-1 mt-2">No session scheduled.</p>
        <Link
          href="/portal/schedule"
          className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--gold-soft)] text-[var(--on-gold)] text-[12.5px] font-semibold"
        >
          <CalendarPlus size={12} />
          Book a slot
        </Link>
      </CardShell>
    );
  }

  const liveLabel =
    minutesUntil != null && minutesUntil >= 1
      ? `Starts in ${minutesUntil}m`
      : minutesUntil != null && minutesUntil >= -15
        ? "Live now"
        : "Recently started";

  return (
    <CardShell accent={live} eyebrow={live ? liveLabel : "Next session"} icon={live ? "live" : Calendar}>
      <p className="text-[15px] font-semibold text-[var(--text-1)] truncate">{session.subject}</p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">
        {format(new Date(session.scheduled_at), "EEE, MMM d · h:mm a")}
        {session.tutor_name && ` · ${session.tutor_name}`}
      </p>
      <div className="mt-auto pt-4">
        {live && session.meeting_link ? (
          <a
            href={session.meeting_link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] text-[12.5px] font-semibold w-full"
          >
            Join now <ChevronRight size={12} />
          </a>
        ) : (
          <Link
            href={`/portal/sessions/${session.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-semibold hover:border-[var(--border-2)] w-full transition-colors"
          >
            Open session <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </CardShell>
  );
}

/* ─────────── Daily review ─────────── */

export function DailyReviewCard({ dueCount }: { dueCount: number }) {
  const empty = dueCount === 0;
  return (
    <CardShell eyebrow="Daily review" icon={Sparkles}>
      <p className="text-[15px] font-semibold text-[var(--text-1)]">
        {empty ? "All caught up." : `${dueCount} card${dueCount === 1 ? "" : "s"} waiting.`}
      </p>
      <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">
        {empty
          ? "Come back tomorrow — or push more from a session recap."
          : "Eight focused minutes — re-surface what you got wrong."}
      </p>
      <div className="mt-auto pt-4">
        <Link
          href="/portal/practice"
          className={
            "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold w-full transition-colors " +
            (empty
              ? "border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)]"
              : "bg-[var(--gold-soft)] text-[var(--on-gold)]")
          }
        >
          {empty ? "Review history" : "Start review"} <ChevronRight size={12} />
        </Link>
      </div>
    </CardShell>
  );
}

/* ─────────── Messages preview ─────────── */

export function MessagesPreviewCard({
  messages,
  unreadCount,
}: {
  messages: Message[];
  unreadCount: number;
}) {
  const trailing = unreadCount > 0 ? <Badge variant="blue" size="sm">{unreadCount} new</Badge> : null;
  const head = messages[0];
  return (
    <CardShell eyebrow="Messages" icon={MessageSquare} trailing={trailing}>
      {head ? (
        <>
          <p className="text-[13.5px] text-[var(--text-1)] line-clamp-2 leading-snug">{head.content}</p>
          <p className="text-[10.5px] text-[var(--text-3)] mt-1.5">
            {head.sender === "nyx" ? "Nyx · " : "You · "}
            {formatDistanceToNow(new Date(head.created_at), { addSuffix: true })}
          </p>
        </>
      ) : (
        <>
          <p className="text-[15px] font-semibold text-[var(--text-1)]">Nothing new.</p>
          <p className="text-[12.5px] text-[var(--text-2)] mt-0.5">Open chat to ping your tutor.</p>
        </>
      )}
      <div className="mt-auto pt-4">
        <Link
          href="/portal/messages"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-1)] text-[12.5px] font-semibold hover:border-[var(--border-2)] w-full transition-colors"
        >
          Open messages <ChevronRight size={12} />
        </Link>
      </div>
    </CardShell>
  );
}
