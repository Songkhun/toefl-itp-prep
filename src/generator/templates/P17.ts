import { strip, structure, writtenExpression, type Template } from '../build';
import { ONE_OF, QUANT, UNCOUNT } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P17' as const;
const article = (w: string) => (/^[aeiou]/.test(w) ? 'an' : 'a');

export const P17: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(ONE_OF, rng);
      return structure(P, `${strip(f.pre)} ____ ${strip(f.post)}.`, f.pl, [f.sg, `a ${f.sg}`, `${f.sg}'s`],
        `"One of the ..." is always followed by a plural noun: "one of the ... ${f.pl}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(QUANT, rng);
      return structure(P, `${f.q} ____ ${strip(f.rest)}.`, f.pl, [f.sg, `${f.sg}'s`, `the ${f.sg}`],
        `"${f.q}" is used with a plural countable noun: "${f.q.toLowerCase()} ${f.pl}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(UNCOUNT, rng);
      return structure(P, `${strip(f.pre)} ____ ${strip(f.post)}.`, f.noun, [`${f.noun}s`, `${article(f.noun)} ${f.noun}`, `many ${f.noun}s`],
        `"${f.noun[0].toUpperCase()}${f.noun.slice(1)}" is an uncountable noun: it has no plural form and is not used with "a/an" or "many".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(ONE_OF, rng);
      return writtenExpression(P, `${f.pre} [!${f.sg}] ${f.post}.`,
        `After "one of the", use a plural noun: "${f.pl}", not "${f.sg}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(QUANT, rng);
      return writtenExpression(P, `${f.q} [!${f.sg}] ${f.rest}.`,
        `"${f.q}" needs a plural noun: "${f.pl}", not "${f.sg}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(UNCOUNT, rng);
      return writtenExpression(P, `${f.pre} [!${f.noun}s] ${f.post}.`,
        `"${f.noun[0].toUpperCase()}${f.noun.slice(1)}" is uncountable, so it has no plural: write "${f.noun}", not "${f.noun}s".`, rng);
    },
  },
];
