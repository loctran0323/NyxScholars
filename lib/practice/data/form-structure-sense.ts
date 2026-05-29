import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can pick the word form that obeys core grammar rules: subject-verb agreement, verb tense and aspect, pronoun-antecedent agreement and case, modifier placement, and parallel structure. The four choices are usually variants of one verb, pronoun, or phrase, and only one fits.",
    howToAttack: [
      "Find the real subject for any verb by stripping out prepositional phrases, clauses, and other words wedged between the subject and the verb, then match number.",
      "For tense, anchor the verb to the time markers and to the other verbs in the passage; for parallelism, line the choice up against the items it must match in form.",
      "For a modifier opening the sentence, check that the noun right after the comma is the thing actually doing the action described.",
    ],
    traps: [
      "An agreement choice that matches a nearby noun inside an intervening phrase instead of the true subject.",
      "A tense or aspect that sounds smooth alone but clashes with a stated time frame or the surrounding verbs.",
      "A choice that breaks parallel form or that leaves an opening modifier attached to the wrong noun.",
    ],
  },
  questions: [
    {
      // SUBJECT-VERB AGREEMENT — intervening prepositional phrases. correct: 0
      id: "form-structure-sense-1",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 3,
      passage:
        "A long row of weathered fishing shacks along the northern docks ______ scheduled for demolition next spring, though local preservationists hope to save at least a few of the oldest structures.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["is", "are", "have been", "were being"],
      correct: 0,
      rationale:
        "Subject-verb agreement. The subject is the singular noun 'row,' not the plural nouns 'shacks' or 'docks' inside the intervening prepositional phrases, so the singular 'is' is correct. The strongest trap, 'are,' wrongly agrees with the closest plural noun 'docks' instead of the true subject 'row.'",
      paceSeconds: 50,
    },
    {
      // SUBJECT-VERB AGREEMENT — inverted order + "neither". correct: 1
      id: "form-structure-sense-2",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "Neither the conductor nor the visiting soloists ______ aware that the hall's new acoustic panels had been installed only hours before the evening rehearsal began.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["was", "were", "has been", "is"],
      correct: 1,
      rationale:
        "Subject-verb agreement with a 'neither...nor' subject: the verb agrees with the nearer element, the plural 'soloists,' so the plural 'were' is correct. The strongest trap, 'was,' agrees with the singular 'conductor,' but in 'neither...nor' constructions the noun closest to the verb controls agreement, not the first noun.",
      paceSeconds: 55,
    },
    {
      // VERB TENSE — sequence with a clear past time marker. correct: 2
      id: "form-structure-sense-3",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 3,
      passage:
        "By the time the survey crew reached the ridge last August, the wildfire ______ most of the trail markers, forcing the team to map the route from memory.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["destroys", "will destroy", "had destroyed", "destroying"],
      correct: 2,
      rationale:
        "Verb tense and sequence. Two past events are described; the destruction happened before the crew reached the ridge 'last August,' so the past perfect 'had destroyed' correctly marks the earlier action. The strongest trap, 'will destroy,' uses the future, which contradicts the explicit past time frame established by 'reached' and 'last August.'",
      paceSeconds: 50,
    },
    {
      // VERB TENSE / ASPECT — ongoing action consistent with present-perfect context. correct: 3
      id: "form-structure-sense-4",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "Over the past decade, glaciologists studying the remote ice field ______ each summer to drill fresh core samples, and they intend to continue these visits for as long as funding allows.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["returned", "will return", "had returned", "have returned"],
      correct: 3,
      rationale:
        "Verb tense and aspect. 'Over the past decade' plus the stated intent to keep going signals action that began in the past and continues into the present, which the present perfect 'have returned' expresses. The strongest trap, 'returned,' uses the simple past, which would wrongly cut the action off in the past even though the second clause shows it is ongoing.",
      paceSeconds: 60,
    },
    {
      // PRONOUN — antecedent agreement + case. correct: 0
      id: "form-structure-sense-5",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "The committee released a statement praising the two interns whose database, the members agreed, had saved ______ countless hours of manual record-keeping during the audit.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: ["them", "it", "themselves", "they"],
      correct: 0,
      rationale:
        "Pronoun-antecedent agreement and case. The pronoun is the object of 'had saved' and refers to the plural 'members,' so the plural objective pronoun 'them' is correct. The strongest trap, 'it,' is singular and would mismatch the plural antecedent 'members'; 'themselves' fails because the savers and the saved are different parties, so no reflexive is warranted.",
      paceSeconds: 55,
    },
    {
      // MODIFIER — dangling/misplaced opening modifier. correct: 1
      id: "form-structure-sense-6",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "Folded carefully into the manuscript's back cover, ______ a handwritten note that listed the original price of every illustration.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "the archivist discovered",
        "the editors found",
        "discovering it was",
        "there was discovered by the team",
      ],
      correct: 1,
      rationale:
        "Modifier placement. The opening phrase 'Folded carefully into the manuscript's back cover' must describe the thing that was folded, which is the note. Only 'the editors found' lets the sentence resolve so that the modifier sensibly attaches to 'a handwritten note,' the object they found. The strongest trap, 'the archivist discovered,' creates a dangling modifier by placing 'the archivist' right after the comma, illogically suggesting the archivist was folded into the cover.",
      paceSeconds: 60,
    },
    {
      // PARALLELISM — items in a series. correct: 2
      id: "form-structure-sense-7",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "An effective field guide should help a novice birder identify a species quickly, recall its distinctive call, and ______ where the bird is most likely to be seen.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "the prediction of",
        "predicting",
        "predict",
        "having predicted",
      ],
      correct: 2,
      rationale:
        "Parallel structure. The series lists three things the guide helps the birder do: 'identify,' 'recall,' and the blank, so the base verb 'predict' keeps all three items in matching form. The strongest trap, 'predicting,' breaks the parallel pattern by shifting the third item to an '-ing' form while the first two stay as plain verbs.",
      paceSeconds: 50,
    },
    {
      // PARALLELISM — paired structure with correlative-style comparison. correct: 3
      id: "form-structure-sense-8",
      skill: "form-structure-sense",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "The restored engine ran more quietly than the factory original, but the mechanic was prouder of having rebuilt the cooling system by hand than of ______ a single off-the-shelf part.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "she installed",
        "to install",
        "the installation of",
        "having installed",
      ],
      correct: 3,
      rationale:
        "Parallel structure. The comparison 'prouder of...than of...' must pair two grammatically matching objects: the first is the gerund phrase 'having rebuilt the cooling system,' so the second must also be a gerund phrase, 'having installed a single off-the-shelf part.' The strongest trap, 'the installation of,' is a noun phrase that does not match the gerund form of the first half, breaking the parallel pairing required by 'than of.'",
      paceSeconds: 60,
    },
  ],
};
