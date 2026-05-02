"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendarPlus, CheckCircle, Lock, ArrowLeft, ShieldCheck, Sparkles, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TUTORS, type Tutor } from "@/lib/mock/tutors";
import { getAvailability, type DayAvailability, type Slot } from "@/lib/mock/availability";
import type { Profile, PlanType } from "@/types/portal";

const SAT_SUBJECTS   = ["SAT Math", "SAT Reading & Writing", "Full SAT Prep"];
const ACT_SUBJECTS   = ["ACT Math", "ACT English", "ACT Reading", "ACT Science", "Full ACT Prep"];
const AP_SUBJECTS    = ["AP Calculus", "AP Chemistry", "AP Physics", "AP Biology", "AP English", "AP History", "AP Statistics", "Other AP Course"];
const ADMISSIONS_SUBJECTS = ["College Essay Review", "Brainstorming Session", "School List Strategy", "Activity List Review", "Interview Preparation", "Full Application Strategy"];

function getSubjectGroups(plan: PlanType | null, planSubject: string | null, addons: string[] | null) {
  const hasCounseling = plan === "counseling" || addons?.includes("counseling");
  const isTutoringPlan = plan === "monthly" || plan === "session";

  if (plan === "session") {
    switch (planSubject) {
      case "SAT":               return [{ label: "SAT", subjects: SAT_SUBJECTS }];
      case "ACT":               return [{ label: "ACT", subjects: ACT_SUBJECTS }];
      case "AP":                return [{ label: "AP Courses", subjects: AP_SUBJECTS }];
      case "College Admissions":return [{ label: "College Admissions", subjects: ADMISSIONS_SUBJECTS }];
      default:                  return [{ label: "SAT", subjects: SAT_SUBJECTS }, { label: "ACT", subjects: ACT_SUBJECTS }, { label: "AP Courses", subjects: AP_SUBJECTS }];
    }
  }

  const groups: { label: string; subjects: string[] }[] = [];
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
  return groups;
}

function tutorDefaultSubject(tutor: Tutor): string {
  if (tutor.tags.includes("Math") && tutor.tags.includes("Reading")) return "Full SAT Prep";
  if (tutor.tags.includes("Math")) return "SAT Math";
  if (tutor.tags.includes("Reading") || tutor.tags.includes("Writing")) return "SAT Reading & Writing";
  if (tutor.tags.includes("Admissions")) return "Full Application Strategy";
  return "Full SAT Prep";
}

export default function SchedulePage() {
  return (
    <Suspense fallback={null}>
      <ScheduleInner />
    </Suspense>
  );
}

function ScheduleInner() {
  const params = useSearchParams();
  const tutorIdQ = params.get("tutor");
  const isPending = params.get("pending") === "1";

  // Restore any pending booking stashed before signup
  const [restoredTutorId, setRestoredTutorId] = useState<string | null>(null);
  useEffect(() => {
    if (!isPending || tutorIdQ) return;
    try {
      const raw = localStorage.getItem("nyx-pending-booking");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { tutorId?: string };
      if (parsed.tutorId) setRestoredTutorId(parsed.tutorId);
    } catch {
      /* ignore */
    }
  }, [isPending, tutorIdQ]);

  const tutorId = tutorIdQ ?? restoredTutorId;
  const tutor = useMemo(() => TUTORS.find((t) => t.id === tutorId) ?? null, [tutorId]);

  if (tutor) return <TutorBookingFlow tutor={tutor} />;
  return <LegacyForm />;
}

/* ───────────────────────────────────────────────────────────
 * Tutor-driven booking flow — the new conversion path
 * ─────────────────────────────────────────────────────────── */
