import { Check, Minus } from "lucide-react";
import {
  Eyebrow, Heading, Text, CTA,
  BgConstellationGrid, BgInkWash, BgFade,
  SignatureLine,
} from "@/components/system";

export const metadata = { title: "Packages" };

const tiers = [
  {
    name: "Trial",
    price: "$0",
    period: "30 minutes",
    summary: "Meet your matched tutor. Drill a real problem. No card required.",
    cta: { label: "Book a trial", href: "/apply" },
    accent: false,
    bullets: [
      "Free 30-minute video session",
      "Live whiteboard + screen share",
      "Re-match if it isn't a fit",
      "No card on file",
    ],
  },
  {
    name: "Pay-as-you-go",
    price: "$110–$130",
    period: "/ session, hourly",
    summary: "Book sessions one at a time. The honest middle of the price range.",
    cta: { label: "Book a session", href: "/apply" },
    accent: true,
    bullets: [
      "Single 60-minute sessions",
      "Pricing depends on tutor (1500+ to 1590+ SAT)",
      "Cancel up to 12 hours before",
      "Materials and notes shared in your sky",
      "Reschedule freely",
    ],
  },
  {
    name: "Cadence",
    price: "$95–$110",
    period: "/ session, prepaid 8-pack",
    summary: "Same tutors, ~15% off, plus weekly assignments between sessions.",
    cta: { label: "Start a Cadence", href: "/apply" },
    accent: false,
    bullets: [
      "Eight 60-minute sessions, prepaid",
      "Use within four months",
      "Weekly assignments + score forecasts",
      "Tutor reviews submitted homework",
      "One unused session refundable",
    ],
  },
];

const matrix: { feature: string; trial: boolean; payg: boolean; cadence: boolean }[] = [
  { feature: "Free 30-minute trial",          trial: true,  payg: true,  cadence: true },
  { feature: "Live 1:1 video sessions",       trial: true,  payg: true,  cadence: true },
  { feature: "Vetted Ivy tutor",              trial: true,  payg: true,  cadence: true },
  { feature: "Your sky / progress map",       trial: false, payg: true,  cadence: true },
  { feature: "Cancel up to 12h before",       trial: false, payg: true,  cadence: true },
  { feature: "Reschedule freely",             trial: false, payg: true,  cadence: true },
  { feature: "Weekly assignments",            trial: false, payg: false, cadence: true },
  { feature: "Tutor-reviewed homework",       trial: false, payg: false, cadence: true },
  { feature: "Bundled discount (~15%)",       trial: false, payg: false, cadence: true },
  { feature: "Score forecast updates",        trial: false, payg: false, cadence: true },
];

export default function PricingPage() {
  return (
    <div className="relative">
      <section className="relative min-h-[520px] flex items-end overflow-hidden pt-[100px] md:pt-0">
        <BgConstellationGrid />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(7,9,20,0.85) 80%, var(--bg) 100%)" }}
        />
        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Packages</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.8rem)" }}
            >
              Pay by the session.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Or by the cadence.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              No thousand-dollar packages. No prepaid years. Either book one session at a time or
              prepay an 8-pack for a small discount and weekly assignments. Both end the day you
              walk away.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-center">
            {tiers.map((t, i) => {
              const isMid = i === 1;
              return (
                <article
                  key={t.name}
                  className={`relative rounded-[28px] p-8 md:p-9 transition-all duration-500 ${
                    isMid
                      ? "bg-[var(--accent-dim)] border border-[var(--border-accent)] md:scale-[1.04] md:-translate-y-3 shadow-[0_28px_56px_rgba(0,0,0,0.45)]"
                      : "bg-[#0c1124]/70 backdrop-blur-sm border border-[var(--border)]"
                  }`}
                >
                  {isMid ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] font-mono bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border-accent)]">
                      Most flexible
                    </span>
                  ) : null}
                  <h3 className="font-[family-name:var(--font-cormorant)] italic text-[var(--text-1)] text-[28px] mb-3 leading-none">
                    {t.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-5 flex-wrap">
                    <span className="font-[family-name:var(--font-fraunces)] text-[44px] leading-none text-[var(--text-1)]">{t.price}</span>
                    <span className="text-[var(--text-3)] text-[13px]">{t.period}</span>
                  </div>
                  <Text variant="small" className="mb-7">{t.summary}</Text>
                  <ul className="space-y-3 mb-8">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[var(--text-2)] text-[14.5px]">
                        <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <CTA href={t.cta.href} variant={t.accent ? "primary" : "ghost"} size="default" className="w-full">
                    {t.cta.label}
                  </CTA>
                </article>
              );
            })}
          </div>
          <p className="mt-10 max-w-2xl mx-auto text-center text-[var(--text-3)] text-[13px] leading-[1.7] font-mono uppercase tracking-[0.16em]">
            Admissions consulting · $150 / session · Available on any package
          </p>
        </div>
      </section>

      <section className="relative py-24 md:py-28">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <Eyebrow color="moon" className="mb-4">Compare</Eyebrow>
            <Heading level={2}>What you get</Heading>
          </div>
          <div className="overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[#0c1124]/40 backdrop-blur-sm">
            <table className="w-full text-left text-[14px]">
              <thead className="text-[var(--text-3)] uppercase text-[11px] tracking-[0.18em]">
                <tr>
                  <th className="px-6 py-5 font-mono">Feature</th>
                  <th className="px-5 py-5 text-center font-mono">Trial</th>
                  <th className="px-5 py-5 text-center font-mono">Pay-as-you-go</th>
                  <th className="px-5 py-5 text-center font-mono">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.feature} className="border-t border-[var(--border)]">
                    <td className="px-6 py-4 text-[var(--text-1)]">{row.feature}</td>
                    <td className="px-5 py-4 text-center">{row.trial ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                    <td className="px-5 py-4 text-center">{row.payg ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                    <td className="px-5 py-4 text-center">{row.cadence ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  </tr>
                ))}
                <tr className="border-t border-[var(--border)] bg-[var(--bg)]/40">
                  <td className="px-6 py-4 text-[var(--text-2)] italic font-[family-name:var(--font-fraunces)]">Admissions consulting · $150 / session</td>
                  <td className="px-5 py-4 text-center text-[var(--text-3)] text-[12px]" colSpan={3}>Available on any package</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-[var(--text-3)] text-[12px] font-mono uppercase tracking-[0.16em]">
            Hourly rate depends on the individual tutor · 1500-1590+ SAT · Princeton, Harvard, Yale, MIT, Stanford, Columbia
          </p>
        </div>
      </section>
    </div>
  );
}
