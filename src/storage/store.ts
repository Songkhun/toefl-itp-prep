import { openDB, type IDBPDatabase } from 'idb';
import { PATTERN_IDS, type PatternId, type Question, type Source } from '../domain/types';
import { PLAN_DAYS } from '../plan/plan';

export type SessionKind = 'morning' | 'afternoon' | 'mock' | 'newset' | 'review';

export interface Attempt {
  questionId: string;
  patternId: PatternId;
  correct: boolean;
  ms: number;
  at: number;
  source: Source;
  sessionKind: SessionKind;
  /** Copy of the question, kept on wrong answers (not fixed mock forms) so it can be reviewed later; generated items cannot be rebuilt from their id. */
  question?: Question;
}
export interface CardState { wordId: string; ease: number; intervalDays: number; reps: number; dueAt: number; lapses: number; /** local date the word was first introduced */ introducedOn?: string }
/** planDay 1..84; dates are local 'YYYY-MM-DD' */
export interface PlanState { startDate: string; planDay: number; lastCompletedDate: string | null }
export interface Settings { newWordsPerDay: number; testDate: string | null; /** epoch ms of the last backup export */ lastExportAt?: number }
export interface MockResult { form: number; raw: number; scaled: number; repeat: boolean; at: number }
export interface SessionDraft {
  kind: SessionKind;
  /** full questions, since generated items cannot be rebuilt from ids */
  questions: Question[];
  answered: Record<string, number>;
  startedAt: number;
  deadlineAt: number | null;
  /** extra context a screen needs to resume, e.g. mock form number */
  meta?: Record<string, unknown>;
}
export interface BackupV1 {
  version: 1;
  exportedAt: number;
  attempts: Attempt[];
  cards: CardState[];
  plan: PlanState | null;
  settings: Settings;
  mocks: MockResult[];
}

export interface ProgressStore {
  persistent: boolean;
  getSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<void>;
  recordAttempt(a: Attempt): Promise<void>;
  /** Saves an answer and the updated draft in one transaction: both are written or neither is. */
  recordAnswer(a: Attempt, d: SessionDraft): Promise<void>;
  getAttempts(): Promise<Attempt[]>;
  getCards(): Promise<CardState[]>;
  saveCard(c: CardState): Promise<void>;
  getPlan(): Promise<PlanState | null>;
  savePlan(p: PlanState): Promise<void>;
  addMockResult(m: MockResult): Promise<void>;
  getMockResults(): Promise<MockResult[]>;
  getDraft(): Promise<SessionDraft | null>;
  saveDraft(d: SessionDraft): Promise<void>;
  clearDraft(): Promise<void>;
  exportAll(): Promise<BackupV1>;
  /** Throws ImportError on invalid input; existing data is untouched on failure. */
  importAll(data: unknown): Promise<void>;
}

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportError';
  }
}

export const DEFAULT_SETTINGS: Settings = { newWordsPerDay: 15, testDate: null };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const isStr = (v: unknown) => typeof v === 'string';
const isInt = (v: unknown, min: number, max: number) => Number.isInteger(v) && (v as number) >= min && (v as number) <= max;
const oneOf = (v: unknown, list: readonly string[]) => typeof v === 'string' && list.includes(v);
const SOURCES: readonly Source[] = ['drill', 'mock', 'generated'];
const KINDS: readonly SessionKind[] = ['morning', 'afternoon', 'mock', 'newset', 'review'];
const isQuestion = (q: unknown) => isObj(q) && isStr(q.id) && oneOf(q.patternId, PATTERN_IDS) && oneOf(q.type, ['structure', 'written-expression'])
  && isStr(q.stem) && Array.isArray(q.options) && q.options.length === 4 && q.options.every(isStr) && isInt(q.answerIndex, 0, 3) && isStr(q.explanation);
const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

