// Counters, checksums and MACs. `ford`: 0x415 BrakeSysFeatures with openpilot's documented Ford checksum.
// `mac`: the SecOC idea (secret key + freshness counter) with a TOY MAC for illustration (real SecOC uses AES-CMAC).
import { html, el } from '../../dom.js';
import { slider } from '../controls.js';
import { messageById, CHECKSUM_FIELDS } from '../../../core/can/ford.js';
import { insertRaw, encodeValue, extractRaw, toHex } from '../../../core/can/bits.js';
import { fordChecksum } from '../../../core/can/sim.js';

const MSG = messageById(0x415);
const sig = (n) => MSG.signals.find((s) => s.name === n);
const KEY = 0x5ec0de;

function frameFor(kph, cnt) {
  const b = new Uint8Array(8);
  insertRaw(b, sig('Veh_V_ActlBrk'), encodeValue(sig('Veh_V_ActlBrk'), kph));
  insertRaw(b, sig('VehVActlBrk_No_Cnt'), cnt);
  insertRaw(b, sig('VehVActlBrk_D_Qf'), 3);
  insertRaw(b, sig('VehVActlBrk_No_Cs'), fordChecksum(b, MSG, CHECKSUM_FIELDS[0x415]));
  return b;
}
/** Toy keyed hash (FNV-1a over key + bytes), 24 bits. Illustration only: NOT cryptographically secure. */
function toyMac(key, bytes) {
  let h = 0x811c9dc5 ^ key;
  for (const x of bytes) { h ^= x; h = Math.imul(h, 0x01000193) >>> 0; }
  return (h ^ (h >>> 24)) & 0xffffff;
}

