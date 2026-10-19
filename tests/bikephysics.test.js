import { describe, it, expect } from 'vitest';
import { leanAngle } from '../src/ui/visuals/lean.js';
import { trailMm } from '../src/ui/visuals/raketrail.js';
import { tractionState } from '../src/ui/visuals/traction.js';
import { slipperTrace } from '../src/ui/visuals/slipper.js';

describe('bike physics helpers', () => {
  it('lean angle follows tan θ = v²/(g r)', () => {
    expect(leanAngle(35, 150)).toBeCloseTo(28.6, 1);
    expect(leanAngle(60, 150)).toBeGreaterThan(leanAngle(35, 150));
  });
  it('trail grows with rake and shrinks with offset', () => {
    expect(trailMm(24.5, 32, 300)).toBeCloseTo(101.6, 0);
    expect(trailMm(26, 32, 300)).toBeGreaterThan(trailMm(24.5, 32, 300));
    expect(trailMm(24.5, 40, 300)).toBeLessThan(trailMm(24.5, 32, 300));
  });
  it('traction control caps slip at its target', () => {
    const base = { throttle: 100, surface: 'wet', lean: 30, imu: false };
    const off = tractionState({ ...base, tc: 0 });
    const on = tractionState({ ...base, tc: 3 });
    expect(off.slip).toBeGreaterThan(on.slip);
    expect(on.slip).toBeLessThanOrEqual(on.target + 0.01);
    expect(tractionState({ ...base, tc: 3, imu: true }).target).toBeLessThan(on.target);
    expect(tractionState({ throttle: 0, surface: 'gravel', lean: 30, tc: 0, imu: false }).overLean).toBe(true);
  });
  it('slipper clutch keeps rear braking under grip', () => {
    let peakOff = 0, peakOn = 0;
    for (let t = 0; t < 2.2; t += 0.005) { peakOff = Math.max(peakOff, slipperTrace(t, false).force); peakOn = Math.max(peakOn, slipperTrace(t, true).force); }
    expect(peakOff).toBeGreaterThan(100);
    expect(peakOn).toBeLessThan(100);
  });
});
