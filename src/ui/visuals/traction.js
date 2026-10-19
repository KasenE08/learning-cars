// Bike traction control: friction circle + rear slip, with TC levels and lean-sensitive (IMU) mode.
// Teaching model, not any manufacturer's algorithm.
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const SURFACES = { dry: { label: 'Dry', mu: 1.0 }, wet: { label: 'Wet', mu: 0.6 }, gravel: { label: 'Gravel', mu: 0.4 } };
const TARGET = { 0: Infinity, 1: 14, 2: 10, 3: 6 };        // slip % each TC level allows when upright

/** Returns the physics for given throttle (0..100), surface key, lean (deg), TC level (0 = off), imu flag. */
export function tractionState({ throttle, surface, lean, tc, imu }) {
  const mu = SURFACES[surface].mu;
  const side = Math.tan((lean * Math.PI) / 180);            // sideways g needed to hold this lean
  const avail = Math.sqrt(Math.max(0, mu * mu - side * side)); // forward grip left over (friction circle)
  const demand = (throttle / 100) * 0.8;                    // forward g the throttle asks for (low gear)
  const slipFor = (d) => (avail <= 0.001 ? 100 : d <= avail ? (d / avail) * 8 : Math.min(100, 8 + ((d - avail) / avail) * 120));
  const leanFactor = imu ? Math.max(0.3, 1 - lean / 60) : 1;
  const target = TARGET[tc] * leanFactor;
  let slip = slipFor(demand), delivered = demand;
  if (tc && slip > target) {
    // TC trims torque until slip comes back to its target.
    let lo = 0, hi = demand;
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (slipFor(m) > target) hi = m; else lo = m; }
    delivered = lo; slip = slipFor(lo);
  }
  const safe = 20 * Math.max(0.25, 1 - lean / 55);          // rough "still saveable" slip at this lean
  return { mu, side, avail, demand, delivered, slip, target, safe, cut: demand > 0 ? 1 - delivered / demand : 0, overLean: side > mu };
}

