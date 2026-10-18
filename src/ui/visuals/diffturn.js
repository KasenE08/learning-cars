// A driven axle in a turn or with one wheel on ice: open / limited-slip / locked / twin-clutch.
// Kinematics are real (outer wheel travels farther); torque splits are simplified for clarity.
import { html, el } from '../dom.js';
import { slider, chips } from './controls.js';

export const TYPES = {
  open: { label: 'Open', note: 'Equal torque to both sides, always. Wheels may turn at any speeds. Great on pavement; one spinning wheel limits both.' },
  lsd: { label: 'Limited-slip', note: 'Lets the wheels turn at different speeds, but resists a big difference, sending extra torque to the slower (gripping) wheel. Bias is limited.' },
  locked: { label: 'Locked', note: 'Both wheels forced to the same speed. Any torque the gripping wheel can use, it gets. In a turn one tire must scrub.' },
  twinclutch: { label: 'Twin-clutch', note: 'No gears between the wheels: a computer squeezes each side’s clutch. Can overdrive the outer wheel in turns (torque vectoring) or clamp both like a locker.' },
};

/** Wheel speeds (relative to the car's speed) for a turn of given severity, and torque split for type and scene. */
export function axleState(type, steer, slip) {
  // steer 0..1 → turn; half-track/radius ratio up to 0.25 (tight turn)
  const k = 0.25 * steer;
  let sL = 1 + k, sR = 1 - k; // right turn: left is the outer wheel
  let tL = 0.5, tR = 0.5, scrub = 0, lost = 0, msg = '';
  const grip = slip ? 0.08 : 1; // right wheel on ice when slip
  if (slip) {
    if (type === 'open') { tR = grip / 2 + 0.0; tL = tR; lost = 1 - tL - tR; sR = 2; sL = 0; msg = 'The icy wheel can only take a tiny torque, and the open diff gives the other wheel the same tiny amount. The icy wheel spins at double speed; the car barely moves.'; }
    else if (type === 'lsd') { tR = grip / 2; tL = Math.min(0.5, tR * 4); lost = 1 - tL - tR; sR = 1.5; sL = 0.5; msg = 'The LSD resists the speed difference and multiplies the torque to the gripping wheel by its bias ratio (here 4:1). Better, but the icy wheel still limits it.'; }
    else { tR = grip / 2; tL = 1 - tR; sR = 1; sL = 1; msg = type === 'locked' ? 'Locked: both wheels turn together, so the gripping wheel gets nearly all the torque. The car drives out.' : 'Twin-clutch: the computer clamps the gripping side’s clutch hard and frees the icy side. The gripping wheel gets the drive.'; }
  } else if (steer > 0.02) {
    if (type === 'open') msg = 'Spider gears spin so the outer wheel can turn faster. Torque stays 50/50, no tire scrub.';
    else if (type === 'lsd') { msg = 'The LSD lets the speeds differ but adds some friction, shifting a little torque to the slower inner wheel. Mild push in tight turns.'; tL = 0.45; tR = 0.55; }
    else if (type === 'locked') { sL = sR = 1; scrub = k; msg = 'Locked: both wheels must turn at the same speed, so one tire scrubs and hops. That’s why lockers are for low-speed off-road, not pavement turns.'; tL = 0.3; tR = 0.7; }
    else { tL = 0.68; tR = 0.32; msg = 'Torque vectoring: the outer clutch is clamped harder, pushing the outer wheel and helping the car rotate into the turn.'; }
  } else msg = 'Going straight: every type behaves the same. Both wheels at the same speed, torque 50/50.';
  return { sL, sR, tL, tR, scrub, lost, msg };
}

