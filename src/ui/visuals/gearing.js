// Gearing calculator: ratio × final drive × tire → road speed per 1,000 rpm, rpm at a speed, torque multiplication.
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const PRESETS = {
  generic: { label: 'Typical 6-speed manual', ratios: [3.36, 2.07, 1.43, 1.12, 0.92, 0.79], final: 3.9, tire: 26.0, redline: 6800 },
  // Bronco Sport 2.0 / 8F35 ratios and final drive per Ford's Bronco Sport spec sheet (facts bronco.gearRatios,
  // bronco.finalDrive); 28.5 in = standard 225/65R17 tire. Redline is approximate.
  bronco: { label: 'Bronco Sport 2.0 · 8F35', ratios: [4.69, 3.31, 3.01, 1.92, 1.45, 1.0, 0.75, 0.62], final: 3.81, tire: 28.5, redline: 6500 },
};

export const mphPer1000 = (overall, tireIn) => (1000 * Math.PI * tireIn * 60) / (overall * 63360);

export function mount(host, spec = {}) {
  let P = { ...PRESETS[spec.preset || 'generic'], ratios: [...PRESETS[spec.preset || 'generic'].ratios] };
  let speed = 65;
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 200" class="d" role="img" aria-label="Speed in each gear"></svg><div class="gr__tbl"></div><div class="ctl"></div>
    <p class="vis__note">mph per 1,000 rpm = 1,000 × π × tire diameter (in) × 60 ÷ (overall ratio × 63,360). Overall ratio = gear × final drive. Bronco preset: Ford’s published ratios; redline ≈6,500 rpm is approximate.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const tbl = wrap.querySelector('.gr__tbl');
  const draw = () => {
    const maxMph = mphPer1000(P.ratios[P.ratios.length - 1] * P.final, P.tire) * P.redline / 1000;
    const X = (mph) => 40 + (mph / Math.max(1, maxMph)) * 300, Y = (rpm) => 170 - (rpm / P.redline) * 140;
    let s = `<rect x="40" y="30" width="300" height="140" fill="#0e1114" stroke="#262b31"/>`;
    for (let r = 0; r <= P.redline; r += 2000) s += `<text x="34" y="${Y(r) + 4}" text-anchor="end" class="awd-sub">${r / 1000}k</text><line x1="40" x2="340" y1="${Y(r)}" y2="${Y(r)}" stroke="#1c2026"/>`;
    for (let m = 0; m <= maxMph; m += 40) s += `<text x="${X(m)}" y="186" text-anchor="middle" class="awd-sub">${m}</text>`;
    P.ratios.forEach((g, i) => {
      const k = mphPer1000(g * P.final, P.tire) / 1000;
      s += `<path d="M${X(0)},${Y(0)} L${X(k * P.redline)},${Y(P.redline)}" stroke="${i % 2 ? '#ffc21a' : '#ff6b1a'}" stroke-width="2"/><text x="${X(k * P.redline) + 2}" y="26" class="awd-sub">${i + 1}</text>`;
    });
    s += `<line x1="${X(speed)}" x2="${X(speed)}" y1="30" y2="170" stroke="#7fb2e0" stroke-dasharray="3 3"/><text x="342" y="198" text-anchor="end" class="awd-sub">mph →  ·  ↑ engine rpm</text>`;
    svg.innerHTML = s;
    tbl.innerHTML = String(html`<table class="gr"><thead><tr><th>Gear</th><th>Ratio</th><th>Overall</th><th>mph/1k</th><th>rpm @ ${speed} mph</th><th>Top (redline)</th></tr></thead><tbody>
      ${P.ratios.map((g, i) => { const o = g * P.final, k = mphPer1000(o, P.tire); const r = (speed / k) * 1000; return html`<tr class="${r > P.redline ? 'is-over' : ''}"><td>${i + 1}</td><td>${g.toFixed(2)}</td><td>${o.toFixed(2)}</td><td>${k.toFixed(1)}</td><td>${r > P.redline ? 'over redline' : Math.round(r).toLocaleString('en-US')}</td><td>${Math.round((k * P.redline) / 1000)} mph</td></tr>`; })}
    </tbody></table>`);
  };
  const ctl = wrap.querySelector('.ctl');
  ctl.append(
    chips(Object.entries(PRESETS).map(([value, p]) => ({ value, label: p.label })), { value: spec.preset || 'generic', onPick(v) { P = { ...PRESETS[v], ratios: [...PRESETS[v].ratios] }; fd.set(P.final); tire.set(P.tire); draw(); } }).el,
  );
  const fd = slider({ label: 'Final drive', min: 2.5, max: 5, step: 0.01, value: P.final, fmt: (v) => `${v.toFixed(2)}:1`, onInput(v) { P.final = v; draw(); } });
  const tire = slider({ label: 'Tire dia.', min: 22, max: 35, step: 0.1, value: P.tire, fmt: (v) => `${v.toFixed(1)} in`, onInput(v) { P.tire = v; draw(); } });
  const sp = slider({ label: 'Speed', min: 10, max: 120, step: 1, value: speed, fmt: (v) => `${v} mph (${Math.round(v * 1.609)} km/h)`, onInput(v) { speed = v; draw(); } });
  ctl.append(fd.el, tire.el, sp.el);
  draw();
  return { destroy() {} };
}
