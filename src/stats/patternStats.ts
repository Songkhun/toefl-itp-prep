import type { PatternId } from '../domain/types';
import type { Attempt } from '../storage/store';
import type { Rng } from '../util/rng';

export interface PatternStat { accuracy: number; n: number; avgMs: number }
export type PatternStats = Map<PatternId, PatternStat>;

export const MIN_ATTEMPTS_FOR_ACCURACY = 5;

/** Accuracy over the last `window` attempts per pattern, from every source (mocks are real evidence). */
export function patternAccuracy(attempts: Attempt[], window = 30): PatternStats {
  const byPattern = new Map<PatternId, Attempt[]>();
  for (const a of attempts) {
    const list = byPattern.get(a.patternId) ?? [];
    list.push(a);
    byPattern.set(a.patternId, list);
  }
  const out: PatternStats = new Map();
  for (const [p, list] of byPattern) {
    const recent = [...list].sort((a, b) => a.at - b.at).slice(-window);
    const correct = recent.filter((a) => a.correct).length;
    out.set(p, { accuracy: correct / recent.length, n: recent.length, avgMs: recent.reduce((s, a) => s + a.ms, 0) / recent.length });
  }
  return out;
}

/** Lowest-accuracy studied patterns; patterns with too few attempts sort first ("needs practice"). */
export function weakestPatterns(stats: PatternStats, studied: PatternId[], k: number): PatternId[] {
  const key = (p: PatternId) => {
    const s = stats.get(p);
    return !s || s.n < MIN_ATTEMPTS_FOR_ACCURACY ? -1 : s.accuracy;
  };
  return [...studied].sort((a, b) => key(a) - key(b)).slice(0, k);
}

export function weightedPatternSample(studied: PatternId[], stats: PatternStats, n: number, rng: Rng): PatternId[] {
  if (!studied.length) return [];
  const weights = studied.map((p) => {
    const s = stats.get(p);
    return 1.5 - (!s || s.n < MIN_ATTEMPTS_FOR_ACCURACY ? 0.5 : s.accuracy);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const out: PatternId[] = [];
  for (let i = 0; i < n; i++) {
    let r = rng() * total;
    let j = 0;
    while (r >= weights[j] && j < weights.length - 1) r -= weights[j++];
    out.push(studied[j]);
  }
  return out;
}
