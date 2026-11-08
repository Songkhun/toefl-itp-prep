import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { openStore, createMemoryStore, ImportError, type ProgressStore, type Attempt } from '../../src/storage/store';

const attempt: Attempt = { questionId: 'q1', patternId: 'P01', correct: true, ms: 12000, at: 1000, source: 'drill', sessionKind: 'morning' };

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

async function fill(s: ProgressStore) {
  await s.saveSettings({ newWordsPerDay: 20, testDate: '2027-02-05' });
  await s.recordAttempt(attempt);
  await s.recordAttempt({ ...attempt, questionId: 'q2', correct: false });
  await s.saveCard({ wordId: 'w1', ease: 2.5, intervalDays: 1, reps: 1, dueAt: 5000, lapses: 0 });
  await s.savePlan({ startDate: '2026-11-09', planDay: 3, lastCompletedDate: '2026-11-11' });
  await s.addMockResult({ form: 1, raw: 25, scaled: 49, repeat: false, at: 2000 });
  await s.saveDraft({ kind: 'mock', questions: [], answered: { a: 1 }, startedAt: 1, deadlineAt: 2 });
}

describe('ProgressStore (IndexedDB)', () => {
  it('returns default settings on a fresh store', async () => {
    const s = await openStore();
    expect(await s.getSettings()).toEqual({ newWordsPerDay: 15, testDate: null });
    expect(s.persistent).toBe(true);
  });

  it('round-trips settings, attempts, cards, plan, mocks, draft', async () => {
    const s = await openStore();
    await fill(s);
    expect(await s.getSettings()).toEqual({ newWordsPerDay: 20, testDate: '2027-02-05' });
    expect((await s.getAttempts()).map((a) => a.questionId)).toEqual(['q1', 'q2']);
    expect(await s.getCards()).toHaveLength(1);
    expect((await s.getPlan())?.planDay).toBe(3);
    expect((await s.getMockResults())[0].scaled).toBe(49);
    expect((await s.getDraft())?.answered).toEqual({ a: 1 });
    await s.clearDraft();
    expect(await s.getDraft()).toBeNull();
  });

  it('exportAll then importAll into a fresh store reproduces the same data', async () => {
    const a = await openStore();
    await fill(a);
    const backup = await a.exportAll();
    globalThis.indexedDB = new IDBFactory();
    const b = await openStore();
    await b.importAll(JSON.parse(JSON.stringify(backup)));
    const again = await b.exportAll();
    expect({ ...again, exportedAt: 0 }).toEqual({ ...backup, exportedAt: 0 });
  });

  it('importAll rejects {version: 2} with ImportError and leaves existing attempts unchanged', async () => {
    const s = await openStore();
    await fill(s);
    const bad = { ...(await s.exportAll()), version: 2, attempts: [] };
    await expect(s.importAll(bad)).rejects.toBeInstanceOf(ImportError);
    expect(await s.getAttempts()).toHaveLength(2);
  });

  it('importAll rejects non-backup-shaped input', async () => {
    const s = await openStore();
    await expect(s.importAll('hello')).rejects.toBeInstanceOf(ImportError);
    await expect(s.importAll({ version: 1, attempts: 'x' })).rejects.toBeInstanceOf(ImportError);
    await expect(s.importAll({ version: 1, attempts: [{ nope: 1 }], cards: [], plan: null, settings: { newWordsPerDay: 15, testDate: null }, mocks: [] })).rejects.toBeInstanceOf(ImportError);
  });

  it('openStore falls back to memory with persistent === false when indexedDB is undefined', async () => {
    // @ts-expect-error simulate missing IndexedDB
    delete globalThis.indexedDB;
    const s = await openStore();
    expect(s.persistent).toBe(false);
    await s.recordAttempt(attempt);
    expect(await s.getAttempts()).toHaveLength(1);
  });
});

describe('createMemoryStore', () => {
  it('supports export/import round trip', async () => {
    const a = createMemoryStore();
    await fill(a);
    const b = createMemoryStore();
    await b.importAll(await a.exportAll());
    expect(await b.getAttempts()).toHaveLength(2);
  });
});

describe('M2: an answer and its draft are saved together', () => {
  const draft = { kind: 'morning' as const, questions: [], answered: { q1: 0 }, startedAt: 1, deadlineAt: null };
  it('recordAnswer stores both the attempt and the draft', async () => {
    const s = await openStore();
    await s.recordAnswer(attempt, draft);
    expect(await s.getAttempts()).toHaveLength(1);
    expect((await s.getDraft())?.answered).toEqual({ q1: 0 });
  });
  it('if the draft cannot be saved, the attempt is not saved either', async () => {
    const s = await openStore();
    const bad = { ...draft, meta: { f: () => 1 } }; // functions cannot be stored, so the write fails
    await expect(s.recordAnswer(attempt, bad)).rejects.toThrow();
    expect(await s.getAttempts()).toHaveLength(0);
    expect(await s.getDraft()).toBeNull();
  });
});

describe('M6: import checks values, not only types', () => {
  const base = () => ({ version: 1, exportedAt: 0, attempts: [{ ...attempt }], cards: [], plan: { startDate: '2026-11-09', planDay: 3, lastCompletedDate: null }, settings: { newWordsPerDay: 15, testDate: null }, mocks: [] });
  const bad: [string, (b: ReturnType<typeof base>) => void][] = [
    ['planDay 0', (b) => { b.plan.planDay = 0; }],
    ['planDay 85', (b) => { b.plan.planDay = 85; }],
    ['planDay 2.5', (b) => { b.plan.planDay = 2.5; }],
    ['unknown pattern', (b) => { (b.attempts[0] as Record<string, unknown>).patternId = 'P99'; }],
    ['unknown source', (b) => { (b.attempts[0] as Record<string, unknown>).source = 'book'; }],
    ['unknown session kind', (b) => { (b.attempts[0] as Record<string, unknown>).sessionKind = 'evening'; }],
    ['newWordsPerDay 1000', (b) => { b.settings.newWordsPerDay = 1000; }],
    ['mock form 0', (b) => { (b.mocks as unknown[]).push({ form: 0, raw: 20, scaled: 45, repeat: false, at: 1 }); }],
    ['raw score 41', (b) => { (b.mocks as unknown[]).push({ form: 1, raw: 41, scaled: 45, repeat: false, at: 1 }); }],
  ];
  it.each(bad)('rejects %s and keeps existing data', async (_n, mutate) => {
    const s = createMemoryStore();
    await s.recordAttempt({ ...attempt, questionId: 'keep' });
    const b = base(); mutate(b);
    await expect(s.importAll(b)).rejects.toBeInstanceOf(ImportError);
    expect((await s.getAttempts()).map((a) => a.questionId)).toEqual(['keep']);
  });
  it('still accepts a valid backup', async () => {
    await expect(createMemoryStore().importAll(base())).resolves.toBeUndefined();
  });
});
