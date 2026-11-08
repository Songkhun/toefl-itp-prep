import { rawToScaledStructure, estimateTotal } from '../../src/scoring/estimate';

describe('score estimate', () => {
  it('pins table points', () => {
    expect(rawToScaledStructure(40)).toBe(68);
    expect(rawToScaledStructure(35)).toBe(60);
    expect(rawToScaledStructure(0)).toBe(31);
    expect(rawToScaledStructure(20)).toBe(44);
  });
  it('is non-decreasing over 0..40', () => {
    for (let r = 1; r <= 40; r++) expect(rawToScaledStructure(r)).toBeGreaterThanOrEqual(rawToScaledStructure(r - 1));
  });
  it('clamps out-of-range raw', () => {
    expect(rawToScaledStructure(-3)).toBe(31);
    expect(rawToScaledStructure(50)).toBe(68);
  });
  it('total formula', () => {
    expect(estimateTotal(45, 45, 45)).toBe(450);
    expect(estimateTotal(60, 60, 60)).toBe(600);
  });
});
