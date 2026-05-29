import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { cleanSlug } from "@/lib/practice/student-data";
import { isTalijaAuthed } from "@/lib/talija-auth";

interface RouteCtx {
  params: Promise<{ slug: string }>;
}

/**
 * POST (Talija only): wipe a student's synced practice results and any assigned
 * homework — used to clear test data before a live session.
 */
export async function POST(req: NextRequest, { params }: RouteCtx) {
  const { slug } = await params;
  if (!(await isTalijaAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = getServiceRoleClient();
  if (!client) return NextResponse.json({ ok: false, reason: "not-configured" });

  const cleaned = cleanSlug(slug);
  const r1 = await client.from("temp_practice_results").delete().eq("slug", cleaned);
  const r2 = await client.from("temp_homework").delete().eq("slug", cleaned);
  const err = r1.error?.message || r2.error?.message;
  if (err) return NextResponse.json({ ok: false, reason: err }, { status: 500 });

  return NextResponse.json({ ok: true });
}
