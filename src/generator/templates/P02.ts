import { low, strip, structure, writtenExpression, type Template } from '../build';
import { AGREEMENT_FACTS, REPORT_FRONTS, type AgreementFact } from '../lexicon';
import { choice } from '../../util/rng';

const P = 'P02' as const;
const EACH = [
  { noun: 'students', ok: 'has', bad: 'have', ing: 'having', rest: 'a [locker] [in] the main hall' },
  { noun: 'paintings', ok: 'was', bad: 'were', ing: 'being', rest: 'carefully [restored] [before] the exhibition' },
  { noun: 'cities', ok: 'is', bad: 'are', ing: 'being', rest: 'connected [to] the capital [by] a fast railway' },
  { noun: 'volunteers', ok: 'receives', bad: 'receive', ing: 'receiving', rest: 'a [certificate] at the end [of] the program' },
];
const why = (f: AgreementFact) =>
  `The subject is "${low(strip(f.head))}" (${f.plural ? 'plural' : 'singular'}). "${f.distNoun}" is inside the phrase "${strip(f.dist)}" and does not change the subject, so the verb must be "${f.ok}".`;

export const P02: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(AGREEMENT_FACTS, rng);
      return structure(P, `${strip(f.head)} ${strip(f.dist)} ____ ${strip(f.rest)}.`, f.ok, [f.bad, ...f.other], why(f), rng);
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
      const f = choice(AGREEMENT_FACTS, rng);
      const lead = rng() < 0.4 ? `${choice(REPORT_FRONTS, rng)} ${low(f.head)}` : f.head;
      return writtenExpression(P, `${lead} ${f.dist} [!${f.bad}] ${f.rest}.`, why(f), rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const e = choice(EACH, rng);
      return writtenExpression(P, `[Each] of the [${e.noun}] [!${e.bad}] ${e.rest}.`,
        `"Each" is singular, so the verb must be "${e.ok}", not "${e.bad}".`, rng);
    },
  },
];
