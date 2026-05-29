import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can pin a word's exact meaning to the sentence's logic rather than to its most familiar dictionary sense, distinguishing near-synonyms by connotation, degree, and direction.",
    howToAttack: [
      "Read for the logical relationship signaled by punctuation and connectives (a colon, 'but,' 'because,' 'although') before looking at the choices, then predict the slot in your own words.",
      "For meaning-in-context items, ignore the word's most common definition and substitute each choice back into the sentence to see which preserves the author's intended sense.",
      "Eliminate by precision: rule out options that point the wrong direction, overshoot or undershoot the intended degree, or carry an off connotation, keeping the one that fits all constraints.",
    ],
    traps: [
      "The most common meaning of a polysemous word is offered as bait when the context demands a secondary sense.",
      "A choice that is roughly synonymous but too strong or too weak for the sentence's stated degree.",
      "A word that fits the topic's general mood but ignores a contrast or causal cue, so it points the wrong way logically.",
    ],
  },
  questions: [
    {
      id: "words-in-context-1",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Reviewers expected the novelist's memoir to settle long-standing rumors, but the book proved frustratingly ______: every confession was hedged with qualifications, and each apparent admission could be read two opposite ways.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["candid", "tedious", "fictional", "equivocal"],
      correct: 3,
      rationale:
        "The detail that admissions 'could be read two opposite ways' demands a word for deliberate ambiguity, which 'equivocal' supplies. 'Candid' is the trap: it suits a memoir that settles rumors but directly contradicts the hedging the sentence describes, and the opening 'but' signals the book defied that expectation.",
      paceSeconds: 65,
    },
    {
      id: "words-in-context-2",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Although her colleagues braced for layoffs after the quarterly report, the manager remained ______ about the firm's prospects, assuring everyone that the downturn was temporary and recovery all but certain.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["sanguine", "indifferent", "vindicated", "speculative"],
      correct: 0,
      rationale:
        "Reassuring others that recovery is 'all but certain' marks a cheerful confidence about the future, the precise sense of 'sanguine.' 'Indifferent' is the strongest trap because a calm manager might seem unbothered, but indifference implies she does not care, whereas the text shows her actively optimistic.",
      paceSeconds: 70,
    },
    {
      id: "words-in-context-3",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "As used in the text, the word **arrest** most nearly means to bring to a halt. The conservator explained that the new coating would **arrest** the corrosion already spreading across the bronze, stopping further damage without reversing what had occurred.",
      prompt: "As used in the text, the word **arrest** most nearly means",
      choices: ["detain", "capture", "stop", "fascinate"],
      correct: 2,
      rationale:
        "The clause 'stopping further damage' restates the verb, so 'arrest' means to halt a process. 'Detain' and 'capture' invoke the familiar law-enforcement sense, which is irrelevant to corrosion, and 'fascinate' confuses 'arrest' with 'arresting,' a different idiom.",
      paceSeconds: 55,
    },
    {
      id: "words-in-context-4",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "The committee dismissed the proposal not because its goals were objectionable but because its reasoning was ______: the argument looked airtight until one noticed that its central premise had quietly been assumed rather than established.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["redundant", "specious", "tentative", "incoherent"],
      correct: 1,
      rationale:
        "An argument that 'looked airtight' yet rests on an unproven premise is plausible on its surface but actually unsound, the exact meaning of 'specious.' 'Incoherent' is the trap, but the text says the reasoning seemed airtight, so it was not disorganized; its flaw was hidden, not obvious.",
      paceSeconds: 70,
    },
    {
      id: "words-in-context-5",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Critics often mistake the poet's later style for carelessness, yet nothing in it is ______; each seemingly offhand line break and slack rhythm was, the drafts reveal, weighed and revised many times over.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["ornate", "deliberate", "conventional", "haphazard"],
      correct: 3,
      rationale:
        "Because the drafts prove every choice was 'weighed and revised,' the negated blank must name the opposite of careful design, making 'haphazard' correct. 'Deliberate' is the bait: it captures what the poetry truly is, but the sentence says nothing in it IS the blank, so the slot needs a word meaning random.",
      paceSeconds: 70,
    },
    {
      id: "words-in-context-6",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "As used in the text, the word **economy** most nearly means restraint. What distinguishes the short story is its **economy**: in barely four pages the writer establishes three characters, a setting, and a reversal, never spending a word she does not need.",
      prompt: "As used in the text, the word **economy** most nearly means",
      choices: ["sparingness", "marketplace", "thrift", "prosperity"],
      correct: 0,
      rationale:
        "The gloss 'never spending a word she does not need' applies 'economy' to language, so it means efficient sparingness of means. 'Thrift' is the close trap, but it denotes carefulness with money or resources rather than the spare verbal artistry described, and 'marketplace' and 'prosperity' chase the financial sense.",
      paceSeconds: 60,
    },
    {
      id: "words-in-context-7",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "The treaty's authors hoped its language would prove ______, capable of being interpreted sensibly as conditions shifted; instead, later signatories found the wording so rigid that it broke under the first unforeseen crisis.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["binding", "tractable", "ambiguous", "permanent"],
      correct: 1,
      rationale:
        "The contrast with 'so rigid that it broke' shows the authors wanted pliable, manageable language, which 'tractable' names. 'Ambiguous' tempts because flexible wording can seem vague, but the authors sought sensible adaptation, not unclear meaning, and ambiguity would be a defect rather than the goal.",
      paceSeconds: 70,
    },
    {
      id: "words-in-context-8",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "As used in the text, the word **qualify** most nearly means to limit. The historian is careful to **qualify** her boldest claims, attaching to each the conditions under which it holds and the regions where the evidence runs thin.",
      prompt: "As used in the text, the word **qualify** most nearly means",
      choices: ["certify", "moderate", "compete", "describe"],
      correct: 1,
      rationale:
        "Attaching conditions and acknowledging weak evidence narrows a claim, so 'qualify' here means to moderate or restrict. 'Certify' reflects the familiar sense of meeting a standard, the opposite movement, and 'compete' evokes the sports usage that has no place in the sentence.",
      paceSeconds: 55,
    },
    {
      id: "words-in-context-9",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Far from advancing a single thesis, the lecture wandered from anecdote to half-formed aside, its connections so ______ that students left unsure what, if anything, the speaker had meant to argue.",
      prompt:
        "Which choice completes the text with the most logical and precise word or phrase?",
      choices: ["meticulous", "succinct", "desultory", "provocative"],
      correct: 2,
      rationale:
        "Wandering 'from anecdote to half-formed aside' with no clear thesis describes aimless, disconnected movement, the sense of 'desultory.' 'Provocative' is the trap, since a meandering talk might still stir thought, but the sentence stresses confusion and lack of direction, not the power to provoke.",
      paceSeconds: 65,
    },
    {
      id: "words-in-context-10",
      skill: "words-in-context",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "As used in the text, the word **temper** most nearly means to moderate. The editor urged the columnist to **temper** her conclusions, softening the sweeping verdicts so that the prose matched the modest evidence she had actually gathered.",
      prompt: "As used in the text, the word **temper** most nearly means",
      choices: ["harden", "inflame", "disposition", "soften"],
      correct: 3,
      rationale:
        "The appositive 'softening the sweeping verdicts' defines the verb, so 'temper' means to moderate. 'Harden' names the metallurgical sense of tempering steel, which points the wrong way here, and 'disposition' offers the noun meaning of temper, a different part of speech entirely.",
      paceSeconds: 65,
    },
  ],
};
