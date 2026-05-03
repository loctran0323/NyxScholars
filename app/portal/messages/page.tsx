"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { Message } from "@/types/portal";

const POLL_INTERVAL_MS = 8_000;

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async (markRead: boolean) => {
    try {
      const res = await fetch(`/api/portal/messages${markRead ? "?markRead=true" : ""}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling. Pause polling when the tab is hidden so we don't
  // hammer Supabase from background tabs.
  useEffect(() => {
    void refresh(true);
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => { timer = setInterval(() => void refresh(false), POLL_INTERVAL_MS); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
    start();
    const onVisibility = () => {
      if (document.visibilityState === "visible") { void refresh(false); start(); }
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    setDraft("");

    const res = await fetch("/api/portal/messages", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ content }),
    });
    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to send. Please try again.");
      setDraft(content);
      return;
    }
    await refresh(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="max-w-2xl flex flex-col h-full" style={{ height: "calc(100vh - 180px)" }}>
      <header className="mb-5 shrink-0">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[var(--text-3)] mb-1.5">
          Portal
        </p>
        <h1 className="font-[family-name:var(--font-fraunces)] font-light text-[28px] sm:text-[32px] text-[var(--text-1)] leading-[1.05] tracking-[-0.015em]">
          Messages
        </h1>
        <p className="text-[13.5px] text-[var(--text-2)] leading-relaxed mt-2">
          Chat with the Nyx team. Replies usually within a few hours, weekdays.
        </p>
      </header>

      <div className="flex-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--border)] shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center">
            <span className="text-[11px] font-bold text-[var(--accent)]">N</span>
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Nyx Team</p>
            <p className="text-[11px] text-[var(--text-3)]">Usually responds within a few hours</p>
          </div>
          <span aria-label="Online" className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {loading
            ? <Skeleton />
            : messages.length === 0
              ? <EmptyThread />
              : <Thread messages={messages} bottomRef={bottomRef} />}
        </div>

        <form onSubmit={send} className="px-4 pb-4 pt-3 border-t border-[var(--border)] shrink-0">
          {error && <p className="text-[12px] text-[var(--danger)] mb-2 px-1">{error}</p>}
          <div className="flex gap-3 items-end">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Nyx — Enter to send, Shift+Enter for newline"
              rows={1}
              className="flex-1 min-h-[42px] max-h-[120px]"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              aria-label="Send message"
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all border",
                draft.trim() && !sending
                  ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--on-accent)] hover:brightness-110"
                  : "bg-white/[0.06] border-[var(--border)] text-[var(--text-3)] cursor-not-allowed"
              )}
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={20} className="animate-spin text-[var(--text-3)]" />
    </div>
  );
}

function EmptyThread() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] grid place-items-center mb-3">
        <MessageSquare size={18} className="text-[var(--text-3)]" />
      </div>
      <p className="text-[13px] text-[var(--text-1)] font-semibold mb-1">Start the conversation</p>
      <p className="text-[12px] text-[var(--text-3)] max-w-xs">
        Ask about scheduling, your tutor match, your study plan — anything. We read every message.
      </p>
    </div>
  );
}

function Thread({
  messages, bottomRef,
}: {
  messages: Message[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      {messages.map((msg, i) => {
        const isStudent = msg.sender === "student";
        const showTime =
          i === messages.length - 1 ||
          Math.abs(
            new Date(messages[i + 1].created_at).getTime()
            - new Date(msg.created_at).getTime(),
          ) > 10 * 60 * 1000;

        return (
          <div key={msg.id}>
            {showTime && (
              <p className="text-center text-[11px] text-[var(--text-3)] my-2">
                {format(new Date(msg.created_at), "MMM d, h:mm a")}
              </p>
            )}
            <div className={cn("flex gap-2.5 items-end", isStudent && "flex-row-reverse")}>
              {!isStudent && (
                <div className="w-7 h-7 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center shrink-0">
                  <span className="text-[10px] font-bold text-[var(--accent)]">N</span>
                </div>
              )}
              <div className={cn("max-w-[78%]", isStudent && "items-end")}>
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-wrap",
                    isStudent
                      ? "bg-[var(--accent-dim)] border border-[var(--border-accent)] text-[var(--text-1)] rounded-br-md"
                      : "bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-1)] rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
                {!isStudent && !msg.read && (
                  <span className="text-[10px] text-[var(--accent)] ml-1 mt-0.5 block">New</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}
