import type { PatternId, Question } from '../domain/types';
import { shuffle, type Rng } from '../util/rng';

export type Built = Omit<Question, 'id' | 'source'>;
export interface Template {
  patternId: PatternId;
  type: Question['type'];
  build(rng: Rng): Built;
}

/** Remove [underline] markers, keeping the text. */
export const strip = (s: string) => s.replace(/\[!?([^\]]*)\]/g, '$1');
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

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
 * Written-expression item from a sentence with exactly four [underlined] spans,
 * one of which is the error, written [!like this].
 */
export function writtenExpression(patternId: PatternId, sentence: string, explanation: string): Built {
  const spans: string[] = [];
  let answer = -1;
  const stem = sentence.replace(/\[(!?)([^\]]*)\]/g, (_, bang: string, text: string) => {
    if (bang) answer = spans.length;
    spans.push(text);
    return `{${spans.length - 1}}`;
  });
  if (spans.length !== 4 || answer < 0) throw new Error(`template must have 4 spans and one error: ${sentence}`);
  return { patternId, type: 'written-expression', stem, options: spans as Question['options'], answerIndex: answer as Question['answerIndex'], explanation };
}

export interface Verb { base: string; s: string; past: string; pp: string; ing: string }
export const V = (base: string, s: string, past: string, pp: string, ing: string): Verb => ({ base, s, past, pp, ing });
