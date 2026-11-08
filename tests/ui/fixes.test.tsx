import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { App } from '../../src/ui/App';
import { QuestionPlayer } from '../../src/ui/QuestionPlayer';
import { createMemoryStore, type ProgressStore, type SessionDraft } from '../../src/storage/store';
import type { ContentSource } from '../../src/content';
import type { Question } from '../../src/domain/types';

const q = (i: number, over: Partial<Question> = {}): Question => ({ id: `q${i}`, patternId: 'P01', type: 'structure', source: 'drill', stem: `Item ${i} ____.`, options: ['w', 'x', 'y', 'z'], answerIndex: 0, explanation: 'e', ...over });
const mockQ = (i: number) => q(100 + i, { source: 'mock', mockForm: 1, id: `m${i}` });
const content: ContentSource = {
  drillItems: (p) => (p === 'P01' ? Array.from({ length: 10 }, (_, i) => q(i)) : []),
  mockForm: (n) => (n === 1 ? Array.from({ length: 40 }, (_, i) => mockQ(i)) : []),
  availableMockForms: () => [1],
  allWords: () => [],
  lesson: () => '',
};
const day = (d: number, h = 7) => new Date(2026, 10, d, h, 0);
function app(store: ProgressStore, clock: () => Date, hash: string) {
  window.location.hash = hash;
  return render(<App store={store} content={content} clock={clock} />);
}

describe('C1: resuming a fully answered draft finishes', () => {
  it('calls onFinish immediately and clears the draft', async () => {
    const store = createMemoryStore();
    const draft: SessionDraft = { kind: 'morning', questions: [q(1), q(2)], answered: { q1: 0, q2: 1 }, startedAt: 0, deadlineAt: null };
    await store.saveDraft(draft);
    const onFinish = vi.fn();
    render(<QuestionPlayer store={store} kind="morning" questions={draft.questions} draft={draft} onFinish={onFinish} />);
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    expect(onFinish.mock.calls[0][0]).toMatchObject({ correct: 1, total: 2 });
    expect(await store.getDraft()).toBeNull();
  });
});

describe('C2: expiry during a pending answer write', () => {
  it('does not re-save the draft after the session finished', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(1_000_000);
    const base = createMemoryStore();
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    const store: ProgressStore = { ...base, recordAttempt: async (a) => { await gate; await base.recordAttempt(a); } };
    const onFinish = vi.fn();
    render(<QuestionPlayer store={store} kind="mock" questions={[q(1), q(2)]} timeLimitMs={60_000} onFinish={onFinish} />);
    fireEvent.click(await screen.findByRole('button', { name: /^A\. / }));
    act(() => { vi.setSystemTime(1_000_000 + 61_000); document.dispatchEvent(new Event('visibilitychange')); });
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    release();
    await new Promise((r) => setTimeout(r, 20));
    expect(await base.getDraft()).toBeNull();
    vi.useRealTimers();
  });
});

