// Aerodynamic drag: F = ½ ρ Cd A v²; power to overcome it = F × v (grows with v³).
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const RHO = 1.225; // kg/m³, sea level
export const drag = (cd, area, mps) => 0.5 * RHO * cd * area * mps * mps;
const PRESETS = {
  sedan: { label: 'Sleek sedan', cd: 0.27, area: 2.2 },
  suv: { label: 'Boxy compact SUV', cd: 0.4, area: 2.7 },
  bike: { label: 'Sport bike + tucked rider', cd: 0.6, area: 0.5 },
};

export function mount(host) {
  const S = { cd: 0.4, area: 2.7, mph: 65 };
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 200" class="d" role="img" aria-label="Drag power versus speed"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Presets are illustrative ballparks, not measured values for any specific vehicle. Ignores rolling resistance, which matters more at low speed.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  const draw = () => {
    const X = (mph) => 40 + (mph / 120) * 300;
    const pmax = (drag(S.cd, S.area, 120 * 0.44704) * 120 * 0.44704) / 745.7;
    const top = Math.max(50, Math.ceil(pmax / 50) * 50);
    const Y = (hp) => 170 - (hp / top) * 140;
    let d = '';
    for (let m = 0; m <= 120; m += 2) { const v = m * 0.44704; d += `${d ? 'L' : 'M'}${X(m)},${Y((drag(S.cd, S.area, v) * v) / 745.7)}`; }
    let s = `<rect x="40" y="30" width="300" height="140" fill="#0e1114" stroke="#262b31"/><path d="${d}" fill="none" stroke="#ff6b1a" stroke-width="2.5"/>`;
    for (let m = 0; m <= 120; m += 20) s += `<text x="${X(m)}" y="186" text-anchor="middle" class="awd-sub">${m}</text>`;
    for (let h = 0; h <= top; h += top / 4) s += `<text x="34" y="${Y(h) + 4}" text-anchor="end" class="awd-sub">${Math.round(h)}</text>`;
    const v = S.mph * 0.44704, F = drag(S.cd, S.area, v), P = F * v;
    s += `<circle cx="${X(S.mph)}" cy="${Y(P / 745.7)}" r="5" fill="#ffc21a"/><text x="44" y="24" class="awd-sub">hp needed just for drag · mph →</text>`;
    svg.innerHTML = s;
    out.innerHTML = String(html`<span class="ro"><small>Cd × A</small><b>${(S.cd * S.area).toFixed(2)} m²</b></span><span class="ro"><small>Drag force</small><b>${Math.round(F)} N (${Math.round(F * 0.2248)} lbf)</b></span>
      <span class="ro ro--hl"><small>Power to push air</small><b>${(P / 745.7).toFixed(1)} hp (${(P / 1000).toFixed(1)} kW)</b></span><span class="ro"><small>Double the speed →</small><b>8× the power</b></span>`);
  };
  const cd = slider({ label: 'Cd', min: 0.2, max: 0.8, step: 0.01, value: S.cd, fmt: (v) => v.toFixed(2), onInput(v) { S.cd = v; draw(); } });
  const ar = slider({ label: 'Frontal area', min: 0.3, max: 3.5, step: 0.05, value: S.area, fmt: (v) => `${v.toFixed(2)} m²`, onInput(v) { S.area = v; draw(); } });
  const sp = slider({ label: 'Speed', min: 10, max: 120, step: 1, value: S.mph, fmt: (v) => `${v} mph (${Math.round(v * 1.609)} km/h)`, onInput(v) { S.mph = v; draw(); } });
  wrap.querySelector('.ctl').append(chips(Object.entries(PRESETS).map(([value, p]) => ({ value, label: p.label })), { value: 'suv', onPick(v) { S.cd = PRESETS[v].cd; S.area = PRESETS[v].area; cd.set(S.cd); ar.set(S.area); draw(); } }).el, cd.el, ar.el, sp.el);
  draw();
  return { destroy() {} };
}
