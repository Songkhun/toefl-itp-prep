import { useEffect, useState } from 'react';
import { useEnv } from '../context';
import { localDate, addDays, startPlan, studiedPatterns } from '../../plan/plan';
import { patternAccuracy, weakestPatterns, MIN_ATTEMPTS_FOR_ACCURACY } from '../../stats/patternStats';
import { PATTERNS } from '../../content/patterns';
import type { Attempt, CardState, MockResult } from '../../storage/store';
import type { PatternId } from '../../domain/types';

export function streak(attempts: Attempt[], today: string): number {
  const days = new Set(attempts.map((a) => localDate(new Date(a.at))));
  let d = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}

function ScoreChart({ mocks }: { mocks: MockResult[] }) {
  const W = 320, H = 180, padL = 30, padB = 22, padT = 10;
  const lo = 31, hi = 68;
  const y = (v: number) => padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo));
  const n = mocks.length;
  const x = (i: number) => padL + (n <= 1 ? (W - padL - 10) / 2 : (i * (W - padL - 20)) / (n - 1) + 5);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Estimated Structure score over time">
      {[35, 45, 55, 65].map((v) => <g key={v}><line x1={padL} x2={W} y1={y(v)} y2={y(v)} stroke="var(--border)" /><text x={2} y={y(v) + 4}>{v}</text></g>)}
      <line x1={padL} x2={W} y1={y(60)} y2={y(60)} stroke="var(--ok)" strokeDasharray="5 4" />
      <text x={W - 70} y={y(60) - 4} style={{ fill: 'var(--ok)' }}>target 60</text>
      {n > 1 && <polyline fill="none" stroke="var(--accent)" strokeWidth={2} points={mocks.map((m, i) => `${x(i)},${y(m.scaled)}`).join(' ')} />}
      {mocks.map((m, i) => (
        <circle key={i} className={`point${m.repeat ? ' repeat' : ''}`} cx={x(i)} cy={y(m.scaled)} r={5}
          fill={m.repeat ? 'var(--surface)' : 'var(--accent)'} stroke="var(--accent)" strokeWidth={2}>
          <title>{`Form ${m.form}: ${m.scaled}${m.repeat ? ' (repeat form)' : ''}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export function Progress() {
  const { store, content, clock } = useEnv();
  const [data, setData] = useState<{ attempts: Attempt[]; mocks: MockResult[]; cards: CardState[]; studied: PatternId[] } | null>(null);
  useEffect(() => {
    void (async () => {
      const [attempts, mocks, cards, plan] = await Promise.all([store.getAttempts(), store.getMockResults(), store.getCards(), store.getPlan()]);
      setData({ attempts, mocks: [...mocks].sort((a, b) => a.at - b.at), cards, studied: studiedPatterns(plan ?? startPlan(localDate(clock()))) });
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!data) return <p className="muted">Loading…</p>;

  const stats = patternAccuracy(data.attempts);
  const practiced = PATTERNS.filter((p) => stats.has(p.id) || data.studied.includes(p.id));
  const weakest = new Set(weakestPatterns(stats, practiced.map((p) => p.id).filter((p) => (stats.get(p)?.n ?? 0) >= MIN_ATTEMPTS_FOR_ACCURACY), 3));
  const timed = data.attempts.filter((a) => a.sessionKind === 'afternoon' || a.sessionKind === 'mock');
  const avgS = timed.length ? Math.round(timed.reduce((s, a) => s + a.ms, 0) / timed.length / 1000) : null;
  const now = clock().getTime();
  const words = content.allWords().length;

  return (
    <div>
      <h1>📈 Progress</h1>
      <div className="card">
        <strong>Estimated Structure score</strong> <span className="muted">(31–68, from weekly mocks)</span>
        {data.mocks.length ? <ScoreChart mocks={data.mocks} /> : <p className="muted">Take your first mock test to see your estimated score here.</p>}
        {data.mocks.some((m) => m.repeat) && <p className="muted">Hollow points are repeat forms and may be inflated.</p>}
      </div>
      <div className="row">
        <div className="card" style={{ flex: 1 }}>🔥 <strong>{streak(data.attempts, localDate(clock()))}</strong> day streak</div>
        <div className="card" style={{ flex: 1 }}>⏱ <strong>{avgS ?? '–'}</strong> s/question <span className="muted">(target 37)</span></div>
      </div>
      <div className="card">📚 Words learned: <strong>{data.cards.filter((c) => c.reps >= 1).length}</strong>{words ? ` of ${words}` : ''} · due now: <strong>{data.cards.filter((c) => c.dueAt <= now).length}</strong></div>
      <div className="card">
        <strong>Accuracy by grammar pattern</strong> <span className="muted">(last 30 answers; weakest 3 in red)</span>
        {practiced.length ? (
          <table>
            <thead><tr><th>Pattern</th><th>Accuracy</th><th>Answers</th></tr></thead>
            <tbody>
              {practiced.map((p) => {
                const s = stats.get(p.id);
                return (
                  <tr key={p.id} className={weakest.has(p.id) ? 'weak' : ''}>
                    <td>{p.title}</td>
                    <td>{s && s.n >= MIN_ATTEMPTS_FOR_ACCURACY ? `${Math.round(s.accuracy * 100)}%` : 'needs practice'}</td>
                    <td>{s?.n ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p className="muted">No answers yet.</p>}
      </div>
    </div>
  );
}
