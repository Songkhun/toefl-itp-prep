import type { PatternId, Question } from '../domain/types';
import { realContent, type ContentSource } from '../content';
import { generate, hasGenerator } from '../generator';
import { weightedPatternSample, type PatternStats } from '../stats/patternStats';
import { createRng, shuffle, type Rng } from '../util/rng';
import type { Attempt, MockResult } from '../storage/store';

export const SECONDS_PER_QUESTION = 37;
export const MORNING_SIZE = 15;
export const MORNING_DRILL_FROM_BANK = 5;
export const AFTERNOON_SIZE = 20;
export const NEWSET_SIZE = 15;
export const MOCK_TIME_MS = 25 * 60_000;

const structureFirst = (qs: Question[]) =>
  [...qs.filter((q) => q.type === 'structure'), ...qs.filter((q) => q.type === 'written-expression')];
const notMock = (qs: Question[]) => qs.filter((q) => q.source !== 'mock');

/** Bank items answered within this window are skipped when anything else is available. */
export const RECENT_MS = 3 * 86_400_000;
/** What the learner has answered: question id -> time it was last answered (epoch ms). */
export interface History { seen: Map<string, number>; now: number }
const NO_HISTORY: History = { seen: new Map(), now: 0 };

export function historyFrom(attempts: Attempt[], now: number): History {
  const seen = new Map<string, number>();
  for (const a of attempts) seen.set(a.questionId, Math.max(seen.get(a.questionId) ?? 0, a.at));
  return { seen, now };
}
const isRecent = (q: Question, h: History) => {
  const at = h.seen.get(q.id);
  return at !== undefined && at > h.now - RECENT_MS;
};
/** Random order, then never-answered items first and the rest from least to most recently answered. */
const freshFirst = (qs: Question[], h: History, rng: Rng) =>
  shuffle(qs, rng).sort((a, b) => (h.seen.get(a.id) ?? 0) - (h.seen.get(b.id) ?? 0));

export function buildMorningDrill(p: PatternId, seed: number, content: ContentSource = realContent, history: History = NO_HISTORY): Question[] {
  const rng = createRng(seed);
  const bank = freshFirst(notMock(content.drillItems(p)), history, rng);
  if (!hasGenerator(p)) return shuffle(bank.slice(0, MORNING_SIZE), rng);
  const fromBank = bank.filter((q) => !isRecent(q, history)).slice(0, MORNING_DRILL_FROM_BANK);
  const generated = generate(p, MORNING_SIZE - fromBank.length, seed);
  return shuffle([...fromBank, ...generated], rng);
}

/** One item for pattern p not already used: bank item or generated, about half each when both exist. */
function oneItem(p: PatternId, used: Set<string>, rng: Rng, content: ContentSource, seed: number, history: History): Question | null {
  const unused = notMock(content.drillItems(p)).filter((q) => !used.has(q.id));
  const notRecent = unused.filter((q) => !isRecent(q, history));
  // Recently answered bank items only when the pattern has no generator and nothing else is left.
  const bank = notRecent.length || hasGenerator(p) ? notRecent : freshFirst(unused, history, rng).slice(0, 1);
  const tryGenerated = () => {
    if (!hasGenerator(p)) return null;
    const g = generate(p, 1, seed * 1000 + Math.floor(rng() * 1e6))[0];
    return used.has(g.stem) ? null : { ...g, id: `${g.id}-${used.size}` };
  };
  const preferBank = rng() < 0.5;
  const fromBank = bank.length ? bank[Math.floor(rng() * bank.length)] : null;
  return (preferBank ? fromBank ?? tryGenerated() : tryGenerated() ?? fromBank) ?? null;
}

export function buildAfternoonSet(studied: PatternId[], stats: PatternStats, seed: number, content: ContentSource = realContent, history: History = NO_HISTORY) {
  const rng = createRng(seed);
  const pool: PatternId[] = studied.length ? studied : ['P01'];
  const out: Question[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < AFTERNOON_SIZE && guard < AFTERNOON_SIZE * 20; guard++) {
    const [p] = weightedPatternSample(pool, stats, 1, rng);
    const q = oneItem(p, used, rng, content, seed + guard, history);
    if (!q) continue;
    used.add(q.id);
    used.add(q.stem);
    out.push(q);
  }
  return { questions: structureFirst(out), timeLimitMs: out.length * SECONDS_PER_QUESTION * 1000 };
}

export function buildMock(history: MockResult[], content: ContentSource = realContent) {
  const forms = content.availableMockForms();
  if (!forms.length) return null;
  const lastTaken = new Map<number, number>();
  for (const h of history) lastTaken.set(h.form, Math.max(lastTaken.get(h.form) ?? 0, h.at));
  const fresh = forms.find((f) => !lastTaken.has(f));
  const form = fresh ?? [...forms].sort((a, b) => lastTaken.get(a)! - lastTaken.get(b)!)[0];
  return { form, questions: structureFirst(content.mockForm(form)), repeat: fresh === undefined, timeLimitMs: MOCK_TIME_MS };
}

export function buildNewSet(p: PatternId | 'mixed', studied: PatternId[], seed: number, content: ContentSource = realContent, history: History = NO_HISTORY): Question[] {
  const rng = createRng(seed);
  if (p !== 'mixed') {
    return hasGenerator(p) ? generate(p, NEWSET_SIZE, seed) : shuffle(freshFirst(notMock(content.drillItems(p)), history, rng).slice(0, NEWSET_SIZE), rng);
  }
  const pool: PatternId[] = studied.length ? studied : ['P01'];
  const out: Question[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < NEWSET_SIZE && guard < NEWSET_SIZE * 20; guard++) {
    const q = oneItem(pool[Math.floor(rng() * pool.length)], used, rng, content, seed + guard, history);
    if (!q) continue;
    used.add(q.id);
    used.add(q.stem);
    out.push(q);
  }
  return out;
}
