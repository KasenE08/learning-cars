// ECU calibration table as a heat map (ILLUSTRATIVE numbers, not a real or Ford calibration).
// A moving operating point shows bilinear interpolation; editing a cell shows the trade-off.
import { html, el } from '../../dom.js';
import { chips } from '../controls.js';

const RPM = [1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000];
const LOAD = [20, 30, 40, 50, 60, 70, 80, 100];
const ign = (r, l) => Math.round(Math.max(2, Math.min(42, 12 + 26 * (1 - l / 110) + (r / 1000) * 2.2 - (l > 70 ? (l - 70) * 0.15 : 0))));
const MAPS = {
  ignition: { label: 'Ignition timing', unit: '° BTDC', fmt: (v) => v.toFixed(0), base: ign, step: 1,
    effect(v, b) { const d = v - b; return d > 3 ? ['Knock!', `+${d}° over stock, past the knock limit: the knock sensor hears detonation and the ECU pulls timing (or it damages pistons).`, 'bad'] : d > 0 ? ['More torque, less margin', `+${d}°: a little more torque until the knock limit. Octane decides where that limit is.`, 'warn'] : d < 0 ? ['Safe but slow', `${d}°: less torque, hotter exhaust, worse economy.`, 'ok'] : ['Stock', 'Calibrated with a margin below the knock limit.', 'ok']; } },
  fuel: { label: 'Target lambda (λ)', unit: 'λ', fmt: (v) => v.toFixed(2), base: (r, l) => +(l < 60 ? 1 : 1 - 0.16 * ((l - 60) / 40) * Math.min(1, r / 5000)).toFixed(2), step: 0.02,
    effect(v, b, l) { const d = v - b; return l >= 70 && d > 0.03 ? ['Too lean at high load', 'Leaner under boost runs hotter: more knock and exhaust-temperature risk. Rich mixtures also cool.', 'bad'] : d < -0.03 ? ['Rich', 'Wastes fuel, can foul the catalyst; slightly cooler combustion.', 'warn'] : ['Stock', 'λ = 1 (≈ 14.7:1 air:fuel for gasoline) at cruise for the catalytic converter; richer under full load.', 'ok']; } },
  boost: { label: 'Boost target', unit: 'psi', fmt: (v) => v.toFixed(0), base: (r, l) => Math.max(0, Math.round((l - 45) / 55 * (r < 3000 ? 6 + r / 250 : 18 - (r - 3000) / 750))), step: 1,
    effect(v, b) { const d = v - b; return d > 3 ? ['Big gains, big risks', `+${d} psi: more air → more torque, but more heat, knock risk, turbo speed and driveline stress.`, 'bad'] : d > 0 ? ['More power', `+${d} psi: more torque; the timing and fuel tables must match it.`, 'warn'] : ['Stock', 'The ECU reaches the target with the wastegate (on the Bronco’s 2.0 EcoBoost, a twin-scroll turbo).', 'ok']; } },
};

