import { strip, structure, writtenExpression, type Template } from '../build';
import { REL_FACTS, WHOSE_FACTS } from '../lexicon';
import { choice } from '../../util/rng';

const P = 'P05' as const;

export const P05: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(REL_FACTS, rng);
      const ok = f.human ? 'who' : 'which';
      const pron = f.plural ? 'they' : f.human ? (rng() < 0.5 ? 'he' : 'she') : 'it';
      return structure(P, `${strip(f.head)} ____ ${strip(f.clause)} ${strip(f.main)}.`, ok, [f.human ? 'which' : 'who', pron, 'what'],
        `The blank begins an adjective clause describing "${strip(f.head).toLowerCase()}". Use "${ok}" for ${f.human ? 'people' : 'things'}. A pronoun like "${pron}" would create a second subject, and "what" cannot follow a noun.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(WHOSE_FACTS, rng);
      return structure(P, `${strip(f.head)} ____ ${f.poss} ${strip(f.main)}.`, 'whose', ['who', "who's", 'which'],
        `"Whose" shows possession: the ${f.poss.split(' ')[0]} belongs to ${strip(f.head).toLowerCase()}. "Who's" means "who is".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(REL_FACTS, rng);
      const wrong = f.human ? 'which' : 'who';
      const ok = f.human ? 'who' : 'which';
      return writtenExpression(P, `${f.head} [!${wrong}] ${f.clause} ${f.main}.`,
        `"${strip(f.head)}" refers to ${f.human ? 'a person or people' : 'a thing'}, so the relative pronoun must be "${ok}", not "${wrong}".`);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(REL_FACTS, rng);
      const ok = f.human ? 'who' : 'which';
      const pron = f.plural ? 'they' : f.human ? 'he' : 'it';
      return writtenExpression(P, `${f.head} [${ok}] [!${pron} ${strip(f.clause)}] ${f.main}.`,
        `Inside the clause, "${ok}" is already the subject, so the pronoun "${pron}" must be removed.`);
    },
  },
];
