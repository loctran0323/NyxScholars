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
    choices: ["−2", "2", "8", "16"], correct: 1,
    rationale: "If (x − 3) is a factor, then P(3) = 0: 27 − 63 + 3a + 30 = 0 → 3a − 6 = 0 → a = 2." },

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
    prompt: "If 3/(x + 1) = 12/(x² − 1) for x ≠ ±1, what is x?",
    choices: ["3", "4", "5", "no solution"], correct: 2,
    rationale: "Since x² − 1 = (x − 1)(x + 1), multiply both sides by (x − 1)(x + 1): 3(x − 1) = 12 → x − 1 = 4 → x = 5, which is valid because x ≠ ±1." },
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

/* ─── Extended bank · added in pass 2 ─────────────────────────────────── */
const EXT_ALGEBRA: BankQuestion[] = [
  { id: "alg-eq-4", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 4,
    prompt: "If 7x − 4 = 3x + 24, what is x?", choices: ["5", "6", "7", "8"], correct: 2,
    rationale: "4x = 28 → x = 7." },
  { id: "alg-eq-5", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 5,
    prompt: "If a, b > 0 and ax + b = 2(b − ax), what is x in terms of a, b?",
    choices: ["b/a", "b/(3a)", "−b/a", "(2b − b)/(3a)"], correct: 1,
    rationale: "ax + b = 2b − 2ax → 3ax = b → x = b/(3a)." },
  { id: "alg-sys-3", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 3,
    prompt: "3x + 2y = 16 and x − y = 2. What is y?", choices: ["1", "2", "3", "4"], correct: 1,
    rationale: "x = y + 2 → 3(y+2) + 2y = 16 → 5y = 10 → y = 2." },
  { id: "alg-sys-4", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 5,
    prompt: "For what value of k does the system 2x + ky = 8 and 4x + 6y = 16 have infinitely many solutions?",
    choices: ["2", "3", "4", "6"], correct: 1,
    rationale: "Lines must be identical: 2/4 = k/6 = 8/16 → k = 3." },
  { id: "alg-ineq-3", skillId: "lin-ineq", skill: "Linear inequalities", section: "Math", difficulty: 4,
    prompt: "Which value of x is NOT in the solution set of 4 − 2x > x − 5?",
    choices: ["−2", "0", "2", "4"], correct: 3,
    rationale: "9 > 3x → x < 3. 4 fails." },
  { id: "alg-fn-3", skillId: "lin-fn", skill: "Linear functions", section: "Math", difficulty: 5,
    prompt: "A line passes through (−1, 2) and is perpendicular to y = (1/2)x + 3. Its equation is:",
    choices: ["y = −2x", "y = 2x + 4", "y = −2x + 0", "y = −(1/2)x + 3/2"], correct: 0,
    rationale: "Perpendicular slope = −2; y − 2 = −2(x + 1) → y = −2x." },
  { id: "alg-abs-3", skillId: "abs-val", skill: "Absolute value", section: "Math", difficulty: 4,
    prompt: "How many integer values of x satisfy |x + 2| ≤ 3?",
    choices: ["5", "6", "7", "8"], correct: 2,
    rationale: "−3 ≤ x + 2 ≤ 3 → −5 ≤ x ≤ 1 → seven integers." },
];

const EXT_ADVMATH: BankQuestion[] = [
  { id: "adv-quad-4", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 5,
    prompt: "The graph of y = (x − 3)² − 4 has x-intercepts at x = a and x = b with a < b. What is a + b?",
    choices: ["−1", "1", "3", "6"], correct: 3,
    rationale: "Sum of roots of (x − 3)² = 4 is 6 by symmetry around x = 3." },
  { id: "adv-poly-3", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 4,
    prompt: "If P(x) = x³ + 2x² − 5x − 6, then P(2) = ?",
    choices: ["0", "4", "8", "12"], correct: 0,
    rationale: "P(2) = 8 + 8 − 10 − 6 = 0." },
  { id: "adv-poly-4", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 5,
    prompt: "Given f(x) = (x − 2)(x + 1)(x − 5), how many distinct real roots does f have?",
    choices: ["1", "2", "3", "4"], correct: 2,
    rationale: "x = 2, −1, 5 — three distinct real roots." },
  { id: "adv-exp-3", skillId: "exp", skill: "Exponentials", section: "Math", difficulty: 5,
    prompt: "Solve for x: 9^x = 27.", choices: ["1", "1.5", "2", "3"], correct: 1,
    rationale: "9^x = 3^(2x) = 3^3 → 2x = 3 → x = 1.5." },
  { id: "adv-rat-3", skillId: "rat", skill: "Rational expressions", section: "Math", difficulty: 3,
    prompt: "What value of x makes (x − 4)/(x² − 16) undefined?",
    choices: ["x = 4 only", "x = −4 only", "x = ±4", "no value"], correct: 2,
    rationale: "Denominator zero at x = ±4." },
];

