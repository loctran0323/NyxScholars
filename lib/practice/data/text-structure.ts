import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can name the rhetorical job a single sentence does within the larger argument, or state what the whole passage is trying to accomplish — not what it says, but what it is doing.",
    howToAttack: [
      "Read the whole text first and decide its arc (claim, complication, qualification, resolution) before judging any one sentence.",
      "For a marked sentence, ask what changes right before versus right after it: does it set up, support, complicate, concede, or redirect?",
      "For purpose questions, pick the verb that matches the author's dominant move; reject choices that describe a real move aimed at the wrong target.",
    ],
    traps: [
      "A choice that accurately summarizes the sentence's content but misstates its function in the argument.",
      "A choice that names a plausible rhetorical move the sentence never actually makes (e.g., 'resolves a debate' when nothing is resolved).",
      "A choice that captures one detail or one paragraph but overreaches or underreaches the scope the prompt asks about.",
    ],
  },
  questions: [
    {
      id: "text-structure-1",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "For decades, museum conservators treated old varnish on oil paintings as damage to be stripped away, restoring works to what they assumed was the artist's intended brilliance. Recent analysis of pigment samples complicates that view. **Several painters, it turns out, applied tinted varnishes deliberately, using the amber film to harmonize colors that would otherwise clash.** A surface that looks merely yellowed may therefore be part of the original design, and removing it can undo a choice the artist made on purpose.",
      prompt:
        "Which choice best describes the function of the marked sentence in the text as a whole?",
      choices: [
        "It introduces a new restoration technique that conservators now prefer.",
        "It concedes that conservators were correct about most paintings.",
        "It summarizes the chemical composition of historical varnishes.",
        "It offers a finding that undercuts the assumption described in the previous sentences.",
      ],
      correct: 3,
      rationale:
        "The sentence presents evidence (deliberate tinted varnish) that contradicts the prior assumption that varnish is just damage, which the final sentence then draws out. The strongest trap is B: the passage never grants that conservators were right; it argues the opposite, so 'concedes a correct point' inverts the move.",
      paceSeconds: 75,
    },
    {
      id: "text-structure-2",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "Ecologists once assumed that a forest's tallest, oldest trees were its most productive, capturing the most sunlight and storing the most carbon. Measurements across several temperate sites told a more layered story. The largest trees did capture abundant light, but their growth rates had slowed with age. **Mid-sized trees, still expanding rapidly, added new wood faster than the giants overhead.** Productivity, the data suggested, was spread through the canopy rather than concentrated at its peak.",
      prompt:
        "Which choice best describes the function of the marked sentence in the text as a whole?",
      choices: [
        "It restates the ecologists' original assumption in more precise terms.",
        "It supplies the specific contrast that supports the text's revised conclusion.",
        "It raises a question that the final sentence leaves unanswered.",
        "It questions whether the site measurements were accurate.",
      ],
      correct: 1,
      rationale:
        "By noting that mid-sized trees out-grow the giants, the sentence furnishes the contrast that justifies the closing claim that productivity is distributed, not peaked. The best trap is A: it captures that the sentence is about trees but reverses the function, since the sentence overturns the original assumption rather than restating it.",
      paceSeconds: 75,
    },
    {
      id: "text-structure-3",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Critics have long praised the novelist's late style for its spare, clipped sentences, reading the change as hard-won discipline after the lushness of her early work. A cache of her drafts suggests a humbler cause. The manuscripts show whole descriptive passages cut not for effect but to meet a publisher's strict page limits. **Even so, the writer kept those tighter pages in later editions when the limit no longer applied, treating an accident of printing as an aesthetic gain.** What began as a constraint, in other words, hardened into a preference she chose to defend.",
      prompt:
        "Which choice best describes the function of the marked sentence in the text as a whole?",
      choices: [
        "It dismisses the draft evidence as irrelevant to the writer's reputation.",
        "It provides the publisher's reason for imposing the page limits.",
        "It qualifies the draft-based explanation by showing the writer later embraced the change.",
        "It restates the critics' admiration for the spare late style.",
      ],
      correct: 2,
      rationale:
        "The drafts imply the spare style was an accident of page limits, but 'even so' shows the writer kept the cuts by choice, so the sentence tempers the purely accidental account and sets up the final synthesis. The strongest trap is A: the sentence does not throw out the draft evidence; it builds on it, accepting the constraint while adding that she chose to keep it.",
      paceSeconds: 85,
    },
    {
      id: "text-structure-4",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "City planners often defend wide, straight streets as the safest design, reasoning that clear sightlines let drivers spot hazards early. Traffic studies have begun to trouble that logic. **On roads engineered for visibility and speed, drivers tend to relax their attention and accelerate, so crashes grow more severe even as they grow less frequent.** Some planners now add curves and narrowed lanes on purpose, betting that a road which feels slightly risky will be driven more carefully.",
      prompt:
        "Which choice best describes the function of the marked sentence in the text as a whole?",
      choices: [
        "It proposes the specific road redesign described in the final sentence.",
        "It defines what counts as a severe crash for the studies.",
        "It identifies the mechanism that explains why the planners' reasoning fails.",
        "It concedes that wide streets reduce the total number of crashes.",
      ],
      correct: 2,
      rationale:
        "The sentence explains how visibility backfires — relaxed, faster driving makes crashes more severe — which is the causal link the studies use to trouble the planners' logic. The best trap is D: although the sentence does say crashes grow less frequent, that clause is subordinate; treating it as the sentence's job ignores the main point about severity and mechanism.",
      paceSeconds: 80,
    },
    {
      id: "text-structure-5",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "A familiar account of language change holds that careless speakers wear words down over time, so guardians of correct usage must resist the slide. Linguists who study how meanings shift see less decay than reorganization. Words that lose one sense routinely gain another, and the supposed errors of one generation become the standard grammar of the next. **The verb that once meant only 'to beg' now also means 'to claim,' a drift that no committee approved and no speaker mourns.** Far from eroding the language, such changes show a system constantly redistributing the work its words must do.",
      prompt:
        "Which choice best describes the function of the marked sentence in the text as a whole?",
      choices: [
        "It admits a case in which a word's original meaning was lost entirely.",
        "It illustrates the reorganizing process the linguists describe with a concrete example.",
        "It introduces the committee whose authority the final sentence affirms.",
        "It marks a turn toward the view that change does erode language.",
      ],
      correct: 1,
      rationale:
        "The verb that 'now also means' a second sense is a worked example of the redistribution the linguists champion, leading directly into the closing generalization. The sharpest trap is A: the sentence shows a word gaining a sense ('now also means'), not losing its original one, so 'lost entirely' misreads the example as decay — the very view the passage rejects.",
      paceSeconds: 90,
    },
    {
      id: "text-structure-6",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "An archaeologist studying an abandoned coastal settlement faced a puzzle: the houses were sturdy, the harbor sheltered, and the soil still fertile, yet the people left abruptly. Trade records offered no sign of war or famine. Sediment cores, however, traced a slow rise in the water table that would have salted the wells generations before the final departure. The community did not flee a sudden disaster, the evidence suggested; it endured a problem so gradual that each year's decline looked normal until the wells failed for good.",
      prompt: "Which choice best states the main purpose of the text?",
      choices: [
        "To argue that coastal settlements are inherently more fragile than inland ones.",
        "To describe how an archaeologist resolved a puzzle by tracing a slow environmental cause for an abrupt outcome.",
        "To compare two competing theories about why ancient harbors were abandoned.",
        "To recount the daily routines of people in an early coastal community.",
      ],
      correct: 1,
      rationale:
        "The passage poses a puzzle (a thriving site abandoned suddenly) and resolves it with sediment evidence pointing to gradual salting, so its purpose is to show how a slow cause produced a sharp result. The best trap is C: the text considers and rules out war and famine, but it does not weigh two rival theories side by side, so 'competing theories' overstates the structure.",
      paceSeconds: 85,
    },
    {
      id: "text-structure-7",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Readers tend to picture the lone inventor having a flash of insight, but the record of patents tells a quieter story. The same idea is filed, again and again, by people who never met, within months of one another. This clustering is not coincidence; it reflects the moment when scattered tools, materials, and unanswered questions finally line up so that the next step becomes obvious to anyone paying attention. Genius, on this reading, is less a private spark than a recognition of what a field has already made ready to be found.",
      prompt: "Which choice best states the main purpose of the text?",
      choices: [
        "To advise inventors on how to file patents before their rivals do.",
        "To trace the history of a single influential invention.",
        "To celebrate the achievements of one especially gifted inventor.",
        "To reframe invention as a response to conditions a field has prepared rather than a solitary flash of insight.",
      ],
      correct: 3,
      rationale:
        "The passage uses simultaneous patents to argue that breakthroughs arrive when a field is ready, redefining 'genius' as recognition rather than a private spark. The strongest trap is B: the text mentions inventions generally but never follows one invention's history; it uses the clustering pattern to make a conceptual point, so 'a single invention' misstates the scope.",
      paceSeconds: 90,
    },
    {
      id: "text-structure-8",
      skill: "text-structure",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "It is tempting to treat a poem's punctuation as a transparent guide to how it should be read aloud, each comma a pause, each period a full stop. But poets frequently set the line break against the punctuation, ending a line where no mark appears so that the sentence spills forward while the eye halts. The tension between these two systems — one grammatical, one visual — can make a single phrase feel both finished and unfinished at once. To read such a poem well is to hold both rhythms in mind, letting neither the grammar nor the line fully win.",
      prompt: "Which choice best states the main purpose of the text?",
      choices: [
        "To explain why a poem's line breaks and its punctuation can pull against each other and what that asks of a reader.",
        "To argue that punctuation should always be ignored when reading poetry aloud.",
        "To provide rules for where poets ought to place their line breaks.",
        "To trace how punctuation in poetry has changed over time.",
      ],
      correct: 0,
      rationale:
        "The text sets up a naive view (punctuation = reading guide), complicates it with the line-break tension, and concludes that good reading holds both systems at once, which is its purpose. The best trap is B: the passage urges balancing grammar and line, not ignoring punctuation, so 'always be ignored' pushes one half of the tension to an extreme the text explicitly rejects.",
      paceSeconds: 80,
    },
  ],
};
