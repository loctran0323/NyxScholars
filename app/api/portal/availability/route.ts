import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const Slot = z.object({
  weekday:    z.number().int().min(0).max(6),
  start_min:  z.number().int().min(0).max(1439),
  end_min:    z.number().int().min(1).max(1440),
  timezone:   z.string().trim().max(60).default("America/New_York"),
});

const PutBody = z.object({
  slots: z.array(Slot).max(40),
});

/**
 * GET / PUT tutor weekly availability. Tutor-only.
 * Each slot is a (weekday, start_min, end_min) tuple in the tutor's tz.
 */
export async function GET() {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ slots: [] });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("tutor_availability")
    .select("*")
    .eq("tutor_id", user.id)
    .order("weekday")
    .order("start_min");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slots: data ?? [] });
}

export async function PUT(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "teacher") return NextResponse.json({ error: "Tutors only" }, { status: 403 });

  const parsed = PutBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  // Replace-all semantics: simpler than diffing.
  const del = await sb.from("tutor_availability").delete().eq("tutor_id", user.id);
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  if (parsed.data.slots.length === 0) return NextResponse.json({ ok: true, slots: [] });

  const rows = parsed.data.slots.map((s) => ({
    tutor_id: user.id,
    weekday:   s.weekday,
    start_min: s.start_min,
    end_min:   s.end_min,
    timezone:  s.timezone,
  }));
  const { data, error } = await sb.from("tutor_availability").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slots: data ?? [] });
}
