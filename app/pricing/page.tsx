import Link from "next/link";
import { Check } from "lucide-react";
import {
  Eyebrow, CTA,
  BgInkWash, BgFade,
} from "@/components/system";
import { HOURLY_RATE, PACKAGES } from "@/lib/pricing";

export const metadata = { title: "Pricing" };

const includedEverywhere = [
  "Free 30-minute trial — no card",
  "1:1 video sessions with a vetted Princeton-tier undergrad",
  "Shared progress map (your sky)",
  "Cancel any session up to 12 hours before",
  "Refundable until halfway through any cadence",
];

export default function PricingPage() {
  return (
    <div className="relative">
      <section className="relative pt-[120px] md:pt-[160px] pb-16 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />
        <div className="relative max-w-[900px] mx-auto px-5 sm:px-8">
          <Eyebrow color="brass" className="mb-6">Pricing</Eyebrow>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
          >
            One rate. Or commit and pay less.
          </h1>
          <p className="text-[var(--text-2)] text-[16.5px] leading-[1.7] max-w-2xl">
            ${HOURLY_RATE}/hr pay-as-you-go. Two-hours-a-week cadences for four, eight, or twelve weeks
            knock the rate down. Nothing else to figure out.
          </p>
        </div>
      </section>

      <section className="relative py-12 md:py-16">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8">
          <div className="rounded-[14px] overflow-hidden border border-[var(--border)] bg-[#0c1124]/70 backdrop-blur-sm">
            <Row label="Free trial" sub="30 minutes" price="$0" />
            <Row label="Pay-as-you-go" sub="any session" price={`$${HOURLY_RATE} / hr`} highlight />
            {PACKAGES.map((pkg) => (
              <Row
                key={pkg.id}
                label={`${pkg.weeks}-week cadence`}
                sub={`${pkg.totalHours} hrs total · ${pkg.weeks} weeks × 2 hrs/wk`}
                price={`$${pkg.effectiveHourly} / hr`}
                aside={`$${pkg.totalPrice.toLocaleString()} · save ${pkg.discountPct}%`}
                recommended={pkg.recommended}
              />
            ))}
            <Row label="Admissions" sub="essays · school list · interviews" price="$150 / session" />
          </div>

          <div className="mt-10 max-w-[680px]">
            <h3
              className="font-[family-name:var(--font-fraunces)] font-medium text-[var(--text-1)] mb-4"
              style={{ fontSize: 18 }}
            >
              Included on everything.
            </h3>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {includedEverywhere.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[var(--text-2)] text-[14px] leading-[1.6]">
                  <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative py-16 border-t border-[var(--border)]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1]"
              style={{ fontSize: 24 }}
            >
              Start with the trial.
            </p>
            <p className="text-[var(--text-3)] text-[14px] mt-2">
              Twelve-minute intake. Free 30-minute session.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CTA href="/match" size="default">Get matched</CTA>
            <Link
              href="/faq"
              className="inline-flex items-center text-[var(--text-3)] hover:text-[var(--text-1)] text-[12px] font-mono uppercase tracking-[0.18em] transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  label, sub, price, aside, highlight, recommended,
}: {
  label: string;
  sub: string;
  price: string;
  aside?: string;
  highlight?: boolean;
  recommended?: boolean;
}) {
  return (
    <div
      className="grid items-center gap-4 px-5 sm:px-7 py-5 border-b border-[var(--border)] last:border-b-0"
      style={{ gridTemplateColumns: "1fr auto", background: highlight ? "rgba(125,211,252,0.05)" : "transparent" }}
    >
      <div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="font-[family-name:var(--font-fraunces)] italic"
            style={{ fontSize: 19, color: "var(--text-1)" }}
          >
            {label}
          </span>
          {recommended ? (
            <span className="font-mono text-[10px] tracking-[0.22em] text-[#7dd3fc]">
              · MOST START HERE
            </span>
          ) : null}
        </div>
        <div className="font-mono mt-1" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 1 }}>
          {sub.toUpperCase()}
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono" style={{ fontSize: 17, color: "var(--text-1)" }}>{price}</div>
        {aside ? (
          <div className="font-mono mt-0.5" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.5 }}>
            {aside}
          </div>
        ) : null}
      </div>
    </div>
  );
}
