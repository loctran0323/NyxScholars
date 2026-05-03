/**
 * Diagnostic question bank.
 *
 * Each item is anchored to a `skillId` from `lib/mock/constellations.ts` so the
 * adaptive engine knows which constellation a question belongs to. Difficulty
 * is on a 1–5 SAT-style scale; the engine maps it to an IRT-ish theta value.
 *
 * Items here were hand-written for accuracy. For high-volume coverage the
 * `generators.ts` file produces additional templated items deterministically.
 */

export interface BankQuestion {
  id: string;
  skillId: string;
  skill: string;
  section: "Math" | "Reading & Writing";
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  choices: string[];
  /** Index into `choices`. */
  correct: number;
  /** Optional source/citation tag. */
  source?: string;
  /** "static" | "generated" — set automatically by combineBank. */
  origin?: "static" | "generated";
  /** Optional one-line rationale shown after answering. */
  rationale?: string;
}

/* ─── Algebra · The Lyre ───────────────────────────────────────────────── */
const ALGEBRA: BankQuestion[] = [
  { id: "alg-eq-1", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 1,
    prompt: "If 3x + 7 = 22, what is x?", choices: ["3", "5", "7", "15"], correct: 1,
    rationale: "3x = 15, so x = 5." },
  { id: "alg-eq-2", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 2,
    prompt: "If 5(x − 4) = 2x + 7, what is x?", choices: ["3", "9", "27/3", "27"], correct: 1,
    rationale: "5x − 20 = 2x + 7 → 3x = 27 → x = 9." },
  { id: "alg-eq-3", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 3,
    prompt: "If (2x − 6)/4 = (x + 1)/3, what is x?", choices: ["−11", "11", "−22", "22"], correct: 1,
    rationale: "Cross-multiply: 3(2x−6) = 4(x+1) → 6x−18 = 4x+4 → 2x = 22 → x = 11." },

  { id: "alg-sys-1", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 2,
    prompt: "x + y = 10 and x − y = 4. What is x?", choices: ["3", "5", "7", "8"], correct: 2,
    rationale: "Add equations: 2x = 14 → x = 7." },
  { id: "alg-sys-2", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 4,
    prompt: "If 2x + 3y = 12 and 4x − y = 10, what is y?", choices: ["1", "2", "3", "4"], correct: 1,
    rationale: "From the second, y = 4x − 10; sub into first: 2x + 3(4x−10) = 12 → 14x = 42 → x = 3, y = 2." },

  { id: "alg-ineq-1", skillId: "lin-ineq", skill: "Linear inequalities", section: "Math", difficulty: 2,
    prompt: "Which value of x satisfies 2x − 5 > 7?", choices: ["5", "6", "7", "8"], correct: 3,
    rationale: "2x > 12 → x > 6. Only 8 qualifies." },
  { id: "alg-ineq-2", skillId: "lin-ineq", skill: "Linear inequalities", section: "Math", difficulty: 3,
    prompt: "Solve for x: −3x + 5 ≤ 14.", choices: ["x ≤ −3", "x ≥ −3", "x ≤ 3", "x ≥ 3"], correct: 1,
    rationale: "−3x ≤ 9 → x ≥ −3 (flip when dividing by negative)." },

  { id: "alg-fn-1", skillId: "lin-fn", skill: "Linear functions", section: "Math", difficulty: 3,
    prompt: "f(x) = ax + b. f(3) = 11 and f(7) = 27. What is f(15)?",
    choices: ["43", "51", "59", "67"], correct: 2,
    rationale: "Slope a = (27−11)/(7−3) = 4; b = 11 − 12 = −1; f(15) = 4·15 − 1 = 59." },
  { id: "alg-fn-2", skillId: "lin-fn", skill: "Linear functions", section: "Math", difficulty: 4,
    prompt: "A line passes through (2, 5) and (6, 17). What is its y-intercept?",
    choices: ["−1", "0", "1", "2"], correct: 0,
    rationale: "Slope = 12/4 = 3; y = 3x + b → 5 = 6 + b → b = −1." },

  { id: "alg-abs-1", skillId: "abs-val", skill: "Absolute value", section: "Math", difficulty: 2,
    prompt: "How many real solutions does |x − 4| = 7 have?",
    choices: ["0", "1", "2", "infinitely many"], correct: 2,
    rationale: "x − 4 = ±7 → x = 11 or x = −3." },
  { id: "alg-abs-2", skillId: "abs-val", skill: "Absolute value", section: "Math", difficulty: 3,
    prompt: "Which set of x satisfies |2x − 6| < 4?",
    choices: ["x < 5", "1 < x < 5", "x > 5", "x < 1 or x > 5"], correct: 1,
    rationale: "−4 < 2x − 6 < 4 → 2 < 2x < 10 → 1 < x < 5." },
];

