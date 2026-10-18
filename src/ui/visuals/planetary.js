// Planetary gearset: sun, planets on a carrier, ring. Hold one member, drive another, get a ratio.
// Willis equation: (ωsun − ωcarrier) / (ωring − ωcarrier) = −Zr / Zs
import { html, el } from '../dom.js';
import { chips } from './controls.js';

export const ZS = 30, ZR = 78;
/** Output/input speed ratio for input member `inp` with member `held` fixed (others: the remaining one is output). */
export function speeds(inp, held) {
  // unknown speeds solved with ω_input = 1, ω_held = 0
  const k = -ZR / ZS;
  const w = { sun: null, carrier: null, ring: null };
  w[inp] = 1; w[held] = 0;
  if (w.sun == null) w.sun = w.carrier + k * (w.ring - w.carrier);
  else if (w.ring == null) w.ring = w.carrier + (w.sun - w.carrier) / k;
  else if (w.carrier == null) w.carrier = (w.sun - k * w.ring) / (1 - k);
  return w;
}
const OUT = (inp, held) => ['sun', 'carrier', 'ring'].find((m) => m !== inp && m !== held);

export function mount(host) {
  let inp = 'sun', held = 'ring', direct = false;
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 300 300" class="d" role="img" aria-label="Planetary gearset"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Sun ${ZS} teeth, ring ${ZR}. Automatics stack several sets and use clutches and brakes to choose which member is held: that’s how they change gears.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const C = 150, rs = 40, rr = 120, rp = (rr - rs) / 2, rc = rs + rp;
  svg.innerHTML = `
    <g class="pl-ring"><circle cx="${C}" cy="${C}" r="${rr + 14}" fill="#262b31" stroke="#8994a1"/><circle cx="${C}" cy="${C}" r="${rr}" fill="#0c0e10" stroke="#8994a1"/><path d="M${C},${C - rr - 14} v14" stroke="#ff6b1a" stroke-width="4"/></g>
    <g class="pl-carrier"><circle cx="${C}" cy="${C}" r="${rc}" fill="none" stroke="#ffc21a" stroke-width="5" stroke-dasharray="2 0"/>${[0, 1, 2].map((i) => { const a = (i * 2 * Math.PI) / 3; return `<line x1="${C}" y1="${C}" x2="${C + rc * Math.sin(a)}" y2="${C - rc * Math.cos(a)}" stroke="#ffc21a" stroke-width="5"/>`; }).join('')}</g>
    ${[0, 1, 2].map((i) => `<g class="pl-planet" data-i="${i}"><circle r="${rp - 2}" fill="#5a6470" stroke="#c9d1d9"/><path d="M0,${-(rp - 2)} v12" stroke="#ff6b1a" stroke-width="3"/></g>`).join('')}
    <g class="pl-sun"><circle cx="${C}" cy="${C}" r="${rs - 2}" fill="#9aa5b1" stroke="#dfe5ea"/><path d="M${C},${C - rs + 2} v12" stroke="#1a0c03" stroke-width="3"/></g>
    <text x="${C}" y="${C + 4}" text-anchor="middle" class="awd-bt" style="fill:#1a0c03">SUN</text>`;
  const out = wrap.querySelector('.big-out');
  let a = { sun: 0, carrier: 0, ring: 0 }, raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const w = direct ? { sun: 1, carrier: 1, ring: 1 } : speeds(inp, held);
    for (const m of ['sun', 'carrier', 'ring']) a[m] += w[m] * dt * 60;
    svg.querySelector('.pl-sun').setAttribute('transform', `rotate(${a.sun} ${C} ${C})`);
    svg.querySelector('.pl-ring').setAttribute('transform', `rotate(${a.ring} ${C} ${C})`);
    svg.querySelector('.pl-carrier').setAttribute('transform', `rotate(${a.carrier} ${C} ${C})`);
    // planets orbit with the carrier and spin on their own axes
    const spin = (a.carrier - a.ring) * (rr / rp) + a.carrier;
    svg.querySelectorAll('.pl-planet').forEach((g, i) => {
      const ang = (a.carrier * Math.PI) / 180 + (i * 2 * Math.PI) / 3;
      g.setAttribute('transform', `translate(${C + rc * Math.sin(ang)} ${C - rc * Math.cos(ang)}) rotate(${spin})`);
    });
    raf = requestAnimationFrame(loop);
  };
  const report = () => {
    const o = OUT(inp, held), w = direct ? { [o]: 1 } : speeds(inp, held);
    const r = direct ? 1 : 1 / w[o];
    const kind = direct ? 'Direct drive (1:1)' : r < 0 ? 'Reverse' : Math.abs(r) > 1 ? 'Reduction (more torque)' : 'Overdrive (more speed)';
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Result</small><b style="font-size:14px">${kind}</b></span>
      <span class="ro"><small>Input → output</small><b style="font-size:14px">${direct ? 'any two locked' : `${inp} → ${o}`}</b></span>
      <span class="ro"><small>Ratio</small><b>${Math.abs(r).toFixed(2)}:1${r < 0 ? ' rev' : ''}</b></span>`);
  };
  const ctl = wrap.querySelector('.ctl');
  const MEM = [{ value: 'sun', label: 'Sun' }, { value: 'carrier', label: 'Carrier' }, { value: 'ring', label: 'Ring' }];
  const inC = chips(MEM, { value: inp, onPick(v) { if (v === held) held = inp; inp = v; direct = false; hC.set(held); report(); } });
  const hC = chips(MEM, { value: held, onPick(v) { if (v === inp) inp = held; held = v; direct = false; inC.set(inp); report(); } });
  const dC = chips([{ value: 'no', label: 'One member held' }, { value: 'yes', label: 'Lock two together' }], { value: 'no', onPick(v) { direct = v === 'yes'; report(); } });
  ctl.append(el(html`<span class="kicker">Input</span>`), inC.el, el(html`<span class="kicker">Held (brake)</span>`), hC.el, dC.el);
  report();
  raf = requestAnimationFrame(loop);
  return { destroy: () => cancelAnimationFrame(raf) };
}
