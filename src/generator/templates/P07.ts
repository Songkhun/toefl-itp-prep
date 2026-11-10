import { cap, strip, structure, writtenExpression, type Template } from '../build';
import { CAUSE, CONCESSION, SO_THAT } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P07' as const;

export const P07: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CONCESSION, rng);
      return structure(P, `____ ${strip(f.clause)}, ${strip(f.main)}.`, 'Although', ['Despite', 'In spite of', 'Because of'],
        `The blank is followed by a full clause (subject + verb: "${strip(f.clause)}"), so a conjunction is needed: "Although". "Despite", "in spite of" and "because of" are prepositions and must be followed by a noun phrase (and "because of" shows cause, not contrast).`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CONCESSION, rng);
      return structure(P, `____ ${strip(f.noun)}, ${strip(f.main)}.`, 'Despite', ['Although', 'Even though', 'Because'],
        `The blank is followed by a noun phrase ("${strip(f.noun)}"), not a clause, so a preposition is needed: "Despite". "Although", "even though" and "because" must be followed by a subject and verb.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUSE, rng);
      return structure(P, `____ ${strip(f.noun)}, ${strip(f.main)}.`, 'Because of', ['Because', 'Since', 'Although'],
        `"${strip(f.noun)}" is a noun phrase, so the preposition "because of" is needed. "Because" and "since" (meaning "because") are conjunctions that need a full clause, and "although" shows contrast, not cause.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUSE, rng);
      return structure(P, `____ ${strip(f.clause)}, ${strip(f.main)}.`, 'Because', ['Because of', 'Due to', 'Despite'],
        `The blank is followed by a full clause ("${strip(f.clause)}"), so the conjunction "because" is needed. "Because of", "due to" and "despite" are prepositions that need a noun phrase, and "despite" shows contrast.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(SO_THAT, rng);
      return structure(P, `${strip(f.subj)} ${f.be} ____ that ${strip(f.result)}.`, `so ${f.adj}`, [`such ${f.adj}`, `too ${f.adj}`, `very ${f.adj}`],
        `The pattern is "so + adjective + that + result". "Such" needs a noun after the adjective ("such a long lecture", "such confusing instructions"), and "too" and "very" cannot be followed by "that".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CONCESSION, rng);
      return structure(P, `${cap(strip(f.mainFirst ?? f.main))} ____ ${strip(f.noun)}.`, 'despite', ['although', 'even though', 'because'],
        `"${strip(f.noun)}" is a noun phrase, not a clause, so the preposition "despite" is needed. "Although" and "even though" need a subject and verb after them, and "because" shows cause, not contrast.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(CAUSE, rng);
      return structure(P, `${cap(strip(f.main))} ____ ${strip(f.noun)}.`, 'because of', ['because', 'since', 'although'],
        `"${strip(f.noun)}" is a noun phrase, so the preposition "because of" is needed. "Because" and "since" need a full clause, and "although" shows contrast, not cause.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(CONCESSION, rng);
      const sentence = rng() < 0.5
        ? `[!Despite] ${f.clause}, ${f.main}.`
        : `${cap(f.mainFirst ?? f.main)} [!despite] ${f.clause}.`;
      return writtenExpression(P, sentence, `"Despite" is a preposition and cannot introduce the clause "${strip(f.clause)}". Use the conjunction "although".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(CAUSE, rng);
      const sentence = rng() < 0.5
        ? `[!Because] ${f.noun}, ${f.main}.`
        : `${cap(f.main)} [!because] ${f.noun}.`;
      return writtenExpression(P, sentence, `"${strip(f.noun)}" is a noun phrase, so "because of" is needed, not the conjunction "because".`, rng);
    },
  },
];