export function mount(host, spec = {}) {
  const mode = spec.mode === 'mac' ? 'mac' : 'ford';
  const S = { kph: 64.37, cnt: 0, fresh: 100, log: [], lastAccepted: -1, lastFresh: 99, history: [] };
  const wrap = el(html`<figure class="vis cks" data-noswipe>
    <div class="cd__top">${mode === 'ford' ? html`<span class="mono bf__id">0x415 BrakeSysFeatures</span><span class="bf__src">community DBC + openpilot's checksum formula</span>` : html`<span class="t4-badge">Concept</span><span>Message authentication (SecOC idea)</span>`}</div>
    <div class="cks__frame mono"></div>
    <div class="cks__math"></div>
    <div class="cks__bar"></div>
    <ol class="cks__log"></ol>
    <div class="ctl"></div>
    <p class="vis__note"></p>
  </figure>`);
  host.append(wrap);
  const frameEl = wrap.querySelector('.cks__frame'), math = wrap.querySelector('.cks__math'), logEl = wrap.querySelector('.cks__log'), note = wrap.querySelector('.vis__note');

  const build = () => {
    const b = frameFor(S.kph, S.cnt);
    if (mode === 'mac') return { data: b, fresh: S.fresh, mac: toyMac(KEY, [...b, S.fresh & 0xff]) };
    return { data: b };
  };

  function receive(f, label) {
    let ok = true, why = 'accepted';
    if (mode === 'ford') {
      const cs = extractRaw(f.data, sig('VehVActlBrk_No_Cs'));
      const want = fordChecksum(f.data, MSG, CHECKSUM_FIELDS[0x415]);
      const cnt = extractRaw(f.data, sig('VehVActlBrk_No_Cnt'));
      if (cs !== want) { ok = false; why = `checksum ${cs.toString(16).toUpperCase()} ≠ ${want.toString(16).toUpperCase()}: corrupted, ignored`; }
      else if (S.lastAccepted >= 0 && cnt !== (S.lastAccepted + 1) % 16) { ok = false; why = `counter ${cnt} after ${S.lastAccepted}: stale or repeated, ignored`; }
      if (ok) S.lastAccepted = cnt;
    } else {
      const want = toyMac(KEY, [...f.data, f.fresh & 0xff]);
      if (f.mac !== want) { ok = false; why = 'MAC wrong: altered or forged without the key, rejected'; }
      else if (f.fresh <= S.lastFresh) { ok = false; why = `freshness ${f.fresh} not newer than ${S.lastFresh}: replay, rejected`; }
      if (ok) S.lastFresh = f.fresh;
    }
    S.log.unshift({ label, ok, why, hex: toHex(f.data) + (mode === 'mac' ? ` · F=${f.fresh} · MAC=${f.mac.toString(16).toUpperCase().padStart(6, '0')}` : '') });
    S.log = S.log.slice(0, 5);
    draw();
  }

  function draw() {
    const f = build();
    const fields = mode === 'ford' ? CHECKSUM_FIELDS[0x415].map((n) => { const v = extractRaw(f.data, sig(n)); return { n, v, t: v + (v >> 8) }; }) : [];
    const sum = fields.reduce((a, x) => a + x.t, 0);
    frameEl.innerHTML = `<span class="cks__id">415#</span>${toHex(f.data).match(/../g).map((h, i) => `<span class="${mode === 'ford' && i === 3 ? 'is-cs' : mode === 'ford' && i === 2 ? 'is-cnt' : i < 2 ? 'is-val' : ''}">${h}</span>`).join('')}${mode === 'mac' ? `<span class="cks__plus"> + F ${f.fresh} + MAC ${f.mac.toString(16).toUpperCase().padStart(6, '0')}</span>` : ''}`;
    math.innerHTML = mode === 'ford'
      ? `<div class="bf__line"><small>speed</small><span class="mono">${S.kph.toFixed(2)} km/h (${(S.kph / 1.609344).toFixed(1)} mph) · counter ${S.cnt}</span></div>
         <div class="bf__line"><small>checksum</small><span class="mono">${fields.map((x) => `${x.v}+(${x.v}>>8)`).join(' + ')} = ${sum} → NOT → low byte = <b>0x${(~sum & 0xff).toString(16).toUpperCase()}</b></span></div>`
      : `<div class="bf__line"><small>sender</small><span class="mono">MAC = f(secret key, data, freshness ${f.fresh})</span></div>
         <div class="bf__line"><small>receiver</small><span class="mono">recomputes MAC with the same key; checks freshness &gt; ${S.lastFresh}</span></div>`;
    logEl.innerHTML = S.log.map((l) => `<li class="${l.ok ? 'is-ok' : 'is-bad'}"><b>${l.label}</b> <span class="mono">${l.hex}</span><br><span>${l.ok ? '✓' : '✗'} ${l.why}</span></li>`).join('');
  }

  const bar = wrap.querySelector('.cks__bar');
  const btn = (label, fn, primary) => { const b = el(html`<button type="button" class="btn ${primary ? 'btn--primary' : 'btn--ghost'} ex__small">${label}</button>`); b.onclick = fn; bar.append(b); };
  let lastSent = null;
  btn('Send next frame', () => {
    const f = build(); lastSent = f; receive(f, mode === 'ford' ? `#${S.cnt}` : `F${S.fresh}`);
    S.cnt = (S.cnt + 1) % 16; S.fresh++; draw();
  }, true);
  btn('Flip a speed bit', () => {
    const f = build(); f.data[1] ^= 0x04; receive(f, 'tampered');
    S.cnt = (S.cnt + 1) % 16; S.fresh++;
  });
  btn('Replay last frame', () => { if (lastSent) receive({ ...lastSent, data: lastSent.data.slice() }, 'replayed'); });
  if (mode === 'ford') btn('Attacker recomputes checksum', () => {
    // the attacker watches the bus, so it knows the next counter value and the public checksum formula
    const next = (S.lastAccepted + 1) % 16;
    receive({ data: frameFor(S.kph + 30, next) }, 'forged (+30 km/h)'); S.cnt = (next + 1) % 16;
  });
  else btn('Attacker forges (no key)', () => {
    const f = build(); f.data[1] ^= 0x04; f.mac = toyMac(0x123456, [...f.data, f.fresh & 0xff]); receive(f, 'forged'); S.fresh++;
  });
  wrap.querySelector('.ctl').append(slider({ label: 'Speed', min: 0, max: 180, step: 0.5, value: S.kph, fmt: (v) => `${v} km/h`, onInput(v) { S.kph = v; draw(); } }).el);
  note.textContent = mode === 'ford'
    ? 'A checksum and counter catch corrupted, dropped or repeated frames. They are NOT security: the formula is public, so a forged frame with a recomputed checksum and the next counter value is accepted.'
    : 'Toy MAC for illustration only (real AUTOSAR SecOC uses a cryptographic MAC such as AES-CMAC, usually truncated). Without the secret key a forger can’t make a valid MAC, and the freshness value stops replays.';
  draw();
  return { destroy() {} };
}
