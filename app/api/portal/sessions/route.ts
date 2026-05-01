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
