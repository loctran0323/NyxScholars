export type MaterialCategory = "SAT" | "ACT" | "AP" | "College Admissions" | "Strategy";
export type MaterialDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface MaterialGuide {
  slug: string;
  title: string;
  blurb: string;
  category: MaterialCategory;
  difficulty: MaterialDifficulty;
  readingTime: string;
  author: string;
  body: string; // plain text with paragraph breaks
}

export const MATERIALS: MaterialGuide[] = [
  {
    slug: "sat-heart-of-algebra",
    title: "Heart of Algebra: the SAT's most-tested skill",
    blurb: "Linear equations, systems, and inequalities — what they actually look like under the timer, and the four shortcuts that beat factoring.",
    category: "SAT",
    difficulty: "Beginner",
    readingTime: "8 min",
    author: "Anika, Princeton '26",
    body: `Half of every SAT Math module is "Heart of Algebra" — linear equations, systems, and inequalities. The College Board does not test creativity here; it tests speed.

The four moves that beat factoring under the timer:

1. When a linear equation has fractions, multiply through by the LCD on both sides immediately. Don't reduce — multiply, then solve.

2. When you see a system, scan for the variable that's already isolated or has the smallest coefficient. Substitution is faster than elimination 70% of the time on the SAT.

3. Inequalities flip when you multiply or divide by a negative. Underline the negative sign before you start solving so you don't forget.

4. "How many solutions" questions are about coefficient ratios. Parallel lines (no solutions) → same slope, different intercept. Coincident (infinite) → same slope and same intercept. Single solution → different slopes.

The gotcha most students miss: if a question gives you two equations and asks for x + y or 2x − y, do not solve for x and y individually. Add or subtract the equations directly. The SAT writes those questions specifically because students waste 90 seconds solving the system.`,
  },
  {
    slug: "sat-passport-advanced-math",
    title: "Passport to Advanced Math: the discriminant trick",
    blurb: "Quadratics, polynomials, and exponentials. When to factor, when to use the formula, and when to skip both.",
    category: "SAT",
    difficulty: "Intermediate",
    readingTime: "10 min",
    author: "Anika, Princeton '26",
    body: `If a question says "how many real solutions does this equation have", do not factor. Compute the discriminant: b² − 4ac.

Positive → two real roots.
Zero → one (double) root.
Negative → no real roots.

This saves 60 seconds per question, every single time. Roughly three questions per test ask this in some form.

For polynomials: P(x) has (x − r) as a factor if and only if P(r) = 0. Use this when the question gives you "if (x − 3) is a factor, what is k". Plug r in for x, set the polynomial to zero, solve.

For exponentials: when the bases are different, take logs only as a last resort. The SAT almost always writes exponential questions where you can rewrite to a common base. 9^x = 27^(x+1) becomes 3^(2x) = 3^(3(x+1)) → 2x = 3x + 3 → x = −3.

The trap: vertex form. If a question asks for the minimum value of y = ax² + bx + c with a > 0, complete the square or use −b/(2a) for the x-coordinate, then plug back in. Students waste time graphing.`,
  },
  {
    slug: "sat-rw-evidence",
    title: "Reading & Writing: command of evidence in 53 seconds",
    blurb: "The new digital SAT gives you 53 seconds per question. Here's the order of operations that fits inside it.",
    category: "SAT",
    difficulty: "Intermediate",
    readingTime: "7 min",
    author: "Ben, Yale '25",
    body: `Each Reading & Writing question has one short text (50–150 words) and one question. You have 53 seconds. The natural reading order — passage, then question — does not fit.

Reverse it. Read the question first. Note what's asked: vocabulary in context? Main idea? Inference? Evidence?

Now skim only for the part of the passage that answers that question. For evidence questions ("which choice most logically completes the text"), the answer is always grammatically and tonally consistent with the sentence before it. Eliminate any choice that contradicts a fact stated explicitly. Eliminate choices that introduce new claims not supported by the text.

You are usually picking between two finalists. The SAT's wrong-answer trap is "supported by a similar-sounding word." The right answer is the one whose claim could be substituted for the blank without changing what the passage already established.

If you cannot decide in 75 seconds, mark it and move on. You can come back. Spending 90 seconds on one R&W question costs you the right answer on the next two.`,
  },
  {
    slug: "sat-pacing-under-timer",
    title: "Pacing under the timer: the 12-22-32 check-in",
    blurb: "Most students don't run out of time because they're slow. They run out because they don't notice they're slow.",
    category: "Strategy",
    difficulty: "Beginner",
    readingTime: "5 min",
    author: "Ben, Yale '25",
    body: `The single biggest scoring habit I install in week one: the 12-22-32 check-in.

After question 12 of a 32-question Reading & Writing module, you should have at least 17 minutes left. If you have less than 16, you are in trouble. Start guess-eliminating on any question that takes more than 60 seconds.

After question 22, you should have at least 8 minutes. If you have less, you are now triaging — pick the answer you'd guess and move on; do not read the full passage.

After question 32, submit. Do not re-check unless you have a specific question you flagged. Re-checking is a low-yield activity; you tend to second-guess answers you got right.

This is not natural. Most students don't look at the clock until they're already behind. Pre-commit. Tape a small index card to your desk during practice that says "Q12: 17m. Q22: 8m. Q32: 0m." Within three practice tests it becomes muscle memory.`,
  },
  {
    slug: "act-science-skim-chart",
    title: "ACT Science: skim the chart, skip the prose",
    blurb: "The science test isn't about science. It's about charts. Here's the order that works.",
    category: "ACT",
    difficulty: "Beginner",
    readingTime: "6 min",
    author: "Anika, Princeton '26",
    body: `The ACT Science section is a reading test wearing a lab coat. About 80% of questions are answerable from charts and graphs alone, without reading the prose.

The order:

1. Read the question stem first. Find the variable it asks about (e.g., "as temperature increases, what happens to enzyme activity?").

2. Locate the figure that contains both variables. There is exactly one such figure per question.

3. Trace the relationship. Linear? Inverse? Asymptote? The answer choices use those exact words.

4. Only if the chart leaves it ambiguous, read the prose. The prose is most useful when a question asks "which hypothesis is best supported" or names a specific scientist's view.

The two question types that always require reading: (a) conflicting viewpoints — three short essays, no charts — and (b) experimental design ("what was the control variable"). For everything else, the prose is decoration.

Time budget: 35 minutes for 40 questions across 6 passages. That's 5–6 minutes per passage. The chart-only strategy gets you to 4.5.`,
  },
  {
    slug: "essay-first-sentence",
    title: "Personal statement: what the first sentence does",
    blurb: "Five hooks that work. Two that don't. The job of the first sentence is to earn the second.",
    category: "College Admissions",
    difficulty: "Advanced",
    readingTime: "9 min",
    author: "Daniela, Stanford '24",
    body: `Admissions officers read 50 essays a day. They decide whether you're worth their attention in the first sentence.

The five hooks that work:

1. Sensory specificity. "The dough was sticky in a way I had never felt before — like trying to pull apart wet paper." Smell, sight, touch, sound. Concrete, not abstract.

2. A small, strange fact about yourself. "I have read every Wikipedia article about prime numbers." If it's true and weird, it earns the next sentence.

3. A line of dialogue, attributed but no setup. "'You don't have to come back,' my grandfather said, the morning I left for boarding school." The reader fills in context as they go.

4. A claim you'll spend the essay defending. "I think most of my friends are bad at apologizing, and I think I might be too." Provocative, but yours.

5. An action mid-motion. "I was halfway through a phone call with a stranger about my sister's transcript when I realized I didn't actually know what she wanted." In medias res — but only if the rest of the essay justifies the drama.

The two that don't:

— "Ever since I was a child…" Dead on arrival. Every reader has read this 2,000 times.
— Dictionary definitions. Same problem. Stop.

The first sentence's job is to earn the second sentence. Nothing more. Don't try to compress your whole identity into it.`,
  },
  {
    slug: "college-list-balanced",
    title: "Building a balanced college list",
    blurb: "Reach, target, likely — but the categories don't mean what most students think they mean.",
    category: "College Admissions",
    difficulty: "Beginner",
    readingTime: "7 min",
    author: "Daniela, Stanford '24",
    body: `The standard advice: 3 reach, 3 target, 3 likely. Useful as a starting point, misleading in execution.

A reach is not "a school I really want to go to." A reach is a school where your stats put you in the bottom 25th percentile of admitted students. For schools below 15% admit rate (Stanford, MIT, the Ivies), every applicant is a reach regardless of stats — the admit rate is doing the work, not your file.

A target is a school where your stats are at or above the 50th percentile of admitted students AND the admit rate is above 25%. Many students mislabel selective schools (10–25% admit rate) as targets. They are not. Treat them as soft reaches.

A likely is a school where your stats put you in the top 25th percentile AND the admit rate is above 50%. Likely schools should still excite you. The mistake students make is putting "safety" schools they wouldn't actually attend. If you wouldn't enroll, take it off the list.

Total list: 8–12 schools. Fewer than 8 and you're underexposed; more than 12 and the supplemental essays dilute. Two reaches you'd be lucky to attend, four targets you'd be happy to attend, two likelies you'd be content to attend. If a school doesn't fit one of those three categories, it doesn't belong on the list.`,
  },
  {
    slug: "study-cadence-90-days",
    title: "The 90-day SAT plan that actually works",
    blurb: "Three months out from your test date, with two hours a week of tutoring. What the other twelve hours look like.",
    category: "Strategy",
    difficulty: "Intermediate",
    readingTime: "8 min",
    author: "Anika, Princeton '26",
    body: `Most students are told to "study a lot" without a structure. Here is the structure I use with every Nyx student starting 90 days out.

Weeks 1–2 — Diagnose. Take one full-length practice test, untimed. Then take one timed. The gap between those two scores is your "speed gap." Audit every miss: write a sentence in the margin saying why you got it wrong (concept gap? careless? misread?).

Weeks 3–4 — Concept fill. Spend 80% of your study time on the three weakest skills from week 1's audit. Use the Nyx sky map to surface them. One hour of focused drilling on a single skill beats five hours of mixed practice.

Weeks 5–8 — Mixed timed practice. One full-length test per week (timed, simulated). Two 30-minute drill sessions per week on the skills you missed most on the most recent test. The skills will rotate — that's expected.

Weeks 9–11 — Test simulation. Full-length test on Saturday morning at the time your real test starts. Same caffeine, same breakfast, same room. The point is to make the real test feel like rep #5, not rep #1.

Week 12 — Taper. One half-test on Monday. No work Wednesday through Friday. Light review of your error journal Saturday night. Sleep eight hours. Eat the same breakfast. The work is done.

The mistake: cramming the last week. Your score barely moves in week 12 — but a tired brain on test day costs 60 points. The taper is non-negotiable.`,
  },
  {
    slug: "sat-data-and-stats",
    title: "Problem Solving & Data: the eight question types",
    blurb: "Statistics, probability, units, and data interpretation. The College Board recycles the same eight shapes — here's the cheat sheet.",
    category: "SAT",
    difficulty: "Intermediate",
    readingTime: "9 min",
    author: "Anika, Princeton '26",
    body: `The Problem Solving & Data subscore covers about 25% of SAT Math. The College Board recycles the same eight question types — and once you can name the type, the procedure follows.

1. Unit conversion. "A car travels 88 ft per second; convert to mph." Multiply by 3600 and divide by 5280. The slow path is dimensional analysis; the fast path is to memorize that 60 mph = 88 ft/s.

2. Ratio at scale. "If the ratio of A to B is 2:5 and A + B = 280, what is B?" Set A = 2k, B = 5k → 7k = 280 → k = 40 → B = 200. Always introduce a single scaling variable k.

3. Percent change in two steps. "A price goes up 20%, then down 20% — net change?" Multiply: 1.20 × 0.80 = 0.96 → 4% net decrease. Order does not matter; the answer is the product of factors.

4. Mean from a sum. If a question gives you a mean and an unknown value, set up: sum = mean × count. Solve for the unknown. Always faster than averaging individual numbers.

5. Median position. For n values sorted, the median is at position (n+1)/2 if n is odd, or the average of n/2 and n/2 + 1 if n is even. Inserting a value at the median itself does not change the median.

6. Probability with conditional. "Given the student is in 11th grade, P(plays a sport)?" Look only at the row for 11th graders; ignore the table totals. The denominator is the conditioning row's total.

7. Linear regression interpretation. The slope is the predicted change in y per one-unit increase in x. The intercept is the predicted y when x = 0. Both come up by name.

8. Margin of error. "An estimate of 42% with margin of error 3%" means the 95% confidence interval is 39–45%. The SAT does not ask you to compute MOE; it asks you to interpret it.

The trap on every PSDA question: "which is the most reasonable inference." The right answer is the cautious one. If the choice says "causes," reject. If it says "is associated with" or "tends to be higher among," that's usually right.`,
  },
  {
    slug: "sat-grammar-cheatsheet",
    title: "Grammar rules the SAT actually tests",
    blurb: "Fifteen rules cover 90% of the points. Here are the high-yield ones in order of frequency.",
    category: "SAT",
    difficulty: "Beginner",
    readingTime: "11 min",
    author: "Ben, Yale '25",
    body: `The Reading & Writing section tests grammar by paraphrasing the same fifteen rules over and over. Here are the high-yield ones, in rough order of frequency.

Subject-verb agreement. "The collection of rare books is in the library." Strip prepositional phrases first. The subject is "collection" (singular), not "books."

Pronoun agreement. "Each student must bring their notebook." On the SAT, "each" is singular — the answer is "his or her" or rephrase. Watch for "everyone," "anyone," "neither," "either" — all singular.

Comma splices. Two independent clauses cannot be joined by a comma alone. Either use a period, a semicolon, or a comma with a conjunction (and, but, or, nor, for, so, yet).

Modifier placement. "Walking through the park, the trees seemed taller." The trees aren't walking — the modifier is dangling. Either rephrase or move the modifier so it points to the right noun.

Parallel structure. "She likes reading, writing, and to swim." All three should match: reading, writing, and swimming.

Apostrophes. "It's" = it is. "Its" = belongs to it. The SAT loves this one.

Colons vs semicolons. A colon introduces a list or expansion after an independent clause. A semicolon joins two independent clauses (or separates list items that contain commas).

Dashes. Use paired em dashes (—) the way you'd use paired commas — for non-restrictive asides. The dashes are slightly more emphatic.

Tense consistency. Within a paragraph, do not switch between past and present without a reason. The SAT often offers four choices in four different tenses; pick the one that matches surrounding sentences.

Who vs whom. Whoever / whoever does X. Whomever / X does to whomever. If you can substitute "he" or "she," it's who/whoever; if you can substitute "him" or "her," it's whom/whomever.

Less vs fewer. Fewer for countable; less for uncountable. "Fewer cars, less traffic."

That vs which. "That" introduces restrictive clauses (no comma). "Which" introduces non-restrictive (with comma). "The book that I bought" vs "The book, which I bought, …"

Comparatives. Two things → -er or "more." Three or more → -est or "most." "Better of the two" but "best of the three."

Idioms with prepositions. "Different from" (not "different than" on the SAT). "Insist on." "Concerned about." Most idioms come up in 2 of every 4 R&W modules.

Subjunctive. "If I were a millionaire" (not "was"). Required after "if," "wish," "as if" with hypotheticals.

The other 10% of grammar points come from rules so rare they're not worth memorizing. Master these fifteen and you'll get 95% of grammar questions right.`,
  },
  {
    slug: "act-english-five-rules",
    title: "ACT English in five rules",
    blurb: "Most of ACT English is one of five things. Once you can name the rule from the question stem, you're already 80% there.",
    category: "ACT",
    difficulty: "Intermediate",
    readingTime: "8 min",
    author: "Ben, Yale '25",
    body: `ACT English is 75 questions in 45 minutes — 36 seconds each. You cannot read carefully. You can pattern-match.

Rule 1: Conciseness wins. If three answer choices say the same thing in different lengths, the shortest grammatically correct one is right. Wordy answers ("at this point in time") lose to short ones ("now") roughly 8 out of 10 times.

Rule 2: Punctuation tracks clauses. Read the sentence aloud. If both halves can stand alone, you need either a period, a semicolon, or a comma + FANBOYS conjunction. If one half is dependent, you need a comma. If neither is independent, no punctuation between them.

Rule 3: Pronouns must have one and only one antecedent. If you read a sentence and can't immediately identify what "it" or "they" refers to, the answer is the choice that names the noun explicitly.

Rule 4: Modifiers go next to what they modify. Especially for opening participial phrases. "Running through the field, the dog…" — the noun right after the comma must be doing the running.

Rule 5: Word choice is rarely about vocabulary. It's about register and idiom. The wrong choices on word-choice questions are usually too informal ("kids" for "children") or too formal ("utilize" for "use") for the surrounding text.

The structure tip that beats most students: do not read the passage straight through. Skim each paragraph for one sentence, then attack the questions tied to that paragraph. Save the "main idea" and "best placement of new sentence" questions for last — they require holistic understanding, but only after you've answered the discrete grammar ones.

Time budget: 8.5 minutes per passage of 15 questions. If you're past 9 minutes on any passage, stop, fill in your best guesses for the remaining questions, and move on.`,
  },
  {
    slug: "ap-statistics-frq",
    title: "AP Statistics: how to write a 4-out-of-4 FRQ response",
    blurb: "Each FRQ rubric awards points in fixed bins. Knowing the bins changes how you write.",
    category: "AP",
    difficulty: "Advanced",
    readingTime: "10 min",
    author: "Anika, Princeton '26",
    body: `The AP Statistics FRQ section is graded against a published rubric: each free-response question is scored 0–4 in fixed bins. If you know the bins, you can write to them. The rubric does not reward eloquence; it rewards completeness.

For inference problems (about 4 of every 6 FRQs), the rubric is always:

Hypotheses. State H₀ and Hₐ in symbols AND in context. Skipping the in-context phrasing costs a point every time.

Conditions. Random sample. Independence (10% rule for sampling without replacement). Sample size (n ≥ 30, or np ≥ 10 and n(1−p) ≥ 10). State each condition explicitly. "Conditions met" without naming them gets zero points.

Test name and statistics. "Two-sample t-test for difference of means." Then report t, df, p-value (or χ², F, z as appropriate). Use four decimals.

Conclusion. Reject or fail to reject in context, in plain English. Always tie back to the original question. Never write "we accept the null."

For descriptive problems, the bins are usually:

Center, spread, shape, outliers — name all four if asked to describe a distribution. Many students name two and lose two points.

Comparing two distributions: comparative language is required. "The treatment group's median (12) was higher than the control's (8) and the spread was similar (IQR ~4 in both)." Just listing the two summary stats side by side is not comparing.

For probability problems:

Identify the model. Binomial? Geometric? Normal? Each has a different formula. State the model in one sentence before computing.

Show the substitution. Even with a calculator, write 1 − binomcdf(20, 0.3, 6) before reporting 0.4067. The graders need to see the setup.

The thing nobody tells you: writing too much loses points just as fast as writing too little. Each rubric bin awards a point for hitting the keyword and reduces it for contradicting yourself elsewhere. Tight, structured responses score best.`,
  },
  {
    slug: "essay-supplements",
    title: "Supplemental essays: the three questions schools really ask",
    blurb: "Most supplements are some form of three core prompts in disguise. Once you can spot which one, the answer template falls out.",
    category: "College Admissions",
    difficulty: "Advanced",
    readingTime: "10 min",
    author: "Daniela, Stanford '24",
    body: `Selective schools each have a "supplemental" set, but if you read 80 of them in a row, three core prompts appear over and over.

Prompt A: "Why us?" The school is asking whether you've done your homework AND whether you'll thrive in their specific environment. Mediocre answers list majors and clubs. Strong answers identify two specific resources or features at the school and explain how each one will change what you do.

Template that works: "I want to do X. At [school], the [specific program/professor/lab/tradition] would change how I do X by Y. The student-run [thing] would let me practice." Two specifics, both explained. The trap is name-dropping without explaining why each thing matters to you. Admissions officers detect this in seconds.

Prompt B: "Tell us about a community you belong to." This is asking how you treat people. Weak answers describe the community. Strong answers describe your specific role and one moment that revealed something about how you see your responsibility within the community. Avoid generic communities (your school, your sports team) unless you can write about them with specificity that surprises the reader.

Prompt C: "What's intellectually exciting to you?" The hardest of the three because students panic and write about the major they're applying to. The school is not asking what you'll major in. It's asking whether you can think. Pick a question that does not have an easy answer — a tension between two things you believe, a problem you keep returning to, a fact about the world that you haven't been able to stop thinking about. Show the thinking, not the conclusion.

The 250-word supplement is harder than the 650-word personal statement. With less space, every sentence has to do work. Cut all transitional phrases ("furthermore," "in addition," "as a result"). Cut all metacommentary ("I have always been interested in"). Start with the action, not the framing.

What separates a strong supplement from an average one is not the topic. It's the percent of the words doing concrete work versus the percent setting up vague claims. Aim for 70% concrete.`,
  },
  {
    slug: "interview-frame",
    title: "College interviews: the three-sentence frame",
    blurb: "Most interviews ask the same six questions. A simple frame keeps your answers from rambling.",
    category: "College Admissions",
    difficulty: "Beginner",
    readingTime: "6 min",
    author: "Daniela, Stanford '24",
    body: `Alumni interviewers are nervous too. They have a one-page sheet and a 30-minute slot. Most of them ask the same six questions:

1. Tell me about yourself.
2. Why this school?
3. What do you do outside of class?
4. Tell me about a challenge you've faced.
5. What are you reading / curious about right now?
6. Do you have questions for me?

The three-sentence frame works for all of them:

Sentence 1: A specific, concrete fact. "I run the school newspaper." Not "I'm passionate about journalism."

Sentence 2: A small story or moment. "Last spring, we ran a story about the food contractor that drew complaints from the principal." This is what makes you memorable. The interviewer is going to write notes; the moment is what they'll remember.

Sentence 3: What it taught you, in one sentence. "It taught me that local reporting can change institutional decisions in ways national reporting often can't." This gestures at meaning without overreaching.

For "tell me about yourself," string two of these together. For everything else, one is enough.

The two mistakes that sink interviews: rambling (which the three-sentence frame prevents) and being too rehearsed. The fix for rehearsal is to never write your answers down word for word. Write the bullet points. Practice them out loud once. Trust the frame.

For question 6, always have three questions ready. They should not be answerable on the school's website. Strong: "What surprised you when you got there?" "What do you wish you'd done your first year?" Weak: "How big is the school?"

End by sending a thank-you email within 24 hours. Six sentences. Specific reference to something the interviewer said. This single act doubles your interview's positive impact, by every alumni interviewer I've spoken to.`,
  },
  {
    slug: "study-routine-deep-work",
    title: "The two-hour deep-work block",
    blurb: "Two hours of focused work beats five hours of distracted study every time. Here's the cadence that makes it stick.",
    category: "Strategy",
    difficulty: "Beginner",
    readingTime: "5 min",
    author: "Anika, Princeton '26",
    body: `The unit of study that actually moves your score is the two-hour deep-work block. Less than 90 minutes and you don't get into flow. More than two hours and your accuracy collapses.

The cadence:

0–5 minutes: setup. Phone in another room. One specific thing on your desk: the section, the practice booklet, the question type you're drilling. Water bottle. No music with words.

5–55 minutes: timed work. One section, full speed, no pauses. Resist the urge to look at the answer between questions. Mark questions you weren't sure about with a small dot in the margin.

55–65 minutes: stand up. Walk. No phone. Don't review yet — the gap is doing work for memory consolidation.

65–115 minutes: review. For every dot, write one sentence in your error journal: "Wrong because I missed [specific thing]." For every miss without a dot, write two sentences: "Wrong because I thought [my reasoning]; correct because [the actual reasoning]." This is the highest-leverage activity of the entire two hours.

115–120 minutes: tag your weakest skill from this session. That's tomorrow's deep-work topic.

Three of these per week, plus one full-length test on Saturdays, is more effective than ten hours of mixed study. The reason: spaced retrieval and active error analysis. You're not just doing more reps; you're doing the right reps and tagging the next ones.

Do not study every day. The brain needs off-days to consolidate. Three deep-work days, three lighter review days, one full-length test, one full off-day. That weekly pattern is what consistently moves students from the 1300s into the 1500s in three months.`,
  },
  {
    slug: "test-day-checklist",
    title: "The 24 hours before your test",
    blurb: "What to eat, what to do, what not to do. Test-day prep is mostly about not breaking what you've already built.",
    category: "Strategy",
    difficulty: "Beginner",
    readingTime: "4 min",
    author: "Ben, Yale '25",
    body: `Most students try to do too much in the 24 hours before a test. The work is already done. Your only job is not to break it.

Friday morning. One half-section of practice. No more. The point is to remind yourself the format works; it is not to learn anything new.

Friday afternoon. Pack the bag: two sharpened pencils, an approved calculator with fresh batteries, a watch (not a smartwatch — they'll make you remove it), the admission ticket, the photo ID, water, two granola bars. Lay it on your desk. Don't put it in the bag yet — putting it in too early lets you forget something.

Friday evening. Eat the same thing you eat before a long Saturday morning. If you don't have a routine, eat pasta. Carbohydrates the night before, protein the morning of.

Friday night. Be in bed nine hours before the alarm. Your brain consolidates everything in the last two REM cycles, which only happen if you've slept seven hours. Phone on airplane mode in another room.

Saturday morning. Eat. Two eggs and toast, or oatmeal with peanut butter. Drink coffee only if you drink coffee daily. Test day is not the day to start. Bring water.

The drive to the test. No music with words. No reviewing flash cards. Look out the window. Breathe normally. Anxiety is a sign that your brain is taking the test seriously.

Walking in. The first ten minutes feel terrible. They feel terrible for everyone. Do not interpret it as a sign you're going to fail. By question 5 you'll be in your rhythm.

If you blank on question 1: skip it. Go to question 2. By question 6, you'll have warmed up enough to come back. Spending 90 seconds on question 1 is the single most common test-day mistake.`,
  },
  {
    slug: "ap-calc-discriminator",
    title: "AP Calculus: the FRQ pattern that scores 7s",
    blurb: "The free-response section is six predictable archetypes. Knowing them changes how you study.",
    category: "AP",
    difficulty: "Advanced",
    readingTime: "9 min",
    author: "Anika, Princeton '26",
    body: `AP Calculus AB and BC both follow the same six FRQ archetypes. Most students treat the FRQ section as "open-ended" and lose 2–3 points by missing the implicit prompts.

The six archetypes:

1. Rate-in / rate-out. Two functions describe inflow and outflow; the question asks net accumulation. Always involves an integral with a graphing calculator.

2. Particle motion. Position, velocity, acceleration. Watch for "speed" (|velocity|) vs "velocity" — the SAT and AP both punish this.

3. Implicit differentiation. Tangent line at a point. Factor out dy/dx; do not distribute.

4. Related rates. The geometric setup is the entire question. Draw the diagram before you do any calculus.

5. Riemann sums and definite integrals from a table. Left, right, midpoint, trapezoid. Memorize when each is an over- vs under-estimate.

6. Differential equations and slope fields (BC: parametric/polar). Separate variables, integrate both sides, apply initial condition, solve for C.

Each archetype has 3–4 standard sub-questions. If you've seen 30 FRQs across past exams, you've seen every variant. Practice past FRQs by archetype, not chronologically. You will see your scores jump from 4s to 5s within two weeks.

The other thing: write units on every numerical answer. Half a point per missed unit, four FRQs deep, is a 5 to a 4.`,
  },
];

export function getMaterialBySlug(slug: string): MaterialGuide | undefined {
  return MATERIALS.find((m) => m.slug === slug);
}
