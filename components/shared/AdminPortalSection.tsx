"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Video, Send, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Session, Message } from "@/types/portal";

type SessionWithProfile = Session & {
  profiles: { full_name: string | null; grade: string | null; target_test: string | null } | null;
};

type MessageWithProfile = Message & {
  profiles: { full_name: string | null } | null;
};

function statusColor(status: string) {
  switch (status) {
    case "confirmed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "completed": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
    default: return "text-[#d4a853] bg-[#d4a853]/10 border-[#d4a853]/20";
  }
}

function SessionRow({ session, onUpdate }: { session: SessionWithProfile; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [tutorName, setTutorName] = useState(session.tutor_name ?? "");
  const [meetingLink, setMeetingLink] = useState(session.meeting_link ?? "");
  const [adminNotes, setAdminNotes] = useState(session.admin_notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (newStatus?: string) => {
    setSaving(true);
    await fetch("/api/admin/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        status: newStatus ?? session.status,
        tutor_name: tutorName || null,
        meeting_link: meetingLink || null,
        admin_notes: adminNotes || null,
      }),
    });
    setSaving(false);
    onUpdate();
  };

  const studentName = session.profiles?.full_name ?? "Unknown Student";

  return (
    <div className="border border-[#2a3a52] rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-[#0f1623] cursor-pointer hover:bg-[#161e2e] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 grid grid-cols-4 gap-4 min-w-0">
          <span className="text-[#f0ede6] font-medium text-sm truncate">{studentName}</span>
          <span className="text-[#8896a7] text-sm truncate">{session.subject}</span>
          <span className="text-[#8896a7] text-xs">
            {format(new Date(session.scheduled_at), "MMM d, h:mm a")}
          </span>
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border w-fit",
            statusColor(session.status)
          )}>
            {session.status}
          </span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-[#8896a7] shrink-0" /> : <ChevronDown size={14} className="text-[#8896a7] shrink-0" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-3 bg-[#161e2e] border-t border-[#2a3a52] space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1">Grade</p>
              <p className="text-[#f0ede6] text-sm">{session.profiles?.grade ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1">Target Test</p>
              <p className="text-[#f0ede6] text-sm">{session.profiles?.target_test ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1">Duration</p>
              <p className="text-[#f0ede6] text-sm">{session.duration_minutes} min</p>
            </div>
          </div>

          {session.student_notes && (
            <div>
              <p className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1">Student Notes</p>
              <p className="text-[#c8d0de] text-sm">{session.student_notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1 block">Tutor Name</label>
              <input
                type="text"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
                placeholder="Assign a tutor"
                className="w-full h-8 px-3 rounded-lg bg-[#0f1623] border border-[#2a3a52] text-[13px] text-[#f0ede6] placeholder:text-[#4a5a6a] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1 block">Meeting Link</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://daily.co/..."
                className="w-full h-8 px-3 rounded-lg bg-[#0f1623] border border-[#2a3a52] text-[13px] text-[#f0ede6] placeholder:text-[#4a5a6a] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#8896a7] uppercase tracking-wide mb-1 block">Admin Notes (shown to student)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Any notes for the student..."
              className="w-full px-3 py-2 rounded-lg bg-[#0f1623] border border-[#2a3a52] text-[13px] text-[#f0ede6] placeholder:text-[#4a5a6a] focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            {session.status === "pending" && (
              <button
                onClick={() => handleUpdate("confirmed")}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-medium hover:bg-blue-500/15 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={13} />
                Confirm
              </button>
            )}
            {session.status === "confirmed" && (
              <button
                onClick={() => handleUpdate("completed")}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/15 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={13} />
                Mark Complete
              </button>
            )}
            {session.status !== "cancelled" && session.status !== "completed" && (
              <button
                onClick={() => handleUpdate("cancelled")}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-medium hover:bg-red-500/15 transition-colors disabled:opacity-50"
              >
                <XCircle size={13} />
                Cancel
              </button>
            )}
            <button
              onClick={() => handleUpdate()}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[12px] font-medium hover:bg-amber-500/15 transition-colors disabled:opacity-50 ml-auto"
            >
              <Video size={13} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageThread({ studentId, studentName, messages, onReply }: {
  studentId: string;
  studentName: string;
  messages: MessageWithProfile[];
  onReply: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const unread = messages.filter((m) => m.sender === "student" && !m.read).length;

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, content: reply.trim() }),
    });
    setReply("");
    setSending(false);
    onReply();
  };

  const lastMsg = messages[messages.length - 1];

  return (
    <div className="border border-[#2a3a52] rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 bg-[#0f1623] cursor-pointer hover:bg-[#161e2e] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/20 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#d4a853]">
            {studentName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[#f0ede6] font-medium text-sm">{studentName}</span>
            {unread > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d4a853] text-black text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          {lastMsg && (
            <p className="text-[#8896a7] text-xs truncate">
              {lastMsg.sender === "nyx" ? "You: " : ""}{lastMsg.content}
            </p>
          )}
        </div>
        <span className="text-[11px] text-[#4a5a6a] shrink-0">
          {messages.length} msg{messages.length !== 1 ? "s" : ""}
        </span>
        {expanded ? <ChevronUp size={14} className="text-[#8896a7] shrink-0" /> : <ChevronDown size={14} className="text-[#8896a7] shrink-0" />}
      </div>

      {expanded && (
        <div className="bg-[#161e2e] border-t border-[#2a3a52]">
          <div className="max-h-48 overflow-y-auto px-4 py-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2", msg.sender === "nyx" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "px-3 py-2 rounded-xl text-[13px] max-w-[80%]",
                  msg.sender === "nyx"
                    ? "bg-amber-500/15 border border-amber-500/20 text-amber-200"
                    : "bg-[#1e2a3a] border border-[#2a3a52] text-[#c8d0de]"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 px-4 pb-3 pt-2 border-t border-[#2a3a52]">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Reply as Nyx Scholars…"
              className="flex-1 h-8 px-3 rounded-lg bg-[#0f1623] border border-[#2a3a52] text-[13px] text-[#f0ede6] placeholder:text-[#4a5a6a] focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!reply.trim() || sending}
              className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400 flex items-center justify-center hover:bg-amber-500/25 transition-colors disabled:opacity-40"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortalSection() {
  const [tab, setTab] = useState<"sessions" | "messages">("sessions");
  const [sessions, setSessions] = useState<SessionWithProfile[]>([]);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [sessRes, msgRes] = await Promise.all([
      fetch("/api/admin/sessions"),
      fetch("/api/admin/messages"),
    ]);
    if (sessRes.ok) {
      const d = await sessRes.json();
      setSessions(d.sessions ?? []);
    }
    if (msgRes.ok) {
      const d = await msgRes.json();
      setMessages(d.messages ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Group messages by student
  const messagesByStudent: Record<string, { studentName: string; messages: MessageWithProfile[] }> = {};
  for (const msg of messages) {
    if (!messagesByStudent[msg.student_id]) {
      messagesByStudent[msg.student_id] = {
        studentName: msg.profiles?.full_name ?? msg.student_id.slice(0, 8),
        messages: [],
      };
    }
    messagesByStudent[msg.student_id].messages.push(msg);
  }

  const pendingSessions = sessions.filter((s) => s.status === "pending").length;
  const unreadMessages = messages.filter((m) => m.sender === "student" && !m.read).length;

  return (
    <div className="mt-10">
      <div className="flex items-center gap-1 border-b border-[#2a3a52] mb-5">
        {(["sessions", "messages"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px transition-colors flex items-center gap-2",
              tab === t
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-[#8896a7] hover:text-[#f0ede6]"
            )}
          >
            {t}
            {t === "sessions" && pendingSessions > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d4a853] text-black text-[9px] font-bold flex items-center justify-center">
                {pendingSessions}
              </span>
            )}
            {t === "messages" && unreadMessages > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d4a853] text-black text-[9px] font-bold flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#8896a7] text-sm">Loading…</p>
      ) : tab === "sessions" ? (
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-[#8896a7] text-sm text-center py-8">No session requests yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[11px] text-[#8896a7] uppercase tracking-wide">
                <span>Student</span><span>Subject</span><span>Date</span><span>Status</span>
              </div>
              {sessions.map((s) => (
                <SessionRow key={s.id} session={s} onUpdate={loadData} />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {Object.keys(messagesByStudent).length === 0 ? (
            <p className="text-[#8896a7] text-sm text-center py-8">No student messages yet.</p>
          ) : (
            Object.entries(messagesByStudent).map(([studentId, { studentName, messages: msgs }]) => (
              <MessageThread
                key={studentId}
                studentId={studentId}
                studentName={studentName}
                messages={msgs}
                onReply={loadData}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
