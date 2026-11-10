import { writeFileSync } from 'node:fs';
import { generate, hasGenerator } from '../../src/generator';
import { validateContent } from '../../src/content/validate';
import { PATTERNS } from '../../src/content/patterns';
import type { PatternId, Question } from '../../src/domain/types';

const RELEASE1: PatternId[] = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P20', 'P23', 'P24', 'P25'];

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
          expect(text, text).not.toMatch(/, (?!London|Asia|Antarctica|Monet|Germany|Spain|Venus|Mercury|Marie|Jupiter|Charles|Mount|Isaac|Saturn|Leonardo)[A-Z]/);
        }
      }
    }
  });
});

describe('batch-2 review fixes', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();
  it('every explanation starts with a capital letter or a quote', () => {
    for (const p of RELEASE1) for (const q of many(p)) expect(q.explanation, q.explanation).toMatch(/^["A-Z]/);
  });
  it('appositive explanations never suggest "which" for a person', () => {
    for (const q of many('P09')) {
      if (/^\{?\d?\}?\s?(Marie|Charles|Isaac|Leonardo)/.test(q.stem) || /(Curie|Darwin|Newton|Vinci)/.test(q.stem + q.options.join(' '))) {
        expect(q.explanation).not.toMatch(/write "which/);
      }
    }
  });
  it('no defensible distractors flagged in review', () => {
    for (const q of [...many('P11'), ...many('P10')]) {
      if (q.type === 'structure') expect(q.options).not.toContain('more rare');
      if (q.type === 'structure') expect(q.options).not.toContain('being honest');
    }
  });
  it('"Found" (a real participle of "find") is never the error word', () => {
    for (const q of many('P08')) expect(q.options).not.toContain('Found');
  });
});

describe('batch-3 generator guards', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();
  const full = (q: Question) => q.type === 'structure' ? q.stem.replace('____', q.options[q.answerIndex]) : q.stem.replace(/\{([0-3])\}/g, (_, i) => q.options[+i]);
  it('P13 never offers "will" as a wrong answer in a past-tense if-sentence (it can be an open condition)', () => {
    for (const q of many('P13')) if (q.type === 'structure' && /^If \S+ \S+ \w+ed\b/.test(q.stem)) expect(q.options.join('|')).not.toMatch(/\bwill \w+$/);
  });
  it('P13 wish items never test "was/were" (both are heard)', () => {
    for (const q of many('P13')) if (/\bwish/.test(q.stem)) expect(q.options.join('|')).not.toMatch(/\b(was|were)\b/);
  });
  it('P14 never uses verbs that take both a gerund and an infinitive', () => {
    for (const q of many('P14')) expect(full(q)).not.toMatch(/\b(begin|began|begun|start|started|continue|continued|like|liked|love|loved|prefer|preferred|hate|hated|intend|intended|try|tried|remember|forget|stop|stopped|help|helped)\b/);
  });
  it('P15 modal items never put "to" between a modal and its verb in the key', () => {
    for (const q of many('P15')) expect(full(q)).not.toMatch(/\b(must|should|can|could|may|might|will|would) to\b/);
  });
  it('P16 avoids collective nouns where "their" is also acceptable', () => {
    for (const q of many('P16')) expect(full(q)).not.toMatch(/\b(company|team|government|committee|family|council|museum|university)\b/i);
  });
  it('P17 never offers a plural that some writers accept', () => {
    for (const q of many('P17')) expect(q.options.join('|')).not.toMatch(/\b(evidences|researches|knowledges|data|criteria|phenomena)\b/);
  });
  it('written-expression keys use at least three of the four positions', () => {
    for (const p of ['P13', 'P14', 'P15', 'P16', 'P17'] as PatternId[]) {
      const keys = new Set(many(p).filter((q) => q.type === 'written-expression').map((q) => q.answerIndex));
      expect(keys.size, p).toBeGreaterThanOrEqual(3);
    }
  });
  it('every batch-3 pattern can fill a 10-item set without near-duplicates', () => {
    for (const p of ['P13', 'P14', 'P15', 'P16', 'P17'] as PatternId[]) expect(generate(p, 10, 3)).toHaveLength(10);
  });
});

describe('batch-3 review fixes', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();
  const we = (p: PatternId) => many(p).filter((q) => q.type === 'written-expression');
  it('no false "oak trees lose their leaves" fact; mammals fact is not understated', () => {
    for (const q of many('P16')) expect(q.stem).not.toMatch(/oak|Most mammals/);
  });
  it('P15 explanations quote the modal', () => {
    for (const q of many('P15')) expect(q.explanation).not.toMatch(/^(Must|Should|Can|May|Could|Might) is/);
  });
  it('P14 explanations quote the base verb, not an inflected form', () => {
    for (const q of many('P14')) expect(q.explanation).not.toMatch(/^The verb "\w+(ed|s)"/);
  });
  it('P17 distractors do not clash with a determiner already in the stem', () => {
    for (const q of many('P17')) if (q.type === 'structure') {
      expect(q.stem).not.toMatch(/(great deal of|some new|some useful|the old|amount of|one of the \w+|most \w+) ____/);
      expect(q.options.join('|')).not.toMatch(/(^|\|)the /);
    }
  });
  it('P17 "All" explanation does not claim "all" only takes plural nouns', () => {
    for (const q of many('P17')) expect(q.explanation).not.toMatch(/"All" (is used with|needs) a plural/);
  });
  it('the error position varies for the P17 quantifier, one-of and uncountable templates and P13 wishes', () => {
    const groups: [PatternId, RegExp][] = [['P17', /\b(Several|A number of|Few|Both|All)\b/i], ['P17', /one of the/], ['P17', /information|equipment|advice|furniture|luggage/], ['P13', /wish/]];
    for (const [p, re] of groups) {
      const keys = new Set(we(p).filter((q) => re.test(q.stem + q.options.join(' '))).map((q) => q.answerIndex));
      expect(keys.size, String(re)).toBeGreaterThanOrEqual(2);
    }
  });
  it('P13 hospital sentence uses natural wording', () => {
    for (const q of many('P13')) expect(q.stem + q.options.join(' ')).not.toMatch(/wait(ed)? less/);
  });
});

