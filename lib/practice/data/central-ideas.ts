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
    {
      id: "central-ideas-9",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "For decades, birdwatchers logged the spring arrival of migratory songbirds as a fixed calendar event, year after year on roughly the same dates. Long-term records now show those dates drifting earlier. The trouble is that the insects the birds feed their chicks are also emerging earlier, and in some species the insects have shifted faster than the birds. A nest timed perfectly a generation ago may now hatch into a world where the peak of food has already passed.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Migratory songbirds now arrive in spring on roughly the same dates they always have.",
        "Insects that songbirds feed their chicks have begun emerging earlier in spring.",
        "Shifts in migration and insect timing can leave nesting birds out of step with their food supply.",
        "Birdwatchers have kept detailed records of songbird arrival dates for many decades.",
      ],
      correct: 2,
      rationale:
        "The text moves from drifting arrival dates to the mismatch between birds and the insects they depend on, so C captures the whole point. B is a true supporting detail but only half the mismatch, and A states the old fixed-calendar view the passage is correcting rather than its conclusion.",
      paceSeconds: 75,
    },
    {
      id: "central-ideas-10",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "City planners have long treated street trees as ornament, a pleasant touch with no real bearing on infrastructure. Measurements taken on hot afternoons argue otherwise. A street shaded by a mature canopy can run several degrees cooler than a bare one nearby, and that gap lowers the strain on air conditioners, softens peak electricity demand, and even slows the cracking of asphalt baked by the sun. The leaves overhead, it turns out, are doing structural work.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Street trees provide practical benefits that planners have wrongly dismissed as merely decorative.",
        "A shaded street can be several degrees cooler than an unshaded one nearby.",
        "Mature trees are the most effective way for a city to reduce its electricity demand.",
        "Asphalt streets crack more quickly when they are exposed to direct sunlight.",
      ],
      correct: 0,
      rationale:
        "The passage overturns the 'ornament' assumption by showing trees cool streets and ease real infrastructure burdens, which A states fully. B and D are single supporting measurements, and C overreaches by ranking trees as the *most* effective demand-reduction tool, a comparison the text never makes.",
      paceSeconds: 75,
    },
    {
      id: "central-ideas-11",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Roman seawalls and harbor piers have stood for two thousand years while modern concrete crumbles in decades, and the contrast once looked like a lost secret. Analysis of the ancient material suggests something stranger. Rather than simply resisting seawater, the Roman mix reacts with it: minerals in the seawater seep into tiny cracks and crystallize there, knitting the structure tighter over time. The very element that destroys modern concrete is what the Roman recipe quietly recruited as a repair.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Roman concrete structures have survived in the sea for about two thousand years.",
        "Modern concrete tends to deteriorate within a few decades of construction.",
        "Roman concrete endures because seawater triggers reactions that strengthen it over time.",
        "Seawater is the leading cause of damage to concrete structures along the coast.",
      ],
      correct: 2,
      rationale:
        "The text builds to the surprising mechanism by which seawater repairs rather than ruins the Roman mix, so C states the controlling idea. A and B are framing details that set up the contrast, and D fixates on the destructive role of seawater while missing the passage's point that the Roman recipe turns that force to its advantage.",
      paceSeconds: 78,
    },
    {
      id: "central-ideas-12",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "To an untrained ear, a jazz solo can sound like pure invention, notes plucked from nowhere in the moment. Musicians describe something more disciplined. A soloist works within the song's harmonic frame, drawing on phrases practiced for years and reshaping them to fit the chord passing underneath. The freedom listeners hear is real, but it rides on a scaffold of structure so familiar to the player that the choices feel spontaneous even when they are deeply prepared.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Jazz soloists invent their melodies entirely on the spot, with no advance preparation.",
        "A jazz solo's apparent spontaneity rests on practiced material and underlying structure.",
        "Jazz musicians spend years practicing phrases before they perform in public.",
        "Listeners cannot tell the difference between improvised and composed music.",
      ],
      correct: 1,
      rationale:
        "The passage corrects the 'pure invention' impression by showing the solo rests on a harmonic frame and rehearsed phrases, which B captures end to end. C is a true supporting detail about practice, and A states the misconception the text is dismantling rather than its claim.",
      paceSeconds: 78,
    },
    {
      id: "central-ideas-13",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "An octopus changing color is often described as hiding, a creature blending into rock or sand to vanish. Closer study muddies that simple account. The same animal will flush dark, ripple a pattern across its skin, or flash a sudden contrast not to disappear but to startle a rival, court a mate, or signal a warning. Camouflage is only one use of a skin that functions, much of the time, less like a cloak than like a face.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "An octopus changes color mainly to blend into rocks and sand around it.",
        "The octopus's color changes serve communication and display, not only concealment.",
        "An octopus can flash a sudden contrasting pattern to startle an approaching rival.",
        "The octopus has the most versatile skin of any animal in the ocean.",
      ],
      correct: 1,
      rationale:
        "The passage replaces the 'just hiding' view with the broader claim that color change also signals, courts, and warns, so B states the whole point. C is one true example of that range, and A repeats the narrow assumption the text complicates; D overreaches into a superlative comparison the passage never makes.",
      paceSeconds: 82,
    },
    {
      id: "central-ideas-14",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "The invention of linear perspective is usually told as a triumph of accuracy, the moment painters learned to render space as the eye truly sees it. That telling overlooks a cost. To fix a scene to a single vanishing point, the painter must also fix the viewer, freezing one eye at one spot and one instant. Earlier images that ignored this rule could show a building from several sides at once or hold many moments together, a flexibility that the new precision quietly traded away.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Linear perspective allowed painters to render space exactly as the human eye sees it.",
        "Earlier paintings could depict a building from several sides within a single image.",
        "Linear perspective gained spatial accuracy at the cost of a flexibility earlier images had.",
        "Most viewers prefer paintings that use a single, consistent vanishing point.",
      ],
      correct: 2,
      rationale:
        "The text grants perspective's accuracy but argues it sacrificed the multiple viewpoints earlier images enjoyed, which C captures as a tradeoff. A states only the celebratory framing the passage qualifies, and B is a true supporting detail about earlier work; D invents a claim about viewer preference the text never raises.",
      paceSeconds: 84,
    },
    {
      id: "central-ideas-15",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "We tend to picture sleep as a pause, the mind switched off while the body recovers. Laboratory work points the other way. During certain sleep stages the brain replays the day's experiences in compressed bursts, strengthening the connections that matter and pruning the ones that do not, so that a skill rehearsed before bed is often performed better the next morning. Far from idling, the sleeping brain is sorting and filing, deciding what the waking mind will be able to keep.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "The brain replays the day's experiences in compressed bursts during certain sleep stages.",
        "A skill practiced before sleeping is often performed better the following morning.",
        "Sleep is best understood as a period of complete rest for both brain and body.",
        "Rather than resting, the sleeping brain actively consolidates and sorts what was learned.",
      ],
      correct: 3,
      rationale:
        "The passage overturns the 'switched off' image by showing sleep actively replays, strengthens, and prunes memories, so D states the controlling idea. A and B are supporting details that illustrate this work, and C states the very assumption the text is built to refute rather than its conclusion.",
      paceSeconds: 82,
    },
    {
      id: "central-ideas-16",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Writing is often imagined to begin with someone deciding to record speech, scratching the first words onto a surface. The clay record of early Mesopotamia suggests a humbler origin. For centuries before sentences appeared, accountants pressed small tokens into clay to tally sheep, grain, and jars of oil, and the marks those tokens left gradually became standardized signs. Writing, on this account, did not start as a way to capture language at all, but as a way to keep count.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "Early Mesopotamian accountants used clay tokens to keep track of goods like grain and oil.",
        "Writing may have originated from accounting practices rather than from an effort to record speech.",
        "The first written sentences appeared in Mesopotamia centuries after counting began.",
        "Standardized signs are more useful for trade than the tokens that preceded them.",
      ],
      correct: 1,
      rationale:
        "The text replaces the 'recording speech' story with evidence that writing grew out of counting, which B captures as the central claim. A is a true supporting detail about the tokens, and C restates a chronological point in service of that detail; D draws a usefulness comparison the passage never makes.",
      paceSeconds: 84,
    },
    {
      id: "central-ideas-17",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A glacier-fed river looks like a single body of water, but its life is governed by a hidden clock. Each summer day, the sun melts the ice fastest in the afternoon, so the river swells hours later as that meltwater works its way down, then shrinks again overnight. The creatures that live in it have organized their feeding and spawning around this daily pulse. Dam the river or warm the glacier away, and the steady flow that replaces the pulse can quietly unmake the ecosystem it seemed to preserve.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "A glacier-fed river rises in the afternoon and falls again during the night.",
        "Warming temperatures are causing glaciers around the world to melt and recede.",
        "A glacier-fed river's daily rise and fall shapes life that a steadier flow could disrupt.",
        "Dams are the greatest threat facing rivers that are fed by mountain glaciers.",
      ],
      correct: 2,
      rationale:
        "The passage ties the river's daily meltwater pulse to the organisms that depend on it and warns that smoothing the pulse could unravel the ecosystem, so C states the whole point. A is a true detail about the daily cycle without the ecological stakes, and B and D introduce broad threats the text mentions only as illustrations, not as its main claim.",
      paceSeconds: 82,
    },
    {
      id: "central-ideas-18",
      skill: "central-ideas",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "When photography spread in the nineteenth century, many predicted it would render painting obsolete, since a camera could capture a likeness in seconds that a portraitist labored days to achieve. The opposite unfolded. Freed from the duty of exact resemblance, painters turned toward what a photograph could not do: dissolving a scene into shimmering light, distorting a figure to convey feeling, abandoning the visible world altogether. The new machine did not end painting so much as release it to become something the camera could not.",
      prompt: "Which choice best states the main idea of the text?",
      choices: [
        "A camera could capture a likeness far faster than a portrait painter could.",
        "Many nineteenth-century observers expected photography to make painting obsolete.",
        "Rather than ending painting, photography freed it to pursue what a camera could not do.",
        "Painters in the nineteenth century gradually abandoned realistic representation entirely.",
      ],
      correct: 2,
      rationale:
        "The text reverses the prediction that photography would kill painting, arguing instead that it pushed painting toward effects a camera cannot achieve, which C captures end to end. B states the expectation the passage overturns, and A is a supporting detail behind that expectation; D overgeneralizes one example into a claim that all painters abandoned realism, which the text does not support.",
      paceSeconds: 84,
    },
  ],
};
