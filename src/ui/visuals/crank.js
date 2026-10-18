// Inline-4, side view: pistons, rods, crank throws, firing order, power pulses, shaking forces.
// spec: { shake?: boolean, orders?: boolean }
import { html, el, raw } from '../dom.js';
import { timeline } from './timeline.js';
import { chips } from './controls.js';
import { gasAt, norm720, SPARK, strokeAt } from './engine-model.js';

const ORDERS = { '1342': [1, 3, 4, 2], '1243': [1, 2, 4, 3] };
const XS = [62, 140, 218, 296];
const AXIS = 250, R = 26, L = 78, PIN = 18, PH = 34, ROOF = 54;
const COLORS = { fresh: '79,134,184', flame: '255,150,40', burnt: '214,110,40', exhaust: '120,104,90' };

/** Cycle angle of cylinder n (0 = start of intake, 360 = firing TDC) at crank angle t. */
export function cycleAngle(t, n, order) {
  const fireAt = order.indexOf(n) * 180;
  return norm720(t - fireAt + 360);
}

export function mount(host, spec = {}) {
  let order = ORDERS['1342'];
  let showShake = !!spec.shake;
  const wrap = el(html`<figure class="vis" data-noswipe>
    <svg viewBox="0 0 360 420" class="d" role="img" aria-label="Inline-four engine animation">
      <rect x="20" y="40" width="320" height="14" class="d-line" fill="#1b1f24"/>
      ${raw(XS.map((x, i) => `<g class="cyl" data-n="${i + 1}">
        <rect x="${x - 34}" y="54" width="6" height="128" fill="#1b1f24" class="d-line"/><rect x="${x + 28}" y="54" width="6" height="128" fill="#1b1f24" class="d-line"/>
        <rect class="gas" x="${x - 28}" y="${ROOF}" width="56" height="10"/>
        <rect class="pst" x="${x - 27}" width="54" height="${PH}" rx="2" fill="#8f99a3" stroke="#c9d1d9"/>
        <line class="rod" x1="${x}" x2="${x}" stroke="#aab4bf" stroke-width="9" stroke-linecap="round"/>
        <rect class="web" x="${x - 18}" width="36" rx="3" fill="#3a424c" stroke="#8994a1"/>
        <circle class="spk" cx="${x}" cy="${ROOF + 4}" r="0" fill="#fff3b0"/>
        <text x="${x}" y="30" text-anchor="middle" class="cyl-n">${i + 1}</text>
        <g transform="translate(${x} 318)"><circle r="20" fill="#0e1114" stroke="#3a424c"/><line class="dial" x1="0" y1="0" x2="0" y2="-16" stroke="#ff6b1a" stroke-width="3" stroke-linecap="round"/><circle r="3" fill="#8994a1"/></g>
        <text class="stk" x="${x}" y="356" text-anchor="middle" style="font-size:10px"></text>
      </g>`).join(''))}
      <rect x="20" y="${AXIS - 5}" width="320" height="10" fill="#c9d1d9" stroke="#6d7782"/>
      <text x="8" y="${AXIS + 4}" text-anchor="start" style="font-size:10px" transform="rotate(-90 8 ${AXIS})">FRONT</text>
      <text x="180" y="292" text-anchor="middle" style="font-size:10px;fill:var(--ink-3)">crankpin positions (looking from the front)</text>
      <g class="shake" transform="translate(20 370)">
        <rect width="320" height="44" fill="#0e1114" stroke="#262b31"/><line x1="0" x2="320" y1="22" y2="22" stroke="#262b31"/>
        <path class="prim" fill="none" stroke="#7fb2e0" stroke-width="1.6"/><path class="sec" fill="none" stroke="#ff6b1a" stroke-width="2"/>
        <line class="sph" y1="0" y2="44" stroke="#ffc21a" stroke-dasharray="2 2"/>
        <text x="4" y="12" style="font-size:9px;fill:#7fb2e0">primary (cancels)</text><text x="316" y="12" text-anchor="end" style="font-size:9px;fill:#ff6b1a">secondary (2× crank)</text>
      </g>
    </svg>
    <div class="vis__readout"></div><div class="ctl"></div></figure>`);
  host.append(wrap);
  const cyls = [...wrap.querySelectorAll('.cyl')];
  const readout = wrap.querySelector('.vis__readout');
  const shake = wrap.querySelector('.shake');
  const svg = wrap.querySelector('svg');

  // shaking-force traces over one cycle (720°)
  const trace = (fn) => { let d = ''; for (let a = 0; a <= 720; a += 6) d += `${a ? 'L' : 'M'}${(a / 720) * 320},${22 - fn(a) * 16}`; return d; };
  const lr = R / L;
  const throwAngle = (t, n) => norm720(t + (n === 2 || n === 3 ? 180 : 0)) % 360;
  wrap.querySelector('.prim').setAttribute('d', trace((a) => [1, 2, 3, 4].reduce((s, n) => s + Math.cos((throwAngle(a, n) * Math.PI) / 180), 0) / 4));
  wrap.querySelector('.sec').setAttribute('d', trace((a) => [1, 2, 3, 4].reduce((s, n) => s + lr * Math.cos((2 * throwAngle(a, n) * Math.PI) / 180), 0) / (4 * lr)));
  const layout = () => {
    shake.style.display = showShake ? '' : 'none';
    svg.setAttribute('viewBox', showShake ? '0 0 360 420' : '0 0 360 366');
  };

  const frame = (t) => {
    let firing = null;
    cyls.forEach((g, i) => {
      const n = i + 1, x = XS[i];
      const a = throwAngle(t, n);
      const rad = (a * Math.PI) / 180;
      const pinY = AXIS - R * Math.cos(rad);
      const wristY = pinY - Math.sqrt(L * L - (R * Math.sin(rad)) ** 2);
      const top = wristY - PIN;
      g.querySelector('.pst').setAttribute('y', top);
      const rod = g.querySelector('.rod'); rod.setAttribute('y1', wristY); rod.setAttribute('y2', pinY);
      const web = g.querySelector('.web'); web.setAttribute('y', Math.min(pinY, AXIS) - 8); web.setAttribute('height', Math.abs(pinY - AXIS) + 16);
      g.querySelector('.dial').setAttribute('transform', `rotate(${a})`);
      const c = cycleAngle(t, n, order);
      const gas = gasAt(c);
      const gr = g.querySelector('.gas'); gr.setAttribute('height', Math.max(0, top - ROOF)); gr.setAttribute('fill', `rgba(${COLORS[gas.kind]},${gas.o})`);
      const sp = c >= SPARK - 8 && c < SPARK + 10;
      g.querySelector('.spk').setAttribute('r', sp ? 7 : 0);
      const s = strokeAt(c);
      const st = g.querySelector('.stk'); st.textContent = s.name.toUpperCase(); st.setAttribute('class', `stk stk--${s.id}`);
      if (s.id === 'power') firing = n;
      g.classList.toggle('is-power', s.id === 'power');
    });
    const px = (norm720(t) / 720) * 320;
    const ph = wrap.querySelector('.sph'); ph.setAttribute('x1', px); ph.setAttribute('x2', px);
    readout.innerHTML = `<span class="ro mono">θ ${Math.round(norm720(t))}°</span>` + order.map((n) => `<span class="ro ${n === firing ? 'ro--stroke ro--power' : ''}"><b>${n}</b></span>`).join('<span class="muted">→</span>');
  };

  const tl = timeline(wrap, { period: 720, cycleMs: 6000, onFrame: frame });
  const ctl = wrap.querySelector('.ctl');
  if (spec.orders) ctl.append(chips([{ value: '1342', label: 'Order 1-3-4-2' }, { value: '1243', label: 'Order 1-2-4-3' }], { value: '1342', onPick(v) { order = ORDERS[v]; frame(tl.get()); } }).el);
  if (spec.shake !== undefined) ctl.append(chips([{ value: 'off', label: 'Hide forces' }, { value: 'on', label: 'Show shaking forces' }], { value: showShake ? 'on' : 'off', onPick(v) { showShake = v === 'on'; layout(); } }).el);
  layout();
  return { destroy: () => tl.destroy() };
}
