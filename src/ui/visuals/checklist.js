// Tappable inspection checklist (not saved). spec: { title?, groups: [{ name, items: [{ check, why }] }] }
import { html, el } from '../dom.js';
import { icons } from '../icons.js';

export function mount(host, spec = {}) {
  const groups = spec.groups || [];
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const wrap = el(html`<figure class="vis ckl" data-noswipe>
    <div class="ckl__top">${spec.title ? html`<span class="kicker">${spec.title}</span>` : html`<span></span>`}<span class="mono ckl__n">0/${total}</span></div>
    <span class="meter"><i style="width:0%"></i></span>
    ${groups.map((g, gi) => html`<section class="ckl__g"><h4 class="h4">${g.name}</h4>${g.items.map((it, ii) => html`<button type="button" class="ckl__it" data-k="${gi}-${ii}"><span class="tick">${icons.check}</span><span><b>${it.check}</b><small>${it.why}</small></span></button>`)}</section>`)}
  </figure>`);
  host.append(wrap);
  const done = new Set();
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('.ckl__it'); if (!b) return;
    const k = b.dataset.k;
    done.has(k) ? done.delete(k) : done.add(k);
    b.classList.toggle('is-done', done.has(k));
    wrap.querySelector('.ckl__n').textContent = `${done.size}/${total}`;
    wrap.querySelector('.meter i').style.width = `${(done.size / total) * 100}%`;
  });
  return { destroy() {} };
}
