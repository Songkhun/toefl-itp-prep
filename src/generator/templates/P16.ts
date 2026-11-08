import { strip, structure, writtenExpression, type Template } from '../build';
import { OBJECT_REF, POSS_PLURAL, POSS_SINGULAR } from '../lexicon3';
import { choice } from '../../util/rng';

const P = 'P16' as const;
const head = (subj: string) => strip(subj).split(' ').pop()!;

export const P16: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(POSS_PLURAL, rng);
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${f.noun} ${strip(f.rest)}.`, 'their', ['its', "they're", 'them'],
        `The pronoun refers to the plural noun "${head(f.subj)}", so it must be the plural possessive "their". "They're" means "they are".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(POSS_SINGULAR, rng);
      return structure(P, `${strip(f.subj)} ${f.verb} ____ ${f.noun} ${strip(f.rest)}.`, 'its', ["it's", 'their', 'it'],
        `The pronoun refers to the singular noun "${head(f.subj)}", so use the possessive "its". "It's" (with an apostrophe) means "it is".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(OBJECT_REF, rng);
      return structure(P, `${strip(f.pre)} ____ ${strip(f.post)}.`, 'them', ['they', 'their', 'it'],
        'The pronoun is the object of the verb and refers to a plural noun, so use the plural object pronoun "them".', rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(POSS_PLURAL, rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!its] [${f.noun}] ${f.rest}.`,
        `"${head(f.subj)}" is plural, so the possessive must be "their", not "its".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(POSS_SINGULAR, rng);
      const bad = choice(['their', "it's"], rng);
      return writtenExpression(P, `${f.subj} [${f.verb}] [!${bad}] [${f.noun}] ${f.rest}.`,
        bad === 'their'
          ? `"${head(f.subj)}" is singular, so the possessive must be "its", not "their".`
          : `The possessive form is "its" with no apostrophe. "It's" means "it is".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(OBJECT_REF, rng);
      return writtenExpression(P, `${f.pre} [!they] ${f.post}.`,
        'An object of a verb needs an object pronoun: "them", not "they".', rng);
    },
  },
];
