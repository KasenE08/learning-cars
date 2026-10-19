// Lab → CAN bench: the simulated Bronco, its bus, recorder and (Phase 6) challenges.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';
import { mountBench } from '../can/bench.js';

export const tab = 'lab';

export function render(view) {
  const screen = el(html`<div class="screen screen--wide">
    <a class="backlink" href="#/lab">${icons.back}Lab</a>
    ${pageHead('Lab', 'CAN bench', 'Drive a SIMULATED Bronco-Sport-like car and watch its bus. Message layouts are real (community openpilot DBC, not from Ford); the values come from a simple model.')}
    <div class="bn-chal"></div>
    <div class="bn-host"></div>
  </div>`);
  view.append(screen);
  const bench = mountBench(screen.querySelector('.bn-host'));
  let chal = null, alive = true;
  import('../can/challenges.js').then(({ mountChallenges }) => { if (alive) chal = mountChallenges(screen.querySelector('.bn-chal'), bench); }).catch(() => {});
  return () => { alive = false; bench.destroy(); chal?.destroy?.(); };
}
