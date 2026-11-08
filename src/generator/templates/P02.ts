import { low, strip, structure, writtenExpression, type Template } from '../build';
import { AGREEMENT_FACTS } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P02' as const;
const EACH = [
  { noun: 'students', ok: 'has', bad: 'have', ing: 'having', rest: 'a [locker] in the main hall' },
  { noun: 'paintings', ok: 'was', bad: 'were', ing: 'being', rest: 'restored [before] the exhibition' },
  { noun: 'cities', ok: 'is', bad: 'are', ing: 'being', rest: 'connected by a fast [railway]' },
  { noun: 'volunteers', ok: 'receives', bad: 'receive', ing: 'receiving', rest: 'a [certificate] at the end' },
];
const pick = (rng: Rng) => choice(AGREEMENT_FACTS, rng);
const why = (head: string, plural: boolean, dist: string, ok: string) =>
  `The subject is "${low(strip(head))}" (${plural ? 'plural' : 'singular'}), not "${strip(dist)}". The phrase in between does not change the subject, so the verb must be "${ok}".`;

export const P02: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = pick(rng);
      return structure(P, `${strip(f.head)} ${strip(f.dist)} ____ ${strip(f.rest)}.`, f.ok, [f.bad, ...f.other], why(f.head, f.plural, f.dist, f.ok), rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const e = choice(EACH, rng);
      return structure(P, `Each of the ${e.noun} ____ ${strip(e.rest)}.`, e.ok, [e.bad, e.ing, `they ${e.bad}`],
        `"Each" is the real subject and it is singular, so the verb is "${e.ok}". "Of the ${e.noun}" does not change that.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = pick(rng);
      return writtenExpression(P, `${f.head} ${f.dist} [!${f.bad}] ${f.rest}.`, why(f.head, f.plural, f.dist, f.ok));
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const e = choice(EACH, rng);
      return writtenExpression(P, `[Each] of the [${e.noun}] [!${e.bad}] ${e.rest}.`,
        `"Each" is singular, so the verb must be "${e.ok}", not "${e.bad}".`);
    },
  },
];