export function mount(host, spec = {}) {
  const S = { map: MAPS[spec.map] ? spec.map : 'ignition', edits: {}, sel: null, t: 0 };
  const wrap = el(html`<figure class="vis em" data-noswipe>
    <div class="cd__top"><span class="t4-badge">Illustrative</span><span class="em__title"></span></div>
    <div class="em__grid mono"></div>
    <div class="em__interp mono"></div>
    <div class="em__edit"></div>
    <div class="ctl"></div>
    <p class="vis__note">Made-up numbers to show the idea, not a real (or Ford) calibration. Real ECUs have hundreds of tables, and they interpolate between cells just like this.</p>
  </figure>`);
  host.append(wrap);
  const grid = wrap.querySelector('.em__grid'), interpEl = wrap.querySelector('.em__interp'), edit = wrap.querySelector('.em__edit');
  let raf = 0, last = 0;
  const val = (i, j) => { const M = MAPS[S.map]; const k = `${S.map}:${i}:${j}`; return k in S.edits ? S.edits[k] : M.base(RPM[j], LOAD[i]); };

  function drawGrid() {
    const M = MAPS[S.map];
    const all = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) all.push(val(i, j));
    const lo = Math.min(...all), hi = Math.max(...all);
    let h = `<span class="em__ax">load ↓ rpm →</span>${RPM.map((r) => `<span class="em__ax">${r >= 1000 ? r / 1000 + 'k' : r}</span>`).join('')}`;
    for (let i = 7; i >= 0; i--) {
      h += `<span class="em__ax">${LOAD[i]}%</span>`;
      for (let j = 0; j < 8; j++) {
        const v = val(i, j), f = (v - lo) / (hi - lo || 1);
        const near = false;
        const edited = `${S.map}:${i}:${j}` in S.edits;
        h += `<button type="button" class="em__c ${near ? 'is-near' : ''} ${S.sel?.[0] === i && S.sel?.[1] === j ? 'is-sel' : ''} ${edited ? 'is-ed' : ''}" data-i="${i}" data-j="${j}" style="background:hsl(${30 - f * 30} ${50 + f * 40}% ${14 + f * 26}%)">${M.fmt(v)}</button>`;
      }
    }
    grid.innerHTML = h;
    cellEls = [...grid.querySelectorAll('[data-i]')];
    dirty = false;
  }
  let cellEls = [], dirty = true;
  function markNear(op) {
    const keys = new Set(op.cells.map(([a, b]) => `${a}:${b}`));
    for (const c of cellEls) c.classList.toggle('is-near', keys.has(`${c.dataset.i}:${c.dataset.j}`));
  }

  function opPoint() {
    // operating point loops around the map (a pretend drive)
    const r = 2200 + 1500 * Math.sin(S.t * 0.6) + 600 * Math.sin(S.t * 1.7);
    const l = 55 + 30 * Math.sin(S.t * 0.9 + 1);
    const j = Math.max(0, RPM.findLastIndex((x) => x <= r)), i = Math.max(0, LOAD.findLastIndex((x) => x <= l));
    const j2 = Math.min(7, j + 1), i2 = Math.min(7, i + 1);
    const fx = j2 === j ? 0 : (r - RPM[j]) / (RPM[j2] - RPM[j]), fy = i2 === i ? 0 : (l - LOAD[i]) / (LOAD[i2] - LOAD[i]);
    const v = val(i, j) * (1 - fx) * (1 - fy) + val(i, j2) * fx * (1 - fy) + val(i2, j) * (1 - fx) * fy + val(i2, j2) * fx * fy;
    return { r, l, v, cells: [[i, j], [i, j2], [i2, j], [i2, j2]] };
  }

  function drawEdit() {
    const M = MAPS[S.map];
    if (!S.sel) { edit.innerHTML = '<p class="muted">Tap a cell to change it and see the trade-off.</p>'; return; }
    const [i, j] = S.sel, v = val(i, j), b = M.base(RPM[j], LOAD[i]);
    const [head, text, kind] = M.effect(v, b, LOAD[i]);
    edit.innerHTML = `<div class="em__ed"><span class="mono">${RPM[j]} rpm · ${LOAD[i]}% load: <b>${M.fmt(v)} ${M.unit}</b> (stock ${M.fmt(b)})</span>
      <span class="em__btns"><button type="button" class="btn btn--ghost ex__small" data-d="-1">−</button><button type="button" class="btn btn--ghost ex__small" data-d="1">+</button><button type="button" class="btn btn--ghost ex__small" data-d="0">Reset</button></span>
      <div class="fb fb--${kind === 'bad' ? 'bad' : kind === 'warn' ? 'warn' : 'ok'}"><b class="fb__head">${head}</b><p>${text}</p></div></div>`;
  }

  function loop(ts) {
    const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts; S.t += dt;
    const op = opPoint();
    if (dirty) drawGrid();
    markNear(op);
    const M = MAPS[S.map];
    interpEl.innerHTML = `now: ${Math.round(op.r)} rpm, ${Math.round(op.l)}% load → blend of 4 cells = <b>${M.fmt(op.v)} ${M.unit}</b>`;
    raf = requestAnimationFrame(loop);
  }

  grid.addEventListener('click', (e) => { const c = e.target.closest('[data-i]'); if (!c) return; S.sel = [Number(c.dataset.i), Number(c.dataset.j)]; dirty = true; drawEdit(); });
  edit.addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]'); if (!b || !S.sel) return;
    const M = MAPS[S.map], [i, j] = S.sel, k = `${S.map}:${i}:${j}`, d = Number(b.dataset.d);
    if (d === 0) delete S.edits[k]; else S.edits[k] = +(val(i, j) + d * M.step).toFixed(2);
    dirty = true; drawEdit();
  });
  const setTitle = () => { wrap.querySelector('.em__title').textContent = `${MAPS[S.map].label} (${MAPS[S.map].unit})`; };
  wrap.querySelector('.ctl').append(chips([{ value: 'ignition', label: 'Timing' }, { value: 'fuel', label: 'Fuel (λ)' }, { value: 'boost', label: 'Boost' }], { value: S.map, onPick(v) { S.map = v; S.sel = null; dirty = true; setTitle(); drawEdit(); } }).el);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); last = 0; if (e.isIntersecting) raf = requestAnimationFrame(loop); }) : null;
  io?.observe(wrap);
  setTitle(); drawEdit();
  raf = requestAnimationFrame(loop);
  return { destroy() { cancelAnimationFrame(raf); io?.disconnect(); } };
}
