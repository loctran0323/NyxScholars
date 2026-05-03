import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { notifyMany } from "@/lib/notifications";

async function isAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const store = await cookies();
  return store.get("admin_session")?.value === adminPassword;
}

const Body = z.object({
  student_id: z.string().uuid(),
  tutor_profile_id: z.string().uuid(),
  subject: z.string().trim().max(100).optional(),
});

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });
  }

  const { student_id, tutor_profile_id, subject } = parsed.data;

  const { data: assignment, error } = await sb
    .from("assignments")
    .insert({
      student_id,
      teacher_id: tutor_profile_id,
      subject: subject ?? null,
      active: true,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await notifyMany([
    {
      userId: student_id,
      kind: "system.announcement",
      title: "You've been matched with a tutor",
      body: "Visit /portal/match to see your tutor and book your first session.",
      href: "/portal/match",
    },
    {
      userId: tutor_profile_id,
      kind: "system.announcement",
      title: "New student assigned",
      body: "Visit /portal/teacher to see your new student.",
      href: "/portal/teacher",
    },
  ]);

  await audit({
    action: "admin.match.assign",
    details: { student_id, tutor_profile_id, assignment_id: assignment.id },
  });

  return NextResponse.json({ assignment });
}
