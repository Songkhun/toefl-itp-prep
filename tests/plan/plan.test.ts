import { startPlan, todayPlan, completeMorning, pace, addDays, localDate } from '../../src/plan/plan';
import { PATTERNS } from '../../src/content/patterns';

describe('plan engine', () => {
  const s0 = startPlan('2026-11-09');

  it('day 1 of week 1 is learn phase with P01', () => {
    expect(todayPlan(s0, '2026-11-09')).toEqual({ planDay: 1, week: 1, phase: 'learn', patternId: 'P01', morningAvailable: true });
  });
  it('day 2 is a review day', () => {
    const t = todayPlan({ ...s0, planDay: 2 }, '2026-11-10');
    expect(t.phase).toBe('review');
    expect(t.patternId).toBeNull();
  });
  it('day 57 is mixed with patternId null', () => {
    const t = todayPlan({ ...s0, planDay: 57 }, '2027-01-04');
    expect(t).toMatchObject({ week: 9, phase: 'mixed', patternId: null });
  });
  it('completeMorning advances exactly one day after a 5-day gap', () => {
    const s = completeMorning({ ...s0, planDay: 4, lastCompletedDate: '2026-11-10' }, '2026-11-15');
    expect(s.planDay).toBe(5);
    expect(s.lastCompletedDate).toBe('2026-11-15');
  });
  it('morning unavailable twice on the same date', () => {
    const s = completeMorning(s0, '2026-11-09');
    expect(todayPlan(s, '2026-11-09').morningAvailable).toBe(false);
    expect(todayPlan(s, '2026-11-10').morningAvailable).toBe(true);
  });
  it('completeMorning on the same date twice does not advance again', () => {
    const s = completeMorning(completeMorning(s0, '2026-11-09'), '2026-11-09');
    expect(s.planDay).toBe(2);
  });
  it('planDay never exceeds 84', () => {
    expect(completeMorning({ ...s0, planDay: 84 }, '2027-03-01').planDay).toBe(84);
  });
  it('every pattern P01–P25 appears exactly once as a learn day in weeks 1–8', () => {
    const seen: string[] = [];
    for (let d = 1; d <= 56; d++) {
      const t = todayPlan({ ...s0, planDay: d }, '2026-11-09');
      if (t.patternId) seen.push(t.patternId);
    }
    expect(seen).toEqual(PATTERNS.map((p) => p.id));
  });
  it('pace returns null without test date', () => {
    expect(pace(s0, '2026-11-09', null)).toBeNull();
  });
  it('pace projects week-8 finish and onPace', () => {
    const p = pace({ ...s0, planDay: 1 }, '2026-11-09', '2027-02-05')!;
    expect(p.projectedFinishWeek8).toBe('2027-01-03');
    expect(p.daysUntilTest).toBe(88);
    expect(p.onPace).toBe(true);
  });
  it('pace onPace false when projected week-8 finish is after test date', () => {
    expect(pace({ ...s0, planDay: 1 }, '2026-12-20', '2027-01-15')!.onPace).toBe(false);
  });
  it('addDays crosses month/year and DST boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-13', 2)).toBe('2027-03-15');
  });
  it('localDate formats YYYY-MM-DD in local time', () => {
    expect(localDate(new Date(2026, 10, 8, 23, 59))).toBe('2026-11-08');
  });
});

import { studiedPatterns } from '../../src/plan/plan';
describe('studiedPatterns', () => {
  it('is empty before the first morning and includes P01 after it', () => {
    expect(studiedPatterns(startPlan('2026-11-09'))).toEqual([]);
    expect(studiedPatterns(completeMorning(startPlan('2026-11-09'), '2026-11-09'))).toEqual(['P01']);
  });
  it('includes all 25 in the mixed phase', () => {
    expect(studiedPatterns({ startDate: '2026-11-09', planDay: 60, lastCompletedDate: null })).toHaveLength(25);
  });
});
