// The same bits read as unsigned vs two's-complement signed, on a number wheel.
import { html, el } from '../../dom.js';
import { slider, chips } from '../controls.js';

export function mount(host, spec = {}) {
  const S = { bits: [4, 8].includes(spec.bits) ? spec.bits : 8, raw: 200 };
  const wrap = el(html`<figure class="vis tw" data-noswipe>
    <svg viewBox="-30 0 360 220" class="d" role="img" aria-label="Two's complement wheel"></svg>
    <div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Two’s complement: if the top bit is 1, the value is negative: subtract 2ⁿ. So for 8 bits, 0xFF = 255 unsigned = −1 signed. The DBC tells you which reading to use (“+” unsigned, “−” signed).</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');

  function draw() {
    const n = 2 ** S.bits, raw = Math.min(S.raw, n - 1);
    const signed = raw >= n / 2 ? raw - n : raw;
    const cx = 150, cy = 112, R = 86;
    const ang = (v) => (v / n) * 2 * Math.PI - Math.PI / 2;
    const ticks = S.bits === 4 ? [...Array(16).keys()] : [0, 32, 64, 96, 127, 128, 160, 192, 224, 255];
    const nudge = (t) => ({ 0: 0.2, 255: -0.42, 127: -0.22, 128: 0.42 }[t] || 0);
    let g = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#262b31" stroke-width="14"/>
      <path d="M${cx},${cy - R} A${R},${R} 0 0 1 ${cx},${cy + R}" fill="none" stroke="#7fb2e0" stroke-opacity="0.35" stroke-width="14"/>
      <path d="M${cx},${cy + R} A${R},${R} 0 0 1 ${cx},${cy - R}" fill="none" stroke="#ff6b1a" stroke-opacity="0.35" stroke-width="14"/>
      <text x="${cx + R + 10}" y="${cy}" class="awd-sub" style="fill:#7fb2e0">top bit 0</text><text x="${cx - R - 10}" y="${cy}" text-anchor="end" class="awd-sub" style="fill:#ff6b1a">top bit 1</text>`;
    for (const t of ticks) {
      const a = ang(t) + (S.bits === 8 ? nudge(t) : 0), s = t >= n / 2 ? t - n : t;
      g += `<text x="${cx + Math.cos(a) * (R - 24)}" y="${cy + Math.sin(a) * (R - 24) + 4}" text-anchor="middle" class="awd-sub">${t}${s !== t ? `/${s}` : ''}</text>`;
    }
    const a = ang(raw);
    g += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * (R + 8)}" y2="${cy + Math.sin(a) * (R + 8)}" stroke="#ffc21a" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="#ffc21a"/>`;
    svg.innerHTML = g;
    wrap.querySelector('.big-out').innerHTML = String(html`<span class="ro"><small>Bits</small><b class="mono" style="font-size:15px">${raw.toString(2).padStart(S.bits, '0')}</b></span><span class="ro"><small>Unsigned</small><b>${raw}</b></span><span class="ro ro--hl"><small>Signed</small><b>${signed}</b></span>`);
  }
  const ctl = wrap.querySelector('.ctl');
  const build = () => {
    ctl.replaceChildren(slider({ label: 'Raw', min: 0, max: 2 ** S.bits - 1, value: Math.min(S.raw, 2 ** S.bits - 1), onInput(v) { S.raw = v; draw(); } }).el,
      chips([{ value: 4, label: '4 bits' }, { value: 8, label: '8 bits' }], { value: S.bits, onPick(v) { S.bits = v; S.raw = Math.min(S.raw, 2 ** v - 1); build(); draw(); } }).el);
  };
  build(); draw();
  return { destroy() {} };
}