const EXT_DATA: BankQuestion[] = [
  { id: "data-rate-3", skillId: "fulcrum", skill: "Ratios & rates", section: "Math", difficulty: 4,
    prompt: "Two pipes fill a tank: one in 6 hours, one in 4 hours. Together, how long to fill?",
    choices: ["2 h 24 min", "2 h 30 min", "3 h", "5 h"], correct: 0,
    rationale: "1/6 + 1/4 = 5/12 per hour → 12/5 = 2.4 h = 2 h 24 min." },
  { id: "data-pct-3", skillId: "beam-l", skill: "Percentages", section: "Math", difficulty: 4,
    prompt: "A shirt is marked up 25% and then discounted 20%. Compared with the original, the final price is:",
    choices: ["5% lower", "the same", "5% higher", "10% higher"], correct: 1,
    rationale: "1.25 · 0.80 = 1.00 — same as original." },
  { id: "data-stat-3", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 4,
    prompt: "The median of {3, 8, x, 12, 17} (in increasing order) is 11. What is x?",
    choices: ["8", "10", "11", "12"], correct: 2,
    rationale: "Middle value of a 5-element ordered set is x → x = 11." },
  { id: "data-stat-4", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 5,
    prompt: "Adding the same positive constant to every value in a data set leaves which statistic unchanged?",
    choices: ["the mean", "the median", "the range", "the maximum value"], correct: 2,
    rationale: "Adding a constant shifts every value — and with it the mean, median, and maximum — up by that amount, but the spread is untouched, so the range is unchanged." },
  { id: "data-prob-3", skillId: "pan-l", skill: "Probability", section: "Math", difficulty: 3,
    prompt: "A standard die is rolled. P(prime number) = ?",
    choices: ["1/3", "1/2", "2/3", "5/6"], correct: 1,
    rationale: "Primes on a die: 2, 3, 5 → 3/6 = 1/2." },
  { id: "data-inf-3", skillId: "pan-r", skill: "Data inference", section: "Math", difficulty: 5,
    prompt: "A scatterplot shows weight vs hours of sleep with r = −0.78. Which is the most defensible interpretation?",
    choices: [
      "Sleeping less causes weight gain.",
      "There is a strong negative association in this sample.",
      "Sleep and weight are unrelated.",
      "More sleep guarantees lower weight.",
    ], correct: 1 },
];

const EXT_GEO: BankQuestion[] = [
  { id: "geo-ang-2", skillId: "apex", skill: "Angles & lines", section: "Math", difficulty: 3,
    prompt: "In a triangle, two angles are 47° and 68°. The third angle is:",
    choices: ["55°", "60°", "65°", "75°"], correct: 2,
    rationale: "180 − 47 − 68 = 65." },
  { id: "geo-tri-3", skillId: "b-l", skill: "Triangles", section: "Math", difficulty: 5,
    prompt: "An isosceles right triangle has hypotenuse 10. What is its area?",
    choices: ["20", "25", "50", "100"], correct: 1,
    rationale: "Legs = 10/√2 = 5√2 → area = (5√2)²/2 = 25." },
  { id: "geo-circ-3", skillId: "b-r", skill: "Circles", section: "Math", difficulty: 4,
    prompt: "A chord of length 8 sits in a circle of radius 5. The distance from the chord to the center is:",
    choices: ["1", "2", "3", "4"], correct: 2,
    rationale: "Half-chord = 4; distance = √(25 − 16) = 3." },
  { id: "geo-trig-3", skillId: "cent", skill: "Trigonometry", section: "Math", difficulty: 4,
    prompt: "If sin(x) = 0.6 and 0 < x < 90°, then cos(x) = ?",
    choices: ["0.4", "0.6", "0.8", "1.0"], correct: 2,
    rationale: "cos²x = 1 − 0.36 = 0.64 → cos x = 0.8." },
];

