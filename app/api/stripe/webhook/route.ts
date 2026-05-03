import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { getServiceRoleClient } from "@/lib/supabase";

// Stripe requires the raw body — disable Next.js body parsing
export const runtime = "nodejs";

const PACKAGE_TO_PLAN: Record<string, { plan: string; plan_status: string }> = {
  "pay-as-you-go": { plan: "session",    plan_status: "active" },
  "month":         { plan: "monthly",    plan_status: "active" },
  "two-month":     { plan: "monthly",    plan_status: "active" },
  "three-month":   { plan: "monthly",    plan_status: "active" },
  "admissions":    { plan: "counseling", plan_status: "active" },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook signature failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Support both checkout flows:
    // - pricing page: metadata.userId + metadata.packageId
    // - portal upgrade: metadata.user_id + metadata.plan
    const userId = session.metadata?.userId ?? session.metadata?.user_id;
    const packageId = session.metadata?.packageId;
    const directPlan = session.metadata?.plan;

    let planData: { plan: string; plan_status: string } | undefined;
    if (packageId) {
      planData = PACKAGE_TO_PLAN[packageId];
    } else if (directPlan) {
      planData = { plan: directPlan, plan_status: "active" };
    }

    if (userId && planData) {
      const supabase = getServiceRoleClient();
      if (supabase) {
        await supabase
          .from("profiles")
          .update(planData)
          .eq("id", userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
