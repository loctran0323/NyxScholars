import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, PlotEmbed, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "SAT / ACT Approach" };

export default function SatActPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="brass" className="mb-5">SAT &amp; ACT</Eyebrow>
          <Heading level={1} className="mb-6">
            Adaptive prep, not a workbook.
          </Heading>
          <Text variant="lead">
            Nyx prepares you for the SAT and ACT by modeling your ability and feeding you the exact
            questions that close your gaps — section by section, week by week.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto space-y-12">
          <section>
            <Eyelet index="01" label="Diagnostic" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Forty minutes. A real number.</Heading>
            <Text variant="body" className="mb-5">
              The diagnostic uses a calibrated item-response model. Thirty questions converge on a
              section score with a published confidence interval — no &quot;your level is intermediate.&quot;
            </Text>
            <PhotoFrame
              src="/design/diagnostic.jpg"
              alt="Diagnostic interface"
              aspect="wide"
              caption="The diagnostic interface"
              index="A"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="02" label="Practice" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Targeted, not random.</Heading>
            <Text variant="body" className="mb-5">
              After the diagnostic, every practice question is selected for difficulty just above
              your current ability and for the skill you most need. The boring middle is gone.
            </Text>
            <PlotEmbed
              caption="Skill mastery over four weeks · sample student"
              index="B"
              aspect="landscape"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="03" label="Review" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Read the report. Don&apos;t guess.</Heading>
            <Text variant="body" className="mb-5">
              The weekly study report names the three skills holding your score back, the time
              you spent on each, and what to work on next. It&apos;s short, specific, and updated automatically.
            </Text>
          </section>
        </div>
      </Section>

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Start with the diagnostic.</Heading>
          <Text variant="lead" className="mb-8">Forty minutes. Free. No commitment.</Text>
          <CTA href="/apply" size="lg">Take the diagnostic</CTA>
        </div>
      </Section>
    </>
  );
}
