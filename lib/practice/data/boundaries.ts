import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can punctuate the seams between clauses and sentence elements: deciding when two independent clauses need a period, a semicolon, or a comma plus a coordinating conjunction; when a colon may introduce a list or explanation; and how to set off nonrestrictive modifiers, appositives, and supplements without creating splices, run-ons, or fragments.",
    howToAttack: [
      "Cover the choices and label each side of the blank: is the material before it a complete sentence, and is the material after it complete too?",
      "Two independent clauses can be joined only by a period, a semicolon, or a comma plus a FANBOYS conjunction; a bare comma between them is a splice.",
      "A colon and a dash must follow a complete sentence; commas around a phrase must come in matched pairs, and you cannot close a nonrestrictive element you never opened.",
    ],
    traps: [
      "A comma alone wedged between two independent clauses, which looks smooth but is a comma splice.",
      "A semicolon or colon placed after a fragment rather than a full independent clause.",
      "A single comma that opens a nonrestrictive phrase or appositive but never closes it, or closes one that was never opened.",
    ],
  },
  questions: [
    {
      id: "boundaries-1",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 3,
      passage:
        "The harpsichord produces sound by plucking its strings with small quills, whereas the piano strikes them with felt-covered ______ difference in mechanism gives each instrument a distinct tone.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "hammers, this",
        "hammers this",
        "hammers. This",
        "hammers, this,",
      ],
      correct: 2,
      rationale:
        "Two independent clauses surround the blank: 'The harpsichord ... felt-covered hammers' and 'This difference ... distinct tone.' A period correctly separates them, so C is right. A places only a comma between the clauses, producing a comma splice; B omits punctuation entirely, creating a run-on (fused sentence).",
      paceSeconds: 50,
    },
    {
      id: "boundaries-2",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 3,
      passage:
        "After months of testing soil samples from the abandoned orchard, the volunteers made a single alarming ______ a thin band of buried industrial waste that no surface survey had revealed.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "discovery:",
        "discovery;",
        "discovery. A",
        "discovery a",
      ],
      correct: 0,
      rationale:
        "'the volunteers made a single alarming discovery' is a complete independent clause, and what follows is a noun phrase renaming that discovery, so a colon correctly introduces the appositive: A. A semicolon (B) and a period (C) each require an independent clause on the right, but 'a thin band of buried industrial waste that no surface survey had revealed' is a fragment, not a sentence. D omits punctuation entirely, fusing the appositive onto the clause.",
      paceSeconds: 50,
    },
    {
      id: "boundaries-3",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "The composer revised the second movement more than a dozen ______ the third movement, by contrast, she left almost exactly as it had first appeared in her notebook.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "times,",
        "times, but",
        "times and",
        "times;",
      ],
      correct: 3,
      rationale:
        "Both sides are independent clauses, and the second already contains its own contrasting adverbial ('by contrast'), so no coordinating conjunction is needed; a semicolon joins the equal clauses, making D correct. A leaves a bare comma between two full clauses, a comma splice. B adds 'but' after the comma, which would join the clauses correctly but then doubles the contrast already carried by 'by contrast,' creating redundant signaling, and C tries to coordinate two independent clauses with 'and' but omits the comma a coordinating conjunction requires between full clauses, leaving a run-on.",
      paceSeconds: 55,
    },
    {
      id: "boundaries-4",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "The longest of the cave's chambers, a vaulted space the early surveyors called the ______ now closed to visitors while engineers reinforce its ceiling.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "Cathedral is",
        "Cathedral, is",
        "Cathedral; is",
        "Cathedral: is",
      ],
      correct: 1,
      rationale:
        "The phrase 'a vaulted space the early surveyors called the Cathedral' is a nonrestrictive appositive opened by a comma after 'chambers,' so it must be closed by a matching comma before the verb 'is': B. The subject 'The longest of the cave's chambers' then connects to its verb 'is.' A drops the closing comma, leaving the appositive unmatched. C and D place a semicolon or colon before the verb, which severs the subject from its predicate and produces a fragment on one side.",
      paceSeconds: 60,
    },
    {
      id: "boundaries-5",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 4,
      passage:
        "Anyone who repairs vintage clocks soon learns that three small parts cause most of the ______ the mainspring, the escapement, and the cluster of jeweled bearings.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "failures,",
        "failures;",
        "failures.",
        "failures:",
      ],
      correct: 3,
      rationale:
        "'three small parts cause most of the failures' is a complete independent clause, and what follows is a noun-phrase list naming those parts, so a colon correctly introduces the list: D. A semicolon (B) and a period (C) each require an independent clause on the right, but the list 'the mainspring, the escapement, and the cluster of jeweled bearings' is a fragment, not a sentence. A single comma (A) blurs the list into the main clause as if 'the mainspring' were simply the next item after 'failures.'",
      paceSeconds: 60,
    },
    {
      id: "boundaries-6",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "Mapmakers of the period rarely traveled to the coastlines they ______ relied instead on sailors' logs, secondhand sketches, and the occasional rumor.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "drew; they",
        "drew, they",
        "drew they",
        "drew. They,",
      ],
      correct: 0,
      rationale:
        "'Mapmakers of the period rarely traveled to the coastlines they drew' is one independent clause and 'they relied instead on ...' is another, so a semicolon correctly joins the closely related sentences: A. B uses a bare comma between the two independent clauses, a comma splice. C omits punctuation, fusing the clauses into a run-on. D would join them correctly with a period but then inserts a stray comma after 'They,' which wrongly separates the subject from its verb 'relied.'",
      paceSeconds: 60,
    },
    {
      id: "boundaries-7",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "The textile, woven from fibers that resist ______ survived three centuries of storage, a durability the donor's family had long suspected but never confirmed.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "decay has",
        "decay, has",
        "decay; has",
        "decay: has",
      ],
      correct: 1,
      rationale:
        "'woven from fibers that resist decay' is a nonrestrictive participial phrase opened by the comma after 'textile,' so it needs a closing comma before the main verb 'has': B. A omits that closing comma, leaving the inserted phrase unmatched. C and D put a semicolon or colon between the subject 'The textile' and its verb 'has survived,' which both demands a complete clause on the left of the mark and strands the verb as a fragment on the right.",
      paceSeconds: 65,
    },
    {
      id: "boundaries-8",
      skill: "boundaries",
      domain: "Standard English Conventions",
      difficulty: 5,
      passage:
        "Few biographers mention her years as a railway clerk, but those who do tend to recount the same three ______ a daring reroute, a midnight repair, and a near-collision avoided by seconds.",
      prompt:
        "Which choice completes the text so that it conforms to the conventions of Standard English?",
      choices: [
        "episodes,",
        "episodes;",
        "episodes:",
        "episodes",
      ],
      correct: 2,
      rationale:
        "'those who do tend to recount the same three episodes' is a complete independent clause, and what follows is a noun-phrase list naming those episodes, so a colon introduces the list: C. A semicolon (B) requires an independent clause on its right, but 'a daring reroute, a midnight repair, and a near-collision avoided by seconds' is a fragment. A single comma (A) collapses the list into the main clause as though 'a daring reroute' were merely the next item after 'episodes,' and D omits punctuation, fusing the list onto the clause.",
      paceSeconds: 65,
    },
  ],
};
