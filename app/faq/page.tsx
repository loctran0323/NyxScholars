import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FAQAccordion from "@/components/shared/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about Nyx Scholars tutoring, tutors, pricing, and the consultation process.",
};

const faqs = [
  {
    question: "Who are the tutors?",
    answer: "Nyx Scholars tutors are current students at Ivy League and top-tier universities including Princeton, Harvard, Yale, MIT, Columbia, and Stanford. They're selected for academic track record, recent test experience, and their ability to communicate clearly — not just their scores.",
  },
  {
    question: "Do you guarantee score increases?",
    answer: "No. Nyx Scholars does not guarantee test score increases or admissions outcomes. Results depend on student effort, prep time, and starting baseline. What we do provide is structured, high-quality tutoring from knowledgeable mentors who care about your progress.",
  },
  {
    question: "Is tutoring online or in person?",
    answer: "Most sessions are online via video call, which allows for flexible scheduling and access to tutors anywhere. In-person options may be available in select areas — mention your preference during the consultation.",
  },
  {
    question: "Do you help with AP classes?",
    answer: "Yes. We offer tutoring for 10+ AP subjects including AP Calculus AB/BC, Statistics, Physics (1, 2, C), Chemistry, Biology, English Language and Literature, US History, World History, Computer Science A, and others. Mention your specific subject in your inquiry.",
  },
  {
    question: "Do you offer college essay help?",
    answer: "College admissions consulting — including essay review and application strategy — is coming soon. Submit an inquiry and select 'College Admissions Consulting' to join the waitlist.",
  },
  {
    question: "How does matching work?",
    answer: "After you submit an inquiry, we schedule a free 20-minute consultation to understand your goals, subject area, schedule, and learning style. Based on that, we match you with a tutor who has relevant experience and available time that fits your needs.",
  },
  {
    question: "How much does tutoring cost?",
    answer: "Pricing depends on subject, tutor, and prep intensity. We discuss pricing during the free consultation so we can recommend an option that fits your goals and schedule — before anything starts.",
  },
  {
    question: "Can parents join the consultation?",
    answer: "Absolutely. We encourage parents and guardians to join the free consultation. It helps everyone get on the same page about goals, expectations, and scheduling before prep begins.",
  },
];

export default function FAQPage() {
  return (
    <div className="pt-[68px]">

      {/* Header */}
      <section className="relative py-24 px-5 sm:px-8">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 60%)" }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">FAQ</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-5">
            Common questions, clear answers.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8]">
            Everything you need to know before booking your free consultation.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="pb-24 px-5 sm:px-8 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0f1521] px-6 sm:px-8">
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 bg-[#0b0f1a] border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h3 className="text-[1.3rem] font-bold text-[#f0ece3] mb-3 tracking-tight">Still have a question?</h3>
          <p className="text-[#8d9ab0] mb-8 text-[15px]">The fastest way to get answers is to book a free consultation. No commitment required.</p>
          <Link href="/apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5">
            Book Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
