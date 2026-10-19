// Compare two SIMULATED captures: per ID and byte, how often the value changes in each.
// Bytes that change only in the "action" capture are the suspects. Tap one to see its values.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';
import { runScenario, SCENARIOS } from '../../../core/can/sim.js';

const hex = (n, w = 3) => n.toString(16).toUpperCase().padStart(w, '0');
const ACTIONS = ['blinker', 'doors', 'pedal', 'brake', 'steer', 'drive'];

/** { id: { changes: [8], bitsChanged: [8 masks], series: [8][] , seconds } } */
export function profile(frames, seconds) {
  const out = {};
  for (const f of frames) {
    const r = (out[f.id] ||= { changes: new Array(8).fill(0), masks: new Array(8).fill(0), series: Array.from({ length: 8 }, () => []), prev: null, seconds });
    for (let i = 0; i < 8; i++) {
      if (r.prev && r.prev[i] !== f.data[i]) { r.changes[i]++; r.masks[i] |= r.prev[i] ^ f.data[i]; }
      if (r.series[i].length === 0 || r.series[i].length < 400) r.series[i].push([f.t, f.data[i]]);
    }
    r.prev = f.data;
  }
  return out;
}

export function mount(host, spec = {}) {
  const S = { base: spec.base || 'idle', action: spec.action || 'blinker', sel: null };
  const wrap = el(html`<figure class="vis cdf" data-noswipe>
    <div class="cd__top"><span class="t4-badge">Simulated</span><span class="cdf__lbl"></span></div>
    <div class="cdf__grid"></div>
    <div class="cdf__legend"><span><i class="lg-a"></i>changes only in action</span><span><i class="lg-b"></i>changes in both (noise, counters)</span><span><i class="lg-n"></i>steady</span></div>
    <div class="cdf__detail"></div>
    <div class="ctl"></div>
  </figure>`);
  host.append(wrap);
  const grid = wrap.querySelector('.cdf__grid'), detail = wrap.querySelector('.cdf__detail');
  let A, B;

  function compute() {
    B = profile(runScenario(S.base), SCENARIOS[S.base].seconds);
    A = profile(runScenario(S.action), SCENARIOS[S.action].seconds);
    wrap.querySelector('.cdf__lbl').textContent = `baseline “${S.base}” vs action “${S.action}”: ${SCENARIOS[S.action].label}`;
    S.sel = null;
    draw();
  }

  function cls(id, i) {
    const a = A[id]?.changes[i] || 0, b = B[id]?.changes[i] || 0;
    if (!a) return 'is-n';
    return b ? 'is-b' : 'is-a';
  }

  function draw() {
    const ids = [...new Set([...Object.keys(A), ...Object.keys(B)].map(Number))].sort((x, y) => x - y);
    grid.innerHTML = `<span></span>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<span class="cdf__h mono">B${i}</span>`).join('')}` + ids.map((id) => `<span class="cdf__id mono">${hex(id)}</span>` +
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<button type="button" class="cdf__c ${cls(id, i)} ${S.sel && S.sel[0] === id && S.sel[1] === i ? 'is-sel' : ''}" data-id="${id}" data-b="${i}" aria-label="ID ${hex(id)} byte ${i}">${A[id]?.changes[i] || ''}</button>`).join('')).join('');
    if (!S.sel) { detail.innerHTML = '<p class="muted">Orange cells changed only while the action happened. The number is how many times the byte changed. Tap a cell.</p>'; return; }
    const [id, i] = S.sel;
    const r = A[id], rb = B[id];
    const mask = r?.masks[i] || 0;
    const bits = [7, 6, 5, 4, 3, 2, 1, 0].map((b) => `<span class="${mask & (1 << b) ? 'on' : ''}">${b}</span>`).join('');
    const series = r?.series[i] || [];
    const T = SCENARIOS[S.action].seconds;
    const pts = series.map(([t, v]) => `${((t / T) * 300).toFixed(1)},${(70 - (v / 255) * 64).toFixed(1)}`).join(' ');
    detail.innerHTML = `<div class="cdf__d"><b class="mono">ID ${hex(id)} · byte ${i}</b>
      <span class="muted">changed ${r?.changes[i] || 0}× in “${S.action}”, ${rb?.changes[i] || 0}× in “${S.base}”</span>
      <span class="cdf__bits mono">bits that changed: ${bits}</span>
      <svg viewBox="0 0 300 74" class="d cdf__spark"><rect x="0" y="4" width="300" height="66" fill="#050607" stroke="#2a2f36"/><polyline points="${pts}" fill="none" stroke="#ff6b1a" stroke-width="1.6"/><text x="4" y="16" class="awd-sub">byte value over the action capture (0–255)</text></svg></div>`;
  }

  grid.addEventListener('click', (e) => {
    const c = e.target.closest('[data-id]');
    if (!c) return;
    S.sel = [Number(c.dataset.id), Number(c.dataset.b)];
    draw();
  });
  wrap.querySelector('.ctl').append(
    chips(ACTIONS.map((v) => ({ value: v, label: v })), { value: S.action, onPick(v) { S.action = v; compute(); } }).el,
  );
  compute();
  return { destroy() {} };
}
