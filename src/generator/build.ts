import type { PatternId, Question } from '../domain/types';
import { pick, shuffle, type Rng } from '../util/rng';

export type Built = Omit<Question, 'id' | 'source'>;
export interface Template {
  patternId: PatternId;
  type: Question['type'];
  build(rng: Rng): Built;
}

/** Remove [underline] markers, keeping the text. */
export const strip = (s: string) => s.replace(/\[!?([^\]]*)\]/g, '$1');
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const low = (s: string) => s.replace(/^(\[?)(.)/, (_, b: string, c: string) => b + c.toLowerCase());

/** Structure item: stem has one "____"; options shuffled; answer tracked. */
export function structure(patternId: PatternId, stem: string, correct: string, wrong: [string, string, string], explanation: string, rng: Rng): Built {
  const opts = shuffle([correct, ...wrong], rng);
  return {
    patternId,
    type: 'structure',
    stem: strip(stem),
    options: opts.map(strip) as Question['options'],
    answerIndex: opts.indexOf(correct) as Question['answerIndex'],
    explanation,
  };
}

/**
 * Written-expression item. The sentence marks the error as [!error] and any number (>= 3) of correct
 * underline candidates as [text]. Exactly three candidates are kept, chosen so that the error's position
 * (A–D) varies; the rest are shown as plain text.
 */
export function writtenExpression(patternId: PatternId, sentence: string, explanation: string, rng: Rng): Built {
  const tokens = [...sentence.matchAll(/\[(!?)([^\]]*)\]/g)].map((m) => ({ err: m[1] === '!', text: m[2] }));
  const errAt = tokens.findIndex((t) => t.err);
  if (errAt < 0 || tokens.filter((t) => t.err).length !== 1) throw new Error(`template needs exactly one error: ${sentence}`);
  const before = tokens.slice(0, errAt).map((_, i) => i);
  const after = tokens.slice(errAt + 1).map((_, i) => errAt + 1 + i);
  if (before.length + after.length < 3) throw new Error(`template needs >= 3 candidates: ${sentence}`);
  const lo = Math.max(0, 3 - after.length);
  const hi = Math.min(3, before.length);
  const k = lo + Math.floor(rng() * (hi - lo + 1));
  const keep = new Set([...pick(before, k, rng), ...pick(after, 3 - k, rng), errAt]);
  const spans: string[] = [];
  let answer = -1;
  let idx = 0;
  const stem = sentence.replace(/\[(!?)([^\]]*)\]/g, (_, bang: string, text: string) => {
    const i = idx++;
    if (!keep.has(i)) return text;
    if (bang) answer = spans.length;
    spans.push(text);
    return `{${spans.length - 1}}`;
  });
  return { patternId, type: 'written-expression', stem, options: spans as Question['options'], answerIndex: answer as Question['answerIndex'], explanation };
}

export interface Verb { base: string; s: string; past: string; pp: string; ing: string }
export const V = (base: string, s: string, past: string, pp: string, ing: string): Verb => ({ base, s, past, pp, ing });
