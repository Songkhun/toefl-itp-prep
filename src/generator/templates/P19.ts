import { structure, writtenExpression, type Template } from '../build';
import { FAMILIES, type Pos } from '../lexicon5';
import { choice } from '../../util/rng';

const P = 'P19' as const;
const POS_NAME: Record<Pos, string> = { n: 'a noun', v: 'a verb', adj: 'an adjective', adv: 'an adverb' };
const ALL: Pos[] = ['n', 'v', 'adj', 'adv'];

export const P19: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(FAMILIES, rng), fr = choice(f.frames, rng);
      const wrong = ALL.filter((p) => p !== fr.pos).map((p) => f[p]) as [string, string, string];
      return structure(P, `${fr.s}.`, f[fr.pos], wrong,
        `This blank needs ${POS_NAME[fr.pos]} ${fr.why}, so the correct form is "${f[fr.pos]}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(FAMILIES, rng), fr = choice(f.frames, rng);
      const badPos = choice(ALL.filter((p) => p !== fr.pos), rng);
      return writtenExpression(P, `${fr.s.replace('____', `[!${f[badPos]}]`)}.`,
        `"${f[badPos]}" is ${POS_NAME[badPos]}, but this position needs ${POS_NAME[fr.pos]} ${fr.why}: "${f[fr.pos]}".`, rng);
    },
  },
];