const EXT_READING: BankQuestion[] = [
  { id: "read-main-2", skillId: "eye-l", skill: "Main idea", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"Soil microbiomes underpin almost every benefit a forest provides — water filtration, carbon storage, the slow build-up of fertility — yet in policy debates they remain almost invisible. When we talk about protecting forests, we still mean protecting trees, not the living substrate beneath them.\"\n\nWhich choice best states the main idea?",
    choices: [
      "Forests cannot survive without soil microbiomes.",
      "Soil microbiomes are critical to forest function but routinely overlooked in policy.",
      "Carbon storage is the most important forest service.",
      "Soil studies have grown more popular recently.",
    ], correct: 1 },
  { id: "read-inf-2", skillId: "eye-r", skill: "Inference", section: "Reading & Writing", difficulty: 4,
    prompt:
      "\"The third reviewer's note ran longer than the manuscript itself, and yet, when Asha replied, she signed off with a smile.\"\n\nWhich inference is best supported?",
    choices: [
      "Asha disagreed with most of the reviewer's points.",
      "Asha welcomed the depth of the critique despite its length.",
      "The manuscript was very short.",
      "Asha had argued with reviewers before.",
    ], correct: 1 },
  { id: "read-evid-2", skillId: "beak", skill: "Command of evidence", section: "Reading & Writing", difficulty: 4,
    prompt:
      "A student is supporting the claim that \"local farmers' markets reduce supply-chain emissions.\" Which finding most directly supports it?",
    choices: [
      "Farmers' market sales rose 14% nationally last year.",
      "Average produce sold at the markets traveled 9 miles versus 1,400 miles for supermarket equivalents.",
      "Surveyed shoppers said the markets felt friendlier.",
      "The markets stock more variety than typical groceries.",
    ], correct: 1 },
  { id: "read-vocab-3", skillId: "wing-l", skill: "Vocabulary", section: "Reading & Writing", difficulty: 5,
    prompt:
      "\"Her arguments, while ___, ultimately failed to reckon with the central counterexample.\"\n\nWhich word best fits?",
    choices: ["tendentious", "trenchant", "querulous", "pellucid"], correct: 1,
    rationale: "Trenchant = sharp/incisive; sets up contrast with \"failed to reckon\"." },
  { id: "read-struct-2", skillId: "wing-r", skill: "Text structure", section: "Reading & Writing", difficulty: 4,
    prompt:
      "Which best describes the underlined sentence's role?\n\n\"Most economists agree the rebate is poorly targeted. **Even so, killing the program outright would leave a vulnerable cohort with no replacement.** The right response is to phase in a needs-based system.\"",
    choices: [
      "It introduces a contrast that complicates the prior consensus.",
      "It proposes a solution to the problem the passage raises.",
      "It restates the central claim using new evidence.",
      "It dismisses the prior viewpoint entirely.",
    ], correct: 0 },
  { id: "read-cross-2", skillId: "foot", skill: "Cross-text synthesis", section: "Reading & Writing", difficulty: 5,
    prompt:
      "Text 1: \"Remote work increases self-reported productivity.\"\n" +
      "Text 2: \"Across 12 firms, deliverable throughput fell 6% during full-remote periods.\"\n\n" +
      "How would the author of Text 2 most likely qualify the claim in Text 1?",
    choices: [
      "By denying that remote work has any benefits.",
      "By noting that self-report and measured throughput can diverge.",
      "By proposing universal in-person work.",
      "By agreeing wellbeing is the only metric.",
    ], correct: 1 },
];

const EXT_WRITING: BankQuestion[] = [
  { id: "wri-gram-3", skillId: "tip", skill: "Grammar & usage", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice conforms to Standard English?\n\n\"The data ___ inconclusive, but the trend is suggestive.\"",
    choices: ["is", "are", "be", "having been"], correct: 1,
    rationale: "\"Data\" treated as plural in formal usage → \"are.\"" },
  { id: "wri-punct-3", skillId: "shaft1", skill: "Punctuation", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice correctly punctuates the list?\n\n\"The reading list includes three novels ___ Beloved, Middlemarch, and The Plague.\"",
    choices: [", ", " — ", ": ", "; "], correct: 2,
    rationale: "Colon introduces a list following an independent clause." },
  { id: "wri-trans-3", skillId: "shaft2", skill: "Transitions", section: "Reading & Writing", difficulty: 4,
    prompt: "Which transition best fits?\n\n\"The new dam will reduce flooding in three towns. ___, the reservoir will displace several hundred families.\"",
    choices: ["Therefore", "Likewise", "However", "In short"], correct: 2 },
  { id: "wri-rhet-2", skillId: "plume", skill: "Rhetorical synthesis", section: "Reading & Writing", difficulty: 5,
    prompt:
      "A student wants to argue that nationwide pre-K expands kindergarten readiness. Notes:\n• A 2023 study of 8 states found a 12-point gain on early literacy assessments after universal pre-K.\n• In control districts, scores rose only 3 points.\n\nWhich sentence uses the notes most effectively?",
    choices: [
      "Some states have pre-K and some do not.",
      "Across eight states with universal pre-K, students gained 12 points on early literacy assessments versus 3 in matched controls — evidence that the program meaningfully improves kindergarten readiness.",
      "Studies on pre-K vary widely.",
      "Literacy is important for kindergarten.",
    ], correct: 1 },
  { id: "wri-bound-2", skillId: "barb", skill: "Boundaries", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice best joins the two related ideas?\n\n\"The committee met for hours ___ no agreement was reached.\"",
    choices: [
      "for hours, no agreement",
      "for hours; however, no agreement",
      "for hours and no agreement",
      "for hours but no agreement,",
    ], correct: 1,
    rationale: "Two independent clauses joined with a semicolon + conjunctive adverb." },
];

