import { patternAccuracy, weakestPatterns, weightedPatternSample } from '../../src/stats/patternStats';
import { createRng } from '../../src/util/rng';
import type { Attempt } from '../../src/storage/store';
import type { PatternId } from '../../src/domain/types';

const mk = (patternId: PatternId, correct: boolean, at: number, ms = 30000): Attempt =>
  ({ questionId: `q${at}`, patternId, correct, ms, at, source: 'drill', sessionKind: 'morning' });
const series = (p: PatternId, pctCorrect: number, n: number, start = 0) =>
  Array.from({ length: n }, (_, i) => mk(p, i < Math.round(n * pctCorrect), start + i));

describe('patternAccuracy', () => {
  it('uses only the last 30 attempts per pattern', () => {
    const old = Array.from({ length: 30 }, (_, i) => mk('P01', false, i));
    const recent = Array.from({ length: 30 }, (_, i) => mk('P01', true, 100 + i));
    const s = patternAccuracy([...recent, ...old]).get('P01')!;
    expect(s).toEqual({ accuracy: 1, n: 30, avgMs: 30000 });
  });
});

describe('weakestPatterns', () => {
  it('orders by accuracy with n<5 patterns first', () => {
    const attempts = [...series('P01', 0.9, 10), ...series('P02', 0.4, 10, 100), ...series('P03', 0.6, 10, 200), ...series('P04', 0, 2, 300)];
    expect(weakestPatterns(patternAccuracy(attempts), ['P01', 'P02', 'P03', 'P04', 'P05'], 4)).toEqual(['P04', 'P05', 'P02', 'P03']);
  });
});

describe('weightedPatternSample', () => {
  it('draws weaker patterns more often', () => {
    const stats = patternAccuracy([...series('P01', 0.4, 10), ...series('P02', 0.9, 10, 100)]);
    const out = weightedPatternSample(['P01', 'P02'], stats, 10000, createRng(1));
    const weak = out.filter((p) => p === 'P01').length;
    expect(weak).toBeGreaterThan(10000 - weak);
  });
});
