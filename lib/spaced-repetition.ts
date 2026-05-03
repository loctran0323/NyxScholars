/**
 * Anki-style spaced-repetition scheduler.
 *
 * Each card has:
 *   • interval (days until next review)
 *   • ease    (multiplier on interval — typical SM-2 starts at 2.5)
 *   • due     (Date when next review surfaces)
 *
 * Card responses are graded 0..5 (SM-2):
 *   0–2 → reset interval to 1 day; lower ease.
 *   3   → keep interval; raise ease slightly.
 *   4–5 → multiply interval by ease; bump ease for 5.
 */

export interface SrsCard {
  id: string;
  skillId: string;
  prompt: string;
  answer: string;
  interval: number;        // days
  ease: number;            // multiplier
  due: string;             // ISO datetime
  reps: number;
  lapses: number;
}

export interface SrsReview {
  cardId: string;
  grade: 0 | 1 | 2 | 3 | 4 | 5;
  ms: number;
}

const MIN_EASE = 1.3;
const STARTING_EASE = 2.5;

export function newCard(input: { id: string; skillId: string; prompt: string; answer: string }): SrsCard {
  return {
    ...input,
    interval: 0,
    ease:     STARTING_EASE,
    due:      new Date().toISOString(),
    reps:     0,
    lapses:   0,
  };
}

export function applyReview(card: SrsCard, review: SrsReview): SrsCard {
  let { interval, ease, reps, lapses } = card;
  const grade = review.grade;

  if (grade < 3) {
    interval = 1;
    ease = Math.max(MIN_EASE, ease - 0.2);
    lapses += 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ease);
    ease = Math.max(MIN_EASE, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  }

  reps += 1;
  const due = new Date(Date.now() + interval * 24 * 3600 * 1000).toISOString();
  return { ...card, interval, ease, reps, lapses, due };
}

/** Pick the next batch of cards due today. */
export function dueQueue(cards: SrsCard[], now: Date = new Date(), limit = 8): SrsCard[] {
  return cards
    .filter((c) => new Date(c.due) <= now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, limit);
}