export function mount(host) {
  const S = { throttle: 60, surface: 'dry', lean: 20, tc: 2, imu: true };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 230" class="d" role="img" aria-label="Traction control"></svg>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Teaching model: grip numbers and slip limits are rough, and every manufacturer tunes TC differently. Real systems compare front and rear wheel speeds; an IMU adds lean angle so the limit can shrink as you lean.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  const draw = () => {
    const r = tractionState(S);
    const C = [100, 120], R = 80;                              // friction circle, 1.0 g = 80 px
    const sx = C[0] + r.side * R, fy = C[1] - r.delivered * R, dy = C[1] - r.demand * R;
    const over = Math.hypot(r.side, r.demand) > r.mu;
    // slip bar
    const BX = 230, BY0 = 200, BH = 160, smax = 40;
    const by = (s) => BY0 - (Math.min(smax, s) / smax) * BH;
    const danger = r.slip > r.safe || r.overLean;
    svg.innerHTML = `
      <text x="${C[0]}" y="22" text-anchor="middle" class="awd-sub">friction circle (rear tire)</text>
      <circle cx="${C[0]}" cy="${C[1]}" r="${R}" fill="none" stroke="#3a424c" stroke-dasharray="3 4"/>
      <circle cx="${C[0]}" cy="${C[1]}" r="${r.mu * R}" fill="#ff6b1a" fill-opacity="0.07" stroke="#ff6b1a"/>
      <text x="${C[0] + r.mu * R * 0.7 + 4}" y="${C[1] - r.mu * R * 0.7 - 4}" class="awd-sub" style="fill:#ff6b1a">grip: ${SURFACES[S.surface].label}</text>
      <line x1="${C[0] - R - 6}" x2="${C[0] + R + 6}" y1="${C[1]}" y2="${C[1]}" stroke="#262b31"/>
      <line x1="${C[0]}" x2="${C[0]}" y1="${C[1] - R - 6}" y2="${C[1] + R + 6}" stroke="#262b31"/>
      <text x="${C[0]}" y="${C[1] + R + 18}" text-anchor="middle" class="awd-sub">← sideways (lean)  ·  up = drive</text>
      ${r.cut > 0.01 ? `<line x1="${sx}" y1="${C[1]}" x2="${sx}" y2="${dy}" stroke="#5b6470" stroke-width="3" stroke-dasharray="3 3"/>` : ''}
      <line x1="${C[0]}" y1="${C[1]}" x2="${sx}" y2="${C[1]}" stroke="#7fb2e0" stroke-width="3"/>
      <line x1="${sx}" y1="${C[1]}" x2="${sx}" y2="${fy}" stroke="#ffc21a" stroke-width="3"/>
      <line x1="${C[0]}" y1="${C[1]}" x2="${sx}" y2="${fy}" stroke="${over && !S.tc ? '#ff4d3d' : '#c9d1d9'}" stroke-width="2"/>
      <circle cx="${sx}" cy="${fy}" r="5" fill="${over && !S.tc ? '#ff4d3d' : '#c9d1d9'}"/>
      <text x="${BX + 15}" y="22" text-anchor="middle" class="awd-sub">rear slip</text>
      <rect x="${BX}" y="${BY0 - BH}" width="30" height="${BH}" rx="3" fill="#14171a" stroke="#3a424c"/>
      <rect x="${BX}" y="${by(r.slip)}" width="30" height="${BY0 - by(r.slip)}" rx="3" fill="${danger ? '#ff4d3d' : r.cut > 0.01 ? '#ffc21a' : '#7fb2e0'}"/>
      <line x1="${BX - 4}" x2="${BX + 34}" y1="${by(r.safe)}" y2="${by(r.safe)}" stroke="#ff4d3d" stroke-width="2"/>
      <text x="${BX + 38}" y="${by(r.safe) + 4}" class="awd-sub" style="fill:#ff4d3d">hard to save</text>
      ${S.tc ? `<line x1="${BX - 4}" x2="${BX + 34}" y1="${by(r.target)}" y2="${by(r.target)}" stroke="#ffc21a" stroke-width="2" stroke-dasharray="4 2"/><text x="${BX + 38}" y="${by(r.target) + 4}" class="awd-sub" style="fill:#ffc21a">TC limit</text>` : ''}
      <text x="${BX - 6}" y="${BY0 + 4}" text-anchor="end" class="awd-sub">0%</text>
      <text x="${BX - 6}" y="${BY0 - BH + 8}" text-anchor="end" class="awd-sub">${smax}%+</text>
      <text x="${BX + 15}" y="${BY0 + 20}" text-anchor="middle" class="awd-pct" style="font-size:16px">${r.slip >= 100 ? 'SPIN' : `${r.slip.toFixed(0)}%`}</text>`;
    const verdict = r.overLean ? 'Lean alone exceeds grip: sliding' : danger ? (S.tc ? 'TC limit still too high here' : 'Rear stepping out: lowside / highside risk') : r.cut > 0.01 ? `TC cutting ${Math.round(r.cut * 100)}% torque` : 'Hooked up';
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Status</small><b style="font-size:14px">${verdict}</b></span>
      <span class="ro"><small>Sideways g</small><b>${r.side.toFixed(2)} g</b></span>
      <span class="ro"><small>Drive g (asked → got)</small><b>${r.demand.toFixed(2)} → ${r.delivered.toFixed(2)}</b></span>`);
  };
  const imuChips = chips([{ value: true, label: 'Lean-sensitive (IMU)' }, { value: false, label: 'Wheel-speed only' }], { value: S.imu, onPick(v) { S.imu = v; draw(); } });
  wrap.querySelector('.ctl').append(
    slider({ label: 'Throttle', min: 0, max: 100, value: S.throttle, fmt: (v) => `${v}%`, onInput(v) { S.throttle = v; draw(); } }).el,
    slider({ label: 'Lean', min: 0, max: 55, value: S.lean, fmt: (v) => `${v}°`, onInput(v) { S.lean = v; draw(); } }).el,
    chips(Object.entries(SURFACES).map(([value, s]) => ({ value, label: s.label })), { value: S.surface, onPick(v) { S.surface = v; draw(); } }).el,
    chips([{ value: 0, label: 'TC off' }, { value: 1, label: 'TC 1 (least)' }, { value: 2, label: 'TC 2' }, { value: 3, label: 'TC 3 (most)' }], { value: S.tc, onPick(v) { S.tc = v; draw(); } }).el,
    imuChips.el,
  );
  draw();
  return { destroy() {} };
}
