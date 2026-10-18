// Small control builders for interactive visuals.
import { html, el } from '../dom.js';

export function slider({ label, min, max, step = 1, value, fmt = (v) => v, onInput }) {
  const row = el(html`<label class="ctl__row"><span>${label}</span><input class="rng" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output></output></label>`);
  const input = row.querySelector('input');
  const out = row.querySelector('output');
  const paint = () => {
    const v = Number(input.value);
    out.textContent = fmt(v);
    input.style.setProperty('--p', `${((v - min) / (max - min)) * 100}%`);
  };
  input.addEventListener('input', () => { paint(); onInput(Number(input.value)); });
  paint();
  return { el: row, set(v) { input.value = v; paint(); }, get: () => Number(input.value) };
}

export function chips(options, { value, onPick }) {
  const box = el(html`<div class="ctl__chips">${options.map((o) => html`<button type="button" class="pchip ${o.value === value ? 'is-on' : ''}" data-v="${o.value}">${o.label}</button>`)}</div>`);
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    box.querySelectorAll('.pchip').forEach((x) => x.classList.toggle('is-on', x === b));
    const o = options.find((x) => String(x.value) === b.dataset.v);
    onPick(o.value);
  });
  return { el: box, set(v) { box.querySelectorAll('.pchip').forEach((x) => x.classList.toggle('is-on', x.dataset.v === String(v))); } };
}

export const fmt1 = (v) => (Math.round(v * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmt0 = (v) => Math.round(v).toLocaleString('en-US');
