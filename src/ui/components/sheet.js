// Bottom sheet (phone) / centered dialog (laptop). Returns a close function.
import { html, el } from '../dom.js';

export function openSheet(content) {
  const wrap = el(html`<div class="sheet" role="dialog" aria-modal="true"><div class="sheet__scrim" data-close></div><div class="sheet__panel plate"></div></div>`);
  wrap.querySelector('.sheet__panel').append(content);
  const close = () => {
    wrap.classList.remove('is-open');
    setTimeout(() => wrap.remove(), 220);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  wrap.querySelector('[data-close]').addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.append(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-open'));
  return close;
}

export function message(title, text) {
  const body = el(html`<div class="dialog"><h3 class="h3">${title}</h3><p class="dialog__text">${text}</p><div class="btn-row"><button class="btn" data-ok>OK</button></div></div>`);
  const close = openSheet(body);
  body.querySelector('[data-ok]').addEventListener('click', close);
  return close;
}

export function confirmSheet({ kicker = '', title, text, yes = 'Confirm', danger = false }) {
  return new Promise((resolve) => {
    const body = el(html`<div class="dialog">
      ${kicker ? html`<span class="kicker">${kicker}</span>` : ''}
      <h3 class="h3">${title}</h3><p class="dialog__text">${text}</p>
      <div class="btn-row"><button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-yes>${yes}</button><button class="btn btn--ghost" data-no>Cancel</button></div>
    </div>`);
    let done = false;
    const close = openSheet(body);
    const finish = (v) => { if (done) return; done = true; close(); resolve(v); };
    body.querySelector('[data-yes]').addEventListener('click', () => finish(true));
    body.querySelector('[data-no]').addEventListener('click', () => finish(false));
    body.closest('.sheet').querySelector('[data-close]').addEventListener('click', () => finish(false));
  });
}
