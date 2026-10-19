// Engine layouts. Each cylinder: bank angle β (deg from vertical) and when it fires (0..720).
// Crankpin phase is derived: a cylinder is at TDC when θ − pin − β = 0. Firing intervals are computed.
import { html, el, raw } from '../dom.js';
import { timeline } from './timeline.js';
import { chips } from './controls.js';
import { norm720 } from './engine-model.js';

const C = (n, bank, fire) => ({ n, bank, fire });
export const LAYOUTS = {
  single: { label: 'Single', cyl: [C(1, 0, 0)], crank: 'One throw', note: 'One power pulse every 720°: lumpy. Needs a balance shaft above ~250–400 cc to feel smooth.' },
  twin180: { label: 'Twin 180°', cyl: [C(1, 0, 0), C(2, 0, 180)], crank: 'Two throws 180° apart', order: '1-2', note: 'Pistons move opposite: primary forces cancel, but they’re offset so the crank rocks end to end (rocking couple). Uneven 180°/540° firing. Revs freely.' },
  twin270: { label: 'Twin 270°', cyl: [C(1, 0, 0), C(2, 0, 270)], crank: 'Two throws 90° apart', order: '1-2', note: 'Fires 270°/450°, the same rhythm as a 90° V-twin, which is why it sounds “V-twin-like.” Needs a balance shaft.' },
  i4: { label: 'Inline-4', cyl: [C(1, 0, 0), C(2, 0, 540), C(3, 0, 180), C(4, 0, 360)], crank: 'Flat crank: 1&4 / 2&3, 180°', order: '1-3-4-2', note: 'Even 180° firing. Primary forces cancel; secondary (2× crank) shake remains → balance shafts on bigger ones.' },
  i4x: { label: 'Crossplane I4', cyl: [C(1, 0, 0), C(2, 0, 450), C(3, 0, 270), C(4, 0, 540)], crank: 'Throws 90° apart (Yamaha R1 style)', order: '1-3-2-4', note: 'Uneven 270-180-90-180 firing. Pistons never all stop at once, so inertial torque mostly cancels; the rhythm sounds like a V4. It leaves a rocking couple, usually tamed with a balance shaft.' },
  i6: { label: 'Inline-6', cyl: [C(1, 0, 0), C(2, 0, 480), C(3, 0, 240), C(4, 0, 600), C(5, 0, 120), C(6, 0, 360)], crank: 'Throws 120° apart (1&6, 2&5, 3&4)', order: '1-5-3-6-2-4', note: 'Primary and secondary forces and couples all cancel: inherently smooth. Long, though.' },
  v6: { label: '60° V6', cyl: [C(1, -30, 0), C(2, 30, 120), C(3, -30, 240), C(4, 30, 360), C(5, -30, 480), C(6, 30, 600)], crank: 'Six split crankpins', order: '1-2-3-4-5-6', note: 'Even 120° firing with split pins. Compact; usually needs a balance shaft or careful counterweighting.' },
  v8: { label: 'Cross-plane V8', cyl: [C(1, -45, 0), C(8, 45, 90), C(7, -45, 180), C(2, 45, 270), C(6, 45, 360), C(5, -45, 450), C(4, 45, 540), C(3, -45, 630)], crank: 'Throws at 0°/90°/270°/180° (cross shape)', order: '1-8-7-2-6-5-4-3', note: 'Even overall, but each bank fires unevenly → the classic American burble. Heavy counterweights balance it fully.' },
  v8flat: { label: 'Flat-plane V8', cyl: [C(1, -45, 0), C(5, 45, 90), C(3, -45, 180), C(7, 45, 270), C(4, -45, 360), C(8, 45, 450), C(2, -45, 540), C(6, 45, 630)], crank: 'Flat crank, like two I4s', order: '1-5-3-7-4-8-2-6', note: 'Each bank fires evenly like an inline-4: a high-pitched scream, lighter crank, revs higher. Keeps an I4’s secondary shake.' },
  boxer4: { label: 'Boxer-4', cyl: [C(1, 90, 0), C(2, -90, 360), C(3, 90, 180), C(4, -90, 540)], crank: 'Opposed pistons on separate throws', order: '1-3-2-4', note: 'Opposite pistons move in and out together: primary and secondary forces cancel. Low and wide; a small rocking couple remains.' },
  vtwin: { label: '90° V-twin', cyl: [C(1, -45, 0), C(2, 45, 450)], crank: 'Two rods on one shared crankpin', order: '1-2', note: 'With a 90° V, primary balance is perfect with a counterweight. Fires 270°/450°: the lumpy “potato” rhythm’s smoother cousin.' },
};

