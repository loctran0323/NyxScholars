"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "SAT Math",
  "SAT Reading & Writing",
  "ACT Math",
  "ACT English",
  "ACT Reading",
  "ACT Science",
  "Full SAT Prep",
  "Full ACT Prep",
  "AP Calculus",
  "AP Chemistry",
  "AP Physics",
  "AP Biology",
  "AP English",
  "AP History",
  "AP Statistics",
  "Other AP Course",
  "College Essay Review",
  "Brainstorming Session",
  "School List Strategy",
  "Activity List Review",
  "Interview Preparation",
  "Full Application Strategy",
  "Other",
];

const FORMATS = ["Online (Video Call)", "In-Person", "Either"];
const DURATIONS = ["45 minutes", "60 minutes", "90 minutes", "2 hours"];

export default function SchedulePage() {
  const [subject, setSubject] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [format, setFormat] = useState("");
  const [duration, setDuration] = useState("60 minutes");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !preferredDate || !preferredTime || !format) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    const scheduledAt = new Date(`${preferredDate}T${preferredTime}`).toISOString();
    const durationMinutes = parseInt(duration);

    const res = await fetch("/api/portal/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        format,
        student_notes: notes || null,
      }),
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
        <h2 className="text-2xl font-bold text-[#f0ece3] mb-2">Request Submitted!</h2>
        <p className="text-[#8d9ab0] leading-relaxed mb-6">
          Your session request has been received. The Nyx Scholars team will confirm your session and send you a meeting link within 24 hours.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/portal/sessions")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold text-[14px] hover:from-[#eac068] hover:to-[#d4a045] transition-all"
          >
            View My Sessions
          </button>
          <button
            onClick={() => { setSuccess(false); setSubject(""); setNotes(""); setPreferredDate(""); setPreferredTime(""); setFormat(""); }}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#c8d0de] font-medium text-[14px] hover:border-white/[0.18] transition-all"
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
        <p className="text-[13px] text-[#4e5d72] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[#f0ece3]">Schedule a Session</h1>
        <p className="text-[#8d9ab0] mt-1 text-[14px]">
          Request a tutoring session. We&apos;ll confirm within 24 hours and send you a meeting link.
        </p>
      </div>

      <div className="bg-[#0f1521] border border-white/[0.08] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#8d9ab0]">
              Subject <span className="text-red-400">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all cursor-pointer"
            >
              <option value="" className="text-[#4e5d72]">Select a subject</option>
              <optgroup label="SAT" className="text-[#4e5d72]">
                {SUBJECTS.filter((s) => s.includes("SAT")).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="ACT">
                {SUBJECTS.filter((s) => s.includes("ACT")).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="AP Courses">
                {SUBJECTS.filter((s) => s.includes("AP")).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="College Admissions">
                {["College Essay Review", "Brainstorming Session", "School List Strategy", "Activity List Review", "Interview Preparation", "Full Application Strategy"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="Other">
                {["Other"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[#8d9ab0]">
                Preferred Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                min={today}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[#8d9ab0]">
                Preferred Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Format + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[#8d9ab0]">
                Session Format <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setFormat(f)}
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                        format === f
                          ? "border-[#d4a853] bg-[#d4a853]"
                          : "border-white/[0.2] hover:border-white/[0.4]"
                      )}
                    >
                      {format === f && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <span
                      onClick={() => setFormat(f)}
                      className={cn(
                        "text-[13px] transition-colors",
                        format === f ? "text-[#f0ece3]" : "text-[#8d9ab0] group-hover:text-[#c8d0de]"
                      )}
                    >
                      {f}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[#8d9ab0]">Duration</label>
              <div className="space-y-2">
                {DURATIONS.map((d) => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setDuration(d)}
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                        duration === d
                          ? "border-[#d4a853] bg-[#d4a853]"
                          : "border-white/[0.2] hover:border-white/[0.4]"
                      )}
                    >
                      {duration === d && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <span
                      onClick={() => setDuration(d)}
                      className={cn(
                        "text-[13px] transition-colors",
                        duration === d ? "text-[#f0ece3]" : "text-[#8d9ab0] group-hover:text-[#c8d0de]"
                      )}
                    >
                      {d}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#8d9ab0]">
              Additional Notes <span className="text-[#4e5d72] font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Tell us about specific topics you'd like to cover, your current score, or any other details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f1a] border border-white/[0.08] text-[14px] text-[#f0ece3] placeholder:text-[#4e5d72] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/40 focus:border-[#d4a853]/40 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-12 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2",
              "bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black",
              "hover:from-[#eac068] hover:to-[#d4a045] shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/35",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            <CalendarPlus size={17} />
            {loading ? "Submitting…" : "Submit Session Request"}
          </button>

          <p className="text-[12px] text-[#4e5d72] text-center">
            We&apos;ll confirm your session and send you a meeting link within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
