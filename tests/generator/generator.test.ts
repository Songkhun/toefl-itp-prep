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
    expect(set.some((q) => q.type === 'written-expression' && q.options.includes('since'))).toBe(true);
  });
});
