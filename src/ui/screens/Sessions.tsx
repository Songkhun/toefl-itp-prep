import { useEffect, useState } from 'react';
import { useEnv } from '../context';
import { QuestionPlayer, type FinishResult } from '../QuestionPlayer';
import { ReviewList } from '../ReviewList';
import { Markdown } from '../Markdown';
import { VocabSession } from '../VocabSession';
import { completeMorning, localDate, startPlan, studiedPatterns, todayPlan, type TodayPlan } from '../../plan/plan';
import { buildAfternoonSet, buildMock, buildMorningDrill, buildNewSet } from '../../session/build';
import { patternAccuracy } from '../../stats/patternStats';
import { rawToScaledStructure } from '../../scoring/estimate';
import { PATTERNS } from '../../content/patterns';
import type { PatternId, Question } from '../../domain/types';
import type { PlanState, SessionDraft } from '../../storage/store';

const seed = () => Math.floor(Math.random() * 2 ** 31);

/**
 * Shown before starting any session while an unfinished one exists, so it is never silently overwritten.
 * Discarding a mock still records it (unanswered = wrong) so the form counts as used.
 */
export function DraftGate({ children }: { children: React.ReactNode }) {
  const { store, clock, navigate } = useEnv();
  const [draft, setDraft] = useState<SessionDraft | null | undefined>(undefined);
  useEffect(() => { void store.getDraft().then(setDraft); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (draft === undefined) return <p className="muted">Loading…</p>;
  if (!draft) return <>{children}</>;
  const answered = Object.keys(draft.answered).length;
  const discard = async () => {
    if (!window.confirm(draft.kind === 'mock' ? 'Discard this mock? It will be scored now (unanswered questions count as wrong).' : 'Discard the unfinished session?')) return;
    if (draft.kind === 'mock') {
      const raw = draft.questions.filter((q) => draft.answered[q.id] === q.answerIndex).length;
      await store.addMockResult({ form: Number(draft.meta?.form ?? 0), raw, scaled: rawToScaledStructure(raw), repeat: !!draft.meta?.repeat, at: clock().getTime() });
    }
    await store.clearDraft();
    setDraft(null);
  };
  return (
    <div>
      <h1>Unfinished session</h1>
      <p className="card">You have an unfinished {draft.kind} session ({answered}/{draft.questions.length} answered). Resume it, or discard it to start something new.</p>
      <div className="row">
        <button className="primary" onClick={() => navigate('#/resume')}>Resume</button>
        <button onClick={() => void discard()}>Discard</button>
      </div>
    </div>
  );
}

function Done({ title, result, questions, children }: { title: string; result: FinishResult; questions: Question[]; children?: React.ReactNode }) {
  const { navigate } = useEnv();
  return (
    <div>
      <h1>{title}</h1>
      <p className="card">Score: <strong>{result.correct} / {result.total}</strong> · {Math.round(result.ms / 1000 / Math.max(1, Object.keys(result.answers).length))} s per question (target 37 s)</p>
      {children}
      <ReviewList questions={questions} answers={result.answers} />
      <button className="primary" onClick={() => navigate('#/')}>Back to home</button>
    </div>
  );
}

async function loadPlan(getPlan: () => Promise<PlanState | null>, today: string): Promise<PlanState> {
  return (await getPlan()) ?? startPlan(today);
}

export function Morning() {
  const { store, content, clock, navigate } = useEnv();
  const [plan, setPlan] = useState<{ state: PlanState; today: TodayPlan } | null>(null);
  const [step, setStep] = useState<'vocab' | 'lesson' | 'drill' | 'done'>('vocab');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<FinishResult | null>(null);

  useEffect(() => {
    void (async () => {
      const today = localDate(clock());
      const state = await loadPlan(() => store.getPlan(), today);
      const t = todayPlan(state, today);
      setPlan({ state, today: t });
      let qs = t.patternId ? buildMorningDrill(t.patternId, seed(), content) : [];
      // No content for today's pattern yet (or a review day): fall back to mixed review so the plan never gets stuck.
      if (!qs.length) qs = buildNewSet('mixed', studiedPatterns(state), seed(), content);
      setQuestions(qs);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!plan) return <p className="muted">Loading…</p>;
  if (!plan.today.morningAvailable && step !== 'done') {
    return <div><h1>Morning session</h1><p className="card">Today's morning session is already done. The next lesson unlocks tomorrow.</p><button onClick={() => navigate('#/')}>Back</button></div>;
  }
  const pattern = PATTERNS.find((p) => p.id === plan.today.patternId);

  if (step === 'vocab') return <div><h1>☀️ Vocabulary</h1><VocabSession onDone={() => setStep(plan.today.patternId ? 'lesson' : 'drill')} /></div>;
  if (step === 'lesson') {
    return (
      <div>
        <h1>{pattern?.title}</h1>
        <div className="card">{content.lesson(plan.today.patternId!) ? <Markdown source={content.lesson(plan.today.patternId!)} /> : <p>Lesson text coming soon. Go straight to the drill.</p>}</div>
        <button className="primary" onClick={() => setStep('drill')}>Start the drill</button>
      </div>
    );
  }
  if (step === 'drill') {
    return (
      <div>
        <h1>{pattern ? `Drill: ${pattern.title}` : 'Mixed review drill'}</h1>
        <QuestionPlayer store={store} kind="morning" questions={questions} instantFeedback onFinish={async (r) => {
          await store.savePlan(completeMorning(plan.state, localDate(clock())));
          setResult(r);
          setStep('done');
        }} />
      </div>
    );
  }
  return <Done title="Morning session complete 🎉" result={result!} questions={questions} />;
}

export function Afternoon() {
  const { store, content, clock, navigate } = useEnv();
  const [set, setSet] = useState<{ questions: Question[]; timeLimitMs: number } | null>(null);
  const [started, setStarted] = useState(false);
  const [suggestMock, setSuggestMock] = useState(false);
  const [result, setResult] = useState<FinishResult | null>(null);

  useEffect(() => {
    void (async () => {
      const today = localDate(clock());
      const [state, attempts, mocks] = await Promise.all([loadPlan(() => store.getPlan(), today), store.getAttempts(), store.getMockResults()]);
      setSet(buildAfternoonSet(studiedPatterns(state), patternAccuracy(attempts), seed(), content));
      const recent = mocks.some((m) => clock().getTime() - m.at < 7 * 86_400_000);
      setSuggestMock(todayPlan(state, today).week >= 2 && !recent && content.availableMockForms().length > 0);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!set) return <p className="muted">Loading…</p>;
  if (result) return <Done title="Afternoon set complete" result={result} questions={set.questions} />;
  if (!started) {
    return (
      <div>
        <h1>🕓 Afternoon timed set</h1>
        <p className="card">{set.questions.length} questions in {Math.round(set.timeLimitMs / 60000)} minutes. Structure questions come first, then Written Expression — just like the real test. Questions are weighted toward your weakest patterns.</p>
        <button className="primary" onClick={() => setStarted(true)}>Start timer</button>
        {suggestMock && <button onClick={() => navigate('#/mock')}>Take this week's mock test instead</button>}
      </div>
    );
  }
  return <QuestionPlayer store={store} kind="afternoon" questions={set.questions} timeLimitMs={set.timeLimitMs} onFinish={setResult} />;
}

export function Mock() {
  const { store, content, navigate } = useEnv();
  const [mock, setMock] = useState<ReturnType<typeof buildMock> | undefined>(undefined);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<FinishResult | null>(null);

  useEffect(() => { void store.getMockResults().then((h) => setMock(buildMock(h, content))); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (mock === undefined) return <p className="muted">Loading…</p>;
  if (mock === null) return <div><h1>Mock test</h1><p className="card">No mock test is available yet.</p><button onClick={() => navigate('#/')}>Back</button></div>;
  if (result) return <MockResultView result={result} questions={mock.questions} repeat={mock.repeat} />;
  if (!started) {
    return (
      <div>
        <h1>📝 Mock test — form {mock.form}</h1>
        <div className="card">
          <p>40 questions in 25 minutes: 15 Structure, then 25 Written Expression. The timer keeps running if you leave the app.</p>
          {mock.repeat && <p className="muted">You have taken every form already, so this is a repeat. Its score may be higher than your true level.</p>}
        </div>
        <button className="primary" onClick={() => setStarted(true)}>Start the mock</button>
      </div>
    );
  }
  return <QuestionPlayer store={store} kind="mock" questions={mock.questions} timeLimitMs={mock.timeLimitMs} meta={{ form: mock.form, repeat: mock.repeat }}
    onFinish={async (r) => {
      await store.addMockResult({ form: mock.form, raw: r.correct, scaled: rawToScaledStructure(r.correct), repeat: mock.repeat, at: Date.now() });
      setResult(r);
    }} />;
}

function MockResultView({ result, questions, repeat }: { result: FinishResult; questions: Question[]; repeat: boolean }) {
  return (
    <Done title="Mock test result" result={result} questions={questions}>
      <div className="card ok">
        <div>Raw score: {result.correct} / 40</div>
        <div className="big">Estimated Structure score: {rawToScaledStructure(result.correct)} <span className="muted">(31–68)</span></div>
        <div className="muted">Estimated — ETS does not publish an official conversion table. Target for 600: about 60.</div>
        {repeat && <div className="muted">Repeat form: this score may be inflated.</div>}
      </div>
    </Done>
  );
}

export function Resume() {
  const { store, clock, navigate } = useEnv();
  const [draft, setDraft] = useState<SessionDraft | null | undefined>(undefined);
  const [result, setResult] = useState<FinishResult | null>(null);
  useEffect(() => { void store.getDraft().then(setDraft); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (draft === undefined) return <p className="muted">Loading…</p>;
  if (!draft) return <div><p className="card">Nothing to resume.</p><button onClick={() => navigate('#/')}>Back</button></div>;
  if (result) {
    if (draft.kind === 'mock') return <MockResultView result={result} questions={draft.questions} repeat={!!draft.meta?.repeat} />;
    return <Done title="Session complete" result={result} questions={draft.questions} />;
  }
  return <QuestionPlayer store={store} kind={draft.kind} questions={draft.questions} draft={draft} meta={draft.meta} instantFeedback={draft.kind === 'morning'}
    onFinish={async (r) => {
      if (draft.kind === 'mock') {
        await store.addMockResult({ form: Number(draft.meta?.form ?? 0), raw: r.correct, scaled: rawToScaledStructure(r.correct), repeat: !!draft.meta?.repeat, at: Date.now() });
      }
      if (draft.kind === 'morning') {
        const today = localDate(clock());
        const plan = await store.getPlan();
        if (plan) await store.savePlan(completeMorning(plan, today));
      }
      setResult(r);
    }} />;
}

export function NewSet() {
  const { store, content, clock } = useEnv();
  const [studied, setStudied] = useState<PatternId[] | null>(null);
  const [choice, setChoice] = useState<PatternId | 'mixed'>('mixed');
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [result, setResult] = useState<FinishResult | null>(null);
  useEffect(() => {
    void loadPlan(() => store.getPlan(), localDate(clock())).then((p) => {
      const s = studiedPatterns(p);
      setStudied(s.length ? s : ['P01']);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!studied) return <p className="muted">Loading…</p>;
  if (questions && result) return <Done title="Practice set complete" result={result} questions={questions} />;
  if (questions) return <QuestionPlayer store={store} kind="newset" questions={questions} instantFeedback onFinish={setResult} />;
  return (
    <div>
      <h1>🔄 New practice set</h1>
      <p className="muted">15 fresh questions. Pick a grammar pattern you've studied, or mix them all.</p>
      <label htmlFor="pattern">Pattern</label>
      <select id="pattern" value={choice} onChange={(e) => setChoice(e.target.value as PatternId | 'mixed')} style={{ width: '100%' }}>
        <option value="mixed">Mixed (all studied patterns)</option>
        {PATTERNS.filter((p) => studied.includes(p.id)).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
      </select>
      <p />
      <button className="primary" onClick={() => {
        const qs = buildNewSet(choice, studied, seed(), content);
        if (qs.length) setQuestions(qs);
      }}>Make me a new set</button>
    </div>
  );
}

export function Vocab() {
  const { navigate } = useEnv();
  return <div><h1>📚 Vocabulary</h1><VocabSession onDone={() => navigate('#/')} /></div>;
}
