import type { PatternId } from '../domain/types';
import type { PlanState } from '../storage/store';
import { PATTERNS } from '../content/patterns';

export const PLAN_DAYS = 84;
export const LEARN_DAYS = 56;

export type Phase = 'learn' | 'review' | 'mixed';
export interface TodayPlan { planDay: number; week: number; phase: Phase; patternId: PatternId | null; morningAvailable: boolean }

const DAY = 86_400_000;
const toUtc = (d: string) => {
  const [y, m, dd] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, dd);
};
const fromUtc = (t: number) => new Date(t).toISOString().slice(0, 10);

export function addDays(date: string, n: number): string {
  return fromUtc(toUtc(date) + n * DAY);
}
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY);
}
export function localDate(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function startPlan(today: string): PlanState {
  return { startDate: today, planDay: 1, lastCompletedDate: null };
}

export function patternForDay(planDay: number): PatternId | null {
  const week = Math.ceil(planDay / 7);
  const dayInWeek = ((planDay - 1) % 7) + 1;
  return PATTERNS.find((p) => p.week === week && p.dayInWeek === dayInWeek)?.id ?? null;
}

export function todayPlan(state: PlanState, today: string): TodayPlan {
  const planDay = state.planDay;
  const week = Math.ceil(planDay / 7);
  const patternId = planDay <= LEARN_DAYS ? patternForDay(planDay) : null;
  const phase: Phase = planDay > LEARN_DAYS ? 'mixed' : patternId ? 'learn' : 'review';
  return { planDay, week, phase, patternId, morningAvailable: state.lastCompletedDate !== today };
}

/** Advances by exactly one plan day (pause-on-miss); never twice on the same date; capped at 84. */
export function completeMorning(state: PlanState, today: string): PlanState {
  if (state.lastCompletedDate === today) return state;
  return { ...state, planDay: Math.min(PLAN_DAYS, state.planDay + 1), lastCompletedDate: today };
}



export function pace(state: PlanState, today: string, testDate: string | null) {
  if (!testDate) return null;
  const projectedFinishWeek8 = addDays(today, Math.max(0, LEARN_DAYS - state.planDay));
  return {
    projectedFinishWeek8,
    daysUntilTest: daysBetween(today, testDate),
    onPace: daysBetween(projectedFinishWeek8, testDate) >= 0,
  };
}

/** Patterns whose learn day has been completed (all plan days before the current one). */
export function studiedPatterns(state: PlanState): PatternId[] {
  return PATTERNS.filter((p) => (p.week - 1) * 7 + p.dayInWeek < state.planDay).map((p) => p.id);
}
