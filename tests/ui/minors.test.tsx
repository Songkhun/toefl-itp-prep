import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/ui/App';
import { createMemoryStore } from '../../src/storage/store';
import type { ContentSource } from '../../src/content';
import type { Question } from '../../src/domain/types';

const q = (i: number): Question => ({ id: `q${i}`, patternId: 'P01', type: 'structure', source: 'drill', stem: `Item ${i} ____.`, options: ['w', 'x', 'y', 'z'], answerIndex: 0, explanation: 'Why it is w.' });
const empty: ContentSource = { drillItems: () => [], mockForm: () => [], availableMockForms: () => [], allWords: () => [], lesson: () => '' };
const day = () => new Date(2026, 10, 9, 7);
const app = (store = createMemoryStore(), hash = '#/', content = empty) => { window.location.hash = hash; return render(<App store={store} content={content} clock={day} />); };

describe('M1: storage warning on every screen', () => {
  it('shows on Settings too', async () => {
    app(createMemoryStore(), '#/settings');
    expect(await screen.findByText(/Progress won't be saved on this device/)).toBeInTheDocument();
  });
});

describe('M4: practice set keeps instant feedback on resume', () => {
  it('resumed newset draft shows the explanation after answering', async () => {
    const store = createMemoryStore();
    await store.saveDraft({ kind: 'newset', questions: [q(1), q(2)], answered: {}, startedAt: 0, deadlineAt: null, meta: { instantFeedback: true } });
    app(store, '#/resume', { ...empty, drillItems: () => [q(1)] });
    fireEvent.click(await screen.findByRole('button', { name: /^A\. / }));
    expect(await screen.findByText(/Why it is w/)).toBeInTheDocument();
  });
});

describe('M9: New set with no content', () => {
  it('shows a message instead of doing nothing', async () => {
    const store = createMemoryStore();
    await store.savePlan({ startDate: '2026-11-01', planDay: 30, lastCompletedDate: null });
    app(store, '#/newset');
    fireEvent.change(await screen.findByLabelText('Pattern'), { target: { value: 'P22' } }); // not a studied pattern at plan day 30, so the choice is not available
    fireEvent.click(screen.getByRole('button', { name: /Make me a new set/ }));
    expect(await screen.findByText(/No questions are available for this choice yet/)).toBeInTheDocument();
  });
});

describe('M7: mock results use the app clock', () => {
  it('a resumed mock is dated by clock(), not the system time', async () => {
    const store = createMemoryStore();
    await store.saveDraft({ kind: 'mock', questions: [q(1)], answered: {}, startedAt: day().getTime(), deadlineAt: day().getTime() + 25 * 60_000, meta: { form: 1, repeat: false } });
    vi.spyOn(Date, 'now').mockReturnValue(day().getTime() + 1000);
    app(store, '#/resume');
    fireEvent.click(await screen.findByRole('button', { name: /^A\. / }));
    await screen.findByText(/Mock test result/);
    vi.restoreAllMocks();
    expect((await store.getMockResults())[0].at).toBe(day().getTime());
  });
});

describe('M8: time away from the app is not counted against a question', () => {
  afterEach(() => { vi.restoreAllMocks(); Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); });
  const setVisible = (v: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: v });
    document.dispatchEvent(new Event('visibilitychange'));
  };
  it('subtracts the hidden period from the recorded ms', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const store = createMemoryStore();
    await store.saveDraft({ kind: 'newset', questions: [q(1), q(2)], answered: {}, startedAt: 1_000, deadlineAt: null });
    app(store, '#/resume');
    const btn = await screen.findByRole('button', { name: /^A\. / });
    now.mockReturnValue(3_000); setVisible('hidden');
    now.mockReturnValue(603_000); setVisible('visible');
    now.mockReturnValue(604_000);
    fireEvent.click(btn);
    await screen.findByText('2 / 2');
    expect((await store.getAttempts())[0].ms).toBe(3_000);
  });
});
