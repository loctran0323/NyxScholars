"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
}

const KIND_ICON: Record<string, string> = {
  "session.reminder":   "🌙",
  "session.confirmed":  "✓",
  "session.cancelled":  "·",
  "session.summary":    "✦",
  "message.tutor":      "✉",
  "message.team":       "✉",
  "billing.success":    "✓",
  "billing.failed":     "!",
  "billing.dunning":    "!",
  "onboarding.step":    "◆",
  "diagnostic.complete":"✦",
  "homework.assigned":  "◇",
  "review.requested":   "★",
  "system.announcement":"·",
};

export function NotificationsBell() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Notification[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications as Notification[]);
      setUnread(data.unread as number);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  React.useEffect(() => {
    if (!open) return;
    function onClickAway(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClickAway);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onClickAway);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  async function markAllRead() {
    const ids = items.filter((i) => !i.read_at).map((i) => i.id);
    if (ids.length === 0) return;
    setItems((curr) => curr.map((n) => (ids.includes(n.id) ? { ...n, read_at: new Date().toISOString() } : n)));
    setUnread(0);
    await fetch("/api/portal/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
  }

  async function markRead(id: string) {
    setItems((curr) => curr.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    setUnread((u) => Math.max(0, u - 1));
    await fetch("/api/portal/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--on-accent)] text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 mt-2 w-80 z-50 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <p className="text-[13px] font-semibold text-[var(--text-1)]">Notifications</p>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="inline-flex items-center gap-1 text-[11.5px] text-[var(--text-2)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="p-6 text-center">
                <div className="skeleton mx-auto h-3 w-32 rounded" />
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <Inbox size={22} className="text-[var(--text-3)] mx-auto mb-3" />
                <p className="text-[13px] text-[var(--text-2)]">You're all caught up.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {items.map((n) => {
                  const inner = (
                    <>
                      <span
                        aria-hidden
                        className="w-7 h-7 shrink-0 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center text-[12px] text-[var(--accent)]"
                      >
                        {KIND_ICON[n.kind] ?? "·"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-[var(--text-1)] leading-snug">{n.title}</p>
                        {n.body && (
                          <p className="text-[12px] text-[var(--text-2)] leading-snug mt-0.5 truncate">{n.body}</p>
                        )}
                        <p className="text-[10.5px] text-[var(--text-3)] mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />}
                    </>
                  );
                  const className = cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors",
                    n.read_at ? "opacity-70 hover:bg-white/[0.03]" : "bg-white/[0.02] hover:bg-white/[0.05]",
                  );
                  if (n.href) {
                    return (
                      <li key={n.id}>
                        <Link
                          href={n.href}
                          onClick={() => {
                            if (!n.read_at) markRead(n.id);
                            setOpen(false);
                          }}
                          className={className}
                        >
                          {inner}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={n.id}>
                      <div
                        onClick={() => { if (!n.read_at) markRead(n.id); }}
                        className={className}
                      >
                        {inner}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-2)]">
            <Link
              href="/portal/settings"
              onClick={() => setOpen(false)}
              className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] transition-colors"
            >
              Notification preferences →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