function TutorBookingFlow({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [days] = useState<DayAvailability[]>(() => getAvailability(tutor.id, 7));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [duration, setDuration] = useState<30 | 60 | 90>(30);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    void supabase.auth.getUser().then(async (res: { data: { user: { id: string } | null } }) => {
      const user = res.data.user;
      setAuthed(!!user);
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setProfile(data as Profile);
      }
      setAuthChecked(true);
    });
  }, []);

  // Restore pending booking (post-signup) or auto-select first trial slot
  useEffect(() => {
    if (selectedSlot) return;
    let restored = false;
    try {
      const raw = localStorage.getItem("nyx-pending-booking");
      if (raw) {
        const p = JSON.parse(raw) as { tutorId?: string; slotIso?: string; duration?: number; notes?: string };
        if (p.tutorId === tutor.id && p.slotIso) {
          for (const day of days) {
            const found = day.slots.find((s) => s.iso === p.slotIso);
            if (found && found.available) {
              setSelectedSlot(found);
              if (p.duration === 60 || p.duration === 90) setDuration(p.duration);
              if (p.notes) setNotes(p.notes);
              restored = true;
              localStorage.removeItem("nyx-pending-booking");
              break;
            }
          }
        }
      }
    } catch {
      /* ignore */
    }
    if (restored) return;
    for (const day of days) {
      const trial = day.slots.find((s) => s.isTrial);
      if (trial) {
        setSelectedSlot(trial);
        break;
      }
    }
  }, [days, selectedSlot, tutor.id]);

  const isTrial = selectedSlot?.isTrial === true;
  const sessionLengthMins = isTrial ? 30 : duration;
  const cost = isTrial ? 0 : Math.round((tutor.rateUSD / 60) * duration);

  async function bookTrial() {
    if (!selectedSlot) return;
    setError("");

    if (!authed) {
      // Stash the intended booking and redirect to signup — bookings complete server-side after auth
      try {
        localStorage.setItem(
          "nyx-pending-booking",
          JSON.stringify({
            tutorId: tutor.id,
            slotIso: selectedSlot.iso,
            duration: sessionLengthMins,
            isTrial,
            notes,
            createdAt: new Date().toISOString(),
          }),
        );
      } catch {
        /* ignore quota errors */
      }
      router.push("/portal/signup?redirect=/portal/schedule&pending=1");
      return;
    }

    setSubmitting(true);
    const subject = tutorDefaultSubject(tutor);
    const res = await fetch("/api/portal/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        scheduled_at: selectedSlot.iso,
        duration_minutes: sessionLengthMins,
        format: "Online (Video Call)",
        student_notes: `[Tutor: ${tutor.name} (${tutor.school})]${notes ? "\n\n" + notes : ""}`,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || "Failed to confirm booking. Please try again.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="grid place-items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#7dd3fc]/10 border border-[#7dd3fc]/30 grid place-items-center">
            <CheckCircle size={28} className="text-[#7dd3fc]" />
          </div>
        </div>
        <h1
          className="text-center font-light leading-[1.1] mb-4"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 38, color: "var(--text-1)" }}
        >
          Booked.{" "}
          <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "#7dd3fc" }}>
            See you soon.
          </span>
        </h1>
        <p className="text-center text-[var(--text-2)] mb-8 leading-[1.7]">
          Your {isTrial ? "free trial" : "session"} with{" "}
          <span className="text-[var(--text-1)] italic" style={{ fontFamily: "var(--font-fraunces)" }}>{tutor.name}</span>{" "}
          is on the calendar. We&apos;ll send the video link to your email and to{" "}
          <Link href="/portal/messages" className="text-[#7dd3fc] hover:underline">your messages</Link>{" "}
          shortly.
        </p>
        <div className="bg-[#0c1124]/85 border border-[var(--border)] rounded-[14px] p-6 mb-8 grid grid-cols-2 gap-y-4 text-[14px]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-3)] mb-1">TUTOR</p>
            <p className="text-[var(--text-1)] italic" style={{ fontFamily: "var(--font-fraunces)" }}>{tutor.name}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-3)] mb-1">FROM</p>
            <p className="text-[var(--text-1)]">{tutor.school}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-3)] mb-1">WHEN</p>
            <p className="text-[var(--text-1)] font-mono">
              {selectedSlot ? new Date(selectedSlot.iso).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-3)] mb-1">LENGTH</p>
            <p className="text-[var(--text-1)] font-mono">{sessionLengthMins} min · {isTrial ? "Free trial" : `$${cost}`}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/portal/sessions"
            className="px-6 py-3 rounded-xl bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black font-bold text-[14px] text-center hover:brightness-110 transition-all"
          >
            View my sessions
          </Link>
          <Link
            href="/portal/consultation"
            className="px-6 py-3 rounded-xl border border-[var(--border-2)] text-[var(--text-1)] font-medium text-[14px] text-center hover:bg-[var(--surface)] transition-all"
          >
            Open my sky →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2">
      <Link
        href="/tutors"
        className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-1)] text-[12px] font-mono tracking-[0.2em] uppercase mb-6 transition-colors"
      >
        <ArrowLeft size={12} /> Back to roster
      </Link>

      {/* Tutor card */}
      <div className="bg-[#0c1124]/85 border border-[var(--border)] rounded-[18px] p-6 md:p-8 mb-8">
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="grid place-items-center shrink-0"
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#141a30", border: "1px solid #3b7a99",
                fontFamily: "var(--font-fraunces)", fontSize: 22, color: "#e6e9f5",
              }}
            >
              {tutor.name[0]}
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] text-[#7dd3fc] mb-1">
                BOOKING WITH
              </p>
              <h1
                className="italic mb-1"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 32, color: "var(--text-1)", lineHeight: 1 }}
              >
                {tutor.name}
              </h1>
              <p className="font-mono text-[11px] tracking-[0.18em] text-[var(--text-3)]">
                {tutor.school.toUpperCase()} · CLASS OF {tutor.classOf} · SAT {tutor.satScore}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.22em] text-[var(--text-3)]">RATE</p>
            <p className="font-mono text-[18px] text-[var(--text-1)]">
              ${tutor.rateUSD}<span className="text-[12px] text-[var(--text-3)]">/hr</span>
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#7dd3fc] mt-1">
              FREE 30-MIN TRIAL
            </p>
          </div>
        </div>
        <p
          className="mt-5 italic text-[var(--text-1)] leading-[1.5]"
          style={{ fontFamily: "var(--font-fraunces)", fontSize: 16 }}
        >
          &ldquo;{tutor.pitch}&rdquo;
        </p>
        <div className="mt-5 grid grid-cols-3 gap-4 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <Stat icon={ShieldCheck} label="VETTED" value="1500+ SAT" />
          <Stat icon={Sparkles}    label="STUDENTS" value={`${tutor.studentsTaught}`} />
          <Stat icon={Video}       label="FORMAT" value="Online video" />
        </div>
      </div>

      {/* Slot grid */}
      <h2
        className="font-light mb-1"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: 24, color: "var(--text-1)" }}
      >
        Pick a time.
      </h2>
      <p className="text-[14px] text-[var(--text-2)] mb-6">
        Times shown in your local timezone. The first available slot is held free as your trial.
      </p>

      <div className="bg-[#0c1124]/70 border border-[var(--border)] rounded-[18px] overflow-hidden mb-7">
        <div className="grid grid-cols-7 border-b border-[var(--border)]">
          {days.map((d) => (
            <div key={d.date.toISOString()} className="px-2 py-3 text-center" style={{ borderRight: "1px solid var(--border)" }}>
              <div className="font-mono text-[9px] tracking-[0.22em] text-[var(--text-3)]">{d.weekday.toUpperCase()}</div>
              <div
                className="mt-1"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 16, color: "var(--text-1)" }}
              >
                {d.monthDay.split(" ")[1]}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((d) => (
            <div key={d.date.toISOString()} className="p-2 flex flex-col gap-1.5" style={{ borderRight: "1px solid var(--border)" }}>
              {d.slots.map((s) => {
                const isSelected = selectedSlot?.iso === s.iso;
                const isPast = !s.available && new Date(s.iso).getTime() < Date.now();
                return (
                  <button
                    key={s.iso}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSelectedSlot(s)}
                    className={cn(
                      "w-full px-2 py-2 rounded-md text-[11.5px] font-mono tracking-wider transition-all relative",
                      isSelected
                        ? "bg-[#7dd3fc] text-[#070914] font-semibold"
                        : s.available
                          ? "bg-[#141a30] text-[var(--text-1)] hover:bg-[#1e2542] border border-transparent hover:border-[#3b7a99]"
                          : "bg-transparent text-[var(--text-3)]/40 line-through cursor-not-allowed",
                    )}
                    title={isPast ? "Past" : s.available ? `Book ${s.label}` : "Unavailable"}
                  >
                    {s.label}
                    {s.isTrial && !isSelected ? (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#7dd3fc] shadow-[0_0_6px_#7dd3fc]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Duration + notes (skip duration for trial) */}
      {!isTrial ? (
        <div className="mb-7">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--text-3)] mb-3">SESSION LENGTH</p>
          <div className="flex gap-2">
            {([60, 90] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl border transition-all text-[14px]",
                  duration === d
                    ? "bg-[#7dd3fc]/10 border-[#7dd3fc] text-[var(--text-1)]"
                    : "bg-[#0c1124]/70 border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-2)]",
                )}
              >
                {d} minutes
                <span className="block font-mono text-[11px] text-[var(--text-3)] mt-0.5">
                  ${Math.round((tutor.rateUSD / 60) * d)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-8">
        <label className="font-mono text-[10px] tracking-[0.22em] text-[var(--text-3)] block mb-2">
          NOTES FOR YOUR TUTOR <span className="lowercase tracking-normal text-[var(--text-3)]">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything specific you want to focus on, current score, test date, etc."
          className="w-full p-3.5 rounded-xl bg-[#0c1124]/70 border border-[var(--border)] text-[14px] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#7dd3fc]/40 transition-all resize-none"
        />
      </div>

      {/* Confirm strip */}
      {error ? (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
          {error}
        </div>
      ) : null}

      <div className="bg-[#0c1124]/85 border border-[var(--border)] rounded-[18px] p-5 md:p-6 flex items-center justify-between gap-5 flex-wrap">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--text-3)] mb-1">
            {selectedSlot ? "YOU'RE BOOKING" : "PICK A TIME ABOVE"}
          </p>
          {selectedSlot ? (
            <p className="text-[var(--text-1)] text-[15px]">
              <span className="italic" style={{ fontFamily: "var(--font-fraunces)" }}>{tutor.name}</span>
              {" · "}
              <span className="font-mono">
                {new Date(selectedSlot.iso).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
              {" · "}
              <span className="font-mono">{sessionLengthMins}min</span>
            </p>
          ) : (
            <p className="text-[var(--text-3)] text-[14px]">Select an available slot to continue.</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.22em] text-[var(--text-3)]">TOTAL</p>
            <p className="font-mono text-[20px] text-[var(--text-1)]">
              {isTrial ? "Free" : `$${cost}`}
            </p>
          </div>
          <button
            type="button"
            disabled={!selectedSlot || submitting || !authChecked}
            onClick={bookTrial}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-[14px] tracking-wide transition-all flex items-center gap-2",
              selectedSlot
                ? "bg-gradient-to-b from-[var(--accent-bright)] to-[var(--accent)] text-black hover:brightness-110"
                : "bg-[#141a30] text-[var(--text-3)] cursor-not-allowed",
              submitting && "opacity-60 cursor-wait",
            )}
          >
            <CalendarPlus size={16} />
            {submitting
              ? "Confirming…"
              : !authed && authChecked
                ? "Continue → Sign up"
                : isTrial
                  ? "Confirm free trial"
                  : "Confirm booking"}
          </button>
        </div>
      </div>

      {!authed && authChecked ? (
        <p className="mt-4 text-center text-[12px] text-[var(--text-3)]">
          You&apos;ll create a free account to confirm — your slot is held while you sign up.
        </p>
      ) : null}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.22em] text-[var(--text-3)] mb-1">
        <Icon size={11} />
        {label}
      </div>
      <p className="text-[var(--text-1)] text-[13px]">{value}</p>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Legacy plan-driven form — kept verbatim for users who land
 * here without a tutor selected.
 * ─────────────────────────────────────────────────────────── */
function LegacyForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subject, setSubject] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [format, setFormat] = useState("");
  const [duration, setDuration] = useState("60 minutes");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
  const planLocked = profile?.plan === "session";

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
      body: JSON.stringify({ subject, scheduled_at: scheduledAt, duration_minutes: durationMinutes, format, student_notes: notes || null }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Failed to submit request. Please try again.");
    else setSuccess(true);
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
            : "Request a session — we'll confirm within 24 hours and send you a meeting link."}{" "}
          <Link href="/tutors" className="text-[#7dd3fc] hover:underline">Or pick a tutor first →</Link>
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">
              {error}
            </div>
          )}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-[var(--text-2)]">Session Format <span className="text-red-400">*</span></label>
              <div className="space-y-2">
                {["Online (Video Call)", "In-Person", "Either"].map((f) => (
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
                {["45 minutes", "60 minutes", "90 minutes", "2 hours"].map((d) => (
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
