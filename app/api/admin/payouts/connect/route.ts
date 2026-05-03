import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Admin-only: launch a Stripe Connect Express onboarding link for a tutor.
 * Creates the connected account on first use, then returns either an
 * onboarding URL (account incomplete) or an Express dashboard URL (complete).
 */
export async function GET(req: Request) {
  // Reuse the admin password cookie that gates /admin pages.
  const adminPassword = process.env.ADMIN_PASSWORD;
  const session = (await cookies()).get("admin_session")?.value;
  if (!adminPassword || session !== adminPassword) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const tutorId = url.searchParams.get("tutor_id");
  if (!tutorId) return NextResponse.json({ error: "tutor_id required" }, { status: 400 });

  const admin = getServiceRoleClient();
  if (!admin) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name, stripe_account_id, stripe_account_status")
    .eq("id", tutorId)
    .single();
  if (!profile) return NextResponse.json({ error: "Tutor not found" }, { status: 404 });

  const stripe = getStripe();
  let accountId = (profile as { stripe_account_id: string | null }).stripe_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      capabilities: { transfers: { requested: true } },
      business_type: "individual",
      metadata: { user_id: tutorId },
    });
    accountId = account.id;
    await admin
      .from("profiles")
      .update({ stripe_account_id: accountId, stripe_account_status: "pending" })
      .eq("id", tutorId);
  }

  // If the account is already complete, surface a login link instead.
  const account = await stripe.accounts.retrieve(accountId);
  if (account.charges_enabled && account.payouts_enabled) {
    await admin
      .from("profiles")
      .update({ stripe_account_status: "complete" })
      .eq("id", tutorId);
    const login = await stripe.accounts.createLoginLink(accountId);
    return NextResponse.redirect(login.url);
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${SITE_URL}/admin/payouts`,
    return_url:  `${SITE_URL}/admin/payouts`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(link.url);
}
