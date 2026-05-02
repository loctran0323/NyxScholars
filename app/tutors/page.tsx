import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame, HorizonDivider, Eyelet,
} from "@/components/system";

export const metadata = { title: "Founders" };

const founders = [
  {
    name: "Loc",
    role: "Co-founder · Product & Curriculum",
    school: "Princeton, Class of 2028",
    img: "/design/founder-loc.jpg",
    bio: "Loc designs the adaptive engine and authors much of the SAT bank. He recently scored in the 99th percentile on the digital SAT and has tutored over 50 students one-on-one through the redesigned exam.",
    quote: "The fastest path to a higher score is the question you can almost answer.",
  },
  {
    name: "Charles",
    role: "Co-founder · Engineering & Operations",
    school: "Princeton, Class of 2028",
    img: "/design/founder-charles.jpg",
    bio: "Charles built the Nyx platform end to end and runs ops. Princeton class of 2028, he handles the engineering side of every adaptive feature — from IRT calibration to the dashboard you read each week.",
    quote: "We owe students a number, not a vibe.",
  },
];

export default function FoundersPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">The Founders</Eyebrow>
          <Heading level={1} className="mb-6">
            Two students. One product they wish they&apos;d had.
          </Heading>
          <Text variant="lead">
            Nyx was built by Loc and Charles — Princeton classmates who started where you are
            and built the prep platform they wanted.
          </Text>
        </div>
      </Section>

      {founders.map((f, i) => (
        <Section key={f.name} variant={i % 2 === 0 ? "default" : "elevated"} spacing="default" bordered>
          <div className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
            <div className="lg:col-span-5 lg:[direction:ltr]">
              <PhotoFrame
                src={f.img}
                alt={f.name}
                aspect="portrait"
                index={`0${i + 1}`}
                caption={f.role}
                hoverZoom
              />
            </div>
            <div className="lg:col-span-7 lg:[direction:ltr]">
              <Eyelet index={`0${i + 1}`} label={f.school} />
              <Heading level={2} as="h2" className="mt-5 mb-5">{f.name}</Heading>
              <Text variant="body" className="mb-8">{f.bio}</Text>
              <blockquote className="border-l-2 border-[var(--accent)] pl-5 text-[var(--text-1)] text-[18px] leading-relaxed font-[family-name:var(--font-fraunces)] italic">
                &ldquo;{f.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </Section>
      ))}

      <HorizonDivider />

      <Section variant="accent" spacing="default" glow="bottom">
        <div className="max-w-2xl mx-auto text-center">
          <Heading level={2} className="mb-5">Work with us directly.</Heading>
          <Text variant="lead" className="mb-8">
            Loc and Charles still tutor a small number of students each semester.
            Spots are limited.
          </Text>
          <CTA href="/apply" size="lg">Apply for 1:1 tutoring</CTA>
        </div>
      </Section>
    </>
  );
}
