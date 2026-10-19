// ISO-TP (ISO 15765-2) multi-frame transfer of a VIN (OBD Mode 09 PID 02). Made-up VIN, valid check digit.
import { html, el } from '../../dom.js';

const h2 = (n) => n.toString(16).toUpperCase().padStart(2, '0');
const VAL = (c) => ('0123456789'.includes(c) ? Number(c) : { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 }[c]);
const W = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
export function withCheckDigit(v) {
  const sum = [...v].reduce((a, c, i) => a + (i === 8 ? 0 : VAL(c) * W[i]), 0) % 11;
  return v.slice(0, 8) + (sum === 10 ? 'X' : String(sum)) + v.slice(9);
}
export const VIN = withCheckDigit('3FMCR9B60RRA12345');

export function frames(vin = VIN) {
  const payload = [0x49, 0x02, 0x01, ...[...vin].map((c) => c.charCodeAt(0))];
  const out = [{ id: '7DF', from: 'tool', bytes: [0x02, 0x09, 0x02], kind: 'single', note: 'Single frame request: 2 bytes follow (mode 09, PID 02 = VIN).' }];
  out.push({ id: '7E8', from: 'ecu', bytes: [0x10, payload.length, ...payload.slice(0, 6)], kind: 'first', note: `First frame: “1” = first frame, length 0x${h2(payload.length)} = ${payload.length} bytes total. 6 data bytes fit here.` });
  out.push({ id: '7E0', from: 'tool', bytes: [0x30, 0x00, 0x00], kind: 'flow', note: 'Flow control from the tool: 30 = clear to send, block size 0 (send everything), minimum gap 0 ms.' });
  let i = 6, n = 1;
  while (i < payload.length) {
    const chunk = payload.slice(i, i + 7);
    out.push({ id: '7E8', from: 'ecu', bytes: [0x20 | (n & 15), ...chunk], kind: 'cons', note: `Consecutive frame ${n}: 0x2${n & 15} = “2” (consecutive) + sequence number ${n & 15}. 7 data bytes.` });
    i += 7; n++;
  }
  return { list: out, payload };
}

export function mount(host) {
  const { list, payload } = frames();
  const S = { k: 0 };
  const wrap = el(html`<figure class="vis itp" data-noswipe>
    <div class="itp__frames mono"></div>
    <p class="itp__note"></p>
    <div class="bf__line"><small>reassembled</small><span class="mono itp__buf"></span></div>
    <div class="bf__line"><small>as text</small><span class="mono itp__txt"></span></div>
    <div class="cks__bar"><button type="button" class="btn btn--primary ex__small" data-fnext>Next frame</button><button type="button" class="btn btn--ghost ex__small" data-reset>Restart</button></div>
    <p class="vis__note">A made-up VIN with a valid check digit. A CAN frame holds only 8 bytes, so ISO-TP splits longer messages: the first byte of each frame (the PCI) says what kind of frame it is.</p>
  </figure>`);
  host.append(wrap);
  function draw() {
    const shown = list.slice(0, S.k + 1);
    wrap.querySelector('.itp__frames').innerHTML = shown.map((f, i) => `<div class="itp__f from-${f.from} ${i === S.k ? 'is-now' : ''}"><b>${f.id}</b> <i class="pci">${h2(f.bytes[0])}${f.kind === 'first' ? ' ' + h2(f.bytes[1]) : ''}</i> ${f.bytes.slice(f.kind === 'first' ? 2 : 1).map((b) => `<span>${h2(b)}</span>`).join(' ')}<em>${f.from === 'tool' ? 'tool → car' : 'car → tool'}</em></div>`).join('');
    wrap.querySelector('.itp__note').textContent = list[S.k].note;
    let got = [];
    for (const f of shown) { if (f.kind === 'first') got.push(...f.bytes.slice(2)); if (f.kind === 'cons') got.push(...f.bytes.slice(1)); }
    got = got.slice(0, payload.length);
    wrap.querySelector('.itp__buf').textContent = got.length ? got.map(h2).join(' ') : '–';
    const vin = got.slice(3).map((c) => String.fromCharCode(c)).join('');
    wrap.querySelector('.itp__txt').innerHTML = got.length > 3 ? `49 02 01 = reply to 09 02, 1 item · VIN: <b>${vin}</b>${vin.length === 17 ? ' ✓ 17 characters' : '…'}` : '–';
    wrap.querySelector('[data-fnext]').disabled = S.k >= list.length - 1;
  }
  wrap.querySelector('[data-fnext]').onclick = () => { if (S.k < list.length - 1) { S.k++; draw(); } };
  wrap.querySelector('[data-reset]').onclick = () => { S.k = 0; draw(); };
  draw();
  return { destroy() {} };
}
