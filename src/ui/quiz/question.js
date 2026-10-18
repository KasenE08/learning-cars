// Renders one quiz question of any type. Returns { el, value(), ready(), reveal(correct) }.
import { html, el } from '../dom.js';
import { rich } from '../rich.js';
import { mountVisual } from '../visuals/index.js';
import { shuffledOrder, parseNumber } from '../../core/quiz.js';

export function renderQuestion(q, { onChange, seed }) {
  const root = el(html`<div class="q q--${q.type}"><p class="q__text">${rich(q.q)}</p><div class="q__body"></div></div>`);
  const body = root.querySelector('.q__body');
  let api;

  if (q.type === 'mc') {
    const order = shuffledOrder(q.options.length, seed);
    let sel = null;
    body.append(el(html`<div class="opts">${order.map((i) => html`<button type="button" class="opt" data-i="${i}"><span class="opt__k mono"></span><span>${rich(q.options[i])}</span></button>`)}</div>`));
    body.querySelectorAll('.opt').forEach((b, k) => { b.querySelector('.opt__k').textContent = 'ABCDEF'[k]; });
    body.addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (!b || root.classList.contains('is-locked')) return;
      sel = Number(b.dataset.i);
      body.querySelectorAll('.opt').forEach((x) => x.classList.toggle('is-sel', x === b));
      onChange();
    });
    api = {
      value: () => sel,
      ready: () => sel != null,
      reveal() {
        body.querySelectorAll('.opt').forEach((b) => {
          const i = Number(b.dataset.i);
          b.classList.toggle('is-right', i === q.answer);
          b.classList.toggle('is-wrong', i === sel && sel !== q.answer);
        });
      },
      describe: (v) => q.options[v],
      answerText: () => q.options[q.answer],
    };
  }

  if (q.type === 'order') {
    const pool = shuffledOrder(q.items.length, seed);
    const picked = [];
    const draw = () => {
      body.innerHTML = String(html`
        <ol class="seq">${q.items.map((_, k) => html`<li class="seq__slot ${picked[k] != null ? 'is-filled' : ''}" data-k="${k}"><span class="mono">${k + 1}</span>${picked[k] != null ? html`<span>${rich(q.items[picked[k]])}</span>` : html`<span class="muted">tap an item below</span>`}</li>`)}</ol>
        <div class="pool">${pool.filter((i) => !picked.includes(i)).map((i) => html`<button type="button" class="pool__item" data-i="${i}">${rich(q.items[i])}</button>`)}</div>`);
    };
    body.addEventListener('click', (e) => {
      if (root.classList.contains('is-locked')) return;
      const item = e.target.closest('.pool__item');
      const slot = e.target.closest('.seq__slot.is-filled');
      if (item) picked.push(Number(item.dataset.i));
      else if (slot) picked.splice(Number(slot.dataset.k), 1);
      else return;
      draw();
      onChange();
    });
    draw();
    api = {
      value: () => picked.slice(),
      ready: () => picked.length === q.items.length,
      reveal() {
        body.querySelectorAll('.seq__slot').forEach((s, k) => {
          s.classList.toggle('is-right', picked[k] === k);
          s.classList.toggle('is-wrong', picked[k] !== k);
        });
      },
      describe: (v) => v.map((i) => q.items[i]).join(' → '),
      answerText: () => q.items.join(' → '),
    };
  }

  if (q.type === 'num') {
    body.append(el(html`<label class="numin"><input type="text" inputmode="decimal" autocomplete="off" placeholder="Your answer" aria-label="Answer">${q.unit ? html`<span class="numin__unit mono">${q.unit}</span>` : ''}</label>`));
    if (q.hint) body.append(el(html`<p class="q__hint">${rich(q.hint)}</p>`));
    const input = body.querySelector('input');
    input.addEventListener('input', onChange);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') root.dispatchEvent(new CustomEvent('submit-q', { bubbles: true })); });
    api = {
      value: () => input.value,
      ready: () => Number.isFinite(parseNumber(input.value)),
      reveal(correct) { input.disabled = true; root.querySelector('.numin').classList.add(correct ? 'is-right' : 'is-wrong'); },
      describe: (v) => `${v}${q.unit ? ` ${q.unit}` : ''}`,
      answerText: () => `${q.answer.toLocaleString('en-US')}${q.unit ? ` ${q.unit}` : ''}`,
    };
  }

  if (q.type === 'tap') {
    let vis = null;
    let sel = null;
    mountVisual(body, { ...q.visual, mode: 'quiz', onPick(p) { sel = p; onChange(); } }).then((v) => { vis = v; });
    api = {
      value: () => sel,
      ready: () => sel != null,
      reveal() { vis?.mark(q.answer, sel); },
      describe: (v) => vis?.name(v) ?? v,
      answerText: () => vis?.name(q.answer) ?? q.answer,
      destroy: () => vis?.destroy?.(),
    };
  }

  return { el: root, lock() { root.classList.add('is-locked'); }, ...api };
}
