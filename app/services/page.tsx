import { Target, BookOpen, GraduationCap, Award } from "lucide-react";
import {
  Section, Eyebrow, Heading, Text, CTA, PhotoFrame,
  Drift, Arc, BlobGlow, SignatureLine,
} from "@/components/system";

export const metadata = { title: "Services" };

const featured = [
  {
    icon: Target,
    label: "SAT Adaptive",
    body: "Adaptive diagnostic, calibrated practice, weekly score reports. The core Nyx product.",
    seed: "svc-sat",
    href: "/sat-act",
  },
  {
    icon: BookOpen,
    label: "ACT Prep",
    body: "ACT-specific pacing, section drills, and reading speed training adapted to your baseline.",
    seed: "svc-act",
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
    <div className="relative overflow-hidden">
      <section className="relative pt-[120px] md:pt-[160px] pb-24">
        <Drift density="med" seed={9} />
        <BlobGlow position="top-right" color="gold" size="lg" intensity={0.12} />

        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Services</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.02] tracking-[-0.02em] mb-8"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.2rem)" }}
            >
              Adaptive prep,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">plus humans when it counts.</span>
            </h1>
            <Text variant="lead" className="max-w-2xl">
              The Nyx platform is the core. Tutoring, mocks, and admissions services exist to amplify it —
              never as a substitute for adaptive practice.
            </Text>
            <SignatureLine width={180} className="mt-10" />
          </div>
        </div>
      </section>

      <Arc direction="up" intensity="medium" />

      {/* Featured services — overlapping photo + text card */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <Drift density="low" seed={21} className="opacity-40" />
        <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {featured.map(({ icon: Icon, label, body, seed, href }, i) => (
              <article key={label} className="relative h-[420px] md:h-[480px]">
                <div className={`absolute inset-0 ${i % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"}`}>
                  <PhotoFrame alt={label} aspect="landscape" rounded="lg" seed={seed} className="h-full" />
                </div>
                <div className={`absolute ${i % 2 === 0 ? "right-0" : "left-0"} bottom-0 max-w-[85%] z-10 bg-[var(--surface-elevated)]/92 backdrop-blur-md border border-[var(--border-2)] rounded-[24px] p-7 shadow-[0_24px_48px_rgba(0,0,0,0.4)]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center">
                      <Icon size={16} className="text-[var(--accent)]" />
                    </span>
                    <h3 className="font-[family-name:var(--font-fraunces)] text-[var(--text-1)] text-[24px] font-medium leading-tight">{label}</h3>
                  </div>
                  <p className="text-[var(--text-2)] text-[14.5px] leading-[1.7] mb-5">{body}</p>
                  <CTA href={href} variant="ghost">Learn more</CTA>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Arc direction="down" intensity="subtle" />

      {/* Adjacent — minimal grid, no card framing */}
      <Section spacing="tight" variant="elevated">
        <div className="mb-12">
          <Eyebrow color="moon" className="mb-4">Adjacent</Eyebrow>
          <Heading level={2}>Other ways we work with students.</Heading>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {adjacent.map(({ icon: Icon, label, body }) => (
            <div key={label} className="group">
              <span className="w-10 h-10 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center mb-5 transition-colors group-hover:bg-[var(--accent)]/20">
                <Icon size={17} className="text-[var(--accent)]" />
              </span>
              <h3 className="text-[var(--text-1)] font-semibold text-[16px] mb-2">{label}</h3>
              <p className="text-[var(--text-2)] text-[14px] leading-[1.7]">{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
