"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Profile, PlanType } from "@/types/portal";

const SAT_SUBJECTS   = ["SAT Math", "SAT Reading & Writing", "Full SAT Prep"];
const ACT_SUBJECTS   = ["ACT Math", "ACT English", "ACT Reading", "ACT Science", "Full ACT Prep"];
const AP_SUBJECTS    = ["AP Calculus", "AP Chemistry", "AP Physics", "AP Biology", "AP English", "AP History", "AP Statistics", "Other AP Course"];
const ADMISSIONS_SUBJECTS = ["College Essay Review", "Brainstorming Session", "School List Strategy", "Activity List Review", "Interview Preparation", "Full Application Strategy"];

function getSubjectGroups(plan: PlanType | null, planSubject: string | null, addons: string[] | null) {
  const hasCounseling = plan === "counseling" || addons?.includes("counseling");
  const isTutoringPlan = plan === "monthly" || plan === "session";

  if (plan === "session") {
    // Locked to one category
    switch (planSubject) {
      case "SAT":               return [{ label: "SAT", subjects: SAT_SUBJECTS }];
      case "ACT":               return [{ label: "ACT", subjects: ACT_SUBJECTS }];
      case "AP":                return [{ label: "AP Courses", subjects: AP_SUBJECTS }];
      case "College Admissions":return [{ label: "College Admissions", subjects: ADMISSIONS_SUBJECTS }];
      default:                  return [{ label: "SAT", subjects: SAT_SUBJECTS }, { label: "ACT", subjects: ACT_SUBJECTS }, { label: "AP Courses", subjects: AP_SUBJECTS }];
    }
  }

  const groups = [];
  if (isTutoringPlan || plan === "counseling") {
    if (plan !== "counseling") {
      groups.push({ label: "SAT", subjects: SAT_SUBJECTS });
      groups.push({ label: "ACT", subjects: ACT_SUBJECTS });
      groups.push({ label: "AP Courses", subjects: AP_SUBJECTS });
    }
  }
  if (hasCounseling) {
    groups.push({ label: "College Admissions", subjects: ADMISSIONS_SUBJECTS });
  }
  if (plan === "counseling" && !isTutoringPlan) {
    // Counseling-only plan: just admissions subjects (already added above)
  }
  return groups;
}

const FORMATS  = ["Online (Video Call)", "In-Person", "Either"];
const DURATIONS = ["45 minutes", "60 minutes", "90 minutes", "2 hours"];

export default function SchedulePage() {
  const [profile, setProfile]       = useState<Profile | null>(null);
  const [subject, setSubject]       = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [format, setFormat]         = useState("");
  const [duration, setDuration]     = useState("60 minutes");
  const [notes, setNotes]           = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(async (authRes: { data: { user: { id: string } | null } }) => {
      const user = authRes.data.user;
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
    });
  }, []);

  const subjectGroups = getSubjectGroups(profile?.plan ?? null, profile?.plan_subject ?? null, profile?.plan_addons ?? null);
  const planLocked    = profile?.plan === "session";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !preferredDate || !preferredTime || !format) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    const scheduledAt     = new Date(`${preferredDate}T${preferredTime}`).toISOString();
    const durationMinutes = parseInt(duration);

    const res = await fetch("/api/portal/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, scheduled_at: scheduledAt, duration_minutes: durationMinutes, format, student_notes: notes || null }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to submit request. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={30} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">Request Submitted!</h2>
        <p className="text-[var(--text-2)] leading-relaxed mb-6">
          Your session request has been received. We&apos;ll confirm and send you a meeting link within 24 hours.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/portal/sessions")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black font-bold text-[14px] hover:from-[#e2c685] hover:to-[#cba961] transition-all"
          >
            View My Sessions
          </button>
          <button
            onClick={() => { setSuccess(false); setSubject(""); setNotes(""); setPreferredDate(""); setPreferredTime(""); setFormat(""); }}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[var(--text-1)] font-medium text-[14px] hover:border-[var(--border-2)] transition-all"
          >
            Schedule Another
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <p className="text-[13px] text-[var(--text-3)] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[var(--text-1)]">Schedule a Session</h1>
        <p className="text-[var(--text-2)] mt-1 text-[14px]">
          {planLocked
            ? `Your Session plan includes ${profile?.plan_subject ?? "your chosen subject"}. Contact us to add more subjects.`
            : "Request a session — we’ll confirm within 24 hours and send you a meeting link."}
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-2)]">
              Subject <span className="text-red-400">*</span>
              {planLocked && <Lock size={11} className="text-[var(--text-3)]" />}
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all cursor-pointer"
            >
              <option value="">Select a subject</option>
              {subjectGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[var(--text-2)]">
                Preferred Date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={preferredDate} min={today} onChange={(e) => setPreferredDate(e.target.value)} required
                className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[var(--text-2)]">
                Preferred Time <span className="text-red-400">*</span>
              </label>
              <input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} required
                className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Format + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[var(--text-2)]">Session Format <span className="text-red-400">*</span></label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => setFormat(f)} className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", format === f ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-2)] hover:border-[var(--border-2)]")}>
                      {format === f && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <span onClick={() => setFormat(f)} className={cn("text-[13px] transition-colors", format === f ? "text-[var(--text-1)]" : "text-[var(--text-2)] group-hover:text-[var(--text-1)]")}>{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[var(--text-2)]">Duration</label>
              <div className="space-y-2">
                {DURATIONS.map((d) => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => setDuration(d)} className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", duration === d ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border-2)] hover:border-[var(--border-2)]")}>
                      {duration === d && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <span onClick={() => setDuration(d)} className={cn("text-[13px] transition-colors", duration === d ? "text-[var(--text-1)]" : "text-[var(--text-2)] group-hover:text-[var(--text-1)]")}>{d}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[var(--text-2)]">
              Additional Notes <span className="text-[var(--text-3)] font-normal">(optional)</span>
            </label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Specific topics, current score, or anything else you'd like us to know…"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-all resize-none"
            />
          </div>

          <button type="submit" disabled={loading}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2",
              "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black",
              "hover:from-[#e2c685] hover:to-[#cba961] shadow-lg shadow-[var(--accent-dim)] hover:shadow-[var(--border-accent)]",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            <CalendarPlus size={17} />
            {loading ? "Submitting…" : "Submit Session Request"}
          </button>

          <p className="text-[12px] text-[var(--text-3)] text-center">
            We&apos;ll confirm your session and send you a meeting link within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
