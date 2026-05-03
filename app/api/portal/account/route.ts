import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * DELETE /api/portal/account — self-serve account deletion. Cascades all
 * RLS-scoped tables via Postgres FK. Falls back to a soft-delete (clearing
 * profile fields) when the service role key isn't configured.
 */
export async function DELETE(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getServiceRoleClient();

  await audit({
    actorId:    user.id,
    actorEmail: user.email ?? null,
    subjectId:  user.id,
    action:     "user.account_delete",
    ip:         clientKey(req),
    userAgent:  req.headers.get("user-agent"),
  });

  if (!admin) {
    // Soft-delete fallback (no service role key on this env).
    await sb.from("profiles").update({
      full_name: null,
      grade: null,
      school: null,
      target_score: null,
      target_test: null,
      phone: null,
    }).eq("id", user.id);
    await sb.auth.signOut();
    return NextResponse.json({ ok: true, mode: "soft" });
  }

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await sb.auth.signOut();
  return NextResponse.json({ ok: true, mode: "hard" });
}
