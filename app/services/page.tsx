import type { Metadata } from "next";
import Link from "next/link";
import {
  Target, BookOpen, GraduationCap, Award, ArrowRight,
  Calculator, Clock, FileText, Microscope,
  FlaskConical, Atom, BookMarked, Globe, Laptop, TrendingUp,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

export const metadata: Metadata = {
  title: "Services",
  description: "SAT, ACT, AP tutoring, and college admissions consulting from Ivy League+ mentors.",
};

const satFeatures = [
  { icon: Target,      label: "Diagnostic Review",       desc: "We map exactly where points are being lost before we do anything else." },
  { icon: Calculator,  label: "Math Strategy",           desc: "Algebra through advanced math — tested approaches that cut through confusion." },
  { icon: FileText,    label: "Reading & Writing",       desc: "Evidence-based reading and grammar rules covered with precision." },
  { icon: Clock,       label: "Time Management",         desc: "Pacing strategies so you finish every section with confidence." },
  { icon: TrendingUp,  label: "Practice Test Planning",  desc: "Structured practice with error-log review after every test." },
];

const actFeatures = [
  { icon: BookOpen,    label: "English Section",  desc: "Grammar, punctuation, and rhetoric questions addressed systematically." },
  { icon: Calculator,  label: "Math Section",     desc: "Pre-calculus content and strategic guessing techniques." },
  { icon: FileText,    label: "Reading Section",  desc: "Passage strategy and time management for the fast-paced ACT format." },
  { icon: Microscope,  label: "Science Section",  desc: "Data interpretation and passage reading — not memorization." },
  { icon: Clock,       label: "Speed & Accuracy", desc: "The ACT rewards pacing — we help you master both." },
];

const apSubjects = [
  { icon: Calculator,  name: "AP Calculus AB/BC",             tag: "Math" },
  { icon: TrendingUp,  name: "AP Statistics",                 tag: "Math" },
  { icon: Atom,        name: "AP Physics 1, 2, C",            tag: "Science" },
  { icon: FlaskConical,name: "AP Chemistry",                  tag: "Science" },
  { icon: Microscope,  name: "AP Biology",                    tag: "Science" },
  { icon: BookMarked,  name: "AP English Language & Lit",     tag: "English" },
  { icon: Globe,       name: "AP US, World & European History",tag: "History" },
  { icon: Laptop,      name: "AP Computer Science A",         tag: "CS" },
  { icon: BookOpen,    name: "Other AP Subjects",             tag: "On request" },
];

function FeatureGrid({ items }: { items: { icon: React.ElementType; label: string; desc: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ icon: Icon, label, desc }) => (
        <div key={label} className="p-5 rounded-xl border border-white/[0.07] bg-[#0f1521] hover:border-[#d4a853]/25 transition-colors">
          <Icon size={17} className="text-[#d4a853] mb-3" />
          <h3 className="text-[#f0ece3] font-semibold text-[14.5px] mb-1.5">{label}</h3>
          <p className="text-[#8d9ab0] text-[13px] leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function InquireButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold text-[13.5px] hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_4px_20px_rgba(212,168,83,0.25)] hover:shadow-[0_8px_28px_rgba(212,168,83,0.35)]"
    >
      {label} <ArrowRight size={15} />
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <div className="pt-[68px]">

      {/* Header */}
      <section className="relative py-24 px-5 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,168,83,0.14) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-5">What We Offer</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#f0ece3] leading-tight tracking-tight mb-5">
            Services built for serious students.
          </h1>
          <p className="text-[#8d9ab0] text-[16px] leading-[1.8]">
            Every service is built around 1:1 attention, clear strategy, and tutors who genuinely understand
            the process — because they just went through it.
          </p>
        </div>
      </section>

      {/* SAT */}
      <section className="py-16 bg-[#0b0f1a] border-y border-white/[0.05]" id="sat">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-11 h-11 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/15 flex items-center justify-center shrink-0">
              <Target size={20} className="text-[#d4a853]" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-bold text-[#f0ece3]">SAT Tutoring</h2>
              <p className="text-[#8d9ab0] text-[13px] mt-0.5">Math, Reading, and Writing — all three sections covered.</p>
            </div>
          </div>
          <FeatureGrid items={satFeatures} />
          <div className="mt-8"><InquireButton href="/apply?service=SAT" label="Inquire About SAT Tutoring" /></div>
        </div>
      </section>

      {/* ACT */}
      <section className="py-16 px-5 sm:px-8 max-w-7xl mx-auto" id="act">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-11 h-11 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/15 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-[#d4a853]" />
          </div>
          <div>
            <h2 className="text-[1.5rem] font-bold text-[#f0ece3]">ACT Tutoring</h2>
            <p className="text-[#8d9ab0] text-[13px] mt-0.5">Four sections, one strategy. We cover the full ACT.</p>
          </div>
        </div>
        <FeatureGrid items={actFeatures} />
        <div className="mt-8"><InquireButton href="/apply?service=ACT" label="Inquire About ACT Tutoring" /></div>
      </section>

      {/* AP */}
      <section className="py-16 bg-[#0b0f1a] border-y border-white/[0.05]" id="ap">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-11 h-11 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/15 flex items-center justify-center shrink-0">
              <GraduationCap size={20} className="text-[#d4a853]" />
            </div>
            <div>
              <h2 className="text-[1.5rem] font-bold text-[#f0ece3]">AP Tutoring</h2>
              <p className="text-[#8d9ab0] text-[13px] mt-0.5">Subject-specific support across 10+ AP courses.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
            {apSubjects.map(({ icon: Icon, name, tag }) => (
              <div key={name} className="p-4 rounded-xl border border-white/[0.07] bg-[#0f1521] hover:border-[#d4a853]/25 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={15} className="text-[#d4a853]" />
                  <span className="text-[#4e5d72] text-[10.5px] font-medium">{tag}</span>
                </div>
                <p className="text-[#c8d0de] text-[13px] font-medium leading-snug">{name}</p>
              </div>
            ))}
          </div>
          <InquireButton href="/apply?service=AP+Tutoring" label="Inquire About AP Tutoring" />
        </div>
      </section>

      {/* Admissions */}
      <section className="py-16 px-5 sm:px-8 max-w-7xl mx-auto" id="admissions">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-11 h-11 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/15 flex items-center justify-center shrink-0">
            <Award size={20} className="text-[#d4a853]" />
          </div>
          <div>
            <h2 className="text-[1.5rem] font-bold text-[#f0ece3]">College Admissions Consulting</h2>
            <p className="text-[#8d9ab0] text-[13px] mt-0.5">From students who just navigated the process firsthand.</p>
          </div>
        </div>
        <p className="text-[#8d9ab0] text-[15px] leading-[1.8] mb-8 max-w-2xl">
          Essay review, brainstorming sessions, school list strategy, and interview prep — all delivered by students
          who recently completed the full admissions process at Princeton, Harvard, Yale, MIT, Stanford, and more.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Essay Review & Feedback", desc: "Line-level notes on voice, structure, and impact — plus exactly how to fix it." },
            { label: "Brainstorming Sessions", desc: "Find the right angle for your personal statement and supplementals." },
            { label: "School List Strategy", desc: "Build a balanced, data-grounded list of reach, target, and likely schools." },
            { label: "Activity List Review", desc: "Frame your extracurriculars with the clarity and impact they deserve." },
            { label: "Interview Preparation", desc: "Mock interviews with real feedback from students who've done them." },
            { label: "Full Application Strategy", desc: "End-to-end support from first draft to final submission." },
          ].map(({ label, desc }) => (
            <div key={label} className="p-5 rounded-xl border border-white/[0.07] bg-[#0f1521] hover:border-[#d4a853]/25 transition-colors">
              <h3 className="text-[#f0ece3] font-semibold text-[14.5px] mb-1.5">{label}</h3>
              <p className="text-[#8d9ab0] text-[13px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <InquireButton href="/apply?service=College+Admissions" label="Book a Consultation" />
          <Link
            href="/college-admissions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-[#c8d0de] font-semibold text-[13.5px] hover:border-white/20 hover:bg-white/[0.04] transition-all"
          >
            Learn More <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-5 bg-[#0b0f1a] border-t border-white/[0.05]">
        <p className="text-[#d4a853] text-[11px] font-bold uppercase tracking-[0.15em] mb-4">Ready to start?</p>
        <h2 className="text-[2rem] font-bold text-[#f0ece3] mb-4 tracking-tight">Not sure which service fits?</h2>
        <p className="text-[#8d9ab0] mb-8 max-w-md mx-auto text-[15px]">Book a free 20-minute consultation and we&apos;ll help you figure out the right plan.</p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-b from-[#e0b55c] to-[#c99438] text-black font-bold hover:from-[#eac068] hover:to-[#d4a045] transition-all shadow-[0_8px_32px_rgba(212,168,83,0.3)] hover:-translate-y-0.5"
        >
          Book Free Consultation <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
