"use client";

import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";

interface User {
  id: string;
  full_name: string | null;
  role: "student" | "teacher" | null;
  email?: string;
}

interface Assignment {
  id: string;
  student_id: string;
  teacher_id: string;
  subject: string | null;
  active: boolean;
  created_at: string;
  student: User | null;
  teacher: User | null;
}

const SUBJECT_OPTIONS = ["SAT", "ACT", "AP", "College Admissions", "Other"];

export default function AdminAssignmentsSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentId, setStudentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    try {
      const [usersRes, assignmentsRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/assignments"),
      ]);
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.students ?? []);
      }
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const students = users.filter((u) => u.role !== "teacher");
  const teachers = users.filter((u) => u.role === "teacher");

  async function createAssignment(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId || !teacherId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          teacher_id: teacherId,
          subject: subject || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create");
      } else {
        setStudentId("");
        setTeacherId("");
        setSubject("");
        await refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeAssignment(id: string) {
    if (!confirm("Remove this assignment?")) return;
    const res = await fetch(`/api/admin/assignments?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) await refresh();
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-[var(--text-1)]">Student–Teacher Assignments</h2>
        <span className="text-[var(--text-3)] text-[13px]">{assignments.length} active</span>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6">
        <form onSubmit={createAssignment} className="grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
          <Field label="Student">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] px-3 text-[13px] text-[var(--text-1)]"
              required
            >
              <option value="">Pick a student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name ?? s.email ?? s.id.slice(0, 8)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Teacher">
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] px-3 text-[13px] text-[var(--text-1)]"
              required
            >
              <option value="">Pick a teacher…</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name ?? t.email ?? t.id.slice(0, 8)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subject (optional)">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)] px-3 text-[13px] text-[var(--text-1)]"
            >
              <option value="">— any —</option>
              {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <button
            type="submit"
            disabled={saving || !studentId || !teacherId}
            className="h-10 px-4 rounded-lg bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[13px] hover:bg-[var(--accent-bright)] transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <UserPlus size={14} />
            {saving ? "Adding…" : "Assign"}
          </button>
        </form>
        {error && <p className="text-[12px] text-red-400 mt-3">{error}</p>}
        {teachers.length === 0 && (
          <p className="text-[12px] text-[var(--text-3)] mt-3">
            No teachers signed up yet. Have one register at <code className="text-[var(--accent)]">/portal/signup</code> and pick &ldquo;Teacher&rdquo;.
          </p>
        )}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {assignments.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-[var(--text-3)] text-center">
            No assignments yet.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {assignments.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] text-[var(--text-1)]">
                    <span className="font-semibold">{a.student?.full_name ?? "(no name)"}</span>
                    <span className="text-[var(--text-3)]"> ← </span>
                    <span className="font-semibold">{a.teacher?.full_name ?? "(no name)"}</span>
                  </p>
                  <p className="text-[11px] text-[var(--text-3)] mt-0.5">
                    {a.subject ? `Subject: ${a.subject}` : "All subjects"} · created {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAssignment(a.id)}
                  className="text-[var(--text-3)] hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/[0.06]"
                  aria-label="Remove assignment"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-3)] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
