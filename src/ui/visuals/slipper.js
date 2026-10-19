// Slipper clutch: an aggressive downshift with and without one.
// Illustrative model in "% of rear grip" units (not measured data): engine braking pulls the rear tire;
// above 100% the tire skids/hops. A slipper caps the back-torque by letting the clutch slip.
import { html, el } from '../dom.js';
import { chips } from './controls.js';

const T_SHIFT = 0.4, T_END = 2.2;

/** Rear braking force (% of grip) and engine rpm at time t (s). */
export function slipperTrace(t, slipper) {
  const base = 25;                                   // normal engine braking before the shift
  if (t < T_SHIFT) return { force: base, rpm: 6000, slip: false };
  const s = t - T_SHIFT;
  if (!slipper) {
    // Clutch locked: the rear wheel must spin the engine up from 6000 to 8500 rpm almost instantly.
    const spike = 150 * Math.exp(-s / 0.18);
    const hop = spike > 30 ? 35 * Math.sin(s * 2 * Math.PI * 9) * Math.exp(-s / 0.35) : 0;
    const rpm = 6000 + 2500 * (1 - Math.exp(-s / 0.08));
    return { force: Math.max(0, 40 + spike + hop), rpm, slip: false };
  }
  // Slipper: ramps lift the pressure plate once back-torque passes a threshold, so the clutch slips.
  const cap = 70;
  const want = 40 + 150 * Math.exp(-s / 0.18);
  const rpm = 6000 + 2500 * (1 - Math.exp(-s / 0.35));
  return { force: Math.min(cap, want), rpm, slip: want > cap };
}

export function mount(host) {
  const S = { slipper: false, t: T_END, start: 0 };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 250" class="d" role="img" aria-label="Slipper clutch downshift"></svg>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Simplified model to show the shape of what happens, not measured data. Units are rear braking force as a percentage of what the rear tire can grip.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  const X0 = 40, X1 = 340, Y0 = 170, Y1 = 30, FMAX = 200;
  const px = (t) => X0 + (t / T_END) * (X1 - X0);
  const py = (f) => Y0 - (Math.min(FMAX, f) / FMAX) * (Y0 - Y1);
  let raf = 0;

  const draw = () => {
    const pts = [], ghost = [];
    let peak = 0, hopped = false;
    for (let t = 0; t <= T_END + 1e-9; t += 0.01) {
      const a = slipperTrace(t, S.slipper), b = slipperTrace(t, !S.slipper);
      ghost.push(`${px(t).toFixed(1)},${py(b.force).toFixed(1)}`);
      if (t <= S.t) { pts.push(`${px(t).toFixed(1)},${py(a.force).toFixed(1)}`); peak = Math.max(peak, a.force); if (a.force > 100) hopped = true; }
    }
    const now = slipperTrace(Math.min(S.t, T_END), S.slipper);
    const bounce = now.force > 100 ? Math.min(8, (now.force - 100) / 8) * Math.abs(Math.sin(S.t * 60)) : 0;
    const lift = now.slip ? 5 : 0;
    svg.innerHTML = `
      <rect x="${X0}" y="${Y1}" width="${X1 - X0}" height="${py(100) - Y1}" fill="#ff4d3d" opacity="0.08"/>
      <line x1="${X0}" x2="${X1}" y1="${py(100)}" y2="${py(100)}" stroke="#ff4d3d" stroke-dasharray="5 4"/>
      <text x="${X1}" y="${py(100) + 13}" text-anchor="end" class="awd-sub" style="fill:#ff4d3d">tire grip limit (above = skid / hop)</text>
      <line x1="${X0}" x2="${X1}" y1="${Y0}" y2="${Y0}" stroke="#5b6470"/>
      <line x1="${X0}" x2="${X0}" y1="${Y0}" y2="${Y1}" stroke="#5b6470"/>
      <text x="${X0 - 6}" y="${py(0) + 4}" text-anchor="end" class="awd-sub">0</text>
      <text x="${X0 - 6}" y="${py(100) + 4}" text-anchor="end" class="awd-sub">100%</text>
      <text x="${(X0 + X1) / 2}" y="${Y0 + 16}" text-anchor="middle" class="awd-sub">time → (about 2 seconds)</text>
      <line x1="${px(T_SHIFT)}" x2="${px(T_SHIFT)}" y1="${Y0}" y2="${Y1}" stroke="#ffc21a" stroke-dasharray="2 3"/>
      <text x="${px(T_SHIFT) - 4}" y="${Y1 + 10}" text-anchor="end" class="awd-sub" style="fill:#ffc21a">downshift</text>
      <polyline points="${ghost.join(' ')}" fill="none" stroke="#8994a1" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="${S.slipper ? '#7fb2e0' : '#ff6b1a'}" stroke-width="3" stroke-linejoin="round"/>
      <g transform="translate(70 ${222 - bounce})">
        <circle r="20" fill="#14171a" stroke="#8994a1" stroke-width="5"/><circle r="5" fill="#c9d1d9"/>
        <text x="30" y="4" class="awd-sub">${now.force > 100 ? 'rear tire HOPPING / skidding' : 'rear tire gripping'}</text>
      </g>
      <line x1="40" x2="200" y1="${242}" y2="${242}" stroke="#5b6470" stroke-width="2"/>
      <g transform="translate(222 196)">
        <rect x="0" y="0" width="10" height="44" fill="#7d6a52" stroke="#c9ad94"/>
        <rect x="${14 + lift}" y="-2" width="10" height="48" fill="#5a6470" stroke="${now.slip ? '#7fb2e0' : '#c9d1d9'}"/>
        <text x="34" y="14" class="awd-sub">${S.slipper ? (now.slip ? 'ramps lift plate:' : 'slipper ready') : 'normal clutch:'}</text>
        <text x="34" y="28" class="awd-sub">${S.slipper ? (now.slip ? 'clutch SLIPS' : '') : 'stays locked'}</text>
      </g>`;
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Peak rear braking</small><b>${Math.round(peak)}% of grip</b></span>
      <span class="ro"><small>Engine rpm</small><b>${Math.round(now.rpm).toLocaleString('en-US')}</b></span>
      <span class="ro"><small>Result</small><b style="font-size:13px">${S.t < T_SHIFT ? 'Before shift' : hopped ? 'Rear wheel hop / skid' : 'Smooth: clutch slipped instead'}</b></span>`);
  };
  const loop = (now) => {
    S.t = ((now - S.start) / 1000) * 0.9;
    draw();
    if (S.t < T_END) raf = requestAnimationFrame(loop);
  };
  const play = () => { cancelAnimationFrame(raf); S.start = performance.now(); S.t = 0; raf = requestAnimationFrame(loop); };
  const btn = el(html`<button type="button" class="btn btn--primary">Downshift hard</button>`);
  btn.onclick = play;
  wrap.querySelector('.ctl').append(
    chips([{ value: false, label: 'Normal clutch' }, { value: true, label: 'Slipper clutch' }], { value: false, onPick(v) { S.slipper = v; play(); } }).el,
    btn,
  );
  draw();
  return { destroy: () => cancelAnimationFrame(raf) };
}
