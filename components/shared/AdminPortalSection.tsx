"use client";

import { useState, useEffect, useRef } from "react";
import { Send, CheckCircle, XCircle, ChevronRight, ArrowLeft, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Session, Message } from "@/types/portal";

type SessionWithProfile = Session & {
  profiles: { full_name: string | null; grade: string | null; target_test: string | null } | null;
};

type MessageWithProfile = Message & {
  profiles: { full_name: string | null } | null;
};

function statusBadge(status: string) {
  switch (status) {
    case "confirmed":  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-400/10 text-blue-400">Confirmed</span>;
    case "completed":  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400">Completed</span>;
    case "cancelled":  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-400/10 text-red-400">Cancelled</span>;
    default:           return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent)]/10 text-[var(--accent)]">Pending</span>;
  }
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

/* ── Session detail panel ──────────────────────────────────── */
function SessionDetail({ session, onBack, onUpdate }: {
  session: SessionWithProfile;
  onBack: () => void;
  onUpdate: () => void;
}) {
  const [tutorName, setTutorName] = useState(session.tutor_name ?? "");
  const [meetingLink, setMeetingLink] = useState(session.meeting_link ?? "");
  const [adminNotes, setAdminNotes] = useState(session.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState(0);

  const studentName = session.profiles?.full_name ?? "Unknown Student";

  const patch = async (overrides: Record<string, unknown> = {}) => {
    setSaving(true);
    await fetch("/api/admin/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        tutor_name: tutorName || null,
        meeting_link: meetingLink || null,
        admin_notes: adminNotes || null,
        ...overrides,
      }),
    });
    setSaving(false);
    setSavedKey((k) => k + 1);
    onUpdate();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[var(--text-2)] hover:text-[var(--text-1)] text-[13px] transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Back to sessions
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-11 h-11 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
          <span className="text-[12px] font-bold text-[var(--accent)]">{initials(session.profiles?.full_name ?? null)}</span>
        </div>
        <div>
          <h3 className="text-[17px] font-bold text-[var(--text-1)]">{studentName}</h3>
          <p className="text-[var(--text-2)] text-[13px]">
            {session.subject} · {format(new Date(session.scheduled_at), "MMM d, h:mm a")} · {session.duration_minutes} min
          </p>
          <div className="mt-2">{statusBadge(session.status)}</div>
        </div>
      </div>

      {/* Meta */}
      {(session.profiles?.grade || session.profiles?.target_test || session.student_notes) && (
        <div className="mb-6 space-y-2">
          {session.profiles?.grade && (
            <p className="text-[13px] text-[var(--text-2)]"><span className="text-[var(--text-3)]">Grade</span> · {session.profiles.grade}</p>
          )}
          {session.profiles?.target_test && (
            <p className="text-[13px] text-[var(--text-2)]"><span className="text-[var(--text-3)]">Target test</span> · {session.profiles.target_test}</p>
          )}
          {session.student_notes && (
            <div className="mt-3 p-3.5 rounded-xl bg-white/[0.03] border border-[var(--border)]">
              <p className="text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wide mb-1.5">Student Notes</p>
              <p className="text-[var(--text-1)] text-[13px] leading-relaxed">{session.student_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Editable fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wide mb-1.5">Tutor Name</label>
          <input
            type="text"
            value={tutorName}
            onChange={(e) => setTutorName(e.target.value)}
            placeholder="Assign a tutor"
            className="w-full h-9 px-3 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[13px] text-[var(--text-1)] placeholder:text-[#2e3a4a] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wide mb-1.5">Meeting Link</label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            className="w-full h-9 px-3 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[13px] text-[var(--text-1)] placeholder:text-[#2e3a4a] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wide mb-1.5">Note to Student</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
            placeholder="Visible to student in their portal…"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[13px] text-[var(--text-1)] placeholder:text-[#2e3a4a] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40 transition-all resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {session.status === "pending" && (
          <button
            onClick={() => patch({ status: "confirmed" })}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-400/10 text-blue-400 text-[13px] font-medium hover:bg-blue-400/15 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={13} /> Confirm
          </button>
        )}
        {session.status === "confirmed" && (
          <button
            onClick={() => patch({ status: "completed" })}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 text-[13px] font-medium hover:bg-emerald-400/15 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={13} /> Mark Complete
          </button>
        )}
        {session.status !== "cancelled" && session.status !== "completed" && (
          <button
            onClick={() => patch({ status: "cancelled" })}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-[13px] font-medium hover:bg-red-400/15 transition-colors disabled:opacity-50"
          >
            <XCircle size={13} /> Cancel
          </button>
        )}
        <button
          onClick={() => patch()}
          disabled={saving}
          className="ml-auto px-4 py-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-[13px] font-medium hover:bg-[var(--accent)]/15 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : savedKey > 0 ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── Message thread ────────────────────────────────────────── */
function MessageThread({ studentId, studentName, messages, onBack, onReply }: {
  studentId: string;
  studentName: string;
  messages: MessageWithProfile[];
  onBack: () => void;
  onReply: () => void;
}) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
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

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[var(--text-2)] hover:text-[var(--text-1)] text-[13px] transition-colors mb-6 shrink-0"
      >
        <ArrowLeft size={13} />
        Back to messages
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center">
          <span className="text-[11px] font-bold text-[var(--accent)]">{initials(studentName)}</span>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-[var(--text-1)]">{studentName}</p>
          <p className="text-[var(--text-3)] text-[12px]">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-5 min-h-0 max-h-64">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === "nyx" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
              msg.sender === "nyx"
                ? "bg-[var(--accent)]/15 text-[var(--text-1)] rounded-br-md"
                : "bg-white/[0.06] text-[var(--text-1)] rounded-bl-md"
            )}>
              {msg.content}
              <p className={cn("text-[10px] mt-1", msg.sender === "nyx" ? "text-[var(--accent)]/50" : "text-[var(--text-3)]")}>
                {format(new Date(msg.created_at), "h:mm a")}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply */}
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Reply as Nyx…"
          className="flex-1 h-9 px-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[13px] text-[var(--text-1)] placeholder:text-[#2e3a4a] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40 transition-all"
        />
        <button
          onClick={send}
          disabled={!reply.trim() || sending}
          className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)]/25 transition-colors disabled:opacity-40"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Student row (plan management) ────────────────────────── */
