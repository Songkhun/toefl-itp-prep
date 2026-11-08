import type { PatternId, Question } from '../domain/types';
import { realContent, type ContentSource } from '../content';
import { generate, hasGenerator } from '../generator';
import { weightedPatternSample, type PatternStats } from '../stats/patternStats';
import { createRng, pick, shuffle, type Rng } from '../util/rng';
import type { MockResult } from '../storage/store';

export const SECONDS_PER_QUESTION = 37;
export const MORNING_SIZE = 15;
export const MORNING_DRILL_FROM_BANK = 5;
export const AFTERNOON_SIZE = 20;
export const NEWSET_SIZE = 15;
export const MOCK_TIME_MS = 25 * 60_000;

const structureFirst = (qs: Question[]) =>
  [...qs.filter((q) => q.type === 'structure'), ...qs.filter((q) => q.type === 'written-expression')];
const notMock = (qs: Question[]) => qs.filter((q) => q.source !== 'mock');

export function buildMorningDrill(p: PatternId, seed: number, content: ContentSource = realContent): Question[] {
  const rng = createRng(seed);
  const bank = notMock(content.drillItems(p));
  if (!hasGenerator(p)) return pick(bank, MORNING_SIZE, rng);
  const fromBank = pick(bank, MORNING_DRILL_FROM_BANK, rng);
  const generated = generate(p, MORNING_SIZE - fromBank.length, seed);
  return shuffle([...fromBank, ...generated], rng);
}

/** One item for pattern p not already used: bank item or generated, about half each when both exist. */
function oneItem(p: PatternId, used: Set<string>, rng: Rng, content: ContentSource, seed: number): Question | null {
  const bank = notMock(content.drillItems(p)).filter((q) => !used.has(q.id));
  const tryGenerated = () => {
    if (!hasGenerator(p)) return null;
    const g = generate(p, 1, seed * 1000 + Math.floor(rng() * 1e6))[0];
    return used.has(g.stem) ? null : { ...g, id: `${g.id}-${used.size}` };
  };
  const preferBank = rng() < 0.5;
  const fromBank = bank.length ? bank[Math.floor(rng() * bank.length)] : null;
  return (preferBank ? fromBank ?? tryGenerated() : tryGenerated() ?? fromBank) ?? null;
}

export function buildAfternoonSet(studied: PatternId[], stats: PatternStats, seed: number, content: ContentSource = realContent) {
  const rng = createRng(seed);
  const pool: PatternId[] = studied.length ? studied : ['P01'];
  const out: Question[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < AFTERNOON_SIZE && guard < AFTERNOON_SIZE * 20; guard++) {
    const [p] = weightedPatternSample(pool, stats, 1, rng);
    const q = oneItem(p, used, rng, content, seed + guard);
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

export function buildNewSet(p: PatternId | 'mixed', studied: PatternId[], seed: number, content: ContentSource = realContent): Question[] {
  const rng = createRng(seed);
  if (p !== 'mixed') {
    return hasGenerator(p) ? generate(p, NEWSET_SIZE, seed) : shuffle(notMock(content.drillItems(p)), rng).slice(0, NEWSET_SIZE);
  }
  const pool: PatternId[] = studied.length ? studied : ['P01'];
  const out: Question[] = [];
  const used = new Set<string>();
  for (let guard = 0; out.length < NEWSET_SIZE && guard < NEWSET_SIZE * 20; guard++) {
    const q = oneItem(pool[Math.floor(rng() * pool.length)], used, rng, content, seed + guard);
    if (!q) continue;
    used.add(q.id);
    used.add(q.stem);
    out.push(q);
  }
  return out;
}
