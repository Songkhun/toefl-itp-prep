import type { PatternId, Question, Word } from '../domain/types';

export interface ContentSource {
  drillItems(p: PatternId): Question[];
  mockForm(n: number): Question[];
  availableMockForms(): number[];
  allWords(): Word[];
  lesson(p: PatternId): string;
}

const questionFiles = import.meta.glob<Question[]>('./questions/*.json', { eager: true, import: 'default' });
const mockFiles = import.meta.glob<Question[]>('./mocks/form*.json', { eager: true, import: 'default' });
const wordFiles = import.meta.glob<Word[]>('./awl/words.json', { eager: true, import: 'default' });
const lessonFiles = import.meta.glob<string>('./lessons/*.md', { eager: true, import: 'default', query: '?raw' });

const byFile = <T>(files: Record<string, T>, re: RegExp) => {
  const out = new Map<string, T>();
  for (const [path, v] of Object.entries(files)) {
    const m = path.match(re);
    if (m) out.set(m[1], v);
  }
  return out;
};
const drill = byFile(questionFiles, /\/(P\d\d)\.json$/);
const mocks = byFile(mockFiles, /\/form(\d+)\.json$/);
const lessons = byFile(lessonFiles, /\/(P\d\d)\.md$/);

export const realContent: ContentSource = {
  drillItems: (p) => drill.get(p) ?? [],
  mockForm: (n) => mocks.get(String(n)) ?? [],
  availableMockForms: () => [...mocks.keys()].map(Number).sort((a, b) => a - b),
  allWords: () => Object.values(wordFiles)[0] ?? [],
  lesson: (p) => lessons.get(p) ?? '',
};

/** Every question in the bank (drill + mock), for validation and lookup. */
export function allBankQuestions(c: ContentSource = realContent): Question[] {
  const ids = Array.from({ length: 25 }, (_, i) => `P${String(i + 1).padStart(2, '0')}` as PatternId);
  return [...ids.flatMap((p) => c.drillItems(p)), ...c.availableMockForms().flatMap((n) => c.mockForm(n))];
}
