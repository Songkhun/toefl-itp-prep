import { generate } from '../../src/generator';

describe('generate(p, 1, seed)', () => {
  it('varies across seeds: many distinct stems and both question types', () => {
    const qs = Array.from({ length: 200 }, (_, i) => generate('P01', 1, i * 7919 + 5)[0]);
    expect(new Set(qs.map((q) => q.stem)).size).toBeGreaterThan(100);
    expect(new Set(qs.map((q) => q.type))).toEqual(new Set(['structure', 'written-expression']));
  });
});
