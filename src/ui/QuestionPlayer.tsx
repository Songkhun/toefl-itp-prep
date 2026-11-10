import { useCallback, useEffect, useRef, useState } from 'react';
import type { Question } from '../domain/types';
import type { Attempt, ProgressStore, SessionDraft, SessionKind } from '../storage/store';
import { QuestionView } from './QuestionView';
import { formatMs, useDeadline } from './useDeadline';
import { SECONDS_PER_QUESTION } from '../session/build';

export interface FinishResult { answers: Record<string, number>; correct: number; total: number; ms: number }

interface Props {
  store: ProgressStore;
  kind: SessionKind;
  questions: Question[];
  timeLimitMs?: number;
  draft?: SessionDraft | null;
  instantFeedback?: boolean;
  meta?: Record<string, unknown>;
  onFinish: (r: FinishResult) => void;
}

export function QuestionPlayer({ store, kind, questions, timeLimitMs, draft, instantFeedback, meta, onFinish }: Props) {
  const [startedAt] = useState(() => draft?.startedAt ?? Date.now());
  const [deadlineAt] = useState<number | null>(() => draft ? draft.deadlineAt : timeLimitMs ? Date.now() + timeLimitMs : null);
  const [answers, setAnswers] = useState<Record<string, number>>(() => ({ ...(draft?.answered ?? {}) }));
  const [index, setIndex] = useState(() => {
    const i = questions.findIndex((q) => draft?.answered[q.id] === undefined);
    return i < 0 ? questions.length - 1 : i;
  });
  const [feedbackFor, setFeedbackFor] = useState<number | null>(null);
  const [saveError, setSaveError] = useState(false);
  const shownAt = useRef(Date.now());
  const finished = useRef(false);
  const { remainingMs, expired } = useDeadline(deadlineAt);

  const draftOf = useCallback((answered: Record<string, number>): SessionDraft => ({
    kind, questions, answered, startedAt, deadlineAt, meta: { ...meta, instantFeedback: !!instantFeedback },
  }), [kind, questions, startedAt, deadlineAt, meta, instantFeedback]);
  const persist = useCallback((answered: Record<string, number>) => store.saveDraft(draftOf(answered)), [store, draftOf]);
  /** The answer currently being saved; finish() waits for it so a late save cannot re-create a cleared draft. */
  const saving = useRef<Promise<unknown>>(Promise.resolve());

  // Time spent with the app in the background does not count towards the current question.
  useEffect(() => {
    let hiddenAt: number | null = null;
    const onVis = () => {
      if (document.visibilityState === 'hidden') hiddenAt = Date.now();
      else if (hiddenAt !== null) { shownAt.current += Date.now() - hiddenAt; hiddenAt = null; }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);


  const finish = useCallback(async (final: Record<string, number>) => {
    if (finished.current) return;
    finished.current = true;
    await saving.current.catch(() => undefined);
    await store.clearDraft();
    const correct = questions.filter((q) => final[q.id] === q.answerIndex).length;
    onFinish({ answers: final, correct, total: questions.length, ms: Date.now() - startedAt });
  }, [store, questions, onFinish, startedAt]);

  useEffect(() => {
    if (!questions.length) return;
    if (!draft) { void persist({}).catch(() => setSaveError(true)); return; }
    // A draft whose every question is answered (app closed on the last feedback screen) finishes straight away.
    if (questions.every((q) => draft.answered[q.id] !== undefined)) void finish(draft.answered);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (expired) void finish(answers); }, [expired]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = (next: Record<string, number>) => {
    setFeedbackFor(null);
    const nextIndex = questions.findIndex((q) => next[q.id] === undefined);
    if (nextIndex < 0) { void finish(next); return; }
    shownAt.current = Date.now();
    setIndex(nextIndex);
  };

  const choose = async (choice: number) => {
    const q = questions[index];
    if (answers[q.id] !== undefined || finished.current) return;
    const now = Date.now();
    const next = { ...answers, [q.id]: choice };
    setAnswers(next);
    try {
      const correct = choice === q.answerIndex;
      const attempt: Attempt = { questionId: q.id, patternId: q.patternId, correct, ms: Math.max(0, now - shownAt.current), at: now, source: q.source, sessionKind: kind };
      if (!correct && q.source !== 'mock') attempt.question = q;
      saving.current = store.recordAnswer(attempt, draftOf(next));
      await saving.current;
    } catch {
      setSaveError(true);
    }
    if (finished.current) return;
    if (instantFeedback) setFeedbackFor(index);
    else advance(next);
  };

  const q = questions[index];
  if (!q) return <p className="card">There are no questions available for this session yet. Try a New practice set instead.</p>;
  const answeredCount = Object.keys(answers).length;
  const elapsedS = (Date.now() - startedAt) / 1000;
  const pace = answeredCount ? Math.round(elapsedS / answeredCount) : null;
  const showing = feedbackFor === index;

  return (
    <div className="player">
      <div className="player-bar">
        <span>{index + 1} / {questions.length}</span>
        {deadlineAt !== null && (
          <span className={remainingMs < 60_000 ? 'timer low' : 'timer'} aria-label="time remaining">⏱ {formatMs(remainingMs)}</span>
        )}
        {deadlineAt !== null && pace !== null && (
          <span className={pace > SECONDS_PER_QUESTION ? 'pace slow' : 'pace'}>{pace}s/q (target {SECONDS_PER_QUESTION}s)</span>
        )}
      </div>
      {saveError && <div className="banner">Your answers couldn't be saved on this device (storage full or blocked). You can keep practising, but export a backup from Settings soon.</div>}
      <QuestionView q={q} onChoose={choose} chosen={showing ? answers[q.id] : undefined} disabled={showing} />
      {showing && (
        <div className={`card feedback ${answers[q.id] === q.answerIndex ? 'ok' : 'bad'}`}>
          <strong>{answers[q.id] === q.answerIndex ? 'Correct!' : `Not quite — the answer is ${'ABCD'[q.answerIndex]}.`}</strong>
          <p>{q.explanation}</p>
          <button className="primary" onClick={() => advance(answers)}>Next</button>
        </div>
      )}
    </div>
  );
}
