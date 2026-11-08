import { strip, structure, writtenExpression, type Template } from '../build';
import { SUBJUNCTIVE } from '../lexicon4';
import { choice } from '../../util/rng';

const P = 'P25' as const;
const RULE = 'After verbs and expressions of necessity or recommendation such as "recommend", "require", "demand" and "it is essential that", the verb in the that-clause is in the base form for every subject';

export const P25: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(SUBJUNCTIVE, rng);
      const v = f.verb;
      return structure(P, `${strip(f.trigger)} ${strip(f.subj)} ____ ${strip(f.rest)}.`, v.base, [v.s, `to ${v.base}`, v.ing],
        `${RULE}: "${strip(f.subj)} ${v.base}", not "${v.s}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(SUBJUNCTIVE, rng);
      return writtenExpression(P, `${f.trigger} ${f.subj} [!${f.verb.s}] ${f.rest}.`,
        `${RULE}: "${f.verb.base}", not "${f.verb.s}".`, rng);
    },
  },
];
