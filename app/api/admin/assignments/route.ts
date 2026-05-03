import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServiceRoleClient } from "@/lib/supabase";

async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === adminPassword;
}

/**
 * GET  /api/admin/assignments      → list all assignments (joined with profile names)
 * POST /api/admin/assignments      → { student_id, teacher_id, subject? } → create
 * DELETE /api/admin/assignments?id=…  → remove an assignment
 */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: assignments, error } = await client
    .from("assignments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Join names client-side for the admin UI.
  const ids = Array.from(
    new Set([
      ...(assignments ?? []).map((a) => a.student_id),
      ...(assignments ?? []).map((a) => a.teacher_id),
    ])
  );
  const { data: profiles } = ids.length
    ? await client.from("profiles").select("id, full_name, role").in("id", ids)
    : { data: [] };
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return NextResponse.json({
    assignments: (assignments ?? []).map((a) => ({
      ...a,
      student: profileById.get(a.student_id) ?? null,
      teacher: profileById.get(a.teacher_id) ?? null,
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  let body: { student_id?: string; teacher_id?: string; subject?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { student_id, teacher_id, subject } = body;
  if (!student_id || !teacher_id) {
    return NextResponse.json({ error: "student_id and teacher_id are required" }, { status: 400 });
  }

  // Confirm the teacher actually has the teacher role; auto-promote if not.
  const { data: teacherProfile } = await client
    .from("profiles")
    .select("role")
    .eq("id", teacher_id)
    .single();
  if (!teacherProfile) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }
  if (teacherProfile.role !== "teacher") {
    return NextResponse.json({ error: "Target user is not a teacher" }, { status: 400 });
  }

  const { data, error } = await client
    .from("assignments")
    .insert({
      student_id,
      teacher_id,
      subject: subject ?? null,
      active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ assignment: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Assignment id required" }, { status: 400 });

  const { error } = await client.from("assignments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
