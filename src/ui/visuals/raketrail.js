// Rake & trail: trail = (R·sin(rake) − offset) / cos(rake)
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const trailMm = (rakeDeg, offsetMm, radiusMm) => { const r = (rakeDeg * Math.PI) / 180; return (radiusMm * Math.sin(r) - offsetMm) / Math.cos(r); };
// Ninja 500: 24.5° rake, 92 mm trail (Kawasaki AU). Offset is solved from those and a ~300 mm loaded tire radius (illustrative).
const NINJA = { rake: 24.5, radius: 300 };
NINJA.offset = Math.round(NINJA.radius * Math.sin((NINJA.rake * Math.PI) / 180) - 92 * Math.cos((NINJA.rake * Math.PI) / 180));

export function mount(host, spec = {}) {
  const S = spec.preset === 'ninja' ? { ...NINJA } : { rake: 24, offset: 30, radius: 300 };
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 280" class="d" role="img" aria-label="Rake and trail"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">${spec.preset === 'ninja' ? 'Ninja preset: Kawasaki’s 24.5° rake and 92 mm trail; the fork offset shown is back-calculated for a ~300 mm tire radius (illustrative).' : 'More trail = more self-centering and stability; less trail = quicker, lighter steering.'}</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  const k = 0.55, gy = 250;
  const draw = () => {
    const t = trailMm(S.rake, S.offset, S.radius), a = (S.rake * Math.PI) / 180;
    const ax = 200, ay = gy - S.radius * k;                       // axle
    // steering axis passes offset (perpendicular) ahead of the axle; ground hit point:
    const ox = ax + S.offset * k * Math.cos(a), oy = ay - S.offset * k * Math.sin(a) * -1;
    const gx = ox + (gy - oy) * Math.tan(a);                      // where the axis meets the ground
    const topX = ox - (oy - 20) * Math.tan(a);
    svg.innerHTML = `<line x1="10" x2="350" y1="${gy}" y2="${gy}" stroke="#5b6470" stroke-width="2"/>
      <circle cx="${ax}" cy="${ay}" r="${S.radius * k}" fill="none" stroke="#8994a1" stroke-width="6"/><circle cx="${ax}" cy="${ay}" r="4" fill="#c9d1d9"/>
      <line x1="${topX}" y1="20" x2="${gx}" y2="${gy}" stroke="#ffc21a" stroke-width="2" stroke-dasharray="6 4"/>
      <line x1="${topX + 6}" y1="40" x2="${ax + 3}" y2="${ay}" stroke="#e6c46a" stroke-width="8" stroke-linecap="round"/>
      <path d="M${ax},${gy} L${gx},${gy}" stroke="#ff6b1a" stroke-width="5"/>
      <text x="${(ax + gx) / 2}" y="${gy + 18}" text-anchor="middle" style="fill:#ff6b1a">trail ${t.toFixed(0)} mm</text>
      <path d="M${gx},${gy} L${gx},${gy - 70}" stroke="#3a424c" stroke-dasharray="3 3"/>
      <text x="${gx - 8}" y="${gy - 74}" text-anchor="end" class="geo-t">rake ${S.rake.toFixed(1)}°</text>
      <circle cx="${ax}" cy="${gy}" r="4" fill="#ff6b1a"/><text x="${ax}" y="${gy - 6}" text-anchor="middle" class="awd-sub">contact patch</text>`;
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Trail</small><b>${t.toFixed(0)} mm (${(t / 25.4).toFixed(1)} in)</b></span><span class="ro"><small>Feel</small><b style="font-size:13px">${t > 105 ? 'Very stable, slower steering' : t > 85 ? 'Sport-bike balance' : t > 60 ? 'Quick, light steering' : 'Twitchy'}</b></span>`);
  };
  wrap.querySelector('.ctl').append(
    slider({ label: 'Rake', min: 18, max: 35, step: 0.5, value: S.rake, fmt: (v) => `${v.toFixed(1)}°`, onInput(v) { S.rake = v; draw(); } }).el,
    slider({ label: 'Fork offset', min: 0, max: 60, value: S.offset, fmt: (v) => `${v} mm`, onInput(v) { S.offset = v; draw(); } }).el,
    slider({ label: 'Tire radius', min: 250, max: 340, value: S.radius, fmt: (v) => `${v} mm`, onInput(v) { S.radius = v; draw(); } }).el,
  );
  draw();
  return { destroy() {} };
}
