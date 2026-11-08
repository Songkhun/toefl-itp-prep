import type { CardState } from '../storage/store';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const DAY = 86_400_000;
const AGAIN_DELAY = 10 * 60_000;
const MIN_EASE = 1.3;
const Q: Record<Grade, number> = { again: 2, hard: 3, good: 4, easy: 5 };

export function newCard(wordId: string, now: number): CardState {
  return { wordId, ease: 2.5, intervalDays: 0, reps: 0, dueAt: now, lapses: 0 };
}

export function review(card: CardState, grade: Grade, now: number): CardState {
  if (grade === 'again') {
    return {
      ...card,
      reps: 0,
      intervalDays: 0,
      lapses: card.lapses + 1,
      ease: Math.max(MIN_EASE, round2(card.ease - 0.2)),
      dueAt: now + AGAIN_DELAY,
    };
  }
  const q = Q[grade];
  const ease = Math.max(MIN_EASE, round2(card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
  let interval: number;
  if (grade === 'hard') interval = Math.max(1, Math.round(card.intervalDays * 1.2));
  else if (card.reps === 0) interval = 1;
  else if (card.reps === 1) interval = 3;
  else interval = Math.round(card.intervalDays * ease);
  if (grade === 'easy') interval = Math.max(interval + 1, Math.round(interval * 1.3));
  return { ...card, ease, reps: card.reps + 1, intervalDays: interval, dueAt: now + interval * DAY };
}

const round2 = (x: number) => Math.round(x * 100) / 100;
