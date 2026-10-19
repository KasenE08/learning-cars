// Tappable horizontal timeline. spec: { title?, events: [{ year, title, note? }] }
import { html, el } from '../dom.js';

export function mount(host, spec = {}) {
  const ev = (spec.events || []).slice().sort((a, b) => a.year - b.year);
  const wrap = el(html`<figure class="vis tlx" data-noswipe>
    ${spec.title ? html`<span class="kicker">${spec.title}</span>` : ''}
    <div class="tlx__track"><div class="tlx__line"></div>${ev.map((e, i) => html`<button type="button" class="tlx__ev" data-i="${i}"><span class="tlx__dot"></span><span class="tlx__y mono">${e.year}</span><span class="tlx__t">${e.title}</span></button>`)}</div>
    <div class="part-info tlx__info"><p class="part-info__hint">Tap a year.</p></div></figure>`);
  host.append(wrap);
  const info = wrap.querySelector('.tlx__info');
  const pick = (i) => {
    wrap.querySelectorAll('.tlx__ev').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.i) === i));
    const e = ev[i];
    info.innerHTML = String(html`<span class="part-info__name">${e.year} · ${e.title}</span>${e.note ? html`<p class="part-info__does">${e.note}</p>` : ''}`);
  };
  wrap.querySelector('.tlx__track').addEventListener('click', (e) => { const b = e.target.closest('.tlx__ev'); if (b) pick(Number(b.dataset.i)); });
  if (ev.length) pick(0);
  return { destroy() {} };
}
