import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "The student reads a short passage in which two ideas sit on either side of a blank and must supply the transition that names the exact logical relationship between them. Success depends on reading the sentences before and after the blank, deciding whether the second idea contrasts with, results from, adds to, exemplifies, restates, or concedes something about the first, and then matching that single relationship to the connector.",
    howToAttack: [
      "Cover the choices, read both sides of the blank, and state the relationship in plain words first: does the second idea push against the first, follow from it, illustrate it, or pile onto it?",
      "Sort the four options into families — contrast, cause/effect, addition, example, restatement — and eliminate any whole family that does not fit the relationship you named.",
      "When two survivors feel close, check direction and strength: a result word claims the second idea is caused by the first, while a contrast word claims it cuts against the first; only one can be true of the same pair.",
    ],
    traps: [
      "A contrast word (However, Nevertheless) dropped in where the two ideas actually agree or build on each other, so no real opposition exists.",
      "An addition word (Moreover, In addition) used where the second sentence is really an example of, or a consequence of, the first rather than a separate parallel point.",
      "A cause/effect word (Therefore, As a result) placed between two ideas that merely coexist or contrast, asserting a consequence the text never sets up.",
    ],
  },
  questions: [
    {
      id: "transitions-1",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 3,
      passage:
        "For decades, conservationists assumed that planting trees in any open grassland would lock away carbon and improve the local environment. Newer studies of native prairies tell a more complicated story. ______ in some grasslands the deep, fire-resistant root systems already store more carbon belowground than introduced trees would add aboveground.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["For instance,", "However,", "Therefore,", "Likewise,"],
      correct: 1,
      rationale:
        "The relationship is contrast: the old assumption says planting trees helps, while the new finding says native roots may already out-store trees, undercutting that assumption. 'However' marks that opposition. 'Therefore' is the strongest trap because the sentence reads like a conclusion, but the second idea reverses the first rather than following from it, so a cause/effect word misstates the relationship.",
      paceSeconds: 65,
    },
    {
      id: "transitions-2",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 3,
      passage:
        "The museum had long kept its most fragile manuscripts in a climate-controlled vault, viewable only by appointment. Last year the curators photographed each page at extremely high resolution and posted the images online. ______ a student in another country can now study the same margins and ink strokes that once required a scheduled visit.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["By comparison,", "Nevertheless,", "In contrast,", "As a result,"],
      correct: 3,
      rationale:
        "The relationship is cause and effect: digitizing the pages (the cause) is what now lets a distant student examine them (the effect). 'As a result' names that consequence. 'Nevertheless' is the trap; it implies the second idea happens in spite of the first, but remote access is the direct outcome of the digitizing, not something that occurs despite it.",
      paceSeconds: 65,
    },
    {
      id: "transitions-3",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "Critics often praise the novelist's later books for their tight, economical sentences. Her earliest manuscript, by contrast, runs long, with clauses that double back and qualify themselves at length. The shift was not a sudden discovery of restraint. ______ her notebooks show that she cut the same passages five or six times before she was satisfied, so the spare style was the product of relentless revision.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Instead,", "Similarly,", "Granted,", "In addition,"],
      correct: 0,
      rationale:
        "The relationship is correction by substitution: the text denies one explanation ('not a sudden discovery') and supplies the real one (years of cutting). 'Instead' is the connector that replaces the rejected idea with the true one. 'In addition' is the tempting trap because the second sentence does add detail, but it functions as a replacement for the negated claim, not as a separate parallel point added alongside it.",
      paceSeconds: 70,
    },
    {
      id: "transitions-4",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "Engineers designing quieter wind turbines have borrowed an idea from the wings of owls, whose feathers carry a fringed trailing edge that breaks up the air and muffles sound. They added a comblike serrated edge to the back of each blade. ______ several other features of owl wings, such as the soft down that coats the upper surface, have inspired separate attempts to reduce the whistling of aircraft landing gear.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Consequently,", "For example,", "Moreover,", "On the other hand,"],
      correct: 2,
      rationale:
        "The relationship is addition: the passage gives one borrowing from owl wings (the serrated blade edge), then offers a further, separate borrowing (down inspiring landing-gear designs). 'Moreover' adds the second parallel point. 'For example' is the trap; the second sentence is not an instance of the turbine case but a new application in a different field, so an example word would wrongly subordinate it to the first idea.",
      paceSeconds: 70,
    },
    {
      id: "transitions-5",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "Supporters of the proposed transit line argue that it will ease downtown congestion within a few years. The engineering review they cite is genuinely thorough, and its ridership projections rest on careful modeling. ______ those same projections assume that fuel prices will keep climbing at recent rates, an assumption the review itself flags as uncertain.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Admittedly,", "Still,", "In short,", "Indeed,"],
      correct: 1,
      rationale:
        "The relationship is concession-then-pushback: the writer grants that the review is thorough, then turns to a weakness (a shaky assumption). 'Still' carries that 'even so' contrast after the concession. 'Indeed' is the trap because it signals reinforcement of the prior praise, whereas the second sentence qualifies and partly undercuts that praise rather than strengthening it.",
      paceSeconds: 75,
    },
    {
      id: "transitions-6",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "A widespread piece of advice holds that learners should always study in a single, quiet location to build a strong habit. Some memory researchers question whether one fixed setting is best. ______ they point to experiments in which people who reviewed the same material in two different rooms later recalled more of it than people who studied twice in one room.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Even so,", "Therefore,", "By comparison,", "For instance,"],
      correct: 3,
      rationale:
        "The relationship is exemplification: the researchers' general doubt about a single setting is supported by a specific study showing better recall with varied rooms. 'For instance' introduces that concrete case as evidence for the claim. 'Therefore' is the trap; the experiment is the basis for the doubt, not a conclusion drawn from it, so a result word reverses the actual direction of support.",
      paceSeconds: 70,
    },
    {
      id: "transitions-7",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "The startup's first app let users track a single budget category at a time, and reviewers called it limited. The founders responded not by adding more category slots but by rebuilding the interface around one shared ledger that every feature reads from. The change looked modest on the surface. ______ it touched almost every line of the underlying code, since each tool had to be rewritten to draw from the same source.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["In fact,", "Likewise,", "For example,", "Nevertheless,"],
      correct: 0,
      rationale:
        "The relationship is emphatic correction of an understatement: the surface 'modest' appearance is set against the reality that the change was sweeping. 'In fact' intensifies past the understatement to the stronger truth. 'Nevertheless' is the closest trap because both involve tension with 'modest,' but 'nevertheless' would mean the rewrite happened despite looking modest, whereas the sentence explains that it was actually far larger than it appeared, which is emphasis, not concession.",
      paceSeconds: 78,
    },
    {
      id: "transitions-8",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "Coastal towns hoping to slow erosion sometimes truck in sand to widen their beaches, a quick fix that storms can wash away in a season. A nearby town tried a slower approach, planting dune grass whose roots knit the sand in place over several years. The grass demands patience and offers nothing dramatic at first. ______ once established, it holds the shoreline through the same storms that strip a trucked-in beach bare.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Similarly,", "Yet", "Consequently,", "In short,"],
      correct: 1,
      rationale:
        "The relationship is contrast between the grass's unimpressive start and its eventual durability. 'Yet' marks that the second idea cuts against the first. 'Consequently' is the trap; it would claim that holding the shoreline is a consequence of demanding patience, but patience is not the cause of the grass's strength — the contrast is between early appearance and later performance, so a result word misreads the link.",
      paceSeconds: 78,
    },
    {
      id: "transitions-9",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "Linguists once treated whistled languages, in which speakers convey full sentences by whistling the melody of spoken words, as curiosities confined to a few mountain villages. Field surveys have since recorded them on steep terrain across several continents, wherever distance and rough ground make ordinary speech hard to hear. ______ the trait keeps emerging in the same kind of setting, which hints that the practice answers a recurring practical need rather than a single cultural accident.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Granted,", "In other words,", "Otherwise,", "In each case,"],
      correct: 3,
      rationale:
        "The relationship is illustration across repeated instances: the surveys found whistled languages in many places, and the blank introduces the common thread tying those instances together. 'In each case' gathers the recurring examples to support the inference about a shared need. 'In other words' is the trap; it signals a restatement of the prior sentence, but the second sentence draws a new generalization from the pattern rather than rephrasing what was just said.",
      paceSeconds: 80,
    },
    {
      id: "transitions-10",
      skill: "transitions",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "When a painting is cleaned, conservators remove a yellowed varnish that has darkened over generations, and the colors beneath can look startlingly bright. Some viewers complain that the cleaned work no longer matches the dim, mellow image they grew up admiring. That mellow image, though, was never the artist's intention. ______ it was an accident of aging varnish, a film the painter never applied and could not have foreseen.",
      prompt: "Which choice completes the text with the most logical transition?",
      choices: ["Rather,", "Furthermore,", "By comparison,", "Accordingly,"],
      correct: 0,
      rationale:
        "The relationship is correction by substitution: the text denies that the mellow look was intended and replaces that idea with its true source, the aging varnish. 'Rather' supplies the corrected alternative after the negation. 'Furthermore' is the trap because the second sentence does elaborate, but it substitutes for the rejected claim ('never the artist's intention') instead of adding an independent further point, so an addition word misstates the relationship.",
      paceSeconds: 80,
    },
  ],
};
