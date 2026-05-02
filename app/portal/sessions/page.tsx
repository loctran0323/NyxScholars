import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarPlus, Calendar, Clock, ChevronRight, Video, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Session } from "@/types/portal";

function statusVariant(status: string): "gold" | "blue" | "green" | "red" | "default" {
  switch (status) {
    case "confirmed": return "blue";
    case "completed": return "green";
    case "cancelled": return "red";
    default: return "gold";
  }
}

function SessionCard({ session }: { session: Session }) {
  const isUpcoming = new Date(session.scheduled_at) > new Date();
  const canJoin =
    session.status === "confirmed" &&
    session.meeting_link &&
    Math.abs(new Date(session.scheduled_at).getTime() - Date.now()) < 30 * 60 * 1000;

  return (
    <Link
      href={`/portal/sessions/${session.id}`}
      className="flex items-start gap-4 p-5 bg-[#0f1521] border border-white/[0.07] rounded-2xl hover:border-white/[0.14] transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-[#141b2d] border border-white/[0.07] flex flex-col items-center justify-center shrink-0">
        <span className="text-[10px] text-[#4e5d72] font-semibold uppercase">
          {format(new Date(session.scheduled_at), "MMM")}
        </span>
        <span className="text-[18px] font-bold text-[#f0ece3] leading-tight">
          {format(new Date(session.scheduled_at), "d")}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[14px] font-semibold text-[#f0ece3]">{session.subject}</p>
          <Badge variant={statusVariant(session.status)}>
            {session.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          <span className="flex items-center gap-1.5 text-[12.5px] text-[#8d9ab0]">
            <Clock size={11} />
            {format(new Date(session.scheduled_at), "EEEE, MMM d · h:mm a")}
          </span>
          <span className="text-[12px] text-[#4e5d72]">{session.duration_minutes} min</span>
        </div>
        {session.tutor_name && (
          <p className="text-[12px] text-[#4e5d72] mt-1">Tutor: {session.tutor_name}</p>
        )}
        {canJoin && (
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-emerald-400 font-medium">
            <Video size={12} className="animate-pulse" />
            Ready to join
          </div>
        )}
        {session.status === "confirmed" && session.meeting_link && !canJoin && isUpcoming && (
          <p className="text-[12px] text-blue-400 mt-1">Meeting link ready</p>
        )}
      </div>

      <ChevronRight size={15} className="text-[#4e5d72] shrink-0 mt-1 group-hover:text-[#8d9ab0] transition-colors" />
    </Link>
  );
}

const MONTHLY_SESSION_LIMIT = 4;

export default async function SessionsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const [{ data: allSessions }, { data: profile }] = await Promise.all([
    supabase
      .from("sessions")
      .select("*")
      .eq("student_id", user.id)
      .order("scheduled_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("plan, plan_addons")
      .eq("id", user.id)
      .single(),
  ]);

  const sessions = (allSessions ?? []) as Session[];
  const now = new Date();
  const isMonthly = profile?.plan === "monthly";

  // Count sessions used this calendar month (confirmed + completed)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyUsed = isMonthly
    ? sessions.filter(
        (s) =>
          new Date(s.scheduled_at) >= monthStart &&
          (s.status === "confirmed" || s.status === "completed" || s.status === "pending")
      ).length
    : 0;
  const monthlyRemaining = Math.max(0, MONTHLY_SESSION_LIMIT - monthlyUsed);
  const monthlyExhausted = isMonthly && monthlyUsed >= MONTHLY_SESSION_LIMIT;

  const upcoming = sessions.filter(
    (s) => new Date(s.scheduled_at) > now && s.status !== "cancelled"
  );
  const past = sessions.filter(
    (s) => new Date(s.scheduled_at) <= now || s.status === "cancelled" || s.status === "completed"
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[13px] text-[#4e5d72] uppercase tracking-wider font-semibold mb-1">Portal</p>
          <h1 className="text-[26px] font-bold text-[#f0ece3]">My Sessions</h1>
        </div>
        <Link
          href="/portal/schedule"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black text-[13px] font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-md shadow-[#d4a853]/15"
        >
          <CalendarPlus size={14} />
          Schedule
        </Link>
      </div>

      {/* Monthly session tracker */}
      {isMonthly && (
        <div className={`mb-6 rounded-2xl border p-5 ${monthlyExhausted ? "border-[#d4a853]/30 bg-[#d4a853]/[0.04]" : "border-white/[0.07] bg-[#0f1521]"}`}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-[13px] font-semibold text-[#f0ece3]">
                {format(now, "MMMM")} sessions
              </p>
              <p className="text-[12px] text-[#8d9ab0] mt-0.5">
                {monthlyUsed} of {MONTHLY_SESSION_LIMIT} used this month
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[1.4rem] font-black ${monthlyRemaining > 0 ? "text-[#f0ece3]" : "text-[#d4a853]"}`}>
                {monthlyRemaining}
              </span>
              <p className="text-[11px] text-[#8d9ab0]">remaining</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d4a853] to-[#a07830] transition-all"
              style={{ width: `${Math.min(100, (monthlyUsed / MONTHLY_SESSION_LIMIT) * 100)}%` }}
            />
          </div>
          {monthlyExhausted ? (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#d4a853]/[0.08] border border-[#d4a853]/20">
              <Zap size={14} className="text-[#d4a853] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#f0ece3] mb-0.5">Need more sessions this month?</p>
                <p className="text-[12.5px] text-[#8d9ab0] leading-relaxed">
                  As a Scholar subscriber, extra sessions are <span className="text-[#d4a853] font-semibold">$85/hr</span> — 15% off the standard rate.{" "}
                  <Link href="/portal/messages" className="text-[#d4a853] underline underline-offset-2 hover:text-[#e8c46a] transition-colors">
                    Message us to book one.
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[#4e5d72]">
              Once you&apos;ve used all 4, extra sessions are available at $85/hr (15% off).
            </p>
          )}
        </div>
      )}

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-5">
          <TabsTrigger value="upcoming">
            Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
          </TabsTrigger>
          <TabsTrigger value="past">
            Past {past.length > 0 && `(${past.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-16 bg-[#0f1521] border border-white/[0.07] rounded-2xl">
              <Calendar size={32} className="text-[#4e5d72] mx-auto mb-3" />
              <p className="text-[#8d9ab0] text-[14px] mb-4">No upcoming sessions</p>
              <Link
                href="/portal/schedule"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black text-[13px] font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all"
              >
                <CalendarPlus size={14} />
                Schedule your first session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length === 0 ? (
            <div className="text-center py-16 bg-[#0f1521] border border-white/[0.07] rounded-2xl">
              <Calendar size={32} className="text-[#4e5d72] mx-auto mb-3" />
              <p className="text-[#8d9ab0] text-[14px]">No past sessions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {past.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
