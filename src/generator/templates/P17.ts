import { cap, low, strip, structure, writtenExpression, type Template } from '../build';
import { ONE_OF, QUANT, UNCOUNT, type Quant } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P17' as const;
const article = (w: string) => (/^[aeiou]/.test(w) ? 'an' : 'a');
const start = (f: Quant) => (f.lead ? `${f.lead} ${low(f.q)}` : f.q);
const quantRule = (f: Quant) => `With a countable noun, "${low(f.q)}" requires the plural form: "${low(f.q)} ${f.pl}"`;

export const P17: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(ONE_OF, rng);
      return structure(P, `${strip(f.subj)} ${f.verb} one of the ____ ${strip(f.post)}.`,
        `${f.adj} ${f.pl}`, [`${f.adj} ${f.sg}`, `${f.adj} ${f.sg}'s`, `most ${f.adj} ${f.pl}`],
        `"One of the" is always followed by a plural noun, and a superlative that already ends in -est does not take "most": "one of the ${f.adj} ${f.pl}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(QUANT, rng);
      return structure(P, `${strip(start(f))} ____ ${strip(f.rest)}.`, f.pl, [f.sg, `${f.sg}'s`, `kind of ${f.sg}`],
        `${quantRule(f)}.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(UNCOUNT, rng);
      return structure(P, `${strip(f.pre)} ____ ${strip(f.post)}.`,
        `${f.det} ${f.noun}`, [`${f.det} ${f.noun}s`, `many ${f.noun}s`, `${article(f.noun)} ${f.noun}`],
        `"${cap(f.noun)}" is an uncountable noun: it has no plural form and is not used with "a/an" or "many": "${f.det} ${f.noun}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(ONE_OF, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] one of the [${f.adj}] [!${f.sg}] ${f.post}.`,
        `After "one of the", use a plural noun: "${f.pl}", not "${f.sg}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(QUANT, rng);
      return writtenExpression(P, `${start(f)} [!${f.sg}] ${f.rest}.`, `${quantRule(f)}, not "${f.sg}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(UNCOUNT, rng);
      return writtenExpression(P, `${f.pre} ${f.det} [!${f.noun}s] ${f.post}.`,
        `"${cap(f.noun)}" is uncountable, so it has no plural: write "${f.noun}", not "${f.noun}s".`, rng);
    },
  },
];
