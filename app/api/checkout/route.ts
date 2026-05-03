import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, PLAN_PRICE_IDS } from "@/lib/stripe";
import type { PlanType } from "@/types/portal";

const VALID_PLANS: PlanType[] = ["session", "monthly", "counseling"];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * POST /api/checkout
 * Body: { plan: "session" | "monthly" | "counseling" }
 *
 * Behaviour:
 *   • If Stripe is configured (STRIPE_SECRET_KEY + matching STRIPE_PRICE_*),
 *     creates a real Stripe Checkout Session and returns its URL.
 *   • If Stripe is NOT configured, returns a development-mode "mock" URL that
 *     points back to /portal/upgrade/success?plan=<plan>&mock=1 so the rest
 *     of the flow can be wired up without a Stripe account.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const plan = body.plan as PlanType | undefined;
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const successUrl = `${SITE_URL}/portal/upgrade/success?plan=${plan}`;
  const cancelUrl = `${SITE_URL}/portal/upgrade?cancelled=1`;

  // Mock mode — Stripe not yet wired
  if (!isStripeConfigured()) {
    return NextResponse.json({
      url: `${successUrl}&mock=1`,
      mock: true,
    });
  }

  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price ID configured for plan "${plan}"` },
      { status: 500 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: plan === "session" ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: { user_id: user.id, plan },
    });

    return NextResponse.json({ url: session.url, mock: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
