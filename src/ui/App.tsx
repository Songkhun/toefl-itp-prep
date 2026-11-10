import { useEffect, useMemo, useState } from 'react';
import type { ProgressStore } from '../storage/store';
import { realContent, type ContentSource } from '../content';
import { EnvContext, type AppEnv } from './context';
import { Home } from './screens/Home';
import { Afternoon, DraftGate, Mock, Morning, NewSet, Resume, Review, Vocab } from './screens/Sessions';
import { localDate } from '../plan/plan';
import { Progress } from './screens/Progress';
import { Settings } from './screens/Settings';
import './styles.css';

const gated = (S: () => JSX.Element) => () => <DraftGate><S /></DraftGate>;
const ROUTES: Record<string, () => JSX.Element> = {
  '#/': Home, '#/morning': gated(Morning), '#/afternoon': gated(Afternoon), '#/mock': gated(Mock), '#/newset': gated(NewSet), '#/review': gated(Review),
  '#/vocab': Vocab, '#/progress': Progress, '#/settings': Settings, '#/resume': Resume,
};
const TABS: [string, string][] = [['#/', 'Home'], ['#/newset', 'Practice'], ['#/progress', 'Progress'], ['#/settings', 'Settings']];

export function App({ store, content = realContent, clock = () => new Date() }: { store: ProgressStore; content?: ContentSource; clock?: () => Date }) {
  const [hash, setHash] = useState(() => (ROUTES[window.location.hash] ? window.location.hash : '#/'));
  useEffect(() => {
    const on = () => setHash(ROUTES[window.location.hash] ? window.location.hash : '#/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  // Re-render the current screen when the app comes back on a different local date (installed PWAs are resumed, not reloaded).
  const [day, setDay] = useState(() => localDate(clock()));
  useEffect(() => {
    const check = () => setDay(localDate(clock()));
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    return () => { document.removeEventListener('visibilitychange', check); window.removeEventListener('focus', check); };
  }, [clock]);
  const env = useMemo<AppEnv>(() => ({
    store, content, clock,
    navigate: (h) => { window.location.hash = h; setHash(ROUTES[h] ? h : '#/'); window.scrollTo?.(0, 0); },
  }), [store, content, clock]);
  const Screen = ROUTES[hash];
  return (
    <EnvContext.Provider value={env}>
      {!store.persistent && <div className="banner">Progress won't be saved on this device (browser storage is blocked, e.g. private mode). Use Settings → Export backup to keep your work.</div>}
      <main key={`${hash}|${day}`}><Screen /></main>
      <nav className="tabs">
        {TABS.map(([h, label]) => <a key={h} href={h} className={hash === h ? 'active' : ''}>{label}</a>)}
      </nav>
    </EnvContext.Provider>
  );
}
