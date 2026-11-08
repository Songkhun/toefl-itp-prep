export const PATTERN_IDS = [
  'P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10',
  'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20',
  'P21', 'P22', 'P23', 'P24', 'P25',
] as const;
export type PatternId = (typeof PATTERN_IDS)[number];
export type QuestionType = 'structure' | 'written-expression';
export type Source = 'drill' | 'mock' | 'generated';

export interface Question {
  id: string;
  patternId: PatternId;
  type: QuestionType;
  source: Source;
  /** structure: contains exactly one "____"; written-expression: contains {0}{1}{2}{3} marking the underlined parts */
  stem: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  /** 1..6, required iff source === 'mock' */
  mockForm?: number;
}

export interface Pattern {
  id: PatternId;
  title: string;
  week: number;
  dayInWeek: number;
  hasGenerator: boolean;
}

export interface Word {
  id: string;
  headword: string;
  pos: string;
  definition: string;
  examples: string[];
  forms: string[];
  sublist: number;
}
