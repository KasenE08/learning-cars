// Lean angle: tan θ = v² / (g·r). Front view of a bike leaning, plus a countersteer sequence.
import { html, el } from '../dom.js';
import { slider } from './controls.js';

export const leanAngle = (mph, radiusFt) => {
  const v = mph * 0.44704, r = radiusFt * 0.3048;
  return (Math.atan((v * v) / (9.81 * r)) * 180) / Math.PI;
};

export function mount(host) {
  const S = { mph: 35, r: 150, cs: 0, csT: 0 };
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 260" class="d" role="img" aria-label="Lean angle"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Ideal-physics lean for a point mass; real bikes lean a bit more because tires have width and the rider’s body position matters. Street tires typically allow roughly 40–50° on a dry track; the street is not the place to find out.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  let raf = 0;
  const draw = () => {
    let lean = leanAngle(S.mph, S.r), steer = 0, phase = '';
    if (S.cs > 0) {
      const t = S.csT;
      if (t < 0.6) { steer = -12 * Math.sin((t / 0.6) * Math.PI); lean = 0 + (t / 0.6) * 4; phase = '1 · Push the RIGHT bar: front wheel steers LEFT for an instant'; }
      else if (t < 1.6) { lean = 4 + ((t - 0.6) / 1) * (leanAngle(S.mph, S.r) - 4); phase = '2 · Wheels steered out from under the bike → it falls (leans) RIGHT'; }
      else { lean = leanAngle(S.mph, S.r); steer = 3; phase = '3 · Leaned over, the bike turns RIGHT. Holding a lean = holding a balance.'; }
    }
    const a = (lean * Math.PI) / 180, cx = 180, gy = 230;
    const top = [cx + 150 * Math.sin(a), gy - 150 * Math.cos(a)];
    svg.innerHTML = `<line x1="20" x2="340" y1="${gy}" y2="${gy}" stroke="#5b6470" stroke-width="2"/>
      <path d="M${cx},${gy} L${cx},${gy - 170}" stroke="#3a424c" stroke-dasharray="3 4"/>
      <g transform="rotate(${lean} ${cx} ${gy})">
        <ellipse cx="${cx}" cy="${gy - 34}" rx="12" ry="34" fill="#14171a" stroke="#8994a1" stroke-width="4"/>
        <rect x="${cx - 26}" y="${gy - 110}" width="52" height="60" rx="10" fill="#4a535e" stroke="#c9d1d9"/>
        <rect x="${cx - 18}" y="${gy - 150}" width="36" height="42" rx="12" fill="#262b31" stroke="#ff6b1a"/>
        <circle cx="${cx}" cy="${gy - 162}" r="12" fill="#3a424c" stroke="#c9d1d9"/>
        <g transform="rotate(${steer} ${cx} ${gy - 120})"><line x1="${cx - 40}" x2="${cx + 40}" y1="${gy - 120}" y2="${gy - 120}" stroke="#ffc21a" stroke-width="5" stroke-linecap="round"/></g>
      </g>
      <path d="M${cx},${gy - 60} A60,60 0 0 1 ${cx + 60 * Math.sin(a)},${gy - 60 * Math.cos(a)}" fill="none" stroke="#ff6b1a" stroke-width="2"/>
      <text x="${cx + 70}" y="${gy - 60}" class="geo-t">${lean.toFixed(0)}°</text>
      ${phase ? `<text x="180" y="24" text-anchor="middle" class="awd-sub" style="fill:var(--ink)">${phase}</text>` : ''}`;
    const L = leanAngle(S.mph, S.r);
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Lean needed</small><b>${L.toFixed(1)}°</b></span><span class="ro"><small>Sideways g</small><b>${Math.tan((L * Math.PI) / 180).toFixed(2)} g</b></span><span class="ro"><small>Verdict</small><b style="font-size:13px">${L < 25 ? 'Relaxed street lean' : L < 40 ? 'Spirited' : 'Track territory'}</b></span>`);
  };
  const loop = (now) => {
    if (S.cs) { S.csT = (now - S.cs) / 1000; if (S.csT > 3.2) S.cs = 0; draw(); raf = requestAnimationFrame(loop); }
  };
  const btn = el(html`<button type="button" class="btn btn--primary">Countersteer: push right</button>`);
  btn.onclick = () => { S.cs = performance.now(); S.csT = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
  wrap.querySelector('.ctl').append(
    slider({ label: 'Speed', min: 10, max: 100, value: S.mph, fmt: (v) => `${v} mph (${Math.round(v * 1.609)} km/h)`, onInput(v) { S.mph = v; draw(); } }).el,
    slider({ label: 'Turn radius', min: 30, max: 1000, step: 10, value: S.r, fmt: (v) => `${v} ft (${Math.round(v * 0.3048)} m)`, onInput(v) { S.r = v; draw(); } }).el,
    btn,
  );
  draw();
  return { destroy: () => cancelAnimationFrame(raf) };
}
