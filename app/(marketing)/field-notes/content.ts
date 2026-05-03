export interface FieldNote {
  slug: string;
  title: string;
  author: string;
  publishedAt: string;
  preview: string;
  body: string;
}

export const FIELD_NOTES: FieldNote[] = [
  {
    slug: "how-i-broke-1500",
    title: "How I broke 1500.",
    author: "Anika, Princeton '26",
    publishedAt: "2026-04-12",
    preview: "Three weeks before the SAT I was at 1380. The thing that moved me wasn't more practice — it was a 30-minute habit shift.",
    body: `When I was a junior, I plateaued at 1380 for almost two months. The plateau wasn't because I was lazy — I was doing four practice tests a week. The unlock was that I started auditing my mistakes instead of just counting them.

After every section I would print the question, the choice I picked, and write a sentence in the margin: "wrong because…" — without checking the rationale first. That single discipline taught me to recognize the *shape* of my errors. Within three weeks I was at 1530.

I now ask every Nyx student to do the same in week one. Most of them resist for the first two days, then come back saying "I see the pattern now."`,
  },
  {
    slug: "act-pacing-cheat-sheet",
    title: "ACT pacing: the only cheat sheet that worked for me.",
    author: "Ben, Yale '25",
    publishedAt: "2026-03-29",
    preview: "Reading section is 35 minutes for 4 passages. That's 53 seconds per question, but if you spend it that way you're already losing.",
    body: `The ACT Reading section punishes evenly distributed time. The right move is uneven pacing: 8 minutes on the easiest passage, 9 minutes on each of the next two, and bank the remainder for the hardest passage.

The way to know which passage is hardest in real time: skim the first sentence of paragraph one, then the questions. If three of the questions are line-reference questions, that passage is fast. If two of them are inference questions, slow down.

I ran this with 14 students last cycle. Average ACT Reading delta: +3.2 points.`,
  },
  {
    slug: "essay-eleven-drafts",
    title: "Why I let my student write eleven drafts.",
    author: "Daniela, Stanford '24",
    publishedAt: "2026-03-15",
    preview: "Most college admissions counselors stop at four drafts. Here's why I kept going.",
    body: `When Priya hit her fourth draft, the essay was solid — readable, correct, vivid. But it didn't sound like her.

We talked about why on a 30-minute call: she was writing what she thought a Stanford reader wanted, not what she actually thought about her parents' restaurant. Every revision after that was about subtraction. By draft eleven, she had cut 600 words and added two sentences. The two sentences are the ones I quote when admitted-student parents ask "what makes a Nyx essay different."

The point isn't to write a lot. It's to keep cutting until what's left is unmistakably yours.`,
  },
];
