import { cap, strip, structure, writtenExpression, type Template } from '../build';
import { MODAL, PAST_MODAL } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P15' as const;

export const P15: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(MODAL, rng);
      const v = f.verb;
      return structure(P, `${strip(f.subj)} ${f.modal} ____ ${strip(f.rest)}.`, v.base, [`to ${v.base}`, v.ing, v.s],
        `A modal such as "${f.modal}" is always followed by the base form of the verb, with no "to" and no ending: "${f.modal} ${v.base}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(PAST_MODAL, rng);
      const v = f.verb;
      return structure(P, `${strip(f.subj)} ${f.modal} ____ ${strip(f.rest)}.`, `have ${v.pp}`, [`had ${v.pp}`, `have ${v.base}`, v.past],
        `To talk about the past with a modal, use modal + have + past participle: "${f.modal} have ${v.pp}". "Had" and the simple past cannot follow a modal.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(MODAL, rng);
      const bad = choice([f.verb.s, f.verb.ing, f.verb.past], rng);
      return writtenExpression(P, `${f.subj} [${f.modal}] [!${bad}] ${f.rest}.`,
        `${cap(f.modal)} is followed by the base form of the verb: "${f.modal} ${f.verb.base}", not "${f.modal} ${bad}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(PAST_MODAL, rng);
      return writtenExpression(P, `${f.subj} [${f.modal}] [!had ${f.verb.pp}] ${f.rest}.`,
        `A modal about the past takes "have", not "had": "${f.modal} have ${f.verb.pp}".`, rng);
    },
  },
];