type StudentRecord = {
  id: string; email: string; full_name: string | null; grade: string | null;
  plan: string | null; plan_status: string | null; plan_subject: string | null; plan_addons: string[] | null;
};

function StudentRow({ student, onSave }: { student: StudentRecord; onSave: () => void }) {
  const [plan,        setPlan]        = useState(student.plan ?? "");
  const [planStatus,  setPlanStatus]  = useState(student.plan_status ?? "");
  const [planSubject, setPlanSubject] = useState(student.plan_subject ?? "");
  const [counseling,  setCounseling]  = useState(student.plan_addons?.includes("counseling") ?? false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: student.id,
        plan: plan || null,
        plan_status: planStatus || null,
        plan_subject: planSubject || null,
        plan_addons: counseling ? ["counseling"] : [],
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave();
  };

  const displayName = student.full_name ?? student.email.split("@")[0];

  return (
    <div className="py-4 px-4 -mx-4 rounded-xl hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[var(--accent)]">{initials(student.full_name)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[var(--text-1)] text-[13px] font-medium">{displayName}</p>
          <p className="text-[var(--text-3)] text-[11px]">{student.email}{student.grade ? ` · Grade ${student.grade}` : ""}</p>
        </div>
        {student.plan && student.plan_status === "active" && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400">Active</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          className="h-8 px-2 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[12px] text-[var(--text-1)] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40">
          <option value="">No plan</option>
          <option value="session">Session</option>
          <option value="monthly">Scholar Monthly</option>
          <option value="counseling">Admissions Monthly</option>
        </select>

        <select value={planStatus} onChange={(e) => setPlanStatus(e.target.value)}
          className="h-8 px-2 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[12px] text-[var(--text-1)] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40">
          <option value="">No status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {plan === "session" ? (
          <select value={planSubject} onChange={(e) => setPlanSubject(e.target.value)}
            className="h-8 px-2 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] text-[12px] text-[var(--text-1)] focus:outline-none focus:ring-1 focus:ring-[#d4a853]/40">
            <option value="">Subject category</option>
            <option value="SAT">SAT</option>
            <option value="ACT">ACT</option>
            <option value="AP">AP</option>
            <option value="College Admissions">College Admissions</option>
          </select>
        ) : (
          <label className="flex items-center gap-2 h-8 px-2 cursor-pointer">
            <input type="checkbox" checked={counseling} onChange={(e) => setCounseling(e.target.checked)}
              className="w-3.5 h-3.5 accent-amber-400" />
            <span className="text-[12px] text-[var(--text-2)]">+ Counseling add-on</span>
          </label>
        )}

        <button onClick={handleSave} disabled={saving}
          className="h-8 px-3 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-[12px] font-medium hover:bg-[var(--accent)]/20 transition-colors disabled:opacity-50">
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */
export default function AdminPortalSection() {
  const [tab, setTab] = useState<"sessions" | "messages" | "students">("sessions");
  const [sessions, setSessions] = useState<SessionWithProfile[]>([]);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<SessionWithProfile | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  const load = async () => {
    const [sRes, mRes, stRes] = await Promise.all([
      fetch("/api/admin/sessions"),
      fetch("/api/admin/messages"),
      fetch("/api/admin/students"),
    ]);
    if (sRes.ok)  { const d = await sRes.json();  setSessions(d.sessions ?? []); }
    if (mRes.ok)  { const d = await mRes.json();  setMessages(d.messages ?? []); }
    if (stRes.ok) { const d = await stRes.json(); setStudents(d.students ?? []); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  /* Group messages by student */
  const byStudent: Record<string, { name: string; msgs: MessageWithProfile[]; unread: number }> = {};
  for (const m of messages) {
    if (!byStudent[m.student_id]) {
      byStudent[m.student_id] = { name: m.profiles?.full_name ?? m.student_id.slice(0, 8), msgs: [], unread: 0 };
    }
    byStudent[m.student_id].msgs.push(m);
    if (m.sender === "student" && !m.read) byStudent[m.student_id].unread++;
  }

  const pendingCount = sessions.filter((s) => s.status === "pending").length;
  const unreadCount  = messages.filter((m) => m.sender === "student" && !m.read).length;
  const noplanCount  = students.filter((s) => !s.plan || s.plan_status !== "active").length;

  const activeStudent = activeStudentId ? byStudent[activeStudentId] : null;

  return (
    <section>
      {/* Section tabs */}
      <div className="flex items-center gap-0 mb-8 border-b border-[var(--border)]">
        {(["sessions", "messages", "students"] as const).map((t) => {
          const badge = t === "sessions" ? pendingCount : t === "messages" ? unreadCount : noplanCount;
          return (
            <button
              key={t}
              onClick={() => { setTab(t); setActiveSession(null); setActiveStudentId(null); }}
              className={cn(
                "relative px-1 pb-3 mr-6 text-[14px] font-medium transition-colors capitalize flex items-center gap-2",
                tab === t ? "text-[var(--text-1)]" : "text-[var(--text-3)] hover:text-[var(--text-2)]"
              )}
            >
              {t}
              {badge > 0 && (
                <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-black text-[9px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <p className="text-[var(--text-3)] text-[13px]">Loading…</p>
        </div>
      ) : tab === "sessions" ? (
        activeSession ? (
          <SessionDetail
            session={activeSession}
            onBack={() => setActiveSession(null)}
            onUpdate={load}
          />
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[var(--text-3)] text-[14px]">No session requests yet.</p>
            <p className="text-[#2e3a4a] text-[13px] mt-1">Student bookings will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s)}
                className="w-full flex items-center gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-white/[0.03] transition-colors text-left group"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[var(--accent)]">{initials(s.profiles?.full_name ?? null)}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-1)] text-[14px] font-medium">{s.profiles?.full_name ?? "Unknown Student"}</p>
                  <p className="text-[var(--text-3)] text-[12px]">
                    {s.subject} · {format(new Date(s.scheduled_at), "MMM d, h:mm a")}
                  </p>
                </div>

                {statusBadge(s.status)}
                <ChevronRight size={14} className="text-[#2e3a4a] group-hover:text-[var(--text-2)] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )
      ) : tab === "messages" ? (
        activeStudentId && activeStudent ? (
          <MessageThread
            studentId={activeStudentId}
            studentName={activeStudent.name}
            messages={activeStudent.msgs}
            onBack={() => setActiveStudentId(null)}
            onReply={load}
          />
        ) : Object.keys(byStudent).length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[var(--text-3)] text-[14px]">No student messages yet.</p>
            <p className="text-[#2e3a4a] text-[13px] mt-1">Messages from the portal will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {Object.entries(byStudent).map(([sid, { name, msgs, unread }]) => {
              const last = msgs[msgs.length - 1];
              return (
                <button
                  key={sid}
                  onClick={() => setActiveStudentId(sid)}
                  className="w-full flex items-center gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-white/[0.03] transition-colors text-left group"
                >
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--border-accent)] flex items-center justify-center">
                      <span className="text-[11px] font-bold text-[var(--accent)]">{initials(name)}</span>
                    </div>
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--accent)] text-black text-[8px] font-bold flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-1)] text-[14px] font-medium">{name}</p>
                    {last && (
                      <p className="text-[var(--text-3)] text-[12px] truncate">
                        {last.sender === "nyx" ? "You: " : ""}{last.content}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {last && <span className="text-[#2e3a4a] text-[11px]">{format(new Date(last.created_at), "MMM d")}</span>}
                    <ChevronRight size={14} className="text-[#2e3a4a] group-hover:text-[var(--text-2)] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )
      ) : /* students tab */
        students.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[var(--text-3)] text-[14px]">No registered students yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {students.map((s) => (
              <StudentRow key={s.id} student={s} onSave={load} />
            ))}
          </div>
        )
      }
    </section>
  );
}
