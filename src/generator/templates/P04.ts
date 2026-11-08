import { low, strip, structure, writtenExpression, type Template } from '../build';
import { PASSIVE_FACTS, PAST_TIMES, REPORT_FRONTS } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P04' as const;
function pf(rng: Rng) {
  const f = choice(PASSIVE_FACTS, rng);
  const be = f.plural ? 'were' : 'was';
  return { f, be, ok: `${be} ${f.verb.pp}`, time: choice(PAST_TIMES, rng) };
}
const why = (subj: string, plural: boolean, ok: string) =>
  `"${strip(subj)}" ${plural ? 'do' : 'does'} not perform the action; ${plural ? 'they receive' : 'it receives'} it. So the passive voice is needed: "${ok}" (be + past participle).`;
const lead = (rng: Rng, subj: string) => (rng() < 0.4 ? `${choice(REPORT_FRONTS, rng)} ${low(subj)}` : subj);

export const P04: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, ok, time } = pf(rng);
      return structure(P, `${strip(f.subj)} ____ ${strip(f.rest)} ${time}.`, ok,
        [f.verb.past, `${f.plural ? 'have' : 'has'} ${f.verb.pp}`, f.verb.ing], why(f.subj, f.plural, ok), rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return structure(P, `${strip(f.subj)} ____ ${strip(f.rest)} ${time}.`, ok,
        [`${be} ${f.verb.base}`, `${be} ${f.verb.ing}`, `being ${f.verb.pp}`], why(f.subj, f.plural, ok), rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return writtenExpression(P, `${lead(rng, f.subj)} [!${be} ${f.verb.base}] ${f.rest} ${time}.`,
        `After "${be}", a passive verb needs the past participle: "${ok}", not "${be} ${f.verb.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return writtenExpression(P, `${lead(rng, f.subj)} [!${be} ${f.verb.ing}] ${f.rest} ${time}.`, why(f.subj, f.plural, ok) + ` "${be} ${f.verb.ing}" is active.`, rng);
    },
  },
];