/* ─── Pass 3 · deepen every skill (algebra) ───────────────────────────── */
const DEEP_ALGEBRA: BankQuestion[] = [
  { id: "alg-eq-6", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 1,
    prompt: "If x + 12 = 20, what is x?", choices: ["6", "7", "8", "9"], correct: 2,
    rationale: "x = 20 − 12 = 8." },
  { id: "alg-eq-7", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 2,
    prompt: "Solve: 4(x − 3) = 2x + 2.", choices: ["5", "6", "7", "8"], correct: 2,
    rationale: "4x − 12 = 2x + 2 → 2x = 14 → x = 7." },
  { id: "alg-eq-8", skillId: "lin-eq", skill: "Linear equations", section: "Math", difficulty: 3,
    prompt: "If (x + 3)/2 − (x − 1)/3 = 2, what is x?",
    choices: ["−1", "1", "3", "5"], correct: 1,
    rationale: "Multiply by 6: 3(x + 3) − 2(x − 1) = 12 → x + 11 = 12 → x = 1." },
  { id: "alg-sys-5", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 2,
    prompt: "If x + 2y = 10 and 3x − 2y = 6, what is x?", choices: ["2", "3", "4", "5"], correct: 2,
    rationale: "Add: 4x = 16 → x = 4." },
  { id: "alg-sys-6", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 4,
    prompt: "If 2x − y = 7 and x + 2y = 6, what is x + y?",
    choices: ["3", "4", "5", "6"], correct: 2,
    rationale: "From (1): y = 2x − 7. Sub: x + 2(2x − 7) = 6 → 5x = 20 → x = 4, y = 1. x + y = 5." },
  { id: "alg-sys-7", skillId: "lin-sys", skill: "Systems of equations", section: "Math", difficulty: 5,
    prompt: "How many solutions does the system 6x + 4y = 14 and 3x + 2y = 5 have?",
    choices: ["0", "1", "2", "infinitely many"], correct: 0,
    rationale: "Multiply 2nd by 2: 6x + 4y = 10 ≠ 14 → no solution (parallel)." },
  { id: "alg-ineq-4", skillId: "lin-ineq", skill: "Linear inequalities", section: "Math", difficulty: 2,
    prompt: "Solve: 5x + 3 ≥ 18.", choices: ["x ≥ 2", "x ≥ 3", "x ≥ 4", "x ≥ 5"], correct: 1,
    rationale: "5x ≥ 15 → x ≥ 3." },
  { id: "alg-ineq-5", skillId: "lin-ineq", skill: "Linear inequalities", section: "Math", difficulty: 3,
    prompt: "Which compound inequality is equivalent to −2 ≤ 3 − x < 5?",
    choices: ["−2 < x ≤ 5", "−2 ≤ x ≤ 5", "−5 ≤ x < 2", "1 ≤ x < 8"], correct: 0,
    rationale: "Subtract 3 from all parts: −5 ≤ −x < 2. Divide by −1 and flip the inequalities: 5 ≥ x > −2, i.e. −2 < x ≤ 5." },
  { id: "alg-fn-4", skillId: "lin-fn", skill: "Linear functions", section: "Math", difficulty: 3,
    prompt: "If g(x) = −2x + 5, what is g(−3)?",
    choices: ["−1", "1", "11", "−11"], correct: 2,
    rationale: "g(−3) = −2(−3) + 5 = 6 + 5 = 11." },
  { id: "alg-fn-5", skillId: "lin-fn", skill: "Linear functions", section: "Math", difficulty: 4,
    prompt: "A linear function has slope 4 and passes through (2, −3). What is f(0)?",
    choices: ["−11", "−5", "5", "11"], correct: 0,
    rationale: "y + 3 = 4(x − 2) → y = 4x − 11 → f(0) = −11." },
  { id: "alg-abs-4", skillId: "abs-val", skill: "Absolute value", section: "Math", difficulty: 3,
    prompt: "Solve: |3x − 1| = 8.",
    choices: ["x = 3 or x = −7/3", "x = 3 only", "x = −3 only", "x = 1 or x = −1"], correct: 0,
    rationale: "3x − 1 = ±8 → x = 3 or x = −7/3." },
];

