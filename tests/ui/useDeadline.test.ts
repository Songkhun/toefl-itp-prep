import { renderHook, act } from '@testing-library/react';
import { useDeadline } from '../../src/ui/useDeadline';

describe('useDeadline', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts down from wall-clock time', () => {
    vi.setSystemTime(1_000_000);
    const { result } = renderHook(() => useDeadline(1_000_000 + 60_000));
    expect(result.current.remainingMs).toBe(60_000);
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(result.current.remainingMs).toBe(50_000);
    expect(result.current.expired).toBe(false);
  });
  it('reports expired after system time jumps past deadline while hidden', () => {
    vi.setSystemTime(1_000_000);
    const { result } = renderHook(() => useDeadline(1_000_000 + 60_000));
    act(() => {
      vi.setSystemTime(1_000_000 + 120_000);
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current.expired).toBe(true);
    expect(result.current.remainingMs).toBe(0);
  });
  it('null deadline never expires', () => {
    const { result } = renderHook(() => useDeadline(null));
    expect(result.current.expired).toBe(false);
  });
});
