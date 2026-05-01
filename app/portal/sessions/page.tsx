import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarPlus, Calendar, Clock, ChevronRight, Video } from "lucide-react";
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

export default async function SessionsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/portal/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: allSessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("student_id", user.id)
    .order("scheduled_at", { ascending: false });

  const sessions = (allSessions ?? []) as Session[];
  const now = new Date();
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
