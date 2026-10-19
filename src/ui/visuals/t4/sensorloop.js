// Sensor → ECU → actuator control loops, animated with live numbers (illustrative, not real calibrations).
import { html, el } from '../../dom.js';
import { chips, slider } from '../controls.js';

const LOOPS = {
  throttle: { sensor: 'Pedal|sensors', ecu: 'PCM', act: 'Electronic|throttle', input: 'Pedal', unit: '%', note: 'Drive-by-wire: the pedal is just a sensor (two of them, for cross-checking). The PCM decides how far to open the throttle, which lets it smooth, limit or override you (traction control, rev limits).' },
  abs: { sensor: 'Wheel-speed|sensors', ecu: 'ABS|module', act: 'Brake|valves', input: 'Brake force', unit: '%', note: 'When one wheel slows much faster than the car (about to lock), the ABS module releases and re-applies that wheel’s brake pressure many times a second.' },
  fan: { sensor: 'Coolant temp|sensor', ecu: 'PCM', act: 'Radiator|fan', input: 'Engine load', unit: '%', note: 'Closed loop: temperature rises → fan speeds up → temperature falls → fan slows. The thermostat does the same job mechanically.' },
};

export function mount(host, spec = {}) {
  const S = { loop: LOOPS[spec.loop] ? spec.loop : 'throttle', input: 40, t: 0, temp: 90, lock: 0 };
  const wrap = el(html`<figure class="vis sl" data-noswipe>
    <svg viewBox="0 0 340 170" class="d" role="img" aria-label="Sensor to ECU to actuator"></svg>
    <div class="big-out"></div><div class="ctl"></div><p class="vis__note"></p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), out = wrap.querySelector('.big-out');
  let raf = 0, last = 0;
  const box = (x, label, sub, c) => `<rect x="${x}" y="36" width="96" height="66" rx="6" fill="#1d2126" stroke="${c}" stroke-width="1.5"/>${label.split('|').map((t, i) => `<text x="${x + 48}" y="${54 + i * 13}" text-anchor="middle" class="awd-lbl" style="font-size:10px">${t}</text>`).join('')}<text x="${x + 48}" y="${label.includes('|') ? 92 : 80}" text-anchor="middle" class="awd-sub">${String(sub).slice(0, 16)}</text>`;
  function frame(ts) {
    const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts; S.t += dt;
    const L = LOOPS[S.loop];
    let sv, cmd, act, extra = '';
    if (S.loop === 'throttle') {
      sv = S.input; cmd = Math.min(100, S.input * 0.9 + 2); act = `${cmd.toFixed(0)}% open`;
      out.innerHTML = `<span class="ro"><small>Pedal sensors</small><b>${sv.toFixed(0)}%</b></span><span class="ro ro--hl"><small>Throttle command</small><b>${cmd.toFixed(0)}%</b></span>`;
    } else if (S.loop === 'abs') {
      const slip = Math.max(0, S.input - 60) / 40; // more brake than grip → wheel wants to lock
      const pulse = slip > 0 ? (Math.sin(S.t * 2 * Math.PI * 12) > 0 ? 1 : 0) : 0;
      sv = slip > 0 ? `wheel ${(30 - slip * 18 * (1 - pulse)).toFixed(0)} vs car 30 mph` : 'all wheels 30 mph';
      cmd = slip > 0 ? (pulse ? 'release' : 'hold/apply') : 'normal braking'; act = cmd;
      extra = slip > 0 ? `<text x="170" y="160" text-anchor="middle" class="awd-sub" style="fill:#ffc21a">ABS active: pulsing about ${12} times a second (illustrative)</text>` : '';
      out.innerHTML = `<span class="ro"><small>Wheel speeds</small><b style="font-size:13px">${sv}</b></span><span class="ro ro--hl"><small>Valve command</small><b style="font-size:14px">${cmd}</b></span>`;
    } else {
      const fan = Math.max(0, Math.min(100, (S.temp - 95) * 12));
      S.temp += dt * (S.input * 0.08 - fan * 0.06 - (S.temp - 88) * 0.05);
      sv = `${S.temp.toFixed(1)} °C (${(S.temp * 9 / 5 + 32).toFixed(0)} °F)`; cmd = fan; act = `fan ${fan.toFixed(0)}%`;
      out.innerHTML = `<span class="ro"><small>Coolant temp</small><b style="font-size:14px">${sv}</b></span><span class="ro ro--hl"><small>Fan command</small><b>${fan.toFixed(0)}%</b></span>`;
    }
    const dash = -((S.t * 40) % 20);
    svg.innerHTML = `${box(4, L.sensor, typeof sv === 'number' ? `${sv.toFixed(0)}%` : 'measuring', '#7fb2e0')}${box(122, L.ecu, 'decides', '#ff6b1a')}${box(240, L.act, act, '#ffc21a')}
      <line x1="100" x2="122" y1="68" y2="68" stroke="#7fb2e0" stroke-width="3" stroke-dasharray="6 4" stroke-dashoffset="${dash}"/>
      <line x1="218" x2="240" y1="68" y2="68" stroke="#ffc21a" stroke-width="3" stroke-dasharray="6 4" stroke-dashoffset="${dash}"/>
      <path d="M288,102 V126 H52 V102" fill="none" stroke="#3a424c" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="170" y="140" text-anchor="middle" class="awd-sub">feedback: the result changes what the sensor sees</text>
      <text x="52" y="30" text-anchor="middle" class="awd-sub">input</text><text x="170" y="30" text-anchor="middle" class="awd-sub">logic</text><text x="288" y="30" text-anchor="middle" class="awd-sub">output</text>${extra}`;
    raf = requestAnimationFrame(frame);
  }
  const ctl = wrap.querySelector('.ctl');
  const build = () => {
    ctl.replaceChildren(
      chips(Object.keys(LOOPS).map((k) => ({ value: k, label: { throttle: 'Throttle', abs: 'ABS', fan: 'Cooling fan' }[k] })), { value: S.loop, onPick(v) { S.loop = v; build(); } }).el,
      slider({ label: LOOPS[S.loop].input, min: 0, max: 100, value: S.input, fmt: (v) => `${v}%`, onInput(v) { S.input = v; } }).el,
    );
    wrap.querySelector('.vis__note').textContent = LOOPS[S.loop].note;
  };
  build();
  raf = requestAnimationFrame(frame);
  return { destroy: () => cancelAnimationFrame(raf) };
}
