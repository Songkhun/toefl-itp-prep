import { buildReview, openMistakes, REVIEW_SIZE } from '../../src/session/review';
import type { ContentSource } from '../../src/content';
import type { Question } from '../../src/domain/types';
import type { Attempt } from '../../src/storage/store';

const q = (id: string, source: Question['source'] = 'generated', stem = `${id} ____.`): Question => ({
  id, patternId: 'P01', type: 'structure', source, stem, options: ['a', 'b', 'c', 'd'], answerIndex: 0, explanation: 'E',
});
const content: ContentSource = {
  drillItems: (p) => (p === 'P01' ? [q('d1', 'drill', 'Bank text, corrected ____.')] : []),
  mockForm: () => [], availableMockForms: () => [], allWords: () => [], lesson: () => '',
};
const att = (question: Question, correct: boolean, at: number, save = !correct): Attempt => ({
  questionId: question.id, patternId: question.patternId, correct, ms: 1000, at, source: question.source, sessionKind: 'newset',
  ...(save ? { question } : {}),
});

describe('openMistakes', () => {
  it('lists a missed question until it is answered correctly twice after the last miss', () => {
    const g = q('g1');
    expect(openMistakes([att(g, false, 1)], content).map((m) => m.question.id)).toEqual(['g1']);
    expect(openMistakes([att(g, false, 1), att(g, true, 2)], content)).toHaveLength(1);
    expect(openMistakes([att(g, false, 1), att(g, true, 2), att(g, true, 3)], content)).toHaveLength(0);
    // a new miss resets the count
    expect(openMistakes([att(g, false, 1), att(g, true, 2), att(g, false, 3), att(g, true, 4)], content)).toHaveLength(1);
  });
  it('ignores questions never missed, fixed mock items, and generated misses without a saved copy', () => {
    const list = openMistakes([att(q('ok'), true, 1), att(q('m1', 'mock'), false, 2), att(q('old'), false, 3, false)], content);
    expect(list).toHaveLength(0);
  });
  it('uses the current bank text for drill items', () => {
    const [m] = openMistakes([att(q('d1', 'drill', 'Old text ____.'), false, 1)], content);
    expect(m.question.stem).toBe('Bank text, corrected ____.');
  });
  it('orders least recently answered first', () => {
    const list = openMistakes([att(q('a'), false, 5), att(q('b'), false, 1), att(q('c'), false, 3)], content);
    expect(list.map((m) => m.question.id)).toEqual(['b', 'c', 'a']);
  });
});

describe('buildReview', () => {
  it(`returns at most ${REVIEW_SIZE} questions, the least recently answered ones`, () => {
    const attempts = Array.from({ length: 30 }, (_, i) => att(q(`g${i}`), false, i));
    const qs = buildReview(attempts, 7, content);
    expect(qs).toHaveLength(REVIEW_SIZE);
    expect(new Set(qs.map((x) => x.id))).toEqual(new Set(Array.from({ length: REVIEW_SIZE }, (_, i) => `g${i}`)));
  });
});
