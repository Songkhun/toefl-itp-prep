import { writeFileSync } from 'node:fs';
import { generate, hasGenerator } from '../../src/generator';
import { validateContent } from '../../src/content/validate';
import { PATTERNS } from '../../src/content/patterns';
import type { PatternId, Question } from '../../src/domain/types';

const RELEASE1: PatternId[] = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06'];

describe('generator', () => {
  for (const p of RELEASE1) {
    describe(p, () => {
      it('has a generator', () => expect(hasGenerator(p)).toBe(true));

      const all: Question[] = [];
      for (let seed = 1; seed <= 200; seed++) all.push(...generate(p, 6, seed));

      it('produces valid content', () => {
        expect(validateContent({ patterns: PATTERNS, questions: all.map((q, i) => ({ ...q, id: `${q.id}-${i}` })), words: [] })).toEqual([]);
      });
      it('has no leftover slot tokens or brackets', () => {
        for (const q of all) {
          const s = q.stem.replace(/\{[0-3]\}/g, '');
          expect(s).not.toMatch(/[{}[\]]/);
          for (const o of q.options) expect(o).not.toMatch(/[{}[\]]/);
        }
      });
      it('produces both structure and written-expression items', () => {
        expect(new Set(all.map((q) => q.type))).toEqual(new Set(['structure', 'written-expression']));
      });
      it('ids, source and pattern are set', () => {
        const q = generate(p, 3, 9)[2];
        expect(q.id).toBe(`gen-${p}-9-2`);
        expect(q.source).toBe('generated');
        expect(q.patternId).toBe(p);
      });
      it('does not repeat a stem within one set', () => {
        const set = generate(p, 10, 5);
        expect(new Set(set.map((q) => q.stem)).size).toBe(10);
      });
    });
  }

  it('same seed produces the same output', () => {
    expect(generate('P02', 8, 77)).toEqual(generate('P02', 8, 77));
  });
  it('throws for patterns without a generator', () => {
    expect(hasGenerator('P18')).toBe(false);
    expect(() => generate('P18', 3, 1)).toThrow();
  });

  it('writes a sample file for human review', () => {
    const render = (q: Question) => {
      const stem = q.type === 'structure' ? q.stem : q.stem.replace(/\{([0-3])\}/g, (_, i) => `_${'ABCD'[+i]}:${q.options[+i]}_`);
      const opts = q.type === 'structure' ? q.options.map((o, i) => `   ${'ABCD'[i]}) ${o}`).join('\n') + '\n' : '';
      return `[${q.patternId} ${q.type}] ${stem}\n${opts}   ANSWER: ${'ABCD'[q.answerIndex]}  — ${q.explanation}\n`;
    };
    const out = RELEASE1.map((p) => generate(p, 20, 1234).map(render).join('\n')).join('\n');
    writeFileSync('tests/generator/__samples__.txt', out);
  });
});

describe('template rotation', () => {
  it('uses every template in a set (P03 includes a "since" structure item)', () => {
    const set = generate('P03', 8, 1);
    expect(set.some((q) => q.type === 'structure' && q.stem.includes('since'))).toBe(true);
    expect(set.some((q) => q.type === 'written-expression' && q.stem.includes('since'))).toBe(true);
  });
});

describe('quality fixes from item review', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();

  it('tense items never underline the time expression that triggers the tense', () => {
    for (const p of ['P03', 'P04'] as PatternId[]) {
      for (const q of many(p).filter((x) => x.type === 'written-expression')) {
        for (const o of q.options) expect(o).not.toMatch(/\b(since|ago|last|\d{4})\b/i);
      }
    }
  });
  it('explanations agree with plural subjects', () => {
    for (const p of ['P04', 'P05'] as PatternId[]) {
      for (const q of many(p)) {
        expect(q.explanation).not.toMatch(/s" (receives|refers)\b/);
        expect(q.explanation).not.toMatch(/\b(products|crops) belongs\b/);
      }
    }
  });
  it('intransitive-capable verbs are not used for passives', () => {
    for (const q of many('P04')) expect(q.stem + q.options.join(' ')).not.toMatch(/\bsold\b|\bselling\b/);
  });
  it('written-expression answer position varies within each pattern', () => {
    for (const p of RELEASE1) {
      const keys = new Set(many(p).filter((q) => q.type === 'written-expression').map((q) => q.answerIndex));
      expect(keys.size, p).toBeGreaterThanOrEqual(2);
    }
  });
  it('no malformed "is the river begin" distractor', () => {
    for (const q of many('P06')) expect(q.options.join('|')).not.toMatch(/is the river begin/);
  });
});

import { sentenceWords } from '../../src/generator';
describe('near-duplicate control', () => {
  it('no two items in a 10-item set share most of their words (one could give away the other)', () => {
    for (const p of RELEASE1) {
      for (let seed = 1; seed <= 30; seed++) {
        const set = generate(p, 10, seed).map(sentenceWords);
        for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) {
          const inter = [...set[i]].filter((w) => set[j].has(w)).length;
          const jac = inter / (set[i].size + set[j].size - inter);
          expect(jac, `${p} seed ${seed}`).toBeLessThan(0.6);
        }
      }
    }
  });
});

describe('capitalization', () => {
  it('the word after an introductory comma is lowercase (unless a proper noun)', () => {
    for (const p of RELEASE1) {
      for (let seed = 1; seed <= 100; seed++) {
        for (const q of generate(p, 6, seed)) {
          const text = q.type === 'structure' ? q.stem.replace('____', q.options[q.answerIndex]) : q.stem.replace(/\{([0-3])\}/g, (_, i) => q.options[+i]);
          expect(text, text).not.toMatch(/, (?!London|Asia|Monet|Germany|Spain)[A-Z]/);
        }
      }
    }
  });
});
