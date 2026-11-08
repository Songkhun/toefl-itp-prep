import { strip, structure, writtenExpression, type Template } from '../build';
import { APPOS } from '../lexicon2';
import { choice } from '../../util/rng';

const P = 'P09' as const;
const ucFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const P09: Template[] = [
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(APPOS, rng);
      const app = strip(f.app);
      return structure(P, `${strip(f.head)}, ____, ${strip(f.main)}.`, app, [`${f.be} ${app}`, `which ${app}`, `it ${f.be} ${app}`],
        `The phrase between the commas is an appositive: a noun phrase that renames "${strip(f.head)}". It has no verb, so "${f.be}", "which" and "it ${f.be}" must not be added; the sentence's verb comes after the second comma.`, rng);
    },
  },
  {
    patternId: P, type: 'structure',
    build(rng) {
      const f = choice(APPOS, rng);
      const app = strip(f.app);
      return structure(P, `____, ${strip(f.head).replace(/^The /, 'the ')} ${strip(f.main)}.`, ucFirst(app), [`${ucFirst(f.be)} ${app}`, `It ${f.be} ${app}`, `Because ${app}`],
        `An appositive noun phrase can open the sentence and rename the subject "${strip(f.head)}". Adding a verb ("${f.be}", "it ${f.be}") or "because" breaks the sentence structure.`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(APPOS, rng);
      return writtenExpression(P, `${f.head}, [!which] ${f.app}, ${f.main}.`,
        `"${strip(f.app)}" is an appositive (a noun phrase), so it must not begin with "which". Either remove "which" or write "${f.rel} ${f.be}".${f.rel === 'who' ? ' ("Which" also cannot refer to a person.)' : ''}`, rng);
    },
  },
  {
    patternId: P, type: 'written-expression',
    build(rng) {
      const f = choice(APPOS, rng);
      return writtenExpression(P, `${f.head}, [!${f.be}] ${f.app}, ${f.main}.`,
        `The phrase between the commas is an appositive, so it has no verb. Remove "${f.be}"; the sentence's main verb comes after the second comma.`, rng);
    },
  },
];