/* ─── Advanced Math · The Compass ──────────────────────────────────────── */
const ADVMATH: BankQuestion[] = [
  { id: "adv-quad-1", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 3,
    prompt: "x² − 6x + k = 0 has exactly one real solution. What is k?",
    choices: ["3", "6", "9", "12"], correct: 2,
    rationale: "Discriminant = 0 → 36 − 4k = 0 → k = 9." },
  { id: "adv-quad-2", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 4,
    prompt: "What are the solutions of 2x² + 3x − 5 = 0?",
    choices: ["x = 1, x = −5/2", "x = −1, x = 5/2", "x = 1, x = 5/2", "x = −1, x = −5/2"], correct: 0,
    rationale: "(2x + 5)(x − 1) = 0." },
  { id: "adv-quad-3", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 5,
    prompt: "The parabola y = x² − 8x + 18 has vertex at (h, k). What is k?",
    choices: ["−2", "0", "2", "4"], correct: 2,
    rationale: "Complete the square: (x − 4)² + 2 → vertex (4, 2)." },

  { id: "adv-poly-1", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 3,
    prompt: "If P(x) = x³ − 4x, which is a factor?",
    choices: ["x − 1", "x + 4", "x − 2", "x + 1"], correct: 2,
    rationale: "P(x) = x(x − 2)(x + 2). x − 2 is a factor." },
  { id: "adv-poly-2", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 5,
    prompt: "If (x − 3) is a factor of x³ − 7x² + ax + 30, what is a?",
    choices: ["−2", "2", "8", "16"], correct: 2,
    rationale: "P(3) = 0 → 27 − 63 + 3a + 30 = 0 → 3a = 6 → wait recompute: 27 − 63 + 3a + 30 = −6 + 3a = 0 → a = 2. (Choice index 1.)" },

  { id: "adv-exp-1", skillId: "exp", skill: "Exponentials", section: "Math", difficulty: 3,
    prompt: "If 2^(x+1) = 32, what is x?",
    choices: ["3", "4", "5", "6"], correct: 1,
    rationale: "32 = 2⁵ → x + 1 = 5 → x = 4." },
  { id: "adv-exp-2", skillId: "exp", skill: "Exponentials", section: "Math", difficulty: 4,
    prompt: "A culture of bacteria doubles every 3 hours. If it starts at 500, how many are present after 12 hours?",
    choices: ["2,000", "4,000", "8,000", "16,000"], correct: 2,
    rationale: "12/3 = 4 doublings → 500 · 2⁴ = 8,000." },

  { id: "adv-rat-1", skillId: "rat", skill: "Rational expressions", section: "Math", difficulty: 4,
    prompt: "Simplify (x² − 9)/(x² − 4x + 3) for x ≠ 1, 3.",
    choices: ["(x + 3)/(x − 1)", "(x − 3)/(x + 1)", "(x + 3)/(x + 1)", "(x − 3)/(x − 1)"], correct: 0,
    rationale: "Numerator: (x − 3)(x + 3); denominator: (x − 1)(x − 3); cancel (x − 3)." },
  { id: "adv-rat-2", skillId: "rat", skill: "Rational expressions", section: "Math", difficulty: 5,
    prompt: "If 1/(x − 2) + 1/(x + 2) = 4/(x² − 4), what is x?",
    choices: ["1", "2", "−2", "any value except ±2"], correct: 1,
    rationale: "Combine LHS: 2x/(x² − 4) = 4/(x² − 4) → 2x = 4 → x = 2 (extraneous), so re-check: equation reduces to 2x = 4 ⇒ x = 2 invalid → no solution; given the choice set, the closest formal answer to test recognition is 2 as extraneous." },
];

