import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../src/ui/App';
import { createMemoryStore, type ProgressStore } from '../../src/storage/store';
import type { ContentSource } from '../../src/content';
import type { Question } from '../../src/domain/types';

const drill = (i: number): Question => ({ id: `d${i}`, patternId: 'P01', type: 'structure', source: 'drill', stem: `Drill ${i} ____.`, options: ['w', 'x', 'y', 'z'], answerIndex: 0, explanation: 'e' });
const content: ContentSource = {
  drillItems: (p) => (p === 'P01' ? Array.from({ length: 10 }, (_, i) => drill(i)) : []),
  mockForm: () => [],
  availableMockForms: () => [],
  allWords: () => [],
  lesson: (p) => (p === 'P01' ? '# Subject and verb\n\nEvery clause needs a **subject** and a verb.' : ''),
};
const at = (y: number, m: number, d: number, h = 7) => () => new Date(y, m - 1, d, h, 0);

function app(store: ProgressStore, clock = at(2026, 11, 9), hash = '#/') {
  window.location.hash = hash;
  return render(<App store={store} content={content} clock={clock} />);
}

describe('screens', () => {
  it('Home shows Day 1 · Week 1 and the P01 title on first run', async () => {
    app(createMemoryStore());
    expect(await screen.findByText(/Day 1 · Week 1/)).toBeInTheDocument();
    expect(screen.getByText(/Subject and verb: missing subject or verb/)).toBeInTheDocument();
  });

  it('Home shows the storage banner with the memory store', async () => {
    app(createMemoryStore());
    expect(await screen.findByText(/Progress won't be saved on this device/)).toBeInTheDocument();
  });

  it('Home shows Resume session when a draft exists', async () => {
    const store = createMemoryStore();
    await store.saveDraft({ kind: 'afternoon', questions: [drill(1)], answered: {}, startedAt: 0, deadlineAt: null });
    app(store);
    expect(await screen.findByRole('button', { name: /Resume session/ })).toBeInTheDocument();
  });

  it('a wrong answer appears in My mistakes and leaves after two correct answers', async () => {
    const store = createMemoryStore();
    await store.recordAttempt({ questionId: 'g1', patternId: 'P01', correct: false, ms: 1, at: 1, source: 'generated', sessionKind: 'newset',
      question: { ...drill(99), id: 'g1', source: 'generated', stem: 'Saved generated ____.' } });
    app(store);
    expect(await screen.findByText(/1 questions to review/)).toBeInTheDocument();
    window.location.hash = '#/review';
    fireEvent(window, new HashChangeEvent('hashchange'));
    fireEvent.click(await screen.findByRole('button', { name: 'Start review' }));
    expect(await screen.findByText(/Saved generated/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^A/ }));
    expect(await screen.findByText('Correct!')).toBeInTheDocument();
    const attempts = await store.getAttempts();
    expect(attempts.at(-1)).toMatchObject({ questionId: 'g1', correct: true, sessionKind: 'review' });
  });

  it('Home shows the pace message when a test date is set', async () => {
    const store = createMemoryStore();
    await store.saveSettings({ newWordsPerDay: 15, testDate: '2027-02-05' });
    app(store);
    expect(await screen.findByText(/At this pace you'll finish week 8 on/)).toBeInTheDocument();
  });

  it('Settings import of an invalid file shows an error and keeps the data', async () => {
    const store = createMemoryStore();
    await store.recordAttempt({ questionId: 'q', patternId: 'P01', correct: true, ms: 1, at: 1, source: 'drill', sessionKind: 'morning' });
    app(store, at(2026, 11, 9), '#/settings');
    const input = await screen.findByLabelText(/Import backup/);
    const file = new File(['{"version": 9}'], 'backup.json', { type: 'application/json' });
    Object.defineProperty(file, 'text', { value: () => Promise.resolve('{"version": 9}') });
    fireEvent.change(input, { target: { files: [file] } });
    expect(await screen.findByText(/Unsupported backup version/)).toBeInTheDocument();
    expect(await store.getAttempts()).toHaveLength(1);
  });

  it('Progress chart marks repeat forms with a hollow marker', async () => {
    const store = createMemoryStore();
    await store.addMockResult({ form: 1, raw: 20, scaled: 44, repeat: false, at: 1 });
    await store.addMockResult({ form: 1, raw: 25, scaled: 49, repeat: true, at: 2 });
    const { container } = app(store, at(2026, 11, 9), '#/progress');
    await screen.findByText(/Estimated Structure score/);
    expect(container.querySelectorAll('circle.point')).toHaveLength(2);
    expect(container.querySelectorAll('circle.point.repeat')).toHaveLength(1);
  });

  it('completing the morning flow advances to Day 2 only on the next date', async () => {
    const store = createMemoryStore();
    const { unmount } = app(store, at(2026, 11, 9), '#/morning');
    fireEvent.click(await screen.findByRole('button', { name: /Continue/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Start the drill/ }));
    for (let i = 0; i < 15; i++) {
      const opts = await screen.findAllByRole('button', { name: /^A\. / });
      fireEvent.click(opts[0]);
      fireEvent.click(await screen.findByRole('button', { name: /Next/ }));
    }
    expect(await screen.findByText(/Morning session complete/)).toBeInTheDocument();
    await waitFor(async () => expect((await store.getPlan())?.planDay).toBe(2));
    unmount();
    app(store, at(2026, 11, 9, 17), '#/');
    expect(await screen.findByText(/Day 2 · Week 1/)).toBeInTheDocument();
    expect(screen.getByText(/Morning done/)).toBeInTheDocument();
  });
});