/* ─── Pass 3 · deepen every skill (advanced math) ─────────────────────── */
const DEEP_ADVMATH: BankQuestion[] = [
  { id: "adv-quad-5", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 2,
    prompt: "Solve: x² − 5x + 6 = 0.",
    choices: ["x = 1, 6", "x = 2, 3", "x = −2, −3", "x = 6, −1"], correct: 1,
    rationale: "(x−2)(x−3) = 0 → x = 2 or 3." },
  { id: "adv-quad-6", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 4,
    prompt: "If the parabola y = x² + bx + 9 is tangent to the x-axis, what are the possible values of b?",
    choices: ["±3", "±6", "±9", "±12"], correct: 1,
    rationale: "Discriminant 0: b² − 36 = 0 → b = ±6." },
  { id: "adv-quad-7", skillId: "quad", skill: "Quadratics", section: "Math", difficulty: 5,
    prompt: "If the roots of 2x² + bx − 3 = 0 are r and s, what is r + s in terms of b?",
    choices: ["−b/2", "b/2", "−3/2", "3/2"], correct: 0,
    rationale: "By Vieta's: r + s = −b/a = −b/2." },
  { id: "adv-poly-5", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 3,
    prompt: "Which is a factor of x³ − 27?",
    choices: ["x − 3", "x + 3", "x² − 9", "x² + 9"], correct: 0,
    rationale: "Difference of cubes: x³ − 27 = (x − 3)(x² + 3x + 9)." },
  { id: "adv-poly-6", skillId: "poly", skill: "Polynomials", section: "Math", difficulty: 4,
    prompt: "If P(x) = x³ + kx² + 2x − 3 and P(1) = 0, what is k?",
    choices: ["−1", "0", "1", "2"], correct: 1,
    rationale: "1 + k + 2 − 3 = 0 → k = 0." },
  { id: "adv-exp-4", skillId: "exp", skill: "Exponentials", section: "Math", difficulty: 2,
    prompt: "Evaluate: 5^0 + 5^1 + 5^2.",
    choices: ["25", "26", "30", "31"], correct: 3,
    rationale: "1 + 5 + 25 = 31." },
  { id: "adv-exp-5", skillId: "exp", skill: "Exponentials", section: "Math", difficulty: 4,
    prompt: "A car's value depreciates 15% per year. If it's worth $20,000 today, what is it worth after 2 years (to the nearest dollar)?",
    choices: ["$14,450", "$14,725", "$15,300", "$17,000"], correct: 0,
    rationale: "20000 · 0.85² = 20000 · 0.7225 = 14,450." },
  { id: "adv-rat-4", skillId: "rat", skill: "Rational expressions", section: "Math", difficulty: 4,
    prompt: "Simplify: (x + 5)/(x² + 7x + 10).",
    choices: ["1/(x + 2)", "1/(x − 2)", "1/(x + 5)", "(x + 5)/(x + 2)"], correct: 0,
    rationale: "Denominator factors as (x + 2)(x + 5) → cancel (x + 5)." },
];

