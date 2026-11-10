import { realContent } from '../../src/content';
import { MAX_SIMILARITY, sentenceWords, similarity } from '../../src/generator';
import { buildMorningDrill, buildAfternoonSet, buildMock, buildNewSet, questionText } from '../../src/session/build';
import type { ContentSource } from '../../src/content';
import type { PatternId, Question } from '../../src/domain/types';
import type { MockResult } from '../../src/storage/store';

const item = (p: PatternId, i: number, source: 'drill' | 'mock', type: Question['type'] = 'structure', mockForm?: number): Question => ({
  id: `${source}-${p}-${mockForm ?? 0}-${i}`, patternId: p, type, source, mockForm,
  stem: type === 'structure' ? `S ${i} ____.` : `{0} {1} {2} {3} ${i}`,
  options: ['a', 'b', 'c', 'd'], answerIndex: 0, explanation: 'x',
});
const form = (n: number) => [
  ...Array.from({ length: 25 }, (_, i) => item('P02', i, 'mock', 'written-expression', n)),
  ...Array.from({ length: 15 }, (_, i) => item('P01', 100 + i, 'mock', 'structure', n)),
];
const fixture: ContentSource = {
  drillItems: (p) => (p === 'P01' ? Array.from({ length: 10 }, (_, i) => item('P01', i, 'drill', i % 2 ? 'written-expression' : 'structure'))
    : p === 'P18' ? Array.from({ length: 16 }, (_, i) => item('P18', i, 'drill')) : []),
  mockForm: (n) => (n <= 2 ? form(n) : []),
  availableMockForms: () => [1, 2],
  allWords: () => [],
  lesson: () => '',
};
const noMock = (qs: Question[]) => qs.every((q) => q.source !== 'mock');

describe('buildMorningDrill', () => {
  it('has 15 items: 5 drill + 10 generated', () => {
    const qs = buildMorningDrill('P01', 1, fixture);
    expect(qs).toHaveLength(15);
    expect(qs.filter((q) => q.source === 'drill')).toHaveLength(5);
    expect(qs.filter((q) => q.source === 'generated')).toHaveLength(10);
  });
  it('P18 (formerly bank-only) now mixes 5 drill items with 10 generated ones', () => {
    const qs = buildMorningDrill('P18', 1, fixture);
    expect(qs).toHaveLength(15);
    expect(qs.filter((q) => q.source === 'drill')).toHaveLength(5);
    expect(qs.filter((q) => q.source === 'generated')).toHaveLength(10);
  });
  it('tops up with generated items when the drill pool is empty', () => {
    expect(buildMorningDrill('P02', 1, fixture)).toHaveLength(15);
  });
});

describe('buildAfternoonSet', () => {
  it('has 20 items, Structure before WE, 740,000 ms', () => {
    const s = buildAfternoonSet(['P01', 'P02', 'P03'], new Map(), 3, fixture);
    expect(s.questions).toHaveLength(20);
    expect(s.timeLimitMs).toBe(740_000);
    const firstWE = s.questions.findIndex((q) => q.type === 'written-expression');
    expect(s.questions.slice(firstWE).every((q) => q.type === 'written-expression')).toBe(true);
    expect(new Set(s.questions.map((q) => q.id)).size).toBe(20);
  });
  it('day-1 afternoon with no studied patterns falls back to P01', () => {
    const s = buildAfternoonSet([], new Map(), 3, fixture);
    expect(s.questions.length).toBe(20);
    expect(s.questions.every((q) => q.patternId === 'P01')).toBe(true);
  });
});

describe('buildMock', () => {
  const r = (form: number, at: number): MockResult => ({ form, raw: 20, scaled: 44, repeat: false, at });
  it('takes form 1 first, then 2, then generates new forms 3, 4, … instead of repeating', () => {
    expect(buildMock([], fixture)!).toMatchObject({ form: 1, repeat: false, generated: false });
    expect(buildMock([r(1, 10)], fixture)!).toMatchObject({ form: 2, repeat: false, generated: false });
    expect(buildMock([r(1, 10), r(2, 20)], fixture)!).toMatchObject({ form: 3, repeat: false, generated: true });
    expect(buildMock([r(1, 10), r(2, 20), r(3, 30)], fixture)!).toMatchObject({ form: 4, repeat: false, generated: true });
  });
  it('a generated mock copies the layout of a fixed form with fresh generated questions', () => {
    const m = buildMock([r(1, 10), r(2, 20)], fixture)!;
    expect(m.questions).toHaveLength(40);
    expect(m.questions.slice(0, 15).every((q) => q.type === 'structure' && q.patternId === 'P01')).toBe(true);
    expect(m.questions.slice(15).every((q) => q.type === 'written-expression' && q.patternId === 'P02')).toBe(true);
    expect(m.questions.every((q) => q.source === 'generated')).toBe(true);
    expect(new Set(m.questions.map((q) => q.stem)).size).toBe(40);
    expect(new Set(m.questions.map((q) => q.id)).size).toBe(40);
    const m2 = buildMock([r(1, 10), r(2, 20), r(3, 30)], fixture)!;
    const stems = new Set(m.questions.map(questionText));
    // The fixture puts all 25 WE items on one pattern, so only the Structure half is checked here; the real-content test covers overlap.
    expect(m2.questions.slice(0, 15).filter((q) => stems.has(questionText(q)))).toHaveLength(0);
  });
  it('with real content, every generated form 7–18 matches its fixed layout', () => {
    const forms = realContent.availableMockForms();
    const hist = forms.map((f, i) => r(f, i));
    const seen = new Set<string>();
    for (let n = 7; n <= 18; n++) {
      const m = buildMock([...hist, ...Array.from({ length: n - 7 }, (_, i) => r(7 + i, 100 + i))])!;
      expect(m).toMatchObject({ form: n, generated: true });
      const layout = realContent.mockForm(forms[(n - 1) % forms.length]);
      const key = (qs: { patternId: string; type: string }[]) => qs.map((q) => `${q.type}:${q.patternId}`).sort().join(',');
      expect(key(m.questions)).toBe(key(layout));
      expect(new Set(m.questions.map((q) => questionText(q))).size).toBe(40);
      const w = m.questions.map(sentenceWords);
      const near = w.flatMap((a, i) => w.slice(i + 1).filter((b) => similarity(a, b) >= MAX_SIMILARITY)).length;
      expect(near).toBeLessThanOrEqual(1);
      expect(m.questions.filter((q) => seen.has(questionText(q))).length).toBeLessThanOrEqual(2);
      m.questions.forEach((q) => seen.add(questionText(q)));
    }
  });
  it('repeats the least recent fixed form only when a layout pattern has no generator', () => {
    const noGen = { ...fixture, mockForm: (n: number) => form(n).map((q) => ({ ...q, patternId: 'P99' as PatternId })) };
    expect(buildMock([r(1, 10), r(2, 20)], noGen)!).toMatchObject({ form: 1, repeat: true, generated: false });
  });
  it('has 40 items, Q1–15 Structure, Q16–40 WE, 25 minutes', () => {
    const m = buildMock([], fixture)!;
    expect(m.questions).toHaveLength(40);
    expect(m.questions.slice(0, 15).every((q) => q.type === 'structure')).toBe(true);
    expect(m.questions.slice(15).every((q) => q.type === 'written-expression')).toBe(true);
    expect(m.timeLimitMs).toBe(1_500_000);
  });
  it('returns null when no mock forms exist', () => {
    expect(buildMock([], { ...fixture, availableMockForms: () => [] })).toBeNull();
  });
});

