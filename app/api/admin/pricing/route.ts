import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { getServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const Patch = z.object({
  id:               z.enum(["month", "two-month", "three-month"]),
  name:             z.string().trim().min(1).max(80).optional(),
  weeks:            z.number().int().min(1).max(52).optional(),
  hours_per_week:   z.number().int().min(1).max(10).optional(),
  total_hours:      z.number().int().min(1).max(500).optional(),
  total_price:      z.number().int().min(0).max(50_000).optional(),
  effective_hourly: z.number().int().min(0).max(1000).optional(),
  discount_pct:     z.number().int().min(0).max(80).optional(),
  summary:          z.string().trim().max(400).optional(),
  recommended:      z.boolean().optional(),
  enabled:          z.boolean().optional(),
  stripe_price_id:  z.string().trim().max(120).optional(),
});

async function isAdminAuthed(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const store = await cookies();
  return store.get("admin_session")?.value === adminPassword;
}

export async function GET() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ rows: [] });
  const { data } = await sb.from("pricing_config").select("*").order("id");
  return NextResponse.json({ rows: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sb = getServiceRoleClient();
  if (!sb) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const { id, ...rest } = parsed.data;
  const update: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() };

  // Upsert so the row is created on first edit if the migration hasn't seeded it.
  const { data, error } = await sb
    .from("pricing_config")
    .upsert({ id, ...update })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data });
}