/* ─── Pass 3 · deepen every skill (data) ──────────────────────────────── */
const DEEP_DATA: BankQuestion[] = [
  { id: "data-rate-4", skillId: "fulcrum", skill: "Ratios & rates", section: "Math", difficulty: 1,
    prompt: "If 3 oranges cost $2.40, what does 1 orange cost?",
    choices: ["$0.60", "$0.70", "$0.80", "$0.90"], correct: 2,
    rationale: "$2.40 / 3 = $0.80." },
  { id: "data-rate-5", skillId: "fulcrum", skill: "Ratios & rates", section: "Math", difficulty: 3,
    prompt: "A car travels 240 miles in 4 hours. At the same rate, how far in 7 hours?",
    choices: ["360", "400", "420", "480"], correct: 2,
    rationale: "Rate = 60 mph; 60 · 7 = 420." },
  { id: "data-pct-4", skillId: "beam-l", skill: "Percentages", section: "Math", difficulty: 2,
    prompt: "What is 18% of 250?",
    choices: ["35", "40", "45", "50"], correct: 2,
    rationale: "0.18 · 250 = 45." },
  { id: "data-pct-5", skillId: "beam-l", skill: "Percentages", section: "Math", difficulty: 4,
    prompt: "After a 30% discount, an item costs $63. What was the original price?",
    choices: ["$80", "$85", "$90", "$95"], correct: 2,
    rationale: "63 / 0.70 = 90." },
  { id: "data-stat-5", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 3,
    prompt: "What is the mode of {2, 5, 7, 5, 3, 5, 8}?",
    choices: ["3", "5", "6", "7"], correct: 1,
    rationale: "5 appears most often." },
  { id: "data-stat-6", skillId: "beam-r", skill: "Statistics", section: "Math", difficulty: 5,
    prompt: "Which change to the data set {4, 6, 8, 10, 12} would NOT change the median?",
    choices: ["Add 0", "Add 100", "Add 8", "Add 4"], correct: 2,
    rationale: "Median of original is 8. Adding another 8 keeps median at 8." },
  { id: "data-prob-4", skillId: "pan-l", skill: "Probability", section: "Math", difficulty: 3,
    prompt: "A bag has 4 red and 6 green marbles. Two are drawn without replacement. P(both red) = ?",
    choices: ["2/15", "3/25", "1/5", "1/4"], correct: 0,
    rationale: "(4/10)(3/9) = 12/90 = 2/15." },
  { id: "data-prob-5", skillId: "pan-l", skill: "Probability", section: "Math", difficulty: 4,
    prompt: "A spinner has equal sectors A, B, C, D. P(A then B in two spins) = ?",
    choices: ["1/4", "1/8", "1/16", "1/2"], correct: 2,
    rationale: "(1/4)(1/4) = 1/16." },
  { id: "data-inf-4", skillId: "pan-r", skill: "Data inference", section: "Math", difficulty: 4,
    prompt: "A line of best fit for hours-studied (x) vs test score (y) is y = 6x + 50. The 6 represents:",
    choices: [
      "the predicted score at 0 hours.",
      "the increase in predicted score per additional hour studied.",
      "the average score in the data set.",
      "the strength of the linear relationship.",
    ], correct: 1,
    rationale: "Slope = predicted change in y per unit change in x." },
];

/* ─── Pass 3 · deepen every skill (geometry) ──────────────────────────── */
const DEEP_GEO: BankQuestion[] = [
  { id: "geo-ang-3", skillId: "apex", skill: "Angles & lines", section: "Math", difficulty: 2,
    prompt: "A linear pair has angles of measure x and (3x − 20)°. What is x?",
    choices: ["40", "45", "50", "55"], correct: 2,
    rationale: "x + 3x − 20 = 180 → 4x = 200 → x = 50." },
  { id: "geo-ang-4", skillId: "apex", skill: "Angles & lines", section: "Math", difficulty: 4,
    prompt: "In a regular polygon each interior angle is 144°. How many sides does it have?",
    choices: ["8", "10", "12", "15"], correct: 1,
    rationale: "Interior angle = 180(n−2)/n = 144 → n = 10." },
  { id: "geo-tri-4", skillId: "b-l", skill: "Triangles", section: "Math", difficulty: 3,
    prompt: "An equilateral triangle has perimeter 18. What is its area?",
    choices: ["6√3", "9√3", "12√3", "18√3"], correct: 1,
    rationale: "Side 6 → area = (√3/4)·36 = 9√3." },
  { id: "geo-tri-5", skillId: "b-l", skill: "Triangles", section: "Math", difficulty: 5,
    prompt: "A 30-60-90 triangle has hypotenuse 12. What is the length of the longer leg?",
    choices: ["6", "6√2", "6√3", "12"], correct: 2,
    rationale: "Sides ratio 1 : √3 : 2; hypotenuse 12 → longer leg = 6√3." },
  { id: "geo-circ-4", skillId: "b-r", skill: "Circles", section: "Math", difficulty: 3,
    prompt: "A circle has equation (x − 2)² + (y + 3)² = 25. What is its center?",
    choices: ["(2, −3)", "(−2, 3)", "(2, 3)", "(−2, −3)"], correct: 0,
    rationale: "Center is (h, k) = (2, −3)." },
  { id: "geo-circ-5", skillId: "b-r", skill: "Circles", section: "Math", difficulty: 4,
    prompt: "A sector with central angle 90° in a circle of radius 4 has area:",
    choices: ["π", "2π", "4π", "8π"], correct: 2,
    rationale: "(90/360) · π · 16 = 4π." },
  { id: "geo-trig-4", skillId: "cent", skill: "Trigonometry", section: "Math", difficulty: 3,
    prompt: "Convert 60° to radians.",
    choices: ["π/6", "π/4", "π/3", "π/2"], correct: 2,
    rationale: "60° · π/180 = π/3." },
  { id: "geo-trig-5", skillId: "cent", skill: "Trigonometry", section: "Math", difficulty: 5,
    prompt: "If tan(θ) = 3/4 and 0 < θ < 90°, what is sin(θ)?",
    choices: ["3/5", "4/5", "3/4", "5/4"], correct: 0,
    rationale: "Opp 3, adj 4, hyp 5 → sin = 3/5." },
];

