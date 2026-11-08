import { low, strip, structure, writtenExpression, type Template } from '../build';
import { ACTIVE_FACTS, P01_FRONTS } from '../lexicon';
import { choice, type Rng } from '../../util/rng';

const P = 'P01' as const;
function sv(rng: Rng) {
  const f = choice(ACTIVE_FACTS, rng);
  const plural = rng() < 0.5;
  return { f, plural, subj: plural ? f.pl : f.sg, verb: plural ? f.verb.base : f.verb.s, pron: plural ? 'they' : 'it' };
}
const front = (rng: Rng, subj: string, plural: boolean) => (rng() < 0.5 ? `${choice(P01_FRONTS(plural), rng)} ${low(subj)}` : subj);

export const P01: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, subj, verb } = sv(rng);
      return structure(P, `${strip(subj)} ____ ${strip(f.rest)}.`, verb, [f.verb.ing, `to ${f.verb.base}`, `which ${verb}`],
        `The sentence has a subject ("${strip(subj)}") but no main verb. "${verb}" is a complete main verb. An -ing form, a "to" infinitive, or a "which" clause cannot be the main verb of a sentence.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, subj, verb, pron } = sv(rng);
      const s = strip(subj);
      return structure(P, `____ ${verb} ${strip(f.rest)}.`, s, [`Because ${low(s)}`, `${s} ${pron}`, `That ${low(s)}`],
        `The verb "${verb}" needs a subject that is just a noun phrase. "Because…" and "That…" turn the sentence into a dependent clause with no main clause, and "${s} ${pron}" repeats the subject.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const { f, subj, verb, plural } = sv(rng);
      const s = low(strip(subj));
      return structure(P, `${strip(choice(P01_FRONTS(plural), rng))} ____ ${strip(f.rest)}.`, `${s} ${verb}`, [`${s} ${f.verb.ing}`, `when ${s} ${verb}`, `${f.verb.ing} ${s}`],
        `After the introductory phrase, the sentence still needs a subject and a main verb: "${s} ${verb}". An -ing form is not a main verb, "when…" makes the clause dependent, and "${f.verb.ing} ${s}" puts the words in the wrong order.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, subj, verb, plural } = sv(rng);
      return writtenExpression(P, `${front(rng, subj, plural)} [!${f.verb.ing}] ${f.rest}.`,
        `"${f.verb.ing}" cannot be the main verb of a sentence. The sentence needs the verb "${verb}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const { f, subj, verb, pron, plural } = sv(rng);
      return writtenExpression(P, `${front(rng, subj, plural)} [!${pron} ${verb}] ${f.rest}.`,
        `The subject is already "${low(strip(subj))}", so the pronoun "${pron}" is an unnecessary second subject. The correct form is just "${verb}".`, rng);
    },
  },
];
