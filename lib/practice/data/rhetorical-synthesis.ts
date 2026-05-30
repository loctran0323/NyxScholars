import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Whether you can match a single sentence to a precise rhetorical goal, drawing only the facts from the notes that the goal actually requires, rather than picking any choice that happens to be true.",
    howToAttack: [
      "Read the goal first and translate it into a test, such as 'must compare two things,' 'must define the topic for a newcomer,' or 'must state one advantage,' then hold every choice to that test.",
      "Confirm each option is factually supported by the notes, then eliminate the true-but-off-target ones that answer a different question than the goal poses.",
      "Check that the winning sentence does the rhetorical work in the foreground, not buried inside a clause, and that it includes every element the goal names.",
    ],
    traps: [
      "A choice that is fully accurate and well written but accomplishes a different goal, such as describing one item when the goal asks for a contrast between two.",
      "A choice that names the right two items but reports them side by side without stating the similarity or difference the goal demands.",
      "A choice that smuggles in detail not present in the notes, or that states the point so faintly that the required emphasis is lost.",
    ],
  },
  questions: [
    {
      id: "rhetorical-synthesis-1",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 3,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Two coastal towns, Harlow and Brent, both rebuilt their seawalls after a 1998 storm.\n• Harlow used poured concrete; Brent used stacked granite blocks.\n• Both walls have survived every storm since without major repair.\n• Both projects were finished within two years of the storm.",
      prompt:
        "The student wants to emphasize a similarity between the two towns' seawall projects. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Harlow built its seawall from poured concrete, while Brent stacked granite blocks instead.",
        "Although they chose different materials, both Harlow and Brent finished their seawalls within two years and have needed no major repairs since.",
        "Brent's seawall, made of stacked granite blocks, was completed within two years of the 1998 storm.",
        "After the 1998 storm, the towns of Harlow and Brent each faced the task of rebuilding a seawall.",
      ],
      correct: 1,
      rationale:
        "The goal demands a stated similarity, and only the second choice names a shared outcome (both finished quickly and have needed no major repairs) common to both towns. The first choice is the strongest trap because it accurately pairs the two towns, but it foregrounds their difference in materials, the opposite of the goal.",
      paceSeconds: 80,
    },
    {
      id: "rhetorical-synthesis-2",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Tardigrades are microscopic animals fewer than 1.5 millimeters long.\n• They can survive being frozen, dried out, and exposed to the vacuum of space.\n• They do this by entering a dormant state called cryptobiosis, slowing their metabolism almost to zero.\n• When conditions improve, they revive and resume normal activity.",
      prompt:
        "The student wants to introduce tardigrades to an audience unfamiliar with them. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "In cryptobiosis, a tardigrade slows its metabolism almost to zero until conditions improve.",
        "Unlike most animals, tardigrades can endure the vacuum of space without dying.",
        "Once conditions improve, tardigrades revive and resume their normal activity.",
        "Tardigrades are microscopic animals, under 1.5 millimeters long, known for surviving extreme conditions such as freezing and drying.",
      ],
      correct: 3,
      rationale:
        "Introducing the topic to newcomers requires saying what tardigrades are before detailing how they behave, which only the fourth choice does by giving the definition, size, and the trait they are known for. The first choice is the main trap: it is accurate but assumes the reader already knows what a tardigrade is and jumps straight to the mechanism of cryptobiosis.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-3",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Researchers tested two methods for purifying a small batch of drinking water.\n• Method A used a charcoal filter and took 10 minutes per liter.\n• Method B used ultraviolet light and took 2 minutes per liter.\n• Both methods removed more than 99 percent of harmful bacteria.\n• Method A also removed some chemical odors; Method B did not.",
      prompt:
        "The student wants to present a specific advantage of Method B over Method A. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Both Method A and Method B removed more than 99 percent of harmful bacteria from the water.",
        "Method B purified a liter of water in 2 minutes, far faster than Method A's 10 minutes.",
        "Method A, unlike Method B, removed some chemical odors from the treated water.",
        "Method A relied on a charcoal filter, whereas Method B used ultraviolet light.",
      ],
      correct: 1,
      rationale:
        "An advantage of Method B must name something Method B does better, and only the second choice does so by contrasting its 2-minute speed with Method A's 10 minutes. The fourth choice is the closest trap: it correctly contrasts the two methods, but it merely reports their different tools without saying which is better, so no advantage is presented.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-4",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A weaver studied two regional textile traditions, one inland and one coastal.\n• The inland tradition favored tight geometric patterns in undyed wool.\n• The coastal tradition favored loose floral patterns in brightly dyed cotton.\n• Both traditions passed designs from one generation to the next by memory, without written records.\n• Both are now taught in formal workshops to prevent the designs from being lost.",
      prompt:
        "The student wants to emphasize a difference between the two textile traditions. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The inland tradition favored tight geometric patterns in undyed wool, whereas the coastal tradition favored loose floral patterns in brightly dyed cotton.",
        "The coastal tradition is now taught in formal workshops so that its designs are not lost.",
        "Both the inland and coastal traditions once passed their designs along by memory rather than written records.",
        "Like the inland tradition, the coastal tradition is now preserved through formal workshops.",
      ],
      correct: 0,
      rationale:
        "A difference must set the two traditions against each other on the same point, which only the first choice does by contrasting their patterns, materials, and dyes. The third choice is the strongest trap because it cleanly pairs both traditions, but it states a shared method of transmission, emphasizing a similarity rather than the required difference.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-5",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 3,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A city planted 500 young trees along a busy avenue in 2015.\n• By 2023, the trees had grown enough to shade most of the sidewalk.\n• Summer afternoon temperatures on the avenue dropped by about 3 degrees Celsius.\n• Foot traffic on the avenue rose, and several new shops opened.",
      prompt:
        "The student wants to present the main environmental effect of the tree planting. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Once the trees matured, summer afternoon temperatures on the avenue fell by about 3 degrees Celsius.",
        "After the trees grew in, foot traffic on the avenue rose and several new shops opened.",
        "In 2015 the city planted 500 young trees along a busy avenue.",
        "By 2023, the trees had grown tall enough to shade most of the sidewalk.",
      ],
      correct: 0,
      rationale:
        "An environmental effect must describe a change to the physical surroundings, and the cooling of 3 degrees Celsius in the first choice is the only such result among the options. The second choice is the trap: rising foot traffic and new shops are genuine effects of the planting, but they are economic outcomes, not environmental ones.",
      paceSeconds: 80,
    },
    {
      id: "rhetorical-synthesis-6",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• An archaeologist studied a grain storage pit at a 4,000-year-old village.\n• The pit was lined with clay to keep moisture out.\n• A nearby village from the same period stored grain in raised wooden bins.\n• The raised bins kept grain dry by lifting it off the damp ground.\n• Both designs protected stored grain from spoiling in a wet climate.",
      prompt:
        "The student wants to generalize about how the two villages solved a shared problem. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "One village lined its grain storage pit with clay to keep moisture out of the stored grain.",
        "The second village raised its grain off the damp ground using wooden bins.",
        "The two villages stored grain about 4,000 years ago, one in a pit and one in raised wooden bins.",
        "Although the two villages used different designs, each found a way to keep stored grain dry in a wet climate.",
      ],
      correct: 3,
      rationale:
        "A generalization must state the common principle both villages illustrate, which only the fourth choice does by drawing the shared goal of keeping grain dry out of the two different designs. The third choice is the strongest trap: it names both villages and both methods, but it simply lists the two examples without extracting the general point that unites them.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-7",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A composer wrote a symphony in 1804 and revised it in 1806.\n• The 1804 version ran about 55 minutes and called for a large orchestra.\n• The 1806 version cut roughly 8 minutes of music.\n• Critics at the 1804 premiere complained the work was too long.\n• Audiences received the 1806 version more warmly.",
      prompt:
        "The student wants to explain why the composer revised the symphony. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Because critics at the 1804 premiere complained the symphony was too long, the composer cut about 8 minutes for the 1806 version.",
        "Audiences received the 1806 version of the symphony more warmly than the 1804 version.",
        "The 1806 version cut roughly 8 minutes of music from the original 55-minute work.",
        "The composer first wrote the symphony in 1804 and then revised it two years later, in 1806.",
      ],
      correct: 0,
      rationale:
        "Explaining why the revision happened requires linking a cause to the change, which only the first choice does by tying the critics' complaint about length to the 8-minute cut. The third choice is the main trap: it accurately describes what the revision did, but it reports the outcome without giving the reason the goal asks for.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-8",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A team compared two crops grown on the same dry farmland.\n• Sorghum produced a smaller harvest but needed very little water.\n• Maize produced a larger harvest but needed frequent irrigation.\n• During a drought year, the maize crop failed while the sorghum survived.\n• Farmers in the region have limited access to irrigation water.",
      prompt:
        "The student wants to argue that sorghum is the better choice for this region. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Maize produces a larger harvest than sorghum when it receives frequent irrigation.",
        "Because the region's farmers have little irrigation water, sorghum's low water needs make it the more reliable crop there.",
        "Sorghum and maize were both grown on the same dry farmland during the study.",
        "During the drought year, the maize crop failed on the region's farmland.",
      ],
      correct: 1,
      rationale:
        "Arguing for sorghum requires connecting its strength to the region's conditions, which only the second choice does by tying sorghum's low water needs to the farmers' limited irrigation. The fourth choice is the closest trap: the maize failure supports sorghum indirectly, but it states only what happened to maize and never makes the case for sorghum that the goal demands.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-9",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A linguist recorded a language spoken by fewer than 200 people.\n• The language has no written form and is learned only by listening.\n• Most fluent speakers are over the age of 60.\n• Younger community members mainly speak the country's dominant language.\n• The linguist's recordings are being archived for future study.",
      prompt:
        "The student wants to emphasize why the language is at risk of disappearing. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "A linguist has recorded the language and is archiving the recordings for future study.",
        "The language has no written form and has traditionally been learned only by listening.",
        "Because most fluent speakers are over 60 and younger members favor the dominant language, the language has few people left to carry it forward.",
        "Fewer than 200 people speak the language, which has no written form.",
      ],
      correct: 2,
      rationale:
        "Emphasizing the risk of disappearance requires showing that transmission to the next generation is failing, which only the third choice captures by pairing the aging speakers with the young people's shift to another language. The fourth choice is the strongest trap: a tiny, unwritten language sounds vulnerable, but small size and lack of writing alone do not explain why it is dying, since the danger is the broken handoff between generations.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-10",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Two bridges over the same river were built a century apart.\n• The older bridge, built in 1890, used iron and carried horse-drawn carts.\n• The newer bridge, built in 1990, used steel and carries heavy trucks.\n• Both bridges were designed with arches to spread the load across their supports.\n• Both remain in use today.",
      prompt:
        "The student wants to emphasize a similarity in how the two bridges were engineered, despite their different eras. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The 1890 bridge was built of iron, while the 1990 bridge was built of steel.",
        "The older bridge once carried horse-drawn carts, but the newer one carries heavy trucks.",
        "Though built a century apart, both bridges rely on arches to spread their loads across their supports.",
        "Built a century apart, both bridges still remain in use over the same river today.",
      ],
      correct: 2,
      rationale:
        "The goal asks specifically for a similarity in engineering, and only the third choice names a shared design feature, the load-spreading arch, that both bridges use. The fourth choice is the strongest trap: it is a genuine similarity acknowledged across eras, but staying in use is an outcome, not a fact about how the bridges were engineered.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-11",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Honeybees and bumblebees both pollinate crops and live in colonies.\n• Honeybee colonies survive the winter as a group, clustering for warmth.\n• In a bumblebee colony, only the new queens survive the winter; the rest die in autumn.\n• Honeybee colonies can contain tens of thousands of workers.\n• Bumblebee colonies rarely exceed a few hundred workers.",
      prompt:
        "The student wants to emphasize a difference between honeybee and bumblebee colonies. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Both honeybees and bumblebees pollinate crops and live together in colonies.",
        "Honeybee colonies can contain tens of thousands of workers, far more than a bumblebee colony's few hundred.",
        "Bumblebee colonies rarely grow beyond a few hundred workers over the course of a season.",
        "Honeybees cluster together for warmth in order to survive the cold winter months.",
      ],
      correct: 1,
      rationale:
        "A difference must measure the two colonies against each other on the same point, which only the second choice does by contrasting the tens of thousands of honeybee workers with the bumblebee's few hundred. The first choice is the strongest trap: it cleanly pairs both insects, but it reports a shared trait, emphasizing a similarity rather than the difference the goal requires.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-12",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Aerogel is a solid material made mostly of air, with tiny pores throughout.\n• It is one of the lightest solids ever created.\n• Despite being so light, it can support many times its own weight.\n• It is an excellent insulator, blocking heat far better than ordinary foam.\n• Engineers have used it to insulate spacecraft and protect scientific instruments.",
      prompt:
        "The student wants to introduce aerogel to an audience unfamiliar with it. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Engineers have used aerogel to insulate spacecraft and to protect scientific instruments.",
        "Although aerogel is extremely light, it can still support many times its own weight.",
        "Aerogel is a porous solid made mostly of air, one of the lightest solids ever created.",
        "Aerogel blocks heat far more effectively than ordinary foam does.",
      ],
      correct: 2,
      rationale:
        "Introducing aerogel to newcomers requires first saying what it is, which only the third choice does by defining it as a porous, air-filled solid and noting that it is among the lightest solids ever made. The second choice is the strongest trap: it is accurate and striking, but it highlights one property as if the reader already knows what aerogel is, skipping the basic definition a newcomer needs.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-13",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A museum tested two ways to display a fragile centuries-old manuscript.\n• Option 1 kept the manuscript on permanent open display under low light.\n• Option 2 sealed it in a dark case and showed it only one week each year.\n• Under Option 1, the ink began to fade within a few years.\n• Under Option 2, conservators detected no measurable fading after a decade.",
      prompt:
        "The student wants to present a specific advantage of Option 2 over Option 1. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Option 1 placed the manuscript on permanent display, while Option 2 kept it in a sealed dark case.",
        "Under Option 2, conservators found no measurable fading after a decade, unlike the ink that faded under Option 1.",
        "Option 2 limited public viewing of the manuscript to a single week each year.",
        "Under Option 1, the manuscript's ink began to fade within just a few years of display.",
      ],
      correct: 1,
      rationale:
        "An advantage of Option 2 must name something it does better, which only the second choice does by contrasting its lack of fading after a decade with the fading seen under Option 1. The first choice is the strongest trap: it correctly contrasts the two display methods, but it only describes how they differ in setup without identifying which preserves the manuscript better, so no advantage is presented.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-14",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A startup released a navigation app and a fitness app in the same year.\n• The navigation app earned strong reviews but few downloads.\n• The fitness app was downloaded millions of times within months.\n• After the fitness app's success, the startup hired 40 new employees.\n• The startup then opened a second office in another city.",
      prompt:
        "The student wants to explain why the startup expanded. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The startup released both a navigation app and a fitness app during the same year.",
        "After hiring 40 new employees, the startup opened a second office in another city.",
        "Following the fitness app's millions of downloads, the startup hired 40 employees and opened a second office.",
        "The navigation app earned strong reviews but was downloaded only a few times.",
      ],
      correct: 2,
      rationale:
        "Explaining why the startup expanded requires linking the expansion to its cause, which only the third choice does by tying the fitness app's millions of downloads to the new hires and second office. The second choice is the strongest trap: it accurately describes the expansion itself, but it reports the growth without giving the reason, the app's success, that the goal asks for.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-15",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A chef studied bread-making in two villages on opposite sides of a mountain.\n• One village let its dough rise with wild yeast gathered from the air.\n• The other village used a starter passed down for generations.\n• The wild-yeast loaves were tangy and dense, while the starter loaves were milder and airier.\n• In both villages, bakers shaped each loaf entirely by hand.",
      prompt:
        "The student wants to generalize about a shared practice in the two villages' bread-making. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "One village relied on wild yeast gathered from the air to make its dough rise.",
        "The wild-yeast loaves were tangy and dense, while the starter loaves were milder and airier.",
        "Despite using different methods to leaven their dough, bakers in both villages shaped every loaf entirely by hand.",
        "The second village used a bread starter that had been passed down for many generations.",
      ],
      correct: 2,
      rationale:
        "A generalization about a shared practice must state what both villages do in common, which only the third choice does by drawing out the hand-shaping of every loaf across the two methods. The second choice is the strongest trap: it accurately pairs the two villages, but it contrasts how their loaves differ, emphasizing a difference rather than the shared practice the goal demands.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-16",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A town compared two ways to commute downtown: a new bike lane and the existing bus line.\n• The bus line covers the route in 25 minutes.\n• A cyclist covers the same route in 18 minutes.\n• The bus runs only once every 30 minutes during the day.\n• The bike lane lets cyclists depart whenever they choose.",
      prompt:
        "The student wants to present a specific advantage of cycling over taking the bus. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Both the bike lane and the bus line connect the same neighborhoods to downtown.",
        "A cyclist covers the downtown route in 18 minutes, faster than the bus's 25-minute trip.",
        "The bus line completes the route downtown in about 25 minutes.",
        "The bus and the bike lane both serve commuters traveling toward the town center.",
      ],
      correct: 1,
      rationale:
        "An advantage of cycling must name something cycling does better, which only the second choice does by contrasting the 18-minute ride with the bus's 25-minute trip. The third choice is the closest trap: it accurately states the bus's travel time, but on its own it reports a single fact about the bus without comparing it to cycling, so no advantage of cycling emerges.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-17",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A coral reef is a structure built by tiny animals called coral polyps.\n• The polyps secrete calcium carbonate, which hardens into the reef's stony framework.\n• Colorful algae live inside the polyps and supply much of their food.\n• When water grows too warm, the polyps expel the algae and turn white.\n• Without the algae, the polyps may starve and die.",
      prompt:
        "The student wants to explain why coral reefs turn white during warm-water events. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Coral reefs are stony structures built up by tiny animals called coral polyps.",
        "Coral polyps secrete calcium carbonate, which hardens into the reef's framework.",
        "When the water grows too warm, coral polyps expel the colorful algae living inside them, leaving the polyps white.",
        "Without the algae that normally feed them, coral polyps may eventually starve and die.",
      ],
      correct: 2,
      rationale:
        "Explaining why reefs turn white requires naming the cause of the color change, which only the third choice does by linking the warm water to the expulsion of the colorful algae that leaves the polyps white. The fourth choice is the strongest trap: it accurately describes a serious consequence of losing the algae, but it explains what happens after the whitening rather than why the whitening itself occurs.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-18",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 4,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A library compared two reading programs for elementary students.\n• Program X assigned books matched to each child's measured reading level.\n• Program Y let each child freely choose any book that interested them.\n• Children in Program Y reported enjoying reading much more.\n• Children in Program Y also read about twice as many books over the year.",
      prompt:
        "The student wants to argue that Program Y is the better choice for this library. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "Program X assigned each child books matched to that child's measured reading level.",
        "Both programs were tested with elementary students at the same library.",
        "Because children in Program Y enjoyed reading more and read about twice as many books, it is the stronger program for the library.",
        "Children in Program X were given books selected to match their reading levels.",
      ],
      correct: 2,
      rationale:
        "Arguing for Program Y requires foregrounding its benefits as a reason to choose it, which only the third choice does by joining the greater enjoyment and the doubled reading to the conclusion that it is the stronger program. The first choice is the closest trap: it accurately describes how Program X works, but describing the rival program does nothing to make the case for Program Y that the goal demands.",
      paceSeconds: 85,
    },
    {
      id: "rhetorical-synthesis-19",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• A botanist tracked a rare orchid that grows only in one mountain valley.\n• The orchid is pollinated by a single species of moth.\n• That moth lays its eggs only in one kind of tree found in the valley.\n• Logging has removed most of those trees from the valley.\n• The orchid produced far fewer seeds in the years after the logging.",
      prompt:
        "The student wants to emphasize why the orchid's survival is threatened. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The rare orchid grows only in a single mountain valley and is pollinated by one species of moth.",
        "Because logging removed the trees the orchid's only pollinator needs to breed, the orchid produced far fewer seeds.",
        "The orchid is pollinated solely by a moth that lays its eggs in a particular valley tree.",
        "After the logging took place, the orchid produced far fewer seeds than it had before.",
      ],
      correct: 1,
      rationale:
        "Emphasizing the threat requires showing the chain by which the orchid is losing its means of reproducing, which only the second choice does by linking the logging to the loss of the pollinator's breeding tree and then to the drop in seeds. The first choice is the strongest trap: a single-valley orchid with one pollinator sounds fragile, but naming its narrow range alone does not explain the active danger, the broken pollination chain, that now threatens it.",
      paceSeconds: 90,
    },
    {
      id: "rhetorical-synthesis-20",
      skill: "rhetorical-synthesis",
      domain: "Expression of Ideas",
      difficulty: 5,
      passage:
        "While researching a topic, a student has taken the following notes:\n• Two early flying machines were tested in the same decade.\n• One was a glider with no engine, steered only by shifting the pilot's weight.\n• The other was a powered craft with an engine and movable control surfaces.\n• The glider could stay aloft only briefly, while the powered craft could climb and hold altitude under its own power.\n• Both machines used fabric stretched over a light wooden frame for their wings.",
      prompt:
        "The student wants to emphasize a similarity in how the two flying machines were built. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
      choices: [
        "The glider had no engine, while the powered craft carried an engine and movable control surfaces.",
        "The glider could stay aloft only briefly, but the powered craft could climb under its own power.",
        "Both flying machines used fabric stretched over a light wooden frame to form their wings.",
        "One machine was steered by shifting the pilot's weight, the other by movable control surfaces.",
      ],
      correct: 2,
      rationale:
        "The goal asks for a similarity in how the machines were built, and only the third choice names a shared construction detail, fabric over a light wooden frame, common to both wings. The first choice is the strongest trap: it correctly pairs the two machines, but it contrasts their power sources and controls, emphasizing a difference in design rather than the construction similarity the goal requires.",
      paceSeconds: 90,
    },
  ],
};