export function mount(host, spec = {}) {
  let type = spec.diff || spec.kind || 'open', slip = spec.scene === 'slip', steer = spec.scene === 'turn' ? 0.7 : 0;
  const wrap = el(html`<figure class="vis" data-noswipe><svg viewBox="0 0 360 300" class="d" role="img" aria-label="Differential in a turn"></svg><div class="vis__readout dt__ro"></div><div class="ctl"></div></figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg');
  const ro = wrap.querySelector('.dt__ro');
  let raf = 0, t0 = performance.now(), rotL = 0, rotR = 0, spider = 0;

  svg.innerHTML = `
    <path class="dt-arc" fill="none" stroke="#3a424c" stroke-dasharray="4 6" stroke-width="2"/>
    <rect x="40" y="144" width="280" height="12" rx="4" fill="#5a6470"/>
    <g class="dt-wheelL"><rect x="14" y="96" width="34" height="108" rx="8" fill="#14171a" stroke="#8994a1" stroke-width="2"/><g class="dt-treadL"></g></g>
    <g class="dt-wheelR"><rect x="312" y="96" width="34" height="108" rx="8" class="dt-tireR" fill="#14171a" stroke="#8994a1" stroke-width="2"/><g class="dt-treadR"></g></g>
    <rect x="140" y="110" width="80" height="80" rx="12" fill="#1d2126" stroke="#8994a1" stroke-width="1.6"/>
    <g class="dt-gears"></g>
    <path d="M180,190 L180,286" stroke="#c9d1d9" stroke-width="7"/><text x="190" y="280" class="awd-sub">from driveshaft</text>
    <text class="dt-tl awd-pct" x="31" y="84" text-anchor="middle"></text><text class="dt-tr awd-pct" x="329" y="84" text-anchor="middle"></text>
    <text class="dt-sl awd-sub" x="31" y="226" text-anchor="middle"></text><text class="dt-sr awd-sub" x="329" y="226" text-anchor="middle"></text>
    <text class="dt-ice awd-slip" x="329" y="244" text-anchor="middle"></text>`;
  const $ = (q) => svg.querySelector(q);
  const tread = (side, off) => { let d = ''; for (let i = 0; i < 9; i++) { const y = 100 + ((i * 12 + off) % 108); d += `M${side ? 316 : 18},${y} h26 `; } return `<path d="${d}" stroke="#3a424c" stroke-width="3"/>`; };
  const gearsFor = () => {
    if (type === 'twinclutch') return [0, 1].map((s) => { let p = ''; for (let i = 0; i < 6; i++) p += `<rect x="${s ? 194 + i * 4 : 148 + i * 4}" y="124" width="2.5" height="52" fill="${i % 2 ? '#c9a24a' : '#9aa5b1'}"/>`; return p; }).join('') + '<rect x="174" y="118" width="12" height="64" fill="#ff6b1a"/>';
    if (type === 'locked') return '<rect x="150" y="128" width="60" height="44" rx="4" fill="#ff6b1a" opacity="0.8"/><text x="180" y="155" text-anchor="middle" class="awd-bt">LOCKED</text>';
    return `<path d="M152,128 L152,172 L166,164 L166,136 Z M208,128 L208,172 L194,164 L194,136 Z" fill="#6d7782" stroke="#c9d1d9"/><g class="dt-spider"><path d="M168,122 L192,122 L188,138 L172,138 Z M168,178 L192,178 L188,162 L172,162 Z" fill="#9aa5b1" stroke="#dfe5ea"/><line x1="180" y1="120" x2="180" y2="180" stroke="#c9d1d9" stroke-width="3"/></g>${type === 'lsd' ? '<rect x="144" y="124" width="6" height="52" fill="#c9a24a"/><rect x="210" y="124" width="6" height="52" fill="#c9a24a"/>' : ''}`;
  };
  const paint = () => {
    $('.dt-gears').innerHTML = gearsFor();
    const st = axleState(type, steer, slip);
    $('.dt-tl').textContent = `${Math.round(st.tL * 100)}%`;
    $('.dt-tr').textContent = `${Math.round(st.tR * 100)}%`;
    $('.dt-sl').textContent = `speed ${st.sL.toFixed(2)}×`;
    $('.dt-sr').textContent = `speed ${st.sR.toFixed(2)}×`;
    $('.dt-ice').textContent = slip ? 'ICE' : '';
    $('.dt-tireR').setAttribute('fill', slip ? '#1f3a52' : '#14171a');
    $('.dt-arc').setAttribute('d', steer > 0.02 && !slip ? `M30,40 Q180,${40 + 120 * steer} 330,40` : 'M0,0');
    ro.innerHTML = String(html`<span class="ro">torque L <b>${Math.round(st.tL * 100)}%</b> · R <b>${Math.round(st.tR * 100)}%</b></span>${st.lost > 0.01 ? html`<span class="ro ro--stroke ro--power">${Math.round(st.lost * 100)}% can’t be used</span>` : ''}${st.scrub ? html`<span class="ro">tire scrub</span>` : ''}<p class="lay__note">${st.msg}</p><p class="lay__note muted">${TYPES[type].note}</p>`);
    return st;
  };
  let st = paint();
  const loop = (now) => {
    const dt = Math.min(64, now - t0); t0 = now;
    rotL += dt * 0.06 * st.sL; rotR += dt * 0.06 * st.sR; spider += dt * 0.06 * (st.sL - st.sR) * 3;
    $('.dt-treadL').innerHTML = tread(0, rotL % 108);
    $('.dt-treadR').innerHTML = tread(1, rotR % 108);
    const sp = $('.dt-spider'); if (sp) sp.setAttribute('transform', `translate(0 ${Math.sin(spider / 10) * 4})`);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const ctl = wrap.querySelector('.ctl');
  if (spec.pick !== false) ctl.append(chips(Object.entries(TYPES).map(([value, t]) => ({ value, label: t.label })), { value: type, onPick(v) { type = v; st = paint(); } }).el);
  ctl.append(slider({ label: 'Right turn', min: 0, max: 100, value: Math.round(steer * 100), fmt: (v) => (v ? `${v}%` : 'straight'), onInput(v) { steer = v / 100; st = paint(); } }).el);
  ctl.append(chips([{ value: 'dry', label: 'Both wheels grip' }, { value: 'ice', label: 'Right wheel on ice' }], { value: slip ? 'ice' : 'dry', onPick(v) { slip = v === 'ice'; st = paint(); } }).el);
  return { destroy: () => cancelAnimationFrame(raf) };
}
