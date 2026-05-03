import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PortalHero } from "@/components/portal/PortalHero";
import { AvailabilityEditor } from "./AvailabilityEditor";

export const metadata = { title: "Availability" };

interface SlotRow {
  id: string;
  weekday: number;
  start_min: number;
  end_min: number;
  timezone: string;
}

export default async function AvailabilityPage() {
  const sb = await getSupabaseServerClient();
  if (!sb) redirect("/portal/login");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: profile } = await sb.from("profiles").select("role, timezone").eq("id", user.id).single();
  if (profile?.role !== "teacher") redirect("/portal");

  const { data } = await sb
    .from("tutor_availability")
    .select("*")
    .eq("tutor_id", user.id)
    .order("weekday")
    .order("start_min");
  const slots = (data ?? []) as unknown as SlotRow[];

  return (
    <div className="max-w-3xl">
      <PortalHero
        eyebrow="Tutor"
        title="Weekly availability"
        italic="when students can book you"
        subtitle="Block out the hours you're available each week. Students see live slots and book directly."
      />
      <AvailabilityEditor
        initialSlots={slots}
        defaultTimezone={(profile as { timezone: string | null })?.timezone ?? "America/New_York"}
      />
    </div>
  );
}
