import { strip, structure, writtenExpression, type Template } from '../build';
import { COMP, SUP } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P11' as const;
const verb = (subj: string) => (/s\]?$/.test(subj) && !/glass|Ocean/.test(subj) ? 'are' : 'is');

export const P11: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(COMP, rng);
      return structure(P, `${strip(f.a)} ${verb(f.a)} ____ than ${strip(f.b)}.`, f.comp, f.wrong,
        f.comp.startsWith('more')
          ? `Long adjectives form the comparative with "more": "${f.comp}". "Most" is for superlatives, and "than" shows this is a comparison of two things.`
          : `Short adjectives form the comparative with -er: "${f.comp}". Do not add "more" to an -er form, and a superlative ("${f.wrong[1]}") cannot be used with "than".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(SUP, rng);
      return structure(P, `${strip(f.a)} is ____ ${f.noun} ${strip(f.rest)}.`, f.ok, f.wrong,
        `When one thing is compared with all others in a group, use the superlative with "the": "${f.ok}". The comparative ("${f.wrong[1]}") compares only two things.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(COMP, rng);
      return writtenExpression(P, `${f.a} [${verb(f.a)}] [!${f.badWE}] [than] ${f.b}.`,
        `With "than", use the comparative form "${f.comp}", not "${f.badWE}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(SUP, rng);
      return writtenExpression(P, `${f.a} [is] [!${f.badWE}] ${f.noun} ${f.rest}.`,
        `Comparing one thing with a whole group needs the superlative: "${f.ok}", not "${f.badWE}".`, rng);
    },
  },
];
