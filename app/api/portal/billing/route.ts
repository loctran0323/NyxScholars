import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * POST /api/portal/billing — launches the Stripe Customer Portal so users
 * can update payment method, change plan, download invoices, and cancel
 * without us touching billing manually.
 *
 * Looks up the Stripe customer id stored on the profile (set on first
 * checkout). If we don't have one yet, lazily creates a customer keyed by
 * the user's email so the portal still works.
 */
export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const sb = await getSupabaseServerClient();
  if (!sb) return NextResponse.json({ error: "Auth not configured" }, { status: 503 });

  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stripe = getStripe();

  // Look up the existing customer id (we store it under notif_prefs.stripe_customer_id).
  const admin = getServiceRoleClient();
  const profileLookup = await sb.from("profiles").select("notif_prefs").eq("id", user.id).maybeSingle();
  const meta = (profileLookup.data?.notif_prefs ?? {}) as Record<string, unknown>;
  let customerId = (meta.stripe_customer_id as string | undefined) ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    if (admin) {
      await admin
        .from("profiles")
        .update({ notif_prefs: { ...meta, stripe_customer_id: customerId } })
        .eq("id", user.id);
    }
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${SITE_URL}/portal`,
  });

  return NextResponse.json({ url: portal.url });
}
