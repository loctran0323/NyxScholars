import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { getServiceRoleClient } from "@/lib/supabase";
import { notifyMany } from "@/lib/notifications";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

const Body = z.object({
  audience: z.enum(["all", "students", "tutors", "active", "lapsed"]),
  title:    z.string().trim().min(1).max(160),
  body:     z.string().trim().max(2000).optional(),
  href:     z.string().trim().max(400).optional(),
});

async function isAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const store = await cookies();
  return store.get("admin_session")?.value === adminPassword;
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  let q = sb.from("profiles").select("id, role, plan, plan_status");
  if (parsed.data.audience === "students") q = q.eq("role", "student");
  if (parsed.data.audience === "tutors")   q = q.eq("role", "teacher");
  if (parsed.data.audience === "active")   q = q.eq("plan_status", "active");
  if (parsed.data.audience === "lapsed")   q = q.eq("plan_status", "cancelled");

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const ids = (data ?? []).map((r) => (r as { id: string }).id);

  await notifyMany(
    ids.map((id) => ({
      userId: id,
      kind: "system.announcement",
      title: parsed.data.title,
      body:  parsed.data.body,
      href:  parsed.data.href,
    })),
  );

  await audit({
    action: "admin.broadcast",
    details: { audience: parsed.data.audience, recipients: ids.length, title: parsed.data.title },
  });

  return NextResponse.json({ ok: true, recipients: ids.length });
}
