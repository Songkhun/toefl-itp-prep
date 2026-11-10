import { low, strip, structure, writtenExpression, type Template } from '../build';
import { COMP, SUP, type Comp } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P11' as const;
const verb = (subj: string) => (/s\]?$/.test(subj) && !/glass|Ocean/.test(subj) ? 'are' : 'is');
const be = (f: Comp) => f.be ?? verb(f.a);
const compWhy = (f: Comp) => f.comp.startsWith('more')
  ? `Long adjectives form the comparative with "more": "${f.comp}". "Most" is for superlatives, and "than" shows this is a comparison of two things.`
  : `Short adjectives form the comparative with -er: "${f.comp}". Do not add "more" to an -er form, and a superlative ("${f.wrong[1]}") cannot be used with "than".`;

export const P11: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(COMP, rng);
      return structure(P, `${strip(f.a)} ${be(f)} ____ than ${strip(f.b)}.`, f.comp, f.wrong, compWhy(f), rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(COMP, rng);
      const a = f.proper ? strip(f.a) : low(strip(f.a));
      return structure(P, `Compared with ${strip(f.b)}, ${a} ${be(f)} ____.`, f.comp, f.wrong,
        `"Compared with" sets up a comparison of two things, so the comparative is needed. ${compWhy(f)}`, rng);
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
      const bad = choice([f.badWE, f.wrong[0], f.wrong[1]], rng);
      return writtenExpression(P, `${f.a} [${be(f)}] [!${bad}] [than] ${f.b}.`,
        `With "than", use the comparative form "${f.comp}", not "${bad}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(SUP, rng);
      const bad = choice([f.badWE, ...f.wrong.filter((w) => w !== f.badWE)], rng);
      return writtenExpression(P, `${f.a} [is] [!${bad}] ${f.noun} ${f.rest}.`,
        `Comparing one thing with a whole group needs the superlative: "${f.ok}", not "${bad}".`, rng);
    },
  },
];