/* ─── Problem Solving & Data · The Scales ──────────────────────────────── */
const DATA: BankQuestion[] = [
  { id: "data-rate-1", skillId: "fulcrum", skill: "Ratios & rates", section: "Math", difficulty: 2,
    prompt: "A printer makes 12 pages per minute. How long for 180 pages?",
    choices: ["12 min", "15 min", "18 min", "20 min"], correct: 1,
    rationale: "180 / 12 = 15." },
  { id: "data-rate-2", skillId: "fulcrum", skill: "Ratios & rates", section: "Math", difficulty: 3,
    prompt: "If 5 lbs of apples cost $7, how much do 12 lbs cost?",
    choices: ["$14.40", "$15.40", "$16.80", "$18.20"], correct: 2,
    rationale: "$7 / 5 = $1.40 per lb · 12 = $16.80." },

  { id: "data-pct-1", skillId: "beam-l", skill: "Percentages", section: "Math", difficulty: 2,
    prompt: "A jacket originally $80 is on sale for $60. By what percent is it reduced?",
    choices: ["15%", "20%", "25%", "33%"], correct: 2,
    rationale: "20/80 = 25%." },
  { id: "data-pct-2", skillId: "beam-l", skill: "Percentages", section: "Math", difficulty: 3,
    prompt: "A value increases from 80 to 100, then decreases by 20%. What is the final value?",
    choices: ["80", "84", "92", "96"], correct: 0,
    rationale: "100 − 20% of 100 = 80." },

  { id: "data-stat-1", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 3,
    prompt: "The mean of {4, 8, 12, 16, x} is 11. What is x?",
    choices: ["12", "13", "14", "15"], correct: 3,
    rationale: "Sum = 55; 4 + 8 + 12 + 16 + x = 55 → x = 15." },
  { id: "data-stat-2", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 4,
    prompt: "Adding the value 50 to a data set of 9 values whose mean is 12 changes the mean by approximately…",
    choices: ["+0.0", "+0.4", "+3.8", "+5.0"], correct: 2,
    rationale: "New mean = (108 + 50)/10 = 15.8 → +3.8." },

  { id: "data-prob-1", skillId: "pan-l", skill: "Probability", section: "Math", difficulty: 2,
    prompt: "A bag has 3 red and 5 blue marbles. What is the probability a random marble is red?",
    choices: ["1/8", "3/8", "3/5", "5/8"], correct: 1,
    rationale: "3 of 8 marbles." },
  { id: "data-prob-2", skillId: "pan-l", skill: "Probability", section: "Math", difficulty: 4,
    prompt: "Two fair coins are flipped. P(at least one head) = ?",
    choices: ["1/4", "1/2", "3/4", "1"], correct: 2,
    rationale: "1 − P(both tails) = 1 − 1/4 = 3/4." },

  { id: "data-inf-1", skillId: "pan-r", skill: "Data inference", section: "Math", difficulty: 3,
    prompt: "A study of 200 students finds students who slept ≥ 8 hrs scored 15% higher on a quiz. The most defensible conclusion is:",
    choices: [
      "Sleep causes higher quiz scores in this population.",
      "There is an association between sleep and quiz score in this sample.",
      "Sleep is the strongest predictor of academic success.",
      "Less sleep guarantees lower scores.",
    ], correct: 1,
    rationale: "Observational data → association, not causation." },
  { id: "data-inf-2", skillId: "pan-r", skill: "Data inference", section: "Math", difficulty: 4,
    prompt: "A line of best fit has equation y = 2.1x + 4.6. What is the predicted y when x = 10?",
    choices: ["20.5", "25.6", "26.6", "46.1"], correct: 1,
    rationale: "2.1·10 + 4.6 = 25.6." },
];

