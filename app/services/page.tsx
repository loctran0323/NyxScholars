import { Target, BookOpen, GraduationCap, Award } from "lucide-react";
import {
  Eyebrow, CTA,
  BgConstellationGrid, BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";

export const metadata = { title: "Services" };

const services = [
  {
    n: "01", icon: Target, label: "SAT", price: "$110–$130 / hr",
    body: "Digital SAT, both sections. The bulk of what we tutor. Loc and Charles teach this; so do Maya, Kenji, Nadia, and Theo. Free 30-minute trial with your matched tutor.",
    href: "/sat-act",
  },
  {
    n: "02", icon: BookOpen, label: "ACT", price: "$110–$130 / hr",
    body: "Same tutors, ACT-trained. Pacing, science section, and the ACT-specific math tricks the SAT doesn't test. Mention ACT in your intake.",
    href: "/sat-act",
  },
  {
    n: "03", icon: GraduationCap, label: "AP Subjects", price: "$120–$150 / hr",
    body: "Calculus AB/BC, Statistics, Physics 1/2/C, Chemistry, Biology, English Lang/Lit, US/World History, CS A. Tutors with 5s on the relevant exam.",
    href: "#",
  },
  {
    n: "04", icon: Award, label: "Admissions", price: "$150 / session",
    body: "Essay review, school list strategy, mock interviews. Done by current Ivy juniors and seniors who recently went through it.",
    href: "/college-admissions",
  },
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
              SAT. ACT. AP.{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">Admissions.</span>
            </h1>
            <p className="text-[var(--text-2)] text-[18px] leading-[1.7] max-w-2xl">
              Every service is delivered by the same vetted Ivy roster, online, by the session.
              No bundles. No upsell.
            </p>
            <SignatureLine width={180} className="mt-9" />
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-32 overflow-hidden">
        <BgInkWash />
        <BgFade height={120} />
        <div className="relative max-w-[1180px] mx-auto px-5 sm:px-8 space-y-20 md:space-y-24">
          {services.map(({ n, icon: Icon, label, price, body, href }, i) => (
            <article
              key={label}
              className={`grid md:grid-cols-12 gap-8 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              <div className="md:col-span-2 md:[direction:ltr]">
                <span className="block font-mono text-[var(--accent)] text-[11px] uppercase tracking-[0.24em] mb-3">{n}</span>
                <span className="block font-mono text-[var(--text-3)] text-[11px] uppercase tracking-[0.24em] mb-6">{price}</span>
                <Icon size={22} className="text-[var(--accent)]" />
              </div>
              <div className="md:col-span-10 md:[direction:ltr]">
                <h2
                  className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.015em] mb-6"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
                >
                  {label}
                </h2>
                <p className="text-[var(--text-2)] text-[16.5px] leading-[1.8] max-w-2xl mb-8">{body}</p>
                <CTA href={href} variant="ghost">Book a trial session</CTA>
              </div>
            </article>
          ))}
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
              Match with{" "}
              <span className="font-[family-name:var(--font-cormorant)] italic">a tutor.</span>
            </h2>
            <p className="text-[var(--text-2)] text-[17px] leading-[1.7] mb-10">
              Twelve-minute intake. Three matched tutors. A free trial session.
            </p>
            <CTA href="/portal/diagnostic" size="lg">Take the intake</CTA>
          </div>
        </div>
      </section>
    </div>
  );
}
