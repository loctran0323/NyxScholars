"use client";

import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, FileText, Video, PenTool, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Profile, PlanType } from "@/types/portal";

type MaterialType = "article" | "pdf" | "video" | "practice" | "quiz";
type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
type SubjectCategory = "SAT" | "ACT" | "AP" | "College Admissions" | "Strategy";

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  subject: string;
  category: SubjectCategory;
  difficulty: DifficultyLevel;
  url: string;
  estimated_time: string;
}

const MATERIALS: MaterialItem[] = [
  // SAT Math
  { id: "1",  title: "SAT Math: Heart of Algebra",          description: "Master linear equations, inequalities, and systems. Core algebra tested on every SAT.",             type: "article",  subject: "SAT Math",             category: "SAT",              difficulty: "Beginner",     url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:heart-of-algebra",                                                                estimated_time: "2–3 hours" },
  { id: "2",  title: "SAT Math: Problem Solving & Data",    description: "Statistics, probability, and data interpretation strategies for the SAT Math section.",             type: "article",  subject: "SAT Math",             category: "SAT",              difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:problem-solving-and-data-analysis",                                            estimated_time: "2 hours" },
  { id: "3",  title: "SAT Math: Passport to Advanced Math", description: "Quadratics, polynomials, and advanced algebra — the hardest SAT Math topics.",                      type: "article",  subject: "SAT Math",             category: "SAT",              difficulty: "Advanced",     url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:passport-to-advanced-math",                                                    estimated_time: "3 hours" },
  { id: "4",  title: "Official SAT Practice Tests",         description: "Eight full-length official SAT practice tests with answer explanations from College Board.",         type: "practice", subject: "SAT Math",             category: "SAT",              difficulty: "Intermediate", url: "https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests",                                                                  estimated_time: "3 hrs each" },
  { id: "19", title: "Desmos Calculator Tricks for SAT",    description: "Use the built-in SAT Desmos calculator to solve advanced problems faster than algebra.",            type: "article",  subject: "SAT Math",             category: "SAT",              difficulty: "Intermediate", url: "https://www.desmos.com/calculator",                                                                                                          estimated_time: "45 min" },
  // SAT Reading & Writing
  { id: "5",  title: "SAT Reading: Evidence-Based Strategies", description: "Find textual evidence quickly and eliminate wrong answers effectively.",                         type: "article",  subject: "SAT Reading & Writing", category: "SAT",             difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:reading-and-writing",                                                           estimated_time: "1.5 hours" },
  { id: "6",  title: "SAT Writing: Grammar Rules That Matter", description: "The 15 grammar rules College Board tests most frequently, with examples and practice.",          type: "article",  subject: "SAT Reading & Writing", category: "SAT",             difficulty: "Beginner",     url: "https://www.khanacademy.org/test-prep/sat/x0a8c2e5f3a9191e3:writing-and-language",                                                          estimated_time: "2 hours" },
  { id: "7",  title: "Digital SAT Reading Question Types",  description: "Understand the 5 question types on the new Digital SAT and how to approach each.",                  type: "article",  subject: "SAT Reading & Writing", category: "SAT",             difficulty: "Beginner",     url: "https://blog.prepscholar.com/sat-reading-question-types",                                                                                    estimated_time: "45 min" },
  { id: "20", title: "Vocabulary for SAT Reading",          description: "The 500 most commonly tested vocabulary words on the SAT Reading section.",                         type: "article",  subject: "SAT Reading & Writing", category: "SAT",             difficulty: "Beginner",     url: "https://www.vocabulary.com/lists/310069",                                                                                                    estimated_time: "Variable" },
  // ACT
  { id: "8",  title: "ACT Math: Complete Strategy Guide",   description: "Full breakdown of all ACT Math topics with time management tips and practice problems.",            type: "article",  subject: "ACT Math",             category: "ACT",              difficulty: "Intermediate", url: "https://www.khanacademy.org/test-prep/act-math",                                                                                             estimated_time: "3 hours" },
  { id: "9",  title: "ACT English: 5 Rules to Know",        description: "Master punctuation, grammar, and rhetoric — the three pillars of ACT English.",                    type: "article",  subject: "ACT English",          category: "ACT",              difficulty: "Beginner",     url: "https://blog.prepscholar.com/act-english-tips",                                                                                              estimated_time: "1 hour" },
  { id: "10", title: "ACT Reading: 4 Passage Strategies",   description: "Proven strategies for all four passage types on the ACT Reading section.",                         type: "article",  subject: "ACT Reading",          category: "ACT",              difficulty: "Intermediate", url: "https://blog.prepscholar.com/act-reading-strategies",                                                                                        estimated_time: "1 hour" },
  { id: "11", title: "ACT Science: It's Not About Science", description: "ACT Science tests data interpretation and reading comprehension, not memorized facts.",             type: "article",  subject: "ACT Science",          category: "ACT",              difficulty: "Beginner",     url: "https://blog.prepscholar.com/act-science-tips",                                                                                              estimated_time: "1 hour" },
  { id: "12", title: "Official ACT Practice Tests",         description: "Free official ACT practice tests from ACT, Inc. — the gold standard for prep.",                    type: "practice", subject: "ACT",                  category: "ACT",              difficulty: "Intermediate", url: "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/free-act-test-prep.html",                                   estimated_time: "2.5 hrs each" },
  // AP
  { id: "13", title: "AP Calculus AB/BC Full Course",       description: "Khan Academy's complete AP Calculus course: limits, derivatives, integrals, and series.",           type: "video",    subject: "AP Calculus",          category: "AP",               difficulty: "Advanced",     url: "https://www.khanacademy.org/math/ap-calculus-bc",                                                                                            estimated_time: "40+ hours" },
  { id: "14", title: "AP Chemistry Formula Sheet",          description: "All formulas and constants you need for the AP Chemistry exam.",                                    type: "pdf",      subject: "AP Chemistry",         category: "AP",               difficulty: "Intermediate", url: "https://apcentral.collegeboard.org/media/pdf/ap-chemistry-equations-constants.pdf",                                                           estimated_time: "30 min" },
  { id: "15", title: "AP Statistics: Crash Course",         description: "The most important AP Statistics concepts covered concisely before exam day.",                      type: "video",    subject: "AP Statistics",        category: "AP",               difficulty: "Intermediate", url: "https://www.youtube.com/watch?v=oI3hZJqXJuc",                                                                                               estimated_time: "2 hours" },
  // Strategy
  { id: "16", title: "How to Score 1500+ on the SAT",       description: "A step-by-step guide to reaching the top 5% on the SAT, with a full study plan.",                  type: "article",  subject: "SAT Strategy",         category: "Strategy",         difficulty: "Advanced",     url: "https://blog.prepscholar.com/how-to-get-a-perfect-1600-sat-score",                                                                           estimated_time: "30 min" },
  { id: "17", title: "ACT vs SAT: Which Should You Take?",  description: "Data-driven comparison to help you decide which test gives you the better score.",                  type: "article",  subject: "Test Strategy",        category: "Strategy",         difficulty: "Beginner",     url: "https://blog.prepscholar.com/act-vs-sat",                                                                                                    estimated_time: "20 min" },
  { id: "18", title: "Study Schedule: 3-Month SAT Plan",    description: "A week-by-week SAT study plan for students with 3 months until their test date.",                   type: "article",  subject: "SAT Strategy",         category: "Strategy",         difficulty: "Beginner",     url: "https://blog.prepscholar.com/sat-prep-schedule-3-months",                                                                                    estimated_time: "15 min" },
  // College Admissions
  { id: "21", title: "How to Write the Common App Essay",   description: "What admissions officers actually look for — with annotated examples of essays that worked.",       type: "article",  subject: "College Essays",       category: "College Admissions", difficulty: "Intermediate", url: "https://blog.prepscholar.com/common-app-essay-prompts",                                                                                      estimated_time: "1 hour" },
  { id: "22", title: "Building Your College List",          description: "A data-driven framework for building a balanced list of reach, target, and likely schools.",        type: "article",  subject: "School Strategy",      category: "College Admissions", difficulty: "Beginner",     url: "https://blog.prepscholar.com/how-many-colleges-should-i-apply-to",                                                                           estimated_time: "30 min" },
  { id: "23", title: "College Application Timeline",        description: "Month-by-month senior year checklist — from summer prep to decision day.",                         type: "article",  subject: "School Strategy",      category: "College Admissions", difficulty: "Beginner",     url: "https://blog.prepscholar.com/college-application-timeline",                                                                                  estimated_time: "20 min" },
  { id: "24", title: "How to Write Supplemental Essays",    description: "School-specific supplements demystified: why schools ask, what they want, and how to stand out.",   type: "article",  subject: "College Essays",       category: "College Admissions", difficulty: "Advanced",     url: "https://blog.prepscholar.com/college-supplemental-essays",                                                                                   estimated_time: "1 hour" },
  { id: "25", title: "College Interview Prep Guide",        description: "The most common interview questions, frameworks for answering them, and what to avoid.",            type: "article",  subject: "Interviews",           category: "College Admissions", difficulty: "Intermediate", url: "https://blog.prepscholar.com/college-interview-tips",                                                                                        estimated_time: "45 min" },
];

function getAllowedCategories(plan: PlanType | null, planSubject: string | null, addons: string[] | null): SubjectCategory[] {
  const hasCounseling = plan === "counseling" || addons?.includes("counseling");

  if (plan === "session") {
    switch (planSubject) {
      case "SAT":               return ["SAT", "Strategy"];
      case "ACT":               return ["ACT", "Strategy"];
      case "AP":                return ["AP", "Strategy"];
      case "College Admissions":return ["College Admissions"];
      default:                  return ["SAT", "ACT", "AP", "Strategy"];
    }
  }
  if (plan === "monthly") {
    const cats: SubjectCategory[] = ["SAT", "ACT", "AP", "Strategy"];
    if (hasCounseling) cats.push("College Admissions");
    return cats;
  }
  if (plan === "counseling") {
    return ["College Admissions", "SAT", "ACT", "AP", "Strategy"];
  }
  return ["SAT", "ACT", "AP", "Strategy"];
}

const DIFFICULTIES: ("All" | DifficultyLevel)[] = ["All", "Beginner", "Intermediate", "Advanced"];

const typeIcon = (type: MaterialType) => {
  switch (type) {
    case "pdf":      return <FileText size={14} />;
    case "video":    return <Video size={14} />;
    case "practice": return <PenTool size={14} />;
    case "quiz":     return <PlayCircle size={14} />;
    default:         return <BookOpen size={14} />;
  }
};
const typeLabel = (type: MaterialType) => type === "practice" ? "Practice Test" : type.charAt(0).toUpperCase() + type.slice(1);
const difficultyVariant = (d: DifficultyLevel): "green" | "gold" | "red" => d === "Beginner" ? "green" : d === "Advanced" ? "red" : "gold";

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all whitespace-nowrap",
      active ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--border-accent)]" : "bg-white/[0.04] text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--border-2)] hover:text-[var(--text-1)]"
    )}>
      {label}
    </button>
  );
}

