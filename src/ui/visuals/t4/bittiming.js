// One CAN bit split into time quanta: sync, propagation, phase 1, phase 2; the sample point.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';

// Typical setups (16 time quanta per bit, sample point ≈ 75–87.5%). Bus lengths are common rules of thumb.
const RATES = {
  125000: { tq: 16, prop: 7, ps1: 6, ps2: 2, len: '≈ 500 m' },
  250000: { tq: 16, prop: 7, ps1: 6, ps2: 2, len: '≈ 250 m' },
  500000: { tq: 16, prop: 7, ps1: 6, ps2: 2, len: '≈ 100 m' },
  1000000: { tq: 8, prop: 3, ps1: 3, ps2: 1, len: '≈ 25–40 m' },
};

export function mount(host, spec = {}) {
  const S = { rate: RATES[spec.bitrate] ? spec.bitrate : 500000 };
  const wrap = el(html`<figure class="vis bt" data-noswipe>
    <svg viewBox="0 0 340 120" class="d" role="img" aria-label="CAN bit timing"></svg>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Example timing; real settings depend on the controller clock and the network. Bus-length limits are rough rules of thumb (signals must cross the bus and back within one bit during arbitration). High-speed CAN in cars typically runs at 500 kbit/s.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  function draw() {
    const r = RATES[S.rate], segs = [['sync', 1, '#c9d1d9'], ['prop', r.prop, '#7fb2e0'], ['phase 1', r.ps1, '#ffc21a'], ['phase 2', r.ps2, '#c9a3e8']];
    const W = 320, q = W / r.tq;
    let x = 10, g = '';
    for (const [name, n, c] of segs) {
      for (let i = 0; i < n; i++) g += `<rect x="${x + i * q}" y="34" width="${q - 1.5}" height="30" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="0.8"/>`;
      g += `<text x="${x + (n * q) / 2}" y="82" text-anchor="middle" class="awd-sub" style="fill:${c}">${name}</text><text x="${x + (n * q) / 2}" y="94" text-anchor="middle" class="awd-sub">${n} tq</text>`;
      x += n * q;
    }
    const sp = 10 + (1 + r.prop + r.ps1) * q, pct = ((1 + r.prop + r.ps1) / r.tq) * 100;
    g += `<line x1="${sp}" x2="${sp}" y1="22" y2="70" stroke="#ff6b1a" stroke-width="2.5"/><text x="${Math.min(sp, 330)}" y="16" text-anchor="${sp > 250 ? 'end' : 'middle'}" class="awd-lbl" style="fill:#ff6b1a">sample point ${pct.toFixed(1)}%</text>
      <text x="10" y="114" class="awd-sub">one bit = ${r.tq} time quanta = ${(1e6 / S.rate).toFixed(S.rate >= 1e6 ? 1 : 0)} µs</text>`;
    svg.innerHTML = g;
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Bit time</small><b>${(1e6 / S.rate).toFixed(S.rate >= 1e6 ? 1 : 0)} µs</b></span>
      <span class="ro"><small>Max frames/s (8-byte)</small><b>≈ ${Math.round(S.rate / 130).toLocaleString('en-US')}</b></span>
      <span class="ro"><small>Bus length</small><b>${r.len}</b></span>`);
  }
  wrap.querySelector('.ctl').append(chips(Object.keys(RATES).map((k) => ({ value: Number(k), label: `${Number(k) / 1000}k` })), { value: S.rate, onPick(v) { S.rate = v; draw(); } }).el);
  draw();
  return { destroy() {} };
}
