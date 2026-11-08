import type { Word } from '../domain/types';
import type { CardState } from '../storage/store';

export const MAX_REVIEWS_PER_SESSION = 100;
export const NEW_WORD_BACKLOG_LIMIT = 50;

export type CardKind = 'word-to-meaning' | 'meaning-to-word' | 'cloze';

export function buildVocabQueue(args: {
  words: Word[];
  cards: CardState[];
  now: number;
  newWordsPerDay: number;
  newIntroducedToday: number;
}): { reviews: CardState[]; newWords: Word[] } {
  const dueAll = args.cards.filter((c) => c.dueAt <= args.now).sort((a, b) => a.dueAt - b.dueAt);
  const reviews = dueAll.slice(0, MAX_REVIEWS_PER_SESSION);
  if (dueAll.length > NEW_WORD_BACKLOG_LIMIT) return { reviews, newWords: [] };
  const known = new Set(args.cards.map((c) => c.wordId));
  const room = Math.max(0, args.newWordsPerDay - args.newIntroducedToday);
  const newWords = args.words.filter((w) => !known.has(w.id)).slice(0, room);
  return { reviews, newWords };
}

export function cardKindFor(card: CardState): CardKind {
  if (card.reps === 0) return 'word-to-meaning';
  if (card.reps === 1) return 'meaning-to-word';
  return 'cloze';
}
