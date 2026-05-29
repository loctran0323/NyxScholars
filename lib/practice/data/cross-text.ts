import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "The student reads two short texts on a single topic and pins down the precise relationship between them — agreement, disagreement, qualification, or one supplying evidence that bears on the other's claim. The hard items rarely stage a flat contradiction; instead one author would partly grant the other's point while resisting how far it is pushed, and the task is to capture that exact angle.",
    howToAttack: [
      "Read each text on its own first and state, in one phrase, the specific claim its author commits to — not the broad topic, but the position taken.",
      "Name the relationship before looking at the choices: does Text 2 reject Text 1, accept it with a limit, redirect it to a different cause, or merely supply data the other side could use?",
      "When the prompt asks how one author would 'respond,' answer only from that author's stated view; a choice is wrong if it makes the response sharper, softer, or about something neither text actually disputes.",
    ],
    traps: [
      "Overstating the conflict — turning a qualification or partial agreement into outright rejection, when the second author would in fact concede part of the first author's claim.",
      "Flipping who thinks what, attributing Text 1's position to the author of Text 2 (or the reverse) so the sentence sounds plausible but reverses the actual stances.",
      "Asserting an agreement the texts never share, naming a point only one author raises as common ground, or treating overlapping topic as overlapping conclusion.",
    ],
  },
  questions: [
    {
      id: "cross-text-1",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "Text 1\nA growing number of schools have replaced letter grades with written feedback in the early years, arguing that grades make young students anxious and fixated on rank rather than on what they are learning. Without a number to chase, the reasoning goes, children attend to the teacher's actual comments and improve.\n\nText 2\nFeedback only helps if students read and act on it, and surveys of younger pupils suggest many skim the comments or set them aside. A grade, by contrast, is hard to ignore. Some teachers now pair a brief mark with detailed notes, hoping the mark draws the student's eye to the notes that follow.",
      prompt:
        "Based on the texts, how would the author of Text 2 most likely respond to the rationale offered for removing grades in Text 1?",
      choices: [
        "By agreeing that written feedback reliably redirects young students toward learning.",
        "By insisting that grades cause no anxiety and should never have been questioned.",
        "By noting that feedback aids learning only if students engage with it, which a grade may help prompt.",
        "By arguing that comments and grades serve identical purposes for young learners.",
      ],
      correct: 2,
      rationale:
        "Text 1 assumes that removing grades makes children attend to comments, but Text 2 reports that many young pupils skim or ignore feedback and suggests a grade can draw their eye to the notes — a qualification, not a rejection of feedback's value, which is (C). (A) is the strongest trap: it sounds cooperative but asserts the very automatic effect Text 2 doubts, since Text 2's whole point is that feedback works only when actually read.",
      paceSeconds: 85,
    },
    {
      id: "cross-text-2",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 3,
      passage:
        "Text 1\nWhen a popular trail becomes crowded, land managers often respond by widening it or paving the surface. A wider, harder path can carry more visitors without turning to mud, and the improvement keeps hikers from trampling plants along the edges as they step around puddles.\n\nText 2\nWidening a trail does spare the immediate verge, but a smooth, broad path invites still more visitors and faster ones, and the new traffic presses outward again within a few seasons. The relief, in other words, tends to be temporary unless the number of users is also limited.",
      prompt:
        "Based on the texts, the author of Text 2 would most likely regard the trail improvements described in Text 1 as",
      choices: [
        "helpful in the short term but likely undone by the added traffic they attract.",
        "the single most effective way to protect plants beside a trail.",
        "harmful from the outset and certain to worsen erosion immediately.",
        "irrelevant, since trail surface has no bearing on where hikers walk.",
      ],
      correct: 0,
      rationale:
        "Text 2 grants that widening 'does spare the immediate verge' yet argues the broader path draws more and faster users until traffic presses outward again, so the benefit is real but temporary — exactly (A). (C) overstates the disagreement into outright harm 'from the outset,' but Text 2 concedes an initial benefit and faults only its durability, not its existence.",
      paceSeconds: 85,
    },
    {
      id: "cross-text-3",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Text 1\nThe sudden disappearance of a script used by an ancient trading people has long been blamed on a conquest that scattered its scribes. With the trained writers gone, the argument runs, no one remained who could pass the system to the next generation, and within decades the marks became unreadable.\n\nText 2\nConquest may have hastened the end, but the script was already retreating before the invasion: surviving records show it confined to a shrinking set of uses, displaced in trade by a simpler neighboring alphabet. A writing system rarely vanishes for one reason; it is usually abandoned because something easier has already taken its place.",
      prompt:
        "Based on the texts, how would the author of Text 2 most likely characterize the explanation given in Text 1?",
      choices: [
        "As entirely mistaken, since conquest played no part in the script's disappearance.",
        "As capturing a contributing event while overlooking a decline already underway.",
        "As correct in identifying the simpler alphabet as the conquerors' own script.",
        "As proof that writing systems vanish chiefly through the loss of trained scribes.",
      ],
      correct: 1,
      rationale:
        "Text 2 allows that conquest 'may have hastened the end' yet stresses that the script was already shrinking in use before the invasion, so it treats Text 1's account as a real but partial factor — a qualification, which is (B). (A) overshoots into 'entirely mistaken' and 'no part,' but Text 2 explicitly keeps conquest as a hastening cause and only denies that it was the whole story.",
      paceSeconds: 90,
    },
    {
      id: "cross-text-4",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Text 1\nProponents of letting cities go dark at night point to studies in which switching off or dimming streetlights produced no measurable rise in traffic collisions or crime. If safety does not suffer, they argue, communities can cut energy costs and spare nocturnal wildlife the disruption of artificial light.\n\nText 2\nThose null results are encouraging, but they come mostly from quiet residential streets studied over short spans. Whether the same holds on busy roads, or over many years as residents adjust their habits, is unsettled. The case for darkness is plausible; it is not yet general.",
      prompt:
        "A key difference between the two texts is that the author of Text 1, unlike the author of Text 2,",
      choices: [
        "denies that artificial light has any effect on nocturnal wildlife.",
        "claims that crime always falls when streetlights are switched off.",
        "rejects the findings that streetlight reductions left safety unchanged.",
        "treats the available evidence as sufficient to justify dimming lights now.",
      ],
      correct: 3,
      rationale:
        "Text 1 reads the null results as a green light to cut lighting, while Text 2 accepts those same results but limits them to quiet streets and short spans, calling the case 'plausible' but 'not yet general' — so the difference is Text 1's readiness to act on the current evidence, which is (D). (C) misstates the gap: Text 2 does not reject the findings; it endorses them while questioning how far they extend.",
      paceSeconds: 90,
    },
    {
      id: "cross-text-5",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 4,
      passage:
        "Text 1\nA familiar reading of the painter's late works treats their loose, blurred forms as a deliberate turn toward abstraction, a bold anticipation of styles that would not become common for another half century. On this view the dissolving outlines are the artist's chosen language, not a lapse.\n\nText 2\nLetters from the artist's final years describe failing eyesight and the frustration of working from shapes he could no longer see sharply. The blurring need not be only a symptom; an artist may make expressive use of a limitation. But to call it a free stylistic choice ignores what those letters plainly record.",
      prompt:
        "Based on the texts, how would the author of Text 2 most likely respond to the interpretation advanced in Text 1?",
      choices: [
        "By accepting it fully, since the late blurring was purely a matter of style.",
        "By granting that the blurring may be expressive while faulting the claim that it was freely chosen.",
        "By dismissing the late works as mere accidents of failing vision with no artistry.",
        "By concluding that the artist's letters reveal he never intended to paint at all.",
      ],
      correct: 1,
      rationale:
        "Text 2 explicitly allows that 'an artist may make expressive use of a limitation,' so it does not reduce the late works to accident, yet it objects to calling the style a 'free choice' given the documented eyesight loss — a partial concession plus a targeted correction, which is (B). (C) overstates the disagreement into pure accident with 'no artistry,' the opposite of Text 2's concession that the blurring can be expressive.",
      paceSeconds: 90,
    },
    {
      id: "cross-text-6",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Text 1\nIntroducing a top predator to a degraded ecosystem can set off a cascade of recovery: the predator thins overgrown herbivore populations, plants rebound, and the returning vegetation stabilizes streambanks. Cases where wolves were restored to a northern park are often cited as showing how a single species can repair a whole system.\n\nText 2\nThe wolf story is compelling, yet the recovery in that park coincided with wetter years, fewer elk from disease, and shifts in human hunting nearby. Untangling the predator's share from these is hard. Predators may help, but crediting one returning species with a system-wide rescue risks reading a tidy story into a tangle of causes.",
      prompt:
        "Based on the texts, the author of Text 2 would most likely argue that the example invoked in Text 1",
      choices: [
        "demonstrates conclusively that the predator alone drove the ecosystem's recovery.",
        "should be discarded, since predators contribute nothing to ecological recovery.",
        "involves no factors other than the reintroduced predator worth considering.",
        "may overstate one species' role by downplaying other simultaneous causes.",
      ],
      correct: 3,
      rationale:
        "Text 2 calls the wolf story 'compelling' and concedes 'predators may help,' but lists wetter years, fewer elk, and changed hunting as confounding causes, warning against crediting one species with the whole rescue — precisely (D). (B) flips that concession into a flat denial that predators contribute anything, which contradicts Text 2's explicit 'predators may help' and overstates the disagreement.",
      paceSeconds: 90,
    },
    {
      id: "cross-text-7",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Text 1\nDigitizing a museum's collection and posting it online, some curators worry, will keep visitors home: why travel to see an object you can examine in high resolution on a screen? Each new gallery uploaded, on this fear, chips away at the reason to come through the door.\n\nText 2\nAttendance data complicate that worry. Museums that put more of their holdings online have, if anything, seen visits hold steady or rise. A screen image seems to whet curiosity rather than satisfy it, sending some viewers to see the real object. Whether that pattern would survive far larger digital collections, though, no one can yet say.",
      prompt:
        "Which choice best describes the relationship between the two texts?",
      choices: [
        "Text 2 presents evidence that complicates Text 1's worry while declining to declare the worry settled.",
        "Text 2 confirms Text 1's prediction that online access steadily reduces in-person attendance.",
        "Text 2 proves that digital collections can never affect museum attendance in any way.",
        "Text 2 and Text 1 agree that museums should stop digitizing their collections.",
      ],
      correct: 0,
      rationale:
        "Text 1 fears that online access keeps visitors away; Text 2 offers attendance data pointing the other way yet adds that no one can say whether the pattern holds for far larger collections, so it pushes back without claiming the matter is closed — which is (A). (B) reverses Text 2's finding, attributing to it the very decline its data contradict, the classic who-thinks-what flip.",
      paceSeconds: 90,
    },
    {
      id: "cross-text-8",
      skill: "cross-text",
      domain: "Craft and Structure",
      difficulty: 5,
      passage:
        "Text 1\nGiving households detailed feedback on their electricity use — a display showing real-time consumption and a comparison with similar homes — reliably trims usage in the months after installation. People respond to seeing the numbers, and the savings show up quickly on their bills.\n\nText 2\nThe early dip is well documented. What is less often reported is what follows: in longer studies, consumption frequently drifts back toward its old level once the novelty fades and the display becomes part of the background. The feedback works, but its effect may need refreshing to last.",
      prompt: "Based on the texts, the authors of both texts would most likely agree that",
      choices: [
        "feedback displays have no measurable effect on household electricity use.",
        "households permanently lower their electricity use after a display is installed.",
        "feedback displays initially reduce how much electricity households use.",
        "the savings from feedback displays grow larger with every passing year.",
      ],
      correct: 2,
      rationale:
        "Text 1 reports a reliable early reduction, and Text 2 opens by calling that same early dip 'well documented,' so the shared ground is the initial drop in usage — exactly (C) — even as Text 2 doubts the drop's durability. (B) names a point only one side could endorse and then overstates it: Text 1 speaks of months and Text 2 shows consumption drifting back, so 'permanently' is common ground to neither.",
      paceSeconds: 90,
    },
  ],
};
