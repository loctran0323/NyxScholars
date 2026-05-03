import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
 ArrowLeft,
 Calendar,
 Clock,
 User,
 Video,
 ExternalLink,
 AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SessionActions } from "@/components/portal/SessionActions";
import { SessionWorkspace } from "@/components/portal/SessionWorkspace";
import { RescheduleDialog } from "@/components/portal/RescheduleDialog";
import { SessionSummaryComposer } from "@/components/portal/SessionSummaryComposer";
import type { Session, Profile } from "@/types/portal";

function statusVariant(status: string): "gold" | "blue" | "green" | "red" | "default" {
 switch (status) {
 case "confirmed": return "blue";
 case "completed": return "green";
 case "cancelled": return "red";
 default: return "gold";
 }
}

function VideoCallSection({ session }: { session: Session }) {
 const now = Date.now();
 const sessionTime = new Date(session.scheduled_at).getTime();
 const minutesUntil = (sessionTime - now) / 60000;
 const minutesSince = (now - sessionTime) / 60000;
 const isActive = minutesUntil <= 15 && minutesSince <= session.duration_minutes + 15;

 if (session.status === "cancelled") return null;

 if (!session.meeting_link) {
 return (
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
 <h3 className="font-semibold text-[var(--text-1)] mb-2 flex items-center gap-2">
 <Video size={16} className="text-[var(--text-3)]" />
 Video Call
 </h3>
 <div className="flex items-start gap-3 px-4 py-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)]">
 <AlertCircle size={14} className="text-[var(--text-2)] shrink-0 mt-0.5" />
 <p className="text-[13px] text-[var(--text-2)]">
 {session.status === "pending"
 ? "A meeting link will be added once your session is confirmed by the Nyx team."
 : "Your meeting link will appear here before your session."}
 </p>
 </div>
 </div>
 );
 }

 return (
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
 <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
 <h3 className="font-semibold text-[var(--text-1)] flex items-center gap-2">
 <Video size={16} className={isActive ? "text-emerald-400" : "text-[var(--text-3)]"} />
 Video Call
 {isActive && (
 <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
 Live now
 </span>
 )}
 </h3>
 <a
 href={session.meeting_link}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-1.5 text-[12px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
 >
 Open in new tab <ExternalLink size={11} />
 </a>
 </div>

 {isActive ? (
 <div className="relative">
 <iframe
 src={session.meeting_link}
 className="w-full h-[520px] border-0"
 allow="camera; microphone; fullscreen; display-capture; autoplay"
 title="Video call"
 />
 </div>
 ) : (
 <div className="px-5 py-8 text-center">
 <div className="w-14 h-14 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
 <Video size={22} className="text-[var(--text-2)]" />
 </div>
 <p className="text-[var(--text-1)] font-medium mb-1">
 {minutesUntil > 15
 ? `Session starts ${format(new Date(session.scheduled_at), "MMMM d 'at' h:mm a")}`
 : "Session has ended"}
 </p>
 <p className="text-[13px] text-[var(--text-2)] mb-5">
 {minutesUntil > 15
 ? "The video call will appear here 15 minutes before your session."
 : "Thank you for your session!"}
 </p>
 {minutesUntil > 0 && minutesUntil <= 120 && (
 <a
 href={session.meeting_link}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[14px] transition-all"
 >
 <Video size={15} />
 Join Session
 </a>
 )}
 </div>
 )}
 </div>
 );
}

export default async function SessionDetailPage({
 params,
}: {
 params: Promise<{ id: string }>;
}) {
 const { id } = await params;
 const supabase = await getSupabaseServerClient();
 if (!supabase) redirect("/portal/login");

 const { data: { user } } = await supabase.auth.getUser();
 if (!user) redirect("/portal/login");

 const { data: viewerProfile } = await supabase
 .from("profiles")
 .select("role")
 .eq("id", user.id)
 .single();
 const isTutor = (viewerProfile as Pick<Profile, "role"> | null)?.role === "teacher";

 // Tutors can view sessions for students assigned to them; students view their own.
 const { data: session } = isTutor
 ? await supabase.from("sessions").select("*").eq("id", id).single()
 : await supabase.from("sessions").select("*").eq("id", id).eq("student_id", user.id).single();

 if (!session) notFound();

 const s = session as Session & {
 recording_url?: string | null;
 transcript_url?: string | null;
 summary_topics?: string[] | null;
 summary_mistakes?: string[] | null;
 summary_homework?: string[] | null;
 };

 return (
 <div className="max-w-2xl space-y-5">
 <div className="flex items-center gap-3 mb-6">
 <Link
 href="/portal/sessions"
 className="flex items-center gap-2 text-[13px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
 >
 <ArrowLeft size={14} />
 Back to sessions
 </Link>
 </div>

 {/* Session info card */}
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
 <div className="flex items-start justify-between gap-4 mb-4">
 <div>
 <h1 className="text-[20px] text-[var(--text-1)]">{s.subject}</h1>
 <p className="text-[13px] text-[var(--text-3)] mt-0.5">Session #{s.id.slice(0, 8).toUpperCase()}</p>
 </div>
 <Badge variant={statusVariant(s.status)} className="shrink-0">
 {s.status}
 </Badge>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div className="flex items-center gap-3 px-3.5 py-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)]">
 <Calendar size={15} className="text-[var(--text-3)] shrink-0" />
 <div>
 <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wide">Date</p>
 <p className="text-[13px] text-[var(--text-1)] font-medium">
 {format(new Date(s.scheduled_at), "MMM d, yyyy")}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-3 px-3.5 py-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)]">
 <Clock size={15} className="text-[var(--text-3)] shrink-0" />
 <div>
 <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wide">Time</p>
 <p className="text-[13px] text-[var(--text-1)] font-medium">
 {format(new Date(s.scheduled_at), "h:mm a")} · {s.duration_minutes}min
 </p>
 </div>
 </div>
 {s.tutor_name && (
 <div className="flex items-center gap-3 px-3.5 py-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] col-span-2">
 <User size={15} className="text-[var(--text-3)] shrink-0" />
 <div>
 <p className="text-[11px] text-[var(--text-3)] uppercase tracking-wide">Tutor</p>
 <p className="text-[13px] text-[var(--text-1)] font-medium">{s.tutor_name}</p>
 </div>
 </div>
 )}
 </div>

 {s.student_notes && (
 <div className="mt-4 pt-4 border-t border-[var(--border)]">
 <p className="text-[12px] font-semibold text-[var(--text-3)] uppercase tracking-wide mb-1.5">Your Notes</p>
 <p className="text-[13px] text-[var(--text-2)] leading-relaxed">{s.student_notes}</p>
 </div>
 )}

 {s.admin_notes && (
 <div className="mt-3 px-4 py-3 bg-[var(--accent)]/[0.06] border border-[var(--border-accent)] rounded-xl">
 <p className="text-[12px] font-semibold text-[var(--accent)] uppercase tracking-wide mb-1">Note from Nyx</p>
 <p className="text-[13px] text-[var(--text-1)] leading-relaxed">{s.admin_notes}</p>
 </div>
 )}
 </div>

 {/* Quick actions + reschedule */}
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
 <SessionActions session={s} />
 {s.status !== "cancelled" && s.status !== "completed" && (
 <RescheduleDialog sessionId={s.id} currentScheduledAt={s.scheduled_at} />
 )}
 </div>

 {/* Video call section */}
 <VideoCallSection session={s} />

 {/* Whiteboard + recording + AI summary + homework */}
 <SessionWorkspace
 sessionId={s.id}
 media={{
 recordingUrl:    s.recording_url    ?? undefined,
 transcriptUrl:   s.transcript_url   ?? undefined,
 summaryTopics:   s.summary_topics   ?? undefined,
 summaryHomework: s.summary_homework ?? undefined,
 }}
 />

 {isTutor && (
 <SessionSummaryComposer
 sessionId={s.id}
 initialTopics={s.summary_topics ?? undefined}
 initialMistakes={s.summary_mistakes ?? undefined}
 initialHomework={s.summary_homework ?? undefined}
 />
 )}
 </div>
 );
}
