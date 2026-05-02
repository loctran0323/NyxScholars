import {
  Eyebrow, CTA,
  BgInkWash, BgFade,
} from "@/components/system";
import FAQAccordion from "@/components/shared/FAQAccordion";

export const metadata = {
  title: "FAQ",
  description: "Six things students and parents ask before booking a Nyx trial.",
};

const faqs = [
  { question: "How is the trial free?", answer: "The first 30-minute video session is on us. No card on file, no commitment. We'd rather lose the cost of a trial than charge you for a tutor who isn't the right fit." },
  { question: "How does pricing actually work?", answer: "$160/hr pay-as-you-go for single sessions. Or commit to two hours a week for 4 / 8 / 12 weeks at $150 / $140 / $130 per hour respectively. Admissions consulting is $150 per session, available on any package." },
  { question: "Who are the tutors?", answer: "Currently enrolled undergraduates at Princeton, Harvard, Yale, MIT, Stanford, Columbia, or peer schools — every one with a verified 1500+ digital SAT, a 30-minute teaching audition with the founders, and a trial cohort with founder shadowing on the first session. We don't list names publicly; you meet your matched tutor at the trial." },
  { question: "What if it isn't a fit?", answer: "Tell us within 24 hours of your trial and we'll re-match you, free. We'd rather have you with a tutor you click with than churn you." },
  { question: "Can I cancel?", answer: "Single sessions: cancel up to 12 hours before for a full refund. Cadences: refundable until you're halfway through. After that we'll move unused sessions to a friend or roll them into your next cadence." },
  { question: "Online or in person?", answer: "Online — every session is over our video room with a shared whiteboard. We don't run in-person sessions; that's a big part of how we keep prices honest." },
];

export default function FaqPage() {
  return (
    <div className="relative">
      <section className="relative pt-[120px] md:pt-[160px] pb-12 overflow-hidden">
        <BgInkWash />
        <BgFade top={false} bottom height={120} />
        <div className="relative max-w-[800px] mx-auto px-5 sm:px-8">
          <Eyebrow color="brass" className="mb-6">FAQ</Eyebrow>
          <h1
            className="font-[family-name:var(--font-fraunces)] font-light text-[var(--text-1)] leading-[1.0] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
          >
            Six things people ask.
          </h1>
        </div>
      </section>

      <section className="relative pb-16 md:pb-20">
        <div className="max-w-[800px] mx-auto px-5 sm:px-8">
          <div className="bg-[#0c1124]/70 backdrop-blur-sm border border-[var(--border)] rounded-[14px] px-5 sm:px-8 py-2">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-24 border-t border-[var(--border)] pt-12">
        <div className="max-w-[800px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <p
            className="font-[family-name:var(--font-fraunces)] italic text-[var(--text-2)] leading-[1.4]"
            style={{ fontSize: 17 }}
          >
            Anything else? The trial is the fastest way to find out.
          </p>
          <CTA href="/match" size="default">Get matched</CTA>
        </div>
      </section>
    </div>
  );
}
