// UDS (ISO 14229) service list tagged by what it does to the car, plus an example exchange.
import { html, el } from '../../dom.js';

export const SERVICES = [
  ['10', 'Diagnostic session control', 'state', 'Switch the module into a different session (default, extended, programming).'],
  ['11', 'ECU reset', 'state', 'Restart the module.'],
  ['14', 'Clear diagnostic information', 'write', 'Erase stored trouble codes (and freeze-frame data).'],
  ['19', 'Read DTC information', 'read', 'List stored and pending trouble codes and their status.'],
  ['22', 'Read data by identifier', 'read', 'Read a value by its 2-byte ID (DID), e.g. F190 = VIN.'],
  ['27', 'Security access', 'state', 'Seed/key challenge that unlocks protected services. The app never uses it.'],
  ['2E', 'Write data by identifier', 'write', 'Change a stored value or setting.'],
  ['31', 'Routine control', 'state', 'Start a built-in routine (self-test, calibration…). Can move parts.'],
  ['34', 'Request download', 'write', 'Start sending new software to the module (flashing).'],
  ['36', 'Transfer data', 'write', 'The flashing data itself.'],
  ['37', 'Request transfer exit', 'write', 'End of a flash transfer.'],
  ['3E', 'Tester present', 'state', '“Still here”: keeps a non-default session open.'],
];
const TAG = { read: ['READ', 'Reads only'], state: ['CHANGES STATE', 'Changes how the module behaves'], write: ['WRITES', 'Changes stored data or software'] };

export function mount(host, spec = {}) {
  const S = { sel: String(spec.highlight || '22').toUpperCase() };
  const wrap = el(html`<figure class="vis uds" data-noswipe>
    <ul class="uds__list">${SERVICES.map(([id, name, kind]) => html`<li><button type="button" data-id="${id}" class="uds__s k-${kind}"><b class="mono">${id}</b><span>${name}</span><em>${TAG[kind][0]}</em></button></li>`)}</ul>
    <div class="cf__info uds__info"></div>
    <div class="uds__ex mono">
      <div><small>request</small> 22 F1 90 <span class="muted">(read DID F190 = VIN)</span></div>
      <div><small>positive</small> 62 F1 90 33 46 4D … <span class="muted">(22 + 0x40 = 62, then the data)</span></div>
      <div><small>negative</small> 7F 22 31 <span class="muted">(7F = “no”, service 22, NRC 31 = request out of range)</span></div>
    </div>
    <p class="vis__note">The app’s live-car mode (Lab → Connect a car) is read-only: it will only ever ask for data (like OBD-II modes 01, 03 and 09 or UDS read services) and never send writes, resets, routines, security access or flashing services.</p>
  </figure>`);
  host.append(wrap);
  function draw() {
    wrap.querySelectorAll('.uds__s').forEach((b) => b.classList.toggle('is-sel', b.dataset.id === S.sel));
    const s = SERVICES.find((x) => x[0] === S.sel) || SERVICES[4];
    wrap.querySelector('.uds__info').innerHTML = `<b>0x${s[0]} · ${s[1]}</b> <span class="mono muted">${TAG[s[2]][1]}</span><p>${s[3]} Positive reply = 0x${(parseInt(s[0], 16) + 0x40).toString(16).toUpperCase()}.</p>`;
  }
  wrap.querySelector('.uds__list').addEventListener('click', (e) => { const b = e.target.closest('[data-id]'); if (b) { S.sel = b.dataset.id; draw(); } });
  draw();
  return { destroy() {} };
}
