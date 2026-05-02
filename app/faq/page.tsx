import {
  Section, Eyebrow, Heading, Text, CTA, Card,
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
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="brass" className="mb-5">FAQ</Eyebrow>
          <Heading level={1} className="mb-6">Questions, plainly answered.</Heading>
          <Text variant="lead">If something here doesn&apos;t cover your case, the consultation is free.</Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto">
          <Card variant="default" className="px-6 sm:px-8">
            <FAQAccordion items={faqs} />
          </Card>
        </div>
      </Section>

      <Section variant="elevated" spacing="default" bordered>
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={3} className="mb-3">Still have a question?</Heading>
          <Text variant="body" className="mb-8">The fastest way to get answers is the free consultation. No commitment.</Text>
          <CTA href="/apply" size="lg">Book free consultation</CTA>
        </div>
      </Section>
    </>
  );
}
