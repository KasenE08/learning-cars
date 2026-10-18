import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';

export const tab = 'lab';

const DIAGRAMS = [
  { href: '#/explore/car', code: 'CAR', title: 'Bronco Sport X-ray', text: 'Top and side views. Tap a system, drill down to the engine, head, valve.' },
  { href: '#/explore/moto', code: 'MOTO', title: 'Sport bike X-ray', text: 'Ninja 500 / RS 457 class. Engine, clutch, chain drive, chassis, brakes, electronics.' },
  { href: '#/explore/drivetrain', code: '4X4', title: 'Bronco 4x4 torque flow', text: 'Pick a G.O.A.T. mode and a situation; watch the twin-clutch rear unit work.' },
];
const EXPLODED = [
  ['#/explore/engine?v=2', 'Engine'], ['#/explore/drivetrain?v=2', 'Gearbox'], ['#/explore/drivetrain?v=1', 'Differential'],
  ['#/explore/turbo', 'Turbo'], ['#/explore/drivetrain?v=3', 'Clutch'], ['#/explore/moto-clutch', 'Wet clutch'],
];
const SOON = [
  { code: 'PY', title: 'Python bench', text: 'Python in the browser (Pyodide). Parse a CAN frame → decode signals → write a log decoder → reverse-engineer an unknown signal.', phase: 5 },
  { code: 'CAN', title: 'CAN bus simulator', text: 'A simulated vehicle, modeled loosely on a Bronco Sport. Sniff traffic, change inputs, solve reverse-engineering challenges. Simulated data, not real Ford data.', phase: 6 },
  { code: 'OBD', title: 'Live car link', text: 'Laptop only (Chrome/Edge, Web Serial). Read-only: live PIDs and trouble codes from your car through a USB adapter.', phase: 7 },
];

export function render(view) {
  view.append(el(html`<div class="screen lab">
    ${pageHead('Tools', 'Lab', 'Diagrams to poke at, and (soon) code and a simulated CAN bus.')}
    <section class="section"><h2 class="h4">Interactive diagrams</h2>
      <div class="tool-grid">${DIAGRAMS.map((t) => html`<a class="plate plate--bolted tool" href="${t.href}">
        <span class="tool__top"><span class="tool__code mono">${t.code}</span>${icons.chevron}</span>
        <span class="h3">${t.title}</span><p class="muted">${t.text}</p></a>`)}</div>
    </section>
    <section class="section"><h2 class="h4">Exploded views</h2>
      <div class="xgrid">${EXPLODED.map(([href, t]) => html`<a class="plate xlink" href="${href}"><span class="h3">${t}</span>${icons.chevron}</a>`)}</div>
    </section>
    <section class="section"><h2 class="h4">Coming in later phases</h2>
      <div class="tool-grid">${SOON.map((t) => html`<div class="plate tool">
        <span class="tool__top"><span class="tool__code mono">${t.code}</span><span class="tape">Phase ${t.phase}</span></span>
        <span class="h3">${t.title}</span><p class="muted">${t.text}</p></div>`)}</div>
    </section>
  </div>`));
}
