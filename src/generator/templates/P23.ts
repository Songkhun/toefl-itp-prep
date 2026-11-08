import { strip, structure, writtenExpression, type Template } from '../build';
import { PAIRS, PAIR_WORDS } from '../lexicon4';
import { choice } from '../../util/rng';

const P = 'P23' as const;

export const P23: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(PAIRS, rng);
      const w = PAIR_WORDS[f.kind];
      return structure(P, `${strip(f.pre)} ${w.first} ${strip(f.x)} ____ ${strip(f.y)}.`, w.second, w.wrong,
        `${w.rule}: "${w.first} ${strip(f.x)} ${w.second} ${strip(f.y)}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(PAIRS, rng);
      const w = PAIR_WORDS[f.kind];
      const bad = choice(w.wrong, rng);
      return writtenExpression(P, `${f.pre} [${w.first}] ${f.x} [!${bad}] ${f.y}.`,
        `${w.rule}, so "${bad}" is wrong: "${w.first} ... ${w.second}".`, rng);
    },
  },
];
