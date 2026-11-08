import { strip, structure, writtenExpression, type Template } from '../build';
import { AFTER_PREP, GERUND_AFTER, INFINITIVE_AFTER } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P14' as const;
const head = (verb: string) => verb.split(' ').pop()!;

export const P14: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(GERUND_AFTER, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${strip(f.rest)}.`, c.ing, [`to ${c.base}`, c.base, c.pp],
        `The verb "${head(f.verb)}" is followed by a gerund (-ing form), not an infinitive: "${f.verb} ${c.ing}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(INFINITIVE_AFTER, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${strip(f.rest)}.`, `to ${c.base}`, [c.ing, c.base, c.pp],
        `The verb "${head(f.verb)}" is followed by an infinitive (to + base verb): "${f.verb} to ${c.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(AFTER_PREP, rng);
      const c = f.comp;
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${strip(f.rest)}.`, c.ing, [`to ${c.base}`, c.base, c.pp],
        `A verb that follows a preposition such as "${head(f.verb)}" must be a gerund (-ing form): "${head(f.verb)} ${c.ing}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(GERUND_AFTER, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!to ${f.comp.base}] ${f.rest}.`,
        `"${head(f.verb)}" takes a gerund, not an infinitive: "${f.verb} ${f.comp.ing}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(INFINITIVE_AFTER, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!${f.comp.ing}] ${f.rest}.`,
        `"${head(f.verb)}" takes an infinitive, not a gerund: "${f.verb} to ${f.comp.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(AFTER_PREP, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!to ${f.comp.base}] ${f.rest}.`,
        `After the preposition "${head(f.verb)}", use a gerund: "${head(f.verb)} ${f.comp.ing}", not "to ${f.comp.base}".`, rng);
    },
  },
];
