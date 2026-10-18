// Single-cylinder cutaway driven by crank angle.
// spec: { mode: 'basic' | 'cycle' | 'geometry', labels?: boolean, start?: number }
import { html, el } from '../dom.js';
import { timeline } from './timeline.js';
import { defs, uid, label } from './svg.js';
import { VALVES, SPARK, STROKES, strokeAt, liftFrac, isOpen, pinHeight, lobePath, gasAt, norm720 } from './engine-model.js';

// geometry (SVG units)
const CX = 160, CY = 322;          // crank center
const R = 40, L = 110;             // throw, rod length
const PIN = 26, PH = 56;           // wrist pin below crown, piston height
const BORE_L = 105, BORE_R = 215;  // cylinder walls
const ROOF = 126;                  // chamber roof
const IN_X = 130, EX_X = 190, CAM_Y = 40, CAM_BASE = 12, LIFT = 10;

const crownY = (t) => CY - pinHeight(t, R, L) - PIN;

const COLORS = { fresh: '79,134,184', flame: '255,150,40', burnt: '214,110,40', exhaust: '120,104,90' };

export function mount(host, spec = {}) {
  const mode = spec.mode || 'cycle';
  const showLabels = spec.labels ?? (spec.mode !== 'geometry');
  const geo = mode === 'geometry';
  const id = uid('cyl');
  const period = geo ? 360 : 720;

  const wrap = el(html`<figure class="vis vis--cylinder" data-noswipe></figure>`);
  const svgSrc = `<svg viewBox="-60 0 440 420" class="d" role="img" aria-label="Animated single-cylinder engine cutaway">
    ${defs(id)}
    <!-- crankcase -->
    <path d="M80,250 L80,300 Q60,330 70,380 L70,404 L250,404 L250,380 Q260,330 240,300 L240,250" class="d-line d-case"/>
    <path d="M74,392 L246,392" class="d-oil-line"/>
    <rect x="72" y="393" width="176" height="10" class="d-oil"/>
    <!-- block walls with coolant jackets -->
    <rect x="80" y="140" width="25" height="112" fill="url(#${id}-hatch)" class="d-line"/>
    <rect x="215" y="140" width="25" height="112" fill="url(#${id}-hatch)" class="d-line"/>
    <rect x="86" y="150" width="8" height="70" class="d-coolant"/><rect x="226" y="150" width="8" height="70" class="d-coolant"/>
    <!-- gas in the cylinder -->
    <rect class="gas" x="${BORE_L}" y="${ROOF}" width="${BORE_R - BORE_L}" height="40"/>
    <circle class="flame" cx="160" cy="${ROOF}" r="0" fill="url(#${id}-flame)"/>
    <!-- head -->
    <path d="M60,20 L260,20 L260,140 L215,140 L215,${ROOF} L105,${ROOF} L105,140 L60,140 Z" fill="url(#${id}-hatch)" class="d-line"/>
    <rect x="66" y="26" width="188" height="36" class="d-cavity"/>
    <path d="M60,84 Q142,84 143,${ROOF} L117,${ROOF} Q117,112 60,112 Z" class="d-port d-port--in"/>
    <path d="M260,84 Q178,84 177,${ROOF} L203,${ROOF} Q203,112 260,112 Z" class="d-port d-port--ex"/>
    <path d="M60,98 Q128,98 130,${ROOF - 6}" class="flow flow--in"/>
    <path d="M190,${ROOF - 6} Q192,98 260,98" class="flow flow--ex"/>
    <rect x="66" y="128" width="10" height="8" class="d-coolant"/><rect x="244" y="128" width="10" height="8" class="d-coolant"/>
    <!-- spark plug -->
    <g class="plug"><rect x="154" y="44" width="12" height="80" class="d-plug-body"/><rect x="151" y="14" width="18" height="12" class="d-plug-hex"/><rect x="155" y="26" width="10" height="20" class="d-plug-ins"/><rect x="158" y="2" width="4" height="12" class="d-plug-ins"/></g>
    <g class="spark" opacity="0"><path d="M160,${ROOF + 2} l-7,7 M160,${ROOF + 2} l7,7 M160,${ROOF + 2} l0,10 M160,${ROOF + 2} l-10,2 M160,${ROOF + 2} l10,2" class="d-spark"/></g>
    <!-- valves -->
    ${['in', 'ex'].map((v) => {
      const x = v === 'in' ? IN_X : EX_X;
      return `<g class="valve valve--${v}">
        <path d="M${x - 3},62 L${x - 3},${ROOF - 6} L${x - 13},${ROOF - 1} L${x - 13},${ROOF + 1} L${x + 13},${ROOF + 1} L${x + 13},${ROOF - 1} L${x + 3},${ROOF - 6} L${x + 3},62 Z" class="d-valve"/>
        <path class="spring" d="" />
        <rect x="${x - 10}" y="${CAM_Y + CAM_BASE}" width="20" height="10" rx="1.5" class="d-bucket"/>
      </g>
      <g class="cam cam--${v}" transform="translate(${x} ${CAM_Y})"><path d="${lobePath(CAM_BASE, LIFT)}" class="d-cam"/><circle r="3.5" class="d-cam-hub"/></g>`;
    }).join('')}
    <!-- piston, rod, crank -->
    <g class="crank"><path d="M-46,22 A51,51 0 0 0 46,22 L18,0 L16,-40 A16,16 0 0 0 -16,-40 L-18,0 Z" class="d-counterweight"/><circle r="10" class="d-journal"/></g>
    <path class="rod" d="" />
    <circle class="pin-big d-journal" r="11"/>
    <g class="piston">
      <rect x="${BORE_L + 2}" y="0" width="${BORE_R - BORE_L - 4}" height="${PH}" rx="2" fill="url(#${id}-metal)" class="d-line"/>
      <line x1="${BORE_L + 2}" x2="${BORE_R - 2}" y1="8" y2="8" class="d-ring"/><line x1="${BORE_L + 2}" x2="${BORE_R - 2}" y1="14" y2="14" class="d-ring"/><line x1="${BORE_L + 2}" x2="${BORE_R - 2}" y1="21" y2="21" class="d-ring d-ring--oil"/>
      <circle cx="160" cy="${PIN}" r="7" class="d-pin"/>
    </g>
    <!-- geometry overlay -->
    <g class="geo" ${geo ? '' : 'hidden'}>
      <line class="geo-throw" x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY}"/>
      <text class="geo-t geo-throw-t">throw r</text>
      <line x1="225" x2="300" y1="${crownY(0)}" y2="${crownY(0)}" class="geo-ref"/><text x="304" y="${crownY(0) + 4}" class="geo-t">TDC</text>
      <line x1="225" x2="300" y1="${crownY(180)}" y2="${crownY(180)}" class="geo-ref"/><text x="304" y="${crownY(180) + 4}" class="geo-t">BDC</text>
      <path d="M290,${crownY(0)} L290,${crownY(180)} M285,${crownY(0) + 6} L290,${crownY(0)} L295,${crownY(0) + 6} M285,${crownY(180) - 6} L290,${crownY(180)} L295,${crownY(180) - 6}" class="geo-dim"/>
      <text x="296" y="${(crownY(0) + crownY(180)) / 2 + 4}" class="geo-t">stroke = 2r</text>
      <circle cx="${CX}" cy="${CY}" r="${R}" class="geo-circle"/>
    </g>
    ${showLabels ? `<g class="labels">
      ${label('Camshaft', -54, 44, IN_X - 14, CAM_Y, 'start')}
      ${label('Intake valve', -54, 74, IN_X - 3, 70, 'start')}
      ${label('Intake port', -54, 122, 70, 106, 'start')}
      ${label('Piston', -54, 196, BORE_L + 4, 196, 'start', 'lbl-piston')}
      ${label('Connecting rod', -54, 268, 150, 268, 'start', 'lbl-rod')}
      ${label('Crankshaft', -54, 360, CX - 40, 350, 'start')}
      ${label('Spark plug', 374, 10, 170, 18, 'end')}
      ${label('Exhaust valve', 374, 74, EX_X + 3, 70, 'end')}
      ${label('Exhaust port', 374, 122, 250, 106, 'end')}
      ${label('Cylinder wall', 374, 200, 238, 200, 'end')}
      ${label('Coolant', 374, 236, 232, 214, 'end')}
      ${label('Oil', 374, 400, 246, 398, 'end')}
    </g>` : ''}
  </svg>`;
  wrap.innerHTML = svgSrc;
  const readout = el(html`<div class="vis__readout"></div>`);
  wrap.append(readout);
  host.append(wrap);

  const $ = (s) => wrap.querySelector(s);
  const gas = $('.gas'), flame = $('.flame'), spark = $('.spark');
  const piston = $('.piston'), rod = $('.rod'), crank = $('.crank'), pinBig = $('.pin-big');
  const valves = { in: $('.valve--in'), ex: $('.valve--ex') };
  const cams = { in: $('.cam--in'), ex: $('.cam--ex') };
  const flows = { in: $('.flow--in'), ex: $('.flow--ex') };
  const throwLine = $('.geo-throw'), throwT = $('.geo-throw-t');

  const springPath = (x, top, bottom) => {
    const n = 7, w = 9;
    let d = `M${x - w},${top}`;
    for (let i = 1; i <= n; i++) d += ` L${x + (i % 2 ? w : -w)},${top + ((bottom - top) * i) / n}`;
    return d;
  };

  const frame = (tRaw) => {
    // geometry mode spins one revolution; map to the power/exhaust revolution so nothing odd shows
    const t = geo ? tRaw : tRaw;
    const a = (t * Math.PI) / 180;
    const top = crownY(t);
    piston.setAttribute('transform', `translate(0 ${top})`);
    const px = CX + R * Math.sin(a), py = CY - R * Math.cos(a);
    const wy = top + PIN;
    crank.setAttribute('transform', `translate(${CX} ${CY}) rotate(${norm720(t) % 360})`);
    pinBig.setAttribute('cx', px); pinBig.setAttribute('cy', py);
    // tapered rod
    const dx = px - CX, dy = py - wy, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    rod.setAttribute('d', `M${CX + nx * 6},${wy + ny * 6} L${px + nx * 10},${py + ny * 10} L${px - nx * 10},${py - ny * 10} L${CX - nx * 6},${wy - ny * 6} Z`);
    rod.setAttribute('class', 'rod d-rod');

    if (geo) {
      throwLine.setAttribute('x2', px); throwLine.setAttribute('y2', py);
      throwT.setAttribute('x', (CX + px) / 2 + 8); throwT.setAttribute('y', (CY + py) / 2);
      gas.setAttribute('opacity', 0);
    } else {
      gas.setAttribute('y', ROOF);
      gas.setAttribute('height', Math.max(0, top - ROOF));
      const g = gasAt(t);
      gas.setAttribute('fill', `rgba(${COLORS[g.kind]},${g.o})`);
      const ang = norm720(t);
      const burning = ang >= SPARK && ang < 400;
      flame.setAttribute('r', burning ? Math.min(70, ((ang - SPARK) / 40) * 70) : 0);
      flame.setAttribute('opacity', burning ? Math.max(0, 1 - (ang - SPARK) / 55) : 0);
      spark.setAttribute('opacity', ang >= SPARK - 6 && ang < SPARK + 6 ? 1 : 0);
    }
    for (const v of ['in', 'ex']) {
      const def = v === 'in' ? VALVES.intake : VALVES.exhaust;
      const lift = geo ? 0 : liftFrac(t, def) * LIFT;
      const x = v === 'in' ? IN_X : EX_X;
      valves[v].querySelector('.d-valve').setAttribute('transform', `translate(0 ${lift})`);
      valves[v].querySelector('.d-bucket').setAttribute('transform', `translate(0 ${lift})`);
      valves[v].querySelector('.spring').setAttribute('d', springPath(x, CAM_Y + CAM_BASE + 10 + lift, 84));
      valves[v].querySelector('.spring').setAttribute('class', 'spring d-spring');
      // lobe nose points down (toward the bucket) at peak lift
      const peak = norm720(def.open + norm720(def.close - def.open) / 2);
      cams[v].setAttribute('transform', `translate(${x} ${CAM_Y}) rotate(${(t - peak) / 2 + 180})`);
      flows[v].classList.toggle('is-on', !geo && lift > 1);
    }

    const s = strokeAt(t);
    if (geo) {
      const deg = Math.round(norm720(t) % 360);
      readout.innerHTML = `<span class="ro"><b>${deg}°</b> crank</span><span class="ro">piston ${deg < 180 ? '↓ moving down' : '↑ moving up'}</span>`;
    } else {
      const inO = isOpen(t, VALVES.intake), exO = isOpen(t, VALVES.exhaust);
      readout.innerHTML = `
        <span class="ro ro--stroke ro--${s.id}"><b>${s.name}</b>${mode === 'cycle' ? ` ${s.from}–${s.to}°` : ''}</span>
        <span class="ro mono">θ ${Math.round(norm720(t))}° · rev ${norm720(t) < 360 ? 1 : 2}/2</span>
        <span class="ro lamp ${inO ? 'is-on' : ''}">IN</span><span class="ro lamp lamp--ex ${exO ? 'is-on' : ''}">EX</span>`;
    }
  };

  const tl = timeline(wrap, { period, cycleMs: geo ? 3000 : 5200, start: spec.start ?? 0, onFrame: frame });
  return { destroy: () => tl.destroy(), timeline: tl };
}

export { STROKES };