/* ─── Pass 3 · deepen every skill (reading) ───────────────────────────── */
const DEEP_READING: BankQuestion[] = [
  { id: "read-main-3", skillId: "eye-l", skill: "Main idea", section: "Reading & Writing", difficulty: 4,
    prompt:
      "\"The hand-axe — a stone tool used by early humans for nearly a million years — is often described as the longest-lived design in human history. But its persistence may say less about its perfection and more about a slow rate of cultural transmission. When small bands rarely meet, even small improvements take generations to spread.\"\n\nWhich choice best states the main idea?",
    choices: [
      "The hand-axe was a perfectly designed tool.",
      "The hand-axe's longevity reflects how slowly innovations could spread among isolated groups.",
      "Hand-axes were used for nearly a million years.",
      "Cultural transmission was nonexistent in early humans.",
    ], correct: 1 },
  { id: "read-inf-3", skillId: "eye-r", skill: "Inference", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"When the lights came back on, the cake on the kitchen counter was untouched. Marcus glanced at the dog, sleeping on the rug, and laughed.\"\n\nWhich inference is best supported?",
    choices: [
      "Marcus had worried the dog might eat the cake.",
      "The dog was hungry.",
      "Marcus had baked the cake himself.",
      "The lights had been out all evening.",
    ], correct: 0 },
  { id: "read-inf-4", skillId: "eye-r", skill: "Inference", section: "Reading & Writing", difficulty: 5,
    prompt:
      "\"The director did not name the donor in her remarks; instead, she described, at length, the donor's late teacher. By the end, only those who had known the donor personally understood whom the gift had honored.\"\n\nWhich inference is best supported?",
    choices: [
      "The donor preferred not to be publicly named.",
      "The director disliked the donor.",
      "The donor was the late teacher.",
      "The audience was unfamiliar with the teacher.",
    ], correct: 0 },
  { id: "read-evid-3", skillId: "beak", skill: "Command of evidence", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"A research team argues that public bike-share programs reduce short-distance car trips. Their evidence will be most strongly supported by data showing ______.\"",
    choices: [
      "growth in bike-share membership over time.",
      "a measured reduction in car trips under five miles after launch in matched cities.",
      "rider satisfaction surveys with high approval.",
      "increased public transit use citywide.",
    ], correct: 1 },
  { id: "read-vocab-4", skillId: "wing-l", skill: "Vocabulary", section: "Reading & Writing", difficulty: 3,
    prompt:
      "\"Critics found her novel ___ — its plot familiar, its characters thinly drawn.\"\n\nWhich word best fits?",
    choices: ["derivative", "magnanimous", "quixotic", "incandescent"], correct: 0,
    rationale: "Familiar plot, thin characters → derivative (lacking originality)." },
  { id: "read-vocab-5", skillId: "wing-l", skill: "Vocabulary", section: "Reading & Writing", difficulty: 5,
    prompt:
      "\"His remarks, though phrased as a compliment, carried a ___ edge that the room could not ignore.\"\n\nWhich word best fits?",
    choices: ["pedantic", "saturnine", "barbed", "inscrutable"], correct: 2,
    rationale: "\"Edge\" + sting beneath compliment → barbed." },
  { id: "read-struct-3", skillId: "wing-r", skill: "Text structure", section: "Reading & Writing", difficulty: 4,
    prompt:
      "Which best describes the underlined sentence's role?\n\n\"Most studies of urban heat focus on summer peaks. **Yet new research shows that elevated overnight temperatures, not midday highs, drive most heat-related hospital admissions.** That shift suggests cooling-center hours should expand into the night.\"",
    choices: [
      "It introduces a counterintuitive finding that motivates a policy implication.",
      "It restates the topic of the paragraph.",
      "It introduces an anecdote.",
      "It dismisses the prior research.",
    ], correct: 0 },
  { id: "read-cross-3", skillId: "foot", skill: "Cross-text synthesis", section: "Reading & Writing", difficulty: 4,
    prompt:
      "Text 1: \"AI tutoring systems can match novice human tutors on basic skill drilling.\"\n" +
      "Text 2: \"In a 2024 trial, AI tutors underperformed human tutors on motivating student persistence.\"\n\n" +
      "How would the author of Text 2 most likely qualify Text 1's claim?",
    choices: [
      "By denying that AI tutors can drill basic skills.",
      "By noting that drilling and motivation are distinct outcomes that may diverge.",
      "By proposing that AI tutors replace human tutors.",
      "By agreeing without reservation.",
    ], correct: 1 },
];

