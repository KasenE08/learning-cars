// Compact CAN bench inside a lesson. spec: { controls?: [...], view?: 'log'|'table'|'decode', ids?: [numbers], names?: boolean }
// controls: pedals, steer, shifter, turn, lights, wipers, doors, belt, parkbrake, ignition
import { html, el } from '../../dom.js';
import { mountBench } from '../../can/bench.js';

export function mount(host, spec = {}) {
  const wrap = el(html`<figure class="vis" data-noswipe></figure>`);
  host.append(wrap);
  const b = mountBench(wrap, { compact: true, controls: spec.controls || ['pedals', 'shifter', 'turn'], view: spec.view || 'table', ids: spec.ids, names: !!spec.names, record: false, keyboard: false });
  wrap.append(el(html`<p class="vis__note">SIMULATED car: real message layouts (community openpilot DBC), made-up values. The full bench with recording and challenges is in Lab → <a href="#/lab/can">CAN bench</a>.</p>`));
  return { destroy: () => b.destroy() };
}
