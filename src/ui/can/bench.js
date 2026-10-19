// The CAN bench: drive a SIMULATED Bronco-Sport-like car and watch its bus.
// Real message layouts (community openpilot DBC), made-up values from a simple model.
// Used full-size on Lab → CAN bench and as a compact `canbench` visual inside lessons.
import { html, el } from '../dom.js';
import { createCar } from '../../core/can/sim.js';
import { MESSAGES, messageById } from '../../core/can/ford.js';
import { decode, extractRaw, toHex } from '../../core/can/bits.js';
import { toCandump, toSavvyCsv, parseCapture } from '../../core/can/formats.js';
import { saveCapture, listCaptures, deleteCapture, onCaptures } from '../../core/captures.js';
import { profile } from '../visuals/t4/capdiff.js';

const hex = (n, w = 3) => n.toString(16).toUpperCase().padStart(w, '0');
const LEVERS = ['P', 'R', 'N', 'D'];
const LIGHTS = [['Off', 0], ['Park', 1], ['On', 2], ['Auto', 3]];
const WIPERS = [['Off', 0], ['Int', 4], ['Low', 5], ['High', 6]]; // Ford WiprFront_D_Stat values
const IGN = [['Off', 1], ['Acc', 2], ['Run', 4], ['Start', 8]];
const DOORS = [['drv', 'Driver'], ['psg', 'Passenger'], ['rl', 'Rear L'], ['rr', 'Rear R'], ['tgate', 'Tailgate']];
const ALL_CONTROLS = ['pedals', 'steer', 'shifter', 'turn', 'lights', 'wipers', 'doors', 'belt', 'parkbrake', 'ignition'];
const KEYS_HELP = 'W/↑ gas · S/↓ brake · A D/← → steer · P R N, Shift+D shift (hold brake to leave P) · Q/E turn signals · L lights · K wipers · F flash high beams · 1–5 doors · B seatbelt · Space parking brake · I ignition';

