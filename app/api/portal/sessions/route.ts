import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { notifyStudentTutors } from "@/lib/notifications";

const Create = z.object({
  subject:           z.string().trim().min(1).max(120),
  scheduled_at:      z.string().datetime(),
  duration_minutes:  z.number().int().positive().max(240).optional(),
  student_notes:     z.string().max(2000).optional(),
});

const Patch = z.object({
  id:             z.string().uuid(),
  status:         z.literal("cancelled").optional(),
  student_notes:  z.string().max(2000).optional(),
  scheduled_at:   z.string().datetime().optional(),
});

const CANCEL_WINDOW_HOURS = 12;

export async function GET() {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const { data: sessions, error } = await auth.supabase
    .from("sessions").select("*")
    .eq("student_id", auth.user.id)
    .order("scheduled_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(request, Create);
  if (!parsed.ok) return parsed.response;

  const { data, error } = await auth.supabase
    .from("sessions")
    .insert({
      student_id:       auth.user.id,
      subject:          parsed.data.subject,
      scheduled_at:     parsed.data.scheduled_at,
      duration_minutes: parsed.data.duration_minutes ?? 60,
      status:           "pending",
      student_notes:    parsed.data.student_notes ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Alert the student's tutor(s) that a session was requested.
  const { data: prof } = await auth.supabase
    .from("profiles").select("full_name").eq("id", auth.user.id).maybeSingle();
  const name = (prof as { full_name?: string } | null)?.full_name || "A student";
  const whenLabel = new Date(parsed.data.scheduled_at).toUTCString();
  await notifyStudentTutors(auth.user.id, {
    kind: "staff.session_request",
    title: `Session request from ${name}`,
    body: `${parsed.data.subject} · ${whenLabel}`,
    href: `/portal/teacher/students/${auth.user.id}`,
  });

  return NextResponse.json({ session: data }, { status: 201 });
}

/**
 * PATCH — student can update their own session: cancel it (status=cancelled)
 * or move it (scheduled_at). Server enforces a 12-hour cancellation window.
 */
export async function PATCH(request: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(request, Patch);
  if (!parsed.ok) return parsed.response;

  const { data: existing } = await auth.supabase
    .from("sessions").select("*")
    .eq("id", parsed.data.id).eq("student_id", auth.user.id).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (parsed.data.status === "cancelled") {
    const hoursAway = (new Date(existing.scheduled_at).getTime() - Date.now()) / 3_600_000;
    if (hoursAway < CANCEL_WINDOW_HOURS) {
      return NextResponse.json(
        { error: `Sessions can only be cancelled at least ${CANCEL_WINDOW_HOURS} hours ahead. Message us instead.` },
        { status: 400 },
      );
    }
    updates.status = "cancelled";
  }
  if (parsed.data.student_notes !== undefined) updates.student_notes = parsed.data.student_notes;
  if (parsed.data.scheduled_at !== undefined)  updates.scheduled_at  = parsed.data.scheduled_at;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("sessions").update(updates)
    .eq("id", parsed.data.id).eq("student_id", auth.user.id)
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session: data });
}
