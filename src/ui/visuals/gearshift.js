// 2-shaft manual gearbox: pick a gear; the right synchro sleeve slides over, the power path lights up.
import { html, el } from '../dom.js';
import { chips } from './controls.js';

const IN_Y = 90, OUT_Y = 190, D = 100;
// [x, input teeth, output teeth]; radii ∝ teeth (input r + output r = D)
export const GEARS = { 1: [70, 13, 43], 2: [120, 19, 37], 3: [170, 25, 31], 4: [220, 29, 27], 5: [270, 33, 23] };
export const ratio = (g) => (g === 'R' ? 3.4 : g === 'N' ? 0 : GEARS[g][2] / GEARS[g][1]);
const SYNC = { 1: 95, 2: 95, 3: 195, 4: 195, 5: 295, R: 295 }; // sleeve x serving each gear
const SIDE = { 1: -1, 2: 1, 3: -1, 4: 1, 5: -1, R: 1 };        // which way it slides

export function mount(host, spec = {}) {
  let gear = spec.gear || 'N';
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 300" class="d" role="img" aria-label="Manual gearbox power path"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Top shaft: input (from the clutch). Bottom shaft: output (to the differential). Input-shaft gears are fixed; output-shaft gears spin freely on bearings until a synchro sleeve locks one to the shaft. Ratios are typical, not a specific car’s.</p></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const out = wrap.querySelector('.big-out');
  const scale = D / 56; // teeth → px radius
  const draw = () => {
    let s = `<rect x="20" y="${IN_Y - 4}" width="320" height="8" rx="3" class="${gear !== 'N' ? 'gs-hot' : 'gs-shaft'}"/><rect x="40" y="${OUT_Y - 4}" width="300" height="8" rx="3" class="${gear !== 'N' ? 'gs-hot' : 'gs-shaft'}"/>`;
    for (const [g, [x, ti, to]] of Object.entries(GEARS)) {
      const ri = ti * scale, ro = to * scale, on = String(gear) === g;
      s += `<rect x="${x - 7}" y="${IN_Y - ri}" width="14" height="${2 * ri}" rx="2" class="${on ? 'gs-gear-on' : 'gs-gear'}"/>`;
      s += `<rect x="${x - 7}" y="${OUT_Y - ro}" width="14" height="${2 * ro}" rx="2" class="${on ? 'gs-gear-on' : 'gs-free'}"/>`;
      s += `<text x="${x}" y="${OUT_Y + ro + 14}" text-anchor="middle" class="awd-sub">${g}</text>`;
    }
    // reverse: input gear → idler → output gear (on the 5th/R synchro's other side)
    const rx = 320, rOn = gear === 'R';
    s += `<rect x="${rx - 6}" y="${IN_Y - 12}" width="12" height="24" class="${rOn ? 'gs-gear-on' : 'gs-gear'}"/><circle cx="${rx + 18}" cy="${(IN_Y + OUT_Y) / 2 - 8}" r="14" class="${rOn ? 'gs-gear-on' : 'gs-free'}"/><rect x="${rx - 6}" y="${OUT_Y - 30}" width="12" height="60" class="${rOn ? 'gs-gear-on' : 'gs-free'}"/>
      <text x="${rx + 18}" y="${(IN_Y + OUT_Y) / 2 + 22}" text-anchor="middle" class="awd-sub">idler</text><text x="${rx}" y="${OUT_Y + 44}" text-anchor="middle" class="awd-sub">R</text>`;
    for (const x of [95, 195, 295]) {
      const active = gear !== 'N' && SYNC[gear] === x;
      const dx = active ? SIDE[gear] * 16 : 0;
      s += `<rect x="${x - 7 + dx}" y="${OUT_Y - 26}" width="14" height="52" rx="2" class="${active ? 'gs-sync-on' : 'gs-sync'}"/><path d="M${x + dx},${OUT_Y + 26} L${x + dx},262" stroke="#a9b3bd" stroke-width="3"/>`;
    }
    s += `<rect x="60" y="262" width="260" height="6" rx="3" fill="#6d7782"/><text x="190" y="290" text-anchor="middle" class="awd-sub">shift forks + rails</text>`;
    svg.innerHTML = s;
    const r = ratio(gear);
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Gear</small><b>${gear}</b></span>
      <span class="ro"><small>Ratio</small><b>${gear === 'N' ? '—' : `${r.toFixed(2)}:1`}</b></span>
      <span class="ro"><small>Output at 3,000 rpm</small><b>${gear === 'N' ? '0' : Math.round(3000 / r).toLocaleString('en-US')} rpm${gear === 'R' ? ' (backward)' : ''}</b></span>
      <span class="ro"><small>Torque ×</small><b>${gear === 'N' ? '0' : r.toFixed(2)}</b></span>`);
  };
  wrap.querySelector('.ctl').append(chips(['N', 1, 2, 3, 4, 5, 'R'].map((g) => ({ value: g, label: g === 'N' ? 'Neutral' : g === 'R' ? 'Reverse' : `${g}${['st', 'nd', 'rd', 'th', 'th'][g - 1]}` })), { value: gear, onPick(v) { gear = v; draw(); } }).el);
  draw();
  return { destroy() {} };
}
