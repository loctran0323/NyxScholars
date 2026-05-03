import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { getPortalApi, readJson } from "@/lib/portal-auth";
import { getServiceRoleClient } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const Send = z.object({
  parent_name:  z.string().trim().min(1).max(120),
  parent_email: z.string().email().max(160),
  student_name: z.string().trim().max(120).optional(),
});

const Confirm = z.object({
  user_id: z.string().uuid(),
  token:   z.string().min(8),
});

function consentToken(userId: string, parentEmail: string): string {
  return crypto
    .createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-secret")
    .update(`${userId}:${parentEmail}`)
    .digest("hex")
    .slice(0, 32);
}

/** POST → email a one-click confirm link to the parent. */
export async function POST(req: Request) {
  const auth = await getPortalApi();
  if (!auth.ok) return auth.response;

  const parsed = await readJson(req, Send);
  if (!parsed.ok) return parsed.response;

  const token = consentToken(auth.user.id, parsed.data.parent_email);

  await auth.supabase
    .from("profiles")
    .update({
      parent_name:  parsed.data.parent_name,
      parent_email: parsed.data.parent_email,
    })
    .eq("id", auth.user.id);

  await sendEmail({
    to: parsed.data.parent_email,
    subject: `Action needed: parental consent for ${parsed.data.student_name ?? "your student"}`,
    template: "parental.consent",
    props: {
      studentName: parsed.data.student_name ?? "your student",
      consentUrl:  `${SITE_URL}/api/portal/parental-consent?user_id=${auth.user.id}&token=${token}`,
    },
  });

  await audit({
    actorId: auth.user.id, actorEmail: auth.user.email ?? null, subjectId: auth.user.id,
    action: "parental_consent.email_sent",
    details: { parent_email: parsed.data.parent_email },
  });

  return NextResponse.json({ ok: true });
}

/** GET → verify the token and stamp the consent timestamp. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Confirm.safeParse({
    user_id: url.searchParams.get("user_id"),
    token:   url.searchParams.get("token"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Bad link" }, { status: 400 });

  const admin = getServiceRoleClient();
  if (!admin) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const { data: profile } = await admin
    .from("profiles").select("parent_email")
    .eq("id", parsed.data.user_id).maybeSingle();
  if (!profile?.parent_email) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  if (consentToken(parsed.data.user_id, profile.parent_email) !== parsed.data.token) {
    return NextResponse.json({ error: "Token mismatch" }, { status: 403 });
  }

  await admin
    .from("profiles")
    .update({ parental_consent_at: new Date().toISOString() })
    .eq("id", parsed.data.user_id);

  await audit({
    actorEmail: profile.parent_email,
    subjectId:  parsed.data.user_id,
    action:     "parental_consent.confirmed",
  });

  return NextResponse.redirect(`${SITE_URL}/portal/parental-consent?confirmed=1`);
}
