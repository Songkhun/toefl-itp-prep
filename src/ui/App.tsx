import { useEffect, useMemo, useState } from 'react';
import type { ProgressStore } from '../storage/store';
import { realContent, type ContentSource } from '../content';
import { EnvContext, type AppEnv } from './context';
import { Home } from './screens/Home';
import { Afternoon, Mock, Morning, NewSet, Resume, Vocab } from './screens/Sessions';
import { Progress } from './screens/Progress';
import { Settings } from './screens/Settings';
import './styles.css';

const ROUTES: Record<string, () => JSX.Element> = {
  '#/': Home, '#/morning': Morning, '#/afternoon': Afternoon, '#/mock': Mock, '#/newset': NewSet,
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
  const env = useMemo<AppEnv>(() => ({
    store, content, clock,
    navigate: (h) => { window.location.hash = h; setHash(ROUTES[h] ? h : '#/'); window.scrollTo?.(0, 0); },
  }), [store, content, clock]);
  const Screen = ROUTES[hash];
  return (
    <EnvContext.Provider value={env}>
      <main key={hash}><Screen /></main>
      <nav className="tabs">
        {TABS.map(([h, label]) => <a key={h} href={h} className={hash === h ? 'active' : ''}>{label}</a>)}
      </nav>
    </EnvContext.Provider>
  );
}
