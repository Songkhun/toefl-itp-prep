import { createRng, shuffle, pick } from '../../src/util/rng';

describe('rng', () => {
  it('same seed gives same sequence', () => {
    const a = createRng(42), b = createRng(42);
    const sa = [a(), a(), a()], sb = [b(), b(), b()];
    expect(sa).toEqual(sb);
    expect(sa.every((x) => x >= 0 && x < 1)).toBe(true);
  });
  it('different seeds differ', () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
  it('shuffle keeps all elements and does not mutate input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(input, createRng(7));
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect([...out].sort((x, y) => x - y)).toEqual(input);
  });
  it('pick returns n distinct elements, or all when n exceeds length', () => {
    const out = pick([1, 2, 3, 4, 5], 3, createRng(3));
    expect(new Set(out).size).toBe(3);
    expect(pick([1, 2], 5, createRng(3))).toHaveLength(2);
  });
});
