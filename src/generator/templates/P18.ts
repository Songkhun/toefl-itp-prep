import { strip, structure, writtenExpression, type Template } from '../build';
import { GROUPS18, JOB_RESTS, JOBS, PEOPLE, PLACE_FRAMES, PLACES, SUPS18 } from '../lexicon5';
import { choice } from '../../util/rng';

const P = 'P18' as const;
/** a/an by spelling; only used for words whose sound matches their first letter. */
const aAn = (w: string) => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const other = (art: 'a' | 'an') => (art === 'a' ? 'an' : 'a');
const firstWord = (s: string) => s.split(/[\s-]/)[0];

export const P18: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const subj = choice(PEOPLE, rng), j = choice(JOBS, rng), rest = choice(JOB_RESTS, rng);
      return structure(P, `${strip(subj)} is ____ ${strip(rest)}.`, `${j.art} ${j.np}`, [`${other(j.art)} ${j.np}`, j.np, j.pl],
        `"${firstWord(j.np)}" begins with ${j.sound ?? (j.art === 'an' ? 'a vowel sound' : 'a consonant sound')}, so the article is "${j.art}". A singular countable noun also needs an article, and the subject is singular, so the plural "${j.pl}" is wrong.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const subj = choice(PEOPLE, rng), j = choice(JOBS, rng), rest = choice(JOB_RESTS, rng);
      return writtenExpression(P, `${subj} [is] [!${other(j.art)}] ${j.np} ${rest}.`,
        `"${firstWord(j.np)}" begins with ${j.sound ?? (j.art === 'an' ? 'a vowel sound' : 'a consonant sound')}, so the article must be "${j.art}", not "${other(j.art)}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const subj = choice(PEOPLE, rng), s = choice(SUPS18, rng), g = choice(GROUPS18, rng);
      return structure(P, `${strip(subj)} is ____ ${strip(g.tail)}.`, `the ${s.sup} ${g.noun}`,
        [`${aAn(s.sup)} ${s.sup} ${g.noun}`, `${s.sup} ${g.noun}`, `the most ${s.base} ${g.noun}`],
        `A superlative ("${s.sup}") picks out one member of a group, so it takes "the": "the ${s.sup} ${g.noun}". "${s.sup}" is already the superlative form, so "most" must not be added.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const subj = choice(PEOPLE, rng), s = choice(SUPS18, rng), g = choice(GROUPS18, rng);
      return writtenExpression(P, `${subj} [is] [!${aAn(s.sup)}] ${s.sup} [${g.noun}] ${g.tail}.`,
        `A superlative ("${s.sup}") picks out one member of a group, so it takes "the", not "${aAn(s.sup)}".`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const pl = choice(PLACES, rng), frame = choice(PLACE_FRAMES, rng);
      const ok = pl.the ? `the ${pl.name}` : pl.name;
      const wrong: [string, string, string] = pl.the
        ? [pl.name, `${aAn(pl.name)} ${pl.name}`, pl.odd]
        : [`the ${pl.name}`, `${aAn(pl.name)} ${pl.name}`, pl.odd];
      return structure(P, `${frame}.`, ok, wrong,
        pl.the ? `Names of ${pl.kind} take "the": "the ${pl.name}".` : `Names of ${pl.kind} take no article: "${pl.name}".`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const pl = choice(PLACES, rng), frame = choice(PLACE_FRAMES, rng);
      const bad = pl.the ? pl.name : `the ${pl.name}`;
      return writtenExpression(P, `${frame.replace('____', `[!${bad}]`)}.`,
        pl.the ? `Names of ${pl.kind} take "the": "the ${pl.name}", not "${pl.name}".` : `Names of ${pl.kind} take no article: "${pl.name}", not "the ${pl.name}".`, rng);
    },
  },
];
