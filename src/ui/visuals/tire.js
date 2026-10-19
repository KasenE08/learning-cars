// Tire sidewall decoder.
import { html, el } from '../dom.js';

export const SPEED = { L: 75, M: 81, N: 87, P: 93, Q: 99, R: 106, S: 112, T: 118, U: 124, H: 130, V: 149, W: 168, Y: 186 };
export const LOAD = { 54: 212, 55: 218, 56: 224, 57: 230, 58: 236, 59: 243, 60: 250, 61: 257, 62: 265, 63: 272, 64: 280, 65: 290, 66: 300, 67: 307, 68: 315, 69: 325, 70: 335, 71: 345, 72: 355, 73: 365, 74: 375, 75: 387, 91: 615, 94: 670, 95: 690, 96: 710, 98: 750, 99: 775, 100: 800, 101: 825, 102: 850, 103: 875, 104: 900, 105: 925, 106: 950, 107: 975, 108: 1000, 109: 1030, 110: 1060, 112: 1120, 115: 1215 };

export function decode(code) {
  const m = /^\s*(P|LT)?\s*(\d{3})\s*\/\s*(\d{2})\s*(Z?R|D|B)\s*(\d{2})(?:\s*(\d{2,3})\s*([A-Z])?)?/i.exec(code || '');
  if (!m) return null;
  const width = +m[2], aspect = +m[3], rim = +m[5];
  const side = (width * aspect) / 100;
  const diaMm = rim * 25.4 + 2 * side, diaIn = diaMm / 25.4;
  return {
    type: m[1]?.toUpperCase() || '', width, aspect, construction: m[4].toUpperCase(), rim, side, diaMm, diaIn,
    circIn: Math.PI * diaIn, revsPerMile: 63360 / (Math.PI * diaIn),
    load: m[6] ? +m[6] : null, loadKg: m[6] ? LOAD[+m[6]] ?? null : null, speed: m[7]?.toUpperCase() || null,
  };
}

export function mount(host, spec = {}) {
  const wrap = el(html`<figure class="vis" data-noswipe>
    <label class="search" style="position:static;margin:0 0 10px"><span class="mono muted">SIZE</span><input type="text" value="${spec.code || '235/65R17 104T'}" autocomplete="off" spellcheck="false" aria-label="Tire size"></label>
    <svg viewBox="0 0 360 200" class="d" role="img" aria-label="Tire cross-section"></svg><div class="big-out"></div><dl class="tire__dl"></dl></figure>`);
  host.append(wrap);
  const input = wrap.querySelector('input');
  const draw = () => {
    const t = decode(input.value);
    const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out'), dl = wrap.querySelector('.tire__dl');
    if (!t) { out.innerHTML = '<span class="ro">Try a size like 235/65R17 104T</span>'; dl.innerHTML = ''; return; }
    const k = 160 / t.diaMm, W = t.width * k * 1.2, S = t.side * k, R = t.rim * 25.4 * k;
    const cx = 120, cy = 100;
    svg.innerHTML = `<rect x="${cx - W / 2}" y="${cy - R / 2 - S}" width="${W}" height="${S}" rx="${S / 3}" fill="#262b31" stroke="#8994a1"/>
      <rect x="${cx - W / 2}" y="${cy + R / 2}" width="${W}" height="${S}" rx="${S / 3}" fill="#262b31" stroke="#8994a1"/>
      <rect x="${cx - W / 2 + 4}" y="${cy - R / 2}" width="${W - 8}" height="${R}" fill="#14171a" stroke="#5b6470"/>
      <path d="M${cx + W / 2 + 10},${cy - R / 2 - S} v${S}" stroke="#ffc21a" stroke-width="2"/><text x="${cx + W / 2 + 16}" y="${cy - R / 2 - S / 2 + 4}" class="geo-t">sidewall ${t.side.toFixed(0)} mm</text>
      <path d="M${cx + W / 2 + 10},${cy - R / 2} v${R}" stroke="#7fb2e0" stroke-width="2"/><text x="${cx + W / 2 + 16}" y="${cy + 4}" style="fill:#7fb2e0">rim ${t.rim} in</text>
      <path d="M${cx - W / 2},${cy + R / 2 + S + 10} h${W}" stroke="#ff6b1a" stroke-width="2"/><text x="${cx}" y="${cy + R / 2 + S + 24}" text-anchor="middle" style="fill:#ff6b1a">${t.width} mm wide</text>
      <path d="M${cx - W / 2 - 12},${cy - R / 2 - S} v${2 * S + R}" stroke="#e8e4da" stroke-width="1.4" stroke-dasharray="3 3"/><text x="${cx - W / 2 - 16}" y="${cy + 4}" text-anchor="end">${t.diaIn.toFixed(1)}″</text>`;
    out.innerHTML = String(html`<span class="ro ro--hl"><small>Overall diameter</small><b>${t.diaIn.toFixed(1)} in (${Math.round(t.diaMm)} mm)</b></span><span class="ro"><small>Revs per mile</small><b>${Math.round(t.revsPerMile)}</b></span><span class="ro"><small>Circumference</small><b>${t.circIn.toFixed(1)} in</b></span>`);
    dl.innerHTML = String(html`
      ${t.type ? html`<dt>${t.type}</dt><dd>${t.type === 'LT' ? 'Light truck tire (heavier construction)' : 'Passenger tire (P-metric)'}</dd>` : ''}
      <dt>${t.width}</dt><dd>Section width in millimeters, sidewall to sidewall</dd>
      <dt>${t.aspect}</dt><dd>Aspect ratio: sidewall height is ${t.aspect}% of the width (${t.side.toFixed(0)} mm)</dd>
      <dt>${t.construction}</dt><dd>${t.construction.includes('R') ? 'Radial construction (plies run across the tire)' : t.construction === 'B' ? 'Belted bias' : 'Diagonal (bias) construction'}</dd>
      <dt>${t.rim}</dt><dd>Fits a ${t.rim}-inch wheel</dd>
      ${t.load ? html`<dt>${t.load}</dt><dd>Load index: ${t.loadKg ? `${t.loadKg} kg (${Math.round(t.loadKg * 2.2046)} lb) per tire` : 'see a load-index chart'}</dd>` : ''}
      ${t.speed ? html`<dt>${t.speed}</dt><dd>Speed rating: ${SPEED[t.speed] ? `${SPEED[t.speed]} mph (${Math.round(SPEED[t.speed] * 1.609)} km/h) max sustained` : 'unknown letter'}</dd>` : ''}`);
  };
  input.addEventListener('input', draw);
  draw();
  return { destroy() {} };
}
