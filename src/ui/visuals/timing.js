// Two views: the chain drive (crank turns twice per cam turn) and the valve-timing circle with a VVT slider.
import { html, el } from '../dom.js';
import { timeline } from './timeline.js';
import { slider, chips } from './controls.js';

/** Outer tangent points between two circles, picking the side away from `away`. */
function tangent(c1, c2, away) {
  const dx = c2.x - c1.x, dy = c2.y - c1.y, D = Math.hypot(dx, dy);
  const th = Math.atan2(dy, dx), b = Math.acos((c1.r - c2.r) / D);
  const cand = [th + b, th - b].map((a) => ({
    a,
    p1: { x: c1.x + c1.r * Math.cos(a), y: c1.y + c1.r * Math.sin(a) },
    p2: { x: c2.x + c2.r * Math.cos(a), y: c2.y + c2.r * Math.sin(a) },
  }));
  const dist = (t) => Math.hypot((t.p1.x + t.p2.x) / 2 - away.x, (t.p1.y + t.p2.y) / 2 - away.y);
  return dist(cand[0]) > dist(cand[1]) ? cand[0] : cand[1];
}

/** Closed belt path around circles listed clockwise (screen coords). */
export function beltPath(circles) {
  const cx = circles.reduce((s, c) => s + c.x, 0) / circles.length;
  const cy = circles.reduce((s, c) => s + c.y, 0) / circles.length;
  const t = circles.map((c, i) => tangent(c, circles[(i + 1) % circles.length], { x: cx, y: cy }));
  let d = `M${t[0].p1.x.toFixed(1)},${t[0].p1.y.toFixed(1)}`;
  beltPath.runs = t;
  for (let i = 0; i < t.length; i++) {
    const next = t[(i + 1) % t.length];
    const c = circles[(i + 1) % circles.length];
    d += ` L${t[i].p2.x.toFixed(1)},${t[i].p2.y.toFixed(1)}`;
    const a0 = Math.atan2(t[i].p2.y - c.y, t[i].p2.x - c.x), a1 = Math.atan2(next.p1.y - c.y, next.p1.x - c.x);
    const span = (a1 - a0 + 2 * Math.PI) % (2 * Math.PI);
    d += ` A${c.r},${c.r} 0 ${span > Math.PI ? 1 : 0} 1 ${next.p1.x.toFixed(1)},${next.p1.y.toFixed(1)}`;
  }
  return `${d}Z`;
}

const sprocket = (cls, r, teeth) => {
  let ticks = '';
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * 2 * Math.PI;
    ticks += `M${(r * Math.sin(a)).toFixed(1)},${(-r * Math.cos(a)).toFixed(1)} L${((r + 4) * Math.sin(a)).toFixed(1)},${(-(r + 4) * Math.cos(a)).toFixed(1)} `;
  }
  return `<g class="${cls}"><circle r="${r}" fill="#2a3038" stroke="#8994a1" stroke-width="1.4"/><path d="${ticks}" stroke="#8994a1" stroke-width="2.5"/><circle r="${r * 0.35}" fill="#14171a" stroke="#5b6470"/><path d="M0,${-r + 3} l-5,9 h10 z" fill="#ff6b1a"/></g>`;
};

// Plastic shoe lying along a chain run, pushed slightly outward.
function shoe(run, color, side) {
  const mx = (run.p1.x + run.p2.x) / 2, my = (run.p1.y + run.p2.y) / 2;
  const ang = (Math.atan2(run.p2.y - run.p1.y, run.p2.x - run.p1.x) * 180) / Math.PI;
  return `<g transform="translate(${mx} ${my}) rotate(${ang})"><rect x="-48" y="${side > 0 ? -12 : 4}" width="96" height="8" rx="4" fill="${color}" opacity="0.9"/></g>`;
}