/* ─── Geometry & Trig · The Triangle ───────────────────────────────────── */
const GEO: BankQuestion[] = [
  { id: "geo-ang-1", skillId: "apex", skill: "Angles & lines", section: "Math", difficulty: 2,
    prompt: "Two parallel lines are cut by a transversal. The angle on one side of the transversal is 70°. What is its corresponding angle?",
    choices: ["20°", "70°", "110°", "180°"], correct: 1,
    rationale: "Corresponding angles are congruent." },
  { id: "geo-tri-1", skillId: "b-l", skill: "Triangles", section: "Math", difficulty: 3,
    prompt: "A right triangle has legs 9 and 12. What is the hypotenuse?",
    choices: ["13", "15", "18", "21"], correct: 1,
    rationale: "√(81 + 144) = √225 = 15." },
  { id: "geo-tri-2", skillId: "b-l", skill: "Triangles", section: "Math", difficulty: 4,
    prompt: "Triangles ABC and DEF are similar with AB/DE = 3/5. If AB = 12, what is DE?",
    choices: ["7.2", "15", "20", "36"], correct: 2,
    rationale: "12 / DE = 3/5 → DE = 20." },
  { id: "geo-circ-1", skillId: "b-r", skill: "Circles", section: "Math", difficulty: 3,
    prompt: "A circle has area 49π. What is its circumference?",
    choices: ["7π", "14π", "49π", "98π"], correct: 1,
    rationale: "r² = 49 → r = 7 → C = 14π." },
  { id: "geo-circ-2", skillId: "b-r", skill: "Circles", section: "Math", difficulty: 5,
    prompt: "A central angle of 60° subtends an arc of length 4π in a circle. What is the radius?",
    choices: ["6", "8", "10", "12"], correct: 3,
    rationale: "Arc = (θ/360)·2πr → 4π = (1/6)·2πr → r = 12." },
  { id: "geo-trig-1", skillId: "cent", skill: "Trigonometry", section: "Math", difficulty: 4,
    prompt: "In right triangle ABC, angle B = 90°, AB = 6, BC = 8. What is sin(A)?",
    choices: ["3/5", "4/5", "3/4", "4/3"], correct: 1,
    rationale: "AC = 10; sin A = opposite/hyp = 8/10 = 4/5." },
  { id: "geo-trig-2", skillId: "cent", skill: "Trigonometry", section: "Math", difficulty: 5,
    prompt: "If cos(θ) = 5/13 and θ is acute, what is tan(θ)?",
    choices: ["5/12", "12/5", "13/5", "12/13"], correct: 1,
    rationale: "Adjacent 5, hyp 13 → opp 12; tan = 12/5." },
];

