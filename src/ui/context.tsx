import { createContext, useContext } from 'react';
import type { ProgressStore } from '../storage/store';
import type { ContentSource } from '../content';

export interface AppEnv {
  store: ProgressStore;
  content: ContentSource;
  clock: () => Date;
  navigate: (hash: string) => void;
}
export const EnvContext = createContext<AppEnv | null>(null);
export function useEnv(): AppEnv {
  const env = useContext(EnvContext);
  if (!env) throw new Error('EnvContext missing');
  return env;
}

export function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
