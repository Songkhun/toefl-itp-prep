import { strip, structure, writtenExpression, type Template } from '../build';
import { COND, WISH } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P13' as const;
const UNREAL_PRESENT = 'An unreal condition about the present uses the simple past in the if-clause and "would + base verb" in the main clause';
const UNREAL_PAST = 'An unreal condition about the past uses "had + past participle" in the if-clause and "would have + past participle" in the main clause';

export const P13: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const c = choice(COND, rng);
      const m = c.mainVerb;
      return structure(P, `If ${strip(c.ifSubj)} ${c.ifVerb.past} ${strip(c.ifObj)}, ${strip(c.mainSubj)} ____ ${strip(c.mainRest)}.`,
        `would ${m.base}`, [`would ${m.past}`, `would to ${m.base}`, m.ing],
        `${UNREAL_PRESENT}: "would ${m.base}". After "would", use the base form, without "to".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const c = choice(COND, rng);
      const m = c.mainVerb;
      return structure(P, `If ${strip(c.ifSubj)} had ${c.ifVerb.pp} ${strip(c.ifObj)}, ${strip(c.mainSubj)} ____ ${strip(c.mainRest)}.`,
        `would have ${m.pp}`, [`would ${m.pp}`, `will have ${m.pp}`, `would had ${m.pp}`],
        `${UNREAL_PAST}: "would have ${m.pp}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const c = choice(COND, rng);
      const v = c.ifVerb;
      return structure(P, `If ${strip(c.ifSubj)} ____ ${strip(c.ifObj)}, ${strip(c.mainSubj)} would have ${c.mainVerb.pp} ${strip(c.mainRest)}.`,
        `had ${v.pp}`, [`${c.plural ? 'have' : 'has'} ${v.pp}`, `would ${v.base}`, v.ing],
        `The main clause "would have ${c.mainVerb.pp}" shows an unreal past condition, so the if-clause needs the past perfect: "had ${v.pp}". "Would" does not belong in the if-clause.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const w = choice(WISH, rng);
      const v = w.verb;
      return structure(P, `${strip(w.who)} wish they ____ ${strip(w.rest)}.`, v.past, [v.base, `will ${v.base}`, v.ing],
        `A wish about the present is unreal, so the verb after "wish" moves back to the simple past: "wish they ${v.past}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const c = choice(COND, rng);
      const m = c.mainVerb;
      return writtenExpression(P, `If ${c.ifSubj} [had ${c.ifVerb.pp}] ${c.ifObj}, ${c.mainSubj} [!would ${m.pp}] ${c.mainRest}.`,
        `${UNREAL_PAST}: "would have ${m.pp}", not "would ${m.pp}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const c = choice(COND, rng);
      return writtenExpression(P, `If ${c.ifSubj} [!will ${c.ifVerb.base}] ${c.ifObj}, ${c.mainSubj} [would ${c.mainVerb.base}] ${c.mainRest}.`,
        `${UNREAL_PRESENT}. "Will" does not belong in this if-clause: write "${c.ifVerb.past}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const w = choice(WISH, rng);
      return writtenExpression(P, `${w.who} [wish] they [!${w.verb.base}] ${w.rest}.`,
        `After "wish", a present situation is described with the simple past: "${w.verb.past}", not "${w.verb.base}".`, rng);
    },
  },
];
