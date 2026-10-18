// Dyno chart. Curves are smooth interpolations through a few points anchored to published peaks
// (Bronco: 277 lb-ft @ 3,000 / 250 hp @ 5,500; Ninja 500: 42.6 N·m @ 6,000 / 45 PS @ 9,000 (Kawasaki AU);
// RS 457: 43.5 N·m @ 6,700 / 47.6 hp @ 9,400 claimed). Shapes between those points are illustrative.
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const ENGINES = {
  bronco: { label: 'Bronco 2.0 EcoBoost', max: 6500, pts: [[1000, 120], [1800, 220], [2500, 270], [3000, 277], [4000, 274], [5000, 255], [5500, 238.7], [6000, 214], [6500, 188]], peakT: 3000, peakP: 5500 },
  ninja: { label: 'Ninja 500', max: 10000, pts: [[2000, 22], [4000, 27.5], [6000, 31.4], [7500, 28.6], [9000, 25.9], [10000, 21]], peakT: 6000, peakP: 9000 },
  rs457: { label: 'RS 457', max: 10500, pts: [[2000, 21], [4000, 26.5], [6700, 32.1], [8000, 29.4], [9400, 26.6], [10500, 21.5]], peakT: 6700, peakP: 9400 },
};

/** Monotone cubic (Fritsch–Carlson) interpolation: no fake bumps between points. */
export function torqueAt(eng, rpm) {
  const p = eng.pts;
  if (rpm <= p[0][0]) return p[0][1];
  if (rpm >= p[p.length - 1][0]) return p[p.length - 1][1];
  const n = p.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  const i = p.findIndex((q, k) => rpm >= q[0] && rpm <= p[k + 1][0]);
  const h = p[i + 1][0] - p[i][0], t = (rpm - p[i][0]) / h;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
  return h00 * p[i][1] + h10 * h * m[i] + h01 * p[i + 1][1] + h11 * h * m[i + 1];
}
export const hpAt = (eng, rpm) => (torqueAt(eng, rpm) * rpm) / 5252;

export function mount(host, spec = {}) {
  let which = spec.engine || 'bronco';
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 250" class="d" role="img" aria-label="Dyno chart"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Curves pass through the published peak numbers; the shape between them is illustrative (makers don’t publish full curves). Crank figures, not wheel.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const out = wrap.querySelector('.big-out');
  let rpm = 3000, sl;
  const X = (r, max) => 40 + (r / max) * 300, Y = (v, top) => 210 - (v / top) * 180;
  const draw = () => {
    const list = which === 'compare' ? ['ninja', 'rs457'] : [which];
    const max = Math.max(...list.map((k) => ENGINES[k].max));
    const top = Math.ceil(Math.max(...list.flatMap((k) => [ENGINES[k].pts.reduce((a, q) => Math.max(a, q[1]), 0), hpAt(ENGINES[k], ENGINES[k].peakP)])) / 10) * 10 + 10;
    let s = `<rect x="40" y="30" width="300" height="180" fill="#0e1114" stroke="#262b31"/>`;
    for (let v = 0; v <= top; v += top > 100 ? 50 : 10) s += `<line x1="40" x2="340" y1="${Y(v, top)}" y2="${Y(v, top)}" stroke="#1c2026"/><text x="34" y="${Y(v, top) + 4}" text-anchor="end" class="awd-sub">${v}</text>`;
    for (let r = 0; r <= max; r += max > 8000 ? 2000 : 1000) s += `<text x="${X(r, max)}" y="226" text-anchor="middle" class="awd-sub">${r / 1000}k</text>`;
    const dash = (k) => (k === 'rs457' ? 'stroke-dasharray="6 4"' : '');
    for (const k of list) {
      const e = ENGINES[k];
      let dt = '', dp = '';
      for (let r = e.pts[0][0]; r <= e.max; r += 50) { dt += `${dt ? 'L' : 'M'}${X(r, max).toFixed(1)},${Y(torqueAt(e, r), top).toFixed(1)}`; dp += `${dp ? 'L' : 'M'}${X(r, max).toFixed(1)},${Y(hpAt(e, r), top).toFixed(1)}`; }
      s += `<path d="${dt}" fill="none" stroke="#ff6b1a" stroke-width="2.5" ${dash(k)}/><path d="${dp}" fill="none" stroke="#ffc21a" stroke-width="2.5" ${dash(k)}/>`;
    }
    if (which === 'bronco') s += `<line x1="${X(5252, max)}" x2="${X(5252, max)}" y1="30" y2="210" stroke="#5b6470" stroke-dasharray="3 3"/><text x="${X(5252, max) - 4}" y="44" text-anchor="end" class="awd-sub">5,252 rpm: curves cross</text>`;
    s += `<line class="dy-cur" y1="30" y2="210" stroke="#e8e4da" stroke-width="1"/>`;
    s += `<text x="44" y="22" class="awd-sub" style="fill:#ff6b1a">— torque (lb-ft)</text><text x="160" y="22" class="awd-sub" style="fill:#ffc21a">— horsepower</text>${which === 'compare' ? '<text x="270" y="22" class="awd-sub">solid Ninja · dashed RS</text>' : ''}`;
    svg.innerHTML = s;
    const cx = X(Math.min(rpm, max), max);
    const c = svg.querySelector('.dy-cur'); c.setAttribute('x1', cx); c.setAttribute('x2', cx);
    out.innerHTML = list.map((k) => {
      const e = ENGINES[k], r = Math.max(e.pts[0][0], Math.min(rpm, e.max)), t = torqueAt(e, r), h = hpAt(e, r);
      return String(html`<span class="ro ro--hl"><small>${e.label} @ ${Math.round(r).toLocaleString('en-US')} rpm</small><b>${t.toFixed(1)} lb-ft · ${h.toFixed(1)} hp</b><small>${(t * 1.3558).toFixed(1)} N·m · ${(h * 0.7457).toFixed(1)} kW · hp = ${t.toFixed(1)} × ${Math.round(r)} ÷ 5252</small></span>`);
    }).join('');
    if (sl) { sl.el.querySelector('input').max = max; }
  };
  sl = slider({ label: 'rpm', min: 1000, max: ENGINES[which === 'compare' ? 'rs457' : which].max, step: 50, value: rpm, fmt: (v) => v.toLocaleString('en-US'), onInput(v) { rpm = v; draw(); } });
  const ctl = wrap.querySelector('.ctl');
  ctl.append(sl.el);
  if (spec.engine === 'compare' || spec.pick) ctl.append(chips([{ value: 'bronco', label: 'Bronco' }, { value: 'ninja', label: 'Ninja 500' }, { value: 'rs457', label: 'RS 457' }, { value: 'compare', label: 'Bikes compared' }], { value: which, onPick(v) { which = v; draw(); } }).el);
  draw();
  return { destroy() {} };
}
