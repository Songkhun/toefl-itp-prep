import { useEffect, useState } from 'react';
import { useEnv } from '../context';
import { localDate, pace, startPlan, todayPlan, type TodayPlan } from '../../plan/plan';
import { PATTERNS } from '../../content/patterns';
import type { SessionDraft, Settings } from '../../storage/store';
import { buildVocabQueue } from '../../srs/vocabQueue';

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function Home() {
  const { store, content, clock, navigate } = useEnv();
  const [state, setState] = useState<{ plan: TodayPlan; pace: ReturnType<typeof pace>; settings: Settings; draft: SessionDraft | null; afternoonDone: boolean; due: number; lastMockDaysAgo: number | null } | null>(null);

  useEffect(() => {
    void (async () => {
      const now = clock();
      const today = localDate(now);
      let plan = await store.getPlan();
      if (!plan) { plan = startPlan(today); await store.savePlan(plan); }
      const [settings, draft, attempts, cards, mocks] = await Promise.all([store.getSettings(), store.getDraft(), store.getAttempts(), store.getCards(), store.getMockResults()]);
      const afternoonDone = attempts.some((a) => (a.sessionKind === 'afternoon' || a.sessionKind === 'mock') && localDate(new Date(a.at)) === today);
      const q = buildVocabQueue({ words: content.allWords(), cards, now: now.getTime(), newWordsPerDay: 0, newIntroducedToday: 0 });
      const lastMock = mocks.length ? Math.max(...mocks.map((m) => m.at)) : null;
      setState({
        plan: todayPlan(plan, today), pace: pace(plan, today, settings.testDate), settings, draft, afternoonDone,
        due: q.reviews.length, lastMockDaysAgo: lastMock === null ? null : Math.floor((now.getTime() - lastMock) / 86_400_000),
      });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) return <p className="muted">Loading…</p>;
  const { plan } = state;
  const pattern = PATTERNS.find((p) => p.id === plan.patternId);
  const phaseText = plan.phase === 'learn' ? `Today's grammar: ${pattern?.title}` : plan.phase === 'review' ? 'Review day: mixed practice of patterns so far' : 'Final phase: mixed timed practice on your weakest patterns';

  return (
    <div>
      {!store.persistent && <div className="banner">Progress won't be saved on this device (browser storage is blocked, e.g. private mode). Use Settings → Export backup to keep your work.</div>}
      <h1>Day {plan.planDay} · Week {plan.week}</h1>
      <p className="muted">{phaseText}</p>
      {state.pace && (
        <div className={`banner ${state.pace.onPace ? '' : 'behind'}`}>
          At this pace you'll finish week 8 on {fmt(state.pace.projectedFinishWeek8)}; the test is {fmt(state.settings.testDate!)} ({state.pace.daysUntilTest} days away).
          {!state.pace.onPace && ' You are behind — try not to miss morning sessions.'}
        </div>
      )}
      {state.draft && (
        <button className="primary task" onClick={() => navigate('#/resume')}>
          <span>Resume session ({state.draft.kind}, {Object.keys(state.draft.answered).length}/{state.draft.questions.length} answered)</span><span>▶</span>
        </button>
      )}
      <h2>Today</h2>
      <button className="card task" onClick={() => plan.morningAvailable && navigate('#/morning')} disabled={!plan.morningAvailable}>
        <span><strong>☀️ Morning session</strong><br /><span className="muted">Vocabulary, then {plan.phase === 'learn' ? 'lesson + drill' : 'mixed drill'}</span></span>
        {plan.morningAvailable ? <span>Start ▶</span> : <span className="done">Morning done ✓</span>}
      </button>
      <button className="card task" onClick={() => navigate('#/afternoon')}>
        <span><strong>🕓 Afternoon timed set</strong><br /><span className="muted">20 questions at test pace (37 s each)</span></span>
        {state.afternoonDone ? <span className="done">Done ✓</span> : <span>Start ▶</span>}
      </button>
      <button className="card task" onClick={() => navigate('#/mock')}>
        <span><strong>📝 Weekly mock test</strong><br /><span className="muted">40 questions · 25 minutes · estimated score{state.lastMockDaysAgo !== null ? ` · last taken ${state.lastMockDaysAgo} days ago` : ''}</span></span>
        <span>▶</span>
      </button>
      <button className="card task" onClick={() => navigate('#/vocab')}>
        <span><strong>📚 Vocabulary</strong><br /><span className="muted">{state.due} cards due</span></span>
        <span>▶</span>
      </button>
    </div>
  );
}