export function mount(host, spec = {}) {
  const wrap = el(html`<figure class="vis" data-noswipe><div class="ctl__chips tabs" style="margin-bottom:8px"></div><div class="pane"></div></figure>`);
  host.append(wrap);
  const pane = wrap.querySelector('.pane');
  let destroyPane = () => {};

  const chainView = () => {
    const crank = { x: 180, y: 250, r: 24 }, camL = { x: 105, y: 72, r: 48 }, camR = { x: 255, y: 72, r: 48 };
    const path = beltPath([camL, camR, crank]);
    pane.innerHTML = `<svg viewBox="0 0 360 300" class="d" role="img" aria-label="Timing chain drive">
      <path d="${path}" fill="none" stroke="#3a424c" stroke-width="9" stroke-linejoin="round"/>
      <path class="chain" d="${path}" fill="none" stroke="#c9d1d9" stroke-width="5" stroke-dasharray="5 3"/>
      ${shoe(beltPath.runs[2], '#ffc21a', 1)}${shoe(beltPath.runs[1], '#5b6470', -1)}
      <g transform="translate(${camL.x} ${camL.y})">${sprocket('s-camL', camL.r, 40)}</g>
      <g transform="translate(${camR.x} ${camR.y})">${sprocket('s-camR', camR.r, 40)}</g>
      <g transform="translate(${crank.x} ${crank.y})">${sprocket('s-crank', crank.r, 20)}</g>
      <path d="M${camL.x},${camL.y - camL.r - 10} l-5,-8 h10 z M${camR.x},${camR.y - camR.r - 10} l-5,-8 h10 z M${crank.x},${crank.y - crank.r - 10} l-5,-8 h10 z" fill="#ffc21a"/>
      <text x="${camL.x}" y="${camL.y + 34}" text-anchor="middle" style="font-size:10px">INTAKE CAM</text><text x="${camR.x}" y="${camR.y + 34}" text-anchor="middle" style="font-size:10px">EXHAUST CAM</text>
      <text x="${crank.x}" y="${crank.y + 44}" text-anchor="middle">crank</text>
      <text x="30" y="200" class="geo-t">tensioner</text><text x="330" y="200" text-anchor="end">guide</text>
    </svg><div class="vis__readout"></div>`;
    const ro = pane.querySelector('.vis__readout');
    const sL = pane.querySelector('.s-camL'), sR = pane.querySelector('.s-camR'), sC = pane.querySelector('.s-crank'), ch = pane.querySelector('.chain');
    const tl = timeline(pane, { period: 720, cycleMs: 6000, onFrame(t) {
      sC.setAttribute('transform', `rotate(${t})`);
      sL.setAttribute('transform', `rotate(${t / 2})`);
      sR.setAttribute('transform', `rotate(${t / 2})`);
      ch.setAttribute('stroke-dashoffset', -(t * Math.PI / 180) * crank.r);
      const aligned = t < 4 || t > 716;
      ro.innerHTML = `<span class="ro">crank <b>${(t / 360).toFixed(2)}</b> rev</span><span class="ro">cams <b>${(t / 720).toFixed(2)}</b> rev</span><span class="ro ${aligned ? 'ro--stroke ro--power' : ''}">${aligned ? '<b>Marks aligned</b>' : 'marks apart'}</span>`;
    } });
    return () => tl.destroy();
  };

  const circleView = () => {
    let adv = 0; // + = intake cam advanced (earlier)
    pane.innerHTML = `<svg viewBox="0 0 360 320" class="d" role="img" aria-label="Valve timing diagram"></svg><div class="big-out"></div><div class="ctl"></div>`;
    const svg = pane.querySelector('svg'), out = pane.querySelector('.big-out');
    const C = { x: 180, y: 160 };
    const pt = (deg, r) => { const a = (deg * Math.PI) / 180; return [C.x + r * Math.sin(a), C.y - r * Math.cos(a)]; };
    const arc = (from, to, r, cls) => {
      const [x0, y0] = pt(from, r), [x1, y1] = pt(to, r);
      const span = (((to - from) % 360) + 360) % 360;
      return `<path d="M${x0},${y0} A${r},${r} 0 ${span > 180 ? 1 : 0} 1 ${x1},${y1}" class="${cls}"/>`;
    };
    const tick = (deg, r, text, anchorOut = 22) => { const [x, y] = pt(deg, r); const [tx, ty] = pt(deg, r + anchorOut); return `<circle cx="${x}" cy="${y}" r="3.5" fill="#ffc21a"/><text x="${tx}" y="${ty + 4}" text-anchor="middle" style="font-size:11px">${text}</text>`; };
    const draw = () => {
      const IVO = -10 - adv, IVC = 230 - adv, EVO = 130, EVC = 10;
      const overlap = EVC - IVO;
      svg.innerHTML = `
        <circle cx="${C.x}" cy="${C.y}" r="118" fill="none" stroke="#262b31"/>
        <line x1="${C.x}" y1="${C.y - 134}" x2="${C.x}" y2="${C.y + 134}" stroke="#3a424c" stroke-dasharray="4 4"/>
        <text x="${C.x}" y="12" text-anchor="middle" class="geo-t">TDC</text><text x="${C.x}" y="314" text-anchor="middle" class="geo-t">BDC</text>
        ${arc(IVO, IVC, 84, 'vt-in')}${arc(EVO, EVC + 360, 104, 'vt-ex')}
        ${overlap > 0 ? `<path d="M${C.x},${C.y} L${pt(IVO, 118)[0]},${pt(IVO, 118)[1]} A118,118 0 0 1 ${pt(EVC, 118)[0]},${pt(EVC, 118)[1]} Z" fill="rgba(255,194,26,0.25)"/>` : ''}
        ${tick(IVO, 84, 'IVO', -20)}${tick(IVC, 84, 'IVC', -20)}${tick(EVO, 104, 'EVO')}${tick(EVC, 104, 'EVC')}
        <text x="${C.x - 30}" y="${C.y + 4}" text-anchor="end" style="fill:#7fb2e0">intake</text><text x="${C.x + 30}" y="${C.y + 4}" style="fill:#c9ad94">exhaust</text>
        <path d="M${C.x + 70},${C.y - 128} A140,140 0 0 1 ${C.x + 128},${C.y - 66}" fill="none" stroke="#5b6470" stroke-width="1.5" marker-end=""/><text x="${C.x + 120}" y="${C.y - 110}" style="font-size:11px">rotation</text>`;
      const bdc = (d) => (d > 180 ? `${d - 180}° ABDC` : `${180 - d}° BBDC`);
      out.innerHTML = String(html`
        <span class="ro"><small>Intake opens</small><b>${IVO <= 0 ? `${-IVO}° BTDC` : `${IVO}° ATDC`}</b></span>
        <span class="ro"><small>Intake closes</small><b>${bdc(IVC)}</b></span>
        <span class="ro"><small>Exhaust opens</small><b>${bdc(EVO)}</b></span>
        <span class="ro"><small>Exhaust closes</small><b>${EVC}° ATDC</b></span>
        <span class="ro ro--hl"><small>Overlap</small><b>${Math.max(0, overlap)}°</b></span>`);
    };
    const s = slider({ label: 'Intake cam', min: -25, max: 25, step: 1, value: 0, fmt: (v) => (v === 0 ? 'base' : v > 0 ? `${v}° adv` : `${-v}° ret`), onInput(v) { adv = v; draw(); } });
    pane.querySelector('.ctl').append(s.el);
    pane.append(el(html`<p class="vis__note">One circle = both revolutions folded together (intake events happen on one rev, exhaust on the other). Numbers are illustrative. Slide to see what a cam phaser (VVT) does.</p>`));
    draw();
    return () => {};
  };

  const views = { chain: chainView, circle: circleView };
  const tabs = chips([{ value: 'chain', label: 'Chain drive' }, { value: 'circle', label: 'Valve timing' }], {
    value: spec.view || 'chain',
    onPick(v) { destroyPane(); destroyPane = views[v](); },
  });
  wrap.querySelector('.tabs').replaceWith(tabs.el);
  destroyPane = views[spec.view || 'chain']();
  return { destroy: () => destroyPane() };
}
