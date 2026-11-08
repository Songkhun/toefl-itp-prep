/**
 * Approximate raw→scaled conversion for Structure & Written Expression (40 items → 31..68).
 * ETS publishes no official ITP table; points are based on published prep-book tables. Always label as an estimate.
 */
const POINTS: [number, number][] = [[0, 31], [5, 31], [10, 35], [15, 40], [20, 44], [25, 49], [30, 54], [35, 60], [38, 65], [40, 68]];

export function rawToScaledStructure(raw: number): number {
  const r = Math.min(40, Math.max(0, raw));
  for (let i = 1; i < POINTS.length; i++) {
    const [x1, y1] = POINTS[i];
    if (r <= x1) {
      const [x0, y0] = POINTS[i - 1];
      return Math.round(y0 + ((r - x0) * (y1 - y0)) / (x1 - x0));
    }
  }
  return 68;
}

export function estimateTotal(l: number, s: number, r: number): number {
  return Math.round(((l + s + r) * 10) / 3);
}
