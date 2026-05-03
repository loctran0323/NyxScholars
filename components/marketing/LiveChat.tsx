"use client";

import * as React from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface ChatMessage {
  id: string;
  role: "you" | "nyx";
  text: string;
  timestamp: number;
}

const SUGGESTED: { label: string; question: string }[] = [
  { label: "How does pricing work?", question: "How does Nyx pricing work?" },
  { label: "Are tutors really Ivy?",  question: "Are your tutors really current Ivy League undergraduates?" },
  { label: "Book a free intake",      question: "I'd like to book a free 30-minute intake call. How do I start?" },
  { label: "ACT vs SAT",              question: "Should I prep for the ACT or the SAT? My score targets are below…" },
];

const STORAGE_KEY = "nyx:chat:v1";

/**
 * Live chat widget for the marketing site. By default, ferries questions
 * straight into our /api/leads endpoint — a real human follows up. When
 * NEXT_PUBLIC_INTERCOM_APP_ID is set, hands off to Intercom instead.
 */
export function LiveChat() {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [history, setHistory] = React.useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-30))); } catch {}
  }, [history]);

  const intercomId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

  function openChat() {
    if (intercomId && typeof window !== "undefined" && (window as unknown as { Intercom?: () => void }).Intercom) {
      (window as unknown as { Intercom: (cmd: string) => void }).Intercom("show");
      track("chat.open", { provider: "intercom" });
      return;
    }
    setOpen(true);
    track("chat.open", { provider: "in-app" });
    if (history.length === 0) {
      setHistory([
        {
          id: "greet",
          role: "nyx",
          text: "Hi — Maya from Nyx here. Ask anything about tutoring, pricing, or admissions. I read every message.",
          timestamp: Date.now(),
        },
      ]);
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text) return;
    if (!email && history.length <= 2) {
      // Encourage email capture so we can actually reply.
      setHistory((curr) => [
        ...curr,
        { id: `you-${Date.now()}`, role: "you", text, timestamp: Date.now() },
        {
          id: `nyx-${Date.now()}`,
          role: "nyx",
          text: "Drop your email below and I'll write back today (usually within an hour during business hours).",
          timestamp: Date.now(),
        },
      ]);
      setDraft("");
      return;
    }
    setSubmitting(true);
    setHistory((curr) => [...curr, { id: `you-${Date.now()}`, role: "you", text, timestamp: Date.now() }]);
    setDraft("");
    track("chat.message_sent");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name:    "Live chat visitor",
          email:           email || "anonymous@livechat.local",
          grade:           "—",
          service:         "Live chat inquiry",
          tutoring_format: "Online 1:1",
          help_needed:     text,
          consent:         true,
        }),
      });
      const ok = res.ok;
      setHistory((curr) => [
        ...curr,
        {
          id: `nyx-${Date.now()}`,
          role: "nyx",
          text: ok
            ? "Got it. Maya or one of the team will reply to you directly. In the meantime, anything else I can answer?"
            : "Hmm — that didn't go through. Try again or email hello@nyxscholars.com directly.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  function pushSuggested(q: string) {
    setDraft(q);
  }

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        aria-label="Open chat with Nyx"
        className="fixed bottom-5 right-5 z-50 h-12 px-4 rounded-full bg-[var(--gold-soft)] text-[var(--on-gold)] font-semibold text-[13.5px] shadow-[0_18px_36px_rgba(0,0,0,0.45)] hover:bg-[var(--gold-bright)] transition-colors flex items-center gap-2"
      >
        <MessageCircle size={15} />
        Chat with Nyx
      </button>

      {open && !intercomId && (
        <div
          role="dialog"
          aria-label="Live chat with Nyx"
          className="fixed bottom-20 right-5 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_28px_64px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden animate-[slide-up-in_0.25s_var(--ease-out-soft)]"
        >
          <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] grid place-items-center">
                <Sparkles size={13} className="text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-1)] leading-none">Nyx team</p>
                <p className="text-[10.5px] text-[var(--text-3)] mt-0.5">Replies in &lt;1h during business hours</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"
            >
              <X size={15} />
            </button>
          </header>

          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80 bg-[var(--bg-2)]">
            {history.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "you" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[78%] px-3 py-2 rounded-2xl text-[13px] leading-snug",
                    m.role === "you"
                      ? "bg-[var(--accent)] text-[var(--on-accent)] rounded-br-md"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-1)] rounded-bl-md",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {submitting && (
              <div className="flex justify-start">
                <div className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-3)] rounded-2xl px-3 py-2 text-[13px]">
                  …
                </div>
              </div>
            )}
          </div>

          {!email && history.length === 1 && (
            <div className="px-4 py-2 border-t border-[var(--border)]">
              <p className="text-[10.5px] text-[var(--text-3)] uppercase tracking-wider mb-1.5">Try one of these</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => pushSuggested(s.question)}
                    className="text-[11.5px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--border-accent)] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!email && history.length > 1 && (
            <div className="px-4 py-3 border-t border-[var(--border)]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com — so we can reply"
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40"
              />
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-[var(--border)] bg-[var(--surface-elevated)]"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-[13px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]/40"
            />
            <button
              type="submit"
              disabled={submitting || !draft.trim()}
              aria-label="Send message"
              className="h-9 w-9 rounded-lg bg-[var(--gold-soft)] text-[var(--on-gold)] grid place-items-center disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
