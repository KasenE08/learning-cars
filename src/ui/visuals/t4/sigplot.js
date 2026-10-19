// Plot a chosen bit range of one ID over a SIMULATED capture. Right bits → smooth curve; wrong → noise.
import { html, el } from '../../dom.js';
import { slider, chips } from '../controls.js';
import { runScenario, SCENARIOS } from '../../../core/can/sim.js';
import { extractRaw, signalBits } from '../../../core/can/bits.js';

const hex = (n) => n.toString(16).toUpperCase().padStart(3, '0');

export function mount(host, spec = {}) {
  const sc = spec.scenario || 'drive';
  const frames = runScenario(sc);
  const ids = [...new Set(frames.map((f) => f.id))].sort((a, b) => a - b);
  const S = { id: spec.id ?? 0x415, start: spec.start ?? 7, length: spec.length ?? 16, endian: spec.endian || 'big' };
  const wrap = el(html`<figure class="vis sp" data-noswipe>
    <div class="cd__top"><span class="t4-badge">Simulated</span><span>${SCENARIOS[sc].label}</span></div>
    <svg viewBox="0 0 340 170" class="d" role="img" aria-label="Signal plot"></svg>
    <div class="big-out"></div>
    <div class="ctl"></div>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');

  function draw() {
    const fr = frames.filter((f) => f.id === S.id);
    const sig = { start: S.start, length: S.length, endian: S.endian };
    const bits = signalBits(sig);
    const valid = bits.every((p) => p >= 0 && p < 64);
    const vals = valid ? fr.map((f) => [f.t, extractRaw(f.data, sig)]) : [];
    const max = Math.max(1, ...vals.map((v) => v[1])), min = Math.min(0, ...vals.map((v) => v[1]));
    const T = SCENARIOS[sc].seconds;
    const pts = vals.map(([t, v]) => `${(30 + (t / T) * 300).toFixed(1)},${(150 - ((v - min) / (max - min || 1)) * 130).toFixed(1)}`).join(' ');
    // smoothness score: mean absolute step relative to range
    let jump = 0, big = 0;
    for (let i = 1; i < vals.length; i++) { const d = Math.abs(vals[i][1] - vals[i - 1][1]); jump += d; if (d > 0.4 * (max - min)) big++; }
    let inc = 0;
    for (let i = 1; i < vals.length; i++) if (((vals[i][1] - vals[i - 1][1]) % 2 ** S.length + 2 ** S.length) % 2 ** S.length === 1) inc++;
    const counter = vals.length > 10 && inc / (vals.length - 1) > 0.9;
    const rough = vals.length > 1 ? jump / (vals.length - 1) / (max - min || 1) : 0;
    svg.innerHTML = `<rect x="30" y="18" width="300" height="134" fill="#050607" stroke="#2a2f36"/>
      <polyline points="${pts}" fill="none" stroke="${rough > 0.08 || big ? '#7d7a74' : '#ff6b1a'}" stroke-width="1.6"/>
      <text x="26" y="26" text-anchor="end" class="awd-sub">${max}</text><text x="26" y="154" text-anchor="end" class="awd-sub">${min}</text>
      <text x="330" y="166" text-anchor="end" class="awd-sub">${T} s</text><text x="30" y="166" class="awd-sub">0</text>
      <text x="30" y="11" class="awd-sub">raw value of ID ${hex(S.id)}, bits ${S.start}|${S.length} ${S.endian === 'big' ? 'Motorola' : 'Intel'}</text>`;
    out.innerHTML = String(html`<span class="ro ${rough <= 0.08 && !big && max > 1 ? 'ro--hl' : ''}"><small>Looks like</small><b style="font-size:14px">${!valid ? 'Bits run off the frame' : counter ? 'A rolling counter (+1 each frame)' : max <= 1 && min === 0 ? 'A flag (0/1)' : rough > 0.25 ? 'Noise / counter / checksum' : rough > 0.08 ? 'Jumpy: probably wrong bits' : big ? 'Wraps around: top bits are missing' : 'A smooth physical signal'}</b></span>
      <span class="ro"><small>Range</small><b>${min} … ${max}</b></span>`);
  }

  wrap.querySelector('.ctl').append(
    chips(ids.map((id) => ({ value: id, label: hex(id) })), { value: S.id, onPick(v) { S.id = v; draw(); } }).el,
    slider({ label: 'Start bit', min: 0, max: 63, value: S.start, onInput(v) { S.start = v; draw(); } }).el,
    slider({ label: 'Length', min: 1, max: 16, value: S.length, fmt: (v) => `${v} bits`, onInput(v) { S.length = v; draw(); } }).el,
    chips([{ value: 'big', label: 'Motorola' }, { value: 'little', label: 'Intel' }], { value: S.endian, onPick(v) { S.endian = v; draw(); } }).el,
  );
  draw();
  return { destroy() {} };
}
