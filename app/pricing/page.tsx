import { Check, Minus } from "lucide-react";
import {
  Eyebrow, Heading, Text, CTA,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

export const metadata = { title: "Pricing" };

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    summary: "Take the diagnostic. Sample the platform.",
    cta: { label: "Start free", href: "/apply" },
    accent: false,
    bullets: [
      "Adaptive diagnostic (1 attempt)",
      "Score and study report",
      "50 practice questions / week",
      "Email support",
    ],
  },
  {
    name: "Scholar",
    price: "$29",
    period: "/ month",
    summary: "Unlimited adaptive practice + analytics.",
    cta: { label: "Start Scholar", href: "/apply" },
    accent: true,
    bullets: [
      "Unlimited adaptive practice",
      "Full question bank",
      "Weekly score updates",
      "Skill mastery heatmap",
      "Daily study plan",
    ],
  },
  {
    name: "Constellation",
    price: "$79",
    period: "/ month",
    summary: "Scholar + mocks, written feedback.",
    cta: { label: "Start Constellation", href: "/apply" },
    accent: false,
    bullets: [
      "Everything in Scholar",
      "2 full-length mocks / month",
      "Written tutor feedback",
      "Priority new content",
      "Priority support",
    ],
  },
];

const matrix: { feature: string; free: boolean; scholar: boolean; constellation: boolean }[] = [
  { feature: "Adaptive diagnostic",           free: true,  scholar: true,  constellation: true },
  { feature: "Score and study report",        free: true,  scholar: true,  constellation: true },
  { feature: "Unlimited practice",            free: false, scholar: true,  constellation: true },
  { feature: "Skill mastery heatmap",         free: false, scholar: true,  constellation: true },
  { feature: "Daily study plan",              free: false, scholar: true,  constellation: true },
  { feature: "Full-length proctored mocks",   free: false, scholar: false, constellation: true },
  { feature: "Written tutor feedback",        free: false, scholar: false, constellation: true },
  { feature: "Priority new content",          free: false, scholar: false, constellation: true },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative pt-[120px] md:pt-[160px] pb-20">
        <Drift density="med" seed={101} />
        <BlobGlow position="top-right" color="gold" size="xl" intensity={0.14} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Pricing</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.2rem)" }}
            >
              Simple plans.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Real outcomes.</span>
            </h1>
            <Text variant="lead" className="max-w-2xl">
              Three tiers and one optional add-on. Cancel anytime. Tutoring is sold separately,
              never bundled into thousand-dollar packages.
            </Text>
            <SignatureLine width={180} className="mt-10" />
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" />

      {/* Tiers — middle one is elevated and tilted slightly */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <Drift density="low" seed={37} className="opacity-40" />
        <BlobGlow position="center" color="gold" size="lg" intensity={0.08} />

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
                      : "bg-[var(--surface)]/70 backdrop-blur-sm border border-[var(--border)]"
                  }`}
                >
                  {isMid ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] font-mono bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border-accent)]">
                      Recommended
                    </span>
                  ) : null}
                  <h3 className="font-[family-name:var(--font-cormorant)] italic text-[var(--text-1)] text-[28px] mb-3 leading-none">
                    {t.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="font-[family-name:var(--font-fraunces)] text-[52px] leading-none text-[var(--text-1)]">{t.price}</span>
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
        </div>
      </section>

      <Arc direction="down" intensity="subtle" />

      {/* Feature matrix */}
      <section className="relative py-24 md:py-28 bg-[var(--bg-2)]">
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <Eyebrow color="moon" className="mb-4">Compare</Eyebrow>
            <Heading level={2}>Feature matrix</Heading>
          </div>
          <div className="overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm">
            <table className="w-full text-left text-[14px]">
              <thead className="text-[var(--text-3)] uppercase text-[11px] tracking-[0.18em]">
                <tr>
                  <th className="px-6 py-5 font-mono">Feature</th>
                  <th className="px-5 py-5 text-center font-mono">Free</th>
                  <th className="px-5 py-5 text-center font-mono">Scholar</th>
                  <th className="px-5 py-5 text-center font-mono">Constellation</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.feature} className="border-t border-[var(--border)]">
                    <td className="px-6 py-4 text-[var(--text-1)]">{row.feature}</td>
                    <td className="px-5 py-4 text-center">{row.free ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                    <td className="px-5 py-4 text-center">{row.scholar ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                    <td className="px-5 py-4 text-center">{row.constellation ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  </tr>
                ))}
                <tr className="border-t border-[var(--border)] bg-[var(--bg)]/40">
                  <td className="px-6 py-4 text-[var(--text-2)] italic font-[family-name:var(--font-fraunces)]">1:1 tutoring add-on · $120 / session</td>
                  <td className="px-5 py-4 text-center text-[var(--text-3)] text-[12px]" colSpan={3}>Available on any plan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
