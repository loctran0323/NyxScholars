import {
  Eyebrow, Text, CTA,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";
import FAQAccordion from "@/components/shared/FAQAccordion";

export const metadata = {
  title: "FAQ",
  description: "Common questions about Nyx — adaptive prep, the diagnostic, plans, and tutoring.",
};

const faqs = [
  { question: "What does the diagnostic measure?", answer: "Your current SAT or ACT section ability, expressed as a calibrated score with a confidence interval. Thirty adaptive questions converge in roughly forty minutes." },
  { question: "Is Nyx adaptive?", answer: "Yes. Every practice question is selected based on a running estimate of your ability and the skill you most need. The engine uses item-response theory (IRT)." },
  { question: "How is this different from Khan Academy?", answer: "Adaptivity is the core, not an extra. Calibration is published — you see the confidence interval, the time-to-target, and the specific skills holding your score back." },
  { question: "Do you guarantee a score increase?", answer: "No. We publish trajectory and confidence intervals because we owe students a real number — not a marketing promise." },
  { question: "Who writes the questions?", answer: "Current students at Ivy-tier schools who recently scored at the top. Every question is calibrated against the bank before it ships to a student." },
  { question: "Can I work with a tutor?", answer: "Yes — 1:1 tutoring is sold separately at $120 per session. It is never bundled into thousand-dollar packages." },
  { question: "Can I cancel?", answer: "Anytime. Plans are monthly. Pro-rated refunds aren't issued, but you keep platform access through the end of the billing month." },
  { question: "Is tutoring online or in person?", answer: "Most sessions are online via video call. In-person options may be available in select areas — mention your preference during the consultation." },
  { question: "Can parents join the consultation?", answer: "Absolutely. We encourage parents and guardians to join the free consultation — it helps everyone get on the same page about goals and scheduling." },
];

export default function FaqPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative pt-[120px] md:pt-[160px] pb-20">
        <Drift density="med" seed={33} />
        <BlobGlow position="top-right" color="gold" size="lg" intensity={0.10} />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <Eyebrow color="brass" className="mb-6 mx-auto">FAQ</Eyebrow>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.02em] mb-8 mx-auto"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            Questions,{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">plainly answered.</span>
          </h1>
          <Text variant="lead">If something here doesn&apos;t cover your case, the consultation is free.</Text>
          <SignatureLine width={180} className="mt-10 mx-auto" />
        </div>
      </section>

      <Arc direction="up" intensity="subtle" />

      <section className="relative py-16 md:py-24">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <div className="bg-[var(--surface-elevated)]/70 backdrop-blur-sm border border-[var(--border)] rounded-[28px] px-6 sm:px-10 py-2">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" color="accent" />

      <section className="relative py-28 md:py-32 overflow-hidden">
        <Drift density="low" seed={77} />
        <BlobGlow position="center" color="gold" size="lg" intensity={0.10} />
        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-6 tracking-[-0.015em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
          >
            Still have a{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">question?</span>
          </h2>
          <Text variant="body" className="mb-10">
            The fastest way to get answers is the free consultation. No commitment.
          </Text>
          <CTA href="/apply" size="lg">Book free consultation</CTA>
        </div>
      </section>
    </div>
  );
}
