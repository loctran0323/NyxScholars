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

  // Get all messages grouped by student
  const { data: messages, error } = await client
    .from("messages")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: messages ?? [] });
}

export async function POST(request: NextRequest) {
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

  const { student_id, content } = body;
  if (!student_id || !content) {
    return NextResponse.json({ error: "student_id and content required" }, { status: 400 });
  }

  const { data, error } = await client
    .from("messages")
    .insert({
      student_id,
      sender: "nyx",
      content: String(content).trim(),
      read: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: data }, { status: 201 });
}
