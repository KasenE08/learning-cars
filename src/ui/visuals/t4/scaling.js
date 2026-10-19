// physical = raw × scale + offset. Shows the line, range and resolution.
import { html, el } from '../../dom.js';
import { slider } from '../controls.js';

export function mount(host, spec = {}) {
  const S = { scale: spec.scale ?? 0.01, offset: spec.offset ?? 0, bits: spec.bits ?? 16, unit: spec.unit || 'km/h', raw: Math.round(((spec.bits ?? 16) >= 12 ? 6437 : 100)) };
  const wrap = el(html`<figure class="vis sc" data-noswipe>
    <svg viewBox="0 0 340 180" class="d" role="img" aria-label="Scaling and offset"></svg>
    <div class="bf__line bf__phys"><small>formula</small><span class="mono sc__f"></span></div>
    <div class="big-out"></div><div class="ctl"></div>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const max = 2 ** S.bits - 1;
  function draw() {
    const lo = S.offset, hi = max * S.scale + S.offset;
    const phys = S.raw * S.scale + S.offset;
    const px = (r) => 40 + (r / max) * 280, py = (v) => 150 - ((v - lo) / (hi - lo || 1)) * 120;
    const zeroY = lo < 0 && hi > 0 ? py(0) : null;
    svg.innerHTML = `<rect x="40" y="30" width="280" height="120" fill="#050607" stroke="#2a2f36"/>
      ${zeroY ? `<line x1="40" x2="320" y1="${zeroY}" y2="${zeroY}" stroke="#3a424c" stroke-dasharray="3 3"/><text x="36" y="${zeroY + 4}" text-anchor="end" class="awd-sub">0</text>` : ''}
      <line x1="${px(0)}" y1="${py(lo)}" x2="${px(max)}" y2="${py(hi)}" stroke="#ff6b1a" stroke-width="2"/>
      <line x1="${px(S.raw)}" x2="${px(S.raw)}" y1="150" y2="${py(phys)}" stroke="#ffc21a" stroke-dasharray="3 3"/>
      <line x1="40" x2="${px(S.raw)}" y1="${py(phys)}" y2="${py(phys)}" stroke="#ffc21a" stroke-dasharray="3 3"/>
      <circle cx="${px(S.raw)}" cy="${py(phys)}" r="5" fill="#ffc21a"/>
      <text x="36" y="34" text-anchor="end" class="awd-sub">${+hi.toFixed(2)}</text><text x="36" y="154" text-anchor="end" class="awd-sub">${+lo.toFixed(2)}</text>
      <text x="40" y="168" class="awd-sub">raw 0</text><text x="320" y="168" text-anchor="end" class="awd-sub">raw ${max.toLocaleString('en-US')} (${S.bits} bits)</text>
      <text x="40" y="20" class="awd-sub">physical (${S.unit})</text>`;
    wrap.querySelector('.sc__f').innerHTML = `${S.raw} × ${S.scale} ${S.offset < 0 ? '−' : '+'} ${Math.abs(S.offset)} = <b>${+phys.toFixed(4)} ${S.unit}</b>`;
    wrap.querySelector('.big-out').innerHTML = String(html`<span class="ro"><small>Range</small><b style="font-size:14px">${+lo.toFixed(2)} … ${+hi.toFixed(2)} ${S.unit}</b></span><span class="ro ro--hl"><small>Resolution (1 raw step)</small><b style="font-size:14px">${S.scale} ${S.unit}</b></span>`);
  }
  wrap.querySelector('.ctl').append(slider({ label: 'Raw value', min: 0, max, value: S.raw, fmt: (v) => `${v}`, onInput(v) { S.raw = v; draw(); } }).el);
  draw();
  return { destroy() {} };
}
