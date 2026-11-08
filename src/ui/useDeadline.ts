import { useEffect, useState } from 'react';

/** Remaining time computed from Date.now() on every tick and when the page becomes visible again. */
export function useDeadline(deadlineAt: number | null): { remainingMs: number; expired: boolean } {
  const calc = () => (deadlineAt === null ? Infinity : Math.max(0, deadlineAt - Date.now()));
  const [remainingMs, setRemaining] = useState(calc);
  useEffect(() => {
    if (deadlineAt === null) return;
    const update = () => setRemaining(Math.max(0, deadlineAt - Date.now()));
    update();
    const id = setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('focus', update);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('focus', update);
    };
  }, [deadlineAt]);
  return { remainingMs, expired: deadlineAt !== null && remainingMs <= 0 };
}

export function formatMs(ms: number): string {
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
