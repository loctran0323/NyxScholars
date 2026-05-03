/**
 * Seed 50 starter SAT-aligned questions into diagnostic_questions as drafts.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-questions.ts
 *
 * (NEXT_PUBLIC_SUPABASE_URL also accepted in place of SUPABASE_URL.)
 *
 * Idempotent — matches by external_key. Re-running is safe.
 * All items land as status='draft'. Use /admin/questions to review and publish.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

interface SeedItem {
  external_key: string;
  skill_id: string;
  skill_name: string;
  section: "Math" | "Reading & Writing";
  difficulty: number;
  prompt: string;
  choices: string[];
  correct_index: number;
  rationale: string;
}

const ITEMS: SeedItem[] = [
  // ── Algebra · lin-eq (Linear equations) ──────────────────────────────────
  {
    external_key: "seed-2026-05-lin-eq-1",
    skill_id: "lin-eq",
    skill_name: "Linear equations",
    section: "Math",
    difficulty: 2,
    prompt: "If 3x + 7 = 22, what is the value of x?",
    choices: ["3", "5", "7", "15"],
    correct_index: 1,
    rationale: "Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.",
  },
  {
    external_key: "seed-2026-05-lin-eq-2",
    skill_id: "lin-eq",
    skill_name: "Linear equations",
    section: "Math",
    difficulty: 3,
    prompt: "The equation 4(x − 2) = 2x + 6 has what solution?",
    choices: ["x = 1", "x = 7", "x = 4", "x = 14"],
    correct_index: 1,
    rationale: "Distribute: 4x − 8 = 2x + 6. Subtract 2x: 2x − 8 = 6. Add 8: 2x = 14. So x = 7.",
  },
  {
    external_key: "seed-2026-05-lin-eq-3",
    skill_id: "lin-eq",
    skill_name: "Linear equations",
    section: "Math",
    difficulty: 4,
    prompt: "If (x + 5) / 3 = (2x − 1) / 4, what is the value of x?",
    choices: ["−23/2", "3", "23/2", "23"],
    correct_index: 2,
    rationale:
      "Cross-multiply: 4(x + 5) = 3(2x − 1) → 4x + 20 = 6x − 3 → 23 = 2x → x = 23/2.",
  },

  // ── Algebra · lin-sys (Systems of equations) ─────────────────────────────
  {
    external_key: "seed-2026-05-lin-sys-1",
    skill_id: "lin-sys",
    skill_name: "Systems of equations",
    section: "Math",
    difficulty: 2,
    prompt: "What is the value of y in the system?  x + y = 10  and  x − y = 2",
    choices: ["3", "4", "5", "6"],
    correct_index: 1,
    rationale: "Add the two equations: 2x = 12, so x = 6. Substitute: 6 + y = 10, y = 4.",
  },
  {
    external_key: "seed-2026-05-lin-sys-2",
    skill_id: "lin-sys",
    skill_name: "Systems of equations",
    section: "Math",
    difficulty: 4,
    prompt:
      "A coffee shop sells small cups for $3 and large cups for $5. On Monday they sold 80 cups for $304. How many large cups did they sell?",
    choices: ["32", "48", "52", "60"],
    correct_index: 0,
    rationale:
      "Let s + l = 80 and 3s + 5l = 304. Substitute s = 80 − l: 3(80 − l) + 5l = 304 → 240 + 2l = 304 → l = 32.",
  },

  // ── Algebra · lin-ineq (Linear inequalities) ─────────────────────────────
  {
    external_key: "seed-2026-05-lin-ineq-1",
    skill_id: "lin-ineq",
    skill_name: "Linear inequalities",
    section: "Math",
    difficulty: 2,
    prompt: "Which value of x satisfies 2x − 3 > 7?",
    choices: ["x = 4", "x = 5", "x = 6", "x = 3"],
    correct_index: 2,
    rationale: "Add 3: 2x > 10. Divide by 2: x > 5. Among the choices only x = 6 is greater than 5.",
  },

  // ── Algebra · lin-fn (Linear functions) ──────────────────────────────────
  {
    external_key: "seed-2026-05-lin-fn-1",
    skill_id: "lin-fn",
    skill_name: "Linear functions",
    section: "Math",
    difficulty: 3,
    prompt:
      "A line passes through the points (1, 4) and (3, 10). What is the slope of the line?",
    choices: ["2", "3", "4", "6"],
    correct_index: 1,
    rationale: "Slope = (10 − 4) / (3 − 1) = 6 / 2 = 3.",
  },
  {
    external_key: "seed-2026-05-lin-fn-2",
    skill_id: "lin-fn",
    skill_name: "Linear functions",
    section: "Math",
    difficulty: 3,
    prompt:
      "The function f is defined by f(x) = −2x + 11. For what value of x does f(x) = 3?",
    choices: ["−4", "4", "−7", "7"],
    correct_index: 1,
    rationale: "Set −2x + 11 = 3. Subtract 11: −2x = −8. Divide by −2: x = 4.",
  },

  // ── Algebra · abs-val (Absolute value) ───────────────────────────────────
  {
    external_key: "seed-2026-05-abs-val-1",
    skill_id: "abs-val",
    skill_name: "Absolute value",
    section: "Math",
    difficulty: 3,
    prompt: "How many real solutions does |2x − 3| = 7 have, and what are they?",
    choices: [
      "One solution: x = 5",
      "Two solutions: x = 5 and x = −2",
      "Two solutions: x = 5 and x = 2",
      "No real solutions",
    ],
    correct_index: 1,
    rationale:
      "|2x − 3| = 7 means 2x − 3 = 7 or 2x − 3 = −7. The first gives x = 5; the second gives x = −2.",
  },

  // ── Adv Math · quad (Quadratics) ─────────────────────────────────────────
  {
    external_key: "seed-2026-05-quad-1",
    skill_id: "quad",
    skill_name: "Quadratics",
    section: "Math",
    difficulty: 3,
    prompt: "What are the solutions to x² − 5x + 6 = 0?",
    choices: ["x = 2 or x = 3", "x = −2 or x = −3", "x = 1 or x = 6", "x = 5 or x = 6"],
    correct_index: 0,
    rationale: "Factor: (x − 2)(x − 3) = 0. So x = 2 or x = 3.",
  },
  {
    external_key: "seed-2026-05-quad-2",
    skill_id: "quad",
    skill_name: "Quadratics",
    section: "Math",
    difficulty: 4,
    prompt: "The quadratic x² + bx + 16 = 0 has exactly one real solution. What is the value of b² ?",
    choices: ["8", "16", "32", "64"],
    correct_index: 3,
    rationale:
      "One real solution means the discriminant is zero: b² − 4(1)(16) = 0, so b² = 64.",
  },
  {
    external_key: "seed-2026-05-quad-3",
    skill_id: "quad",
    skill_name: "Quadratics",
    section: "Math",
    difficulty: 3,
    prompt: "What is the vertex of the parabola y = (x − 4)² + 1?",
    choices: ["(−4, 1)", "(4, 1)", "(4, −1)", "(1, 4)"],
    correct_index: 1,
    rationale: "Vertex form y = (x − h)² + k has vertex (h, k). Here h = 4 and k = 1.",
  },

  // ── Adv Math · poly (Polynomials) ────────────────────────────────────────
  {
    external_key: "seed-2026-05-poly-1",
    skill_id: "poly",
    skill_name: "Polynomials",
    section: "Math",
    difficulty: 3,
    prompt: "What is the remainder when x³ − 4x + 5 is divided by (x − 2)?",
    choices: ["1", "5", "8", "−3"],
    correct_index: 1,
    rationale:
      "By the remainder theorem, the remainder is the polynomial evaluated at x = 2: (2)³ − 4(2) + 5 = 8 − 8 + 5 = 5.",
  },
  {
    external_key: "seed-2026-05-poly-2",
    skill_id: "poly",
    skill_name: "Polynomials",
    section: "Math",
    difficulty: 4,
    prompt: "If p(x) = (x − 3)(x + 2)(x − 5), what is the sum of all real roots of p(x) = 0?",
    choices: ["0", "4", "6", "10"],
    correct_index: 2,
    rationale: "The roots are 3, −2, and 5. Their sum is 3 + (−2) + 5 = 6.",
  },

  // ── Adv Math · exp (Exponentials) ────────────────────────────────────────
  {
    external_key: "seed-2026-05-exp-1",
    skill_id: "exp",
    skill_name: "Exponentials",
    section: "Math",
    difficulty: 3,
    prompt: "If 2^(x+1) = 32, what is the value of x?",
    choices: ["3", "4", "5", "6"],
    correct_index: 1,
    rationale: "32 = 2^5, so 2^(x+1) = 2^5 gives x + 1 = 5, x = 4.",
  },
  {
    external_key: "seed-2026-05-exp-2",
    skill_id: "exp",
    skill_name: "Exponentials",
    section: "Math",
    difficulty: 4,
    prompt:
      "A bacterial culture doubles in population every 4 hours. If it starts at 600 cells, what is the population after 12 hours?",
    choices: ["1,800", "2,400", "4,800", "7,200"],
    correct_index: 2,
    rationale:
      "12 hours / 4 hours per doubling = 3 doublings. 600 × 2³ = 600 × 8 = 4,800.",
  },

  // ── Adv Math · rat (Rational expressions) ────────────────────────────────
  {
    external_key: "seed-2026-05-rat-1",
    skill_id: "rat",
    skill_name: "Rational expressions",
    section: "Math",
    difficulty: 4,
    prompt: "Simplify:  (x² − 9) / (x² + 5x + 6)   for x ≠ −2, x ≠ −3.",
    choices: ["(x − 3) / (x + 2)", "(x + 3) / (x + 2)", "(x − 3) / (x − 2)", "x − 3"],
    correct_index: 0,
    rationale:
      "Numerator factors as (x − 3)(x + 3); denominator as (x + 2)(x + 3). Cancel (x + 3): result is (x − 3) / (x + 2).",
  },

  // ── Data · fulcrum (Ratios & rates) ──────────────────────────────────────
  {
    external_key: "seed-2026-05-fulcrum-1",
    skill_id: "fulcrum",
    skill_name: "Ratios & rates",
    section: "Math",
    difficulty: 2,
    prompt:
      "A printer prints 12 pages every 30 seconds. At this rate, how many pages will it print in 5 minutes?",
    choices: ["60", "120", "150", "180"],
    correct_index: 1,
    rationale:
      "Rate = 12 pages / 30 seconds = 24 pages/minute. In 5 minutes: 24 × 5 = 120.",
  },
  {
    external_key: "seed-2026-05-fulcrum-2",
    skill_id: "fulcrum",
    skill_name: "Ratios & rates",
    section: "Math",
    difficulty: 3,
    prompt:
      "The ratio of cats to dogs in a shelter is 3 : 5. If there are 40 animals total, how many cats are in the shelter?",
    choices: ["10", "15", "20", "24"],
    correct_index: 1,
    rationale:
      "3 + 5 = 8 parts total. Each part is 40 / 8 = 5. Cats = 3 × 5 = 15.",
  },

  // ── Data · beam-l (Percentages) ──────────────────────────────────────────
  {
    external_key: "seed-2026-05-beam-l-1",
    skill_id: "beam-l",
    skill_name: "Percentages",
    section: "Math",
    difficulty: 2,
    prompt: "A jacket originally costs $80 and is on sale for 25% off. What is the sale price?",
    choices: ["$55", "$60", "$65", "$75"],
    correct_index: 1,
    rationale: "25% of 80 is 20. 80 − 20 = 60.",
  },
  {
    external_key: "seed-2026-05-beam-l-2",
    skill_id: "beam-l",
    skill_name: "Percentages",
    section: "Math",
    difficulty: 4,
    prompt:
      "A stock fell 20% on Monday and then rose 25% on Tuesday. What is its net percent change from before Monday to after Tuesday?",
    choices: ["No change", "Up 5%", "Down 5%", "Up 0.5%"],
    correct_index: 0,
    rationale:
      "Start at 100. After Monday: 100 × 0.80 = 80. After Tuesday: 80 × 1.25 = 100. Net change: 0%.",
  },

  // ── Data · beam-r (Statistics) ───────────────────────────────────────────
  {
    external_key: "seed-2026-05-beam-r-1",
    skill_id: "beam-r",
    skill_name: "Statistics",
    section: "Math",
    difficulty: 3,
    prompt: "What is the median of the data set: 3, 5, 8, 12, 15, 20?",
    choices: ["8", "10", "12", "11"],
    correct_index: 1,
    rationale:
      "With 6 values, the median is the average of the 3rd and 4th values: (8 + 12) / 2 = 10.",
  },

  // ── Data · pan-l (Probability) ───────────────────────────────────────────
  {
    external_key: "seed-2026-05-pan-l-1",
    skill_id: "pan-l",
    skill_name: "Probability",
    section: "Math",
    difficulty: 3,
    prompt:
      "A bag has 3 red, 4 blue, and 5 green marbles. If one marble is drawn at random, what is the probability it is NOT blue?",
    choices: ["1/3", "1/2", "2/3", "8/12"],
    correct_index: 2,
    rationale:
      "Total = 12. Non-blue = 3 + 5 = 8. Probability = 8/12 = 2/3. (Choice D is the unsimplified equivalent — 2/3 is the standard form.)",
  },

  // ── Data · pan-r (Data inference) ────────────────────────────────────────
  {
    external_key: "seed-2026-05-pan-r-1",
    skill_id: "pan-r",
    skill_name: "Data inference",
    section: "Math",
    difficulty: 3,
    prompt:
      "A study finds a strong positive correlation between hours of sleep and exam scores among 200 high school students. Which conclusion is best supported by this data?",
    choices: [
      "Sleeping more causes higher exam scores.",
      "There is an association between sleep and exam scores in this group.",
      "Most students who sleep less than 6 hours fail their exams.",
      "Sleep is the main predictor of academic success.",
    ],
    correct_index: 1,
    rationale:
      "Correlation in an observational study supports an association, not causation. The other choices overstate what the data shows.",
  },

  // ── Geometry · apex (Angles & lines) ─────────────────────────────────────
  {
    external_key: "seed-2026-05-apex-1",
    skill_id: "apex",
    skill_name: "Angles & lines",
    section: "Math",
    difficulty: 2,
    prompt:
      "Two parallel lines are cut by a transversal. One of the corresponding angles measures 65°. What is the measure of its corresponding angle on the other line?",
    choices: ["25°", "65°", "115°", "180°"],
    correct_index: 1,
    rationale: "Corresponding angles formed by parallel lines and a transversal are equal.",
  },

  // ── Geometry · b-l (Triangles) ───────────────────────────────────────────
  {
    external_key: "seed-2026-05-b-l-1",
    skill_id: "b-l",
    skill_name: "Triangles",
    section: "Math",
    difficulty: 2,
    prompt:
      "In a right triangle, one leg is 6 and the hypotenuse is 10. What is the length of the other leg?",
    choices: ["4", "8", "√36", "16"],
    correct_index: 1,
    rationale: "By the Pythagorean theorem: 6² + b² = 10² → 36 + b² = 100 → b² = 64 → b = 8.",
  },
  {
    external_key: "seed-2026-05-b-l-2",
    skill_id: "b-l",
    skill_name: "Triangles",
    section: "Math",
    difficulty: 3,
    prompt:
      "Two angles of a triangle measure 50° and 65°. What is the measure of the third angle?",
    choices: ["55°", "65°", "75°", "115°"],
    correct_index: 1,
    rationale: "Angles of a triangle sum to 180°. 180 − 50 − 65 = 65°.",
  },
  {
    external_key: "seed-2026-05-b-l-3",
    skill_id: "b-l",
    skill_name: "Triangles",
    section: "Math",
    difficulty: 4,
    prompt:
      "An equilateral triangle has a side of length 6. What is its area?",
    choices: ["9", "9√3", "18", "18√3"],
    correct_index: 1,
    rationale:
      "Area of equilateral triangle = (s²·√3) / 4 = (36·√3) / 4 = 9√3.",
  },

  // ── Geometry · b-r (Circles) ─────────────────────────────────────────────
  {
    external_key: "seed-2026-05-b-r-1",
    skill_id: "b-r",
    skill_name: "Circles",
    section: "Math",
    difficulty: 2,
    prompt: "What is the area of a circle with radius 5?",
    choices: ["10π", "20π", "25π", "50π"],
    correct_index: 2,
    rationale: "Area = πr² = π(5²) = 25π.",
  },
  {
    external_key: "seed-2026-05-b-r-2",
    skill_id: "b-r",
    skill_name: "Circles",
    section: "Math",
    difficulty: 4,
    prompt:
      "The equation of a circle in the xy-plane is (x − 2)² + (y + 3)² = 16. What are the center and radius?",
    choices: [
      "Center (2, 3), radius 4",
      "Center (2, −3), radius 4",
      "Center (−2, 3), radius 16",
      "Center (2, −3), radius 16",
    ],
    correct_index: 1,
    rationale:
      "Standard form (x − h)² + (y − k)² = r² gives center (h, k) and radius r. Here h = 2, k = −3, r = √16 = 4.",
  },

  // ── Geometry · cent (Trigonometry) ───────────────────────────────────────
  {
    external_key: "seed-2026-05-cent-1",
    skill_id: "cent",
    skill_name: "Trigonometry",
    section: "Math",
    difficulty: 3,
    prompt:
      "In a right triangle, the angle θ has opposite side 7 and adjacent side 24. What is sin θ?",
    choices: ["7/24", "7/25", "24/25", "25/7"],
    correct_index: 1,
    rationale:
      "Hypotenuse = √(7² + 24²) = √(49 + 576) = √625 = 25. sin θ = opposite/hypotenuse = 7/25.",
  },

  // ── Reading · eye-l (Main idea) ──────────────────────────────────────────
  {
    external_key: "seed-2026-05-eye-l-1",
    skill_id: "eye-l",
    skill_name: "Main idea",
    section: "Reading & Writing",
    difficulty: 2,
    prompt:
      "(Passage: Migratory birds use Earth's magnetic field to navigate over thousands of miles. Recent research has identified specialized cryptochrome proteins in their eyes that respond to magnetic fields, suggesting a biochemical basis for this remarkable ability.)\n\nWhich choice best states the central idea of the passage?",
    choices: [
      "Migratory birds rely on visual landmarks to navigate.",
      "Specialized proteins enable migratory birds to sense Earth's magnetic field.",
      "Cryptochrome was first discovered in plants.",
      "Bird migration patterns have shifted because of climate change.",
    ],
    correct_index: 1,
    rationale:
      "The passage's central claim is that cryptochrome proteins enable magnetoreception. The other options are off-topic or unsupported by the passage.",
  },
  {
    external_key: "seed-2026-05-eye-l-2",
    skill_id: "eye-l",
    skill_name: "Main idea",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "(Passage: For decades, urban planners assumed that wider roads would reduce traffic congestion. But studies of cities that expanded their highway systems consistently found that traffic volume rose to fill the new capacity, leaving congestion roughly unchanged. Some planners now argue that improving public transit is a more effective way to address gridlock.)\n\nWhich choice best states the main idea?",
    choices: [
      "Public transit always reduces traffic congestion.",
      "Building wider roads has not reliably reduced congestion, and transit may be more effective.",
      "Highway expansion is the leading cause of urban pollution.",
      "Urban planners have ignored the problem of traffic for decades.",
    ],
    correct_index: 1,
    rationale:
      "The passage critiques the wider-roads assumption and notes a turn toward transit. Choice B captures both halves; the others overstate or distort.",
  },
  {
    external_key: "seed-2026-05-eye-l-3",
    skill_id: "eye-l",
    skill_name: "Main idea",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "(Passage: The novel's protagonist, Mira, spends most of the book wrestling with whether to accept a prestigious job offer abroad. She does not solve this problem in any single moment; instead, the decision emerges through hundreds of small interactions — a conversation with her sister, a misremembered childhood meal, a delayed letter. By the final chapter, the question feels not so much answered as worn smooth.)\n\nWhich choice best states the main idea?",
    choices: [
      "Mira ultimately turns down the job offer.",
      "The novel argues that important decisions are made in instants of clarity.",
      "Mira's decision unfolds gradually through the texture of everyday life rather than a single dramatic moment.",
      "The novel's structure is hard to follow because it lacks a clear plot.",
    ],
    correct_index: 2,
    rationale:
      "The passage emphasizes that the decision emerges from accumulated small interactions, not a single event. Choice C captures that. A invents an outcome the passage does not give; B reverses the passage's claim; D adds an evaluative judgment the text does not make.",
  },

  // ── Reading · eye-r (Inference) ──────────────────────────────────────────
  {
    external_key: "seed-2026-05-eye-r-1",
    skill_id: "eye-r",
    skill_name: "Inference",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "(Passage: When the lighthouse beam swept across the harbor, the dock was empty. The fishermen had returned hours earlier than usual, their boats already tied and tarped. The wind that had cracked the harbor's wooden signs at sundown had quieted, but the gulls were still inland.)\n\nWhich inference is most strongly supported by the passage?",
    choices: [
      "A storm has passed but its effects linger.",
      "The fishermen are on strike.",
      "The lighthouse is no longer in operation.",
      "The harbor is going to be closed permanently.",
    ],
    correct_index: 0,
    rationale:
      "Early return, sign-cracking wind, and gulls staying inland together suggest a recent storm whose effects (calm but uneasy) persist. The other choices have no support in the text.",
  },
  {
    external_key: "seed-2026-05-eye-r-2",
    skill_id: "eye-r",
    skill_name: "Inference",
    section: "Reading & Writing",
    difficulty: 4,
    prompt:
      "(Passage: Although the lab's results were striking, no other team has yet been able to reproduce them. The original authors maintain that subtle differences in equipment calibration explain the failures. Critics counter that the original equipment may have introduced an artifact that masquerades as the reported effect.)\n\nWhich inference is most directly supported?",
    choices: [
      "The original results have been formally retracted.",
      "Whether the reported effect is real remains an open question.",
      "The critics have proven that the original equipment was faulty.",
      "Other teams are using the same equipment as the original lab.",
    ],
    correct_index: 1,
    rationale:
      "The passage gives competing explanations without resolution. Choice B captures that uncertainty. The others go beyond the text.",
  },

  // ── Reading · beak (Command of evidence) ─────────────────────────────────
  {
    external_key: "seed-2026-05-beak-1",
    skill_id: "beak",
    skill_name: "Command of evidence",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "A student claims: 'In recent decades, library visits have declined sharply because of digital media.' Which finding from a study would most directly support this claim?",
    choices: [
      "Public libraries have expanded their digital lending programs.",
      "Annual in-person library visits in the United States dropped by 31% between 2010 and 2020.",
      "Most adults still read for pleasure at least once a week.",
      "Bookstores have closed at higher rates than libraries.",
    ],
    correct_index: 1,
    rationale:
      "The student's claim is about a decline in library visits over time. Choice B reports exactly that decline. The other choices are tangential or about different metrics.",
  },
  {
    external_key: "seed-2026-05-beak-2",
    skill_id: "beak",
    skill_name: "Command of evidence",
    section: "Reading & Writing",
    difficulty: 4,
    prompt:
      "A historian argues that nineteenth-century railroads accelerated the development of standardized timekeeping in the United States. Which evidence would most strengthen the argument?",
    choices: [
      "By 1850, most American towns set their clocks by local solar noon.",
      "In 1883, U.S. railroad companies coordinated to establish four standard time zones, which most cities adopted within a year.",
      "The first transcontinental railroad was completed in 1869.",
      "Many farmers in the late 1800s preferred local time to railroad time.",
    ],
    correct_index: 1,
    rationale:
      "Choice B directly links the railroads' coordinated action to the rapid spread of standardized time — the exact mechanism the historian is arguing for. The others are background or counterevidence.",
  },

  // ── Reading · wing-l (Vocabulary) ────────────────────────────────────────
  {
    external_key: "seed-2026-05-wing-l-1",
    skill_id: "wing-l",
    skill_name: "Vocabulary",
    section: "Reading & Writing",
    difficulty: 2,
    prompt:
      "As used in the sentence 'The committee remained _____ on the proposal, refusing to take any position', which choice fits best?",
    choices: ["adamant", "neutral", "vehement", "dismissive"],
    correct_index: 1,
    rationale:
      "The clause 'refusing to take any position' signals neutrality. 'Adamant' and 'vehement' suggest strong positions; 'dismissive' suggests rejection.",
  },

  // ── Reading · wing-r (Text structure) ────────────────────────────────────
  {
    external_key: "seed-2026-05-wing-r-1",
    skill_id: "wing-r",
    skill_name: "Text structure",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "(Passage: First, the author describes the standard explanation for the phenomenon. Then, she presents three recent studies whose results contradict that explanation. Finally, she proposes a new model that accommodates the new findings.)\n\nWhich choice best describes the structure of the passage?",
    choices: [
      "An anecdote followed by a moral.",
      "A claim, counterevidence to that claim, and a revised claim.",
      "A historical timeline of an idea.",
      "A comparison of two opposing scientists.",
    ],
    correct_index: 1,
    rationale:
      "The passage describes a setup-challenge-revision pattern, exactly choice B.",
  },

  // ── Reading · foot (Cross-text synthesis) ────────────────────────────────
  {
    external_key: "seed-2026-05-foot-1",
    skill_id: "foot",
    skill_name: "Cross-text synthesis",
    section: "Reading & Writing",
    difficulty: 4,
    prompt:
      "(Passage 1 argues that early childhood programs deliver the highest return on educational spending. Passage 2 reviews recent meta-analyses and finds that the benefits of early childhood programs frequently fade by middle school unless reinforcing programs follow.)\n\nHow would the author of Passage 2 most likely respond to the claim in Passage 1?",
    choices: [
      "By agreeing without qualification.",
      "By arguing that early childhood programs cause long-term harm.",
      "By accepting the initial benefits but qualifying that follow-on programs are needed for the returns to last.",
      "By recommending that the government cut funding for early childhood programs.",
    ],
    correct_index: 2,
    rationale:
      "Passage 2 acknowledges initial benefits but says they fade without reinforcement — that's a qualification, not full agreement (A) or opposition (B, D).",
  },

  // ── Writing · tip (Grammar & usage) ──────────────────────────────────────
  {
    external_key: "seed-2026-05-tip-1",
    skill_id: "tip",
    skill_name: "Grammar & usage",
    section: "Reading & Writing",
    difficulty: 2,
    prompt:
      "Which choice best completes the sentence?\n\n'Each of the volunteers _____ asked to bring identification.'",
    choices: ["are", "is", "were", "have been"],
    correct_index: 1,
    rationale:
      "'Each' is singular, so the verb is singular: 'is'.",
  },
  {
    external_key: "seed-2026-05-tip-2",
    skill_id: "tip",
    skill_name: "Grammar & usage",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which choice best completes the sentence?\n\n'The committee, along with several outside advisors, _____ to release a statement.'",
    choices: ["plan", "have planned", "plans", "are planning"],
    correct_index: 2,
    rationale:
      "The subject is 'committee' (singular). 'Along with several outside advisors' is a parenthetical that does not change the verb. So 'plans'.",
  },
  {
    external_key: "seed-2026-05-tip-3",
    skill_id: "tip",
    skill_name: "Grammar & usage",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which choice best completes the sentence?\n\n'Neither the manager nor the employees _____ aware of the policy change.'",
    choices: ["was", "were", "is", "has been"],
    correct_index: 1,
    rationale:
      "With 'neither/nor', the verb agrees with the closer subject. 'Employees' is plural, so 'were'.",
  },

  // ── Writing · shaft1 (Punctuation) ───────────────────────────────────────
  {
    external_key: "seed-2026-05-shaft1-1",
    skill_id: "shaft1",
    skill_name: "Punctuation",
    section: "Reading & Writing",
    difficulty: 2,
    prompt:
      "Which choice correctly punctuates the sentence?",
    choices: [
      "After the rain stopped, we walked to the park.",
      "After the rain stopped we walked to the park.",
      "After the rain stopped; we walked to the park.",
      "After, the rain stopped we walked to the park.",
    ],
    correct_index: 0,
    rationale:
      "An introductory dependent clause is set off from the main clause by a comma.",
  },
  {
    external_key: "seed-2026-05-shaft1-2",
    skill_id: "shaft1",
    skill_name: "Punctuation",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which choice correctly punctuates the sentence?",
    choices: [
      "She brought three things to the meeting, a notebook, a pen, and a list of questions.",
      "She brought three things to the meeting: a notebook, a pen, and a list of questions.",
      "She brought three things to the meeting; a notebook, a pen, and a list of questions.",
      "She brought three things to the meeting — a notebook a pen and a list of questions.",
    ],
    correct_index: 1,
    rationale:
      "A colon introduces a list after a complete clause. Choice B uses a colon and serial commas correctly.",
  },

  // ── Writing · shaft2 (Transitions) ───────────────────────────────────────
  {
    external_key: "seed-2026-05-shaft2-1",
    skill_id: "shaft2",
    skill_name: "Transitions",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which transition best completes the sentence?\n\n'The new policy was unpopular at first; _____, support for it grew steadily over the next year.'",
    choices: ["consequently", "for example", "however", "furthermore"],
    correct_index: 2,
    rationale:
      "The two clauses contrast (unpopular → growing support). 'However' marks contrast; the others mark cause, illustration, or addition.",
  },
  {
    external_key: "seed-2026-05-shaft2-2",
    skill_id: "shaft2",
    skill_name: "Transitions",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which transition best completes the sentence?\n\n'The drought lowered crop yields across the region. _____, food prices in nearby cities rose sharply.'",
    choices: ["Nevertheless", "As a result", "On the other hand", "Similarly"],
    correct_index: 1,
    rationale:
      "Lower yields cause higher prices — a cause-effect link. 'As a result' marks that. The others mark contrast or comparison.",
  },

  // ── Writing · plume (Rhetorical synthesis) ───────────────────────────────
  {
    external_key: "seed-2026-05-plume-1",
    skill_id: "plume",
    skill_name: "Rhetorical synthesis",
    section: "Reading & Writing",
    difficulty: 4,
    prompt:
      "A student is writing a paragraph and wants to emphasize how the new bridge changed daily commutes. Which sentence best accomplishes this goal?",
    choices: [
      "The bridge was built in 2019 and is 1.2 miles long.",
      "Before the bridge opened, the average cross-river commute took 47 minutes; afterward, it took 18.",
      "The bridge was funded by a state bond.",
      "Local newspapers covered the bridge's opening ceremony extensively.",
    ],
    correct_index: 1,
    rationale:
      "The student's goal is to emphasize the change in daily commutes. Choice B gives the precise before/after metric — the exact effect being highlighted. The others are about funding, length, or coverage.",
  },

  // ── Writing · barb (Boundaries) ──────────────────────────────────────────
  {
    external_key: "seed-2026-05-barb-1",
    skill_id: "barb",
    skill_name: "Boundaries",
    section: "Reading & Writing",
    difficulty: 3,
    prompt:
      "Which choice best joins the two sentences?\n\n'The river had risen overnight. The campsite was now underwater.'",
    choices: [
      "The river had risen overnight, the campsite was now underwater.",
      "The river had risen overnight; the campsite was now underwater.",
      "The river had risen overnight the campsite was now underwater.",
      "The river had risen overnight: but the campsite was now underwater.",
    ],
    correct_index: 1,
    rationale:
      "Both halves are independent clauses. Joining them with a semicolon (choice B) is correct. A is a comma splice; C is a run-on; D misuses the colon.",
  },
];

async function main() {
  console.log(`Seeding ${ITEMS.length} starter items as drafts…`);

  if (ITEMS.length !== 50) {
    console.warn(
      `Note: ITEMS.length is ${ITEMS.length}, not 50. The plan target was 50; adjust as needed.`,
    );
  }

  const rows = ITEMS.map((it) => ({
    external_key: it.external_key,
    skill_id: it.skill_id,
    skill_name: it.skill_name,
    section: it.section,
    difficulty: it.difficulty,
    prompt: it.prompt,
    choices: it.choices,
    correct_index: it.correct_index,
    rationale: it.rationale,
    status: "draft",
    origin: "admin",
    source: "seed",
  }));

  const { data, error } = await sb
    .from("diagnostic_questions")
    .upsert(rows, { onConflict: "external_key", ignoreDuplicates: false })
    .select("id, external_key, status");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Upserted ${data?.length ?? 0} rows.`);
  console.log("Visit /admin/questions and filter by 'draft' to review and publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
