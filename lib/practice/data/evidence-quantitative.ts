import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "Reading a small table or graph and choosing the option that both states the numbers correctly AND advances the specific claim the passage makes. The hard version pairs a narrow claim with distractors that are numerically true but answer a different question.",
    howToAttack: [
      "Read the claim first and underline its scope: which rows, which years, increase vs. decrease, comparison vs. trend. Then go to the table knowing exactly what you need.",
      "Test each choice against two filters in order: (1) is every number copied correctly from the right cell? (2) does that fact actually back THIS claim? A choice must pass both.",
      "When a choice compares two figures, recompute the comparison yourself; do not trust the direction word ('higher,' 'fewer,' 'more than') in the option.",
    ],
    traps: [
      "True-but-irrelevant: the numbers are right, but they support a point the claim never made (e.g., the claim is about a trend over time, the option cites a single year's ranking).",
      "Misread cell: the option swaps a row, reads the wrong column/year, or reverses an increase and a decrease.",
      "Unlicensed comparison: the option asserts a relationship (cause, 'because,' 'the most') the table can show only with data that isn't there.",
    ],
  },
  questions: [
    {
      id: "evidence-quantitative-1",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A team studied how four shade trees affect the air temperature directly beneath their canopies on hot afternoons. The team argued that a tree's cooling effect tracks more closely with the density of its canopy than with its overall height.\n\nCanopy density, height, and afternoon cooling for four species\nSpecies | Canopy density (%) | Height (m) | Cooling below canopy (°C)\nSilver maple | 88 | 18 | 6.1\nHoney locust | 42 | 16 | 2.4\nRed oak | 81 | 24 | 5.7\nWhite ash | 55 | 22 | 3.3",
      prompt:
        "Which choice most effectively uses data from the table to support the team's claim?",
      choices: [
        "The red oak, at 24 m the tallest species, produced 5.7 °C of cooling, the second-highest figure recorded.",
        "The silver maple was both the shortest species at 18 m and the species with the greatest cooling effect, 6.1 °C.",
        "The white ash, at 22 m, was taller than the silver maple at 18 m, yet the silver maple cooled the air by 6.1 °C compared with the white ash's 3.3 °C.",
        "The honey locust and the white ash, the two species with the lowest canopy densities (42% and 55%), produced the two smallest cooling effects (2.4 °C and 3.3 °C).",
      ],
      correct: 3,
      rationale:
        "The claim is that cooling tracks canopy density more than height. Choice D pairs the two lowest densities (42%, 55%) with the two lowest cooling values (2.4 °C, 3.3 °C), directly linking density and cooling. A cites height and a true cooling value but argues nothing about density. B's numbers are right but a single species can't establish that density beats height. C is true and even hints at the point, but a one-pair comparison is weaker support than D's matched ordering of density and cooling across the low-density species.",
      paceSeconds: 90,
    },
    {
      id: "evidence-quantitative-2",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "Analysts tracked the share of households subscribing to three streaming services in a mid-sized city. They concluded that, of the three, only Service C grew its subscriber share over the period studied.\n\nShare of households subscribing (%)\nService | 2019 | 2023\nService A | 38 | 31\nService B | 26 | 22\nService C | 14 | 29",
      prompt:
        "Which choice most effectively uses data from the table to support the analysts' conclusion?",
      choices: [
        "Service C's share rose from 14% in 2019 to 29% in 2023, while Service A's fell from 38% to 31% and Service B's fell from 26% to 22%.",
        "By 2023, Service A still held the largest share of households at 31%.",
        "Service C's share more than doubled, reaching 29% in 2023.",
        "In 2019, Service C had the smallest share of the three services, at 14%.",
      ],
      correct: 0,
      rationale:
        "The conclusion is that only C grew. Choice A shows C rising (14 to 29) while both A (38 to 31) and B (26 to 22) fell, which is exactly the 'only C grew' point. C is true but addresses only C's own change, not the contrast that makes 'only' meaningful. B and D cite accurate single-year figures but say nothing about growth.",
      paceSeconds: 80,
    },
    {
      id: "evidence-quantitative-3",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Researchers measured germination rates for seeds of one wildflower stored at four temperatures for one year. They proposed that germination peaks at an intermediate storage temperature rather than improving steadily as temperature drops.\n\nGermination rate after one year of storage (%)\nStorage temperature (°C) | Germination (%)\n-10 | 61\n4 | 88\n15 | 74\n25 | 40",
      prompt:
        "Which choice most effectively uses data from the table to support the researchers' proposal?",
      choices: [
        "Seeds stored at 25 °C germinated at the lowest rate, 40%.",
        "Germination was higher at 4 °C (88%) than at -10 °C (61%), the coldest condition tested.",
        "Germination rose from 61% at -10 °C to a peak of 88% at 4 °C, then fell to 74% at 15 °C and 40% at 25 °C.",
        "Seeds stored at -10 °C and 15 °C germinated at rates of 61% and 74%, respectively.",
      ],
      correct: 2,
      rationale:
        "The proposal is an intermediate peak, not a steady cold-is-better trend. Choice C traces the full pattern: a rise to 88% at 4 °C followed by declines to 74% and 40%, which is precisely a mid-range peak. B is true but, by itself, is consistent with 'colder is always worse,' undercutting the 'not steadily improving as it gets colder' part of the claim. A and D cite correct values but show no peak.",
      paceSeconds: 92,
    },
    {
      id: "evidence-quantitative-4",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A survey asked commuters in four neighborhoods how they usually travel to work. One researcher claimed that the neighborhood with the highest transit use also had the lowest car use, suggesting the two modes trade off directly.\n\nUsual commute mode (% of commuters)\nNeighborhood | Car | Transit | Bike\nElmwood | 64 | 22 | 14\nHarbor | 41 | 49 | 10\nMidvale | 58 | 30 | 12\nPinecrest | 47 | 33 | 20",
      prompt:
        "Which choice most effectively uses data from the table to support the researcher's claim?",
      choices: [
        "Harbor had the highest transit use, 49%, and also the lowest car use, 41%.",
        "Pinecrest had the highest bike use, 20%, and a transit share of 33%.",
        "Elmwood had the highest car use, 64%, and the lowest transit use, 22%.",
        "Harbor's transit use of 49% was more than double Elmwood's transit use of 22%.",
      ],
      correct: 0,
      rationale:
        "The claim links the highest-transit neighborhood to the lowest car use. Harbor tops transit at 49% and is also lowest on car at 41%, so Choice A is the only option that supplies both halves the claim needs. C correctly describes Elmwood as highest car and lowest transit, but that is the opposite end and doesn't show the highest-transit case. B is true but about bikes, and D is a true transit comparison that says nothing about car use.",
      paceSeconds: 92,
    },
    {
      id: "evidence-quantitative-5",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "An engineer tested four insulation materials, recording the heat lost through a standard panel of each. The engineer's report states that thicker panels did not reliably lose less heat, because thickness alone failed to predict performance.\n\nPanel thickness and measured heat loss\nMaterial | Thickness (cm) | Heat loss (W)\nFoam board | 5 | 18\nMineral wool | 10 | 12\nFiberglass | 8 | 21\nCellulose | 6 | 14",
      prompt:
        "Which choice most effectively uses data from the table to support the engineer's report?",
      choices: [
        "Mineral wool, the thickest panel at 10 cm, had the lowest heat loss, 12 W.",
        "Fiberglass, at 8 cm, was thicker than both foam board (5 cm) and cellulose (6 cm), yet lost more heat (21 W) than either (18 W and 14 W).",
        "Foam board, the thinnest panel at 5 cm, lost 18 W of heat.",
        "Heat loss ranged from a low of 12 W to a high of 21 W across the four materials.",
      ],
      correct: 1,
      rationale:
        "The report's point is that thickness does NOT reliably mean less heat loss. Choice B is a clean counterexample: fiberglass is thicker than foam board and cellulose (8 cm vs. 5 and 6) but loses more heat (21 W vs. 18 and 14), breaking the thicker-means-cooler pattern. A actually fits a 'thicker is better' story, which contradicts the claim. C and D are accurate but show no relationship between thickness and heat loss.",
      paceSeconds: 88,
    },
    {
      id: "evidence-quantitative-6",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A lab compared how long four adhesives held a fixed weight at room temperature and again after the bond was chilled. The team argued that chilling weakened every adhesive but harmed the two water-based adhesives far more than the two solvent-based ones.\n\nHold time before failure (minutes)\nAdhesive | Type | Room temp | Chilled\nBond-1 | Water-based | 50 | 18\nBond-2 | Solvent-based | 44 | 39\nBond-3 | Water-based | 60 | 25\nBond-4 | Solvent-based | 52 | 47",
      prompt:
        "Which choice most effectively uses data from the table to support the team's argument?",
      choices: [
        "Every adhesive held the weight for less time when chilled than at room temperature.",
        "At room temperature, Bond-3 held the longest at 60 minutes and Bond-2 the shortest at 44 minutes.",
        "Chilling cut the water-based adhesives' hold times by 32 and 35 minutes (Bond-1: 50 to 18; Bond-3: 60 to 25), far more than the solvent-based losses of 5 and 5 minutes (Bond-2: 44 to 39; Bond-4: 52 to 47).",
        "When chilled, Bond-4 still held the weight for 47 minutes, the longest of any adhesive in the chilled condition.",
      ],
      correct: 2,
      rationale:
        "The argument has two parts: chilling hurt all adhesives, and it hurt the water-based ones much more. Choice C delivers the second, decisive part with exact drops: water-based fell 32 and 35 minutes versus only 5 and 5 for solvent-based. A supports only the weaker 'all weakened' half and ignores the key contrast. B is a room-temperature ranking unrelated to chilling, and D cites a true chilled value but shows no comparison between the two adhesive types.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-7",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "A city counted weekday riders at three bike-share stations before and after a protected bike lane opened nearby. Officials concluded that ridership gains were concentrated at the station closest to the new lane.\n\nAverage weekday riders\nStation | Before | After\nRiver (next to lane) | 120 | 210\nMarket (3 blocks away) | 140 | 158\nCollege (8 blocks away) | 95 | 101",
      prompt:
        "Which choice most effectively uses data from the table to support the officials' conclusion?",
      choices: [
        "After the lane opened, the River station averaged 210 riders, the most of any station.",
        "The River station, next to the lane, gained 90 riders (120 to 210), far more than Market's 18 (140 to 158) or College's 6 (95 to 101).",
        "Before the lane opened, the Market station had the most riders, 140.",
        "All three stations averaged more weekday riders after the lane opened than before.",
      ],
      correct: 1,
      rationale:
        "The conclusion is that gains concentrated at the nearest station. Choice B shows River's +90 dwarfing Market's +18 and College's +6, which is exactly 'concentrated at the closest station.' A reports River's after-total but not its gain or the contrast. C is a before-only ranking, and D ('all gained') ignores the concentration that is the whole point.",
      paceSeconds: 82,
    },
    {
      id: "evidence-quantitative-8",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Reviewers rated four short films on visuals and on screenwriting, each on a 100-point scale. A critic claimed that the films' overall reception followed their screenwriting scores rather than their visuals.\n\nAverage reviewer scores (out of 100)\nFilm | Visuals | Screenwriting | Overall\nDriftwood | 92 | 64 | 70\nSlate | 70 | 88 | 85\nHollow | 81 | 75 | 76\nVerge | 60 | 90 | 84",
      prompt:
        "Which choice most effectively uses data from the table to support the critic's claim?",
      choices: [
        "Driftwood earned the highest visuals score, 92, yet its overall score, 70, was the lowest of the four films.",
        "Verge had the lowest visuals score, 60, and the highest screenwriting score, 90.",
        "Hollow scored 81 on visuals and 75 on screenwriting, finishing with an overall score of 76.",
        "Slate and Verge had the two highest screenwriting scores (88 and 90) and the two highest overall scores (85 and 84), while Driftwood, lowest in screenwriting at 64, was lowest overall at 70.",
      ],
      correct: 3,
      rationale:
        "The claim is that overall reception tracked screenwriting, not visuals. Choice D matches the screenwriting order to the overall order at both ends: the two top screenwriting films (88, 90) are the two top overall (85, 84), and the lowest screenwriting (64) is lowest overall (70). A is a single film consistent with the claim but far weaker than D's full pattern, and it argues only against visuals without showing the screenwriting link. B describes Verge accurately but draws no tie to overall reception, and C simply lists one film's three scores.",
      paceSeconds: 90,
    },
    {
      id: "evidence-quantitative-9",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A nutrition lab measured the vitamin C retained in a vegetable after four cooking methods, each timed to reach the same internal temperature. The lab reported that shorter cooking times preserved more vitamin C and that steaming outperformed boiling at a comparable duration.\n\nCooking method, time, and vitamin C retained\nMethod | Time (min) | Vitamin C retained (%)\nSteaming | 7 | 82\nBoiling | 8 | 61\nMicrowaving | 4 | 90\nRoasting | 22 | 55",
      prompt:
        "Which choice most effectively uses data from the table to support the lab's report?",
      choices: [
        "Microwaving, the shortest method at 4 minutes, retained the most vitamin C, 90%, while roasting, the longest at 22 minutes, retained the least, 55%.",
        "Steaming for 7 minutes retained 82% of the vitamin C, more than boiling's 61% over a comparable 8 minutes, and microwaving's brief 4 minutes retained the most at 90% while roasting's 22 minutes retained the least at 55%.",
        "Boiling retained 61% of the vitamin C, more than roasting's 55%.",
        "Roasting required 22 minutes, the longest of the four methods tested.",
      ],
      correct: 1,
      rationale:
        "The report makes two claims: shorter time preserves more, and steaming beats boiling at a comparable duration. Only Choice B covers both: it gives the steaming-vs-boiling comparison (82% in 7 min vs. 61% in 8 min) and the time trend (4-min microwaving highest at 90%, 22-min roasting lowest at 55%). A supports only the time-trend half and omits the steaming-vs-boiling point entirely. C is a true but minor comparison, and D states a time with no retention data.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-10",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Volunteers logged how many minutes a public fountain ran each day in three parks across two summers, before and after a new flow sensor was installed. Organizers claimed the sensor reduced daily runtime most in the park that had wasted the most water beforehand.\n\nAverage daily fountain runtime (minutes)\nPark | 2022 (before) | 2024 (after)\nLinden | 310 | 240\nClover | 180 | 165\nAshby | 260 | 220",
      prompt:
        "Which choice most effectively uses data from the table to support the organizers' claim?",
      choices: [
        "Linden had the longest runtime in 2024, at 240 minutes.",
        "Clover's runtime fell by only 15 minutes (180 to 165), the smallest reduction of the three parks.",
        "Linden, which ran longest in 2022 at 310 minutes, also saw the largest drop, 70 minutes (310 to 240), compared with Ashby's 40 (260 to 220) and Clover's 15 (180 to 165).",
        "All three parks recorded shorter average runtimes in 2024 than in 2022.",
      ],
      correct: 2,
      rationale:
        "The claim ties the biggest reduction to the park that wasted the most before. Choice C shows Linden running longest in 2022 (310 min) and posting the largest drop (70 min) versus Ashby's 40 and Clover's 15, supplying both halves of the claim. B correctly finds the smallest drop but describes the wrong park for this claim. A is a true 2024 ranking with no reduction data, and D ('all fell') ignores which park fell most.",
      paceSeconds: 88,
    },
  ],
};