/* ─── Pass 3 · deepen every skill (writing) ───────────────────────────── */
const DEEP_WRITING: BankQuestion[] = [
  { id: "wri-gram-4", skillId: "tip", skill: "Grammar & usage", section: "Reading & Writing", difficulty: 2,
    prompt: "Which choice conforms to Standard English?\n\n\"Either the teacher or her students ___ responsible.\"",
    choices: ["is", "are", "have been", "being"], correct: 1,
    rationale: "Verb agrees with the nearer subject (students → are)." },
  { id: "wri-gram-5", skillId: "tip", skill: "Grammar & usage", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice maintains parallel structure?\n\n\"The chef's signature dishes are bold in flavor, ___, and unconventional in plating.\"",
    choices: ["use seasonal ingredients", "seasonal in their ingredients", "they include seasonal ingredients", "with seasonal ingredients"], correct: 1,
    rationale: "Parallel: bold in flavor / seasonal in their ingredients / unconventional in plating." },
  { id: "wri-punct-4", skillId: "shaft1", skill: "Punctuation", section: "Reading & Writing", difficulty: 3,
    prompt: "Which choice correctly uses a dash?\n\n\"The old factory ___ once the city's largest employer ___ now stands empty.\"",
    choices: [", , ", "— —", "; ;", ": :"], correct: 1,
    rationale: "Paired em dashes set off a non-restrictive aside." },
  { id: "wri-punct-5", skillId: "shaft1", skill: "Punctuation", section: "Reading & Writing", difficulty: 5,
    prompt: "Which choice correctly uses an apostrophe?\n\n\"The judges' decisions were unanimous, but each ___ reasoning differed.\"",
    choices: ["judges'", "judges", "judge's", "judges's"], correct: 2,
    rationale: "\"Each\" is singular → singular possessive: judge's." },
  { id: "wri-trans-4", skillId: "shaft2", skill: "Transitions", section: "Reading & Writing", difficulty: 3,
    prompt: "Which transition best fits?\n\n\"The senator opposed the original bill. ___, she voted for the amended version.\"",
    choices: ["Therefore", "Nonetheless", "Likewise", "In short"], correct: 1 },
  { id: "wri-trans-5", skillId: "shaft2", skill: "Transitions", section: "Reading & Writing", difficulty: 4,
    prompt: "Which transition best fits?\n\n\"The early returns showed a clear lead. ___, the count was not yet complete.\"",
    choices: ["Consequently", "However", "For example", "In addition"], correct: 1 },
  { id: "wri-rhet-3", skillId: "plume", skill: "Rhetorical synthesis", section: "Reading & Writing", difficulty: 3,
    prompt:
      "A student is writing about why bike lanes increase road safety. Notes:\n• Cities that added protected bike lanes saw a 17% drop in cyclist injuries.\n• Drivers in those cities reported feeling safer overall.\n\nWhich sentence uses the notes most effectively?",
    choices: [
      "Some cities have bike lanes.",
      "Cities with new protected bike lanes saw cyclist injuries drop 17% and drivers reported feeling safer — evidence that the lanes benefit both groups.",
      "Bike lanes are popular.",
      "Drivers and cyclists share the road.",
    ], correct: 1 },
  { id: "wri-bound-3", skillId: "barb", skill: "Boundaries", section: "Reading & Writing", difficulty: 4,
    prompt: "Which choice best fixes the run-on?\n\n\"She finished her thesis last month she has not yet defended it.\"",
    choices: [
      "month, she",
      "month; she",
      "month and she",
      "month she,",
    ], correct: 1,
    rationale: "Two independent clauses → semicolon (or period)." },
];

export const QUESTION_BANK: BankQuestion[] = [
  ...ALGEBRA, ...ADVMATH, ...DATA, ...GEO, ...READING, ...WRITING,
  ...EXT_ALGEBRA, ...EXT_ADVMATH, ...EXT_DATA, ...EXT_GEO, ...EXT_READING, ...EXT_WRITING,
  ...DEEP_ALGEBRA, ...DEEP_ADVMATH, ...DEEP_DATA, ...DEEP_GEO, ...DEEP_READING, ...DEEP_WRITING,
].map((q) => ({ ...q, origin: "static" as const }));
