import { buildVocabQueue, cardKindFor } from '../../src/srs/vocabQueue';
import { newCard } from '../../src/srs/sm2';
import type { Word } from '../../src/domain/types';
import type { CardState } from '../../src/storage/store';

const now = 1_000_000_000_000;
const words: Word[] = Array.from({ length: 200 }, (_, i) => ({
  id: `w${i}`, headword: `word${i}`, pos: 'noun', definition: 'd', examples: ['e'], forms: [], sublist: 1,
}));
const due = (n: number): CardState[] => Array.from({ length: n }, (_, i) => ({ ...newCard(`w${i}`, now - (n - i) * 1000), reps: 1 }));

describe('buildVocabQueue', () => {
  it('returns due cards oldest first and skips not-yet-due', () => {
    const cards = [{ ...newCard('w1', now - 10), reps: 1 }, { ...newCard('w0', now - 500), reps: 1 }, { ...newCard('w2', now + 5000), reps: 1 }];
    const q = buildVocabQueue({ words, cards, now, newWordsPerDay: 0, newIntroducedToday: 0 });
    expect(q.reviews.map((c) => c.wordId)).toEqual(['w0', 'w1']);
  });
  it('caps reviews at 100 when 130 are due', () => {
    expect(buildVocabQueue({ words, cards: due(130), now, newWordsPerDay: 15, newIntroducedToday: 0 }).reviews).toHaveLength(100);
  });
  it('introduces 0 new words when 51 are due', () => {
    expect(buildVocabQueue({ words, cards: due(51), now, newWordsPerDay: 15, newIntroducedToday: 0 }).newWords).toHaveLength(0);
  });
  it('introduces newWordsPerDay minus already-introduced-today', () => {
    expect(buildVocabQueue({ words, cards: [], now, newWordsPerDay: 15, newIntroducedToday: 4 }).newWords).toHaveLength(11);
    expect(buildVocabQueue({ words, cards: [], now, newWordsPerDay: 15, newIntroducedToday: 20 }).newWords).toHaveLength(0);
  });
  it('never re-introduces a word that already has a card, keeping word order', () => {
    const q = buildVocabQueue({ words, cards: due(3), now, newWordsPerDay: 2, newIntroducedToday: 0 });
    expect(q.newWords.map((w) => w.id)).toEqual(['w3', 'w4']);
  });
});

describe('cardKindFor', () => {
  it('follows reps', () => {
    expect(cardKindFor({ ...newCard('w', now), reps: 0 })).toBe('word-to-meaning');
    expect(cardKindFor({ ...newCard('w', now), reps: 1 })).toBe('meaning-to-word');
    expect(cardKindFor({ ...newCard('w', now), reps: 5 })).toBe('cloze');
  });
});
