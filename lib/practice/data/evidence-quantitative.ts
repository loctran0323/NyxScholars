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
    {
      id: "evidence-quantitative-11",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A student set up a solar panel and recorded its midday power output at four tilt angles on the same clear day. The student concluded that output rose as the tilt increased toward 40 degrees but began to fall once the tilt passed that angle.\n\nPanel tilt and midday power output\nTilt angle (degrees) | Power output (W)\n10 | 145\n25 | 178\n40 | 196\n55 | 171",
      prompt:
        "Which choice most effectively uses data from the table to support the student's conclusion?",
      choices: [
        "Output climbed from 145 W at 10° to 178 W at 25° and a peak of 196 W at 40°, then dropped to 171 W at 55°.",
        "The panel produced more power at 25° (178 W) than at 10° (145 W).",
        "The lowest output, 145 W, occurred at the smallest tilt angle, 10°.",
        "At 55°, the panel still produced 171 W, more than it produced at 10° (145 W).",
      ],
      correct: 0,
      rationale:
        "The conclusion is that output rises to a peak at 40° and then falls. Choice A traces the full pattern: 145 to 178 to a peak of 196 at 40°, then down to 171, capturing both the rise and the post-peak decline. Choice B is the strongest trap because its numbers are correct and it shows output rising, but it covers only the low end and is fully consistent with 'more tilt is always better,' so it never establishes the turnaround the claim requires. C cites a true low value but shows no peak, and D is a true comparison that ignores the 40° peak entirely.",
      paceSeconds: 88,
    },
    {
      id: "evidence-quantitative-12",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A chain compared four of its coffee shops, logging the number of people who walked past each storefront per hour and the shop's average daily sales. A manager argued that daily sales depend on how many passersby actually enter, not on raw foot traffic, since the busiest sidewalk did not yield the highest sales.\n\nFoot traffic, entry rate, and daily sales\nShop | Passersby per hour | Entry rate (%) | Daily sales ($)\nFifth St. | 920 | 4 | 1,180\nPark Ave. | 540 | 11 | 1,640\nWest End | 780 | 6 | 1,260\nDepot Sq. | 490 | 9 | 1,520",
      prompt:
        "Which choice most effectively uses data from the table to support the manager's argument?",
      choices: [
        "Fifth St. had the most passersby per hour, 920, yet its 4% entry rate was the lowest and its daily sales, $1,180, were the lowest of the four shops.",
        "Depot Sq. had the fewest passersby per hour, only 490, of the four shops studied.",
        "West End drew 780 passersby per hour and posted daily sales of $1,260.",
        "Park Ave. had the highest entry rate, 11%, and the highest daily sales, $1,640, despite the second-lowest foot traffic, 540 passersby per hour.",
      ],
      correct: 3,
      rationale:
        "The argument is that sales follow entry rate, not raw foot traffic. Choice D ties the top entry rate (11%) to the top sales ($1,640) while noting that this shop had nearly the lowest foot traffic, hitting both halves of the claim. Choice A is the strongest trap: every number is correct and it does undercut a 'foot-traffic drives sales' story, but it works only through the negative case (busiest sidewalk, lowest sales) and never shows that high entry rate produces high sales, so it leaves the entry-rate half of the claim unsupported. B and C cite accurate figures but draw no link between entry rate and sales.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-13",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "An ornithologist compiled wingspan and one-way migration distance for four songbird species. She claimed that, among these birds, a longer wingspan does not reliably mean a longer migration.\n\nWingspan and one-way migration distance\nSpecies | Wingspan (cm) | Migration distance (km)\nWarbler | 19 | 4,200\nTanager | 28 | 3,100\nThrush | 24 | 5,000\nVireo | 21 | 2,600",
      prompt:
        "Which choice most effectively uses data from the table to support the ornithologist's claim?",
      choices: [
        "The thrush, with a 24 cm wingspan, migrated the farthest, 5,000 km.",
        "The tanager had the widest wingspan, 28 cm, yet migrated only 3,100 km, less than both the smaller-winged warbler (19 cm, 4,200 km) and thrush (24 cm, 5,000 km).",
        "The vireo had a 21 cm wingspan and the shortest migration, 2,600 km.",
        "Migration distances ranged from 2,600 km to 5,000 km across the four species.",
      ],
      correct: 1,
      rationale:
        "The claim is that wider wingspan does NOT reliably mean a longer migration. Choice B is a direct counterexample: the widest-winged bird (28 cm) migrates less far than two narrower-winged birds, breaking any wingspan-distance pairing. Choice C is the strongest trap because its numbers are correct, but a relatively small wingspan paired with the shortest migration is consistent with a 'bigger wings travel farther' pattern, so it cuts against the claim rather than supporting it. A reports a single true pairing that, on its own, also fits the opposite trend, and D gives a range that says nothing about wingspan.",
      paceSeconds: 88,
    },
    {
      id: "evidence-quantitative-14",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A county tracked the share of household waste that residents recycled in four districts before and after a curbside-sorting program launched. Officials concluded that the program raised recycling rates most in the district that had recycled the least beforehand.\n\nShare of household waste recycled (%)\nDistrict | Before | After\nNorthgate | 18 | 41\nRiverside | 34 | 45\nOakhill | 27 | 39\nSummit | 22 | 30",
      prompt:
        "Which choice most effectively uses data from the table to support the officials' conclusion?",
      choices: [
        "Northgate recycled the smallest share before the program, 18%, and posted the largest gain, 23 points (18% to 41%), versus Riverside's 11, Oakhill's 12, and Summit's 8.",
        "After the program, Riverside recycled the largest share of its waste, 45%.",
        "Every district recycled a larger share of its waste after the program than before.",
        "Summit, which recycled 22% before the program, posted the smallest gain, 8 points (22% to 30%).",
      ],
      correct: 0,
      rationale:
        "The conclusion links the biggest improvement to the district that recycled least beforehand. Choice A shows Northgate starting lowest at 18% and gaining the most, 23 points, larger than every other district's gain, supplying both halves of the claim. Choice D is the strongest trap: its numbers are right and it does identify a smallest-gain district, but Summit was not the lowest starter (Northgate was), so it describes the wrong end of the comparison the claim needs. B is a true after-only ranking with no gain data, and C ('all rose') ignores which district rose most.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-15",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A reviewer tested four rechargeable battery brands, recording each brand's rated capacity and how many hours it ran a flashlight and, separately, a portable speaker. The reviewer argued that higher rated capacity translated into longer runtime in the flashlight but not in the more power-hungry speaker.\n\nCapacity and measured runtime\nBrand | Capacity (mAh) | Flashlight (h) | Speaker (h)\nVolt | 2,000 | 9.0 | 3.1\nNova | 2,400 | 11.2 | 3.0\nPeak | 2,800 | 13.5 | 2.8\nCore | 3,200 | 15.1 | 3.2",
      prompt:
        "Which choice most effectively uses data from the table to support the reviewer's argument?",
      choices: [
        "Core had the highest capacity, 3,200 mAh, and the longest flashlight runtime, 15.1 hours.",
        "In the flashlight, runtime rose with capacity, from 9.0 h at 2,000 mAh to 15.1 h at 3,200 mAh; in the speaker, runtime did not, staying near 3 hours (3.1, 3.0, 2.8, 3.2 h) regardless of capacity.",
        "Peak, with 2,800 mAh, ran the speaker for 2.8 hours, the shortest speaker runtime of the four brands.",
        "In the flashlight, Nova (2,400 mAh) ran 11.2 hours, longer than Volt's 9.0 hours at 2,000 mAh.",
      ],
      correct: 1,
      rationale:
        "The argument has two parts: capacity predicts flashlight runtime but not speaker runtime. Only Choice B covers both, showing flashlight runtime climbing steadily with capacity (9.0 to 15.1 h) while speaker runtime stays near 3 hours across all capacities. Choice A is the strongest trap because its numbers are correct and it supports the flashlight half, but it says nothing about the speaker, leaving the 'not in the speaker' half of the claim unsupported. C is a true speaker value with no tie to capacity, and D supports only the flashlight half with a single comparison.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-16",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A museum logged annual attendance and gift-shop revenue for four of its galleries. A board member claimed that gift-shop revenue rose and fell with attendance across the galleries.\n\nAnnual attendance and gift-shop revenue\nGallery | Visitors (thousands) | Gift-shop revenue ($ thousands)\nAntiquities | 52 | 88\nModern | 71 | 121\nNatural History | 64 | 110\nPhotography | 39 | 66",
      prompt:
        "Which choice most effectively uses data from the table to support the board member's claim?",
      choices: [
        "Modern drew the most visitors, 71 thousand, and brought in the most gift-shop revenue, $121 thousand, while Photography drew the fewest visitors, 39 thousand, and the least revenue, $66 thousand.",
        "Natural History drew 64 thousand visitors and earned $110 thousand in gift-shop revenue.",
        "Gift-shop revenue across the four galleries totaled $385 thousand.",
        "Modern's gift-shop revenue, $121 thousand, was nearly double Photography's, $66 thousand.",
      ],
      correct: 0,
      rationale:
        "The claim is that revenue tracks attendance across galleries. Choice A matches the visitor order to the revenue order at both ends: the most-visited gallery earns the most revenue and the least-visited earns the least, demonstrating the rise-and-fall pairing. Choice D is the strongest trap because its figures are accurate, but a single gap between two galleries shows only that one is bigger than another, not that revenue moves with attendance across the set. B lists one gallery's two figures without comparison, and C is a true total that reveals no relationship.",
      paceSeconds: 88,
    },
    {
      id: "evidence-quantitative-17",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Agronomists grew the same tomato variety under four irrigation methods on identical plots and recorded each plot's yield and the water it used. They argued that drip irrigation gave the best yield per liter of water, even though it did not give the highest total yield.\n\nIrrigation method, yield, and water use\nMethod | Yield (kg) | Water used (L) | Yield per liter (kg/L)\nFlood | 60 | 1,000 | 0.060\nFurrow | 54 | 720 | 0.075\nSprinkler | 50 | 560 | 0.089\nDrip | 56 | 400 | 0.140",
      prompt:
        "Which choice most effectively uses data from the table to support the agronomists' argument?",
      choices: [
        "Drip irrigation used the least water, 400 L, of the four methods.",
        "Flood irrigation produced the highest total yield, 60 kg, using 1,000 L of water.",
        "Drip irrigation yielded 0.140 kg per liter, the highest yield per liter of the four methods, even though its total yield, 56 kg, trailed flood irrigation's 60 kg.",
        "Sprinkler irrigation yielded 0.089 kg per liter, more than flood's 0.060 kg per liter.",
      ],
      correct: 2,
      rationale:
        "The argument has two parts: drip led in yield per liter but not in total yield. Choice C delivers both, citing drip's top efficiency (0.140 kg/L) and conceding its lower total yield (56 kg vs. flood's 60 kg). Choice D is the strongest trap because its numbers are correct and it concerns yield per liter, the right metric, but it compares sprinkler with flood and never shows that drip is the most efficient, so it backs a different point. A is a true water figure that says nothing about efficiency, and B supports only the 'not the highest total yield' half by naming the leader, not drip.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-18",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A developer released the same game on four platforms at four different prices and tracked first-week downloads. The developer concluded that, across these platforms, a lower price drew more downloads.\n\nPrice and first-week downloads\nPlatform | Price ($) | Downloads (thousands)\nPlatform W | 3 | 140\nPlatform X | 5 | 96\nPlatform Y | 7 | 71\nPlatform Z | 9 | 48",
      prompt:
        "Which choice most effectively uses data from the table to support the developer's conclusion?",
      choices: [
        "Platform W, priced lowest at $3, had the most downloads, 140 thousand.",
        "As price rose from $3 to $5 to $7 to $9, downloads fell steadily from 140 to 96 to 71 to 48 thousand.",
        "Platform Z, priced highest at $9, had the fewest downloads, 48 thousand.",
        "Downloads across the four platforms totaled 355 thousand.",
      ],
      correct: 1,
      rationale:
        "The conclusion is that lower price drew more downloads across the platforms. Choice B shows the full inverse relationship: each step up in price from $3 to $9 is matched by a steady drop in downloads from 140 to 48 thousand, demonstrating the trend across all four points. Choice A is the strongest trap because its numbers are correct and it points the right way, but it reports only the cheapest, highest-download endpoint and leaves the middle of the trend unestablished. C likewise gives only the opposite endpoint, and D is a true total that shows no price relationship.",
      paceSeconds: 88,
    },
    {
      id: "evidence-quantitative-19",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A running coach reviewed four athletes who followed different plans for the same marathon, noting each plan's average weekly mileage, the longest single run, and the athlete's finish time. The coach argued that finish times improved with higher weekly mileage but were not explained by the length of the longest single run.\n\nTraining volume and marathon finish time\nAthlete | Weekly miles | Longest run (mi) | Finish time (h)\nA | 25 | 20 | 4.5\nB | 35 | 18 | 4.1\nC | 45 | 22 | 3.7\nD | 55 | 16 | 3.4",
      prompt:
        "Which choice most effectively uses data from the table to support the coach's argument?",
      choices: [
        "Athlete D ran the most weekly miles, 55, and recorded the fastest finish, 3.4 hours.",
        "As weekly mileage rose from 25 to 55, finish times fell steadily from 4.5 to 3.4 hours, yet the longest single run did not follow that order, ranging from 16 to 22 miles without tracking finish time.",
        "Athlete C had the longest single run, 22 miles, and finished in 3.7 hours.",
        "Athlete A, with the fewest weekly miles, 25, had the slowest finish, 4.5 hours.",
      ],
      correct: 1,
      rationale:
        "The argument has two parts: faster finishes go with higher weekly mileage but not with longer single runs. Only Choice B covers both, showing finish times falling steadily as weekly miles climb (4.5 to 3.4 h) while the longest run jumps around (16 to 22 mi) without matching finish order. Choice A is the strongest trap because its numbers are right and it supports the weekly-mileage half, but it cites a single endpoint and says nothing about the longest run, leaving the 'not explained by longest run' half unsupported. C and D are accurate single-athlete facts that establish neither half of the two-part claim.",
      paceSeconds: 95,
    },
    {
      id: "evidence-quantitative-20",
      skill: "evidence-quantitative",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A horticulturist grew one shrub variety in soils of four pH levels and measured the average plant height after one season. She proposed that height peaks at a slightly acidic pH rather than rising continuously as the soil grows more alkaline.\n\nSoil pH and average plant height\nSoil pH | Average height (cm)\n5.0 | 34\n6.0 | 52\n7.0 | 45\n8.0 | 28",
      prompt:
        "Which choice most effectively uses data from the table to support the horticulturist's proposal?",
      choices: [
        "Plants in the most alkaline soil, pH 8.0, were the shortest, averaging 28 cm.",
        "Plants at pH 6.0 averaged 52 cm, taller than those at pH 5.0, which averaged 34 cm.",
        "Average height rose from 34 cm at pH 5.0 to a peak of 52 cm at pH 6.0, then fell to 45 cm at pH 7.0 and 28 cm at pH 8.0.",
        "Plants at pH 5.0 and pH 7.0 averaged 34 cm and 45 cm, respectively.",
      ],
      correct: 2,
      rationale:
        "The proposal is a slightly-acidic peak, not a steady climb toward alkaline soil. Choice C traces the full pattern: a rise to 52 cm at pH 6.0 followed by declines to 45 and 28 cm, which is exactly a mid-range peak. Choice B is the strongest trap because its numbers are correct and it shows height rising, but it covers only the acidic end and is fully consistent with 'height keeps rising as pH climbs,' so it never demonstrates the turnaround at pH 6.0. A cites a true low value but shows no peak, and D lists two correct heights that reveal no peak.",
      paceSeconds: 95,
    },
  ],
};
