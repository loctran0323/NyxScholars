import {
  Eyebrow, CTA,
  BgInkWash, BgCrescentMoon, BgFade,
  SignatureLine,
} from "@/components/system";
import FAQAccordion from "@/components/shared/FAQAccordion";

export const metadata = {
  title: "FAQ",
  description: "Common questions about Nyx — tutoring, vetting, scheduling, packages, and how the trial works.",
};

const faqs = [
  { question: "Who are the tutors?", answer: "Current undergraduates at Princeton, Harvard, Yale, MIT, Stanford, or Columbia who scored 1500+ on the digital SAT and passed our teaching audition. We accept fewer than 8% of applicants." },
  { question: "How is the trial free?", answer: "Your first 30-minute video session is on us. No card on file, no commitment. We'd rather lose the cost of a trial than charge you for a tutor who isn't the right fit." },
  { question: "What if my tutor isn't a fit?", answer: "Tell us within 24 hours of your trial and we'll re-match you, free. We'd rather have you with a tutor you click with than churn you." },
  { question: "How does pricing work?", answer: "Pay-as-you-go: $110–$130 per 60-minute session, depending on the tutor. Cadence (8-pack): roughly 15% off and weekly assignments included. Admissions: $150/session. No surprise bundles." },
  { question: "Online or in person?", answer: "Online — every session is over our video room with a shared whiteboard. We don't run in-person sessions; that's a big part of how we keep prices down." },
  { question: "Can I switch tutors mid-package?", answer: "Yes. Tell us and we'll move your remaining sessions to a different tutor with no penalty." },
  { question: "Do you guarantee score increases?", answer: "No. We commit to vetted tutors, transparent pricing, and the right to walk away after any session. Outcomes are yours." },
  { question: "Do you do AP subjects?", answer: "Yes — Calc AB/BC, Statistics, Physics 1/2/C, Chemistry, Biology, English Lang/Lit, US/World/European History, CS A, and a few others. Tutors who scored 5 on the relevant exam." },
  { question: "Admissions consulting?", answer: "Yes — essays, school lists, mock interviews. $150 per session, available on any package. Done by Ivy juniors and seniors." },
  { question: "Can parents join?", answer: "The trial, yes. Regular sessions, generally no — we want students owning the relationship with their tutor. Parents see scheduling, billing, and progress notes in their own portal view." },
  { question: "Cancellation policy?", answer: "Single sessions: cancel up to 12 hours before for a full refund. Cadence packs: any unused session can be refunded if you decide tutoring isn't for you." },
  { question: "Where does the name come from?", answer: "Nyx is the Greek goddess of night. Per noctem ad lucem — through night to light. We tutor the studious side of late evenings." },
];

export default function FaqPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative pt-[120px] md:pt-[160px] pb-20 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <Eyebrow color="brass" className="mb-6 mx-auto">FAQ</Eyebrow>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] tracking-[-0.02em] mb-8 mx-auto"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            Questions,{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">plainly answered.</span>
          </h1>
          <p className="text-[var(--text-2)] text-[17px] leading-[1.7]">
            If something here doesn&apos;t cover your case, the trial is free.
          </p>
          <SignatureLine width={180} className="mt-10 mx-auto" />
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
          <div className="bg-[#0c1124]/70 backdrop-blur-sm border border-[var(--border)] rounded-[20px] px-6 sm:px-10 py-2">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        <BgCrescentMoon position="upper-right" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(7,9,20,0.7) 0%, rgba(7,9,20,0.4) 35%, transparent 60%)" }}
        />
        <BgFade height={120} />
        <div className="relative max-w-2xl mx-auto px-5 text-center">
          <h2
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.05] mb-6 tracking-[-0.015em]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
          >
            Still have a{" "}
            <span className="font-[family-name:var(--font-cormorant)] italic">question?</span>
          </h2>
          <p className="text-[var(--text-2)] text-[16px] leading-[1.7] mb-10">
            The trial is the fastest answer. No commitment.
          </p>
          <CTA href="/apply" size="lg">Book free trial</CTA>
        </div>
      </section>
    </div>
  );
}
