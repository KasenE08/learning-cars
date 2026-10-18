// Compression ratio: same swept volume, change the clearance volume.
import { html, el } from '../dom.js';
import { slider, fmt1 } from './controls.js';

export const ottoEfficiency = (cr) => 1 - cr ** -0.4; // ideal air-standard Otto cycle, γ = 1.4

export function knockRisk(cr) {
  if (cr < 9) return 'Low';
  if (cr < 11) return 'Moderate';
  if (cr < 13) return 'High: needs premium fuel, direct injection or clever chamber design';
  return 'Gasoline can’t live here without special tricks. Diesel territory.';
}

export function mount(host, spec = {}) {
  const SWEPT = spec.swept ?? 500;
  let cr = spec.cr ?? 10;
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 250" class="d" role="img" aria-label="Cylinder at BDC and TDC"></svg><div class="big-out"></div><div class="ctl"></div>
    <p class="vis__note">Typical (roughly): turbo gas 9–10.5:1 · non-turbo gas 10–13:1 · diesel 15–20:1.</p></figure>`);
  const svg = wrap.querySelector('svg');
  const out = wrap.querySelector('.big-out');
  host.append(wrap);

  const draw = () => {
    const clear = SWEPT / (cr - 1);
    const H = 160; // px for swept volume
    const hc = (clear / SWEPT) * H;
    const top = 30;
    const cyl = (x, label, pistonY, fillH, color, txt) => `
      <rect x="${x - 8}" y="${top}" width="8" height="200" class="d-line" fill="#1b1f24"/><rect x="${x + 100}" y="${top}" width="8" height="200" class="d-line" fill="#1b1f24"/>
      <rect x="${x - 8}" y="${top - 8}" width="116" height="8" class="d-line" fill="#1b1f24"/>
      <rect x="${x}" y="${top}" width="100" height="${fillH}" fill="${color}"/>
      <rect x="${x + 2}" y="${pistonY}" width="96" height="30" rx="2" fill="#8f99a3" stroke="#c9d1d9"/>
      <text x="${x + 50}" y="${top + Math.max(14, fillH / 2 + 4)}" text-anchor="middle" style="fill:#e8eef5">${txt}</text>
      <text x="${x + 50}" y="248" text-anchor="middle" class="geo-t">${label}</text>`;
    svg.innerHTML = cyl(40, 'PISTON AT BDC', top + hc + H, hc + H, 'rgba(79,134,184,0.35)', `${Math.round(clear + SWEPT)} cc`)
      + cyl(220, 'PISTON AT TDC', top + hc, hc, 'rgba(255,107,26,0.55)', `${fmt1(clear)} cc`)
      + `<path d="M150,${top + 60} L205,${top + 60} M198,${top + 54} L205,${top + 60} L198,${top + 66}" class="geo-dim" style="stroke:var(--orange)"/><text x="178" y="${top + 52}" text-anchor="middle" style="fill:var(--orange)">squeeze</text>`;
    out.innerHTML = String(html`
      <span class="ro ro--hl"><small>Compression ratio</small><b>${fmt1(cr)}:1</b></span>
      <span class="ro"><small>Clearance volume</small><b>${fmt1(clear)} cc</b></span>
      <span class="ro"><small>Ideal-cycle efficiency*</small><b>${Math.round(ottoEfficiency(cr) * 100)}%</b></span>
      <span class="ro"><small>Knock risk (gasoline)</small><b style="font-size:13px">${knockRisk(cr)}</b></span>`);
  };
  const s = slider({ label: 'Ratio', min: 6, max: 20, step: 0.1, value: cr, fmt: (v) => `${fmt1(v)}:1`, onInput(v) { cr = v; draw(); } });
  wrap.querySelector('.ctl').append(s.el);
  wrap.append(el(html`<p class="vis__note">* Textbook “ideal Otto cycle” number. Real engines lose a lot more to heat and friction (≈30–40% at best), but the trend is the same: more squeeze, more efficiency.</p>`));
  draw();
  return { destroy() {} };
}
