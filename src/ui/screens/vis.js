// Visual test bench: #/vis/<type>?<json spec>. Used for screenshots and checking diagrams.
import { html, el } from '../dom.js';
import { mountVisual, visualTypes } from '../visuals/index.js';

export const tab = 'lab';

export function render(view, { type }) {
  const q = decodeURIComponent(location.hash.split('?')[1] || '');
  const spec = { type, ...(q ? JSON.parse(q) : {}) };
  const screen = el(html`<div class="screen"><span class="kicker">Visual bench · ${visualTypes.join(' · ')}</span><div class="host" style="max-width:640px;margin-top:12px"></div></div>`);
  view.append(screen);
  let v = null;
  mountVisual(screen.querySelector('.host'), spec).then((x) => { v = x; });
  return () => v?.destroy?.();
}
