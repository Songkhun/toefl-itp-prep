import { strip, structure, writtenExpression, type Template } from '../build';
import { PARALLEL } from '../lexicon2';
import { choice, randInt, shuffle } from '../../util/rng';

const P = 'P10' as const;

export const P10: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(PARALLEL, rng);
      const [a, b, c] = f.items;
      return structure(P, `${strip(f.lead)} ${a.ok}, ${b.ok}, and ____.`, c.ok, f.lastWrong,
        `Items in a list must have the same form. "${a.ok}" and "${b.ok}" are ${f.kind}, so the third item must be "${c.ok}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(PARALLEL, rng);
      const [a, , c] = f.items;
      return structure(P, `${strip(f.lead)} ${a.ok} and ____.`, c.ok, f.lastWrong,
        `Words joined by "and" must have the same form. "${a.ok}" is one of the ${f.kind}, so the second item must match: "${c.ok}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(PARALLEL, rng);
      const k = randInt(rng, 3);
      const parts = f.items.map((it, i) => (i === k ? `[!${it.bad}]` : `[${it.ok}]`));
      return writtenExpression(P, `${f.lead} ${parts[0]}, ${parts[1]}, and ${parts[2]}.`,
        `All items in the list must be parallel (${f.kind}). "${f.items[k].bad}" breaks the pattern; it should be "${f.items[k].ok}".`, rng);
    },
  },
  {
    // Same lists in a different order ("fast, reliable, and light"), so the error lands in new places.
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(PARALLEL, rng);
      const items = shuffle(f.items, rng);
      const k = randInt(rng, 3);
      const parts = items.map((it, i) => (i === k ? `[!${it.bad}]` : `[${it.ok}]`));
      return writtenExpression(P, `${f.lead} ${parts[0]}, ${parts[1]}, and ${parts[2]}.`,
        `All items in the list must be parallel (${f.kind}). "${items[k].bad}" breaks the pattern; it should be "${items[k].ok}".`, rng);
    },
  },
];
