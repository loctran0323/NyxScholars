import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { getServiceRoleClient } from "@/lib/supabase";
import { notify } from "@/lib/notifications";
import { captureException, captureMessage } from "@/lib/observability";

export const runtime = "nodejs";

const PACKAGE_TO_PLAN: Record<string, { plan: string; plan_status: string }> = {
  "pay-as-you-go": { plan: "session",    plan_status: "active" },
  "month":         { plan: "monthly",    plan_status: "active" },
  "two-month":     { plan: "monthly",    plan_status: "active" },
  "three-month":   { plan: "monthly",    plan_status: "active" },
  "admissions":    { plan: "counseling", plan_status: "active" },
};

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "charge.refunded",
]);

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    captureMessage("Stripe webhook called without STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    console.error("[stripe] webhook signature failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // ---- Idempotency: short-circuit duplicate deliveries -------------------
  // The handler below (handleCheckoutCompleted) already supports both
  // metadata flows (packageId from the pricing page and plan from the
  // portal upgrade), so we don't need a separate inline branch here.
  const sb = getServiceRoleClient();
  if (sb) {
    const { data: existing } = await sb
      .from("webhook_events")
      .select("id, processed_at")
      .eq("id", event.id)
      .maybeSingle();

    if (existing?.processed_at) {
      return NextResponse.json({ received: true, deduped: true });
    }

    if (!existing) {
      await sb.from("webhook_events").insert({
        id: event.id,
        provider: "stripe",
        type: event.type,
        payload: event.data.object as unknown as Record<string, unknown>,
      });
    }
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    if (sb) await markProcessed(sb, event.id);
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionStatus(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }

    if (sb) await markProcessed(sb, event.id);
    return NextResponse.json({ received: true });
  } catch (err) {
    if (sb) {
      await sb
        .from("webhook_events")
        .update({ error: err instanceof Error ? err.message : String(err) })
        .eq("id", event.id);
    }
    captureException(err, { route: "stripe.webhook", eventType: event.type });
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

async function markProcessed(sb: NonNullable<ReturnType<typeof getServiceRoleClient>>, id: string) {
  await sb.from("webhook_events").update({ processed_at: new Date().toISOString() }).eq("id", id);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sb = getServiceRoleClient();
  if (!sb) return;

  const userId    = (session.metadata?.userId ?? session.metadata?.user_id) ?? null;
  const packageId = session.metadata?.packageId ?? null;
  const planMeta  = session.metadata?.plan as "session" | "monthly" | "counseling" | undefined;

  if (!userId) return;

  const planData = packageId ? PACKAGE_TO_PLAN[packageId] : planMeta ? { plan: planMeta, plan_status: "active" } : null;
  if (!planData) return;

  await sb.from("profiles").update(planData).eq("id", userId);

  await notify({
    userId,
    kind: "billing.success",
    title: "Plan activated",
    body: `Your ${planData.plan} plan is now active. Schedule your next session anytime.`,
    href: "/portal",
  });
}

async function handleSubscriptionStatus(sub: Stripe.Subscription) {
  const sb = getServiceRoleClient();
  if (!sb) return;
  const userId = (sub.metadata?.userId ?? sub.metadata?.user_id) ?? null;
  if (!userId) return;

  const planMeta = sub.metadata?.plan as "session" | "monthly" | "counseling" | undefined;
  const status   = sub.status === "active" || sub.status === "trialing" ? "active"
                 : sub.status === "past_due" || sub.status === "unpaid" ? "paused"
                 : "cancelled";

  await sb
    .from("profiles")
    .update({ plan: planMeta ?? "monthly", plan_status: status })
    .eq("id", userId);
}

async function handleSubscriptionCancelled(sub: Stripe.Subscription) {
  const sb = getServiceRoleClient();
  if (!sb) return;
  const userId = (sub.metadata?.userId ?? sub.metadata?.user_id) ?? null;
  if (!userId) return;

  await sb.from("profiles").update({ plan_status: "cancelled" }).eq("id", userId);
  await notify({
    userId,
    kind: "billing.dunning",
    title: "Subscription cancelled",
    body: "Your plan has ended. Reactivate any time from the upgrade page.",
    href: "/portal/upgrade",
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const sb = getServiceRoleClient();
  if (!sb) return;
  const customer = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customer) return;
  const { data: profile } = await sb
    .from("profiles")
    .select("id")
    .eq("notif_prefs->>stripe_customer_id" as never, customer)
    .maybeSingle();
  if (!profile) return;
  await notify({
    userId: profile.id,
    kind: "billing.success",
    title: "Payment received",
    body: `We received your payment for invoice ${invoice.number ?? invoice.id}.`,
    href: "/portal",
  });
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const sb = getServiceRoleClient();
  if (!sb) return;
  const customer = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!customer) return;
  const { data: profile } = await sb
    .from("profiles")
    .select("id")
    .eq("notif_prefs->>stripe_customer_id" as never, customer)
    .maybeSingle();
  if (!profile) return;

  await notify({
    userId: profile.id,
    kind: "billing.failed",
    title: "We couldn't charge your card",
    body: "Stripe declined your latest invoice. Update your payment method to keep your sessions.",
    href: "/portal/billing",
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  captureMessage("Stripe charge refunded", { chargeId: charge.id, amount: charge.amount_refunded });
}
