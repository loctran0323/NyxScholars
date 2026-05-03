import { NextResponse } from "next/server";
import { GiftCardPurchase, safeParseJson } from "@/lib/zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { fmtUsd } from "@/lib/pricing";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = safeParseJson(GiftCardPurchase, body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 });
  const data = parsed.data;

  if (!isStripeConfigured()) {
    // Dev path — simulate a successful redirect.
    return NextResponse.json({
      url: `${SITE_URL}/portal/gift/success?mock=1&amt=${data.amountCents}`,
      mock: true,
    });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: data.amountCents,
          product_data: {
            name: `Nyx Scholars gift card — ${fmtUsd(data.amountCents)}`,
            description: `For ${data.recipientName}`,
          },
        },
      },
    ],
    customer_email: undefined,
    metadata: {
      product:        "gift_card",
      amountCents:    String(data.amountCents),
      recipientName:  data.recipientName,
      recipientEmail: data.recipientEmail,
      senderName:     data.senderName,
      message:        data.message ?? "",
      deliverAt:      data.deliverAt ?? "",
    },
    success_url: `${SITE_URL}/portal/gift/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${SITE_URL}/portal/gift?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