function checkArray(name: string, v: unknown, ok: (x: Record<string, unknown>) => boolean): void {
  if (!Array.isArray(v)) throw new ImportError(`Backup is missing the "${name}" list.`);
  v.forEach((x, i) => {
    if (!isObj(x) || !ok(x)) throw new ImportError(`Backup entry ${name}[${i}] is not valid.`);
  });
}

export function validateBackup(data: unknown): BackupV1 {
  if (!isObj(data)) throw new ImportError('This file is not a TOEFL ITP Prep backup.');
  if (data.version !== 1) throw new ImportError(`Unsupported backup version: ${String(data.version)}.`);
  checkArray('attempts', data.attempts, (a) =>
    isStr(a.questionId) && oneOf(a.patternId, PATTERN_IDS) && typeof a.correct === 'boolean' && isNum(a.ms) && (a.ms as number) >= 0 && isNum(a.at) && oneOf(a.source, SOURCES) && oneOf(a.sessionKind, KINDS) && (a.question === undefined || isQuestion(a.question)));
  checkArray('cards', data.cards, (c) =>
    isStr(c.wordId) && isNum(c.ease) && (c.ease as number) > 0 && isNum(c.intervalDays) && (c.intervalDays as number) >= 0 && isInt(c.reps, 0, Infinity) && isNum(c.dueAt) && isInt(c.lapses, 0, Infinity));
  checkArray('mocks', data.mocks, (m) =>
    isInt(m.form, 1, Infinity) && isInt(m.raw, 0, 40) && isNum(m.scaled) && typeof m.repeat === 'boolean' && isNum(m.at));
  const p = data.plan;
  if (p !== null && !(isObj(p) && isDate(p.startDate) && isInt(p.planDay, 1, PLAN_DAYS) && (p.lastCompletedDate === null || isDate(p.lastCompletedDate))))
    throw new ImportError('Backup plan data is not valid.');
  const s = data.settings;
  if (!(isObj(s) && isInt(s.newWordsPerDay, 5, 40) && (s.testDate === null || isDate(s.testDate))))
    throw new ImportError('Backup settings are not valid.');
  return data as unknown as BackupV1;
}

export function createMemoryStore(): ProgressStore {
  let settings: Settings = { ...DEFAULT_SETTINGS };
  let attempts: Attempt[] = [];
  let cards = new Map<string, CardState>();
  let plan: PlanState | null = null;
  let mocks: MockResult[] = [];
  let draft: SessionDraft | null = null;
  const clone = <T>(v: T): T => structuredClone(v);
  return {
    persistent: false,
    getSettings: async () => clone(settings),
    saveSettings: async (s) => { settings = clone(s); },
    recordAttempt: async (a) => { attempts.push(clone(a)); },
    recordAnswer: async (a, d) => { const ca = clone(a); const cd = clone(d); attempts.push(ca); draft = cd; },
    getAttempts: async () => clone(attempts),
    getCards: async () => clone([...cards.values()]),
    saveCard: async (c) => { cards.set(c.wordId, clone(c)); },
    getPlan: async () => clone(plan),
    savePlan: async (p) => { plan = clone(p); },
    addMockResult: async (m) => { mocks.push(clone(m)); },
    getMockResults: async () => clone(mocks),
    getDraft: async () => clone(draft),
    saveDraft: async (d) => { draft = clone(d); },
    clearDraft: async () => { draft = null; },
    exportAll: async () => ({ version: 1, exportedAt: Date.now(), attempts: clone(attempts), cards: clone([...cards.values()]), plan: clone(plan), settings: clone(settings), mocks: clone(mocks) }),
    importAll: async (data) => {
      const b = clone(validateBackup(data));
      attempts = b.attempts;
      cards = new Map(b.cards.map((c) => [c.wordId, c]));
      plan = b.plan;
      settings = b.settings;
      mocks = b.mocks;
      draft = null;
    },
  };
}

const DB_NAME = 'toefl-itp';
type Db = IDBPDatabase;

