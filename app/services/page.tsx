import { Target, BookOpen, GraduationCap, Award } from "lucide-react";
import {
  Eyebrow, CTA,
  BgConstellationGrid, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

export const metadata = { title: "Services" };

const featured = [
  { n: "01", icon: Target,   label: "SAT Adaptive", body: "Adaptive diagnostic, calibrated practice, weekly score reports. The core Nyx product.", href: "/sat-act" },
  { n: "02", icon: BookOpen, label: "ACT Prep",     body: "ACT-specific pacing, section drills, and reading speed training adapted to your baseline.", href: "/sat-act" },
];

const adjacent = [
  { icon: GraduationCap, label: "AP Tutoring", body: "10+ subjects with current top scorers." },
  { icon: Award, label: "Admissions", body: "Essays, school lists, interview prep." },
  { icon: Target, label: "1:1 Add-on", body: "Book Ivy-tier mentors à la carte." },
  { icon: BookOpen, label: "Mocks", body: "Full-length proctored practice tests with debrief." },
];

export default function ServicesPage() {
  return (
    <div className="relative">
      <section className="relative min-h-[600px] flex items-end overflow-hidden pt-[100px] md:pt-0">
        <BgConstellationGrid />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, transparent 30%, rgba(7,9,20,0.85) 80%, var(--bg) 100%)" }}
        />
        <div className="relative w-full max-w-[1180px] mx-auto px-5 sm:px-8 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <Eyebrow color="brass" className="mb-6">Services</Eyebrow>
            <h1
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em] mb-7"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
            >
              Adaptive prep,{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">plus humans when it counts.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              The Nyx platform is the core. Tutoring, mocks, and admissions services exist to amplify
              it — never as a substitute for adaptive practice.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-32 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 space-y-24 md:space-y-32">
          {featured.map(({ n, icon: Icon, label, body, href }, i) => (
            <article
              key={label}
              className={`grid md:grid-cols-12 gap-8 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="md:col-span-2 md:[direction:ltr]">
                <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-3">{n}</span>
                <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em]">Featured</span>
              </div>
              <div className="md:col-span-10 md:[direction:ltr]">
                <div className="flex items-center gap-4 mb-6">
                  <Icon size={20} className="text-[var(--accent)]" />
                  <h2
                    className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em]"
                    style={{ fontSize: "clamp(1.8rem, 3.6vw, 3rem)" }}
                  >
                    {label}
                  </h2>
                </div>
                <p className="text-[var(--text-2)] text-[16.5px] leading-[1.8] max-w-2xl mb-8">{body}</p>
                <CTA href={href} variant="ghost">Learn more</CTA>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative py-24 md:py-28 border-t border-[var(--border)]">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8">
          <div className="mb-14">
            <Eyebrow color="moon" className="mb-4">Adjacent</Eyebrow>
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.1] tracking-[-0.015em] max-w-3xl"
              style={{ fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)" }}
            >
              Other ways we work{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">with students.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 border-t border-[var(--border)]">
            {adjacent.map(({ icon: Icon, label, body }) => (
              <div key={label} className="pt-8 border-t border-[var(--border)] sm:border-t-0">
                <Icon size={18} className="text-[var(--accent)] mb-5" />
                <h3 className="text-[var(--text-1)] font-semibold text-[16px] mb-2">{label}</h3>
                <p className="text-[var(--text-2)] text-[14px] leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[540px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-8 py-20">
          <div className="max-w-xl">
            <h2
              className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] mb-7 tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              Start with the{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">diagnostic.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Forty minutes. Free. No commitment.
            </p>
            <CTA href="/apply" size="lg">Take the diagnostic</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
