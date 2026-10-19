// Scrolling SIMULATED candump view. Real Ford message layouts (community DBC), made-up values.
// Log view (last lines) or table view (one row per ID: count, rate, latest data). Changed bytes flash.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';
import { runScenario, SCENARIOS } from '../../../core/can/sim.js';
import { messageById } from '../../../core/can/ford.js';

const hex = (n, w = 3) => n.toString(16).toUpperCase().padStart(w, '0');
const PICK = ['drive', 'blinker', 'doors', 'pedal', 'brake', 'steer'];

export function mount(host, spec = {}) {
  const S = { scenario: spec.scenario || 'drive', view: 'log', t: 0, playing: true, speed: 1, filter: spec.ids ? new Set(spec.ids) : null, names: false, last: 0 };
  let frames = [], k = 0, raf = 0, lastPaint = 0;
  const latest = new Map(); // id → { data, prev, count, changedAt[] }
  const lines = [];

  const wrap = el(html`<figure class="vis cd" data-noswipe>
    <div class="cd__top"><span class="t4-badge">Simulated</span><span class="cd__sc"></span><span class="mono cd__t"></span></div>
    <div class="cd__screen mono" aria-live="off"></div>
    <div class="cd__bar">
      <button type="button" class="btn ex__small" data-play>Pause</button>
      <button type="button" class="btn btn--ghost ex__small" data-restart>Restart</button>
      <button type="button" class="btn btn--ghost ex__small" data-view>Table view</button>
      <button type="button" class="btn btn--ghost ex__small" data-names>Show names</button>
    </div>
    <div class="ctl"></div>
    <p class="vis__note">Fake drive, real message layouts: IDs and bit positions come from the open-source openpilot Ford DBC (community reverse-engineered); values and timing are made up by a simple model.</p>
  </figure>`);
  host.append(wrap);
  const screen = wrap.querySelector('.cd__screen'), tEl = wrap.querySelector('.cd__t'), scEl = wrap.querySelector('.cd__sc');
  const $ = (s) => wrap.querySelector(s);

  function load() {
    frames = runScenario(S.scenario);
    if (S.filter) frames = frames.filter((f) => S.filter.has(f.id));
    k = 0; S.t = 0; latest.clear(); lines.length = 0;
    scEl.textContent = SCENARIOS[S.scenario].label;
    paint(true);
  }

  function ingest(f) {
    const r = latest.get(f.id) || { data: null, count: 0, changed: new Array(8).fill(-9) };
    if (r.data) for (let i = 0; i < 8; i++) if (r.data[i] !== f.data[i]) r.changed[i] = f.t;
    r.prev = r.data; r.data = f.data; r.count++;
    latest.set(f.id, r);
    lines.push(f);
    if (lines.length > 60) lines.splice(0, lines.length - 60);
  }

  const bytesHtml = (f, r) => [...f.data].map((b, i) => `<span class="${r && f.t - r.changed[i] < 0.35 ? 'is-chg' : ''}">${hex(b, 2)}</span>`).join('');

  function paint(force) {
    const now = performance.now();
    if (!force && now - lastPaint < 90) return;
    lastPaint = now;
    tEl.textContent = `${S.t.toFixed(2)} s`;
    if (S.view === 'log') {
      const show = lines.slice(-14);
      screen.innerHTML = show.map((f) => {
        const r = latest.get(f.id);
        const nm = S.names ? `<i>${messageById(f.id)?.name || ''}</i>` : '';
        return `<div class="cd__ln"><span class="cd__ts">(${f.t.toFixed(3)})</span> <b>${hex(f.id)}</b>#${bytesHtml(f, r)}${nm}</div>`;
      }).join('') || '<div class="muted">waiting…</div>';
    } else {
      const rows = [...latest.entries()].sort((a, b) => a[0] - b[0]);
      screen.innerHTML = `<div class="cd__th"><span>ID</span><span>count</span><span>Hz</span><span>data</span></div>` + rows.map(([id, r]) => {
        const hz = S.t > 0.5 ? (r.count / S.t).toFixed(0) : '–';
        const nm = S.names ? `<i>${messageById(id)?.name || ''}</i>` : '';
        return `<div class="cd__tr"><b>${hex(id)}</b><span>${r.count}</span><span>${hz}</span><span class="cd__data">${bytesHtml({ t: S.t, data: r.data }, r)}</span>${nm}</div>`;
      }).join('');
    }
  }

  function loop(ts) {
    const dt = S.last ? Math.min(0.1, (ts - S.last) / 1000) : 0;
    S.last = ts;
    if (S.playing) {
      S.t += dt * S.speed;
      while (k < frames.length && frames[k].t <= S.t) ingest(frames[k++]);
      if (k >= frames.length) { S.playing = false; $('[data-play]').textContent = 'Play'; }
      paint();
    }
    raf = requestAnimationFrame(loop);
  }

  $('[data-play]').onclick = (e) => { if (k >= frames.length) load(); S.playing = !S.playing; e.currentTarget.textContent = S.playing ? 'Pause' : 'Play'; };
  $('[data-restart]').onclick = () => { load(); S.playing = true; $('[data-play]').textContent = 'Pause'; };
  $('[data-view]').onclick = (e) => { S.view = S.view === 'log' ? 'table' : 'log'; e.currentTarget.textContent = S.view === 'log' ? 'Table view' : 'Log view'; paint(true); };
  $('[data-names]').onclick = (e) => { S.names = !S.names; e.currentTarget.textContent = S.names ? 'Hide names' : 'Show names'; paint(true); };
  const ctl = wrap.querySelector('.ctl');
  if (!spec.fixed) ctl.append(chips(PICK.map((v) => ({ value: v, label: v })), { value: S.scenario, onPick(v) { S.scenario = v; load(); S.playing = true; $('[data-play]').textContent = 'Pause'; } }).el);
  ctl.append(chips([{ value: 0.25, label: '¼×' }, { value: 1, label: '1×' }, { value: 4, label: '4×' }], { value: 1, onPick(v) { S.speed = v; } }).el);

  // pause when scrolled away
  let autoPaused = false;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => {
    if (!e.isIntersecting && S.playing) { S.playing = false; autoPaused = true; }
    else if (e.isIntersecting && autoPaused) { S.playing = true; autoPaused = false; }
  }) : null;
  io?.observe(wrap);
  load();
  raf = requestAnimationFrame(loop);
  return { destroy() { cancelAnimationFrame(raf); io?.disconnect(); } };
}
