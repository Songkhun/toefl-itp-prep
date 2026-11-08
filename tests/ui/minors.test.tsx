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
    fireEvent.change(await screen.findByLabelText('Pattern'), { target: { value: 'P13' } });
    fireEvent.click(screen.getByRole('button', { name: /Make me a new set/ }));
    expect(await screen.findByText(/No questions are available for this choice yet/)).toBeInTheDocument();
  });
});
