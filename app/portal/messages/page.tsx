"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/portal";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = async (markRead = false) => {
    const res = await fetch(`/api/portal/messages${markRead ? "?markRead=true" : ""}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const content = newMessage.trim();
    if (!content || sending) return;

    setSending(true);
    setError("");
    setNewMessage("");

    const res = await fetch("/api/portal/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setSending(false);

    if (!res.ok) {
      setError(data.error || "Failed to send. Please try again.");
      setNewMessage(content);
    } else {
      await fetchMessages(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl flex flex-col h-full" style={{ height: "calc(100vh - 180px)" }}>
      <div className="mb-5 shrink-0">
        <p className="text-[13px] text-[#4e5d72] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[#f0ece3]">Messages</h1>
        <p className="text-[14px] text-[#8d9ab0] mt-1">Chat with the Nyx Scholars team</p>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col bg-[#0f1521] border border-white/[0.07] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a853]/25 to-[#a07830]/15 border border-[#d4a853]/25 flex items-center justify-center">
            <span className="text-[11px] font-bold text-[#d4a853]">N</span>
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#f0ece3]">Nyx Scholars Team</p>
            <p className="text-[11px] text-[#4e5d72]">Usually responds within a few hours</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" title="Online" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-[#4e5d72]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#141b2d] border border-white/[0.08] flex items-center justify-center mb-3">
                <span className="text-[#4e5d72] text-lg">💬</span>
              </div>
              <p className="text-[#8d9ab0] text-[13px] mb-1">No messages yet</p>
              <p className="text-[12px] text-[#4e5d72]">
                Say hi! Ask about scheduling, tutors, or anything else.
              </p>
            </div>
          ) : (
            <>
              {/* Welcome message */}
              <div className="flex gap-3 items-end">
                <div className="w-7 h-7 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#d4a853]">N</span>
                </div>
                <div className="max-w-[78%]">
                  <div className="px-4 py-3 bg-[#141b2d] border border-white/[0.07] rounded-2xl rounded-bl-md">
                    <p className="text-[13.5px] text-[#c8d0de] leading-relaxed">
                      Welcome to Nyx Scholars! 👋 We&apos;re here to help with scheduling, tutor matching, or any questions about your prep journey.
                    </p>
                  </div>
                  <p className="text-[11px] text-[#4e5d72] mt-1 ml-1">Nyx Scholars</p>
                </div>
              </div>

              {messages.map((msg, i) => {
                const isStudent = msg.sender === "student";
                const showTime =
                  i === messages.length - 1 ||
                  Math.abs(
                    new Date(messages[i + 1].created_at).getTime() -
                    new Date(msg.created_at).getTime()
                  ) > 10 * 60 * 1000;

                return (
                  <div key={msg.id}>
                    {showTime && (
                      <p className="text-center text-[11px] text-[#4e5d72] my-2">
                        {format(new Date(msg.created_at), "MMM d, h:mm a")}
                      </p>
                    )}
                    <div className={cn("flex gap-2.5 items-end", isStudent && "flex-row-reverse")}>
                      {!isStudent && (
                        <div className="w-7 h-7 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/20 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-[#d4a853]">N</span>
                        </div>
                      )}
                      <div className={cn("max-w-[78%]", isStudent && "items-end")}>
                        <div
                          className={cn(
                            "px-4 py-3 rounded-2xl",
                            isStudent
                              ? "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black rounded-br-md"
                              : "bg-[#141b2d] border border-white/[0.07] text-[#c8d0de] rounded-bl-md"
                          )}
                        >
                          <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {!isStudent && !msg.read && (
                          <span className="text-[10px] text-[#d4a853] ml-1 mt-0.5 block">New</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-3 border-t border-white/[0.06] shrink-0">
          {error && (
            <p className="text-[12px] text-red-400 mb-2 px-1">{error}</p>
          )}
          <form onSubmit={handleSend} className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nyx Scholars… (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all resize-none"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                newMessage.trim() && !sending
                  ? "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black hover:from-[#eac068] hover:to-[#d4a045] shadow-md shadow-[#d4a853]/20"
                  : "bg-white/[0.06] text-[#4e5d72] cursor-not-allowed"
              )}
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
