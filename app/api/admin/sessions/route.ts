import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { cookies } from "next/headers";

async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === adminPassword;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: sessions, error } = await client
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const studentIds = [...new Set((sessions ?? []).map((s) => s.student_id))];
  const { data: profiles } = studentIds.length > 0
    ? await client.from("profiles").select("id, full_name, grade, target_test").in("id", studentIds)
    : { data: [] };

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const sessionsWithProfiles = (sessions ?? []).map((s) => ({
    ...s,
    profiles: profileMap[s.student_id] ?? null,
  }));

  return NextResponse.json({ sessions: sessionsWithProfiles });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, status, tutor_name, meeting_link, admin_notes } = body;
  if (!id) return NextResponse.json({ error: "Session id required" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (status !== undefined) update.status = status;
  if (tutor_name !== undefined) update.tutor_name = tutor_name;
  if (meeting_link !== undefined) update.meeting_link = meeting_link;
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  const { data, error } = await client
    .from("sessions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session: data });
}
