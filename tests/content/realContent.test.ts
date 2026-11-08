import { realContent, allBankQuestions } from '../../src/content';
import { validateContent } from '../../src/content/validate';
import { PATTERNS } from '../../src/content/patterns';
import { hasGenerator } from '../../src/generator';
import type { PatternId } from '../../src/domain/types';

const RELEASE1: PatternId[] = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];

describe('real content (release 1)', () => {
  it('is valid', () => {
    expect(validateContent({ patterns: PATTERNS, questions: allBankQuestions(), words: realContent.allWords() })).toEqual([]);
  });
  it('P01–P06 each have enough drill items, all with source "drill"', () => {
    for (const p of RELEASE1) {
      const items = realContent.drillItems(p);
      expect(items.length, p).toBeGreaterThanOrEqual(hasGenerator(p) ? 10 : 16);
      expect(items.every((q) => q.source === 'drill' && q.patternId === p), p).toBe(true);
      expect(new Set(items.map((q) => q.type)).size, p).toBe(2);
    }
  });
  it('mock form 1 has exactly 40 items, Q1–15 Structure, all source "mock" form 1, covering all 25 patterns', () => {
    const f = realContent.mockForm(1);
    expect(f).toHaveLength(40);
    expect(f.slice(0, 15).every((q) => q.type === 'structure')).toBe(true);
    expect(f.slice(15).every((q) => q.type === 'written-expression')).toBe(true);
    expect(f.every((q) => q.source === 'mock' && q.mockForm === 1)).toBe(true);
    expect(new Set(f.map((q) => q.patternId)).size).toBe(25);
  });
  it('answer positions are spread out in the mock', () => {
    const counts = [0, 1, 2, 3].map((i) => realContent.mockForm(1).filter((q) => q.answerIndex === i).length);
    expect(Math.min(...counts)).toBeGreaterThanOrEqual(5);
  });
  it('has at least 150 words with no duplicate headwords, in sublist order', () => {
    const w = realContent.allWords();
    expect(w.length).toBeGreaterThanOrEqual(150);
    expect(new Set(w.map((x) => x.headword.toLowerCase())).size).toBe(w.length);
    for (let i = 1; i < w.length; i++) expect(w[i].sublist).toBeGreaterThanOrEqual(w[i - 1].sublist);
  });
  it('each example sentence contains the headword or one of its forms', () => {
    for (const w of realContent.allWords()) {
      const forms = [w.headword, ...w.forms].map((f) => f.toLowerCase());
      for (const e of w.examples) expect(forms.some((f) => e.toLowerCase().includes(f)), `${w.headword}: ${e}`).toBe(true);
    }
  });
  it('each release-1 pattern has a lesson', () => {
    for (const p of RELEASE1) expect(realContent.lesson(p).length, p).toBeGreaterThan(200);
  });
  it('drill and mock sentences do not overlap', () => {
    const drill = new Set(RELEASE1.flatMap((p) => realContent.drillItems(p)).map((q) => q.stem));
    expect(realContent.mockForm(1).filter((q) => drill.has(q.stem))).toEqual([]);
  });
});
