import { cap, strip, structure, writtenExpression, type Template } from '../build';
import { EMBEDDED_QS, NC_LEADS, NC_LEADS_PLAIN, THAT_FACTS, WHAT_FACTS } from '../lexicon';
import { choice } from '../../util/rng';

const P = 'P06' as const;

export const P06: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const q = choice(EMBEDDED_QS, rng);
      const tail = strip(q.tail);
      return structure(P, `${choice(NC_LEADS_PLAIN, rng)} ${q.wh} ____ ${tail}.`, q.ok, q.bad,
        `Inside a noun clause, use statement word order (subject + verb): "${q.wh} ${q.ok}". Question order, inverted order, and -ing or "to" forms are all wrong here.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(THAT_FACTS, rng);
      return structure(P, `____ ${strip(f.clause)} ${strip(f.main)}.`, 'That', ['It', 'Because', 'What'],
        `The subject of the sentence is the whole clause "that ${strip(f.clause)}". A complete clause used as a subject begins with "That". "What" is used only when the clause is missing a subject or object.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(WHAT_FACTS, rng);
      return structure(P, `____ ${strip(f.clause)} ${strip(f.main)}.`, 'What', ['That', 'It', 'Because'],
        `"${strip(f.clause)}" is missing its object, so the clause must begin with "What" (= the thing that). "That" needs a complete clause.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const q = choice(EMBEDDED_QS, rng);
      return writtenExpression(P, `${choice(NC_LEADS, rng)} [${q.wh}] [!${q.bad[0]}] ${q.tail}.`,
        `A noun clause uses statement word order: "${q.wh} ${q.ok}", not question order "${q.bad[0]}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(THAT_FACTS, rng);
      return writtenExpression(P, `[!What] ${f.clause} ${f.main}.`,
        `"${cap(strip(f.clause))}" is a complete clause, so it must begin with "That", not "What".`, rng);
    },
  },
];
