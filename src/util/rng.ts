export type Rng = () => number;

/** mulberry32: small, fast, deterministic PRNG returning floats in [0, 1). */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(arr: readonly T[], n: number, rng: Rng): T[] {
  return shuffle(arr, rng).slice(0, Math.max(0, n));
}

export function randInt(rng: Rng, n: number): number {
  return Math.floor(rng() * n);
}

export function choice<T>(arr: readonly T[], rng: Rng): T {
  return arr[randInt(rng, arr.length)];
}
