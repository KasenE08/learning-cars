import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';

export const tab = 'lab';

const DIAGRAMS = [
  { href: '#/explore/car', code: 'CAR', title: 'Bronco Sport X-ray', text: 'Top and side views. Tap a system, drill down to the engine, head, valve.' },
  { href: '#/explore/moto', code: 'MOTO', title: 'Sport bike X-ray', text: 'Ninja 500 / RS 457 class. Engine, clutch, chain drive, chassis, brakes, electronics.' },
  { href: '#/lab/can', code: 'CAN', title: 'CAN bench', text: 'Drive a simulated Bronco-Sport-like car, watch its bus live, record and export captures, and work through 11 reverse-engineering challenges. Real message layouts, made-up values.' },
  { href: '#/lab/connect', code: 'OBD', title: 'Connect a car', text: 'Laptop + ELM327 adapter: read live data, trouble codes, readiness and the VIN from a real car. Strictly read-only. No adapter? A full demo runs on the simulated car.' },
  { href: '#/lab/python', code: 'PY', title: 'Python bench', text: 'Python in the app. A scratchpad with a simulated drive log, plus every exercise: parse a CAN frame, decode signals, write a log decoder, reverse-engineer an unknown signal.' },
  { href: '#/explore/drivetrain', code: '4X4', title: 'Bronco 4x4 torque flow', text: 'Pick a G.O.A.T. mode and a situation; watch the twin-clutch rear unit work.' },
];
const EXPLODED = [
  ['#/explore/engine?v=2', 'Engine'], ['#/explore/drivetrain?v=2', 'Gearbox'], ['#/explore/drivetrain?v=1', 'Differential'],
  ['#/explore/turbo', 'Turbo'], ['#/explore/drivetrain?v=3', 'Clutch'], ['#/explore/moto-clutch', 'Wet clutch'],
];
export function render(view) {
  view.append(el(html`<div class="screen lab">
    ${pageHead('Tools', 'Lab', 'Diagrams to poke at, a simulated CAN bus to sniff, and Python to write.')}
    <section class="section"><h2 class="h4">Interactive diagrams</h2>
      <div class="tool-grid">${DIAGRAMS.map((t) => html`<a class="plate plate--bolted tool" href="${t.href}">
        <span class="tool__top"><span class="tool__code mono">${t.code}</span>${icons.chevron}</span>
        <span class="h3">${t.title}</span><p class="muted">${t.text}</p></a>`)}</div>
    </section>
    <section class="section"><h2 class="h4">Exploded views</h2>
      <div class="xgrid">${EXPLODED.map(([href, t]) => html`<a class="plate xlink" href="${href}"><span class="h3">${t}</span>${icons.chevron}</a>`)}</div>
    </section>
  </div>`));
}
