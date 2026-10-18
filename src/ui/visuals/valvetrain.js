// Cam lobe → bucket → valve, with a live lift curve. Timeline runs in cam degrees (0..360).
import { html, el } from '../dom.js';
import { timeline } from './timeline.js';
import { chips } from './controls.js';
import { lobePath } from './engine-model.js';

const PX = 2.4; // px per mm of lift
export const PROFILES = {
  stock: { label: 'Stock cam', lift: 9.5, half: 60 },   // ~240° crank duration
  hot: { label: 'Aggressive cam', lift: 12, half: 76 }, // ~300° crank duration
};

export function liftAt(camDeg, p) {
  const s = ((camDeg - 180 + 540) % 360) - 180; // signed angle from peak (peak at 180)
  return Math.abs(s) < p.half ? (p.lift * (1 + Math.cos((Math.PI * s) / p.half))) / 2 : 0;
}

export function mount(host, spec = {}) {
  let prof = PROFILES[spec.profile || 'stock'];
  const CX = 90, CY = 62, BASE = 30;
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 400 330" class="d" role="img" aria-label="Cam, bucket and valve with lift graph">
      <rect x="40" y="96" width="100" height="200" fill="#1b1f24" stroke="#3a424c"/>
      <rect x="66" y="92" width="48" height="56" class="d-cavity"/>
      <rect x="80" y="196" width="20" height="50" fill="#7d6a52" stroke="#b39a84"/>
      <path d="M40,300 L72,300 L78,292 L102,292 L108,300 L140,300" fill="none" stroke="#e6c46a" stroke-width="2"/>
      <g class="mov">
        <path class="stem d-valve" d=""/>
        <rect class="bucket d-bucket" x="70" width="40" height="22" rx="2"/>
        <rect class="ret" x="76" width="28" height="5" fill="#c9d1d9"/>
      </g>
      <path class="spr d-spring" d=""/>
      <g class="cam" transform="translate(${CX} ${CY})"><path class="lobe d-cam" d=""/><circle r="6" class="d-cam-hub"/><line x1="0" y1="0" x2="0" y2="-24" stroke="#0c0e10" stroke-width="2"/></g>
      <g class="labels" font-size="11">
        <text x="134" y="36">cam lobe</text><text x="146" y="118">bucket</text><text x="146" y="172">spring</text><text x="146" y="226">guide</text><text x="146" y="296">seat</text>
      </g>
      <!-- lift chart -->
      <g transform="translate(206 70)">
        <rect width="184" height="150" fill="#0e1114" stroke="#262b31"/>
        <path class="curve" fill="rgba(255,107,26,0.15)" stroke="#ff6b1a" stroke-width="2"/>
        <line class="ph" y1="0" y2="150" stroke="#ffc21a" stroke-width="1" stroke-dasharray="3 3"/>
        <circle class="dot" r="4" fill="#ffc21a"/>
        <text x="0" y="-10" class="geo-t">LIFT vs CAM ANGLE</text>
        <text x="0" y="168">0°</text><text x="92" y="168" text-anchor="middle">180°</text><text x="184" y="168" text-anchor="end">360°</text>
        <path class="dur" class="geo-dim" stroke="#ffc21a" fill="none" stroke-width="1.4"/>
        <text class="durT geo-t" y="194" text-anchor="middle"></text>
      </g>
    </svg>
    <div class="vis__readout"></div><div class="ctl"></div></figure>`);
  host.append(wrap);
  const $ = (s) => wrap.querySelector(s);
  const readout = $('.vis__readout');

  const drawProfile = () => {
    $('.lobe').setAttribute('d', lobePath(BASE, prof.lift * PX, prof.half));
    let d = 'M0,150';
    for (let a = 0; a <= 360; a += 3) d += ` L${(a / 360) * 184},${150 - (liftAt(a, prof) / 13) * 140}`;
    $('.curve').setAttribute('d', `${d} L184,150 Z`);
    const x0 = ((180 - prof.half) / 360) * 184, x1 = ((180 + prof.half) / 360) * 184;
    $('.dur').setAttribute('d', `M${x0},176 L${x1},176 M${x0},171 L${x0},181 M${x1},171 L${x1},181`);
    $('.durT').setAttribute('x', (x0 + x1) / 2);
    $('.durT').textContent = `${prof.half * 2}° cam = ${prof.half * 4}° crank`;
  };
  const frame = (a) => {
    const lift = liftAt(a, prof);
    const y = CY + BASE + lift * PX; // bucket top
    $('.cam').setAttribute('transform', `translate(${CX} ${CY}) rotate(${a})`);
    $('.bucket').setAttribute('y', y);
    $('.ret').setAttribute('y', y + 22);
    const vy = 292 + lift * PX;
    $('.stem').setAttribute('d', `M${CX - 4},${y + 22} L${CX - 4},${vy - 12} L${CX - 14},${vy - 2} L${CX - 14},${vy + 2} L${CX + 14},${vy + 2} L${CX + 14},${vy - 2} L${CX + 4},${vy - 12} L${CX + 4},${y + 22} Z`);
    let s = `M${CX - 16},${y + 27}`;
    const bottom = 196, n = 8;
    for (let i = 1; i <= n; i++) s += ` L${CX + (i % 2 ? 16 : -16)},${y + 27 + ((bottom - y - 27) * i) / n}`;
    $('.spr').setAttribute('d', s);
    const px = (a / 360) * 184, py = 150 - (lift / 13) * 140;
    $('.ph').setAttribute('x1', px); $('.ph').setAttribute('x2', px);
    $('.dot').setAttribute('cx', px); $('.dot').setAttribute('cy', py);
    readout.innerHTML = `<span class="ro"><b>${Math.round(a)}°</b> cam</span><span class="ro"><b>${Math.round(a * 2)}°</b> crank</span><span class="ro ro--stroke ro--power"><b>${lift.toFixed(1)} mm</b> lift</span><span class="ro">${lift > 0.05 ? 'valve OPEN' : 'on base circle: closed'}</span>`;
  };
  const tl = timeline(wrap, { period: 360, cycleMs: 4000, start: 150, onFrame: frame, label: 'Cam angle' });
  const c = chips(Object.entries(PROFILES).map(([value, p]) => ({ value, label: p.label })), { value: spec.profile || 'stock', onPick(v) { prof = PROFILES[v]; drawProfile(); frame(tl.get()); } });
  $('.ctl').append(c.el);
  drawProfile();
  frame(tl.get());
  return { destroy: () => tl.destroy() };
}
