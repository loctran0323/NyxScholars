import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { audit } from "@/lib/audit";
import { clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * GET /api/portal/data-export — emit a JSON blob of every row tied to the
 * authenticated user (profile + sessions + messages + diagnostic attempts +
 * homework + notifications). Satisfies GDPR Article 15 / CCPA right-to-know.
 */
export async function GET(req: Request) {
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile, sessions, messages, attempts, homework, notifications, srs] = await Promise.all([
    sb.from("profiles").select("*").eq("id", user.id).single(),
    sb.from("sessions").select("*").eq("student_id", user.id),
    sb.from("messages").select("*").eq("student_id", user.id),
    sb.from("diagnostic_attempts").select("*").eq("user_id", user.id),
    sb.from("homework").select("*").eq("student_id", user.id),
    sb.from("notifications").select("*").eq("user_id", user.id),
    sb.from("srs_cards").select("*").eq("user_id", user.id),
  ]);

  await audit({
    actorId:    user.id,
    actorEmail: user.email ?? null,
    subjectId:  user.id,
    action:     "user.data_export",
    ip:         clientKey(req),
    userAgent:  req.headers.get("user-agent"),
  });

  const exported = {
    exported_at:        new Date().toISOString(),
    schema_version:     "1.0",
    user: {
      id:    user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile:       profile.data,
    sessions:      sessions.data,
    messages:      messages.data,
    diagnostic:    attempts.data,
    homework:      homework.data,
    notifications: notifications.data,
    srs_cards:     srs.data,
  };

  return new NextResponse(JSON.stringify(exported, null, 2), {
    status: 200,
    headers: {
      "Content-Type":        "application/json",
      "Content-Disposition": `attachment; filename="nyx-data-${user.id}.json"`,
    },
  });
}
