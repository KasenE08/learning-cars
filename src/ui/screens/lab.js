import { html, el } from '../dom.js';
import { pageHead } from '../components/parts.js';

export const tab = 'lab';

const TOOLS = [
  { code: 'DIAG', title: 'Interactive diagrams', text: 'Full car and full bike you can drill into (car → engine → head → valve), plus exploded views.', phase: 3 },
  { code: 'PY', title: 'Python bench', text: 'Python in the browser (Pyodide). Parse a CAN frame → decode signals → write a log decoder → reverse-engineer an unknown signal.', phase: 5 },
  { code: 'CAN', title: 'CAN bus simulator', text: 'A simulated vehicle, modeled loosely on a Bronco Sport. Sniff traffic, change inputs, solve reverse-engineering challenges. Simulated data, not real Ford data.', phase: 6 },
  { code: 'OBD', title: 'Live car link', text: 'Laptop only (Chrome/Edge, Web Serial). Read-only: live PIDs and trouble codes from your car through a USB adapter.', phase: 7 },
];

export function render(view) {
  view.append(el(html`<div class="screen lab">
    ${pageHead('Tools', 'Lab', 'Hands-on tools. Each one arrives in its build phase.')}
    <div class="tool-grid">
      ${TOOLS.map((t) => html`<div class="plate plate--bolted tool">
        <span class="tool__top"><span class="tool__code mono">${t.code}</span><span class="tape">Phase ${t.phase}</span></span>
        <span class="h3">${t.title}</span>
        <p class="muted">${t.text}</p>
      </div>`)}
    </div>
  </div>`));
}