export default function MaterialsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"All" | SubjectCategory>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | DifficultyLevel>("All");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(async (authRes: { data: { user: { id: string } | null } }) => {
      const user = authRes.data.user;
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as Profile);
    });
  }, []);

  const allowedCats = getAllowedCategories(profile?.plan ?? null, profile?.plan_subject ?? null, profile?.plan_addons ?? null);
  const visibleMaterials = MATERIALS.filter((m) => allowedCats.includes(m.category));

  const filtered = visibleMaterials.filter((m) => {
    const matchCat  = categoryFilter === "All" || m.category === categoryFilter;
    const matchDiff = difficultyFilter === "All" || m.difficulty === difficultyFilter;
    return matchCat && matchDiff;
  });

  const availableCats: ("All" | SubjectCategory)[] = ["All", ...allowedCats.filter((c, i, a) => a.indexOf(c) === i)];

  return (
    <div>
      <div className="mb-7">
        <p className="text-[13px] text-[var(--text-3)] uppercase tracking-wider font-semibold mb-1">Portal</p>
        <h1 className="text-[26px] font-bold text-[var(--text-1)]">Practice Materials</h1>
        <p className="text-[var(--text-2)] mt-1 text-[14px]">
          Curated resources — handpicked by your Nyx founders.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            {availableCats.map((c) => (
              <FilterChip key={c} label={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] text-[var(--text-3)] font-semibold uppercase tracking-wider mb-2">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <FilterChip key={d} label={d} active={difficultyFilter === d} onClick={() => setDifficultyFilter(d)} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-[12px] text-[var(--text-3)] mb-4">{filtered.length} resource{filtered.length !== 1 ? "s" : ""}</p>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((material) => (
          <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer"
            className="flex gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--border-2)] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--text-2)] group-hover:text-[var(--accent)] transition-colors">
              {typeIcon(material.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[13.5px] font-semibold text-[var(--text-1)] leading-snug line-clamp-2">{material.title}</p>
                <ExternalLink size={12} className="text-[var(--text-3)] shrink-0 mt-0.5 group-hover:text-[var(--text-2)] transition-colors" />
              </div>
              <p className="text-[12px] text-[var(--text-2)] line-clamp-2 leading-relaxed mb-2">{material.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={difficultyVariant(material.difficulty)} size="sm">{material.difficulty}</Badge>
                <span className="text-[11px] text-[var(--text-3)] flex items-center gap-1">{typeIcon(material.type)}{typeLabel(material.type)}</span>
                <span className="text-[11px] text-[var(--text-3)]">· {material.estimated_time}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
