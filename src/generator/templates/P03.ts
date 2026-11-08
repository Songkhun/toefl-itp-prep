import { strip, structure, writtenExpression, type Template } from '../build';
import { ACTIVE_FACTS, PAST_TIMES, SINCE_TIMES } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P03' as const;
function base(rng: Rng) {
  const f = choice(ACTIVE_FACTS, rng);
  const plural = rng() < 0.5;
  const v = f.verb;
  return {
    f, subj: plural ? f.pl : f.sg,
    present: plural ? v.base : v.s,
    perfect: `${plural ? 'have' : 'has'} ${v.pp}`,
    progressive: `${plural ? 'are' : 'is'} ${v.ing}`,
    past: v.past,
  };
}

export const P03: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const b = base(rng);
      const t = choice(PAST_TIMES, rng);
      return structure(P, `${strip(b.subj)} ____ ${strip(b.f.rest)} ${strip(t)}.`, b.past, [b.perfect, b.present, b.progressive],
        `"${strip(t)}" refers to a finished time in the past, so the simple past "${b.past}" is needed. The present perfect cannot be used with a finished past time.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const b = base(rng);
      const t = choice(SINCE_TIMES, rng);
      return structure(P, `${strip(b.subj)} ____ ${strip(b.f.rest)} ${strip(t)}.`, b.perfect, [b.past, b.present, b.progressive],
        `"${strip(t)}" describes an action from a past point up to now, so the present perfect "${b.perfect}" is needed.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const b = base(rng);
      const t = choice(PAST_TIMES, rng);
      return writtenExpression(P, `${b.subj} [!${b.perfect}] ${b.f.rest} ${t}.`,
        `"${strip(t)}" is a finished past time, so the verb must be simple past: "${b.past}", not "${b.perfect}".`);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const b = base(rng);
      const t = choice(SINCE_TIMES, rng);
      return writtenExpression(P, `${b.subj} [!${b.past}] ${b.f.rest} ${t}.`,
        `With "${strip(t)}", the action continues up to now, so the present perfect "${b.perfect}" is required, not "${b.past}".`);
    },
  },
];
