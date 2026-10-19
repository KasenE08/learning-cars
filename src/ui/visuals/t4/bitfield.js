// Bit grid decoder: one CAN frame as 8 bytes × 8 bits, a signal's bits highlighted in order,
// raw binary → raw number → physical value. Ford signals come from the community DBC (ford.js).
import { html, el } from '../../dom.js';
import { slider, chips } from '../controls.js';
import { signalBits, extractRaw, decode, insertRaw, encodeValue, toHex, fromHex } from '../../../core/can/bits.js';
import { signalByName, messageById } from '../../../core/can/ford.js';

const SAMPLE = { Veh_V_ActlBrk: 64.37, StePinComp_An_Est: -35.5, EngAout_N_Actl: 2150, ApedPos_Pc_ActlArb: 23.4, VehYaw_W_Actl: 0.12, Veh_V_ActlEng: 64.37 };
const fmtNum = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(Math.abs(v) < 10 ? 3 : 2).replace(/0+$/, '').replace(/\.$/, ''));

function sampleFrame(msg, focus) {
  const bytes = new Uint8Array(8);
  for (const s of msg.signals) {
    let v = s.name in SAMPLE ? SAMPLE[s.name] : s.name.endsWith('_D_Qf') ? 3 : s.name.endsWith('_No_Cnt') ? 9 : s.name.endsWith('_No_Cs') ? 0xa5 : s.values ? Number(Object.keys(s.values)[0]) : 0;
    if (s.name === focus?.name && !(s.name in SAMPLE) && s.values) v = Number(Object.keys(s.values).find((k) => k !== '0') ?? 0);
    insertRaw(bytes, s, s.name in SAMPLE ? encodeValue(s, v) : v);
  }
  return bytes;
}

