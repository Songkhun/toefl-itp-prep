import type { PatternId, Question } from '../domain/types';
import { createRng } from '../util/rng';
import type { Template } from './build';
import { P01 } from './templates/P01';
import { P02 } from './templates/P02';
import { P03 } from './templates/P03';
import { P04 } from './templates/P04';
import { P05 } from './templates/P05';
import { P06 } from './templates/P06';
import { P07 } from './templates/P07';
import { P08 } from './templates/P08';
import { P09 } from './templates/P09';
import { P10 } from './templates/P10';
import { P11 } from './templates/P11';
import { P12 } from './templates/P12';
import { P13 } from './templates/P13';
import { P14 } from './templates/P14';
import { P15 } from './templates/P15';
import { P16 } from './templates/P16';
import { P17 } from './templates/P17';
import { P20 } from './templates/P20';
import { P23 } from './templates/P23';
import { P24 } from './templates/P24';
import { P25 } from './templates/P25';

const TEMPLATES: Partial<Record<PatternId, Template[]>> = { P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16, P17, P20, P23, P24, P25 };

export function hasGenerator(p: PatternId): boolean {
  return !!TEMPLATES[p]?.length;
}

const STOP = new Set(['the', 'a', 'an', 'of', 'in', 'to', 'and', 'is', 'are', 'was', 'were', 'it', 'they', 'that', 'which', 'who']);

/** Content words of the full sentence an item shows (blank filled with the key, underlines filled in). */
export function sentenceWords(q: Question): Set<string> {
  const text = q.type === 'structure'
    ? q.stem.replace('____', q.options[q.answerIndex])
    : q.stem.replace(/\{([0-3])\}/g, (_, i: string) => q.options[+i]);
  return new Set(text.toLowerCase().match(/[a-z]+/g)?.filter((w) => !STOP.has(w)) ?? []);
}
const similarity = (a: Set<string>, b: Set<string>) => {
  const inter = [...a].filter((w) => b.has(w)).length;
  return inter / (a.size + b.size - inter);
};
export const MAX_SIMILARITY = 0.6;

/**
 * Deterministic: the same (patternId, count, seed) gives the same questions. Items in a set avoid
 * near-duplicate sentences (so one item cannot give away another); if the lexicon runs out, the
 * similarity rule is relaxed rather than returning a short set.
 */
export function generate(patternId: PatternId, count: number, seed: number): Question[] {
  const templates = TEMPLATES[patternId];
  if (!templates?.length) throw new Error(`No generator for ${patternId}`);
  const rng = createRng(seed);
  const out: Question[] = [];
  const words: Set<string>[] = [];
  const stems = new Set<string>();
  // Random starting template, so small sets (e.g. one item at a time) don't always use the first template.
  const start = Math.floor(rng() * templates.length);
  for (let i = 0; out.length < count && i < count * 200; i++) {
    const strict = i < count * 150;
    const built = templates[(start + i) % templates.length].build(rng);
    if (stems.has(built.stem)) continue;
    const w = sentenceWords(built as Question);
    if (strict && words.some((x) => similarity(x, w) >= MAX_SIMILARITY)) continue;
    stems.add(built.stem);
    words.push(w);
    out.push({ ...built, id: `gen-${patternId}-${seed}-${out.length}`, source: 'generated' });
  }
  return out;
}
