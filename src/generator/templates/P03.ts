import { low, strip, structure, writtenExpression, type Template } from '../build';
import { EVENT_FACTS, PAST_TIMES, REPORT_FRONTS, SINCE_TIMES, STATE_FACTS, type ActiveFact } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P03' as const;
function forms(rng: Rng, facts: ActiveFact[]) {
  const f = choice(facts, rng);
  const plural = rng() < 0.5;
  const v = f.verb;
  return {
    f, plural, subj: plural ? f.pl : f.sg,
    present: plural ? v.base : v.s,
    perfect: `${plural ? 'have' : 'has'} ${v.pp}`,
    progressive: `${plural ? 'are' : 'is'} ${v.ing}`,
    past: v.past,
  };
}
const lead = (rng: Rng, subj: string) => (rng() < 0.4 ? `${choice(REPORT_FRONTS, rng)} ${low(subj)}` : subj);

export const P03: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const b = forms(rng, EVENT_FACTS);
      const t = choice(PAST_TIMES, rng);
      return structure(P, `${strip(b.subj)} ____ ${strip(b.f.rest)} ${t}.`, b.past, [b.perfect, b.present, b.progressive],
        `"${t}" is a finished time in the past, so the simple past "${b.past}" is needed. The present perfect cannot be used with a finished past time.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const b = forms(rng, STATE_FACTS);
      const t = choice(SINCE_TIMES(b.plural), rng);
      return structure(P, `${strip(b.subj)} ____ ${strip(b.f.rest)} ${t}.`, b.perfect, [b.past, b.present, b.progressive],
        `"${t}" describes something that started in the past and continues now, so the present perfect "${b.perfect}" is needed.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const b = forms(rng, EVENT_FACTS);
      const t = choice(PAST_TIMES, rng);
      return writtenExpression(P, `${lead(rng, b.subj)} [!${b.perfect}] ${b.f.rest} ${t}.`,
        `"${t}" is a finished past time, so the verb must be simple past: "${b.past}", not "${b.perfect}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const b = forms(rng, STATE_FACTS);
      const t = choice(SINCE_TIMES(b.plural), rng);
      return writtenExpression(P, `${lead(rng, b.subj)} [!${b.past}] ${b.f.rest} ${t}.`,
        `With "${t}", the situation continues up to now, so the present perfect "${b.perfect}" is required, not "${b.past}".`, rng);
    },
  },
];
