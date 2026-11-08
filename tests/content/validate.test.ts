import { validateContent } from '../../src/content/validate';
import type { Pattern, Question, Word } from '../../src/domain/types';

const pattern: Pattern = { id: 'P01', title: 'Subject and verb', week: 1, dayInWeek: 1, hasGenerator: true };

function q(over: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    patternId: 'P01',
    type: 'structure',
    source: 'drill',
    stem: 'The committee ____ every Monday.',
    options: ['meets', 'meeting', 'to meet', 'it meets'],
    answerIndex: 0,
    explanation: 'The sentence needs a main verb.',
    ...over,
  };
}

const word: Word = {
  id: 'w-analyse', headword: 'analyse', pos: 'verb', definition: 'to examine in detail',
  examples: ['Researchers analyse the data.'], forms: ['analysis', 'analytical'], sublist: 1,
};

const check = (questions: Question[], words: Word[] = [word]) =>
  validateContent({ patterns: [pattern], questions, words });

describe('validateContent', () => {
  it('accepts a minimal valid set', () => {
    expect(check([q(), q({ id: 'q2', type: 'written-expression', stem: '{0} committee {1} every {2} on {3}.', options: ['The', 'meet', 'Monday', 'time'], answerIndex: 1 })])).toEqual([]);
  });
  it('rejects answerIndex outside 0..3', () => {
    const errs = check([q({ id: 'bad-idx', answerIndex: 4 as never })]);
    expect(errs.some((e) => e.includes('bad-idx'))).toBe(true);
  });
  it('rejects duplicate question ids', () => {
    const errs = check([q({ id: 'dup' }), q({ id: 'dup' })]);
    expect(errs.some((e) => e.includes('dup'))).toBe(true);
  });
  it('rejects duplicate options within a question', () => {
    const errs = check([q({ id: 'dup-opt', options: ['meets', 'meets', 'to meet', 'it meets'] })]);
    expect(errs.some((e) => e.includes('dup-opt'))).toBe(true);
  });
  it('rejects structure stem without exactly one "____"', () => {
    expect(check([q({ id: 'no-blank', stem: 'No blank here.' })]).some((e) => e.includes('no-blank'))).toBe(true);
    expect(check([q({ id: 'two-blank', stem: '____ and ____.' })]).some((e) => e.includes('two-blank'))).toBe(true);
  });
  it('rejects WE stem missing any of {0}..{3}', () => {
    const errs = check([q({ id: 'we-miss', type: 'written-expression', stem: '{0} {1} {2} end.' })]);
    expect(errs.some((e) => e.includes('we-miss'))).toBe(true);
  });
  it('rejects mock item without mockForm, and drill item with mockForm', () => {
    expect(check([q({ id: 'mock-no-form', source: 'mock' })]).some((e) => e.includes('mock-no-form'))).toBe(true);
    expect(check([q({ id: 'drill-form', mockForm: 1 })]).some((e) => e.includes('drill-form'))).toBe(true);
  });
  it('rejects unknown patternId', () => {
    const errs = check([q({ id: 'unk', patternId: 'P02' })]);
    expect(errs.some((e) => e.includes('unk'))).toBe(true);
  });
  it('rejects duplicate word ids', () => {
    const errs = check([q()], [word, word]);
    expect(errs.some((e) => e.includes('w-analyse'))).toBe(true);
  });
});
