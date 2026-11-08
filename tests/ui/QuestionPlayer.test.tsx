import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QuestionPlayer } from '../../src/ui/QuestionPlayer';
import { ReviewList } from '../../src/ui/ReviewList';
import { createMemoryStore } from '../../src/storage/store';
import type { Question } from '../../src/domain/types';

const s = (i: number): Question => ({ id: `s${i}`, patternId: 'P01', type: 'structure', source: 'drill', stem: `Stem ${i} ____ here.`, options: [`a${i}`, `b${i}`, `c${i}`, `d${i}`], answerIndex: 1, explanation: `Because ${i}.` });
const we: Question = { id: 'w1', patternId: 'P02', type: 'written-expression', source: 'generated', stem: '{0} of the {1} {2} every {3}.', options: ['The members', 'committee', 'meets', 'Thursday'], answerIndex: 2, explanation: 'Plural subject.' };

describe('QuestionPlayer', () => {
  it('records an attempt and saves draft after each answer', async () => {
    const store = createMemoryStore();
    render(<QuestionPlayer store={store} kind="afternoon" questions={[s(1), s(2)]} onFinish={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: /b1/ }));
    await waitFor(async () => expect(await store.getAttempts()).toHaveLength(1));
    const a = (await store.getAttempts())[0];
    expect(a).toMatchObject({ questionId: 's1', correct: true, sessionKind: 'afternoon', source: 'drill' });
    expect((await store.getDraft())?.answered).toEqual({ s1: 1 });
    expect(await screen.findByText(/Stem 2/)).toBeInTheDocument();
  });

  it('resuming with a draft starts at the first unanswered question', async () => {
    const store = createMemoryStore();
    const draft = { kind: 'afternoon' as const, questions: [s(1), s(2), s(3)], answered: { s1: 0, s2: 1 }, startedAt: 0, deadlineAt: null };
    render(<QuestionPlayer store={store} kind="afternoon" questions={draft.questions} draft={draft} onFinish={() => {}} />);
    expect(await screen.findByText(/Stem 3/)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument();
  });

  it('finishes with score and clears the draft after the last answer', async () => {
    const store = createMemoryStore();
    const onFinish = vi.fn();
    render(<QuestionPlayer store={store} kind="afternoon" questions={[s(1)]} onFinish={onFinish} />);
    fireEvent.click(await screen.findByRole('button', { name: /a1/ }));
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish.mock.calls[0][0]).toMatchObject({ correct: 0, total: 1, answers: { s1: 0 } });
    expect(await store.getDraft()).toBeNull();
  });

  it('on expiry, unanswered count as wrong and onFinish fires', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(1_000_000);
    const store = createMemoryStore();
    const onFinish = vi.fn();
    render(<QuestionPlayer store={store} kind="mock" questions={[s(1), s(2)]} timeLimitMs={60_000} onFinish={onFinish} />);
    await screen.findByText(/Stem 1/);
    act(() => {
      vi.setSystemTime(1_000_000 + 61_000);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await waitFor(() => expect(onFinish).toHaveBeenCalled());
    expect(onFinish.mock.calls[0][0]).toMatchObject({ correct: 0, total: 2 });
    vi.useRealTimers();
  });

  it('instant feedback shows the explanation before moving on', async () => {
    const store = createMemoryStore();
    render(<QuestionPlayer store={store} kind="morning" questions={[s(1), s(2)]} instantFeedback onFinish={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: /c1/ }));
    expect(await screen.findByText(/Because 1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/Stem 2/)).toBeInTheDocument();
  });

  it('WE stem renders four underlined labelled parts', async () => {
    const store = createMemoryStore();
    const { container } = render(<QuestionPlayer store={store} kind="newset" questions={[we]} onFinish={() => {}} />);
    await screen.findByText('committee');
    const us = container.querySelectorAll('u');
    expect([...us].map((u) => u.textContent)).toEqual(['The membersA', 'committeeB', 'meetsC', 'ThursdayD']);
  });
});

describe('ReviewList', () => {
  it('shows explanation for each wrong answer only', () => {
    render(<ReviewList questions={[s(1), s(2), s(3)]} answers={{ s1: 1, s2: 0 }} />);
    expect(screen.queryByText(/Because 1/)).toBeNull();
    expect(screen.getByText(/Because 2/)).toBeInTheDocument();
    expect(screen.getByText(/Because 3/)).toBeInTheDocument();
    expect(screen.getByText(/No answer/)).toBeInTheDocument();
  });
});
