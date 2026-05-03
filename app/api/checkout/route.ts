import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, PLAN_PRICE_IDS } from "@/lib/stripe";
import { CheckoutRequest, safeParseJson } from "@/lib/zod";
import { ANNUAL_PREPAY_DISCOUNT_PCT } from "@/lib/pricing";
import { captureException } from "@/lib/observability";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * POST /api/checkout
 * Body: { plan: "session" | "monthly" | "counseling", annualPrepay?: boolean, promoCode?: string }
 *
 *   • If Stripe is configured, creates a Checkout Session with the right
 *     mode (subscription vs payment) and applies the annual-prepay coupon.
 *   • If Stripe isn't configured, returns a development-mode mock URL.
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = safeParseJson(CheckoutRequest, body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 });
  const { plan, annualPrepay, promoCode } = parsed.data;
  if (!plan) return NextResponse.json({ error: "plan is required" }, { status: 400 });

  const successUrl = `${SITE_URL}/portal/upgrade/success?plan=${plan}`;
  const cancelUrl = `${SITE_URL}/portal/upgrade?cancelled=1`;

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
      { status: 500 },
    );
  }

  try {
    const stripe = getStripe();

    // Apply annual-prepay coupon (created on demand if missing).
    const discounts: { coupon: string }[] = [];
    if (annualPrepay && plan === "monthly") {
      const couponId = await ensureAnnualPrepayCoupon(stripe);
      if (couponId) discounts.push({ coupon: couponId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: plan === "session" ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: !discounts.length,
      ...(discounts.length ? { discounts } : {}),
      ...(promoCode ? { discounts: [{ coupon: promoCode }] } : {}),
      customer_email: user.email ?? undefined,
      success_url: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        user_id:       user.id,
        plan,
        annualPrepay:  annualPrepay ? "1" : "0",
      },
    });

    return NextResponse.json({ url: session.url, mock: false });
  } catch (err) {
    captureException(err, { route: "checkout.POST", plan });
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Idempotently create a one-off Stripe coupon for the annual-prepay rebate. */
async function ensureAnnualPrepayCoupon(stripe: ReturnType<typeof getStripe>): Promise<string | null> {
  const id = `nyx-annual-prepay-${ANNUAL_PREPAY_DISCOUNT_PCT}`;
  try {
    const found = await stripe.coupons.retrieve(id).catch(() => null);
    if (found) return found.id;
    const created = await stripe.coupons.create({
      id,
      percent_off: ANNUAL_PREPAY_DISCOUNT_PCT,
      duration: "forever",
      name: `Annual prepay (${ANNUAL_PREPAY_DISCOUNT_PCT}% off)`,
    });
    return created.id;
  } catch {
    return null;
  }
}
