// SAE J1962 16-pin OBD-II connector (looking into the car's socket), tappable pins.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';

export const PINS = {
  1: ['Manufacturer use', 'Not standardized; carmakers use it for their own buses or features.', 'mfr'],
  2: ['J1850 bus +', 'SAE J1850 (PWM and VPW), the older Ford/GM protocols.', 'j1850'],
  3: ['Manufacturer use', 'Not standardized. On many Fords it carries the medium-speed CAN high line (commonly reported by Ford tool users).', 'mfr'],
  4: ['Chassis ground', 'Ground to the car body.', 'power'],
  5: ['Signal ground', 'Clean ground reference for the signals.', 'power'],
  6: ['CAN high', 'ISO 15765-4 CAN_H. The required OBD protocol on US cars from model year 2008.', 'can'],
  7: ['K-line', 'ISO 9141-2 / ISO 14230-4 (KWP2000) single-wire serial line.', 'kline'],
  8: ['Manufacturer use', 'Not standardized.', 'mfr'],
  9: ['Manufacturer use', 'Not standardized.', 'mfr'],
  10: ['J1850 bus −', 'SAE J1850 PWM only (the second wire of the pair).', 'j1850'],
  11: ['Manufacturer use', 'Not standardized. On many Fords it carries the medium-speed CAN low line (commonly reported).', 'mfr'],
  12: ['Manufacturer use', 'Not standardized.', 'mfr'],
  13: ['Manufacturer use', 'Not standardized.', 'mfr'],
  14: ['CAN low', 'ISO 15765-4 CAN_L. Pairs with pin 6.', 'can'],
  15: ['L-line', 'Optional second line for ISO 9141-2 / ISO 14230-4.', 'kline'],
  16: ['Battery +12 V', 'Unswitched battery power: adapters run from it even with the car off (and can slowly drain the battery if left plugged in).', 'power'],
};
const COLOR = { can: '#ff6b1a', power: '#ff4d3d', kline: '#7fb2e0', j1850: '#c9a3e8', mfr: '#5b6470' };

export function mount(host, spec = {}) {
  const S = { hi: spec.highlight || null, sel: 16 };
  const wrap = el(html`<figure class="vis op" data-noswipe>
    <svg viewBox="0 0 340 170" class="d" role="img" aria-label="OBD-II connector pinout"></svg>
    <div class="cf__info op__info"></div>
    <div class="ctl"></div>
    <p class="vis__note">The socket under the dash, seen from the driver’s seat looking in. Pins 1–8 on top, 9–16 on the bottom. Which protocol a car uses is chosen by the carmaker; a 2024 Bronco Sport uses CAN (pins 6 and 14) for OBD-II.</p>
  </figure>`);
  host.append(wrap);
  const svg = wrap.querySelector('svg'), info = wrap.querySelector('.op__info');
  function draw() {
    let g = `<path d="M20,22 H320 L296,148 H44 Z" fill="#14171a" stroke="#5b6470" stroke-width="3" stroke-linejoin="round"/>`;
    for (let n = 1; n <= 16; n++) {
      const row = n <= 8 ? 0 : 1, col = (n - 1) % 8;
      const x = 52 + col * 34 + (row ? 6 : 0), y = row ? 108 : 52;
      const [, , kind] = PINS[n];
      const lit = S.hi ? kind === S.hi : kind !== 'mfr';
      g += `<g data-pin="${n}" style="cursor:pointer"><rect x="${x - 12}" y="${y - 16}" width="24" height="32" rx="4" fill="${lit ? COLOR[kind] : '#262b31'}" fill-opacity="${lit ? 0.35 : 1}" stroke="${n === S.sel ? '#ebe8e2' : lit ? COLOR[kind] : '#3a424c'}" stroke-width="${n === S.sel ? 2.5 : 1}"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" class="awd-lbl">${n}</text></g>`;
    }
    svg.innerHTML = g;
    const [name, text, kind] = PINS[S.sel];
    info.innerHTML = `<b style="color:${COLOR[kind]}">Pin ${S.sel}: ${name}</b><p>${text}</p>`;
  }
  svg.addEventListener('click', (e) => { const p = e.target.closest('[data-pin]'); if (p) { S.sel = Number(p.dataset.pin); draw(); } });
  wrap.querySelector('.ctl').append(chips([{ value: null, label: 'Standard pins' }, { value: 'can', label: 'CAN' }, { value: 'power', label: 'Power' }, { value: 'kline', label: 'K/L-line' }, { value: 'j1850', label: 'J1850' }], { value: S.hi, onPick(v) { S.hi = v; draw(); } }).el);
  draw();
  return { destroy() {} };
}
