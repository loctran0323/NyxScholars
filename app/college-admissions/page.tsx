import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "College Admissions" };

export default function CollegeAdmissionsPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="moon" className="mb-5">Admissions</Eyebrow>
          <Heading level={1} className="mb-6">Strategy, written by people who just got in.</Heading>
          <Text variant="lead">
            Essay review, school list strategy, and interview prep — from students currently at
            Princeton, Harvard, Yale, Stanford, MIT, and Columbia.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="max-w-3xl mx-auto space-y-12">
          <section>
            <Eyelet index="01" label="Essay" />
            <Heading level={2} as="h2" className="mt-4 mb-5">The essay is a voice problem.</Heading>
            <Text variant="body" className="mb-5">
              Most essay help is grammar and structure. Ours is voice. We work line by line until
              the page sounds like you on your best day — and we know what reads as &quot;trying too hard.&quot;
            </Text>
            <PhotoFrame
              src="/design/essay.jpg"
              alt="Essay annotation"
              aspect="wide"
              caption="A real annotated draft"
              index="A"
            />
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="02" label="School list" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Build the list around fit, not name.</Heading>
            <Text variant="body" className="mb-5">
              Reach, target, likely — sorted by what you actually want from college, not by US News
              rankings. We share the data we used when we built our own lists.
            </Text>
          </section>

          <HorizonDivider />

          <section>
            <Eyelet index="03" label="Interview" />
            <Heading level={2} as="h2" className="mt-4 mb-5">Practice with someone who&apos;s been on the other side.</Heading>
            <Text variant="body">
              Mock interviews with current students who serve as alumni interviewers. We send a
              written debrief after every session — what landed, what didn&apos;t, what to drill.
            </Text>
          </section>
        </div>
      </Section>

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Talk to a Nyx mentor.</Heading>
          <Text variant="lead" className="mb-8">A free 20-minute call to map your application.</Text>
          <CTA href="/apply" size="lg">Book the call</CTA>
        </div>
      </Section>
    </>
  );
}
