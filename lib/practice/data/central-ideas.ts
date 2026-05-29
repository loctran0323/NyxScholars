import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can state the one claim that the entire short passage builds toward, and separate that claim from supporting details, side remarks, and broad background framing.",
    howToAttack: [
      "Read the whole text, then say the point in your own words before looking at the choices.",
      "Find the sentence that the others serve; everything else is usually evidence for it.",
      "Test each choice against the full passage: a right main-idea answer covers the beginning and the end, not just one clause.",
    ],
    traps: [
      "A true detail lifted from one sentence that ignores the passage's actual conclusion.",
      "An overgeneralization that drops the passage's qualifier (some, often, under certain conditions) and claims too much.",
      "A half-truth that emphasizes the setup the author raises only to complicate or correct.",
    ],
  },
  questions: [
    {
      id: "central-ideas-1",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "Many gardeners assume that bare winter soil is dormant soil, with little happening until spring. Recent fieldwork tells a different story. Even at temperatures just above freezing, certain fungi keep extending their threadlike networks through the ground, breaking down fallen leaves and moving nutrients between plant roots. The visible garden may look asleep, but the chemistry beneath it does not pause.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Winter is the most active season for fungi living in garden soil.",
        "Gardeners tend to misjudge how cold the soil becomes during winter months.",
        "Soil that appears inactive in winter still hosts ongoing biological processes.",
        "Fungi are responsible for breaking down most of the fallen leaves in a garden.",
      ],
      correct: 2,
      rationale:
        "The text contrasts the garden's sleepy appearance with the fungal activity continuing underground, so C captures the whole point. D is a true detail about leaf breakdown but only one example, and A overreaches by ranking winter as the *most* active season, which the passage never claims.",
      paceSeconds: 70,
    },
    {
      id: "central-ideas-2",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "A museum hoping to display a fragile manuscript faces a quiet dilemma. Light lets visitors read the ink, yet the same light slowly fades it. Conservators now favor dim, motion-triggered lamps that brighten only when someone steps close and dim again moments later. The page is legible when it needs to be and resting in shadow the rest of the time, which buys the document decades of additional life.",
      prompt:
        "According to the text, why do conservators use motion-triggered lamps for fragile manuscripts?",
      choices: [
        "They limit the manuscript's light exposure while still allowing visitors to read it.",
        "They make faded ink easier to see than steady lighting would.",
        "They reduce the museum's overall electricity costs.",
        "They prevent visitors from approaching the document too closely.",
      ],
      correct: 0,
      rationale:
        "The passage says the lamps brighten only when a viewer is near and otherwise leave the page in shadow, balancing readability against fading, which is exactly A. B distorts the purpose, since the goal is preservation rather than improving visibility of already-faded ink, and C invents a cost rationale the text never mentions.",
      paceSeconds: 70,
    },
    {
      id: "central-ideas-3",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Folklorists once treated a regional tale and its many variants as a single story wearing different costumes. The newer view resists that tidy picture. When a tale crosses a border, the teller often reshapes its ending to fit local values, so a trickster celebrated in one village becomes a cautionary figure in the next. What looks like one story passed along a chain may instead be several arguments about how people there think one ought to behave.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Tricksters appear in the folklore of nearly every region that shares a border.",
        "Folklorists disagree about whether regional tales are worth preserving.",
        "Tale variants spread fastest along well-traveled trade routes between villages.",
        "Variants of a tale can encode distinct local values rather than retell one fixed story.",
      ],
      correct: 3,
      rationale:
        "The text moves from the old 'one story in costumes' idea to the claim that variants carry different moral arguments, which D states fully. A fixates on the trickster example, a single illustration, and B misreads the scholarly shift as a debate about preservation, a topic the passage never raises.",
      paceSeconds: 75,
    },
    {
      id: "central-ideas-4",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Engineers designing quieter aircraft long focused on the engines, the obvious source of noise. But on approach, with engines throttled back, a surprising amount of sound comes from the air itself tearing past the landing gear and the gaps where wing flaps extend. Smoothing these surfaces does little for speed, yet it can shave several decibels from the roar heard by neighborhoods under the flight path. The loudest moment of a landing, it turns out, is partly an aerodynamic problem.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Aircraft engines produce most of the noise heard during a typical flight.",
        "Much of an aircraft's landing noise comes from airflow over the airframe, not the engines.",
        "Communities near airports are exposed to dangerous levels of aircraft noise.",
        "Smoothing an aircraft's surfaces improves both its quietness and its speed.",
      ],
      correct: 1,
      rationale:
        "The passage redirects attention from engines to air rushing over the gear and flaps during approach, making B the central claim. D contradicts the text, which says smoothing does little for speed, and A states the old assumption the passage is correcting rather than its point.",
      paceSeconds: 75,
    },
    {
      id: "central-ideas-5",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "In her later novels, the narrator rarely tells us what a character feels. Instead we get the angle of a hat left on a chair, the half-eaten meal, the letter turned face down. Readers sometimes complain that nothing is explained. Yet the method asks something of us: we assemble the inner life from these stray objects, and the effort makes the eventual recognition land harder than any stated emotion could.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "The novelist withholds direct statements of feeling so that readers infer emotion from objects, deepening its impact.",
        "Readers have objected that the novelist's later work leaves too much unexplained.",
        "The novelist's later novels rely heavily on descriptions of ordinary household items.",
        "Stated emotion in fiction is generally less convincing than implied emotion.",
      ],
      correct: 0,
      rationale:
        "The text explains the technique of conveying feeling through objects and argues it makes the payoff stronger, which A captures end to end. B repeats only the reader complaint the passage answers, and D inflates the specific point into a sweeping rule about all fiction the author never makes.",
      paceSeconds: 78,
    },
    {
      id: "central-ideas-6",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "It is tempting to read a coral reef's bright colors as a sign of health, and bleached white patches as decline. The pigments, however, belong less to the coral than to the algae living inside it. Under mild stress, some corals actually produce vivid pigments of their own, a kind of sunscreen that can shield the algae long enough for the partnership to recover. A flush of unusual color, then, may signal not vigor but a coral straining to hold on.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Coral reefs lose their color when the algae living inside them die off.",
        "The algae inside coral are the source of most of a reef's visible color.",
        "A coral's vivid color can reflect stress rather than the health it seems to suggest.",
        "Corals produce protective pigments that always allow them to survive bleaching events.",
      ],
      correct: 2,
      rationale:
        "The passage overturns the assumption that color means health by explaining that stress-induced pigments can be a sign of strain, so C states the controlling idea. B is a true intermediate detail about where color comes from, and D overgeneralizes the 'sunscreen' point into a guarantee of survival the text carefully avoids with 'long enough' and 'may.'",
      paceSeconds: 82,
    },
    {
      id: "central-ideas-7",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Economists studying small-scale fisheries once assumed that giving each boat a private, tradable catch quota would prevent overfishing, since owners protect what they own. Field studies complicate the assumption. In several communities, the rules that actually held catches in check were unwritten and collective: who could fish which cove, in which season, enforced by reputation rather than paperwork. The lesson is not that property rights fail, but that they are one solution among several, and not always the one a given community has built its trust around.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Private catch quotas are the most reliable way to prevent overfishing in small fisheries.",
        "Some fishing communities prevent overfishing through informal collective rules rather than private ownership.",
        "Unwritten community customs are generally more effective than formal laws at managing shared resources.",
        "Reputation among neighbors determines who may fish a particular cove in many communities.",
      ],
      correct: 1,
      rationale:
        "The text qualifies the property-rights assumption and shows that collective, informal rules can do the same job, which B captures without overclaiming. C drops that qualifier and declares informal rules generally superior, going further than the passage, which calls property rights merely one option among several; D is a true supporting detail about the coves.",
      paceSeconds: 82,
    },
    {
      id: "central-ideas-8",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Translators face a choice that no dictionary settles. Render a poem word for word and the literal meaning survives while the music dies; chase the rhythm and rhyme and you must bend the sense. A growing number of translators argue that the real original is not the words on the page but the experience the words produced in their first readers, and that recreating that experience may sometimes require departing from the words entirely. Fidelity, on this view, is a question of effect, not vocabulary.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "A word-for-word translation preserves a poem's meaning but loses its music.",
        "Translators disagree about whether poetry can be translated at all.",
        "Recreating a poem's rhythm always requires changing its literal meaning.",
        "Some translators define faithful translation by the effect on readers rather than by literal wording.",
      ],
      correct: 3,
      rationale:
        "The passage builds to the argument that fidelity is about reproducing the reader's experience rather than matching words, which D states. A captures only the opening tradeoff, a setup the author moves past, and B misframes the text as a debate over whether translation is possible at all, which it never poses.",
      paceSeconds: 84,
    },
  ],
};
