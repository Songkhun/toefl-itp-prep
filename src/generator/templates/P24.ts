import { strip, structure, writtenExpression, type Template } from '../build';
import { CAUS_BASE, CAUS_GET, CAUS_PASSIVE } from '../lexicon4';
import { choice } from '../../util/rng';

const P = 'P24' as const;
const lemma = (v: string) => ({ made: 'make', let: 'let', had: 'have', got: 'get' } as Record<string, string>)[v];

export const P24: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUS_BASE, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ${strip(f.obj)} ____ ${strip(f.rest)}.`, c.base, [`to ${c.base}`, c.past, c.s],
        `After "${lemma(f.verb)}" + person, use the base form of the verb without "to": "${f.verb} ${strip(f.obj)} ${c.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUS_GET, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ${strip(f.obj)} ____ ${strip(f.rest)}.`, `to ${c.base}`, [c.base, c.past, c.s],
        `Unlike "make", "let" and "have", the verb "get" + person takes an infinitive with "to": "got ${strip(f.obj)} to ${c.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUS_PASSIVE, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ${strip(f.obj)} ____ ${strip(f.rest)}.`, c.pp, [c.base, c.ing, `have ${c.pp}`],
        `When someone else does the action to a thing, use "have" + thing + past participle: "had ${strip(f.obj)} ${c.pp}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(CAUS_BASE, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] ${f.obj} [!to ${f.comp.base}] ${f.rest}.`,
        `"${lemma(f.verb)[0].toUpperCase()}${lemma(f.verb).slice(1)}" + person is followed by the base form, without "to": "${f.verb} ... ${f.comp.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(CAUS_GET, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] ${f.obj} [!${f.comp.base}] ${f.rest}.`,
        `"Get" + person takes an infinitive with "to": "got ... to ${f.comp.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(CAUS_PASSIVE, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] ${f.obj} [!${f.comp.base}] ${f.rest}.`,
        `The ${strip(f.obj).split(' ').pop()} cannot do the action itself, so use "have" + thing + past participle: "had ... ${f.comp.pp}".`, rng);
    },
  },
];
