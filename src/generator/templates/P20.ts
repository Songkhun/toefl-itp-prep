import { strip, structure, writtenExpression, type Template } from '../build';
import { ADJ_AFTER_LINK, ADV_AFTER_VERB } from '../lexicon4';
import { choice } from '../../util/rng';

const P = 'P20' as const;

export const P20: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(ADV_AFTER_VERB, rng);
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${strip(f.rest)}.`, f.adv, [f.adj, f.noun, `more ${f.adj}`],
        `The word modifies the verb "${f.verb}", so it must be an adverb: "${f.verb} ${f.adv}". Adjectives describe nouns, not verbs.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(ADJ_AFTER_LINK, rng);
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${strip(f.rest)}.`, f.adj, [f.adv, f.noun, `more ${f.adv}`],
        `"${f.verb[0].toUpperCase()}${f.verb.slice(1)}" is a linking verb here: it connects the subject to a word that describes it, so use an adjective: "${f.verb} ${f.adj}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(ADV_AFTER_VERB, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!${f.adj}] ${f.rest}.`,
        `An adverb is needed to describe the verb "${f.verb}": "${f.adv}", not the adjective "${f.adj}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(ADJ_AFTER_LINK, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!${f.adv}] ${f.rest}.`,
        `After the linking verb "${f.verb}", use an adjective that describes the subject: "${f.adj}", not the adverb "${f.adv}".`, rng);
    },
  },
];