describe('M3: a failed write does not dead-end the session', () => {
  it('still advances and shows a warning', async () => {
    const base = createMemoryStore();
    const store: ProgressStore = { ...base, recordAttempt: () => Promise.reject(new Error('quota')) };
    render(<QuestionPlayer store={store} kind="newset" questions={[q(1), q(2)]} onFinish={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: /^A\. / }));
    expect(await screen.findByText(/Item 2/)).toBeInTheDocument();
    expect(screen.getByText(/couldn't be saved/i)).toBeInTheDocument();
  });
});

describe('I1: empty question list', () => {
  it('player shows a message instead of a blank screen and saves no draft', async () => {
    const store = createMemoryStore();
    render(<QuestionPlayer store={store} kind="morning" questions={[]} onFinish={() => {}} />);
    expect(await screen.findByText(/no questions available/i)).toBeInTheDocument();
    expect(await store.getDraft()).toBeNull();
  });
  it('a learn day whose pattern has no content falls back to a mixed review drill', async () => {
    const store = createMemoryStore();
    await store.savePlan({ startDate: '2026-11-01', planDay: 15, lastCompletedDate: null });
    app(store, () => day(16), '#/morning');
    fireEvent.click(await screen.findByRole('button', { name: /Continue/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Start the drill/ }));
    expect(await screen.findByText(/1 \/ 15/)).toBeInTheDocument();
  });
});

describe('I2: unfinished session is not silently overwritten', () => {
  it('starting Practice with a mock draft asks to resume or discard; discard records the mock as taken', async () => {
    const store = createMemoryStore();
    const qs = content.mockForm(1);
    await store.saveDraft({ kind: 'mock', questions: qs, answered: { m0: 0, m1: 1 }, startedAt: 0, deadlineAt: Date.now() + 600_000, meta: { form: 1, repeat: false } });
    app(store, () => day(9), '#/newset');
    expect(await screen.findByText(/unfinished mock session/i)).toBeInTheDocument();
    window.confirm = () => true;
    fireEvent.click(screen.getByRole('button', { name: /Discard/ }));
    await waitFor(async () => expect(await store.getDraft()).toBeNull());
    const results = await store.getMockResults();
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ form: 1, raw: 1, repeat: false });
    expect(await screen.findByText(/New practice set/)).toBeInTheDocument();
  });
});

describe('I3: screens refresh when the app returns on a new day', () => {
  it('Home re-enables the morning after the date changes', async () => {
    const store = createMemoryStore();
    await store.savePlan({ startDate: '2026-11-09', planDay: 2, lastCompletedDate: '2026-11-09' });
    let now = day(9, 8);
    app(store, () => now, '#/');
    expect(await screen.findByText(/Morning done/)).toBeInTheDocument();
    now = day(10, 7);
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await waitFor(() => expect(screen.queryByText(/Morning done/)).toBeNull());
  });
});

describe('I4: backup reminder', () => {
  it('Home reminds to export when there is progress and no backup in 7 days', async () => {
    const store = createMemoryStore();
    await store.recordAttempt({ questionId: 'a', patternId: 'P01', correct: true, ms: 1, at: day(1).getTime(), source: 'drill', sessionKind: 'morning' });
    app(store, () => day(9), '#/');
    expect(await screen.findByText(/haven't backed up/i)).toBeInTheDocument();
  });
  it('no reminder after a recent export', async () => {
    const store = createMemoryStore();
    await store.recordAttempt({ questionId: 'a', patternId: 'P01', correct: true, ms: 1, at: day(1).getTime(), source: 'drill', sessionKind: 'morning' });
    await store.saveSettings({ newWordsPerDay: 15, testDate: null, lastExportAt: day(8).getTime() });
    app(store, () => day(9), '#/');
    await screen.findByText(/Day 1/);
    expect(screen.queryByText(/haven't backed up/i)).toBeNull();
  });
});

describe('I5: Resume screen side effects happen exactly once', () => {
  it('resuming a morning draft advances the plan by one day', async () => {
    const store = createMemoryStore();
    await store.savePlan({ startDate: '2026-11-09', planDay: 1, lastCompletedDate: null });
    await store.saveDraft({ kind: 'morning', questions: [q(1), q(2)], answered: { q1: 0 }, startedAt: 0, deadlineAt: null });
    app(store, () => day(9), '#/resume');
    fireEvent.click(await screen.findByRole('button', { name: /^A\. / }));
    fireEvent.click(await screen.findByRole('button', { name: /Next/ }));
    expect(await screen.findByText(/Session complete/)).toBeInTheDocument();
    expect((await store.getPlan())?.planDay).toBe(2);
  });
  it('resuming an expired mock draft records exactly one result', async () => {
    const store = createMemoryStore();
    await store.saveDraft({ kind: 'mock', questions: content.mockForm(1), answered: { m0: 0 }, startedAt: 0, deadlineAt: 1, meta: { form: 1, repeat: true } });
    app(store, () => day(9), '#/resume');
    expect(await screen.findByText(/Estimated Structure score/)).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 30));
    const r = await store.getMockResults();
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ form: 1, raw: 1, repeat: true });
  });
});
