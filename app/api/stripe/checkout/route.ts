import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { packageId } = await req.json() as { packageId: string };

  const priceId = PRICE_IDS[packageId];
  if (!priceId) {
    return NextResponse.json({ error: "Unknown package" }, { status: 400 });
  }

  // Attach Supabase user ID as metadata so the webhook can activate the portal
  const supabase = await getSupabaseServerClient();
  const userId = supabase
    ? (await supabase.auth.getUser()).data.user?.id ?? null
    : null;

  const stripe = getStripe();
  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/portal?checkout=success`,
    cancel_url:  `${origin}/pricing?checkout=cancelled`,
    metadata: {
      packageId,
      ...(userId ? { userId } : {}),
    },
  });

  return NextResponse.json({ url: session.url });
}
