import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";
import { summarizeSession } from "@/lib/ai";
import { notify } from "@/lib/notifications";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

const Patch = z.object({
  topicsCovered: z.array(z.string()).optional(),
  mistakes:      z.array(z.string()).optional(),
  homework:      z.array(z.string()).optional(),
  status:        z.enum(["pending", "drafted", "sent"]).optional(),
});

const Generate = z.object({
  transcript: z.string().min(20).max(40_000),
});

interface RouteContext { params: Promise<{ id: string }> }

/** POST → ask Claude/OpenAI to draft from a transcript. */
export async function POST(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Generate.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const { data: session } = await sb.from("sessions").select("*").eq("id", id).single();
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  // Permission: tutor on the session OR an admin (service-role caller).
  // Students never trigger summary generation themselves.
  const summary = await summarizeSession({
    transcript:   parsed.data.transcript,
    subject:      session.subject,
    tutorName:    session.tutor_name ?? undefined,
    targetScore:  null,
  });

  const admin = getServiceRoleClient();
  if (admin) {
    await admin
      .from("sessions")
      .update({
        summary_topics:   summary.topicsCovered,
        summary_mistakes: summary.mistakes,
        summary_homework: summary.homework,
        summary_status:   "drafted",
      })
      .eq("id", id);
  }

  await audit({
    actorId:   user.id,
    actorEmail: user.email ?? null,
    subjectId: session.student_id,
    action:    "session.summary.generate",
    details:   { sessionId: id, ai_provider: "auto" },
  });

  return NextResponse.json({ summary });
}

/** PATCH → tutor edits the draft and (optionally) marks it sent. */
export async function PATCH(req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.issues }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (parsed.data.topicsCovered) update.summary_topics   = parsed.data.topicsCovered;
  if (parsed.data.mistakes)      update.summary_mistakes = parsed.data.mistakes;
  if (parsed.data.homework)      update.summary_homework = parsed.data.homework;
  if (parsed.data.status)        update.summary_status   = parsed.data.status;
  if (parsed.data.status === "sent") update.summary_sent_at = new Date().toISOString();

  const admin = getServiceRoleClient();
  const { error, data } = await (admin ?? sb)
    .from("sessions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (parsed.data.status === "sent" && data) {
    await notify({
      userId: data.student_id,
      kind:   "session.summary",
      title:  "Recap from your tutor",
      body:   `${(data.summary_topics ?? []).slice(0, 2).join(", ") || "View your session summary"}`,
      href:   `/portal/sessions/${id}`,
    });
  }

  return NextResponse.json({ session: data });
}
