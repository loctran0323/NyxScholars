"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Clock, FileText, Video, PlayCircle, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MaterialType = "article" | "pdf" | "video" | "practice" | "quiz";
type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  subject: string;
  difficulty: DifficultyLevel;
  url: string;
  estimated_time: string;
}

const MATERIALS: MaterialItem[] = [
  // SAT Math
  { id: "1", title: "SAT Math: Heart of Algebra", description: "Master linear equations, inequalities, and systems. Core algebra concepts tested on every SAT.", type: "article", subject: "SAT Math", difficulty: "Beginner", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:heart-of-algebra", estimated_time: "2-3 hours" },
  { id: "2", title: "SAT Math: Problem Solving & Data", description: "Statistics, probability, and data interpretation strategies for the SAT Math section.", type: "article", subject: "SAT Math", difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:problem-solving-and-data-analysis", estimated_time: "2 hours" },
  { id: "3", title: "SAT Math: Passport to Advanced Math", description: "Quadratics, polynomials, and advanced algebra strategies — the hardest SAT Math topics.", type: "article", subject: "SAT Math", difficulty: "Advanced", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:passport-to-advanced-math", estimated_time: "3 hours" },
  { id: "4", title: "College Board Official SAT Practice", description: "Eight full-length official SAT practice tests with answer explanations from College Board.", type: "practice", subject: "SAT Math", difficulty: "Intermediate", url: "https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests", estimated_time: "3 hrs each" },
  // SAT Reading & Writing
  { id: "5", title: "SAT Reading: Evidence-Based Strategies", description: "Learn to find textual evidence quickly and eliminate wrong answer choices effectively.", type: "article", subject: "SAT Reading & Writing", difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:reading-and-writing", estimated_time: "1.5 hours" },
  { id: "6", title: "SAT Writing: Grammar Rules That Matter", description: "The 15 grammar rules College Board tests most frequently, with examples and practice.", type: "article", subject: "SAT Reading & Writing", difficulty: "Beginner", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:writing-and-language", estimated_time: "2 hours" },
  { id: "7", title: "Digital SAT Reading Question Types", description: "Understand the 5 question types on the new Digital SAT and how to approach each one.", type: "article", subject: "SAT Reading & Writing", difficulty: "Beginner", url: "https://blog.prepscholar.com/sat-reading-question-types", estimated_time: "45 minutes" },
  // ACT
  { id: "8", title: "ACT Math: Complete Strategy Guide", description: "Full breakdown of all ACT Math topics with time management tips and practice problems.", type: "article", subject: "ACT Math", difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/act-math", estimated_time: "3 hours" },
  { id: "9", title: "ACT English: 5 Rules to Know", description: "Master punctuation, grammar, and rhetoric — the three pillars of ACT English.", type: "article", subject: "ACT English", difficulty: "Beginner", url: "https://blog.prepscholar.com/act-english-tips", estimated_time: "1 hour" },
  { id: "10", title: "ACT Reading: 4 Passage Strategies", description: "Proven strategies for tackling all four passage types on the ACT Reading section.", type: "article", subject: "ACT Reading", difficulty: "Intermediate", url: "https://blog.prepscholar.com/act-reading-strategies", estimated_time: "1 hour" },
  { id: "11", title: "ACT Science: It's Not About Science", description: "The ACT Science section tests reading comprehension and data interpretation, not science knowledge.", type: "article", subject: "ACT Science", difficulty: "Beginner", url: "https://blog.prepscholar.com/act-science-tips", estimated_time: "1 hour" },
  { id: "12", title: "Official ACT Practice Tests", description: "Free official ACT practice tests from ACT, Inc. — the gold standard for preparation.", type: "practice", subject: "ACT", difficulty: "Intermediate", url: "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html", estimated_time: "2.5 hrs each" },
  // AP
  { id: "13", title: "AP Calculus AB/BC Full Course", description: "Khan Academy's complete AP Calculus course covering limits, derivatives, integrals, and series.", type: "video", subject: "AP Calculus", difficulty: "Advanced", url: "https://www.khanacademy.org/math/ap-calculus-bc", estimated_time: "40+ hours" },
  { id: "14", title: "AP Chemistry Formula Sheet", description: "All the formulas and constants you need memorized for the AP Chemistry exam.", type: "pdf", subject: "AP Chemistry", difficulty: "Intermediate", url: "https://apcentral.collegeboard.org/media/pdf/ap-chemistry-equations-constants.pdf", estimated_time: "30 minutes" },
  { id: "15", title: "AP Statistics: Crash Course", description: "The most important AP Statistics concepts covered concisely before exam day.", type: "video", subject: "AP Statistics", difficulty: "Intermediate", url: "https://www.youtube.com/watch?v=oI3hZJqXJuc", estimated_time: "2 hours" },
  // Score improvement
  { id: "16", title: "How to Score 1500+ on the SAT", description: "A student's step-by-step guide to reaching the top 5% on the SAT, with a study plan.", type: "article", subject: "SAT Strategy", difficulty: "Advanced", url: "https://blog.prepscholar.com/how-to-get-a-perfect-1600-sat-score", estimated_time: "30 minutes" },
  { id: "17", title: "ACT vs SAT: Which Should You Take?", description: "Data-driven comparison to help you decide which test gives you the better score.", type: "article", subject: "Test Strategy", difficulty: "Beginner", url: "https://blog.prepscholar.com/act-vs-sat", estimated_time: "20 minutes" },
  { id: "18", title: "Study Schedule: 3-Month SAT Plan", description: "A week-by-week SAT study plan for students with 3 months before their test date.", type: "article", subject: "SAT Strategy", difficulty: "Beginner", url: "https://blog.prepscholar.com/sat-prep-schedule-3-months", estimated_time: "15 minutes" },
  { id: "19", title: "Desmos Calculator Tricks for SAT Math", description: "Use the built-in SAT Desmos calculator to solve advanced problems faster than algebra.", type: "article", subject: "SAT Math", difficulty: "Intermediate", url: "https://www.desmos.com/calculator", estimated_time: "45 minutes" },
  { id: "20", title: "Vocabulary for SAT Reading", description: "The 500 most commonly tested vocabulary words on the SAT Reading section.", type: "article", subject: "SAT Reading & Writing", difficulty: "Beginner", url: "https://www.vocabulary.com/lists/310069", estimated_time: "Variable" },
];

const SUBJECTS = ["All", "SAT Math", "SAT Reading & Writing", "ACT Math", "ACT English", "ACT Reading", "ACT Science", "ACT", "AP Calculus", "AP Chemistry", "AP Statistics", "SAT Strategy", "Test Strategy"];
const DIFFICULTIES: ("All" | DifficultyLevel)[] = ["All", "Beginner", "Intermediate", "Advanced"];
const TYPES: ("All" | MaterialType)[] = ["All", "article", "pdf", "video", "practice", "quiz"];

const typeIcon = (type: MaterialType) => {
  switch (type) {
    case "pdf": return <FileText size={14} />;
    case "video": return <Video size={14} />;
    case "practice": return <PenTool size={14} />;
    case "quiz": return <PlayCircle size={14} />;
    default: return <BookOpen size={14} />;
  }
};

const typeLabel = (type: MaterialType) => {
  switch (type) {
    case "practice": return "Practice Test";
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

const difficultyVariant = (d: DifficultyLevel): "green" | "gold" | "red" => {
  if (d === "Beginner") return "green";
  if (d === "Advanced") return "red";
  return "gold";
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all whitespace-nowrap",
        active
          ? "bg-[#d4a853]/15 text-[#d4a853] border border-[#d4a853]/25"
          : "bg-white/[0.04] text-[#8d9ab0] border border-white/[0.07] hover:border-white/[0.14] hover:text-[#c8d0de]"
      )}
    >
      {label}
    </button>
  );
}

export default function MaterialsPage() {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | DifficultyLevel>("All");

  const filtered = MATERIALS.filter((m) => {
    const matchSubject = subjectFilter === "All" || m.subject === subjectFilter;
    const matchDifficulty = difficultyFilter === "All" || m.difficulty === difficultyFilter;
    return matchSubject && matchDifficulty;
  });

  return (
    <div>
      <div className="mb-7">
        <p className="text-[13px] text-[#4e5d72] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[#f0ece3]">Practice Materials</h1>
        <p className="text-[#8d9ab0] mt-1 text-[14px]">
          Curated SAT, ACT, and AP resources — handpicked by our Ivy League tutors.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[11px] text-[#4e5d72] font-semibold uppercase tracking-wider mb-2">Subject</p>
          <div className="flex flex-wrap gap-2">
            {["All", "SAT Math", "SAT Reading & Writing", "ACT", "AP Calculus", "AP Chemistry", "AP Statistics", "SAT Strategy", "Test Strategy"].map((s) => (
              <FilterChip key={s} label={s} active={subjectFilter === s} onClick={() => setSubjectFilter(s)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] text-[#4e5d72] font-semibold uppercase tracking-wider mb-2">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <FilterChip key={d} label={d} active={difficultyFilter === d} onClick={() => setDifficultyFilter(d)} />
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-[12px] text-[#4e5d72] mb-4">{filtered.length} resource{filtered.length !== 1 ? "s" : ""}</p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((material) => (
          <a
            key={material.id}
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 bg-[#0f1521] border border-white/[0.07] rounded-2xl hover:border-white/[0.14] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#141b2d] border border-white/[0.07] flex items-center justify-center shrink-0 text-[#8d9ab0] group-hover:text-[#d4a853] transition-colors">
              {typeIcon(material.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[13.5px] font-semibold text-[#f0ece3] leading-snug line-clamp-2 group-hover:text-[#f0ece3]">
                  {material.title}
                </p>
                <ExternalLink size={12} className="text-[#4e5d72] shrink-0 mt-0.5 group-hover:text-[#8d9ab0] transition-colors" />
              </div>
              <p className="text-[12px] text-[#8d9ab0] line-clamp-2 leading-relaxed mb-2">
                {material.description}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={difficultyVariant(material.difficulty)} size="sm">
                  {material.difficulty}
                </Badge>
                <span className="text-[11px] text-[#4e5d72] flex items-center gap-1">
                  {typeIcon(material.type)}
                  {typeLabel(material.type)}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#4e5d72]">
                  <Clock size={10} />
                  {material.estimated_time}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-[#0f1521] border border-white/[0.07] rounded-2xl">
          <BookOpen size={28} className="text-[#4e5d72] mx-auto mb-3" />
          <p className="text-[#8d9ab0]">No resources match your filters</p>
        </div>
      )}
    </div>
  );
}
