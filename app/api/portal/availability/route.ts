import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";

export const runtime = "nodejs";

const Slot = z.object({
  weekday:    z.number().int().min(0).max(6),
  start_min:  z.number().int().min(0).max(1439),
  end_min:    z.number().int().min(1).max(1440),
  timezone:   z.string().trim().max(60).default("America/New_York"),
});

const PutBody = z.object({ slots: z.array(Slot).max(40) });

/** GET / PUT tutor weekly availability. Tutor-only. */
export async function GET() {
  const auth = await getPortalApi({ onMissing: NextResponse.json({ slots: [] }) });
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("tutor_availability").select("*")
    .eq("tutor_id", auth.user.id)
    .order("weekday").order("start_min");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data ?? [] });
}

export async function PUT(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const { data: profile } = await auth.supabase
    .from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "teacher") return NextResponse.json({ error: "Tutors only" }, { status: 403 });

  const parsed = await readJson(req, PutBody);
  if (!parsed.ok) return parsed.response;

  // Replace-all semantics: simpler than diffing.
  const del = await auth.supabase
    .from("tutor_availability").delete().eq("tutor_id", auth.user.id);
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  if (parsed.data.slots.length === 0) return NextResponse.json({ ok: true, slots: [] });

  const rows = parsed.data.slots.map((s) => ({
    tutor_id:  auth.user.id,
    weekday:   s.weekday,
    start_min: s.start_min,
    end_min:   s.end_min,
    timezone:  s.timezone,
  }));
  const { data, error } = await auth.supabase.from("tutor_availability").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slots: data ?? [] });
}
