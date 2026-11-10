import { strip, structure, writtenExpression, type Template } from '../build';
import { INV } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P12' as const;

export const P12: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(INV, rng);
      return structure(P, `${strip(f.lead)} ____ ${strip(f.rest)}.`, f.ok, f.bad,
        `When a sentence begins with a negative, limiting, or "so + adjective" expression such as "${f.cue}", the subject and the auxiliary verb (or the verb "be") are inverted, as in a question: "${f.ok}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(INV, rng);
      const bad = choice([f.bad[0], f.bad[1]], rng);
      return writtenExpression(P, `${f.lead} [!${bad}] ${f.rest}.`,
        `After "${f.cue}" at the start of a sentence, use question word order: "${f.ok}", not "${bad}".`, rng);
    },
  },
];
