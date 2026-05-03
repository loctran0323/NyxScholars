"use client";

import Link from "next/link";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  CTA,
  BgInkWash, BgFade,
} from "@/components/system";
import { HOURLY_RATE, PACKAGES } from "@/lib/pricing";

const includedEverywhere = [
  "Free 30-minute trial — no card",
  "1:1 video sessions with a vetted Ivy+ undergrad",
  "Shared progress map (your sky)",
  "Cancel any session up to 12 hours before",
  "Refundable until halfway through any cadence",
];

async function startCheckout(packageId: string): Promise<void> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId }),
  });
  const data = await res.json() as { url?: string; error?: string };
  if (data.url) window.location.href = data.url;
  else alert(data.error ?? "Something went wrong. Please try again.");
}

export default function PricingPage() {
  return (
    <div className="relative">
      <section className="relative pt-[140px] md:pt-[180px] pb-16 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />
        <div className="relative max-w-[860px] mx-auto px-6 sm:px-10">
          <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.28em] mb-6">
            <span className="gold-line" />Pricing
          </p>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.02em] mb-7 read-default"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            One rate.{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">Or commit and pay less.</span>
          </h1>
          <p className="text-[var(--text-2)] text-[17px] leading-[1.8] read-default">
            ${HOURLY_RATE} per hour pay-as-you-go. Two-hours-a-week cadences for four, eight, or
            twelve weeks knock the rate down. Nothing else to figure out.
          </p>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-10">
          <div className="rounded-[14px] overflow-hidden border border-[var(--border)] bg-[#0c1124]/60 backdrop-blur-sm">
            <Row label="Free trial" sub="30 minutes" price="$0" cta={{ label: "Book trial", href: "/match" }} />
            <Row
              label="Pay-as-you-go"
              sub="any session"
              price={`$${HOURLY_RATE} / hr`}
              cta={{ label: "Buy a session", packageId: "pay-as-you-go" }}
            />
            {PACKAGES.map((pkg) => (
              <Row
                key={pkg.id}
                label={`${pkg.weeks}-week cadence`}
                sub={`${pkg.totalHours} hrs total · ${pkg.weeks} weeks × 2 hrs/wk`}
                price={`$${pkg.effectiveHourly} / hr`}
                aside={`$${pkg.totalPrice.toLocaleString()} · save ${pkg.discountPct}%`}
                recommended={pkg.recommended}
                cta={{ label: "Get started", packageId: pkg.id }}
              />
            ))}
            <Row
              label="Admissions"
              sub="essays · school list · interviews"
              price="Quoted per case"
              cta={{ label: "Get in touch", href: "/match" }}
            />
          </div>

          <div className="mt-14 max-w-[680px]">
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-5"
              style={{ fontSize: 20 }}
            >
              Included on everything.
            </h3>
            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3.5">
              {includedEverywhere.map((line) => (
                <li key={line} className="flex items-start gap-3 text-[var(--text-2)] text-[14.5px] leading-[1.7]">
                  <Check size={15} className="text-[var(--accent)] mt-1 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative py-16 border-t border-[var(--border)]">
        <div className="max-w-[860px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-7">
          <div>
            <p
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.15]"
              style={{ fontSize: 24 }}
            >
              Start with the trial.
            </p>
            <p className="text-[var(--text-3)] text-[14px] mt-2.5">
              Twelve-minute intake. Free 30-minute session.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CTA href="/match" size="default">Get matched</CTA>
            <Link
              href="/faq"
              className="inline-flex items-center text-[var(--text-3)] hover:text-[var(--text-1)] text-[12px] font-mono uppercase tracking-[0.22em] transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

type RowCTA =
  | { label: string; href: string; packageId?: never }
  | { label: string; packageId: string; href?: never };

function Row({
  label, sub, price, aside, recommended, cta,
}: {
  label: string;
  sub: string;
  price: string;
  aside?: string;
  recommended?: boolean;
  cta: RowCTA;
}) {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCTA = async () => {
    if (cta.href) {
      window.location.href = cta.href;
      return;
    }
    setLoading(true);
    await startCheckout(cta.packageId!);
    setLoading(false);
  };

  return (
    <button
      onClick={handleCTA}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full grid items-center gap-4 px-6 sm:px-8 py-6 border-b border-[var(--border)] last:border-b-0 cursor-pointer text-left transition-colors disabled:opacity-50"
      style={{
        gridTemplateColumns: "1fr auto auto",
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
      }}
    >
      {/* Label + sub */}
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-[family-name:var(--font-fraunces)] italic"
            style={{ fontSize: 19, color: "var(--text-1)" }}
          >
            {label}
          </span>
          {recommended ? (
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--accent)]">
              · MOST START HERE
            </span>
          ) : null}
        </div>
        <div className="font-mono mt-1.5" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 1.5 }}>
          {sub.toUpperCase()}
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <div className="font-mono" style={{ fontSize: 17, color: "var(--text-1)" }}>{price}</div>
        {aside ? (
          <div className="font-mono mt-1" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.5 }}>
            {aside}
          </div>
        ) : null}
      </div>

      {/* Arrow — appears on hover */}
      <div style={{ color: hovered ? "var(--accent)" : "transparent", transition: "color 0.15s" }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
      </div>
    </button>
  );
}