export function mount(host, spec = {}) {
  const ford = spec.custom ? null : signalByName(spec.signal || 'Veh_V_ActlBrk');
  const msg = ford ? messageById(ford.message.id) : null;
  const S = {
    sig: ford ? { ...ford } : { name: 'signal', start: 7, length: 16, endian: 'big', signed: false, scale: 1, offset: 0, unit: '', ...spec.custom },
    bytes: spec.data ? Uint8Array.from({ length: 8 }, (_, i) => fromHex(spec.data)[i] || 0) : msg ? sampleFrame(msg, ford) : new Uint8Array([0x0f, 0xa0, 0, 0, 0, 0, 0, 0]),
  };
  const wrap = el(html`<figure class="vis bf" data-noswipe>
    <div class="bf__head">
      ${msg ? html`<span class="mono bf__id">0x${msg.id.toString(16).toUpperCase()} ${msg.name}</span><span class="bf__src">community DBC (openpilot), not from Ford</span>` : html`<span class="mono bf__id">Example signal</span>`}
    </div>
    <div class="bf__grid" role="grid" aria-label="Frame bits"></div>
    <div class="bf__bytes"></div>
    <div class="bf__out"></div>
    <div class="ctl"></div>
    <p class="vis__note">Tap a bit to flip it, or type a byte in hex. Rows are bytes 0–7; within a byte, bit 7 is on the left. Small numbers are DBC bit positions.</p>
  </figure>`);
  host.append(wrap);
  const grid = wrap.querySelector('.bf__grid'), bytesEl = wrap.querySelector('.bf__bytes'), out = wrap.querySelector('.bf__out');

  const others = () => (msg ? msg.signals.filter((s) => s.name !== S.sig.name) : []);

  function draw() {
    const order = signalBits(S.sig);
    const rank = new Map(order.map((p, i) => [p, i]));
    const otherOf = new Map();
    others().forEach((s, k) => signalBits(s).forEach((p) => otherOf.set(p, k)));
    let cells = '<span></span>' + [7, 6, 5, 4, 3, 2, 1, 0].map((b) => `<span class="bf__col mono">${b}</span>`).join('');
    for (let byte = 0; byte < 8; byte++) {
      cells += `<span class="bf__row mono">B${byte}</span>`;
      for (let bit = 7; bit >= 0; bit--) {
        const pos = byte * 8 + bit, v = (S.bytes[byte] >> bit) & 1;
        const r = rank.get(pos);
        const cls = r != null ? (r === 0 ? 'is-sig is-msb' : r === order.length - 1 ? 'is-sig is-lsb' : 'is-sig') : otherOf.has(pos) ? `is-other o${otherOf.get(pos) % 4}` : '';
        cells += `<button type="button" class="bf__c ${cls}" data-pos="${pos}" aria-label="bit ${pos} = ${v}"><b>${v}</b><i>${pos}</i></button>`;
      }
    }
    grid.innerHTML = cells;
    bytesEl.innerHTML = [...S.bytes].map((b, i) => `<label><span class="mono">B${i}</span><input class="mono" maxlength="2" value="${b.toString(16).toUpperCase().padStart(2, '0')}" data-byte="${i}" inputmode="text" autocapitalize="characters" spellcheck="false"></label>`).join('');
    const raw = extractRaw(S.bytes, S.sig);
    const bin = order.map((p) => (S.bytes[p >> 3] >> (p & 7)) & 1).join('');
    const phys = decode(S.bytes, S.sig);
    const sRaw = S.sig.signed && raw >= 2 ** (S.sig.length - 1) ? raw - 2 ** S.sig.length : raw;
    const signedNote = sRaw !== raw ? ` → signed ${sRaw}` : '';
    const label = S.sig.values?.[raw];
    out.innerHTML = `<div class="bf__line"><small>bits MSB → LSB</small><span class="mono bf__bin">${bin.replace(/(.{4})(?=.)/g, '$1 ')}</span></div>
      <div class="bf__line"><small>raw</small><span class="mono">${raw}${signedNote} <span class="muted">(0x${raw.toString(16).toUpperCase()})</span></span></div>
      <div class="bf__line bf__phys"><small>physical</small><span class="mono">${sRaw} × ${S.sig.scale} ${S.sig.offset < 0 ? '−' : '+'} ${Math.abs(S.sig.offset)} = <b>${fmtNum(phys)}</b> ${S.sig.unit === 'kph' ? 'km/h' : /^(SED|unitless)$/i.test(S.sig.unit || '') ? '' : S.sig.unit || ''}${S.sig.unit === 'kph' ? ` <span class="muted">(${fmtNum(phys / 1.609344)} mph)</span>` : ''}${label ? ` → <b>${label}</b>` : ''}</span></div>
      <div class="bf__line"><small>DBC</small><span class="mono bf__dbc">${S.sig.name} : ${S.sig.start}|${S.sig.length}@${S.sig.endian === 'big' ? 0 : 1}${S.sig.signed ? '-' : '+'} (${S.sig.scale},${S.sig.offset})</span></div>
      <div class="bf__line"><small>frame</small><span class="mono">${msg ? msg.id.toString(16).toUpperCase() : '???'}#${toHex(S.bytes)}</span></div>`;
  }

  grid.addEventListener('click', (e) => {
    const c = e.target.closest('[data-pos]');
    if (!c) return;
    const pos = Number(c.dataset.pos);
    S.bytes[pos >> 3] ^= 1 << (pos & 7);
    draw();
  });
  bytesEl.addEventListener('change', (e) => {
    const i = e.target.dataset.byte;
    if (i == null) return;
    const v = parseInt(e.target.value, 16);
    if (Number.isFinite(v) && v >= 0 && v <= 255) S.bytes[i] = v;
    draw();
  });

  if (spec.editable || spec.custom) {
    const ctl = wrap.querySelector('.ctl');
    const st = slider({ label: 'Start bit', min: 0, max: 63, value: S.sig.start, onInput(v) { S.sig.start = v; draw(); } });
    const ln = slider({ label: 'Length', min: 1, max: 32, value: S.sig.length, fmt: (v) => `${v} bits`, onInput(v) { S.sig.length = v; draw(); } });
    ctl.append(st.el, ln.el,
      chips([{ value: 'big', label: 'Motorola (big-endian)' }, { value: 'little', label: 'Intel (little-endian)' }], { value: S.sig.endian, onPick(v) { S.sig.endian = v; draw(); } }).el);
  }
  draw();
  return { destroy() {} };
}
