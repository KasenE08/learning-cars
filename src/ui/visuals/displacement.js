// Bore & stroke → displacement calculator with real presets.
// spec: { cylinders?: boolean (show cylinder count), preset?: 'bronco' | 'ninja' | 'rs457' }
import { html, el } from '../dom.js';
import { slider, chips, fmt0, fmt1 } from './controls.js';

export const PRESETS = {
  bronco: { label: 'Bronco 2.0', bore: 87.5, stroke: 83.1, cyl: 4 },
  ninja: { label: 'Ninja 500', bore: 70.0, stroke: 58.6, cyl: 2 },
  rs457: { label: 'RS 457', bore: 69.0, stroke: 61.1, cyl: 2 },
};

export const cylinderCc = (bore, stroke) => (Math.PI / 4) * (bore / 10) ** 2 * (stroke / 10);

export function squareness(bore, stroke) {
  const r = bore / stroke;
  if (r > 1.02) return 'Oversquare (bore > stroke)';
  if (r < 0.98) return 'Undersquare (stroke > bore)';
  return 'Square (bore ≈ stroke)';
}

export function mount(host, spec = {}) {
  const showCyl = spec.cylinders !== false;
  const st = { ...PRESETS[spec.preset || 'bronco'] };
  const wrap = el(html`<figure class="vis vis--disp" data-noswipe><svg viewBox="0 0 360 250" class="d" role="img" aria-label="Cylinder with bore and stroke"></svg><div class="big-out"></div><div class="ctl"></div></figure>`);
  const svg = wrap.querySelector('svg');
  const out = wrap.querySelector('.big-out');
  const ctl = wrap.querySelector('.ctl');
  host.append(wrap);

  const draw = () => {
    const k = 1.5; // px per mm
    const w = st.bore * k, h = st.stroke * k;
    const x = 180 - w / 2, tdc = 40, bdc = tdc + h;
    svg.innerHTML = `
      <rect x="${x - 14}" y="${tdc - 14}" width="14" height="${h + 70}" class="d-line" fill="#1b1f24"/>
      <rect x="${x + w}" y="${tdc - 14}" width="14" height="${h + 70}" class="d-line" fill="#1b1f24"/>
      <rect x="${x}" y="${tdc}" width="${w}" height="${h}" fill="rgba(79,134,184,0.28)" stroke="#7fb2e0" stroke-dasharray="4 3"/>
      <text x="180" y="${tdc + h / 2 + 4}" text-anchor="middle" style="fill:#a8c8e8">swept volume</text>
      <rect x="${x + 2}" y="${bdc}" width="${w - 4}" height="34" rx="2" fill="#8f99a3" stroke="#c9d1d9"/>
      <line x1="${x - 24}" x2="${x + w + 24}" y1="${tdc}" y2="${tdc}" class="geo-ref"/><text x="${x - 28}" y="${tdc + 4}" text-anchor="end" class="geo-t">TDC</text>
      <line x1="${x - 24}" x2="${x + w + 24}" y1="${bdc}" y2="${bdc}" class="geo-ref"/><text x="${x - 28}" y="${bdc + 4}" text-anchor="end" class="geo-t">BDC</text>
      <path d="M${x},${tdc - 22} L${x + w},${tdc - 22} M${x + 6},${tdc - 27} L${x},${tdc - 22} L${x + 6},${tdc - 17} M${x + w - 6},${tdc - 27} L${x + w},${tdc - 22} L${x + w - 6},${tdc - 17}" class="geo-dim" style="stroke:var(--orange)"/>
      <text x="180" y="${tdc - 28}" text-anchor="middle" style="fill:var(--orange)">bore ${fmt1(st.bore)} mm</text>
      <path d="M${x + w + 30},${tdc} L${x + w + 30},${bdc} M${x + w + 25},${tdc + 6} L${x + w + 30},${tdc} L${x + w + 35},${tdc + 6} M${x + w + 25},${bdc - 6} L${x + w + 30},${bdc} L${x + w + 35},${bdc - 6}" class="geo-dim"/>
      <text x="${x + w + 46}" y="${(tdc + bdc) / 2}" class="geo-t" text-anchor="middle" transform="rotate(90 ${x + w + 46} ${(tdc + bdc) / 2})">stroke ${fmt1(st.stroke)} mm</text>`;
    const one = cylinderCc(st.bore, st.stroke);
    const total = one * st.cyl;
    out.innerHTML = String(html`
      <span class="ro"><small>Per cylinder</small><b>${fmt1(one)} cc</b></span>
      ${showCyl ? html`<span class="ro ro--hl"><small>Total · ${st.cyl} cyl</small><b>${fmt0(total)} cc</b></span>
      <span class="ro"><small>Liters / cu in</small><b>${(total / 1000).toFixed(2)} L · ${fmt0(total / 16.387)} ci</b></span>` : ''}
      <span class="ro"><small>Bore ÷ stroke</small><b>${(st.bore / st.stroke).toFixed(2)}</b></span>
      <span class="ro"><small>Shape</small><b style="font-size:13px">${squareness(st.bore, st.stroke)}</b></span>`);
  };

  const presetChips = chips([...Object.entries(PRESETS).map(([v, p]) => ({ value: v, label: p.label })), { value: 'custom', label: 'Custom' }], {
    value: spec.preset || 'bronco',
    onPick(v) {
      if (v === 'custom') return;
      Object.assign(st, PRESETS[v]);
      bore.set(st.bore); stroke.set(st.stroke); cyl?.set(st.cyl);
      draw();
    },
  });
  const custom = () => presetChips.set('custom');
  const bore = slider({ label: 'Bore', min: 40, max: 110, step: 0.1, value: st.bore, fmt: (v) => `${fmt1(v)} mm`, onInput(v) { st.bore = v; custom(); draw(); } });
  const stroke = slider({ label: 'Stroke', min: 40, max: 110, step: 0.1, value: st.stroke, fmt: (v) => `${fmt1(v)} mm`, onInput(v) { st.stroke = v; custom(); draw(); } });
  const cyl = showCyl ? chips([1, 2, 3, 4, 6, 8].map((n) => ({ value: n, label: `${n} cyl` })), { value: st.cyl, onPick(v) { st.cyl = v; custom(); draw(); } }) : null;
  ctl.append(presetChips.el, bore.el, stroke.el, ...(cyl ? [cyl.el] : []));
  draw();
  return { destroy() {} };
}
