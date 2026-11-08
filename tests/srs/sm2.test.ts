import { newCard, review } from '../../src/srs/sm2';

const DAY = 86_400_000;
const now = 1_000_000_000_000;

describe('SM-2', () => {
  it('new card has ease 2.5, reps 0, due now', () => {
    expect(newCard('w1', now)).toEqual({ wordId: 'w1', ease: 2.5, intervalDays: 0, reps: 0, dueAt: now, lapses: 0 });
  });
  it('good gives 1 day, then 3 days, then about 3 × ease', () => {
    let c = review(newCard('w', now), 'good', now);
    expect(c.intervalDays).toBe(1);
    expect(c.dueAt).toBe(now + DAY);
    c = review(c, 'good', c.dueAt);
    expect(c.intervalDays).toBe(3);
    c = review(c, 'good', c.dueAt);
    expect(c.intervalDays).toBe(Math.round(3 * c.ease));
  });
  it('again resets reps, due in 10 minutes, adds a lapse, lowers ease by 0.2', () => {
    const c1 = review(review(newCard('w', now), 'good', now), 'good', now);
    const c = review(c1, 'again', now);
    expect(c.reps).toBe(0);
    expect(c.intervalDays).toBe(0);
    expect(c.dueAt).toBe(now + 10 * 60_000);
    expect(c.lapses).toBe(1);
    expect(c.ease).toBeCloseTo(c1.ease - 0.2, 5);
  });
  it('ease never goes below 1.3', () => {
    let c = newCard('w', now);
    for (let i = 0; i < 20; i++) c = review(c, 'again', now);
    expect(c.ease).toBe(1.3);
  });
  it('easy gives longer interval than good; hard no longer than good', () => {
    const base = review(review(newCard('w', now), 'good', now), 'good', now);
    const g = review(base, 'good', now).intervalDays;
    expect(review(base, 'easy', now).intervalDays).toBeGreaterThan(g);
    expect(review(base, 'hard', now).intervalDays).toBeLessThanOrEqual(g);
  });
});
