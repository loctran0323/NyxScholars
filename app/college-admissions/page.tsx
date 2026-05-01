import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Award, FileText, Lightbulb, List, MessageSquare,
  CheckCircle2, Users, Star, BookOpen,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export const metadata: Metadata = {
  title: "College Admissions Consulting",
  description: "Essay review, brainstorming, school list strategy, and interview prep from students who just navigated the process at top universities.",
};

const offerings = [
  {
    icon: FileText,
    title: "Essay Review & Feedback",
    desc: "Full read-through with line-level notes on voice, structure, and impact. We tell you what's working, what isn't, and exactly how to fix it.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorming Sessions",
    desc: "Stuck on what to write about? We help you find the right angle — the story that's actually yours and makes the reader remember you.",
  },
  {
    icon: List,
    title: "School List Strategy",
    desc: "Build a balanced list grounded in real data — reach, target, and likely schools that genuinely fit your profile, stats, and goals.",
  },
  {
    icon: BookOpen,
    title: "Activity List Review",
    desc: "How you frame your extracurriculars matters as much as what you did. We help you present your activities with clarity and impact.",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    desc: "Mock interviews with real feedback on answers, delivery, and follow-up questions. We've done these interviews — we know what they ask.",
  },
  {
    icon: Award,
    title: "Full Application Strategy",
    desc: "End-to-end support through every part of your application: essays, supplements, activities, recommendations, and school-specific strategy.",
  },
];

const whyNyx = [
  "We recently went through the process — at schools like Princeton, Harvard, Yale, MIT, Stanford",
  "No recycled advice from books published 10 years ago",
  "Supplemental essays covered — we know each school's specific prompts",
  "Honest feedback, not validation — we'll tell you what needs work",
  "Small cohort — your consultant actually knows your application",
];

const goodFit = [
  "Rising seniors who want to start essays over the summer",
  "Students unsure how to build a compelling narrative",
  "Applicants who want someone who's done this recently to read their work",
  "Students building a school list and unsure how to balance reach vs. target",
  "Anyone who wants honest, specific feedback — not generic praise",
];

export default function CollegeAdmissionsPage() {
  return (
    <div className="pt-[68px]">

      {/* Hero */}
      <section className="relative py-24 px-5 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.15) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5 gold-line">College Admissions Consulting</p>
            <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-6">
              Advice from people who just got in.
            </h1>
            <p className="text-[17px] text-[#8d9ab0] leading-[1.8] mb-10">
              Not a college counselor. Not a book. Students who went through the exact same process last year —
              and can tell you what actually worked, from personal experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/apply?service=College+Admissions"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5"
              >
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-[#c8d0de] font-semibold hover:border-white/20 hover:bg-white/[0.04] transition-all"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nyx */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader
            eyebrow="Why It's Different"
            title="Recent students. Real experience."
            subtitle="College counselors at school have 400 students. Generic consultants read playbooks. Our team went through top-school admissions last year — and remembers exactly what worked."
            className="mb-12 max-w-2xl"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl border border-white/[0.07] bg-[#0f1521]">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#4e5d72]">The problem</p>
              <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">Outdated advice</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">Counselors and books give advice based on what worked years ago. The Common App evolves. School priorities shift. Your consultant needs to be current.</p>
            </div>
            <div className="p-6 rounded-xl border border-white/[0.07] bg-[#0f1521]">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#4e5d72]">The problem</p>
              <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">Generic feedback</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">"Great essay, very moving" doesn't help you. You need someone who'll tell you what's too vague, what's cliché, and exactly how to reframe it.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#d4a853]/25 bg-[#d4a853]/[0.04]">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3 text-[#d4a853]">Our approach</p>
              <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">Firsthand knowledge</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">We wrote these essays. We did these interviews. We know what the supplementals at each school are actually asking — and what makes a response stand out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Services"
          title="What we can help with."
          subtitle="From a single essay read to full application strategy — pick what you need."
          centered
          className="mb-12"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offerings.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-white/[0.07] bg-[#0f1521] hover:border-[#d4a853]/25 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/10 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#d4a853]" />
              </div>
              <h3 className="text-[#f0ece3] font-semibold mb-2 text-[15px]">{title}</h3>
              <p className="text-[#8d9ab0] text-[13.5px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Nyx list */}
      <section className="py-20 bg-[#0b0f1a] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <SectionHeader
              eyebrow="Why Nyx Scholars"
              title="What makes us different."
              subtitle="We're not a consulting firm. We're students who just did this — and can tell you what actually works."
            />
            <div className="space-y-3">
              {whyNyx.map((item) => (
                <div key={item} className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d4a853]/15 bg-[#d4a853]/[0.04]">
                  <CheckCircle2 size={15} className="text-[#d4a853] shrink-0 mt-0.5" />
                  <p className="text-[#c8d0de] text-[13.5px] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Good fit */}
      <section className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <SectionHeader
            eyebrow="Good Fit For"
            title="Is this right for you?"
            subtitle="Admissions consulting works best when you're ready to put in the work — and want a real reader who'll push back when the essay isn't there yet."
          />
          <div className="space-y-3">
            {goodFit.map((item) => (
              <div key={item} className="flex items-start gap-3.5 p-4 rounded-xl border border-white/[0.07] bg-[#0f1521]">
                <Star size={14} className="text-[#d4a853] shrink-0 mt-0.5" />
                <p className="text-[#c8d0de] text-[13.5px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5 bg-[#0b0f1a] border-t border-white/[0.05]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users size={14} className="text-[#d4a853]" />
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em]">Limited Availability</p>
        </div>
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Start with a free conversation.</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">
          We work with a small number of students each cycle. Book a free 20-minute call to see if we&apos;re the right fit.
        </p>
        <Link
          href="/apply?service=College+Admissions"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5"
        >
          Book Free Consultation <ArrowRight size={16} />
        </Link>
        <p className="mt-6 text-[#4e5d72] text-[12px]">Nyx Scholars does not guarantee admissions outcomes.</p>
      </section>
    </div>
  );
}
