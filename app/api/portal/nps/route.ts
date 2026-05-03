import { NextResponse } from "next/server";
import { NpsSubmit } from "@/lib/zod";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, NpsSubmit);
  if (!parsed.ok) return parsed.response;

  const { error } = await auth.supabase
    .from("profiles")
    .update({ nps_score: parsed.data.score, nps_at: new Date().toISOString() })
    .eq("id", auth.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await audit({
    actorId: auth.user.id, actorEmail: auth.user.email ?? null, subjectId: auth.user.id,
    action: "nps.submit",
    details: { score: parsed.data.score, reason: parsed.data.reason ?? null },
  });

  return NextResponse.json({ ok: true });
}
