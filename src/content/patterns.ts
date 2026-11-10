import type { Pattern } from '../domain/types';

const NO_GENERATOR = new Set<string>();

const TITLES: [Pattern['id'], string][] = [
  ['P01', 'Subject and verb: missing subject or verb'],
  ['P02', 'Subject–verb agreement'],
  ['P03', 'Verb tenses and time expressions'],
  ['P04', 'Passive voice'],
  ['P05', 'Adjective clauses'],
  ['P06', 'Noun clauses'],
  ['P07', 'Adverb clauses and connectors'],
  ['P08', 'Reduced clauses and participle phrases'],
  ['P09', 'Appositives'],
  ['P10', 'Parallel structure'],
  ['P11', 'Comparatives and superlatives'],
  ['P12', 'Inverted subject–verb order'],
  ['P13', 'Conditionals and wishes'],
  ['P14', 'Gerunds and infinitives'],
  ['P15', 'Modals and verb forms after modals'],
  ['P16', 'Pronouns'],
  ['P17', 'Singular/plural and countable nouns'],
  ['P18', 'Articles'],
  ['P19', 'Word form'],
  ['P20', 'Adjectives versus adverbs'],
  ['P21', 'Prepositions and fixed phrases'],
  ['P22', 'Redundancy and wrong word'],
  ['P23', 'Paired conjunctions'],
  ['P24', 'Causatives'],
  ['P25', 'Subjunctive'],
];

/**
 * Learn days within each week (1-based). Weeks 1–7 introduce 3 patterns, week 8 introduces 4,
 * giving 25 patterns over weeks 1–8. Other days in the week are review days.
 */
const LEARN_DAYS_3 = [1, 3, 5];
const LEARN_DAYS_4 = [1, 2, 4, 5];

export const PATTERNS: Pattern[] = TITLES.map(([id, title], i) => {
  const week = i < 21 ? Math.floor(i / 3) + 1 : 8;
  const dayInWeek = i < 21 ? LEARN_DAYS_3[i % 3] : LEARN_DAYS_4[i - 21];
  return { id, title, week, dayInWeek, hasGenerator: !NO_GENERATOR.has(id) };
});
