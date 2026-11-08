import type { Pattern, Question, Word } from '../domain/types';

export interface ContentSet {
  patterns: Pattern[];
  questions: Question[];
  words: Word[];
}

/** Returns a list of human-readable problems; empty means the content is valid. */
export function validateContent(c: ContentSet): string[] {
  const errors: string[] = [];
  const patternIds = new Set(c.patterns.map((p) => p.id));
  const seenQ = new Set<string>();

  for (const q of c.questions) {
    const err = (msg: string) => errors.push(`question ${q.id}: ${msg}`);
    if (seenQ.has(q.id)) err('duplicate id');
    seenQ.add(q.id);
    if (!patternIds.has(q.patternId)) err(`unknown patternId ${q.patternId}`);
    if (!Array.isArray(q.options) || q.options.length !== 4) err('must have exactly 4 options');
    else {
      if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4) err('duplicate options');
      if (q.options.some((o) => !o.trim())) err('empty option');
    }
    if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3) err('answerIndex must be 0..3');
    if (!q.explanation?.trim()) err('missing explanation');
    if (q.type === 'structure') {
      if ((q.stem.match(/____/g) ?? []).length !== 1) err('structure stem must contain exactly one "____"');
    } else if (q.type === 'written-expression') {
      for (let i = 0; i < 4; i++) {
        if ((q.stem.split(`{${i}}`).length - 1) !== 1) err(`written-expression stem must contain {${i}} exactly once`);
      }
    } else {
      err(`unknown type ${String(q.type)}`);
    }
    if (q.source === 'mock') {
      if (!Number.isInteger(q.mockForm) || q.mockForm! < 1 || q.mockForm! > 6) err('mock item needs mockForm 1..6');
    } else if (q.mockForm !== undefined) {
      err('only mock items may have mockForm');
    }
  }

  const seenW = new Set<string>();
  for (const w of c.words) {
    if (seenW.has(w.id)) errors.push(`word ${w.id}: duplicate id`);
    seenW.add(w.id);
    if (!w.headword?.trim() || !w.definition?.trim()) errors.push(`word ${w.id}: missing headword or definition`);
    if (!w.examples?.length) errors.push(`word ${w.id}: needs at least one example`);
  }
  return errors;
}
