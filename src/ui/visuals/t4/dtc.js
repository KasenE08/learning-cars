// Trouble-code decoder (SAE J2012 structure) and the 2-byte encoding used in Mode 03 replies.
import { html, el } from '../../dom.js';

const SYS = { P: 'Powertrain (engine, transmission)', C: 'Chassis (ABS, steering, suspension)', B: 'Body (airbags, doors, lights, seats)', U: 'Network (communication between modules)' };
const P_SUB = { 0: 'fuel & air metering / emissions', 1: 'fuel & air metering', 2: 'fuel & air metering (injector circuit)', 3: 'ignition system or misfire', 4: 'auxiliary emissions controls', 5: 'vehicle speed, idle control, auxiliary inputs', 6: 'computer & output circuits', 7: 'transmission', 8: 'transmission', 9: 'transmission / control modules', A: 'hybrid propulsion', B: 'hybrid propulsion', C: 'hybrid propulsion' };
const KNOWN = { P0301: 'Cylinder 1 misfire detected', P0300: 'Random / multiple cylinder misfire detected', P0420: 'Catalyst system efficiency below threshold (bank 1)', P0171: 'System too lean (bank 1)', P0128: 'Coolant thermostat (coolant temperature below regulating temperature)', P0455: 'Evaporative emission system leak detected (large leak)', U0100: 'Lost communication with ECM/PCM "A"', C0035: 'Left front wheel speed sensor circuit' };

export function encodeDtc(code) {
  const sys = 'PCBU'.indexOf(code[0]);
  const d1 = Number(code[1]);
  const rest = parseInt(code.slice(2), 16);
  return [(sys << 6) | (d1 << 4) | (rest >> 8), rest & 0xff];
}

export function mount(host, spec = {}) {
  const S = { code: /^[PCBU][0-3][0-9A-F]{3}$/.test(spec.code || '') ? spec.code : 'P0301' };
  const wrap = el(html`<figure class="vis dtc" data-noswipe>
    <label class="pid__pick"><span class="kicker">Code</span><input class="mono dtc__in" maxlength="5" value="${S.code}" spellcheck="false" autocapitalize="characters"></label>
    <div class="dtc__parts"></div>
    <div class="dtc__bytes"></div>
    <p class="vis__note">Structure from SAE J2012 / ISO 15031-6. Digit 2 = 0 means a generic code (same meaning on every car); 1 means manufacturer-specific (look it up for Ford). The code says what the computer saw, not which part to replace.</p>
  </figure>`);
  host.append(wrap);
  const input = wrap.querySelector('input');
  function draw() {
    const c = S.code, gen = c[1] === '0' || c[1] === '2';
    const sub = c[0] === 'P' ? P_SUB[c[2]] || 'see the code list' : 'see the code list';
    wrap.querySelector('.dtc__parts').innerHTML = `
      <div class="dtc__row"><b class="mono">${c[0]}</b><span>${SYS[c[0]]}</span></div>
      <div class="dtc__row"><b class="mono">${c[1]}</b><span>${c[1] === '0' ? 'Generic (SAE): same meaning on every car' : c[1] === '1' ? 'Manufacturer-specific' : c[1] === '2' ? 'Generic (SAE) for P; check the list for others' : 'Mixed: some generic, some manufacturer'}</span></div>
      <div class="dtc__row"><b class="mono">${c[2]}</b><span>Subsystem${c[0] === 'P' && gen ? `: ${sub}` : ''}</span></div>
      <div class="dtc__row"><b class="mono">${c.slice(3)}</b><span>Specific fault</span></div>
      ${KNOWN[c] ? `<div class="dtc__row dtc__known"><b class="mono">=</b><span>${KNOWN[c]}</span></div>` : ''}`;
    const [b0, b1] = encodeDtc(c);
    const bin = b0.toString(2).padStart(8, '0');
    wrap.querySelector('.dtc__bytes').innerHTML = `<div class="bf__line"><small>Mode 03</small><span class="mono">2 bytes: <b>${b0.toString(16).toUpperCase().padStart(2, '0')} ${b1.toString(16).toUpperCase().padStart(2, '0')}</b></span></div>
      <div class="bf__line"><small>byte 1 bits</small><span class="mono"><i class="k-mode">${bin.slice(0, 2)}</i> <i class="k-pid">${bin.slice(2, 4)}</i> <i class="k-data">${bin.slice(4)}</i> → ${c[0]} · ${c[1]} · ${c[2]}</span></div>`;
  }
  input.addEventListener('input', () => {
    const v = input.value.toUpperCase();
    if (/^[PCBU][0-3][0-9A-F]{3}$/.test(v)) { S.code = v; draw(); }
  });
  draw();
  return { destroy() {} };
}