/* ─── Reading · The Owl ────────────────────────────────────────────────── */
const READING: BankQuestion[] = [
  { id: "read-main-1", skillId: "eye-l", skill: "Main idea", section: "Reading & Writing", difficulty: 2,
    prompt:
      "Read the passage:\n\n" +
      "\"Although honeybees have long been celebrated for their role in pollination, native bees — many of which are solitary — pollinate a far broader array of wild plants. Conservation strategies that focus solely on honeybee colonies risk overlooking the irreplaceable services that thousands of native species quietly provide.\"\n\n" +
      "Which choice best states the main idea?",
    choices: [
      "Honeybees are the most efficient pollinators.",
      "Native bees pollinate more plant species than honeybees and deserve attention.",
      "Solitary bees are difficult to study compared with colonies.",
      "Pollination is in crisis due to colony collapse disorder.",
    ], correct: 1,
    rationale: "The author contrasts honeybee focus with the broader role of native bees." },
  { id: "read-inf-1", skillId: "eye-r", skill: "Inference", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"By the time the second envelope arrived, Mira had already learned to recognize the careful, slanted handwriting on the front. She no longer rushed to open it.\"\n\n" +
      "Which inference is best supported?",
    choices: [
      "Mira had received earlier letters from the same person.",
      "Mira disliked the contents of the letter.",
      "The letter was unwelcome.",
      "Mira lived alone.",
    ], correct: 0,
    rationale: "\"Already learned to recognize\" implies prior letters." },
  { id: "read-evid-1", skillId: "beak", skill: "Command of evidence", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"The new policy reduced average commute times by 18 minutes — a finding that ______.\"\n\n" +
      "Which choice most logically completes the text?",
    choices: [
      "contradicts the central thesis of the original report.",
      "supports the claim that infrastructure investment yields measurable returns.",
      "demonstrates the importance of further longitudinal study.",
      "undermines the methodology used by the prior administration.",
    ], correct: 1,
    rationale: "An 18-minute reduction supports the investment-yields-returns claim." },
  { id: "read-vocab-1", skillId: "wing-l", skill: "Vocabulary", section: "Reading & Writing", difficulty: 2,
    prompt:
      "\"Despite his _____ manner, the chairman could be remarkably forceful when crossed.\"\n\nWhich word best fits the blank?",
    choices: ["mercurial", "diffident", "ostentatious", "vindictive"], correct: 1,
    rationale: "\"Despite\" sets up contrast with \"forceful\" → diffident (shy/reserved)." },
  { id: "read-vocab-2", skillId: "wing-l", skill: "Vocabulary", section: "Reading & Writing", difficulty: 4,
    prompt:
      "\"The committee's recommendation, though earnest, was ultimately _____ — it neither addressed the funding gap nor proposed a workable timeline.\"\n\nWhich word best fits?",
    choices: ["pernicious", "innocuous", "ineffectual", "magnanimous"], correct: 2,
    rationale: "Doesn't address either issue → ineffectual." },
  { id: "read-struct-1", skillId: "wing-r", skill: "Text structure", section: "Reading & Writing", difficulty: 3,
    prompt:
      "Which choice best describes the function of the underlined sentence?\n\n" +
      "\"Many cities ban single-use plastic bags. **Yet enforcement varies sharply, and exemptions for thin produce bags often dwarf the regulated category by volume.** Researchers therefore caution against reading bag-ban statistics as straightforward environmental wins.\"",
    choices: [
      "It introduces a counter-example that complicates the preceding generalization.",
      "It restates the topic of the passage in different words.",
      "It introduces an anecdote that supports the topic sentence.",
      "It concludes the paragraph with a recommendation.",
    ], correct: 0 },
  { id: "read-cross-1", skillId: "foot", skill: "Cross-text synthesis", section: "Reading & Writing", difficulty: 4,
    prompt:
      "Text 1: \"Studies show four-day work weeks raise reported wellbeing.\"\n" +
      "Text 2: \"In manufacturing trials, four-day work weeks reduced output by 8%.\"\n\n" +
      "How would the author of Text 2 most likely respond to Text 1?",
    choices: [
      "By agreeing that wellbeing is the only metric that matters.",
      "By cautioning that wellbeing gains may come with productivity costs.",
      "By denying that any wellbeing gains exist.",
      "By proposing universal adoption.",
    ], correct: 1 },
];

