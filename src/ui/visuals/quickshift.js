// Quickshifter: drive torque and rpm through an upshift (clutch vs quickshifter) and an auto-blip downshift.
// Timings are typical illustrative values, not measurements of a specific bike.
import { html, el } from '../dom.js';
import { chips } from './controls.js';

const T_MAX = 700; // ms shown

const lerp = (a, b, f) => a + (b - a) * Math.max(0, Math.min(1, f));

export const MODES = {
  clutch: {
    label: 'Clutch upshift',
    events: [
      [100, 'Rider rolls off throttle'], [180, 'Clutch lever in'], [260, 'Foot lifts lever: dogs slide out, next gear in'],
      [360, 'Clutch out, throttle back on'], [460, 'Full drive again'],
    ],
    torque: (t) => (t < 100 ? 100 : t < 180 ? lerp(100, 0, (t - 100) / 80) : t < 360 ? 0 : t < 460 ? lerp(0, 74, (t - 360) / 100) : 74),
    rpm: (t) => (t < 180 ? 9000 : t < 360 ? lerp(9000, 6900, (t - 180) / 180) : 6900 + (t - 360) * 0.6),
    gap: '≈ 300 ms with reduced or no drive',
  },
  qs: {
    label: 'Quickshifter upshift',
    events: [
      [200, 'Sensor on the shift rod feels the foot pressing'], [205, 'ECU cuts spark/fuel'],
      [215, 'Load comes off the dogs: they slide out, next gear in'], [260, 'Cut ends, drive returns'],
    ],
    torque: (t) => (t < 205 ? 100 : t < 215 ? lerp(100, 0, (t - 205) / 10) : t < 255 ? 0 : t < 285 ? lerp(0, 74, (t - 255) / 30) : 74),
    rpm: (t) => (t < 215 ? 9000 + t * 0.4 : t < 270 ? lerp(9086, 6900, (t - 215) / 55) : 6900 + (t - 270) * 0.6),
    gap: '≈ 50–100 ms cut (varies by bike and rpm)',
  },
  blip: {
    label: 'Auto-blip downshift',
    events: [
      [200, 'Rider presses lever down (no clutch)'], [210, 'ECU opens throttle for a blip'],
      [280, 'Engine rpm now matches the lower gear: dogs engage'], [320, 'Smooth engine braking'],
    ],
    torque: (t) => (t < 210 ? -20 : t < 280 ? lerp(-20, 0, (t - 210) / 20) : t < 320 ? lerp(0, -28, (t - 280) / 40) : -28),
    rpm: (t) => (t < 210 ? 6000 - t * 0.8 : t < 280 ? lerp(5832, 7800, (t - 210) / 70) : 7800 - (t - 280) * 0.9),
    gap: 'No clutch, no rear-wheel jolt',
  },
};

export function mount(host) {
  const S = { mode: 'qs', t: T_MAX, start: 0 };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 250" class="d" role="img" aria-label="Quickshifter timing"></svg>
    <div class="big-out"></div><div class="ctl"></div><ol class="qs-ev"></ol>
    <p class="vis__note">Illustrative timings. Real cut times are set in the ECU and change with rpm and gear; check the specific bike.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out'), list = wrap.querySelector('.qs-ev');
  const X0 = 44, X1 = 344;
  const px = (t) => X0 + (t / T_MAX) * (X1 - X0);
  const tq = (v) => 30 + ((110 - v) / 150) * 100;        // torque plot: 110% .. -40%  → y 30..130
  const rp = (v) => 170 + ((10000 - v) / 5000) * 60;     // rpm plot: 10000 .. 5000 → y 170..230
  let raf = 0;
  const path = (fn, map) => {
    const p = [];
    for (let t = 0; t <= Math.min(S.t, T_MAX); t += 2) p.push(`${px(t).toFixed(1)},${map(fn(t)).toFixed(1)}`);
    return p.join(' ');
  };
  const draw = () => {
    const m = MODES[S.mode];
    let lastX = -99;
    const evs = m.events.map(([t], i) => {
      const x = px(t), on = S.t >= t;
      const cx = Math.max(x, lastX + 16); lastX = cx;   // keep close markers from overlapping
      return `<line x1="${x}" x2="${x}" y1="26" y2="232" stroke="${on ? '#ffc21a' : '#3a424c'}" stroke-dasharray="2 3"/>
      <circle cx="${cx}" cy="16" r="7" fill="${on ? '#ffc21a' : '#262b31'}"/><text x="${cx}" y="19.5" text-anchor="middle" class="awd-sub" style="fill:${on ? '#0b0c0e' : '#c9d1d9'};font-weight:700">${i + 1}</text>`;
    });
    svg.innerHTML = `
      <text x="${X1}" y="${tq(100) - 6}" text-anchor="end" class="awd-sub">drive torque at rear wheel</text>
      <line x1="${X0}" x2="${X1}" y1="${tq(0)}" y2="${tq(0)}" stroke="#5b6470"/>
      <text x="${X0 - 4}" y="${tq(100) + 4}" text-anchor="end" class="awd-sub">100%</text>
      <text x="${X0 - 4}" y="${tq(0) + 4}" text-anchor="end" class="awd-sub">0</text>
      <text x="${X0 - 4}" y="${tq(-30) + 4}" text-anchor="end" class="awd-sub">brake</text>
      <text x="${X0}" y="${rp(10000) - 4}" class="awd-sub">engine rpm</text>
      <line x1="${X0}" x2="${X1}" y1="${rp(5000)}" y2="${rp(5000)}" stroke="#5b6470"/>
      <text x="${X0 - 4}" y="${rp(9000) + 4}" text-anchor="end" class="awd-sub">9k</text>
      <text x="${X0 - 4}" y="${rp(6000) + 4}" text-anchor="end" class="awd-sub">6k</text>
      <text x="${X1}" y="246" text-anchor="end" class="awd-sub">${T_MAX} ms (0.7 s)</text><text x="${X0}" y="246" class="awd-sub">0</text>
      ${evs.join('')}
      <polyline points="${path(m.torque, tq)}" fill="none" stroke="#ff6b1a" stroke-width="3" stroke-linejoin="round"/>
      <polyline points="${path(m.rpm, rp)}" fill="none" stroke="#7fb2e0" stroke-width="2.5" stroke-linejoin="round"/>
      ${S.t < T_MAX ? `<line x1="${px(S.t)}" x2="${px(S.t)}" y1="26" y2="232" stroke="#c9d1d9" opacity="0.6"/>` : ''}`;
    list.innerHTML = String(html`${m.events.map(([t, txt]) => html`<li class="${S.t >= t ? 'is-on' : ''}"><b>${t} ms</b> ${txt}</li>`)}`);
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Drive interruption</small><b style="font-size:14px">${m.gap}</b></span>`);
  };
  const loop = (now) => {
    S.t = (now - S.start) / 2.2; // slow motion: real time × ~1/2.2
    draw();
    if (S.t < T_MAX) raf = requestAnimationFrame(loop);
  };
  const play = () => { cancelAnimationFrame(raf); S.start = performance.now(); S.t = 0; raf = requestAnimationFrame(loop); };
  const btn = el(html`<button type="button" class="btn btn--primary">Play (slow motion)</button>`);
  btn.onclick = play;
  wrap.querySelector('.ctl').append(
    chips(Object.entries(MODES).map(([value, m]) => ({ value, label: m.label })), { value: S.mode, onPick(v) { S.mode = v; play(); } }).el,
    btn,
  );
  draw();
  return { destroy: () => cancelAnimationFrame(raf) };
}
