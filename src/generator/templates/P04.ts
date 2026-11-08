import { strip, structure, writtenExpression, type Template } from '../build';
import { PASSIVE_FACTS, PAST_TIMES } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P04' as const;
function pf(rng: Rng) {
  const f = choice(PASSIVE_FACTS, rng);
  const be = f.plural ? 'were' : 'was';
  return { f, be, ok: `${be} ${f.verb.pp}`, time: choice(PAST_TIMES, rng) };
}
const why = (subj: string, ok: string) =>
  `"${strip(subj)}" receives the action, so the passive voice is needed: "${ok}" (be + past participle).`;

export const P04: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, ok, time } = pf(rng);
      return structure(P, `${strip(f.subj)} ____ ${strip(f.rest)} ${strip(time)}.`, ok,
        [f.verb.past, `${f.plural ? 'have' : 'has'} ${f.verb.pp}`, `${f.verb.ing}`],
        why(f.subj, ok), rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return structure(P, `${strip(f.subj)} ____ ${strip(f.rest)} ${strip(time)}.`, ok,
        [`${be} ${f.verb.base}`, `${be} ${f.verb.ing}`, `being ${f.verb.pp}`], why(f.subj, ok), rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return writtenExpression(P, `${f.subj} [!${be} ${f.verb.base}] ${f.rest} ${time}.`,
        `After "${be}", a passive verb needs the past participle: "${ok}", not "${be} ${f.verb.base}".`);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, be, ok, time } = pf(rng);
      return writtenExpression(P, `${f.subj} [!${be} ${f.verb.ing}] ${f.rest} ${time}.`,
        `"${strip(f.subj)}" cannot perform this action; it receives it. Use the passive "${ok}", not the active "${be} ${f.verb.ing}".`);
    },
  },
];
