import { Target, BookOpen, GraduationCap, Award } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, Card, PhotoFrame, HorizonDivider,
} from "@/components/system";

export const metadata = { title: "Services" };

const featured = [
  {
    icon: Target,
    label: "SAT Adaptive",
    body: "Adaptive diagnostic, calibrated practice, weekly score reports. The core Nyx product.",
    photo: "/design/svc-sat.jpg",
    href: "/sat-act",
  },
  {
    icon: BookOpen,
    label: "ACT Prep",
    body: "ACT-specific pacing, section drills, and reading speed training adapted to your baseline.",
    photo: "/design/svc-act.jpg",
    href: "/sat-act",
  },
];

const adjacent = [
  { icon: GraduationCap, label: "AP Tutoring", body: "10+ subjects with current top scorers." },
  { icon: Award, label: "Admissions", body: "Essays, school lists, interview prep." },
  { icon: Target, label: "1:1 Add-on", body: "Book Ivy-tier mentors à la carte." },
  { icon: BookOpen, label: "Mocks", body: "Full-length proctored practice tests with debrief." },
];

export default function ServicesPage() {
  return (
    <>
      <Section spacing="loose" glow="top" className="pt-[120px] md:pt-[140px]">
        <div className="max-w-3xl">
          <Eyebrow color="brass" className="mb-5">Services</Eyebrow>
          <Heading level={1} className="mb-6">Adaptive prep, plus humans when it counts.</Heading>
          <Text variant="lead">
            The Nyx platform is the core. Tutoring, mocks, and admissions services exist to amplify it —
            never as a substitute for adaptive practice.
          </Text>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map(({ icon: Icon, label, body, photo, href }) => (
            <Card key={label} variant="feature" hover>
              <PhotoFrame src={photo} alt={label} aspect="landscape" className="mb-6" />
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center">
                  <Icon size={16} className="text-[var(--accent)]" />
                </span>
                <Heading level={3}>{label}</Heading>
              </div>
              <Text variant="body" className="mb-6">{body}</Text>
              <CTA href={href} variant="ghost">Learn more</CTA>
            </Card>
          ))}
        </div>
      </Section>

      <HorizonDivider />

      <Section spacing="tight">
        <div className="mb-10">
          <Eyebrow color="moon" className="mb-4">Adjacent</Eyebrow>
          <Heading level={2}>Other ways we work with students.</Heading>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adjacent.map(({ icon: Icon, label, body }) => (
            <Card key={label} variant="default" hover>
              <span className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center mb-4">
                <Icon size={16} className="text-[var(--accent)]" />
              </span>
              <h3 className="text-[var(--text-1)] font-semibold text-[15px] mb-2">{label}</h3>
              <p className="text-[var(--text-2)] text-[13.5px] leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