describe('batch-4 generator guards', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();
  const full = (q: Question) => q.type === 'structure' ? q.stem.replace('____', q.options[q.answerIndex]) : q.stem.replace(/\{([0-3])\}/g, (_, i) => q.options[+i]);
  it('P20 avoids linking-or-action verbs (grow, turn, go) and flat adverbs', () => {
    for (const q of many('P20')) {
      expect(full(q)).not.toMatch(/\b(grow|grew|turn|turned|go|went|get|got)\b/);
      expect(q.options.join('|')).not.toMatch(/\b(slow|quick|loud|fast|hard|late|early|daily|deep|wide)\b/);
    }
  });
  it('P23 never offers plain "but" as wrong after "not only" (it is acceptable)', () => {
    for (const q of many('P23')) if (/not only/.test(q.stem + q.options.join(' '))) expect(q.options).not.toContain('but');
  });
  it('P24 never tests "help" (bare and to-infinitive are both correct)', () => {
    for (const q of many('P24')) expect(full(q)).not.toMatch(/\bhelp/);
  });
  it('P25 never offers "should + verb" (also correct) and avoids insist/suggest (they also take a factual clause)', () => {
    for (const q of many('P25')) {
      expect(q.options.join('|')).not.toMatch(/\bshould\b/);
      expect(q.stem).not.toMatch(/\b(insist|suggest)/);
    }
  });
  it('written-expression keys use at least three positions; 10-item sets fill', () => {
    for (const p of ['P20', 'P23', 'P24', 'P25'] as PatternId[]) {
      const keys = new Set(many(p).filter((q) => q.type === 'written-expression').map((q) => q.answerIndex));
      expect(keys.size, p).toBeGreaterThanOrEqual(3);
      expect(generate(p, 10, 3), p).toHaveLength(10);
    }
  });
});

describe('batch-4 review fixes', () => {
  const many = (p: PatternId) => Array.from({ length: 150 }, (_, s) => generate(p, 6, s + 1)).flat();
  const all = (q: Question) => q.stem + ' ' + q.options.join(' ');
  it('P20: no adverb between a verb and its object; explanation says "modifies the verb"', () => {
    for (const q of many('P20')) {
      expect(all(q)).not.toMatch(/answered \S+ \S* ?every|every question/);
      expect(q.explanation).not.toMatch(/how the action/);
    }
  });
  it('P23: the first word of the pair is never underlined (changing it would also fix the sentence)', () => {
    for (const q of many('P23')) if (q.type === 'written-expression') for (const o of q.options) expect(['both', 'either', 'neither', 'not only']).not.toContain(o);
  });
  it('P23: no contestable "as well as" distractor; honeybees, not all bees, make honey', () => {
    for (const q of many('P23')) { expect(q.options).not.toContain('as well as'); expect(all(q)).not.toMatch(/\bBees\b/); }
  });
  it('P24: no "had + person" entries that read as possession; rangers do not let visitors feed ducks', () => {
    for (const q of many('P24')) expect(all(q)).not.toMatch(/an assistant|the nurse|rangers/);
  });
  it('P25: no triggers that also take a factual clause or are uncommon', () => {
    for (const q of many('P25')) expect(q.stem).not.toMatch(/stipulates|important|urged/);
  });
});
