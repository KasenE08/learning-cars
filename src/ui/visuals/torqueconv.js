// Torque converter: impeller (engine) drives fluid → turbine (transmission); stator redirects flow
// to multiply torque until the coupling point. Simplified characteristic curve, illustrative numbers.
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const STALL_TR = 2.0, COUPLING = 0.85;
export function converter(engine, turbine, lockup) {
  if (lockup) return { sr: 1, tr: 1, eff: 0.99, stator: 'freewheeling', state: 'Lockup clutch engaged: mechanically 1:1, no slip' };
  const sr = Math.max(0, Math.min(1, engine > 0 ? turbine / engine : 0));
  const tr = sr < COUPLING ? STALL_TR - ((STALL_TR - 1) * sr) / COUPLING : 1;
  const eff = sr * tr * (sr < COUPLING ? 1 : 0.97);
  const state = sr < 0.05 ? 'Stall: turbine stopped, max torque multiplication, all slip → heat'
    : sr < COUPLING ? 'Multiplying: stator held by its one-way clutch, redirecting fluid'
      : 'Coupling: stator freewheels, acts like a fluid coupling (some slip remains)';
  return { sr, tr, eff, stator: sr < COUPLING ? 'held' : 'freewheeling', state };
}

export function mount(host) {
  const S = { engine: 2000, turbine: 0, lockup: false };
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 220" class="d" role="img" aria-label="Torque converter">
      <path d="M60,40 Q150,40 150,110 Q150,180 60,180 Z" fill="rgba(255,107,26,0.12)" stroke="#ff6b1a" stroke-width="2"/>
      <path d="M300,40 Q210,40 210,110 Q210,180 300,180 Z" fill="rgba(127,178,224,0.12)" stroke="#7fb2e0" stroke-width="2"/>
      <rect x="165" y="80" width="30" height="60" rx="6" class="tc-stator" fill="#ffc21a" opacity="0.85"/>
      <path class="tc-fluid" d="M120,60 Q180,20 240,60 M240,160 Q180,200 120,160" fill="none" stroke="#c9a24a" stroke-width="4" stroke-dasharray="6 8"/>
      <rect x="10" y="104" width="50" height="12" fill="#c9d1d9"/><rect x="300" y="104" width="50" height="12" fill="#c9d1d9"/>
      <rect class="tc-lock" x="150" y="30" width="60" height="10" rx="3" fill="#3a424c"/>
      <g class="tc-imp" transform="translate(90 110)"><circle r="16" fill="#262b31"/><path d="M0,-14 v28 M-14,0 h28" stroke="#ff6b1a" stroke-width="3"/></g>
      <g class="tc-tur" transform="translate(270 110)"><circle r="16" fill="#262b31"/><path d="M0,-14 v28 M-14,0 h28" stroke="#7fb2e0" stroke-width="3"/></g>
      <text x="90" y="206" text-anchor="middle" class="awd-sub">impeller (engine)</text><text x="180" y="160" text-anchor="middle" class="awd-sub">stator</text><text x="270" y="206" text-anchor="middle" class="awd-sub">turbine (gearbox)</text>
      <text x="180" y="24" text-anchor="middle" class="awd-sub">lockup clutch</text>
    </svg><div class="vis__readout tc__ro"></div><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Torque ratio here peaks at ${STALL_TR.toFixed(1)}:1 at stall and reaches 1:1 at a ${COUPLING} speed ratio. Real converters vary (roughly 1.7–2.5:1). Illustrative.</p></figure>`);
  host.append(wrap);
  const $ = (q) => wrap.querySelector(q);
  let ai = 0, at = 0, raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const c = converter(S.engine, Math.min(S.turbine, S.engine), S.lockup);
    const tur = S.lockup ? S.engine : Math.min(S.turbine, S.engine);
    ai += S.engine * dt * 0.3; at += tur * dt * 0.3;
    $('.tc-imp').setAttribute('transform', `translate(90 110) rotate(${ai})`);
    $('.tc-tur').setAttribute('transform', `translate(270 110) rotate(${at})`);
    $('.tc-fluid').style.animation = `flow ${Math.max(0.2, 1.5 - (1 - c.sr) * 1.3)}s linear infinite`;
    $('.tc-fluid').setAttribute('opacity', S.lockup ? 0.15 : 0.3 + 0.7 * (1 - c.sr));
    $('.tc-stator').setAttribute('fill', c.stator === 'held' ? '#ffc21a' : '#5b6470');
    $('.tc-lock').setAttribute('fill', S.lockup ? '#ff6b1a' : '#3a424c');
    $('.tc__ro').innerHTML = `<p class="lay__note">${c.state}</p>`;
    $('.big-out').innerHTML = `<span class="ro"><small>Speed ratio</small><b>${c.sr.toFixed(2)}</b></span><span class="ro ro--hl"><small>Torque ×</small><b>${c.tr.toFixed(2)}</b></span>
      <span class="ro"><small>Efficiency</small><b>${Math.round(c.eff * 100)}%</b></span><span class="ro"><small>Stator</small><b style="font-size:13px">${c.stator}</b></span>`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  $('.ctl').append(
    slider({ label: 'Engine rpm', min: 600, max: 5000, step: 50, value: 2000, fmt: (v) => v.toLocaleString('en-US'), onInput(v) { S.engine = v; } }).el,
    slider({ label: 'Turbine rpm', min: 0, max: 5000, step: 50, value: 0, fmt: (v) => v.toLocaleString('en-US'), onInput(v) { S.turbine = v; } }).el,
    chips([{ value: 'off', label: 'Lockup off' }, { value: 'on', label: 'Lockup on' }], { value: 'off', onPick(v) { S.lockup = v === 'on'; } }).el,
  );
  return { destroy: () => cancelAnimationFrame(raf) };
}