function download(name, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function gauge(cx, cy, r, value, max, label, unit, sub, redFrom) {
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2;
  const ang = (v) => a0 + (Math.min(max, Math.max(0, v)) / max) * (a1 - a0);
  const pt = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  const arc = (from, to, rr) => `M${pt(ang(from), rr)} A${rr},${rr} 0 ${ang(to) - ang(from) > Math.PI ? 1 : 0} 1 ${pt(ang(to), rr)}`;
  return `<path d="${arc(0, max, r)}" fill="none" stroke="#262b31" stroke-width="8" stroke-linecap="round"/>
    ${redFrom ? `<path d="${arc(redFrom, max, r)}" fill="none" stroke="#ff4d3d" stroke-opacity="0.6" stroke-width="8"/>` : ''}
    <path d="${arc(0, Math.max(0.001, value), r)}" fill="none" stroke="#ff6b1a" stroke-width="8" stroke-linecap="round"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" class="bn-num">${label}</text>
    <text x="${cx}" y="${cy + 20}" text-anchor="middle" class="awd-sub">${unit}</text>
    ${sub ? `<text x="${cx}" y="${cy + 33}" text-anchor="middle" class="awd-sub">${sub}</text>` : ''}`;
}

/**
 * opts: { compact?, controls?: [...ALL_CONTROLS subset], view?: 'log'|'table'|'decode', ids?: [numbers],
 *         names?: boolean, record?: boolean, keyboard?: boolean }
 */
export function mountBench(host, opts = {}) {
  const compact = !!opts.compact;
  const controls = new Set(opts.controls || ALL_CONTROLS);
  const car = createCar({ full: true, seed: (Date.now() % 100000) + 1 });
  const inp = car.inputs;
  const S = {
    view: opts.view || 'table', names: !!opts.names, paused: false, filter: opts.ids ? new Set(opts.ids) : null,
    gasHeld: false, gasAmt: 40, keys: new Set(), sel: opts.ids?.[0] ?? 0x415, rec: null, replay: null, msg: '',
  };
  const table = new Map(); // id → { data, count, times: [], changed[8] }
  const log = [];
  let raf = 0, last = 0, lastPaint = 0, lastDash = 0, simT = 0;

  const wrap = el(html`<div class="bn ${compact ? 'bn--compact' : ''}" data-noswipe>
    <div class="bn__grid">
      <section class="bn__car">
        <div class="cd__top"><span class="t4-badge">Simulated</span><span class="bn__status muted"></span></div>
        <svg viewBox="0 0 340 128" class="d bn__dash" role="img" aria-label="Dashboard"></svg>
        <div class="bn__tell"></div>
        <p class="bn__msg" role="status"></p>
      </section>
      <section class="bn__controls">
        <div class="bn__ctl"></div>
        ${!compact && opts.keyboard !== false ? html`<details class="bn__keys"><summary>Keyboard (laptop)</summary><p class="mono">${KEYS_HELP}</p></details>` : ''}
      </section>
      <section class="bn__bus">
        <div class="bn__tabs"></div>
        <div class="bn__opts">
          ${!compact ? html`<label class="bn__filter"><span>IDs</span><input class="mono" placeholder="all (e.g. 83 3B3)" spellcheck="false" autocapitalize="characters"></label>` : ''}
          <button type="button" class="pchip" data-pause>Pause view</button>
          <button type="button" class="pchip ${S.names ? 'is-on' : ''}" data-names>Names</button>
        </div>
        <div class="cd__screen mono bn__screen"></div>
        ${!compact ? html`<p class="vis__note">“Names” and “Decode” use the community openpilot Ford DBC: they’re the answer key, so leave them off while you do the challenges.</p>` : ''}
      </section>
    </div>
    ${opts.record !== false && !compact ? html`<section class="bn__rec">
      <div class="bn__recbar"><button type="button" class="btn btn--primary ex__small" data-rec>● Record</button><span class="mono bn__rect"></span>
        <label class="btn btn--ghost ex__small bn__import">Import file<input type="file" accept=".log,.csv,.txt" hidden></label></div>
      <ul class="bn__caps"></ul>
      <div class="bn__cmp"></div>
    </section>` : ''}
  </div>`);
  host.append(wrap);
  const $ = (s) => wrap.querySelector(s);
  const dash = $('.bn__dash'), screen = $('.bn__screen'), tell = $('.bn__tell'), msgEl = $('.bn__msg'), statusEl = $('.bn__status');
  const say = (t) => { S.msg = t; msgEl.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => { msgEl.textContent = ''; }, 3500); };

  // ---------- controls ----------
  const ctl = $('.bn__ctl');
  const chipRow = (label, items, cur, onPick, key) => {
    const row = el(html`<div class="bn__row"><span>${label}</span><div class="ctl__chips">${items.map(([t, v]) => html`<button type="button" class="pchip ${v === cur ? 'is-on' : ''}" data-v="${v}">${t}</button>`)}</div></div>`);
    row.addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; onPick(isNaN(b.dataset.v) ? b.dataset.v : Number(b.dataset.v)); syncControls(); });
    row.dataset.key = key;
    return row;
  };
  function buildControls() {
    ctl.replaceChildren();
    if (controls.has('pedals')) {
      const p = el(html`<div class="bn__pedals">
        <button type="button" class="bn__pedal bn__brake" data-hold="brake">BRAKE</button>
        <button type="button" class="bn__pedal bn__gas" data-hold="gas">GAS</button>
      </div>`);
      ctl.append(p);
      const amt = el(html`<label class="ctl__row"><span>Gas amount</span><input class="rng" type="range" min="5" max="100" value="${S.gasAmt}"><output class="mono">${S.gasAmt}%</output></label>`);
      amt.querySelector('input').addEventListener('input', (e) => { S.gasAmt = Number(e.target.value); amt.querySelector('output').textContent = `${S.gasAmt}%`; e.target.style.setProperty('--p', `${((S.gasAmt - 5) / 95) * 100}%`); });
      amt.querySelector('input').style.setProperty('--p', `${((S.gasAmt - 5) / 95) * 100}%`);
      ctl.append(amt);
      const hold = (b, on) => { if (b.dataset.hold === 'gas') S.gasHeld = on; else S.brakeHeld = on; b.classList.toggle('is-down', on); };
      p.querySelectorAll('[data-hold]').forEach((b) => {
        b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture?.(e.pointerId); } catch { /* synthetic event */ } hold(b, true); });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => b.addEventListener(t, () => hold(b, false)));
        b.addEventListener('contextmenu', (e) => e.preventDefault());
      });
    }
    if (controls.has('steer')) {
      const st = el(html`<label class="ctl__row"><span>Steering</span><input class="rng" type="range" min="-540" max="540" step="5" value="${inp.steer}" data-steer><output class="mono"></output></label>`);
      st.querySelector('input').addEventListener('input', (e) => { inp.steer = Number(e.target.value); syncControls(); });
      st.addEventListener('dblclick', () => { inp.steer = 0; syncControls(); });
      ctl.append(st);
    }
    if (controls.has('shifter')) ctl.append(chipRow('Gear', LEVERS.map((l) => [l, l]), inp.lever, shift, 'lever'));
    if (controls.has('turn')) ctl.append(chipRow('Turn signal', [['◀ Left', 1], ['Off', 0], ['Right ▶', 2]], inp.turn, (v) => { inp.turn = v; }, 'turn'));
    if (controls.has('lights')) ctl.append(chipRow('Headlights', LIGHTS, inp.headlights, (v) => { inp.headlights = v; }, 'headlights'));
    if (controls.has('wipers')) ctl.append(chipRow('Wipers', WIPERS, inp.wipers, (v) => { inp.wipers = v; }, 'wipers'));
    if (controls.has('doors')) {
      const row = el(html`<div class="bn__row"><span>Doors</span><div class="ctl__chips">${DOORS.map(([k, t]) => html`<button type="button" class="pchip" data-door="${k}">${t}</button>`)}</div></div>`);
      row.addEventListener('click', (e) => { const b = e.target.closest('[data-door]'); if (!b) return; toggleDoor(b.dataset.door); });
      row.dataset.key = 'doors';
      ctl.append(row);
    }
    const misc = [];
    if (controls.has('belt')) misc.push(['belt', 'Seatbelt']);
    if (controls.has('parkbrake')) misc.push(['park', 'Parking brake']);
    if (controls.has('lights')) misc.push(['flash', 'Flash high beams']);
    if (misc.length) {
      const row = el(html`<div class="bn__row"><span>Other</span><div class="ctl__chips">${misc.map(([k, t]) => html`<button type="button" class="pchip" data-misc="${k}">${t}</button>`)}</div></div>`);
      row.addEventListener('click', (e) => {
        const k = e.target.closest('[data-misc]')?.dataset.misc;
        if (k === 'belt') inp.belt = inp.belt ? 0 : 1;
        if (k === 'park') inp.parkBrake = !inp.parkBrake;
        if (k === 'flash') { inp.highBeam = 1; setTimeout(() => { inp.highBeam = 0; syncControls(); }, 700); }
        syncControls();
      });
      row.dataset.key = 'misc';
      ctl.append(row);
    }
    if (controls.has('ignition')) ctl.append(chipRow('Ignition', IGN, inp.ignition, (v) => { if (v === 8 && inp.ignition === 4) return say('Engine is already running.'); inp.ignition = v; }, 'ignition'));
    syncControls();
  }
  function shift(l) {
    if (inp.lever === 'P' && l !== 'P' && !inp.brake) { say('Hold the brake to shift out of Park (like the real truck).'); return; }
    if (car.state.kph > 8 && (l === 'R' || l === 'P') && inp.lever !== l) { say('Stop first: the transmission won’t let you shift into Reverse or Park while moving.'); return; }
    inp.lever = l;
  }
  function toggleDoor(k) { inp.doors = { ...inp.doors, [k]: inp.doors[k] ? 0 : 1 }; syncControls(); }
  function syncControls() {
    ctl.querySelectorAll('.bn__row').forEach((row) => {
      const k = row.dataset.key;
      const cur = { lever: inp.lever, turn: inp.turn, headlights: inp.headlights, wipers: inp.wipers, ignition: inp.ignition }[k];
      if (cur !== undefined) row.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('is-on', String(cur) === b.dataset.v));
    });
    ctl.querySelectorAll('[data-door]').forEach((b) => b.classList.toggle('is-on', !!inp.doors[b.dataset.door]));
    ctl.querySelector('[data-misc="belt"]')?.classList.toggle('is-on', !!inp.belt);
    ctl.querySelector('[data-misc="park"]')?.classList.toggle('is-on', !!inp.parkBrake);
    ctl.querySelector('[data-misc="flash"]')?.classList.toggle('is-on', !!inp.highBeam);
    const s = ctl.querySelector('[data-steer]');
    if (s) { s.value = inp.steer; s.style.setProperty('--p', `${((inp.steer + 540) / 1080) * 100}%`); s.parentElement.querySelector('output').textContent = `${inp.steer > 0 ? '+' : ''}${Math.round(inp.steer)}°`; }
  }
  buildControls();

  // ---------- keyboard (laptop) ----------
  const keyOk = () => !compact && opts.keyboard !== false && wrap.isConnected;
  const onKeyDown = (e) => {
    if (!keyOk() || e.target.closest?.('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const handled = ['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'p', 'r', 'n', 'q', 'e', 'l', 'k', 'f', 'b', ' ', 'i', '1', '2', '3', '4', '5'];
    if (!handled.includes(k)) return;
    e.preventDefault();
    if (e.repeat && !['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'f'].includes(k)) return;
    S.keys.add(k);
    if (k === 'p' || k === 'r' || k === 'n') shift(k.toUpperCase());
    if (k === 'd' && S.keys.has('shift')) shift('D');
    if (k === 'q') inp.turn = inp.turn === 1 ? 0 : 1;
    if (k === 'e') inp.turn = inp.turn === 2 ? 0 : 2;
    if (k === 'l') inp.headlights = (inp.headlights + 1) % 4;
    if (k === 'k') { const i = WIPERS.findIndex((w) => w[1] === inp.wipers); inp.wipers = WIPERS[(i + 1) % 4][1]; }
    if (k === 'f') inp.highBeam = 1;
    if (k === 'b') inp.belt = inp.belt ? 0 : 1;
    if (k === ' ') inp.parkBrake = !inp.parkBrake;
    if (k === 'i') { const i = IGN.findIndex((g) => g[1] === inp.ignition); inp.ignition = IGN[(i + 1) % IGN.length][1]; }
    if ('12345'.includes(k)) toggleDoor(DOORS[Number(k) - 1][0]);
    syncControls();
  };
  const onKeyUp = (e) => { const k = e.key.toLowerCase(); S.keys.delete(k); if (k === 'f') { inp.highBeam = 0; syncControls(); } };
  // "D" is both steer-right and Drive: plain D steers; Shift+D (or the Gear chips) selects Drive.
  const onShift = (e) => { if (e.key === 'Shift') { if (e.type === 'keydown') S.keys.add('shift'); else S.keys.delete('shift'); } };
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('keydown', onShift);
  document.addEventListener('keyup', onShift);

  // ---------- bus view ----------
  const tabs = $('.bn__tabs');
  tabs.innerHTML = ['log', 'table', 'decode'].map((v) => `<button type="button" class="pchip ${v === S.view ? 'is-on' : ''}" data-view="${v}">${{ log: 'Log', table: 'Table', decode: 'Decode' }[v]}</button>`).join('');
  tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (!b) return; S.view = b.dataset.view; tabs.querySelectorAll('[data-view]').forEach((x) => x.classList.toggle('is-on', x === b)); paint(true); });
  $('[data-pause]').onclick = (e) => { S.paused = !S.paused; e.currentTarget.classList.toggle('is-on', S.paused); e.currentTarget.textContent = S.paused ? 'Paused' : 'Pause view'; };
  $('[data-names]').onclick = (e) => { S.names = !S.names; e.currentTarget.classList.toggle('is-on', S.names); paint(true); };
  $('.bn__filter input')?.addEventListener('input', (e) => {
    const ids = (e.target.value.match(/[0-9a-f]{1,3}/gi) || []).map((h) => parseInt(h, 16));
    S.filter = ids.length ? new Set(ids) : null; paint(true);
  });
  screen.addEventListener('click', (e) => { const r = e.target.closest('[data-id]'); if (!r) return; S.sel = Number(r.dataset.id); if (S.view !== 'decode') { S.view = 'decode'; tabs.querySelectorAll('[data-view]').forEach((x) => x.classList.toggle('is-on', x.dataset.view === 'decode')); } paint(true); });

  function ingest(f, now) {
    const r = table.get(f.id) || { data: null, count: 0, times: [], changed: new Array(8).fill(-9) };
    if (r.data) for (let i = 0; i < 8; i++) if (r.data[i] !== f.data[i]) r.changed[i] = now;
    r.data = f.data; r.count++; r.times.push(now);
    while (r.times.length && now - r.times[0] > 1) r.times.shift();
    table.set(f.id, r);
    if (!S.filter || S.filter.has(f.id)) { log.push(f); if (log.length > 40) log.splice(0, log.length - 40); }
    if (S.rec) S.rec.frames.push({ t: f.t - S.rec.t0, id: f.id, data: f.data });
  }
  const bytesHtml = (data, r, now) => [...data].map((b, i) => `<span class="${r && now - r.changed[i] < 0.35 ? 'is-chg' : ''}">${hex(b, 2)}</span>`).join('');
  function paint(force) {
    const now = performance.now();
    if (!force && (S.paused || now - lastPaint < 100)) return;
    lastPaint = now;
    const t = simT;
    if (S.view === 'log') {
      screen.innerHTML = log.slice(compact ? -10 : -14).map((f) => `<div class="cd__ln" data-id="${f.id}"><span class="cd__ts">(${f.t.toFixed(3)})</span> <b>${hex(f.id)}</b>#${bytesHtml(f.data, table.get(f.id), t)}${S.names ? `<i>${messageById(f.id)?.name || ''}</i>` : ''}</div>`).join('') || '<div class="muted">Bus is quiet (ignition off?)</div>';
    } else if (S.view === 'table') {
      const rows = [...table.entries()].filter(([id]) => !S.filter || S.filter.has(id)).sort((a, b) => a[0] - b[0]);
      screen.innerHTML = `<div class="cd__th"><span>ID</span><span>count</span><span>Hz</span><span>data</span></div>` + rows.map(([id, r]) => `<div class="cd__tr" data-id="${id}"><b>${hex(id)}</b><span>${r.count}</span><span>${r.times.length}</span><span class="cd__data">${bytesHtml(r.data, r, t)}</span>${S.names ? `<i>${messageById(id)?.name || ''}</i>` : ''}</div>`).join('');
    } else {
      const m = messageById(S.sel), r = table.get(S.sel);
      const ids = [...table.keys()].sort((a, b) => a - b);
      screen.innerHTML = `<div class="bn__selids">${ids.map((id) => `<button type="button" class="pchip ${id === S.sel ? 'is-on' : ''}" data-id="${id}">${hex(id)}</button>`).join('')}</div>` +
        (m && r ? `<div class="bn__dec"><b>${hex(m.id)} ${m.name}</b> <span class="muted">from ${m.sender} · ${toHex(r.data)}</span>${m.signals.map((s) => { const raw = extractRaw(r.data, s), v = decode(r.data, s); return `<div class="bn__sig"><span>${s.name}</span><span>${s.values?.[raw] ? `${raw} = ${s.values[raw]}` : `${+v.toFixed(3)} ${/^(SED|unitless)$/i.test(s.unit) ? '' : s.unit}`}</span></div>`; }).join('')}<p class="muted" style="font-size:11px">Community openpilot DBC decode (not from Ford). Values are simulated.</p></div>` : '<p class="muted">Tap an ID.</p>');
    }
  }

  // ---------- dashboard ----------
  function paintDash() {
    const st = car.state, mph = st.kph / 1.609344;
    const gear = inp.lever === 'D' ? (st.gear ? `D${st.gear}` : 'D') : inp.lever;
    dash.innerHTML = gauge(70, 66, 52, mph, 120, Math.round(mph), 'mph', `${Math.round(st.kph)} km/h`) +
      gauge(270, 66, 52, st.rpm / 1000, 7, (st.rpm / 1000).toFixed(1), '×1000 rpm', '', 6.5) +
      `<text x="170" y="56" text-anchor="middle" class="bn-gear">${gear}</text><text x="170" y="76" text-anchor="middle" class="awd-sub">gear</text>
       <text x="170" y="100" text-anchor="middle" class="awd-sub">coolant ${Math.round(st.coolant)} °C</text>
       <text x="170" y="114" text-anchor="middle" class="awd-sub">${st.map > 2 ? `boost +${Math.round(st.map * 0.145)} psi` : `vacuum ${Math.round(-st.map)} kPa`}</text>`;
    const blink = Math.floor(car.state.blinkT / 333) % 2 === 0;
    const anyDoor = Object.values(inp.doors).some(Boolean);
    tell.innerHTML = [
      ['◀', inp.turn === 1 && blink, '#4fd27f'], ['▶', inp.turn === 2 && blink, '#4fd27f'],
      ['HIGH', inp.headlights >= 2 || inp.highBeam, inp.highBeam ? '#7fb2e0' : '#4fd27f'], ['BELT', !inp.belt, '#ff4d3d'],
      ['DOOR', anyDoor, '#ffc21a'], ['(P)', inp.parkBrake, '#ff4d3d'], ['BRAKE', inp.brake, '#ffc21a'], ['WIPE', inp.wipers > 0, '#7fb2e0'],
    ].map(([t, on, c]) => `<span class="${on ? 'is-on' : ''}" style="--c:${c}">${t === 'HIGH' && inp.headlights < 2 && !inp.highBeam ? 'LIGHTS' : t}</span>`).join('');
    const ign = IGN.find((g) => g[1] === inp.ignition)?.[0];
    statusEl.textContent = S.replay ? `Replaying “${S.replay.name}” ${S.replay.t.toFixed(1)} s` : `Ignition ${ign}${!car.state.engine && inp.ignition >= 4 ? ' (cranking)' : ''}`;
  }

  // ---------- loop ----------
  function loop(ts) {
    const dt = last ? Math.min(100, ts - last) : 16; last = ts;
    // keyboard holds
    const k = S.keys;
    const gas = S.gasHeld || k.has('w') || k.has('arrowup');
    inp.brake = !!S.brakeHeld || k.has('s') || k.has('arrowdown');
    const target = gas ? S.gasAmt : 0;
    inp.pedal += Math.sign(target - inp.pedal) * Math.min(Math.abs(target - inp.pedal), dt * 0.25);
    const steerKey = (k.has('a') || k.has('arrowleft') ? -1 : 0) + ((k.has('d') && !k.has('shift')) || k.has('arrowright') ? 1 : 0);
    if (steerKey) { inp.steer = Math.max(-540, Math.min(540, inp.steer + steerKey * dt * 0.36)); syncControls(); }
    else if (S.keySteered && Math.abs(inp.steer) > 0) { inp.steer -= Math.sign(inp.steer) * Math.min(Math.abs(inp.steer), dt * 0.4); syncControls(); }
    S.keySteered = steerKey ? true : S.keySteered && inp.steer !== 0;
    if (S.replay) {
      S.replay.t += dt / 1000;
      const fr = S.replay.frames;
      while (S.replay.k < fr.length && fr[S.replay.k].t <= S.replay.t) { const f = fr[S.replay.k++]; simT = f.t; ingest(f, f.t); }
      if (S.replay.k >= fr.length) stopReplay();
    } else {
      const frames = car.step(dt);
      for (const f of frames) { simT = f.t; ingest(f, f.t); }
      simT = car.state.t / 1000;
    }
    paint();
    if (ts - lastDash > 66) { paintDash(); lastDash = ts; }
    if (S.rec) $('.bn__rect').textContent = `REC ${(simT - S.rec.t0).toFixed(1)} s · ${S.rec.frames.length.toLocaleString('en-US')} frames`;
    raf = requestAnimationFrame(loop);
  }

  // ---------- recording, captures, import, compare ----------
  let offCaps = () => {};
  if ($('.bn__rec')) {
    const recBtn = $('[data-rec]');
    recBtn.onclick = async () => {
      if (!S.rec) { S.rec = { t0: simT, frames: [] }; recBtn.textContent = '■ Stop'; recBtn.classList.add('is-rec'); return; }
      const r = S.rec; S.rec = null; recBtn.textContent = '● Record'; recBtn.classList.remove('is-rec'); $('.bn__rect').textContent = '';
      if (!r.frames.length) return say('Nothing recorded (was the bus quiet?).');
      const name = prompt('Name this capture', `Capture ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      if (name === null) return;
      await saveCapture({ name: name || 'Capture', text: toCandump(r.frames), seconds: +(r.frames.at(-1).t).toFixed(2), count: r.frames.length });
      say('Saved. Export it, open it in the Python bench, or compare it with another capture below.');
    };
    $('.bn__import input').addEventListener('change', async (e) => {
      const file = e.target.files?.[0]; e.target.value = '';
      if (!file) return;
      if (file.size > 8e6) return say('That file is over 8 MB; trim it first.');
      const { frames, format, skipped } = parseCapture(await file.text());
      if (!frames.length) return say('No CAN frames found. Supported: candump -l logs and SavvyCAN CSV.');
      await saveCapture({ name: file.name.replace(/\.[^.]+$/, ''), text: toCandump(frames), seconds: +(frames.at(-1).t).toFixed(2), count: frames.length, source: 'import' });
      say(`Imported ${frames.length.toLocaleString('en-US')} frames (${format}${skipped ? `, skipped ${skipped} lines` : ''}).`);
    });
    const caps = $('.bn__caps'), cmp = $('.bn__cmp');
    const renderCaps = (list) => {
      caps.innerHTML = list.length ? list.map((c) => `<li class="bn__cap"><div><b>${c.name.replace(/</g, '&lt;')}</b><span class="mono muted">${c.seconds} s · ${c.count.toLocaleString('en-US')} frames${c.source === 'import' ? ' · imported' : ''}</span></div>
        <div class="bn__capbtns"><button type="button" class="pchip" data-a="replay" data-c="${c.id}">Replay</button><button type="button" class="pchip" data-a="log" data-c="${c.id}">.log</button><button type="button" class="pchip" data-a="csv" data-c="${c.id}">SavvyCAN CSV</button><a class="pchip" href="#/lab/python">Python</a><button type="button" class="pchip" data-a="del" data-c="${c.id}">Delete</button></div></li>`).join('')
        : '<li class="muted">No captures yet. Press Record, do one thing (like the left turn signal), then Stop.</li>';
      cmp.innerHTML = list.length >= 2 ? `<div class="bn__cmpbar"><span class="kicker">Compare</span><select data-k="a">${list.map((c, i) => `<option value="${c.id}" ${i === 1 ? 'selected' : ''}>${c.name.replace(/</g, '&lt;')}</option>`).join('')}</select><span>vs</span><select data-k="b">${list.map((c, i) => `<option value="${c.id}" ${i === 0 ? 'selected' : ''}>${c.name.replace(/</g, '&lt;')}</option>`).join('')}</select><button type="button" class="pchip" data-a="cmp">Diff</button></div><div class="bn__cmpout"></div>` : '';
    };
    const capsById = async (id) => (await listCaptures()).find((c) => c.id === id);
    wrap.querySelector('.bn__rec').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      const a = b.dataset.a;
      if (a === 'cmp') {
        const A = await capsById(cmp.querySelector('[data-k=a]').value), B = await capsById(cmp.querySelector('[data-k=b]').value);
        if (!A || !B) return;
        const pa = profile(parseCapture(A.text).frames, A.seconds), pb = profile(parseCapture(B.text).frames, B.seconds);
        const ids = [...new Set([...Object.keys(pa), ...Object.keys(pb)].map(Number))].sort((x, y) => x - y);
        const cls = (id, i) => { const x = pb[id]?.changes[i] || 0, y = pa[id]?.changes[i] || 0; return !x ? 'is-n' : y ? 'is-b' : 'is-a'; };
        cmp.querySelector('.bn__cmpout').innerHTML = `<p class="muted" style="font-size:12px">Orange = changes in “${B.name.replace(/</g, '&lt;')}” but not in “${A.name.replace(/</g, '&lt;')}”. Numbers = how many times that byte changed.</p><div class="cdf__grid"><span></span>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<span class="cdf__h mono">B${i}</span>`).join('')}${ids.map((id) => `<span class="cdf__id mono">${hex(id)}</span>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<span class="cdf__c ${cls(id, i)}">${pb[id]?.changes[i] || ''}</span>`).join('')}`).join('')}</div>`;
        return;
      }
      const c = await capsById(b.dataset.c); if (!c) return;
      const base = (c.name || 'capture').replace(/[^\w-]+/g, '_');
      if (a === 'log') download(`${base}.log`, c.text);
      if (a === 'csv') download(`${base}.csv`, toSavvyCsv(parseCapture(c.text).frames), 'text/csv');
      if (a === 'del' && confirm(`Delete “${c.name}”?`)) deleteCapture(c.id);
      if (a === 'replay') startReplay(c);
    });
    listCaptures().then(renderCaps);
    offCaps = onCaptures(renderCaps);
  }
  function startReplay(c) {
    S.replay = { name: c.name, frames: parseCapture(c.text).frames, k: 0, t: 0 };
    table.clear(); log.length = 0;
    say(`Replaying “${c.name}”. The live car is paused until it ends.`);
  }
  function stopReplay() { S.replay = null; table.clear(); log.length = 0; say('Replay finished: back to the live car.'); }

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); last = 0; if (e.isIntersecting) raf = requestAnimationFrame(loop); }) : null;
  io?.observe(wrap);
  paintDash();
  raf = requestAnimationFrame(loop);
  return {
    car,
    destroy() { cancelAnimationFrame(raf); io?.disconnect(); offCaps(); document.removeEventListener('keydown', onKeyDown); document.removeEventListener('keyup', onKeyUp); document.removeEventListener('keydown', onShift); document.removeEventListener('keyup', onShift); },
  };
}

export const BENCH_IDS = MESSAGES.map((m) => m.id);
