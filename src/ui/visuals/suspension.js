// Suspension: damper (quarter-car over a bump), types (side-by-side schematics), align (camber/caster/toe).
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

/** Quarter-car: body mass on spring k + damper c over a road input. Returns body + wheel heights over time. */
export function simulate(k, c, steps = 260, dt = 0.01) {
  const m = 1, mu = 0.15, kt = 160; // body, wheel, tire stiffness (normalized units)
  let zb = 0, vb = 0, zw = 0, vw = 0;
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    const road = t > 0.3 && t < 0.6 ? 0.5 * (1 - Math.cos((2 * Math.PI * (t - 0.3)) / 0.3)) / 2 * 2 : 0; // bump
    const fs = k * (zw - zb) + c * (vw - vb);
    vb += (fs / m) * dt; zb += vb * dt;
    const fw = kt * (road - zw) - fs;
    vw += (fw / mu) * dt; zw += vw * dt;
    out.push({ t, road, zb, zw });
  }
  return out;
}
const SETUPS = { soft: { label: 'Too soft', k: 18, c: 1.2 }, good: { label: 'Well damped', k: 30, c: 4.5 }, stiff: { label: 'Too stiff', k: 120, c: 9 }, none: { label: 'No damper', k: 30, c: 0.05 } };

function damper(wrap, spec) {
  let set = 'good', sim = simulate(SETUPS.good.k, SETUPS.good.c), i = 0, raf = 0;
  wrap.innerHTML = `<svg viewBox="0 0 360 240" class="d" role="img" aria-label="Quarter car over a bump"><g class="sp-scene"></g></svg><div class="vis__readout sp__ro"></div><div class="ctl"></div>`;
  const svg = wrap.querySelector('.sp-scene'), ro = wrap.querySelector('.sp__ro');
  const frame = () => {
    const s = sim[i % sim.length];
    const roadY = 210 - s.road * 60, wy = 180 - s.zw * 60, by = 90 - s.zb * 60;
    let coil = `M150,${by + 30}`; const n = 8; for (let j = 1; j <= n; j++) coil += ` L${j % 2 ? 170 : 130},${by + 30 + ((wy - 20 - by - 30) * j) / n}`;
    svg.innerHTML = `<path d="M0,210 L${120 - (i % sim.length) * 1.4 + 200},210 q30,-60 60,0 L360,210" fill="none" stroke="#5b6470" stroke-width="3" transform="translate(${-((i % sim.length) * 0)} ${0})"/>
      <path d="M0,${roadY} H360" stroke="#3a424c" stroke-width="2" stroke-dasharray="2 6"/>
      <rect x="90" y="${by}" width="180" height="30" rx="6" fill="#4a535e" stroke="#c9d1d9"/><text x="180" y="${by + 20}" text-anchor="middle" class="awd-bt">BODY (sprung)</text>
      <path d="${coil}" fill="none" stroke="#ffc21a" stroke-width="3"/>
      <rect x="196" y="${by + 30}" width="16" height="${Math.max(10, (wy - 20 - by - 30) * 0.6)}" fill="#7fb2e0"/><rect x="200" y="${by + 30}" width="8" height="${wy - 20 - by - 30}" fill="#c9d1d9"/>
      <circle cx="180" cy="${wy}" r="22" fill="#14171a" stroke="#8994a1" stroke-width="5"/><text x="230" y="${wy + 4}" class="awd-sub">wheel (unsprung)</text>`;
    i++;
    raf = requestAnimationFrame(frame);
  };
  const report = () => {
    const peak = Math.max(...sim.map((s) => Math.abs(s.zb))), late = sim.slice(-80).reduce((a, s) => Math.max(a, Math.abs(s.zb)), 0);
    const msg = { soft: 'Floaty: big body motion, slow to settle. Comfortable but vague.', good: 'Spring takes the hit, damper soaks up the energy: one smooth motion and it settles.', stiff: 'Harsh: the bump goes straight into the body; the tire can skip off the road.', none: 'The spring keeps bouncing because nothing turns its energy into heat. That’s what dampers are for.' }[set];
    ro.innerHTML = `<span class="ro">peak body move <b>${(peak * 100).toFixed(0)}</b></span><span class="ro">still moving after <b>${late > 0.03 ? 'yes' : 'no'}</b></span><p class="lay__note">${msg}</p>`;
  };
  wrap.querySelector('.ctl').append(chips(Object.entries(SETUPS).map(([value, s]) => ({ value, label: s.label })), { value: set, onPick(v) { set = v; sim = simulate(SETUPS[v].k, SETUPS[v].c); i = 0; report(); } }).el);
  report();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

function types(wrap) {
  const card = (x, title, body, note) => `<g transform="translate(${x} 0)"><rect x="4" y="4" width="168" height="196" rx="6" fill="#0e1114" stroke="#262b31"/>${body}<text x="88" y="218" text-anchor="middle" class="awd-lbl">${title}</text><text x="88" y="234" text-anchor="middle" class="awd-sub">${note}</text></g>`;
  const wheel = '<rect x="118" y="80" width="26" height="90" rx="6" fill="#14171a" stroke="#8994a1" stroke-width="2"/><rect x="104" y="116" width="14" height="18" fill="#5a6470"/>';
  wrap.innerHTML = `<svg viewBox="0 0 360 500" class="d" role="img" aria-label="Suspension types">
    ${card(0, 'MACPHERSON STRUT', `${wheel}<path d="M110,118 L80,30" stroke="#7fb2e0" stroke-width="10"/><path d="M84,44 l14,6 l-14,6 l14,6 l-14,6 l14,6" stroke="#ffc21a" stroke-width="2" fill="none"/><path d="M106,140 L28,150" stroke="#c9d1d9" stroke-width="5"/><circle cx="28" cy="150" r="5" fill="#8994a1"/>`, 'strut + one lower arm')}
    ${card(184, 'DOUBLE WISHBONE', `${wheel}<path d="M110,96 L36,80 M110,150 L28,160" stroke="#c9d1d9" stroke-width="5"/><path d="M90,150 L76,92" stroke="#7fb2e0" stroke-width="8"/><circle cx="36" cy="80" r="5" fill="#8994a1"/><circle cx="28" cy="160" r="5" fill="#8994a1"/>`, 'two A-arms: best camber control')}
    <g transform="translate(0 250)">${card(0, 'MULTI-LINK', `${wheel}<path d="M110,96 L30,70 M110,104 L36,110 M110,146 L30,140 M110,154 L40,180" stroke="#c9d1d9" stroke-width="4"/><path d="M90,150 L80,96" stroke="#7fb2e0" stroke-width="8"/>`, '3–5 links tune each motion')}
    ${card(184, 'SOLID AXLE', `<rect x="18" y="80" width="26" height="90" rx="6" fill="#14171a" stroke="#8994a1" stroke-width="2"/>${wheel}<rect x="44" y="120" width="60" height="10" fill="#c9d1d9"/><path d="M60,120 L60,40 M92,120 L92,40" stroke="#7fb2e0" stroke-width="7"/>`, 'wheels tied together: tough, articulates')}</g>
  </svg>`;
  return () => {};
}

function align(wrap) {
  let camber = -1, caster = 6, toe = 0.1;
  wrap.innerHTML = `<svg viewBox="0 0 360 260" class="d" role="img" aria-label="Alignment angles"></svg><div class="vis__readout al__ro"></div><div class="ctl"></div>`;
  const svg = wrap.querySelector('svg'), ro = wrap.querySelector('.al__ro');
  const draw = () => {
    const tire = (cx, cy, w, h, rot, label) => `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="6" fill="#14171a" stroke="#ff6b1a" stroke-width="2"/></g><text x="${cx}" y="246" text-anchor="middle" class="awd-lbl">${label}</text>`;
    svg.innerHTML = `
      <line x1="60" y1="40" x2="60" y2="200" stroke="#3a424c" stroke-dasharray="3 3"/>${tire(60, 120, 30, 120, camber * 4, 'CAMBER (front)')}<text x="60" y="226" text-anchor="middle" class="awd-sub">${camber.toFixed(1)}°</text>
      <line x1="180" y1="40" x2="180" y2="200" stroke="#3a424c" stroke-dasharray="3 3"/><circle cx="180" cy="130" r="50" fill="#14171a" stroke="#8994a1" stroke-width="2"/><line x1="${180 - 90 * Math.sin((caster * 4 * Math.PI) / 180)}" y1="${130 - 90 * Math.cos((caster * 4 * Math.PI) / 180)}" x2="${180 + 90 * Math.sin((caster * 4 * Math.PI) / 180)}" y2="${130 + 90 * Math.cos((caster * 4 * Math.PI) / 180)}" stroke="#ff6b1a" stroke-width="3"/><text x="180" y="246" text-anchor="middle" class="awd-lbl">CASTER (side)</text><text x="180" y="226" text-anchor="middle" class="awd-sub">${caster.toFixed(1)}°</text>
      ${tire(280, 80, 22, 70, toe * 8, '')}${tire(330, 80, 22, 70, -toe * 8, 'TOE (from above)')}<text x="305" y="160" text-anchor="middle" class="awd-sub">${toe > 0 ? 'toe-in' : toe < 0 ? 'toe-out' : 'zero'} ${Math.abs(toe).toFixed(2)}°</text><text x="305" y="30" text-anchor="middle" class="awd-sub">front ↑</text>`;
    const notes = [
      camber < -0.3 ? 'Negative camber (top in): more grip in hard corners, more inner-edge wear.' : camber > 0.3 ? 'Positive camber (top out): wears the outer edge, rare on modern cars.' : 'Near-zero camber: even wear when driving straight.',
      caster > 3 ? 'Positive caster (steering axis tilted back): self-centering and straight-line stability, heavier steering.' : 'Low caster: light steering, weaker self-centering.',
      toe > 0.05 ? 'Toe-in: stable on the highway, slight scrub.' : toe < -0.05 ? 'Toe-out: sharper turn-in, darty, wears tires.' : 'Zero toe: least scrub.',
    ];
    ro.innerHTML = notes.map((n) => `<p class="lay__note">${n}</p>`).join('');
  };
  wrap.querySelector('.ctl').append(
    slider({ label: 'Camber', min: -3, max: 2, step: 0.1, value: camber, fmt: (v) => `${v.toFixed(1)}°`, onInput(v) { camber = v; draw(); } }).el,
    slider({ label: 'Caster', min: 0, max: 9, step: 0.1, value: caster, fmt: (v) => `${v.toFixed(1)}°`, onInput(v) { caster = v; draw(); } }).el,
    slider({ label: 'Toe', min: -0.5, max: 0.5, step: 0.01, value: toe, fmt: (v) => `${v.toFixed(2)}°`, onInput(v) { toe = v; draw(); } }).el,
  );
  wrap.append(el(html`<p class="vis__note">Angles are exaggerated in the drawing so you can see them. Real specs are usually within a few degrees (toe is fractions of a degree).</p>`));
  draw();
  return () => {};
}

export function mount(host, spec = {}) {
  const wrap = el(html`<figure class="vis" data-noswipe></figure>`);
  host.append(wrap);
  const stop = ({ damper, types, align }[spec.view || 'damper'])(wrap, spec);
  return { destroy: stop };
}
