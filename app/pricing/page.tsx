import { Check, Minus } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, Card,
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
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">Pricing</Eyebrow>
          <Heading level={1} className="mb-6">Simple plans. Real outcomes.</Heading>
          <Text variant="lead">
            Three tiers and one optional add-on. Cancel anytime. Tutoring is sold separately,
            never bundled into thousand-dollar packages.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Card key={t.name} variant={t.accent ? "accent" : "default"} hover>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-[var(--text-1)] font-semibold text-[18px]">{t.name}</h3>
                {t.accent ? (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] font-mono">Recommended</span>
                ) : null}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-[family-name:var(--font-fraunces)] text-[44px] leading-none text-[var(--text-1)]">{t.price}</span>
                <span className="text-[var(--text-3)] text-[13px]">{t.period}</span>
              </div>
              <Text variant="small" className="mb-6">{t.summary}</Text>
              <ul className="space-y-2.5 mb-8">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[var(--text-2)] text-[14px]">
                    <Check size={14} className="text-[var(--accent)] mt-1 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <CTA href={t.cta.href} variant={t.accent ? "primary" : "ghost"} size="default" className="w-full">
                {t.cta.label}
              </CTA>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="elevated" spacing="default" bordered>
        <div className="mb-10">
          <Eyebrow color="moon" className="mb-4">Compare</Eyebrow>
          <Heading level={2}>Feature matrix</Heading>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[var(--bg-2)] text-[var(--text-3)] uppercase text-[11px] tracking-[0.14em]">
              <tr>
                <th className="px-5 py-4">Feature</th>
                <th className="px-5 py-4 text-center">Free</th>
                <th className="px-5 py-4 text-center">Scholar</th>
                <th className="px-5 py-4 text-center">Constellation</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.feature} className="border-t border-[var(--border)]">
                  <td className="px-5 py-3.5 text-[var(--text-1)]">{row.feature}</td>
                  <td className="px-5 py-3.5 text-center">{row.free ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  <td className="px-5 py-3.5 text-center">{row.scholar ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                  <td className="px-5 py-3.5 text-center">{row.constellation ? <Check size={14} className="inline text-[var(--accent)]" /> : <Minus size={14} className="inline text-[var(--text-3)]" />}</td>
                </tr>
              ))}
              <tr className="border-t border-[var(--border)] bg-[var(--bg-2)]">
                <td className="px-5 py-3.5 text-[var(--text-2)] italic">1:1 tutoring add-on · $120 / session</td>
                <td className="px-5 py-3.5 text-center text-[var(--text-3)]" colSpan={3}>Available on any plan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
