import {
  Section, Eyebrow, Heading, Text, Card, PhotoFrame,
} from "@/components/system";
import LeadForm from "@/components/shared/LeadForm";

export const metadata = {
  title: "Apply",
  description: "Submit an inquiry for a free 20-minute consultation with Nyx.",
};

export default function ApplyPage() {
  return (
    <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <Eyebrow color="brass" className="mb-5">Free consultation</Eyebrow>
          <Heading level={1} className="mb-6">Tell us where you are.</Heading>
          <Text variant="lead" className="mb-10">
            Two minutes to fill out, twenty minutes on a call. We&apos;ll map your prep and tell you
            exactly which Nyx plan fits — or that none do.
          </Text>
          <PhotoFrame
            src="/design/apply.jpg"
            alt="Late-night study"
            aspect="landscape"
            caption="Where the work happens"
            index="A"
            mask="bottom"
            className="hidden lg:block"
          />
        </div>
        <div className="lg:col-span-7">
          <Card variant="elevated">
            <LeadForm />
          </Card>
        </div>
      </div>
    </Section>
  );
}
