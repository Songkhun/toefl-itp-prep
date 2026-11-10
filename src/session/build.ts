import type { PatternId, Question } from '../domain/types';
import { realContent, type ContentSource } from '../content';
import { generate, hasGenerator, MAX_SIMILARITY, sentenceWords, similarity } from '../generator';
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

export interface BuiltMock { form: number; questions: Question[]; repeat: boolean; generated: boolean; timeLimitMs: number }

/**
 * Fixed forms are used first, in order. Once every fixed form has been taken, each new mock is generated:
 * it copies the pattern/type layout of a fixed form, replacing every item with a fresh generated question,
 * so the score is not inflated by remembering answers. Falls back to repeating the least recent fixed form
 * only if some pattern in the layout has no generator.
 */
export function buildMock(history: MockResult[], content: ContentSource = realContent): BuiltMock | null {
  const forms = content.availableMockForms();
  if (!forms.length) return null;
  const lastTaken = new Map<number, number>();
  for (const h of history) lastTaken.set(h.form, Math.max(lastTaken.get(h.form) ?? 0, h.at));
  const fresh = forms.find((f) => !lastTaken.has(f));
  if (fresh !== undefined) return { form: fresh, questions: structureFirst(content.mockForm(fresh)), repeat: false, generated: false, timeLimitMs: MOCK_TIME_MS };
  const next = Math.max(...forms, ...history.map((h) => h.form)) + 1;
  // Rebuild the earlier generated forms (deterministic) so this one avoids all of their questions.
  const avoid = new Set<string>();
  let generated: Question[] | null = null;
  for (let n = Math.max(...forms) + 1; n <= next; n++) {
    generated = generatedMock(content.mockForm(forms[(n - 1) % forms.length]), n, avoid);
    if (!generated) break;
    for (const q of generated) avoid.add(questionText(q));
  }
  if (generated) return { form: next, questions: structureFirst(generated), repeat: false, generated: true, timeLimitMs: MOCK_TIME_MS };
  const form = [...forms].sort((a, b) => lastTaken.get(a)! - lastTaken.get(b)!)[0];
  return { form, questions: structureFirst(content.mockForm(form)), repeat: true, generated: false, timeLimitMs: MOCK_TIME_MS };
}

/** The sentence as the learner sees it: Written Expression stems hide the underlined words behind {0}…{3}. */
export const questionText = (q: Question) =>
  q.type === 'structure' ? q.stem : q.stem.replace(/\{(\d)\}/g, (_, i: string) => q.options[Number(i)]);

/**
 * One generated question per layout item, same pattern and type, with no repeated stems and none of the
 * stems in `avoid` (questions from earlier generated forms) unless a pattern's pool runs out.
 * Null if a pattern has no generator.
 */
export function generatedMock(layout: Question[], form: number, avoid: ReadonlySet<string> = new Set()): Question[] | null {
  if (!layout.length || layout.some((q) => !hasGenerator(q.patternId))) return null;
  const used = new Set<string>();
  const words: Set<string>[] = [];
  const out: Question[] = [];
  layout.forEach((item, i) => {
    for (let k = 0; k < 80; k++) {
      // Strict: not in an earlier generated form and not a near-copy of another item in this form (one could give away the other).
      const strict = k < 60;
      const q = generate(item.patternId, 4, form * 100_003 + i * 997 + k).find((g) => g.type === item.type && !used.has(questionText(g)) && !used.has(g.id)
        && !(strict && (avoid.has(questionText(g)) || words.some((w) => similarity(w, sentenceWords(g)) >= MAX_SIMILARITY))));
      if (!q) continue;
      used.add(questionText(q));
      used.add(q.id);
      words.push(sentenceWords(q));
      out.push(q);
      return;
    }
  });
  return out.length === layout.length ? out : null;
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
