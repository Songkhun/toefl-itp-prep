import { structure, writtenExpression, type Template } from '../build';
import { COLLOCS } from '../lexicon5';
import { choice } from '../../util/rng';

const P = 'P21' as const;

export const P21: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const c = choice(COLLOCS, rng), frame = choice(c.frames, rng);
      return structure(P, `${frame}.`, c.prep, c.wrong,
        `The fixed phrase is "${c.phrase}", so the preposition must be "${c.prep}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const c = choice(COLLOCS, rng), frame = choice(c.frames, rng), bad = choice(c.wrong, rng);
      return writtenExpression(P, `${frame.replace('____', `[!${bad}]`)}.`,
        `The fixed phrase is "${c.phrase}", so the preposition must be "${c.prep}", not "${bad}".`, rng);
    },
  },
];