describe('buildNewSet', () => {
  it('generated items for a generator pattern', () => {
    const qs = buildNewSet('P03', ['P01'], 4, fixture);
    expect(qs).toHaveLength(15);
    expect(qs.every((q) => q.source === 'generated' && q.patternId === 'P03')).toBe(true);
  });
  it('P18 new sets are generated', () => {
    const qs = buildNewSet('P18', [], 4, fixture);
    expect(qs).toHaveLength(15);
    expect(qs.every((q) => q.source === 'generated' && q.patternId === 'P18')).toBe(true);
  });
  it('mixed draws from studied patterns', () => {
    const qs = buildNewSet('mixed', ['P01', 'P04'], 4, fixture);
    expect(qs).toHaveLength(15);
    expect(qs.every((q) => ['P01', 'P04'].includes(q.patternId))).toBe(true);
  });
});

it('across 500 seeds, no drill, afternoon or new-set output contains a mock item', () => {
  for (let seed = 1; seed <= 500; seed++) {
    expect(noMock(buildMorningDrill('P01', seed, fixture))).toBe(true);
    expect(noMock(buildAfternoonSet(['P01', 'P02'], new Map(), seed, fixture).questions)).toBe(true);
    expect(noMock(buildNewSet('mixed', ['P01', 'P18'], seed, fixture))).toBe(true);
  }
});

describe('avoids recently answered bank items', () => {
  const NOW = 10 * 86_400_000;
  const p01Bank = fixture.drillItems('P01');
  const seenAll = { seen: new Map(p01Bank.map((q) => [q.id, NOW - 3600_000])), now: NOW };

  it('morning drill uses no bank item answered in the last 3 days when a generator exists', () => {
    const qs = buildMorningDrill('P01', 7, fixture, seenAll);
    expect(qs).toHaveLength(15);
    expect(qs.filter((q) => q.source === 'drill')).toHaveLength(0);
  });
  it('morning drill takes unseen bank items first', () => {
    const seen = new Map(p01Bank.slice(0, 5).map((q) => [q.id, NOW - 3600_000]));
    const qs = buildMorningDrill('P01', 7, fixture, { seen, now: NOW });
    const drillIds = qs.filter((q) => q.source === 'drill').map((q) => q.id);
    expect(drillIds).toHaveLength(5);
    expect(drillIds.every((id) => !seen.has(id))).toBe(true);
  });
  it('bank items answered more than 3 days ago come back', () => {
    const old = { seen: new Map(p01Bank.map((q) => [q.id, NOW - 4 * 86_400_000])), now: NOW };
    expect(buildMorningDrill('P01', 7, fixture, old).filter((q) => q.source === 'drill')).toHaveLength(5);
  });
  it('bank items not answered recently are preferred over recent ones', () => {
    const bank = fixture.drillItems('P18');
    // items 0-9 answered an hour ago, items 10-15 never
    const seen = new Map(bank.slice(0, 10).map((q) => [q.id, NOW - 3600_000]));
    const drill = buildMorningDrill('P18', 7, fixture, { seen, now: NOW }).filter((q) => q.source === 'drill');
    expect(drill).toHaveLength(5);
    expect(drill.every((q) => !seen.has(q.id))).toBe(true);
  });
  it('afternoon set skips recently answered bank items', () => {
    const { questions } = buildAfternoonSet(['P01'], new Map(), 7, fixture, seenAll);
    expect(questions).toHaveLength(20);
    expect(questions.filter((q) => q.source === 'drill')).toHaveLength(0);
  });
  it('mixed new set skips recently answered bank items', () => {
    const qs = buildNewSet('mixed', ['P01'], 7, fixture, seenAll);
    expect(qs).toHaveLength(15);
    expect(qs.filter((q) => q.source === 'drill')).toHaveLength(0);
  });
});
