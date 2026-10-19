// OBD-II Mode 01 request/response builder with the standard SAE J1979 formulas.
import { html, el } from '../../dom.js';
import { slider } from '../controls.js';

export const PIDS = {
  '04': { name: 'Calculated engine load', unit: '%', bytes: 1, min: 0, max: 100, enc: (v) => [Math.round((v * 255) / 100)], dec: 'A × 100 / 255', calc: ([A]) => (A * 100) / 255, def: 42 },
  '05': { name: 'Coolant temperature', unit: '°C', bytes: 1, min: -40, max: 215, enc: (v) => [Math.round(v + 40)], dec: 'A − 40', calc: ([A]) => A - 40, def: 90, f: true },
  '0B': { name: 'Intake manifold pressure', unit: 'kPa', bytes: 1, min: 0, max: 255, enc: (v) => [Math.round(v)], dec: 'A', calc: ([A]) => A, def: 35 },
  '0C': { name: 'Engine RPM', unit: 'rpm', bytes: 2, min: 0, max: 7000, enc: (v) => { const r = Math.round(v * 4); return [r >> 8, r & 255]; }, dec: '(256 × A + B) / 4', calc: ([A, B]) => (256 * A + B) / 4, def: 1725 },
  '0D': { name: 'Vehicle speed', unit: 'km/h', bytes: 1, min: 0, max: 255, enc: (v) => [Math.round(v)], dec: 'A', calc: ([A]) => A, def: 64, mph: true },
  '0F': { name: 'Intake air temperature', unit: '°C', bytes: 1, min: -40, max: 215, enc: (v) => [Math.round(v + 40)], dec: 'A − 40', calc: ([A]) => A - 40, def: 30, f: true },
  10: { name: 'MAF air flow rate', unit: 'g/s', bytes: 2, min: 0, max: 655, enc: (v) => { const r = Math.round(v * 100); return [r >> 8, r & 255]; }, dec: '(256 × A + B) / 100', calc: ([A, B]) => (256 * A + B) / 100, def: 12.5 },
  11: { name: 'Throttle position', unit: '%', bytes: 1, min: 0, max: 100, enc: (v) => [Math.round((v * 255) / 100)], dec: 'A × 100 / 255', calc: ([A]) => (A * 100) / 255, def: 18 },
  '2F': { name: 'Fuel tank level', unit: '%', bytes: 1, min: 0, max: 100, enc: (v) => [Math.round((v * 255) / 100)], dec: 'A × 100 / 255', calc: ([A]) => (A * 100) / 255, def: 65 },
  46: { name: 'Ambient air temperature', unit: '°C', bytes: 1, min: -40, max: 215, enc: (v) => [Math.round(v + 40)], dec: 'A − 40', calc: ([A]) => A - 40, def: 21, f: true },
};
const h2 = (n) => n.toString(16).toUpperCase().padStart(2, '0');

export function mount(host, spec = {}) {
  const key = Object.keys(PIDS).find((k) => k.toUpperCase() === String(spec.pid || '0C').toUpperCase()) || '0C';
  const S = { pid: key, val: PIDS[key].def };
  const wrap = el(html`<figure class="vis pid" data-noswipe>
    <label class="pid__pick"><span class="kicker">PID</span><select class="mono">${Object.entries(PIDS).map(([k, p]) => html`<option value="${k}" ${k === key ? 'selected' : ''}>01 ${k} · ${p.name}</option>`)}</select></label>
    <div class="pid__msgs"></div>
    <div class="ctl"></div>
    <p class="vis__note">Standard SAE J1979 formulas. 7DF is the “anyone listening?” broadcast request; the engine computer usually answers as 7E8. Unused bytes are padding (often 55 or 00/AA). Example values only.</p>
  </figure>`);
  host.append(wrap);
  const msgs = wrap.querySelector('.pid__msgs'), ctl = wrap.querySelector('.ctl');
  let sl = null;
  function controls() {
    const p = PIDS[S.pid];
    ctl.replaceChildren();
    sl = slider({ label: 'Real value', min: p.min, max: p.max, step: p.max > 1000 ? 25 : 1, value: S.val, fmt: (v) => `${v} ${p.unit}`, onInput(v) { S.val = v; draw(); } });
    ctl.append(sl.el);
  }
  function draw() {
    const p = PIDS[S.pid];
    const data = p.enc(S.val);
    const req = [0x02, 0x01, parseInt(S.pid, 16), 0x55, 0x55, 0x55, 0x55, 0x55];
    const resp = [1 + 1 + data.length, 0x41, parseInt(S.pid, 16), ...data];
    while (resp.length < 8) resp.push(0x55);
    const [A, B] = data;
    const v = p.calc(data);
    const extra = p.f ? ` (${(v * 9 / 5 + 32).toFixed(0)} °F)` : p.mph ? ` (${(v / 1.609344).toFixed(0)} mph)` : '';
    msgs.innerHTML = `
      <div class="pid__msg"><small>request (tool → car)</small><span class="mono"><b>7DF</b> [${req.map((b, i) => `<i class="${i === 0 ? 'k-len' : i === 1 ? 'k-mode' : i === 2 ? 'k-pid' : 'k-pad'}">${h2(b)}</i>`).join(' ')}]</span></div>
      <div class="pid__legend"><i class="k-len">length</i><i class="k-mode">mode 01</i><i class="k-pid">PID</i><i class="k-pad">padding</i></div>
      <div class="pid__msg"><small>response (ECU → tool)</small><span class="mono"><b>7E8</b> [${resp.map((b, i) => `<i class="${i === 0 ? 'k-len' : i === 1 ? 'k-mode' : i === 2 ? 'k-pid' : i < 3 + data.length ? 'k-data' : 'k-pad'}">${h2(b)}</i>`).join(' ')}]</span></div>
      <div class="pid__legend"><i class="k-mode">41 = 01 + 0x40 (“positive reply”)</i><i class="k-data">data A${p.bytes > 1 ? ', B' : ''}</i></div>
      <div class="bf__line bf__phys"><small>decode</small><span class="mono">${p.dec.replace('A', `A(${A})`).replace('B', `B(${B})`)} = <b>${+v.toFixed(2)} ${p.unit}</b>${extra}</span></div>`;
  }
  wrap.querySelector('select').addEventListener('change', (e) => { S.pid = e.target.value; S.val = PIDS[S.pid].def; controls(); draw(); });
  controls(); draw();
  return { destroy() {} };
}
