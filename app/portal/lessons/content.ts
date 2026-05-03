export interface Lesson {
  id: string;
  title: string;
  tutor: string;
  durationSec: number;
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  thumbnail: string;
  /** Direct video URL when available. Falls back to a "uploading" state. */
  videoUrl?: string;
  takeaways: string[];
  transcript?: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "sat-quad-1",
    title: "Quadratics: the discriminant trick",
    tutor: "Anika, Princeton '26",
    durationSec: 280,
    skill: "Algebra & functions",
    level: "Intermediate",
    description: "A 4-minute walkthrough of when the discriminant tells you the answer faster than factoring.",
    thumbnail: "/design/lesson-quadratics.jpg",
    takeaways: [
      "Read the discriminant b² − 4ac to know how many real solutions exist.",
      "Recognize the question patterns where the answer choices give it away.",
      "Skip factoring when the question only asks for the number of solutions.",
    ],
    transcript: "When you see ax² + bx + c = 0 and the question asks 'how many solutions does this equation have', factoring is the slow path. Compute b² − 4ac instead. Positive: two real roots. Zero: one. Negative: none.",
  },
  {
    id: "sat-rw-pacing",
    title: "Reading & Writing pacing under timer",
    tutor: "Ben, Yale '25",
    durationSec: 320,
    skill: "Pacing",
    level: "Beginner",
    description: "How to budget 53 seconds per question without rushing the long-passage questions.",
    thumbnail: "/design/lesson-pacing.jpg",
    takeaways: [
      "Spend 30 seconds on short-passage questions, 70 on long-passage.",
      "Check the clock at question 12, 22, and 32.",
      "Mark-and-skip at 75 seconds — never spend 90 on one question.",
    ],
  },
  {
    id: "act-science",
    title: "ACT Science: skim the chart, skip the prose",
    tutor: "Anika, Princeton '26",
    durationSec: 240,
    skill: "ACT Science strategy",
    level: "Beginner",
    description: "Most ACT Science questions are answerable from charts alone. Here's the order.",
    thumbnail: "/design/lesson-act-science.jpg",
    takeaways: [
      "Read the question first — find the variable.",
      "Locate the chart with that variable.",
      "Only read the prose if the chart leaves the answer ambiguous.",
    ],
  },
  {
    id: "essay-hook",
    title: "Personal statement: the first sentence",
    tutor: "Daniela, Stanford '24",
    durationSec: 360,
    skill: "Admissions essays",
    level: "Advanced",
    description: "Five hooks that work, two that don't, and how to pick yours.",
    thumbnail: "/design/lesson-essay.jpg",
    takeaways: [
      "Start with sensory specificity — sight, sound, smell.",
      "Avoid 'Ever since I was a child…' and dictionary openers.",
      "The first sentence's job is to earn the second.",
    ],
  },
];
