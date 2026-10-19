// A real classic CAN data frame, bit by bit: fields, CRC-15 (Bosch CAN 2.0 polynomial 0x4599) and stuff bits.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';
import { fromHex, toHex } from '../../../core/can/bits.js';

export const FIELDS = {
  sof: ['Start of frame', 'One dominant (0) bit. Every node syncs its clock to this falling edge.'],
  id: ['Identifier', 'Names the message (not the sender) and sets its priority: lower ID wins arbitration.'],
  srr: ['SRR', 'Substitute remote request (extended frames): always recessive (1).'],
  ide: ['IDE', 'Identifier extension: 0 = standard 11-bit ID, 1 = extended 29-bit ID.'],
  eid: ['Extended ID', 'The other 18 bits of a 29-bit ID.'],
  rtr: ['RTR', 'Remote transmission request: 0 for a normal data frame.'],
  r: ['Reserved', 'Reserved bit(s), sent dominant (0).'],
  dlc: ['DLC', 'Data length code: how many data bytes follow (0–8 in classic CAN).'],
  data: ['Data', 'The payload: 0–8 bytes. Signals are packed in here (see the DBC lessons).'],
  crc: ['CRC-15', 'Checksum over everything from SOF through data, so receivers can detect corrupted bits.'],
  crcd: ['CRC delimiter', 'Always recessive (1).'],
  ack: ['ACK slot', 'The sender transmits 1; every receiver that got the frame intact pulls it to 0. No ACK = error.'],
  ackd: ['ACK delimiter', 'Always recessive (1).'],
  eof: ['End of frame', 'Seven recessive bits. Bit stuffing is off here so this pattern is unmistakable.'],
};

const bitsOf = (v, n) => Array.from({ length: n }, (_, i) => (v >> (n - 1 - i)) & 1);

export function crc15(bits) {
  let crc = 0;
  for (const b of bits) {
    const nxt = b ^ ((crc >> 14) & 1);
    crc = (crc << 1) & 0x7fff;
    if (nxt) crc ^= 0x4599;
  }
  return crc;
}

/** Build the frame: returns [{ bit, field, stuff? }] including stuff bits, and the CRC. */
export function buildFrame(id, data, extended = false) {
  const seq = [];
  const push = (field, arr) => arr.forEach((bit) => seq.push({ bit, field }));
  push('sof', [0]);
  if (extended) {
    push('id', bitsOf(id >>> 18, 11)); push('srr', [1]); push('ide', [1]); push('eid', bitsOf(id & 0x3ffff, 18));
    push('rtr', [0]); push('r', [0, 0]);
  } else { push('id', bitsOf(id, 11)); push('rtr', [0]); push('ide', [0]); push('r', [0]); }
  push('dlc', bitsOf(data.length, 4));
  data.forEach((b) => push('data', bitsOf(b, 8)));
  const crc = crc15(seq.map((s) => s.bit));
  push('crc', bitsOf(crc, 15));
  // stuffing: after 5 equal bits in a row (SOF..CRC), insert the opposite bit
  const out = [];
  let run = 0, last = -1;
  for (const s of seq) {
    out.push(s);
    run = s.bit === last ? run + 1 : 1; last = s.bit;
    if (run === 5) { const sb = 1 - s.bit; out.push({ bit: sb, field: s.field, stuff: true }); last = sb; run = 1; }
  }
  out.push({ bit: 1, field: 'crcd' }, { bit: 0, field: 'ack' }, { bit: 1, field: 'ackd' });
  for (let i = 0; i < 7; i++) out.push({ bit: 1, field: 'eof' });
  return { bits: out, crc };
}

export function mount(host, spec = {}) {
  const S = { id: spec.id ?? 0x415, data: spec.data ? [...fromHex(spec.data)].slice(0, 8) : [0x19, 0x25, 0xc0, 0xbe, 0, 0, 0, 0], ext: !!spec.extended, sel: 'id' };
  const wrap = el(html`<figure class="vis cf" data-noswipe>
    <div class="cf__bits mono"></div>
    <div class="cf__info"></div>
    <div class="cf__inputs">
      <label><span>ID (hex)</span><input class="mono" data-k="id" spellcheck="false" autocapitalize="characters"></label>
      <label><span>Data (hex, 0–8 bytes)</span><input class="mono" data-k="data" spellcheck="false" autocapitalize="characters"></label>
    </div>
    <div class="big-out"></div>
    <div class="ctl"></div>
    <p class="vis__note">Real CAN 2.0 framing: the CRC is computed with the standard polynomial and stuff bits (striped) are inserted after five identical bits. ACK shown as a receiver pulled it to 0.</p>
  </figure>`);
  host.append(wrap);
  const bitsEl = wrap.querySelector('.cf__bits'), info = wrap.querySelector('.cf__info'), out = wrap.querySelector('.big-out');
  const idIn = wrap.querySelector('[data-k=id]'), dataIn = wrap.querySelector('[data-k=data]');

  function draw() {
    const { bits, crc } = buildFrame(S.id, S.data, S.ext);
    let prev = '';
    bitsEl.innerHTML = bits.map((b) => {
      const start = b.field !== prev; prev = b.field;
      return `<span class="cf__b f-${b.field} ${b.stuff ? 'is-stuff' : ''} ${b.field === S.sel ? 'is-sel' : ''} ${start ? 'is-start' : ''}" data-f="${b.field}">${b.bit}</span>`;
    }).join('');
    const [name, text] = FIELDS[S.sel];
    const n = bits.filter((b) => b.field === S.sel && !b.stuff).length;
    info.innerHTML = `<b>${name}</b> <span class="mono muted">(${n} bit${n === 1 ? '' : 's'})</span><p>${text}</p>`;
    const stuff = bits.filter((b) => b.stuff).length;
    out.innerHTML = String(html`<span class="ro"><small>Frame bits</small><b>${bits.length}</b></span><span class="ro"><small>Stuff bits</small><b>${stuff}</b></span>
      <span class="ro"><small>CRC-15</small><b class="mono">0x${crc.toString(16).toUpperCase().padStart(4, '0')}</b></span>
      <span class="ro ro--hl"><small>At 500 kbit/s</small><b>${(bits.length * 2).toFixed(0)} µs</b></span>`);
    idIn.value = S.id.toString(16).toUpperCase();
    dataIn.value = toHex(Uint8Array.from(S.data));
  }

  bitsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (b) { S.sel = b.dataset.f; draw(); } });
  idIn.addEventListener('change', () => {
    const v = parseInt(idIn.value, 16);
    if (Number.isFinite(v) && v >= 0 && v <= (S.ext ? 0x1fffffff : 0x7ff)) S.id = v;
    draw();
  });
  dataIn.addEventListener('change', () => {
    const clean = dataIn.value.replace(/[^0-9a-f]/gi, '');
    if (clean.length % 2 === 0 && clean.length <= 16) S.data = [...fromHex(clean)];
    draw();
  });
  wrap.querySelector('.ctl').append(chips([{ value: false, label: 'Standard 11-bit' }, { value: true, label: 'Extended 29-bit' }], { value: S.ext, onPick(v) { S.ext = v; if (!v) S.id &= 0x7ff; draw(); } }).el);
  draw();
  return { destroy() {} };
}
