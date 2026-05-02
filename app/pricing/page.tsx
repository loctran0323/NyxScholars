import { Check } from "lucide-react";
import {
  Eyebrow, CTA,
  BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import { HOURLY_RATE, PACKAGES } from "@/lib/pricing";

export const metadata = { title: "Pricing" };

const includedInEverything = [
  "Free 30-minute trial session",
  "1:1 video sessions with a Princeton founder",
  "Shared progress map (your sky)",
  "Cancel any single session up to 12 hours before",
  "No card required for the trial",
];

export default function PricingPage() {
  return (
    <div className="relative">

      {/* HERO — single rate, stated plainly */}
      <section className="relative pt-[120px] md:pt-[160px] pb-20 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />

        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Pricing</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}
            >
              One honest rate.
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl mb-12">
              <span className="text-[var(--text-1)]">${HOURLY_RATE}/hr</span> pay-as-you-go for any
              session. Or commit to a weekly cadence — two hours a week for four, eight, or twelve
              weeks — and pay less per hour the longer you commit.
            </p>
            <SignatureLine width={180} />
          </div>
        </div>
      </section>

      {/* The single rate, then the cadences */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />

        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">

          {/* Top row: Trial + Pay-as-you-go */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <PriceCard
              eyebrow="Start here"
              name="Free trial"
              priceLabel="$0"
              priceUnit="30 minutes"
              summary="Meet your matched tutor for half an hour. Drill a real problem. Decide if it's a fit."
              ctaLabel="Book a trial"
              ctaHref="/match"
              bullets={[
                "30-minute video session",
                "Shared whiteboard",
                "No card required",
                "Re-match if it isn't a fit",
              ]}
            />
            <PriceCard
              eyebrow="Pay-as-you-go"
              name="Single sessions"
              priceLabel={`$${HOURLY_RATE}`}
              priceUnit="per hour"
              summary="Book one session at a time. No commitment, no package."
              ctaLabel="Book a session"
              ctaHref="/match"
              bullets={[
                "60 or 90 minute sessions",
                "Cancel up to 12 hours before",
                "Reschedule freely",
                "Notes saved to your sky after each session",
              ]}
            />
          </div>

          {/* Cadences */}
          <div className="mb-6 mt-12">
            <p className="font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-3">
              Or commit
            </p>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] mb-4 max-w-2xl"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Two hours a week.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">
                Pick how many weeks.
              </span>
            </h2>
            <p className="text-[var(--text-2)] text-[15px] leading-[1.7] max-w-2xl">
              Same tutor across the cadence. Two 60-minute sessions a week, scheduled together at
              the start so you can plan around them. Pay upfront, get a real discount.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <p className="mt-8 text-[var(--text-3)] text-[13px] leading-[1.7] max-w-2xl">
            Unused sessions in a cadence are refundable until you&apos;re halfway through. After that
            we&apos;ll move them to a friend, or work them into the next cadence.
          </p>
        </div>
      </section>

      {/* What's included — single calm list */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8">
          <Eyebrow color="moon" className="mb-6">Included on any package</Eyebrow>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {includedInEverything.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[var(--text-2)] text-[15px] leading-[1.6]">
                <Check size={15} className="text-[var(--accent)] mt-1 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Admissions strip */}
      <section className="relative py-16 border-t border-[var(--border)]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-8 items-baseline">
          <div className="md:col-span-3">
            <p className="font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-2">Admissions</p>
            <p className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] text-[28px] leading-none">
              $150<span className="text-[var(--text-3)] text-[14px]"> / session</span>
            </p>
          </div>
          <div className="md:col-span-9">
            <p className="text-[var(--text-2)] text-[15px] leading-[1.7] max-w-2xl">
              Essay review, school list strategy, mock interviews. Available on any package and
              handled by the same vetted tutors — no separate consultant, no upcharge for &quot;senior
              counselor&quot; tier.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[460px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-16">
          <div className="max-w-xl">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-6 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Start with the trial.
            </h2>
            <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-9 max-w-md">
              Free 30 minutes. Decide after that.
            </p>
            <CTA href="/match" size="lg">Get matched</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
 * Cards — clean, no clutter, consistent rhythm
 * ─────────────────────────────────────────────────────────── */

function PriceCard({
  eyebrow, name, priceLabel, priceUnit, summary, bullets, ctaLabel, ctaHref,
}: {
  eyebrow: string;
  name: string;
  priceLabel: string;
  priceUnit: string;
  summary: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <article className="bg-[#0c1124]/70 backdrop-blur-sm border border-[var(--border)] rounded-[20px] p-7 md:p-8 flex flex-col">
      <p className="font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-3">
        {eyebrow}
      </p>
      <h3
        className="font-[family-name:var(--font-cormorant)] italic text-[var(--text-1)] mb-5"
        style={{ fontSize: 28, lineHeight: 1 }}
      >
        {name}
      </h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span
          className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-none"
          style={{ fontSize: 52 }}
        >
          {priceLabel}
        </span>
        <span className="text-[var(--text-3)] text-[13px]">{priceUnit}</span>
      </div>
      <p className="text-[var(--text-2)] text-[14px] leading-[1.65] mb-7">{summary}</p>
      <ul className="space-y-2.5 mb-8">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[var(--text-2)] text-[14px]">
            <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <CTA href={ctaHref} variant="ghost" className="w-full mt-auto">{ctaLabel}</CTA>
    </article>
  );
}

function PackageCard({ pkg }: { pkg: typeof PACKAGES[number] }) {
  const isRec = pkg.recommended === true;
  return (
    <article
      className={`relative rounded-[20px] p-7 md:p-8 flex flex-col transition-all duration-300 ${
        isRec
          ? "bg-[var(--accent-dim)] border border-[var(--border-accent)] md:scale-[1.02]"
          : "bg-[#0c1124]/70 backdrop-blur-sm border border-[var(--border)]"
      }`}
    >
      {isRec ? (
        <span
          className="absolute -top-3 left-7 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border-accent)]"
        >
          Most start here
        </span>
      ) : null}
      <p className="font-mono text-[var(--text-3)] text-[10px] uppercase tracking-[0.24em] mb-3">
        {pkg.weeks} weeks · {pkg.hoursPerWeek}hr / week
      </p>
      <h3
        className="font-[family-name:var(--font-cormorant)] italic text-[var(--text-1)] mb-5"
        style={{ fontSize: 26, lineHeight: 1 }}
      >
        {pkg.name}
      </h3>
      <div className="mb-1">
        <span
          className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] leading-none"
          style={{ fontSize: 44 }}
        >
          ${pkg.totalPrice.toLocaleString()}
        </span>
      </div>
      <p className="font-mono text-[var(--text-3)] text-[12px] tracking-[0.14em] mb-6">
        ${pkg.effectiveHourly}/hr · save {pkg.discountPct}%
      </p>
      <p className="text-[var(--text-2)] text-[14px] leading-[1.65] mb-7">{pkg.summary}</p>
      <ul className="space-y-2.5 mb-8 text-[var(--text-2)] text-[14px]">
        <li className="flex items-start gap-2.5">
          <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
          <span>{pkg.totalHours} hours total ({pkg.weeks} weeks × 2)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
          <span>Same tutor throughout</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
          <span>Schedule set at the start</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
          <span>Refundable until halfway</span>
        </li>
      </ul>
      <CTA href="/match" variant={isRec ? "primary" : "ghost"} className="w-full mt-auto">
        Start cadence
      </CTA>
    </article>
  );
}
