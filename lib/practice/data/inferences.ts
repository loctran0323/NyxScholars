import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "The student reads a short, self-contained passage that ends in a blank and must supply the conclusion the text most directly supports. Success depends on tracking the logical relationship the passage sets up — a contrast, a cause, a qualification — and choosing the option that follows from the given facts without adding anything new.",
    howToAttack: [
      "Before reading the choices, paraphrase what the passage has established and predict, in your own words, where the logic is heading.",
      "Lock onto the connective signal right before the blank (because, but, however, thus, even though); it tells you whether the ending should agree with, contrast, or explain the prior claim.",
      "Test each choice against the text only: the answer must be fully earned by the sentences given, never by what is generally true in the wider subject.",
    ],
    traps: [
      "An option that is stronger than the evidence — an absolute claim (always, none, proves) when the passage only suggests a tendency.",
      "A true-but-irrelevant statement that fits the topic yet does not complete the specific logical chain the passage built.",
      "A reversed or half-step conclusion that ignores the contrast word before the blank and simply restates what came earlier.",
    ],
  },
  questions: [
    {
      id: "inferences-1",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "Honeybees communicate the location of food through a looping movement often called a waggle dance, in which the angle of the loop encodes direction relative to the sun. Researchers observing colonies kept indoors, with no view of the sky, found that foragers still danced and still recruited nestmates to feeders. The dancers in these colonies, however, oriented their loops at random angles that bore no fixed relationship to where the food actually lay. This suggests that the directional content of the dance ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is learned by young bees only after repeated trips outside the hive.",
        "depends on the dancer's ability to reference the sun's position.",
        "is less important to recruitment than the dance's looping rhythm.",
        "varies more between colonies than within a single colony.",
      ],
      correct: 1,
      rationale:
        "Indoor bees with no sky reference still danced and recruited, but their loop angles became random — so the part that broke when the sun was hidden is precisely the directional, sun-referenced component, which is (B). (C) is the strongest trap: it correctly notes recruitment continued, but the passage never weighs rhythm against direction, and the point is that direction specifically failed, not that it matters less.",
      paceSeconds: 75,
    },
    {
      id: "inferences-2",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "When a city replaces a stretch of asphalt road with lighter-colored, more reflective paving, the new surface absorbs less of the sun's energy and stays cooler at midday. Cooler pavement warms the air just above it less than dark asphalt does. In a neighborhood where many streets were resurfaced this way, the typical afternoon air temperature on those blocks dropped slightly relative to nearby blocks left unpaved. The results imply that the color of a road surface ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "matters only during the hottest months of the year.",
        "affects nighttime temperatures more than daytime temperatures.",
        "can influence the air temperature of the area around it.",
        "is the main factor determining a city's overall climate.",
      ],
      correct: 2,
      rationale:
        "The passage links lighter pavement to a measured drop in nearby afternoon air temperature, so the supported conclusion is the modest (C): surface color can influence surrounding air temperature. (D) is the tempting overreach — it inflates one local, slight effect into the 'main factor' for an entire city's climate, far beyond what a single neighborhood comparison shows.",
      paceSeconds: 70,
    },
    {
      id: "inferences-3",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A long-running debate in art conservation concerns whether to remove the yellowed varnish that earlier restorers applied over old paintings. Cleaning can reveal colors closer to what the artist used, but solvents strong enough to strip aged varnish may also lift thin layers of original glaze. Some conservators now argue that because a discolored varnish can be documented, photographed, and later removed by future specialists, whereas a dissolved glaze cannot be recovered, the more cautious course ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "favors leaving the varnish in place when its removal risks the original paint.",
        "is to clean any painting whose colors have visibly dimmed.",
        "depends entirely on how famous the painting's creator was.",
        "requires replacing lost glaze with a modern substitute.",
      ],
      correct: 0,
      rationale:
        "The conservators' reasoning contrasts a reversible problem (documentable varnish) with an irreversible one (lost glaze), so caution means tolerating the recoverable harm to avoid the permanent one — leaving the varnish when cleaning endangers the paint, which is (A). (B) reverses the logic, recommending exactly the aggressive cleaning the passage warns against; it appeals to the desire to restore original color but ignores the irreversibility argument.",
      paceSeconds: 85,
    },
    {
      id: "inferences-4",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "In the novella, the narrator inherits his uncle's vast library and resolves to read every volume in order of acquisition, beginning with the oldest. He keeps a ledger of his progress, noting the date he finishes each book. Months pass; the ledger fills with entries, yet visitors find him each evening at the same shelf, the same slim volume open on his knee. He turns its pages slowly, then closes it, then opens it again to the first page. The detail of the ledger and the unchanging volume together suggest that the narrator's commitment to finishing the library ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "has been abandoned in favor of writing his own book.",
        "has stalled despite his careful record of intending to proceed.",
        "was never sincere from the moment he inherited the collection.",
        "will succeed once he finishes the difficult opening volume.",
      ],
      correct: 1,
      rationale:
        "The ledger shows he tracks progress, but he is stuck rereading the first pages of one slim book each night — so the resolve persists on paper while the reading itself has stalled, which is (B). (C) overreaches into his original motives; the text shows present paralysis, not that his intent 'was never sincere,' a claim the eager record-keeping actually undercuts.",
      paceSeconds: 85,
    },
    {
      id: "inferences-5",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Some plants release airborne chemicals when chewed by insects, and neighboring plants of the same species often respond by ramping up their own chemical defenses before any insect reaches them. Skeptics proposed that the neighbors were not 'eavesdropping' on a signal but simply detecting the attacking insects directly. To test this, researchers piped the airborne chemicals to undamaged plants kept in a separate enclosure with no insects present. These isolated plants still strengthened their defenses, which indicates that the neighboring plants' response ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is triggered only when an insect physically lands on them.",
        "protects them more effectively than the defenses of the chewed plant.",
        "can be set off by the chemicals alone, without the insects.",
        "proves that plants intentionally warn one another of danger.",
      ],
      correct: 2,
      rationale:
        "The experiment isolated the variable: chemicals reached plants with no insects around, and the plants still responded, so the airborne chemicals alone are sufficient — exactly (C). (D) is the seductive overreach into intention and 'proof'; the data show a chemical trigger, not a deliberate act of warning, and 'proves' is far stronger than a single enclosure test licenses.",
      paceSeconds: 85,
    },
    {
      id: "inferences-6",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Economists studying tipping have noted that in restaurants where the bill suggests a tip calculated on the pre-tax total, customers leave one amount, while in otherwise similar restaurants where the suggestion is based on the post-tax total, customers tend to leave more. Diners in both settings report aiming for roughly the same percentage and rarely recalculate the figure the receipt proposes. Taken together, these observations suggest that the suggested figure printed on a receipt ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is ignored by diners who have a fixed percentage in mind.",
        "shapes the final tip more than diners' stated intentions do.",
        "should be calculated on the pre-tax total to be fair.",
        "has no measurable effect once the meal's quality is considered.",
      ],
      correct: 1,
      rationale:
        "Diners claim to target the same percentage yet leave different amounts depending solely on how the receipt computes the suggestion, and they rarely recompute — so the printed figure, not their stated aim, drives the result, which is (B). (A) directly contradicts the data: if diners truly stuck to a fixed percentage, the two restaurant types would not produce different tips.",
      paceSeconds: 85,
    },
    {
      id: "inferences-7",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Historians once read a medieval kingdom's surviving tax rolls as a near-complete census of its households. Newer work notes that the rolls recorded only those liable for a particular levy, and that clergy, the destitute, and residents of certain chartered towns were each exempt for different reasons. A region's roll might therefore list few names not because it was sparsely settled but because much of its population fell outside the categories the roll was designed to capture. This reasoning implies that a low count of names on such a roll ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "reliably indicates that the region was thinly populated at the time.",
        "should be multiplied by a fixed factor to recover the true population.",
        "reflects the size of the taxed group rather than the total population.",
        "is less trustworthy than counts derived from church records.",
      ],
      correct: 2,
      rationale:
        "The passage explains that rolls captured only those liable for one levy, with whole groups exempt, so a small count measures the taxed subset, not everyone living there — precisely (C). (A) is the discredited older reading the passage exists to overturn; it equates few names with few people, the exact inference the exemptions undermine. (B) invents a 'fixed factor' the text never supports.",
      paceSeconds: 90,
    },
    {
      id: "inferences-8",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A common assumption holds that animals sleep less when food is scarce, trading rest for time spent foraging. Yet in a controlled study, small mammals given reduced rations actually spent more time in deep sleep, not less. One proposed explanation draws on the fact that deep sleep lowers body temperature and slows metabolism, sharply reducing the energy an animal burns while at rest. If that explanation is correct, then for these animals the extra sleep under scarcity ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "indicates that they had given up searching for additional food.",
        "served as a way to conserve energy rather than to seek it.",
        "would disappear if the animals were given unlimited food.",
        "shows that sleep and foraging are unrelated behaviors.",
      ],
      correct: 1,
      rationale:
        "The offered explanation hinges on deep sleep cutting metabolic energy use, so under scarcity the added sleep functions as energy conservation — the response to fewer calories — which is (B). (A) is tempting because more sleep means less foraging, but 'given up searching' attributes a motive the passage doesn't license; the point is energy saved, not surrender, and a hungry animal may still forage when awake.",
      paceSeconds: 90,
    },
    {
      id: "inferences-9",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Translators of poetry face a constraint that prose translators can often ignore: a poem's sound, its meter and rhyme, carries meaning alongside the literal sense of its words. A version that preserves the exact dictionary meaning of each line may lose the music that gave the original its force, while a version that reproduces the music may have to depart from the literal sense. Critics who praise a translation for its 'fidelity' rarely specify which kind they mean. Their praise is therefore ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "evidence that the translation succeeds on both counts at once.",
        "a sign that poetry cannot truly be translated at all.",
        "more useful to readers than the translators' own commentary.",
        "ambiguous, since the two kinds of fidelity can pull against each other.",
      ],
      correct: 3,
      rationale:
        "The passage establishes that fidelity to sense and fidelity to sound can conflict, so praising 'fidelity' without saying which leaves it unclear what was actually achieved — the praise is ambiguous, which is (D). (A) assumes both forms were satisfied, but the setup says reproducing one often forces departing from the other, so unspecified praise cannot certify success on both.",
      paceSeconds: 90,
    },
    {
      id: "inferences-10",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Two ancient harbor towns on the same coast were each abandoned within a generation of one another, and both have long been attributed to a single earthquake. Sediment cores drilled near the first town contain a layer of debris consistent with a sudden wave; cores near the second show no such layer but reveal that the river feeding its harbor had gradually filled the basin with silt, leaving ships no way in. Although the towns failed at nearly the same time, the evidence suggests that the cause of each town's decline ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "was the same earthquake that scholars have traditionally blamed.",
        "remains impossible to determine from the available cores.",
        "differed from the other's despite the closeness of their dates.",
        "was ultimately the silting of a single shared river.",
      ],
      correct: 2,
      rationale:
        "One town shows wave debris while the other shows only gradual silting and no debris, so despite near-simultaneous abandonment the two declines had distinct causes — exactly (C), which the contrast word 'Although' sets up. (A) is the traditional single-earthquake account the cores specifically dismantle for the second town, where there is no sudden-wave layer at all.",
      paceSeconds: 90,
    },
    {
      id: "inferences-11",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Each year a tree adds a ring of new wood, and the width of that ring depends partly on how much the tree grew that season. In a stand of pines, a researcher found that the rings formed during years of known drought were consistently far narrower than those formed in years of normal rainfall. Because all the trees in the stand experienced the same weather, the rings from a single drought year tended to be narrow across every tree sampled. This pattern indicates that, for these pines, the width of a given year's ring ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is determined mainly by the age of the individual tree.",
        "responds to the growing conditions shared by the whole stand.",
        "can be used to date any piece of wood from any species.",
        "matters less to the tree's survival than the ring's color.",
      ],
      correct: 1,
      rationale:
        "Narrow rings appeared across every tree in the same drought year while normal years produced wider rings, so ring width tracks the weather the stand shared — exactly (B). (A) is the strongest trap: it offers a plausible biological factor, but the data hold the trees' differing ages constant by showing the whole stand narrows together in one year, pinning the variation on shared conditions, not individual age.",
      paceSeconds: 85,
    },
    {
      id: "inferences-12",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Roman roads were once marked at regular intervals by inscribed stone milestones recording distances and the emperor who ordered repairs. Archaeologists note that the milestones still standing today are heavily skewed toward stretches of road that later passed through quiet farmland. Along routes that became busy medieval streets, by contrast, the stones were routinely broken up and reused as building material. A historian therefore cautions that the surviving milestones ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "prove that rural roads were better built than urban ones.",
        "were inscribed only during the reigns of the most active emperors.",
        "over-represent roads that avoided heavily built-up areas.",
        "record distances that are no longer accurate today.",
      ],
      correct: 2,
      rationale:
        "Stones along busy routes were scavenged for building while those in quiet farmland survived, so the surviving set leans toward roads that stayed rural — precisely (C). (A) is the strongest trap: it is a true-sounding leap to construction quality, but the passage explains survival by later reuse, not by how well each road was originally built, so nothing here speaks to relative construction.",
      paceSeconds: 85,
    },
    {
      id: "inferences-13",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Young male songbirds of certain species do not hatch knowing their species' song; they assemble it by imitating adults they hear nearby. Researchers studying one such species found that birds raised in a valley sang a version with a distinctive trill, while birds of the same species raised over the ridge sang a version lacking it. When eggs from the valley were moved and hatched among the ridge birds, the chicks grew up singing the ridge version, trill and all absent. These results suggest that the trill in a young bird's song ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is inherited from the bird's biological parents.",
        "depends on which adults the bird grows up hearing.",
        "appears only in valleys with particular acoustics.",
        "makes a male more attractive to potential mates.",
      ],
      correct: 1,
      rationale:
        "Valley eggs raised among ridge birds produced ridge songs without the trill, so the song a bird develops follows the adults it hears, not its parentage — exactly (B). (A) is the strongest trap, the intuitive 'it's genetic' reading, but the cross-fostering result is designed to refute it: birds with valley ancestry sang the ridge version, showing upbringing, not inheritance, fixed the trill.",
      paceSeconds: 85,
    },
    {
      id: "inferences-14",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "In the short story, Mr. Brell repairs the town's clocks and is famous for the precision of his work; citizens set their watches by the chimes of the instruments he tends. Yet the tall clock in his own front hall has stood silent for years, its hands frozen at a quarter past four. When a customer once remarked on it, Brell only smiled and said he preferred to know the time by the church bell across the square. The contrast between his trade and his hallway suggests that Brell's relationship to his own clock ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "differs from the care he devotes to the clocks of others.",
        "proves he has secretly lost his skill at repairs.",
        "reflects a town-wide decline in the use of timepieces.",
        "will change once the church bell falls into disrepair.",
      ],
      correct: 0,
      rationale:
        "Brell keeps the whole town's clocks running flawlessly yet lets his own stand frozen and shrugs it off, so his stance toward his personal clock departs from the meticulous care he gives others' — exactly (A), the contrast the passage builds. (B) is the strongest trap: it reads the dead clock as failing skill, but his renown for precise work and his casual preference for the church bell show choice, not lost ability.",
      paceSeconds: 85,
    },
    {
      id: "inferences-15",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Many marine animals build shells and skeletons from calcium carbonate, a mineral that dissolves more readily as seawater grows more acidic. As the ocean absorbs more carbon dioxide from the atmosphere, its surface waters have become measurably more acidic over recent decades. In tank experiments, young oysters reared in water adjusted to this lower pH grew thinner, more fragile shells than oysters reared in present-day seawater. Although such tanks cannot reproduce the full ocean, the findings imply that continued acidification ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "will eliminate oysters from the ocean within a few decades.",
        "could make it harder for shell-building animals to form sturdy shells.",
        "affects oysters but leaves other shelled animals unharmed.",
        "has already become the leading threat to all marine life.",
      ],
      correct: 1,
      rationale:
        "Lower-pH water yielded thinner, weaker oyster shells, and the passage notes carbonate dissolves more in acid, so further acidification could impede sturdy shell formation in such animals — the hedged (B), matching the tanks' limits. (A) is the strongest trap, inflating 'thinner shells in a tank' into total extinction on a timeline; the qualifier 'cannot reproduce the full ocean' explicitly blocks that certainty.",
      paceSeconds: 90,
    },
    {
      id: "inferences-16",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A polling firm mailed a satisfaction survey to every customer of a service and received replies from only a small fraction of them. Follow-up interviews with a random sample of the non-responders revealed that those who had not bothered to reply were, on average, noticeably more content than those who had. The people moved to fill out and return the survey were disproportionately those with a complaint they wanted heard. This pattern suggests that the average rating drawn from the returned surveys alone ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "accurately reflects the views of the typical customer.",
        "would rise if the firm sent the survey a second time.",
        "likely understates how satisfied customers are overall.",
        "proves that most customers are dissatisfied with the service.",
      ],
      correct: 2,
      rationale:
        "Responders skewed toward complainers while the more contented customers stayed silent, so a rating built only from returns tilts negative relative to the whole — it understates true satisfaction, exactly (C). (D) is the strongest trap: it treats the returned surveys at face value as proof of widespread discontent, the very bias the passage exposes, since the silent majority was actually more satisfied.",
      paceSeconds: 90,
    },
    {
      id: "inferences-17",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Historians measuring the spread of early printing sometimes count the number of distinct pamphlet titles a town's presses issued in a given year. One scholar warns that a title was often reprinted many times when demand was high, yet each title counts only once in this tally, no matter how many copies circulated. A town that printed a handful of wildly popular works might thus register fewer titles than a town that printed many that almost no one bought. The scholar concludes that a town's title count ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is a more reliable measure than the number of copies printed.",
        "may not reflect how many printed pages actually reached readers.",
        "should be ignored in favor of counting the town's presses.",
        "rises whenever a town's population grows larger.",
      ],
      correct: 1,
      rationale:
        "Because one hugely reprinted title still counts once, the title tally can miss the true volume of printed matter in circulation — so it may not capture how many pages reached readers, exactly (B). (A) is the strongest trap, a reversal: the passage exposes the title count's blind spot to reprint volume, making it less reliable than a copy-based measure for gauging reach, not more.",
      paceSeconds: 90,
    },
    {
      id: "inferences-18",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "When a planet passes directly between its star and a distant telescope, it blocks a sliver of the star's light, and the star appears to dim by a tiny, fixed fraction during each pass. The depth of this dimming depends on how large the planet is compared with its star: a bigger planet covers more of the disk and causes a deeper dip. Astronomers monitoring one star recorded two distinct dimming events of clearly different depths, repeating on two different schedules. The simplest reading of these data is that the star ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "is itself variable and fluctuating in brightness on its own.",
        "is orbited by more than one planet, differing in size.",
        "has a single planet whose size changes as it orbits.",
        "lies closer to the telescope than astronomers had assumed.",
      ],
      correct: 1,
      rationale:
        "Two dips of different depths on two schedules mean two transiting bodies of different sizes crossing on separate orbits, so the star most simply hosts more than one planet — exactly (B). (C) is the strongest trap: it keeps a single planet but invents a changing size to explain the two depths, contradicting the premise that a planet's size sets a fixed dip, and a fixed-size planet cannot produce two different depths.",
      paceSeconds: 90,
    },
    {
      id: "inferences-19",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "When a company automatically enrolls new employees in its retirement savings plan, workers must actively opt out to avoid participating; when enrollment is voluntary, they must actively opt in to join. Surveys find that employees in both arrangements express nearly identical attitudes about the importance of saving for retirement. Yet participation rates are markedly higher under automatic enrollment than under voluntary enrollment. Since the stated attitudes are so similar across the two groups, the gap in participation is best explained by ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "a real difference in how much the two groups value saving.",
        "which action—opting in or opting out—the default requires.",
        "the higher salaries paid at companies that enroll automatically.",
        "employees' complete indifference to their own retirement.",
      ],
      correct: 1,
      rationale:
        "Attitudes toward saving are nearly identical, yet participation diverges with the enrollment rule, so what differs is which choice the default forces workers to make — exactly (B). (A) is the strongest trap: it attributes the gap to differing values, but the passage explicitly states the two groups' attitudes are the same, ruling that explanation out and isolating the default as the operative difference.",
      paceSeconds: 90,
    },
    {
      id: "inferences-20",
      skill: "inferences",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Linguists can sometimes trace contact between two peoples by examining the words one language borrowed from another. In the language of one inland community, the words for boats, nets, and several saltwater fish are clearly borrowed from a distant coastal language, while the inland community's own words handle farming and herding. The borrowed terms cluster entirely around seafaring, a way of life the inland speakers did not practice themselves. This concentration suggests that the two groups' historical contact ______",
      prompt: "Which choice most logically completes the text?",
      choices: [
        "involved the inland people's own fishing expeditions to the coast.",
        "centered on matters tied to the sea rather than on farming life.",
        "proves the inland community originally lived on the coast.",
        "lasted longer than contact between any other two groups.",
      ],
      correct: 1,
      rationale:
        "The borrowed words cluster around seafaring while the community kept its own farming and herding terms, so the contact that left this mark concerned sea-related matters, not agriculture — exactly (B). (C) is the strongest trap: borrowing words for an unfamiliar way of life signals outside contact, but it does not 'prove' the inland group once lived on the coast; the kept farming vocabulary actually points to a long inland tradition.",
      paceSeconds: 90,
    },
  ],
};
