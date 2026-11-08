import type { PatternId, Question } from '../domain/types';
import { createRng } from '../util/rng';
import type { Template } from './build';
import { P01 } from './templates/P01';
import { P02 } from './templates/P02';
import { P03 } from './templates/P03';
import { P04 } from './templates/P04';
import { P05 } from './templates/P05';
import { P06 } from './templates/P06';

const TEMPLATES: Partial<Record<PatternId, Template[]>> = { P01, P02, P03, P04, P05, P06 };

export function hasGenerator(p: PatternId): boolean {
  return !!TEMPLATES[p]?.length;
}

/** Deterministic: the same (patternId, count, seed) gives the same questions. Stems are unique within a set. */
export function generate(patternId: PatternId, count: number, seed: number): Question[] {
  const templates = TEMPLATES[patternId];
  if (!templates?.length) throw new Error(`No generator for ${patternId}`);
  const rng = createRng(seed);
  const out: Question[] = [];
  const stems = new Set<string>();
  for (let i = 0; out.length < count && i < count * 50; i++) {
    const built = templates[i % templates.length].build(rng);
    if (stems.has(built.stem)) continue;
    stems.add(built.stem);
    out.push({ ...built, id: `gen-${patternId}-${seed}-${out.length}`, source: 'generated' });
  }
  return out;
}
