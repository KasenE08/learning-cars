// Clutch engagement: pedal position → clamp → transmitted torque; engine vs gearbox speed and slip.
import { html, el } from '../dom.js';
import { slider } from './controls.js';

/** One physics step. Two inertias (engine, car-in-1st) joined by a friction clutch. Returns clamp 0..1. */
export function clutchStep(S, dt) {
  const engage = Math.max(0, Math.min(1, (0.75 - S.pedal) / 0.5)); // bite point near the middle of travel
  const K = 30, Je = 0.25, Jv = 3, load = 20;
  if (S.stalled) { S.engine = 0; S.input = Math.max(0, S.input - 300 * dt); if (S.pedal > 0.9) { S.stalled = false; S.engine = 900; } return engage; }
  const gov = Math.max(0, Math.min(80, (800 - S.engine) * 0.5));        // idle control holds ~800 rpm
  const Te = gov + 220 * S.throttle - (15 + S.engine * 0.005);
  const cap = engage * 300;
  const slip = S.engine - S.input;
  if (Math.abs(slip) < 15 && cap > Math.abs(Te - load * (Je / (Je + Jv)))) {
    const w = S.engine + ((Te - load) / (Je + Jv)) * K * dt;          // locked: spin up together
    S.engine = S.input = Math.max(0, w);
  } else {
    const Tc = Math.sign(slip || 1) * cap;
    S.engine += ((Te - Tc) / Je) * K * dt;
    S.input = Math.max(0, S.input + ((Tc - load) / Jv) * K * dt);
    S.heat = Math.min(1.2, S.heat + Math.abs(Tc * slip) * 4e-7);
  }
  S.heat = Math.max(0, S.heat - 0.15 * dt);
  S.engine = Math.min(6800, S.engine);
  if (S.engine < 400) { S.stalled = true; S.engine = 0; }
  return engage;
}

export function mount(host) {
  const S = { pedal: 1, engine: 900, input: 0, heat: 0, stalled: false, throttle: 0.15 };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 220" class="d" role="img" aria-label="Clutch engagement">
      <rect x="40" y="30" width="26" height="160" rx="4" fill="#3a424c" stroke="#c9d1d9"/><text x="53" y="210" text-anchor="middle" class="awd-sub">flywheel</text>
      <g class="ce-disc"><rect x="74" y="44" width="10" height="132" rx="2" fill="#7d6a52" stroke="#c9ad94"/></g>
      <g class="ce-pp"><rect x="92" y="38" width="16" height="144" rx="2" fill="#5a6470" stroke="#c9d1d9"/></g>
      <rect x="70" y="104" width="250" height="12" fill="#c9d1d9"/><text x="300" y="98" text-anchor="end" class="awd-sub">to gearbox</text>
      <g class="ce-heat" opacity="0"><path d="M84,30 q6,-10 0,-20 M84,190 q6,10 0,20" stroke="#ff4d3d" stroke-width="3" fill="none"/></g>
      <g transform="translate(200 60)"><circle r="30" fill="none" stroke="#262b31" stroke-width="6"/><path class="ce-eng" fill="none" stroke="#ff6b1a" stroke-width="6"/><text y="5" text-anchor="middle" class="awd-pct ce-et"></text><text y="46" text-anchor="middle" class="awd-sub">engine rpm</text></g>
      <g transform="translate(290 60)"><circle r="30" fill="none" stroke="#262b31" stroke-width="6"/><path class="ce-in" fill="none" stroke="#7fb2e0" stroke-width="6"/><text y="5" text-anchor="middle" class="awd-pct ce-it" style="fill:#7fb2e0"></text><text y="46" text-anchor="middle" class="awd-sub">gearbox rpm</text></g>
    </svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Simplified: car in 1st on flat ground. Ease the pedal up with a little throttle for a smooth launch; dump it at idle and it stalls.</p></figure>`);
  host.append(wrap);
  const $ = (q) => wrap.querySelector(q);
  const arc = (v) => { const a = Math.min(0.999, v / 7000) * 2 * Math.PI; return `M0,-30 A30,30 0 ${a > Math.PI ? 1 : 0} 1 ${30 * Math.sin(a)},${-30 * Math.cos(a)}`; };
  let raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const engage = clutchStep(S, dt);
    const gap = 6 * (1 - engage);
    $('.ce-pp').setAttribute('transform', `translate(${gap} 0)`);
    $('.ce-disc').setAttribute('transform', `translate(${gap / 2} 0)`);
    $('.ce-heat').setAttribute('opacity', Math.min(1, S.heat));
    $('.ce-eng').setAttribute('d', arc(S.engine)); $('.ce-in').setAttribute('d', arc(S.input));
    $('.ce-et').textContent = Math.round(S.engine); $('.ce-it').textContent = Math.round(S.input);
    const slipPct = S.engine > 0 ? Math.max(0, Math.round(((S.engine - S.input) / S.engine) * 100)) : 0;
    $('.big-out').innerHTML = `<span class="ro ${S.stalled ? 'ro--hl' : ''}"><small>Status</small><b style="font-size:14px">${S.stalled ? 'STALLED · push the pedal in' : engage === 0 ? 'Disengaged' : slipPct > 2 ? 'Slipping' : 'Locked up'}</b></span>
      <span class="ro"><small>Clamp</small><b>${Math.round(engage * 100)}%</b></span><span class="ro"><small>Slip</small><b>${slipPct}%</b></span><span class="ro"><small>Clutch heat</small><b>${S.heat > 0.6 ? 'HOT' : S.heat > 0.2 ? 'warm' : 'cool'}</b></span>`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  $('.ctl').append(
    slider({ label: 'Clutch pedal', min: 0, max: 100, value: 100, fmt: (v) => (v > 95 ? 'in (down)' : v < 5 ? 'out (up)' : `${v}%`), onInput(v) { S.pedal = v / 100; } }).el,
    slider({ label: 'Throttle', min: 0, max: 100, value: 15, fmt: (v) => `${v}%`, onInput(v) { S.throttle = v / 100; } }).el,
  );
  return { destroy: () => cancelAnimationFrame(raf) };
}
