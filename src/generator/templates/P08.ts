import { low, strip, structure, writtenExpression, type Template } from '../build';
import { OPENING_ING, OPENING_PP, REDUCED } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P08' as const;

export const P08: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(OPENING_PP, rng);
      return structure(P, `____ ${strip(f.rest)}, ${strip(f.subj)} ${strip(f.main)}.`, f.pp,
        [f.ing, `It was ${low(f.pp)}`, `Having ${low(f.pp)}`],
        `${strip(f.subj).replace(/^the/, 'The')} received the action, so the opening phrase uses the past participle "${f.pp}". "It was ${low(f.pp)}…" would create a second main clause without a conjunction.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(OPENING_ING, rng);
      return structure(P, `____ ${strip(f.rest)}, ${strip(f.subj)} ${strip(f.main)}.`, f.ing,
        [f.past, `They ${low(f.past)}`, `Having been ${low(f.past)}`],
        `${strip(f.subj).replace(/^the/, 'The')} performed the action, so the opening phrase uses the -ing form "${f.ing}". "They ${low(f.past)}…" creates a second main clause, and the passive forms mean the subject received the action.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(REDUCED, rng);
      return structure(P, `${strip(f.head)} ____ ${strip(f.by)} ${strip(f.main)}.`, f.pp,
        [f.ing, `${f.plural ? 'were' : 'was'} ${f.pp}`, `${f.plural ? 'they' : 'it'} ${f.pp}`],
        `"${f.pp} ${strip(f.by)}" is a reduced adjective clause (= "which ${f.plural ? 'were' : 'was'} ${f.pp}"). "${f.plural ? 'Were' : 'Was'} ${f.pp}" would give the sentence two main verbs, and "${f.ing}" has the wrong (active) meaning.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(OPENING_PP, rng);
      return writtenExpression(P, `[!${f.base}] ${f.rest}, ${f.subj} ${f.main}.`,
        `The opening phrase needs the past participle "${f.pp}", because ${strip(f.subj)} received the action.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(OPENING_ING, rng);
      return writtenExpression(P, `[!${f.past}] ${f.rest}, ${f.subj} ${f.main}.`,
        `${strip(f.subj).replace(/^the/, 'The')} performed the action, so the opening phrase must use "${f.ing}", not the past participle "${f.past}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(REDUCED, rng);
      return writtenExpression(P, `${f.head} [!${f.ing}] ${f.by} ${f.main}.`,
        `The ${strip(f.head).replace(/^The /, '').toLowerCase()} received the action, so the reduced clause needs the past participle "${f.pp}", not "${f.ing}".`, rng);
    },
  },
];