function idbStore(db: Db): ProgressStore {
  const kvGet = async <T>(key: string): Promise<T | undefined> => db.get('kv', key) as Promise<T | undefined>;
  const kvPut = async (key: string, value: unknown) => { await db.put('kv', value, key); };
  return {
    persistent: true,
    getSettings: async () => (await kvGet<Settings>('settings')) ?? { ...DEFAULT_SETTINGS },
    saveSettings: (s) => kvPut('settings', s),
    recordAttempt: async (a) => { await db.add('attempts', a); },
    recordAnswer: async (a, d) => {
      const tx = db.transaction(['attempts', 'kv'], 'readwrite');
      const done = tx.done;
      done.catch(() => undefined); // awaited below; avoid an unhandled rejection if we abort first
      try {
        const added = tx.objectStore('attempts').add(a);
        added.catch(() => undefined);
        await tx.objectStore('kv').put(d, 'draft');
        await added;
      } catch (e) {
        try { tx.abort(); } catch { /* already aborted */ }
        throw e;
      }
      await done;
    },
    getAttempts: () => db.getAll('attempts') as Promise<Attempt[]>,
    getCards: () => db.getAll('cards') as Promise<CardState[]>,
    saveCard: async (c) => { await db.put('cards', c); },
    getPlan: async () => (await kvGet<PlanState>('plan')) ?? null,
    savePlan: (p) => kvPut('plan', p),
    addMockResult: async (m) => { await db.add('mocks', m); },
    getMockResults: () => db.getAll('mocks') as Promise<MockResult[]>,
    getDraft: async () => (await kvGet<SessionDraft>('draft')) ?? null,
    saveDraft: (d) => kvPut('draft', d),
    clearDraft: async () => { await db.delete('kv', 'draft'); },
    exportAll: async () => {
      const tx = db.transaction(['kv', 'attempts', 'cards', 'mocks']);
      const [settings, plan, attempts, cards, mocks] = await Promise.all([
        tx.objectStore('kv').get('settings'),
        tx.objectStore('kv').get('plan'),
        tx.objectStore('attempts').getAll(),
        tx.objectStore('cards').getAll(),
        tx.objectStore('mocks').getAll(),
      ]);
      await tx.done;
      return { version: 1, exportedAt: Date.now(), attempts, cards, plan: plan ?? null, settings: settings ?? { ...DEFAULT_SETTINGS }, mocks };
    },
    importAll: async (data) => {
      const b = validateBackup(data);
      const tx = db.transaction(['kv', 'attempts', 'cards', 'mocks'], 'readwrite');
      const kv = tx.objectStore('kv');
      await Promise.all([kv.clear(), tx.objectStore('attempts').clear(), tx.objectStore('cards').clear(), tx.objectStore('mocks').clear()]);
      await kv.put(b.settings, 'settings');
      if (b.plan) await kv.put(b.plan, 'plan');
      for (const a of b.attempts) await tx.objectStore('attempts').add(a);
      for (const c of b.cards) await tx.objectStore('cards').put(c);
      for (const m of b.mocks) await tx.objectStore('mocks').add(m);
      await tx.done;
    },
  };
}

/** Opens the IndexedDB-backed store; falls back to an in-memory store (persistent=false) if IndexedDB is unavailable. */
export async function openStore(): Promise<ProgressStore> {
  try {
    if (typeof indexedDB === 'undefined') throw new Error('no indexedDB');
    const db = await openDB(DB_NAME, 1, {
      upgrade(d) {
        d.createObjectStore('kv');
        d.createObjectStore('attempts', { autoIncrement: true });
        d.createObjectStore('cards', { keyPath: 'wordId' });
        d.createObjectStore('mocks', { autoIncrement: true });
      },
    });
    // Ask the browser not to evict our data under storage pressure (best effort; ignored where unsupported).
    void navigator.storage?.persist?.().catch(() => undefined);
    return idbStore(db);
  } catch {
    return createMemoryStore();
  }
}
