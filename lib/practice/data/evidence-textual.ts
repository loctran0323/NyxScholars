import type { RWSkillData } from "@/lib/practice/types";

export const DATA: RWSkillData = {
  concept: {
    whatItTests:
      "The student is given a specific claim, hypothesis, or conclusion and must pick the one piece of textual evidence (a finding, observation, or quotation) that bears most directly on it. The hard version turns on direction and precision: the right choice supports or weakens the EXACT claim as stated, not a neighboring claim, and it does so logically rather than by merely mentioning the same topic.",
    howToAttack: [
      "Restate the claim in your own words and note its direction — what exactly would have to be true for it to hold, and what would break it.",
      "Read the prompt twice to lock in whether you need evidence that SUPPORTS or one that WEAKENS; many traps are correct evidence pointed the wrong way.",
      "Test each choice against the claim's specific terms. Reject options that are on-topic but address a different variable, a different group, or a vaguer version of the claim.",
    ],
    traps: [
      "On-topic but off-target: the choice discusses the same subject yet supports a related claim the passage did not actually make.",
      "Right evidence, wrong direction: a finding that would clearly weaken the claim is offered for a 'support' prompt (or vice versa).",
      "Too weak to decide: a vague or hedged observation that is consistent with the claim but does not distinguish it from the alternative explanation the passage raised.",
    ],
  },
  questions: [
    {
      id: "evidence-textual-1",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "A team studying urban songbirds noticed that males in the noisiest parts of a city sang at a higher pitch than males of the same species in quieter parks. The researchers proposed that the higher pitch is an adjustment to traffic noise, which is concentrated at low frequencies: by shifting upward, a bird's song would be less likely to be masked by the rumble of cars.",
      prompt:
        "Which finding, if true, would most directly support the researchers' explanation for the higher pitch?",
      choices: [
        "Female songbirds in both noisy and quiet areas responded equally to recordings of high-pitched and low-pitched songs.",
        "Birds in the noisy areas were, on average, slightly smaller than those in the quiet parks.",
        "The noisy areas of the city contained fewer trees and shrubs than the quiet parks.",
        "When traffic noise near a quiet park was experimentally raised for several weeks, the resident males gradually raised the pitch of their songs.",
      ],
      correct: 3,
      rationale:
        "The claim is causal: traffic noise drives the upward pitch shift. Choice D manipulates the proposed cause and observes the predicted effect, which is the most direct support. The strongest trap is B, which offers a competing explanation (body size predicts pitch) and so actually undercuts the noise account rather than supporting it.",
      paceSeconds: 75,
    },
    {
      id: "evidence-textual-2",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 3,
      passage:
        "An economist examined towns that had recently opened a public library branch. She argued that the branches did more than lend books: they functioned as informal job-search centers, because residents used the free computers and quiet space to apply for work. As evidence she pointed to a rise in local employment in the year after each branch opened.",
      prompt:
        "Which finding, if true, would most strongly undermine the economist's interpretation of why employment rose?",
      choices: [
        "Library branches in the study reported that their public computers were in use for most of the working day.",
        "Residents who used the branches said they valued having a quiet place to concentrate.",
        "Each town in the study had also received a new manufacturing plant in the same year, which hired hundreds of workers directly.",
        "Towns without new library branches saw employment hold steady over the same period.",
      ],
      correct: 2,
      rationale:
        "Her interpretation is that the branches caused the employment rise by aiding job searches. Choice C supplies a separate, large cause operating at the same time, so the rise need not be the libraries' doing. The trap is D: stable employment elsewhere seems to strengthen her case, but it does not rule out the plant in C and only shows a correlation, not the library mechanism she claims.",
      paceSeconds: 75,
    },
    {
      id: "evidence-textual-3",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Marine biologists found that a species of reef fish kept on a steady diet in a lab developed duller coloration over several months than wild members of the species. They concluded that a specific pigment, abundant in the algae the fish eat in the wild but absent from the lab feed, is responsible for the vivid color seen in the wild.",
      prompt:
        "Which finding, if true, would most strongly weaken the biologists' conclusion?",
      choices: [
        "Wild members of the species live among brightly colored corals that may help camouflage them.",
        "The lab fish remained as active and healthy as the wild fish throughout the study.",
        "Other reef fish species also appear duller when raised in laboratory conditions.",
        "Lab fish given feed enriched with the algae's pigment stayed just as dull as before, while fish moved to natural daylight regained vivid color.",
      ],
      correct: 3,
      rationale:
        "The conclusion names a specific cause — the algal pigment — for the color. Choice D directly tests that pigment and finds it does nothing, while a different factor (daylight) restores color, which dismantles the proposed mechanism. The likeliest trap is C: a general pattern across species sounds relevant but neither confirms nor rules out the pigment account, so it does not weaken the specific claim.",
      paceSeconds: 80,
    },
    {
      id: "evidence-textual-4",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A historian studying a medieval port city argued that its prosperity came chiefly from its role as a transfer point for goods passing between two larger regions, rather than from anything the city itself produced. She noted that the city's warehouses were unusually large for a settlement of its size.",
      prompt:
        "Which finding, if true, would most strongly challenge the historian's claim about the source of the city's prosperity?",
      choices: [
        "Tax rolls show that the city's wealthiest households were workshop owners whose finished goods were prized in distant markets.",
        "The city's population grew steadily during the period the historian studied.",
        "Surviving records indicate that many merchants in the city leased warehouse space rather than owning workshops.",
        "Several neighboring towns of similar size also built large warehouses.",
      ],
      correct: 0,
      rationale:
        "Her claim is that wealth came from transferring others' goods, not from local production. Choice A ties the city's richest households to making prized goods, which is exactly the production-based source she rules out, so it most directly challenges her. Choice C is the sharpest trap because warehouse-leasing merchants fit her transfer story and so support, rather than challenge, the claim.",
      paceSeconds: 80,
    },
    {
      id: "evidence-textual-5",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "A psychologist proposed that people remember the start and end of an experience more accurately than its middle. To test this, participants watched a series of unrelated short film clips and later tried to recall as many as they could.",
      prompt:
        "Which result, if true, would most directly support the psychologist's hypothesis?",
      choices: [
        "Across participants, the clips shown first and last in the series were recalled far more often than those shown in the middle.",
        "Participants who watched the clips in a quiet room recalled more clips than those in a noisy room.",
        "Participants recalled roughly the same number of clips regardless of how many clips were in the series.",
        "Participants rated the clips shown in the middle of the series as the most interesting.",
      ],
      correct: 0,
      rationale:
        "The hypothesis is specifically about position: edges of an experience are remembered better than the middle. Choice A reports exactly that gradient by serial position, the direct test. Choice D is the trap — it concerns how interesting the middle clips were, a different variable, and if anything cuts against the hypothesis by giving the middle an advantage.",
      paceSeconds: 80,
    },
    {
      id: "evidence-textual-6",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 4,
      passage:
        "Botanists observed that a flowering plant native to a cold mountain region opens its petals only when the air warms past a certain point during the day. One researcher suggested that this timing is not about temperature itself but about pollinators: the plant opens when its main insect pollinator, which is active only in warmth, is most likely to be flying.",
      prompt:
        "Which finding, if true, would most directly support the researcher's pollinator-based explanation over a purely temperature-based one?",
      choices: [
        "In years when the pollinating insect was scarce, the plant produced fewer seeds.",
        "On unusually warm days early in the season, before the pollinator emerged, the plant kept its petals closed.",
        "The plant's petals were observed to open more slowly on cooler days than on warmer ones.",
        "The pollinating insect visits several other plant species in the same region.",
      ],
      correct: 1,
      rationale:
        "The prompt asks specifically for evidence favoring the pollinator account over the temperature account. Choice B breaks the link between warmth and opening — warmth is present but the plant stays shut while the pollinator is absent — which only the pollinator hypothesis predicts. Choice C is the trap: opening that tracks temperature is equally explained by the simpler temperature account, so it cannot distinguish the two.",
      paceSeconds: 85,
    },
    {
      id: "evidence-textual-7",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "An archaeologist examined a set of clay tablets from an ancient administrative center. Because the tablets record quantities of grain alongside lists of names, some scholars have read them as tax receipts. The archaeologist disagreed, arguing instead that the tablets are records of grain distributed to workers as rations.",
      prompt:
        "Which finding, if true, would most strongly support the archaeologist's reading over the tax-receipt reading?",
      choices: [
        "The named individuals on the tablets received amounts of grain that closely match the daily food needs of a laborer over fixed periods.",
        "The tablets were stored together in a single room near the center's main courtyard.",
        "The quantities of grain recorded on the tablets vary widely from one name to the next.",
        "Similar clay tablets from other sites have been interpreted as tax receipts.",
      ],
      correct: 0,
      rationale:
        "His reading is that the grain flowed outward as rations, not inward as tax. Choice A shows the recorded amounts scale to what a worker would eat over set periods, the signature of a ration system and not of taxes owed. Choice D is the strongest trap: precedent at other sites bears on the rival reading and, far from supporting the archaeologist, leans toward the tax interpretation he rejects.",
      paceSeconds: 90,
    },
    {
      id: "evidence-textual-8",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A linguist studied a small community where most adults speak two languages. She claimed that the two languages are not used interchangeably but are sorted by setting: one language is reserved for the home and close family, the other for school, work, and public business. A student reviewing the study suspected that the sorting is breaking down among the youngest speakers.",
      prompt:
        "Which observation, if true, would most directly support the student's suspicion?",
      choices: [
        "Older adults in the community switch fluidly between the two languages within a single conversation.",
        "Children in the community can understand both languages even when they cannot yet speak both fluently.",
        "Young children regularly use the home language with teachers and the public language with their parents at home.",
        "The public language is taught as a required subject in the community's schools.",
      ],
      correct: 2,
      rationale:
        "The student's suspicion is that the home-versus-public sorting is eroding specifically among the youngest speakers. Choice C shows children using each language in the setting the linguist assigned to the other, which is precisely the breakdown of sorting. Choice A is the trap: rapid switching by older adults describes a different group and, in any case, may reflect a separate conversational style rather than a collapse of the setting-based rule.",
      paceSeconds: 90,
    },
    {
      id: "evidence-textual-9",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "Sleep researchers reported that adults who took a brief afternoon nap performed better on a memory task that evening than adults who stayed awake. They concluded that the nap itself consolidated the memories formed earlier in the day. A skeptic countered that the napping group may simply have been less mentally fatigued by evening, and that reduced fatigue, not memory consolidation, explains the better scores.",
      prompt:
        "Which finding, if true, would most strongly support the researchers' conclusion against the skeptic's objection?",
      choices: [
        "The napping group reported feeling more alert in the evening than the group that stayed awake.",
        "Both groups scored equally well on a separate task that measured reaction speed in the evening.",
        "Adults who napped longer in the afternoon reported sleeping less well that night.",
        "The napping group fell asleep within a few minutes of lying down each afternoon.",
      ],
      correct: 1,
      rationale:
        "To beat the skeptic, the researchers need evidence that the nap helped memory specifically, not general alertness. Choice B shows the groups are equal on a pure alertness measure (reaction speed) yet differ on memory, isolating consolidation as the cause. Choice A is the trap: greater alertness in the napping group is exactly what the skeptic predicts, so it bolsters the fatigue objection rather than the consolidation claim.",
      paceSeconds: 90,
    },
    {
      id: "evidence-textual-10",
      skill: "evidence-textual",
      domain: "Information and Ideas",
      difficulty: 5,
      passage:
        "A critic writing about a nineteenth-century novelist argued that the author revised her early chapters heavily not to fix errors but to plant clues that would only make sense once a reader reached the ending. The critic based this on the fact that surviving early drafts of the opening chapters differ substantially from the published versions.",
      prompt:
        "Which finding, if true, would most strongly undermine the critic's specific explanation for the revisions?",
      choices: [
        "The author's letters describe her as a meticulous writer who revised every manuscript many times.",
        "The published opening chapters contain details that quietly foreshadow the novel's final twist.",
        "The surviving early drafts contain numerous grammatical mistakes and inconsistencies that the published versions correct.",
        "The author revised the closing chapters as heavily as she revised the opening ones.",
      ],
      correct: 2,
      rationale:
        "The critic's specific claim is that the revisions were for planting clues, NOT for fixing errors. Choice C shows the drafts were riddled with mistakes that the revisions corrected, giving the ordinary error-fixing motive the critic ruled out. Choice B is the trap: foreshadowing in the final text seems to confirm the clue theory, but it says nothing about why the chapters were revised and is equally consistent with clues present from the first draft.",
      paceSeconds: 90,
    },
  ],
};
