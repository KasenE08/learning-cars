// Lab → Connect to a car. Laptop Chrome/Edge talks to a real ELM327 over Web Serial (READ-ONLY),
// or runs the same screen against the SIMULATED car so you can see exactly what it does with no hardware.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';
import { createElm327 } from '../../core/obd/elm327.js';
import { createDemoTransport } from '../../core/obd/transport-demo.js';
import { serialSupported, requestPort, createSerialTransport } from '../../core/obd/transport-serial.js';
import { PIDS } from '../../core/obd/pids.js';

export const tab = 'lab';

export function render(view) {
  let elm = null, alive = true, pollTimer = 0, log = [];
  const supported = serialSupported();
  const screen = el(html`<div class="screen cx">
    <a class="backlink" href="#/lab">${icons.back}Lab</a>
    ${pageHead('Lab', 'Connect a car', 'Read live data, trouble codes and the VIN from a real car — strictly read-only. Laptop only (Chrome or Edge). No adapter? Run the whole thing on the simulated car.')}
    <div class="cx__body"></div>
  </div>`);
  view.append(screen);
  const body = screen.querySelector('.cx__body');

  const addLog = (e) => { log.unshift(`${e.dir === 'tx' ? '→' : '←'} ${e.text}`); log = log.slice(0, 60); const m = body.querySelector('.cx__mon pre'); if (m) m.textContent = log.join('\n'); };

  function intro() {
    body.replaceChildren(el(html`<div class="cx__intro">
      <div class="plate cx__ro"><span class="cx__robadge">${icons.check} READ-ONLY</span>
        <p>This app only ever <b>reads</b>. It can ask the car for data, trouble codes, readiness and the VIN. It will <b>never</b> clear codes, change settings, flash, or send any command that writes to the car — that's enforced in the code, not just a promise.</p></div>
      <section class="section"><h2 class="h4">Before you plug in</h2>
        <ul class="cx__pts">
          <li><b>Laptop only.</b> This uses Web Serial, which works in <b>Chrome or Edge on a computer</b>. iPhones and Safari can't do it.</li>
          <li><b>You need an adapter.</b> A cheap <b>ELM327</b> USB OBD-II adapter (see the note below). Plug it into the port under the dash, then into your laptop.</li>
          <li><b>Key on.</b> Turn the ignition to Run (engine on is fine). Park the car; don't do this while driving.</li>
          <li><b>Your Bronco has a gateway.</b> Standard OBD-II data (rpm, speed, coolant, codes, VIN) comes through fine. The raw module-to-module traffic you saw on the CAN bench mostly won't appear at the port — that's the gateway doing its job, not a broken setup.</li>
        </ul>
      </section>
      <div class="cx__start">
        ${supported
          ? html`<button class="btn btn--primary" data-connect>${icons.play} Connect adapter</button>`
          : html`<p class="cx__warn">${icons.clock} Your browser can't open a serial port${isPhone() ? ' (this is a phone)' : ''}. Open this page in <b>Chrome or Edge on a laptop</b> to connect a real adapter. You can still try the demo:</p>`}
        <button class="btn ${supported ? 'btn--ghost' : 'btn--primary'}" data-demo>Try the demo (no hardware)</button>
      </div>
      <details class="cx__hw"><summary>Which adapter should I buy?</summary>
        <div>
          <p>Any <b>ELM327</b>-based OBD-II adapter with a <b>USB</b> cable works. Two good picks:</p>
          <ul>
            <li><b>OBDLink EX</b> (~$60–70): genuine chip, fast and reliable, the one FORScan recommends for Fords.</li>
            <li>A <b>generic ELM327 USB</b> cable (~$15–25): fine for reading. Avoid Bluetooth/Wi-Fi-only ones here — this app needs a USB serial port.</li>
          </ul>
          <p class="muted">Prices change; check before buying. You don't need anything fancy for read-only data. A raw-CAN adapter (CANable) isn't needed and mostly can't see past your Bronco's gateway anyway.</p>
        </div>
      </details>
    </div>`));
    body.querySelector('[data-connect]')?.addEventListener('click', connectReal);
    body.querySelector('[data-demo]').addEventListener('click', () => start(createDemoTransport(), true));
  }

  async function connectReal() {
    const port = await requestPort();
    if (!port) { intro(); return; }
    try { const t = await createSerialTransport(port); await start(t, false); }
    catch (e) { body.prepend(el(html`<p class="cx__warn">${icons.clock} Couldn't open the adapter: ${String(e.message || e)}. Unplug and replug it, or try a different USB port.</p>`)); }
  }

  async function start(transport, demo) {
    log = [];
    body.replaceChildren(el(html`<div class="cx__connecting"><span class="kicker">${demo ? 'Starting demo…' : 'Connecting…'}</span><p class="muted">Initializing the adapter and asking which data your car supports.</p></div>`));
    elm = createElm327(transport, { onLog: addLog });
    try {
      const info = await elm.init();
      const [vin, volts, dtcs, pending, readiness] = await Promise.all([
        elm.readVin().catch(() => null), elm.readVoltage().catch(() => null),
        elm.readDtcs().catch(() => []), elm.readPendingDtcs().catch(() => []), elm.readReadiness().catch(() => null)]);
      const pids = await elm.probePids();
      if (!alive) return;
      dashboard({ info, vin, volts, dtcs, pending, readiness, pids, demo });
      poll(pids);
    } catch (e) {
      if (alive) body.replaceChildren(el(html`<div class="cx__connecting"><p class="cx__warn">Connection failed: ${String(e.message || e)}</p><button class="btn btn--ghost" data-back>Back</button></div>`)), body.querySelector('[data-back]').addEventListener('click', intro);
    }
  }

  function tileHtml(pid) { return `<div class="cx__tile" data-pid="${pid}"><span class="cx__tn">${PIDS[pid]?.name || pid}</span><b class="cx__tv mono">…</b></div>`; }

  function dashboard({ info, vin, volts, dtcs, pending, readiness, pids, demo }) {
    body.replaceChildren(el(html`<div class="cx__dash">
      <div class="cx__bar">
        ${demo ? html`<span class="t4-badge">Simulated</span>` : html`<span class="cx__live">● Live</span>`}
        <span class="cx__robadge sm">${icons.check} Read-only</span>
        <span class="muted mono cx__meta">${(info.protocol ? `ISO proto ${info.protocol}` : info.id || 'ELM327')}${volts ? ` · ${volts} V` : ''}</span>
        <button class="btn btn--ghost ex__small" data-stop>Disconnect</button>
      </div>
      ${demo ? html`<p class="cx__demo-note">Demo data from the simulated car (parked, idling). On a real car these would be live readings from your Bronco.</p>` : ''}
      <section class="section"><h2 class="h4">Live data</h2><div class="cx__tiles"></div></section>
      <section class="section"><div class="cx__row2">
        <div class="plate cx__info"><span class="kicker">Vehicle</span><div class="cx__kv"><span>VIN</span><b class="mono">${vin || '—'}</b></div><div class="cx__kv"><span>Battery</span><b class="mono">${volts ? `${volts} V` : '—'}</b></div></div>
        <div class="plate cx__codes"></div>
      </div></section>
      <section class="section"><div class="plate cx__ready"></div></section>
      <details class="cx__mon"><summary>Serial monitor (every command sent and received)</summary><pre></pre></details>
    </div>`));
    // live tiles (template interpolation above is awkward for raw html; build them directly)
    const tiles = body.querySelector('.cx__tiles');
    tiles.innerHTML = pids.map((p) => tileHtml(p)).join('') || '<p class="muted">This car didn’t answer any of the standard live PIDs.</p>';
    renderCodes({ dtcs, pending, readiness });
    body.querySelector('[data-stop]').addEventListener('click', stop);
    body.querySelector('.cx__mon pre').textContent = log.join('\n');
  }

  function renderCodes({ dtcs, pending, readiness }) {
    const codesEl = body.querySelector('.cx__codes');
    codesEl.innerHTML = `<span class="kicker">Trouble codes</span>
      ${readiness?.milOn ? '<p class="cx__mil on">⚠ Check-engine light is ON</p>' : '<p class="cx__mil">Check-engine light off</p>'}
      ${dtcs.length ? `<div class="cx__dtcs">${dtcs.map((d) => `<span class="cx__dtc">${d}</span>`).join('')}<a class="cx__how" href="#/lesson/obd-05">How to read these →</a></div>` : '<p class="muted">No stored codes.</p>'}
      ${pending.length ? `<p class="muted" style="margin-top:6px">Pending: ${pending.join(', ')}</p>` : ''}
      <button class="btn btn--ghost ex__small" data-rescan>Re-scan</button>`;
    codesEl.querySelector('[data-rescan]').addEventListener('click', async () => {
      const [d, p, r] = await Promise.all([elm.readDtcs().catch(() => []), elm.readPendingDtcs().catch(() => []), elm.readReadiness().catch(() => null)]);
      if (alive) renderCodes({ dtcs: d, pending: p, readiness: r });
    });
    const readyEl = body.querySelector('.cx__ready');
    readyEl.innerHTML = `<span class="kicker">Readiness monitors</span><p class="muted">Emissions self-tests. All “ready” is what an inspection wants (needs a full drive cycle after codes are cleared).</p>
      ${readiness ? `<div class="cx__mons">${readiness.monitors.map((m) => `<span class="cx__mon-chip ${m.ready ? 'is-ok' : 'is-wait'}">${m.ready ? '✓' : '…'} ${m.name}</span>`).join('')}</div>` : '<p class="muted">Not reported.</p>'}`;
  }

  function poll(pids) {
    if (!pids.length) return;
    let i = 0;
    const tick = async () => {
      if (!alive || !elm || elm.closed) return;
      const pid = pids[i % pids.length]; i++;
      try { const v = await elm.readPid(pid); const tile = body.querySelector(`.cx__tile[data-pid="${pid}"] .cx__tv`); if (v && tile) tile.textContent = v.text; } catch { /* ignore a dropped read */ }
      pollTimer = setTimeout(tick, 120);
    };
    tick();
  }

  async function stop() { clearTimeout(pollTimer); try { await elm?.close(); } catch { /* */ } elm = null; intro(); }

  intro();
  return () => { alive = false; clearTimeout(pollTimer); elm?.close().catch(() => {}); };
}

const isPhone = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
