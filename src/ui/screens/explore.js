import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { chips } from '../visuals/controls.js';
import { mountVisual } from '../visuals/index.js';
import { factBlock } from '../components/fact.js';
import { nodes, trail } from '../../content/explorer.js';

export const tab = 'lab';

export function render(view, { node: id = 'car' }) {
  const n = nodes[id];
  if (!n) { view.append(el(html`<div class="screen"><p class="muted">Nothing called “${id}”.</p><a class="btn" href="#/lab">Lab</a></div>`)); return; }
  const path = trail(id);
  const screen = el(html`<div class="screen explore">
    <nav class="crumbs mono" aria-label="Breadcrumb"><a href="#/lab">${icons.back}Lab</a>${path.map((p, i) => html`<span>/</span>${i === path.length - 1 ? html`<b>${nodes[p].title}</b>` : html`<a href="#/explore/${p}">${nodes[p].title}</a>`}`)}</nav>
    <header class="page-head"><span class="kicker">${n.kicker}</span><h1 class="h1">${n.title}</h1>${n.intro ? html`<p class="page-head__sub">${n.intro}</p>` : ''}</header>
    <div class="explore__views"></div>
    <div class="explore__host"></div>
    ${n.facts?.length ? html`<section class="section"><h2 class="h4">Specs · with sources</h2>${factBlock(n.facts)}</section>` : ''}
  </div>`);
  view.append(screen);
  const host = screen.querySelector('.explore__host');
  let current = null;
  const show = (k) => {
    current?.destroy?.();
    host.replaceChildren();
    const v = n.views[k];
    mountVisual(host, { ...v.visual, drills: n.drills }).then((api) => { current = api; });
  };
  const want = Number(new URLSearchParams(location.hash.split('?')[1] || '').get('v')) || 0;
  const first = n.views[want] ? want : 0;
  if (n.views.length > 1) {
    const c = chips(n.views.map((v, k) => ({ value: k, label: v.label })), { value: first, onPick: show });
    screen.querySelector('.explore__views').append(c.el);
  }
  show(first);
  return () => current?.destroy?.();
}
