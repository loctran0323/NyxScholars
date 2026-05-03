/**
 * Case-study fixtures. Static for now; swap with a Notion/Sanity source
 * once the editorial team starts shipping more than ~10.
 */

export interface CaseStudy {
  slug: string;
  studentName: string;
  subject: "SAT" | "ACT" | "AP" | "Admissions";
  duration: string;
  delta: { from: number; to: number };
  preview: string;
  hero: { eyebrow: string; title: string; subtitle: string };
  timeline: { week: number; milestone: string; detail: string }[];
  tutorQuote: { name: string; school: string; text: string };
  studyPlanUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "maya-1180-1520",
    studentName: "Maya",
    subject: "SAT",
    duration: "90 days",
    delta: { from: 1180, to: 1520 },
    preview: "Junior at Phillips Exeter. Stuck at 1180 across four official attempts. Hit 1520 on test day — Math up 110, R&W up 230.",
    hero: {
      eyebrow: "SAT · 90 days",
      title: "Maya: 1180 → 1520",
      subtitle: "What changed wasn't more hours — it was how she practiced.",
    },
    timeline: [
      { week: 0,  milestone: "Adaptive intake",    detail: "θ landed at -0.4 in Math, -0.7 in R&W. We targeted reading speed first." },
      { week: 2,  milestone: "Daily SR begins",    detail: "8-minute spaced-repetition deck started showing up at breakfast." },
      { week: 6,  milestone: "First mock",         detail: "Full-length practice test in our portal — 1340. Math jumped first." },
      { week: 10, milestone: "Reading inflection", detail: "She figured out the question-typing shortcut. R&W moved from 580 → 700 in three weeks." },
      { week: 12, milestone: "Test day",           detail: "1520. She wrote us the day after with two screenshots and a heart emoji." },
    ],
    tutorQuote: {
      name: "Anika S.",
      school: "Princeton '26",
      text: "Maya was already a hard worker. The unlock was a question-categorization framework we built in week three — once she could name what each question was testing, she stopped making the same five mistakes.",
    },
  },
  {
    slug: "ahmed-26-33",
    studentName: "Ahmed",
    subject: "ACT",
    duration: "16 weeks",
    delta: { from: 26, to: 33 },
    preview: "Senior, dyslexia accommodations. We rebuilt his ACT pacing first; the score followed.",
    hero: {
      eyebrow: "ACT · 16 weeks",
      title: "Ahmed: 26 → 33",
      subtitle: "Pacing first. Knowledge second.",
    },
    timeline: [
      { week: 0,  milestone: "Diagnostic",         detail: "Knowledge was strong. Pacing was the bleed — averaging 65s/question on Reading vs. the 53s budget." },
      { week: 4,  milestone: "Skim drill",         detail: "Shifted to question-first, paragraph-second reading. Reading time dropped to 51s." },
      { week: 9,  milestone: "Math fluency",       detail: "Memorized the 12 most common quadratic patterns. Math up 4 points." },
      { week: 14, milestone: "Composite climb",    detail: "Mock at 32. Confidence followed." },
      { week: 16, milestone: "Test day",           detail: "33 composite. Submitted to Stanford early." },
    ],
    tutorQuote: {
      name: "Ben H.",
      school: "Yale '25",
      text: "Ahmed had every right to stay at 26 — pacing under time pressure with dyslexia is brutal. What changed was he stopped re-reading.",
    },
  },
  {
    slug: "priya-stanford-ed",
    studentName: "Priya",
    subject: "Admissions",
    duration: "5 months",
    delta: { from: 1450, to: 1530 },
    preview: "Strong scores already; the bottleneck was her essays. We sat through 11 drafts of the personal statement.",
    hero: {
      eyebrow: "Admissions · 5 months",
      title: "Priya → Stanford ED",
      subtitle: "Eleven drafts of one essay.",
    },
    timeline: [
      { week: 0,  milestone: "List built",          detail: "Stanford ED, plus REA backup at MIT and 12 RD targets." },
      { week: 4,  milestone: "Personal statement",  detail: "Three concepts brainstormed. Pivoted to the family-restaurant angle in week five." },
      { week: 8,  milestone: "Draft 6",             detail: "Started reading like her, not like a college essay." },
      { week: 14, milestone: "Supplements",         detail: "Stanford supplements drafted in batches of three." },
      { week: 22, milestone: "ED admitted",         detail: "Phone call from her tutor at 4pm on December 15." },
    ],
    tutorQuote: {
      name: "Daniela K.",
      school: "Stanford '24",
      text: "I didn't write a sentence. I just kept asking 'why did this happen?' until her draft answered it.",
    },
  },
];
