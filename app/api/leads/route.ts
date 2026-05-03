import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { LeadCreate, safeParseJson } from "@/lib/zod";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { track, EVENTS } from "@/lib/analytics";
import { captureException } from "@/lib/observability";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientKey(req, "lead:anon");
  const limit = await rateLimit({ key: `lead:${ip}`, max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = safeParseJson(LeadCreate, body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 });
  }
  const data = parsed.data;

  const leadData = {
    student_name:        data.student_name,
    parent_name:         data.parent_name        ?? null,
    email:               data.email,
    phone:               data.phone              ?? null,
    grade:               data.grade,
    service:             data.service,
    ap_subject:          data.ap_subject         ?? null,
    current_score:       data.current_score      ?? null,
    target_score:        data.target_score       ?? null,
    test_date:           data.test_date          ?? null,
    tutoring_format:     data.tutoring_format,
    availability_notes:  data.availability_notes ?? null,
    help_needed:         data.help_needed        ?? null,
  };

  try {
    const client = getServiceRoleClient();
    if (client) {
      const { error } = await client.from("leads").insert([leadData]);
      if (!error) {
        track(EVENTS.LEAD_SUBMITTED, { service: data.service, format: data.tutoring_format });
        return NextResponse.json({ success: true, stored: "supabase" });
      }
      console.error("[leads] Supabase insert error:", error);
    }
  } catch (err) {
    captureException(err, { route: "leads.POST" });
  }

  console.log("[leads] New inquiry (Supabase not configured):", JSON.stringify(leadData));
  track(EVENTS.LEAD_SUBMITTED, { service: data.service, format: data.tutoring_format, fallback: "log" });
  return NextResponse.json({ success: true, stored: "log" });
}