export function firingIntervals(layout) {
  const t = layout.cyl.map((c) => c.fire).sort((a, b) => a - b);
  return t.map((v, i) => norm720((t[(i + 1) % t.length] ?? 720) - v) || 720);
}
function perBank(L) {
  const banks = [...new Set(L.cyl.map((c) => c.bank))];
  if (banks.length !== 2 || L.cyl.length < 4) return '';
  return banks.map((b) => {
    const t = L.cyl.filter((c) => c.bank === b).map((c) => c.fire).sort((x, y) => x - y);
    const iv = t.map((v, i) => norm720((t[(i + 1) % t.length] ?? 720) - v) || 720);
    return `<span class="ro">${b < 0 ? 'left' : 'right'} bank <b>${iv.join('/')}°</b></span>`;
  }).join('');
}
const pinOf = (c) => ((c.fire - c.bank) % 360 + 360) % 360;

export function mount(host, spec = {}) {
  let key = spec.layout || 'i4';
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 330" class="d" role="img" aria-label="Engine layout animation"></svg><div class="vis__readout lay__ro"></div><div class="ctl"></div></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const ro = wrap.querySelector('.lay__ro');
  let parts = [];

  const build = () => {
    const L = LAYOUTS[key];
    const inline = L.cyl.every((c) => c.bank === 0);
    let s = '';
    parts = [];
    if (inline) {
      // side view: row of cylinders over one crank
      const n = L.cyl.length, gap = Math.min(70, 300 / n), x0 = 180 - ((n - 1) * gap) / 2;
      const sorted = L.cyl.slice().sort((a, b) => a.n - b.n);
      s += `<rect x="${x0 - gap / 2 - 6}" y="34" width="${gap * n + 12}" height="10" fill="#1b1f24" stroke="#8994a1"/>`;
      sorted.forEach((c, i) => {
        const x = x0 + i * gap, w = gap * 0.78;
        s += `<g data-c="${c.n}"><rect x="${x - w / 2 - 4}" y="44" width="4" height="112" fill="#1b1f24"/><rect x="${x + w / 2}" y="44" width="4" height="112" fill="#1b1f24"/>
          <circle class="lay-flash" cx="${x}" cy="54" r="0" fill="#ffc21a"/><rect class="lay-p" x="${x - w / 2}" width="${w}" height="26" rx="2" fill="#8f99a3" stroke="#c9d1d9"/>
          <line class="lay-r" x1="${x}" x2="${x}" stroke="#aab4bf" stroke-width="6" stroke-linecap="round"/><text x="${x}" y="26" text-anchor="middle" class="cyl-n">${c.n}</text></g>`;
        parts.push({ c, kind: 'inline', x });
      });
      s += `<rect x="${x0 - gap / 2}" y="207" width="${gap * n}" height="6" fill="#c9d1d9"/>`;
    } else {
      // front view: one cylinder per bank angle around a shared crank
      const banks = [...new Set(L.cyl.map((c) => c.bank))];
      s += `<circle cx="180" cy="200" r="34" fill="#262b31" stroke="#8994a1"/>`;
      for (const b of banks) {
        const c = L.cyl.find((x) => x.bank === b);
        s += `<g transform="rotate(${b} 180 200)" data-c="${c.n}"><rect x="146" y="40" width="4" height="110" fill="#1b1f24"/><rect x="210" y="40" width="4" height="110" fill="#1b1f24"/><rect x="146" y="36" width="68" height="6" fill="#1b1f24" stroke="#8994a1"/>
          <circle class="lay-flash" cx="180" cy="50" r="0" fill="#ffc21a"/><rect class="lay-p" x="152" width="56" height="26" rx="2" fill="#8f99a3" stroke="#c9d1d9"/></g>
          <line class="lay-r" data-rod="${c.n}" stroke="#aab4bf" stroke-width="6" stroke-linecap="round"/>`;
        parts.push({ c, kind: 'front' });
      }
      s += `<text x="180" y="326" text-anchor="middle" class="awd-sub">front view · chips show all ${L.cyl.length}</text>`;
      if (banks.length === 2) {
        const a = Math.abs(banks[0] - banks[1]);
        s += `<path d="M180,200 L${180 + 80 * Math.sin((banks[0] * Math.PI) / 180)},${200 - 80 * Math.cos((banks[0] * Math.PI) / 180)} M180,200 L${180 + 80 * Math.sin((banks[1] * Math.PI) / 180)},${200 - 80 * Math.cos((banks[1] * Math.PI) / 180)}" stroke="#ffc21a" stroke-dasharray="3 3"/><text x="180" y="${a >= 180 ? 296 : 128}" text-anchor="middle" class="geo-t">${a}°</text>`;
      }
    }
    // firing strip
    s += `<g transform="translate(20 ${inline ? 240 : 252})"><rect width="320" height="${inline ? 52 : 40}" fill="#0e1114" stroke="#262b31"/>
      ${L.cyl.map((c) => { const x = (c.fire / 720) * 320; return `<line x1="${x}" x2="${x}" y1="6" y2="${inline ? 36 : 26}" stroke="#ff6b1a" stroke-width="3"/><text x="${x + 3}" y="${inline ? 46 : 36}" style="font-size:10px;fill:#ff8a45">${c.n}</text>`; }).join('')}
      <line class="lay-ph" y1="0" y2="${inline ? 52 : 40}" stroke="#ffc21a" stroke-dasharray="2 2"/></g>`;
    svg.innerHTML = s;
    const iv = firingIntervals(L);
    const even = iv.every((v) => v === iv[0]);
    ro.innerHTML = String(html`<span class="ro"><b>${L.cyl.length}</b> cyl</span><span class="ro">${L.crank}</span>${L.order ? html`<span class="ro">order <b>${L.order}</b></span>` : ''}
      <span class="ro ${even ? '' : 'ro--stroke ro--power'}">${even ? html`even · every <b>${iv[0]}°</b>` : html`uneven · <b>${iv.join('/')}°</b>`}</span>
      ${raw(perBank(L))}
      <span class="chipline">${L.cyl.slice().sort((a, b) => a.n - b.n).map((c) => html`<i data-chip="${c.n}">${c.n}</i>`)}</span>
      <p class="lay__note">${L.note}</p>`);
  };

  const frame = (t) => {
    for (const p of parts) {
      const a = ((t - pinOf(p.c) - p.c.bank) * Math.PI) / 180;
      const travel = 40 * (1 - Math.cos(a)) / 2; // 0 at TDC
      const since = norm720(t - p.c.fire);
      const flash = since < 40 ? 10 * (1 - since / 40) : 0;
      const g = svg.querySelector(`[data-c="${p.c.n}"]`);
      if (p.kind === 'inline') {
        const top = 54 + travel;
        g.querySelector('.lay-p').setAttribute('y', top);
        const r = g.querySelector('.lay-r'); r.setAttribute('y1', top + 14); r.setAttribute('y2', 200 - 12 * Math.cos(a) + (top - 54) * 0);
      } else {
        const top = 54 + travel;
        g.querySelector('.lay-p').setAttribute('y', top);
        const b = (p.c.bank * Math.PI) / 180, pinA = ((t - pinOf(p.c)) * Math.PI) / 180;
        // wrist pin position (rotate local (180, top+13) around crank center), crankpin on a 20 px circle
        const lx = 0, ly = top + 13 - 200;
        const wx = 180 + lx * Math.cos(b) - ly * Math.sin(b), wy = 200 + lx * Math.sin(b) + ly * Math.cos(b);
        const px = 180 + 20 * Math.sin(pinA), py = 200 - 20 * Math.cos(pinA);
        const r = svg.querySelector(`[data-rod="${p.c.n}"]`);
        r.setAttribute('x1', wx); r.setAttribute('y1', wy); r.setAttribute('x2', px); r.setAttribute('y2', py);
      }
      g.querySelector('.lay-flash').setAttribute('r', flash);
      ro.querySelector(`[data-chip="${p.c.n}"]`)?.classList.toggle('is-on', since < 180);
    }
    for (const c of LAYOUTS[key].cyl) ro.querySelector(`[data-chip="${c.n}"]`)?.classList.toggle('is-on', norm720(t - c.fire) < 180);
    const ph = svg.querySelector('.lay-ph'); const x = (norm720(t) / 720) * 320; ph.setAttribute('x1', x); ph.setAttribute('x2', x);
  };
  build();
  const tl = timeline(wrap, { period: 720, cycleMs: 5000, onFrame: frame });
  if (spec.pick) wrap.querySelector('.ctl').append(chips(Object.entries(LAYOUTS).map(([value, l]) => ({ value, label: l.label })), { value: key, onPick(v) { key = v; build(); frame(tl.get()); } }).el);
  return { destroy: () => tl.destroy() };
}
