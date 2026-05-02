export type DiagnosticQuestion = {
  id: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  choices: string[];
  correct: number;
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1", skill: "Linear equations", section: "Math", difficulty: 1,
    prompt: "If 3x + 7 = 22, what is the value of x?",
    choices: ["3", "5", "7", "15"], correct: 1,
  },
  {
    id: "q2", skill: "Linear functions", section: "Math", difficulty: 5,
    prompt: "The function f is defined by f(x) = ax + b, where a and b are constants. If f(3) = 11 and f(7) = 27, what is the value of f(15)?",
    choices: ["43", "51", "59", "67"], correct: 2,
  },
  {
    id: "q3", skill: "Command of evidence", section: "Reading & Writing", difficulty: 3,
    prompt: "Which choice most logically completes the text?\n\n\"The new policy reduced average commute times by 18 minutes — a finding that ______.\"",
    choices: [
      "contradicts the central thesis of the original report.",
      "supports the claim that infrastructure investment yields measurable returns.",
      "demonstrates the importance of further longitudinal study.",
      "undermines the methodology used by the prior administration.",
    ], correct: 1,
  },
  {
    id: "q4", skill: "Quadratics", section: "Math", difficulty: 4,
    prompt: "The equation x² − 6x + k = 0 has exactly one real solution. What is the value of k?",
    choices: ["3", "6", "9", "12"], correct: 2,
  },
  {
    id: "q5", skill: "Inference", section: "Reading & Writing", difficulty: 2,
    prompt: "Based on the passage, the author would most likely agree that ______ is essential to the success of small civic institutions.",
    choices: [
      "large-scale federal funding",
      "sustained volunteer engagement",
      "centralized bureaucratic oversight",
      "strict membership requirements",
    ], correct: 1,
  },
  {
    id: "q6", skill: "Trigonometry", section: "Math", difficulty: 5,
    prompt: "In triangle ABC, angle B is a right angle, AB = 6, and BC = 8. What is the value of sin(A)?",
    choices: ["3/5", "4/5", "3/4", "4/3"], correct: 1,
  },
  {
    id: "q7", skill: "Punctuation", section: "Reading & Writing", difficulty: 2,
    prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?\n\n\"The committee's report ______ which was released yesterday, recommends three structural changes.\"",
    choices: [", ", " — ", "; ", ": "], correct: 0,
  },
  {
    id: "q8", skill: "Percentages", section: "Math", difficulty: 2,
    prompt: "A jacket originally priced at $80 is on sale for $60. By what percent has the price been reduced?",
    choices: ["15%", "20%", "25%", "33%"], correct: 2,
  },
];

export type DiagnosticAnswer = {
  qid: string;
  picked: number;
  correct: boolean;
  ms: number;
  theta: number;
  ci: number;
  skill: string;
  difficulty: number;
};

export type SkillEstimate = {
  name: string;
  section: "Math" | "R&W";
  mastery: number;
};

/** Sample post-diagnostic skill landscape — used on the results screen
 *  before the student has any real session data. */
export const POST_DIAGNOSTIC_SKILLS: SkillEstimate[] = [
  { name: "Linear equations",      section: "Math", mastery: 0.86 },
  { name: "Punctuation",           section: "R&W",  mastery: 0.81 },
  { name: "Percentages",           section: "Math", mastery: 0.74 },
  { name: "Inference",             section: "R&W",  mastery: 0.62 },
  { name: "Quadratics",            section: "Math", mastery: 0.42 },
  { name: "Trigonometry",          section: "Math", mastery: 0.18 },
  { name: "Rhetorical synthesis",  section: "R&W",  mastery: 0.24 },
];