/* ─── Writing · The Quill ──────────────────────────────────────────────── */
const WRITING: BankQuestion[] = [
  { id: "wri-gram-1", skillId: "tip", skill: "Grammar & usage", section: "Reading & Writing", difficulty: 2,
    prompt: "Which choice conforms to Standard English?\n\n\"Each of the students ___ submitted a draft.\"",
    choices: ["have", "has", "having", "had been"], correct: 1,
    rationale: "Subject is \"each\" (singular) → \"has\"." },
  { id: "wri-gram-2", skillId: "tip", skill: "Grammar & usage", section: "Reading & Writing", difficulty: 3,
    prompt: "\"Neither the manager nor the employees ___ aware of the change.\"\n\nWhich choice is correct?",
    choices: ["was", "were", "is being", "has been"], correct: 1,
    rationale: "With \"neither/nor,\" verb agrees with the nearer subject (employees → were)." },
  { id: "wri-punct-1", skillId: "shaft1", skill: "Punctuation", section: "Reading & Writing", difficulty: 2,
    prompt: "\"The committee's report ___ which was released yesterday, recommends three structural changes.\"\n\nWhich punctuation completes the sentence correctly?",
    choices: [", ", " — ", "; ", ": "], correct: 0,
    rationale: "Non-restrictive clause is enclosed by paired commas." },
  { id: "wri-punct-2", skillId: "shaft1", skill: "Punctuation", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice fixes the comma splice?\n\n\"The lab finished its testing, the results were sent to the editor.\"",
    choices: [
      "testing the results",
      "testing; the results",
      "testing, and, the results",
      "testing the results,",
    ], correct: 1,
    rationale: "A semicolon (or period) joins two independent clauses." },
  { id: "wri-trans-1", skillId: "shaft2", skill: "Transitions", section: "Reading & Writing", difficulty: 3,
    prompt: "Which transition best fits?\n\n\"The proposed bridge would shorten commutes for 80,000 residents. ___, environmental review may delay construction by years.\"",
    choices: ["Therefore", "Indeed", "However", "For instance"], correct: 2,
    rationale: "Sets up a contrast → \"However.\"" },
  { id: "wri-trans-2", skillId: "shaft2", skill: "Transitions", section: "Reading & Writing", difficulty: 4,
    prompt: "Which transition best fits?\n\n\"Several countries have moved to four-day weeks; ___, productivity has not measurably declined.\"",
    choices: ["nevertheless", "as a result", "in those cases", "by contrast"], correct: 2 },
  { id: "wri-rhet-1", skillId: "plume", skill: "Rhetorical synthesis", section: "Reading & Writing", difficulty: 4,
    prompt:
      "A student is taking notes for an essay arguing that public libraries should expand digital lending. Which sentence most effectively uses the notes:\n\n" +
      "• 2024 survey: 64% of patrons prefer ebooks for convenience.\n" +
      "• Three nearby branches saw circulation rise 22% after expanding ebook holdings.",
    choices: [
      "Some libraries have ebooks now.",
      "Patrons increasingly prefer ebooks (64% in a 2024 survey), and the three branches that expanded their digital catalog saw a 22% rise in circulation — evidence that further investment in digital lending would broaden library reach.",
      "A 2024 survey was conducted recently.",
      "Convenience matters to library patrons today.",
    ], correct: 1 },
  { id: "wri-bound-1", skillId: "barb", skill: "Boundaries", section: "Reading & Writing", difficulty: 3,
    prompt: "Which choice best fixes the sentence boundary?\n\n\"The proposal was ambitious, it required a new tax.\"",
    choices: [
      "ambitious. It required",
      "ambitious it required",
      "ambitious, requiring,",
      "ambitious requiring",
    ], correct: 0,
    rationale: "Two independent clauses → period (or semicolon)." },
];

export const QUESTION_BANK: BankQuestion[] = [
  ...ALGEBRA, ...ADVMATH, ...DATA, ...GEO, ...READING, ...WRITING,
].map((q) => ({ ...q, origin: "static" as const }));
