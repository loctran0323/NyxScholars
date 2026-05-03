import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { getServiceRoleClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

const Patch = z.object({
  tutor_id:    z.string().uuid(),
  verify:      z.boolean().optional(),
  nda_signed:  z.boolean().optional(),
  background:  z.enum(["not_started", "pending", "cleared", "flagged"]).optional(),
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

  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (parsed.data.verify !== undefined) {
    update.verified_at = parsed.data.verify ? new Date().toISOString() : null;
    update.verified_by = parsed.data.verify ? "admin" : null;
  }
  if (parsed.data.nda_signed !== undefined) {
    update.nda_signed_at = parsed.data.nda_signed ? new Date().toISOString() : null;
  }
  if (parsed.data.background !== undefined) {
    update.background_check_status = parsed.data.background;
    update.background_check_at     = new Date().toISOString();
  }

  const { error } = await sb.from("profiles").update(update).eq("id", parsed.data.tutor_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await audit({
    action: "admin.tutor.verify",
    subjectId: parsed.data.tutor_id,
    details: parsed.data as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true });
}
