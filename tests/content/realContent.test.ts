import { realContent, allBankQuestions } from '../../src/content';
import { validateContent } from '../../src/content/validate';
import { PATTERNS } from '../../src/content/patterns';
import { hasGenerator } from '../../src/generator';
import type { PatternId } from '../../src/domain/types';

const RELEASE1: PatternId[] = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21', 'P22', 'P23', 'P24', 'P25'];
const FORMS = [1, 2, 3, 4, 5, 6];

describe('real content (releases 1–5)', () => {
  it('is valid', () => {
    expect(validateContent({ patterns: PATTERNS, questions: allBankQuestions(), words: realContent.allWords() })).toEqual([]);
  });
  it('P01–P06 each have enough drill items, all with source "drill"', () => {
    for (const p of RELEASE1) {
      const items = realContent.drillItems(p);
      expect(items.length, p).toBeGreaterThanOrEqual(hasGenerator(p) ? 10 : 16);
      expect(items.every((q) => q.source === 'drill' && q.patternId === p), p).toBe(true);
      expect(new Set(items.map((q) => q.type)).size, p).toBe(2);
    }
  });
  for (const n of FORMS) {
    it(`mock form ${n} has exactly 40 items, Q1–15 Structure, all source "mock", covering all 25 patterns`, () => {
      const f = realContent.mockForm(n);
      expect(f).toHaveLength(40);
      expect(f.slice(0, 15).every((q) => q.type === 'structure')).toBe(true);
      expect(f.slice(15).every((q) => q.type === 'written-expression')).toBe(true);
      expect(f.every((q) => q.source === 'mock' && q.mockForm === n)).toBe(true);
      expect(new Set(f.map((q) => q.patternId)).size).toBe(25);
    });
    it(`answer positions are spread out in mock form ${n}`, () => {
      const counts = [0, 1, 2, 3].map((i) => realContent.mockForm(n).filter((q) => q.answerIndex === i).length);
      expect(Math.min(...counts)).toBeGreaterThanOrEqual(5);
    });
  }
  it('mock forms do not share sentences', () => {
    for (const a of FORMS) for (const b of FORMS) {
      if (a >= b) continue;
      const one = new Set(realContent.mockForm(a).map((q) => q.stem));
      expect(realContent.mockForm(b).filter((q) => one.has(q.stem)), `${a} vs ${b}`).toEqual([]);
    }
  });
  it('has at least 570 words with no duplicate headwords, in sublist order', () => {
    const w = realContent.allWords();
    expect(w.length).toBeGreaterThanOrEqual(570);
    expect(new Set(w.map((x) => x.headword.toLowerCase())).size).toBe(w.length);
    for (let i = 1; i < w.length; i++) expect(w[i].sublist).toBeGreaterThanOrEqual(w[i - 1].sublist);
  });
  it('each example sentence contains the headword or one of its forms', () => {
    for (const w of realContent.allWords()) {
      const forms = [w.headword, ...w.forms].map((f) => f.toLowerCase());
      for (const e of w.examples) expect(forms.some((f) => e.toLowerCase().includes(f)), `${w.headword}: ${e}`).toBe(true);
    }
  });
  it('each release-1 pattern has a lesson', () => {
    for (const p of RELEASE1) expect(realContent.lesson(p).length, p).toBeGreaterThan(200);
  });
  it('drill and mock sentences do not overlap', () => {
    const drill = new Set(RELEASE1.flatMap((p) => realContent.drillItems(p)).map((q) => q.stem));
    for (const n of FORMS) expect(realContent.mockForm(n).filter((q) => drill.has(q.stem))).toEqual([]);
  });
  it('batch-3 verification fixes', () => {
    expect(realContent.lesson('P13')).not.toMatch(/Never put "will" or "would" in the if-clause/);
    const w = realContent.allWords();
    expect(w.filter((x) => ['analyse', 'labour', 'maximise', 'utilise'].includes(x.headword)).map((x) => x.headword), 'TOEFL uses American spelling').toEqual([]);
    expect(realContent.drillItems('P14').find((q) => q.id === 'P14-d09')?.stem).not.toMatch(/wanted/);
  });
  it('trigger words are never underlined in paired-conjunction, causative and subjunctive items (changing them would also fix the sentence)', () => {
    const TRIGGERS = /^(both|either|neither|not only|had|have|has|make|made|let|lets|get|got|require|requires|required|recommend|recommended|insisted|urged|demanded|ordered|suggested)$/i;
    // A trigger may be underlined only when it is itself the error, or when changing it cannot repair the sentence
    // because another, non-underlined word still breaks the pattern (P25-d08: "carry"; M4-40: "be").
    const ok = new Set(['P25-d08', 'M4-40']);
    const bad = allBankQuestions().filter((q) => ['P23', 'P24', 'P25'].includes(q.patternId) && q.type === 'written-expression' && !ok.has(q.id)
      && q.options.some((o, i) => i !== q.answerIndex && TRIGGERS.test(o.trim())));
    expect(bad.map((q) => q.id)).toEqual([]);
  });
  it('subjunctive items avoid "insist" and "suggest" (both also take a factual that-clause)', () => {
    expect(allBankQuestions().filter((q) => q.patternId === 'P25' && /\b(insist|suggest)/.test(q.stem + q.options.join(' '))).map((q) => q.id)).toEqual([]);
  });
  it('batch-4 verification fixes', () => {
    const all = allBankQuestions();
    expect(all.find((q) => q.id === 'P20-d02')?.options).not.toContain('heavyweight');
    expect(all.find((q) => q.id === 'M4-19')?.stem).not.toMatch(/Over the past/);
    const w = Object.fromEntries(realContent.allWords().map((x) => [x.headword, x]));
    expect(w.nuclear.examples.join(' ')).not.toMatch(/without burning fuel/);
    expect(w.found.forms).not.toContain('foundation');
    expect(w.medium.forms).not.toContain('media');
    expect(realContent.lesson('P25')).not.toMatch(/insisted that all residents left/);
  });
  it('forms 5–6 verification fixes', () => {
    const q = Object.fromEntries(allBankQuestions().map((x) => [x.id, x]));
    expect(q['M5-36'].options).not.toContain('between'); // "interaction of X with Y" is also correct
    expect(q['M6-32'].stem).not.toMatch(/most valuable/); // "a most valuable" = "a very valuable"
    expect(q['M5-28'].options).not.toContain('vast'); // "a vast herd" would also fix it
  });
});

