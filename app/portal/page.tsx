import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
 CalendarPlus,
 BookOpen,
 MessageSquare,
 Calendar,
 ChevronRight,
 Clock,
 GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Profile, Session, Message, Assignment } from "@/types/portal";

function statusVariant(status: string) {
 switch (status) {
 case "confirmed": return "blue";
 case "completed": return "green";
 case "cancelled": return "red";
 default: return "gold";
 }
}

export default async function PortalDashboard() {
 const supabase = await getSupabaseServerClient();
 if (!supabase) redirect("/portal/login");

 const { data: { user } } = await supabase.auth.getUser();
 if (!user) redirect("/portal/login");

 const [{ data: profile }, { data: sessions }, { data: messages }, { data: assignments }] = await Promise.all([
 supabase.from("profiles").select("*").eq("id", user.id).single(),
 supabase
 .from("sessions")
 .select("*")
 .eq("student_id", user.id)
 .in("status", ["pending", "confirmed"])
 .order("scheduled_at", { ascending: true })
 .limit(3),
 supabase
 .from("messages")
 .select("*")
 .eq("student_id", user.id)
 .order("created_at", { ascending: false })
 .limit(5),
 supabase
 .from("assignments")
 .select("*")
 .eq("student_id", user.id)
 .eq("active", true),
 ]);

 const typedProfile = profile as Profile | null;
 const typedSessions = (sessions ?? []) as Session[];
 const typedMessages = (messages ?? []) as Message[];
 const typedAssignments = (assignments ?? []) as Assignment[];

 // Pull the assigned teacher profiles (typically just one).
 const teacherIds = Array.from(new Set(typedAssignments.map((a) => a.teacher_id)));
 const { data: teacherProfiles } = teacherIds.length
 ? await supabase.from("profiles").select("id, full_name, school").in("id", teacherIds)
 : { data: [] };
 const teacherById = new Map((teacherProfiles ?? []).map((t) => [t.id, t as Profile]));
 const unreadCount = typedMessages.filter((m) => m.sender === "nyx" && !m.read).length;
 const displayName = typedProfile?.full_name || user.email?.split("@")[0] || "Student";

 return (
 <div className="space-y-8">
 {/* Welcome */}
 <div>
 <p className="text-[13px] text-[var(--text-3)] uppercase tracking-wider font-semibold mb-1">Dashboard</p>
 <h1 className="text-[28px] text-[var(--text-1)] leading-tight">
 Welcome back, {displayName.split(" ")[0]} ✦
 </h1>
 <p className="text-[var(--text-2)] mt-1 text-[15px]">
 {typedProfile?.target_test
 ? `${typedProfile.target_test} prep${typedProfile.target_score ? ` · Target ${typedProfile.target_score}` : ""}`
 : "Ready to level up your scores?"}
 </p>
 </div>

 {/* Assigned tutor */}
 {typedAssignments.length > 0 && (
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
 <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-3">
 {typedAssignments.length === 1 ? "Your Tutor" : "Your Tutors"}
 </p>
 <div className="space-y-2.5">
 {typedAssignments.map((a) => {
 const tutor = teacherById.get(a.teacher_id);
 return (
 <div key={a.id} className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
 <GraduationCap size={15} className="text-[var(--accent)]" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13.5px] font-semibold text-[var(--text-1)] truncate">
 {tutor?.full_name ?? "Tutor (unnamed)"}
 </p>
 <p className="text-[11.5px] text-[var(--text-3)] truncate">
 {[a.subject ?? "All subjects", tutor?.school].filter(Boolean).join(" · ")}
 </p>
 </div>
 <Link
 href="/portal/messages"
 className="text-[12px] text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
 >
 Message →
 </Link>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* Stats row */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 {[
 {
 label: "Upcoming Sessions",
 value: typedSessions.length,
 icon: Calendar,
 href: "/portal/sessions",
 color: "text-blue-400",
 },
 {
 label: "Unread Messages",
 value: unreadCount,
 icon: MessageSquare,
 href: "/portal/messages",
 color: unreadCount > 0 ? "text-[var(--accent)]" : "text-[var(--text-3)]",
 },
 {
 label: "Materials Available",
 value: "20+",
 icon: BookOpen,
 href: "/portal/materials",
 color: "text-emerald-400",
 },
 {
 label: "Grade",
 value: typedProfile?.grade ? `G${typedProfile.grade}` : "—",
 icon: null,
 href: "/portal/profile",
 color: "text-[var(--text-2)]",
 },
 ].map((stat) => (
 <Link
 key={stat.label}
 href={stat.href}
 className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--border-2)] transition-all group"
 >
 <div className="flex items-center justify-between mb-2">
 <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider">{stat.label}</p>
 {stat.icon && <stat.icon size={14} className="text-[var(--text-3)] group-hover:text-[var(--text-2)] transition-colors" />}
 </div>
 <p className={`text-[24px] ${stat.color}`}>{stat.value}</p>
 </Link>
 ))}
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {/* Upcoming sessions */}
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
 <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
 <h2 className="font-semibold text-[var(--text-1)] text-[15px]">Upcoming Sessions</h2>
 <Link href="/portal/sessions" className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
 View all <ChevronRight size={12} />
 </Link>
 </div>
 {typedSessions.length === 0 ? (
 <div className="px-5 py-8 text-center">
 <Calendar size={28} className="text-[var(--text-3)] mx-auto mb-3" />
 <p className="text-[13px] text-[var(--text-2)] mb-3">No upcoming sessions yet</p>
 <Link
 href="/portal/schedule"
 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c1124] border border-[var(--accent)]/45 text-[var(--text-1)] font-semibold hover:bg-[#141a30] hover:border-[var(--accent)] text-[13px] transition-all"
 >
 <CalendarPlus size={14} />
 Schedule one
 </Link>
 </div>
 ) : (
 <div className="divide-y divide-white/[0.04]">
 {typedSessions.map((session) => (
 <Link
 key={session.id}
 href={`/portal/sessions/${session.id}`}
 className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
 >
 <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col items-center justify-center shrink-0">
 <span className="text-[10px] text-[var(--text-3)] font-medium uppercase">
 {format(new Date(session.scheduled_at), "MMM")}
 </span>
 <span className="text-[15px] text-[var(--text-1)] leading-tight">
 {format(new Date(session.scheduled_at), "d")}
 </span>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13.5px] font-semibold text-[var(--text-1)] truncate">{session.subject}</p>
 <div className="flex items-center gap-2 mt-0.5">
 <Clock size={11} className="text-[var(--text-3)]" />
 <span className="text-[12px] text-[var(--text-2)]">
 {format(new Date(session.scheduled_at), "h:mm a")} · {session.duration_minutes}min
 </span>
 </div>
 {session.tutor_name && (
 <p className="text-[12px] text-[var(--text-3)] mt-0.5">{session.tutor_name}</p>
 )}
 </div>
 <Badge variant={statusVariant(session.status)} size="sm">
 {session.status}
 </Badge>
 </Link>
 ))}
 </div>
 )}
 </div>

 {/* Recent messages */}
 <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
 <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
 <div className="flex items-center gap-2">
 <h2 className="font-semibold text-[var(--text-1)] text-[15px]">Messages</h2>
 {unreadCount > 0 && (
 <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[10px] flex items-center justify-center">
 {unreadCount}
 </span>
 )}
 </div>
 <Link href="/portal/messages" className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
 Open chat <ChevronRight size={12} />
 </Link>
 </div>
 {typedMessages.length === 0 ? (
 <div className="px-5 py-8 text-center">
 <MessageSquare size={28} className="text-[var(--text-3)] mx-auto mb-3" />
 <p className="text-[13px] text-[var(--text-2)] mb-3">No messages yet</p>
 <Link
 href="/portal/messages"
 className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[var(--text-1)] text-[13px] font-medium hover:border-white/[0.18] transition-all"
 >
 <MessageSquare size={13} />
 Say hello
 </Link>
 </div>
 ) : (
 <div className="divide-y divide-white/[0.04]">
 {typedMessages.map((msg) => (
 <Link
 key={msg.id}
 href="/portal/messages"
 className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
 >
 <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
 msg.sender === "nyx"
 ? "bg-[var(--border-accent)] text-[var(--accent)] border border-[var(--border-accent)]"
 : "bg-white/[0.07] text-[var(--text-2)] border border-white/[0.1]"
 }`}>
 {msg.sender === "nyx" ? "N" : "Me"}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-2">
 <span className="text-[12px] font-semibold text-[var(--text-2)]">
 {msg.sender === "nyx" ? "Nyx" : "You"}
 </span>
 {msg.sender === "nyx" && !msg.read && (
 <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
 )}
 </div>
 <p className="text-[13px] text-[var(--text-1)] truncate mt-0.5">{msg.content}</p>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Quick actions */}
 <div>
 <h2 className="text-[13px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-3">Quick Actions</h2>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <Link
 href="/portal/schedule"
 className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)] transition-all group"
 >
 <div className="w-10 h-10 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center shrink-0">
 <CalendarPlus size={17} className="text-[var(--accent)]" />
 </div>
 <div>
 <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Schedule Session</p>
 <p className="text-[12px] text-[var(--text-3)]">Request a tutor</p>
 </div>
 <ChevronRight size={14} className="text-[var(--text-3)] ml-auto group-hover:text-[var(--accent)] transition-colors" />
 </Link>
 <Link
 href="/portal/materials"
 className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all group"
 >
 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0">
 <BookOpen size={17} className="text-emerald-400" />
 </div>
 <div>
 <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Practice Materials</p>
 <p className="text-[12px] text-[var(--text-3)]">SAT & ACT resources</p>
 </div>
 <ChevronRight size={14} className="text-[var(--text-3)] ml-auto group-hover:text-emerald-400 transition-colors" />
 </Link>
 <Link
 href="/portal/messages"
 className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
 >
 <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
 <MessageSquare size={17} className="text-blue-400" />
 </div>
 <div>
 <p className="text-[13.5px] font-semibold text-[var(--text-1)]">Message Us</p>
 <p className="text-[12px] text-[var(--text-3)]">Ask the Nyx team</p>
 </div>
 <ChevronRight size={14} className="text-[var(--text-3)] ml-auto group-hover:text-blue-400 transition-colors" />
 </Link>
 </div>
 </div>
 </div>
 );
}
