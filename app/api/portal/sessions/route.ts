import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("student_id", user.id)
    .order("scheduled_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { subject, scheduled_at, duration_minutes, student_notes } = body;

  if (!subject || !scheduled_at) {
    return NextResponse.json({ error: "Subject and scheduled_at are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      student_id: user.id,
      subject,
      scheduled_at,
      duration_minutes: duration_minutes ?? 60,
      status: "pending",
      student_notes: student_notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}

/**
 * PATCH — student can update their own session: cancel it (status=cancelled)
 * or move it (scheduled_at). Server enforces 12-hour cancellation window.
 */
export async function PATCH(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const id = body.id as string | undefined;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Load to verify ownership and timing
  const { data: existing } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .eq("student_id", user.id)
    .single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (body.status === "cancelled") {
    const hoursAway = (new Date(existing.scheduled_at).getTime() - Date.now()) / 3_600_000;
    if (hoursAway < 12) {
      return NextResponse.json(
        { error: "Sessions can only be cancelled at least 12 hours ahead. Message us instead." },
        { status: 400 }
      );
    }
    updates.status = "cancelled";
  }
  if (typeof body.student_notes === "string") updates.student_notes = body.student_notes;
  if (typeof body.scheduled_at === "string") updates.scheduled_at = body.scheduled_at;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .update(updates)
    .eq("id", id)
    .eq("student_id", user.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session: data });
}
