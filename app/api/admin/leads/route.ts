import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const authHeader = req.headers.get("Authorization");

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getServiceRoleClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data, error } = await client
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data });
}
