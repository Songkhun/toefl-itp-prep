import { strip, structure, writtenExpression, type Template } from '../build';
import { CONFUSABLE, MAKE_DO, REDUNDANT, SUBJ22, type MakeDo } from '../lexicon5';
import { choice } from '../../util/rng';

const P = 'P22' as const;
const WORDS = [...CONFUSABLE, ...REDUNDANT];
const makeDoWhy = (m: MakeDo) => m.verb === 'made'
  ? `"${strip(m.obj)}" goes with "make": "made ${strip(m.obj)}". "Do" is used for work, tasks and activities (do research, do business).`
  : `"${strip(m.obj)}" goes with "do": "did ${strip(m.obj)}". "Make" is used for creating or deciding something (make a decision, make a mistake).`;

export const P22: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const subj = choice(SUBJ22, rng), m = choice(MAKE_DO, rng);
      return structure(P, `${strip(subj)} ____ ${strip(m.obj)} ${strip(m.tail)}.`, m.verb, m.wrong, makeDoWhy(m), rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const subj = choice(SUBJ22, rng), m = choice(MAKE_DO, rng);
      return writtenExpression(P, `${subj} [!${m.wrong[0]}] ${m.obj} ${m.tail}.`, makeDoWhy(m), rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const e = choice(WORDS, rng);
      return structure(P, `${e.s}.`, e.ok, e.wrong, e.why, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const e = choice(WORDS, rng);
      return writtenExpression(P, `${e.s.replace('____', `[!${e.wrong[0]}]`)}.`, `${e.why} Use "${e.ok}".`, rng);
    },
  },
];
