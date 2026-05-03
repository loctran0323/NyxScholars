import { NextResponse } from "next/server";
import { NpsSubmit, safeParseJson } from "@/lib/zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = safeParseJson(NpsSubmit, await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 });

  const { error } = await sb
    .from("profiles")
    .update({ nps_score: parsed.data.score, nps_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await audit({
    actorId: user.id, actorEmail: user.email ?? null, subjectId: user.id,
    action: "nps.submit",
    details: { score: parsed.data.score, reason: parsed.data.reason ?? null },
  });

  return NextResponse.json({ ok: true });
}
