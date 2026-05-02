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

  // Get all profiles
  const { data: profiles, error } = await client
    .from("profiles")
    .select("id, full_name, grade, plan, plan_status, plan_subject, plan_addons, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get emails from auth.users via admin API
  const { data: { users }, error: authError } = await client.auth.admin.listUsers();
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  const emailMap: Record<string, string> = {};
  for (const u of users) emailMap[u.id] = u.email ?? "";

  const students = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.id] ?? "",
  }));

  return NextResponse.json({ students });
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

  const { id, plan, plan_status, plan_subject, plan_addons } = body;
  if (!id) return NextResponse.json({ error: "Student id required" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (plan       !== undefined) update.plan        = plan       || null;
  if (plan_status !== undefined) update.plan_status = plan_status || null;
  if (plan_subject !== undefined) update.plan_subject = plan_subject || null;
  if (plan_addons  !== undefined) update.plan_addons  = plan_addons ?? [];

  const { data, error } = await client
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ student: data });
}
