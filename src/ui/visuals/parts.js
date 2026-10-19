// Tappable parts diagram. spec: { drawing, mode: 'explore' | 'quiz', labels?: boolean }
// Explore: tap a part → name, what it does, what it connects to, where it lives.
// Quiz: tap selects; the quiz calls mark(right, wrong) after checking.
import { html, el } from '../dom.js';
import { uid } from './svg.js';
import * as piston from './drawings/piston.js';
import * as head from './drawings/head.js';
import * as engineSection from './drawings/engine-section.js';
import * as carTop from './drawings/car-top.js';
import * as carSide from './drawings/car-side.js';
import * as motoSide from './drawings/moto-side.js';
import * as rdu from './drawings/rdu.js';
import * as intake from './drawings/intake.js';
import * as fuel from './drawings/fuel.js';
import * as exhaust from './drawings/exhaust.js';
import * as cooling from './drawings/cooling.js';
import * as oil from './drawings/oil.js';
import * as charging from './drawings/charging.js';
import * as brakes from './drawings/brakes.js';
import * as ecu from './drawings/ecu.js';

export const drawings = { piston, head, 'engine-section': engineSection, 'car-top': carTop, 'car-side': carSide, 'moto-side': motoSide, rdu, intake, fuel, exhaust, cooling, oil, charging, brakes, ecu };

export function mount(host, spec = {}) {
  const d = drawings[spec.drawing];
  if (!d) throw new Error(`Unknown drawing ${spec.drawing}`);
  const quiz = spec.mode === 'quiz';
  let labels = !quiz && (spec.labels ?? d.defaultLabels ?? true);
  const id = uid('pt');

  const wrap = el(html`<figure class="vis vis--parts" data-noswipe></figure>`);
  const drawSvg = () => `<svg viewBox="${d.viewBox}" class="d" role="img" aria-label="Tappable diagram">${d.svg(id, { labels })}</svg>`;
  wrap.innerHTML = drawSvg();
  const info = el(html`<div class="part-info" aria-live="polite"><p class="part-info__hint">${quiz ? 'Tap a part to select it.' : 'Tap any part.'}</p></div>`);
  if (!quiz && d.labelsBuiltIn) wrap.append(info);
  if (!quiz && !d.labelsBuiltIn) {
    const tog = el(html`<button class="pchip ${labels ? 'is-on' : ''}" type="button" style="margin-top:8px">Labels</button>`);
    tog.addEventListener('click', () => {
      labels = !labels;
      tog.classList.toggle('is-on', labels);
      const sel = selected;
      wrap.querySelector('svg').outerHTML = drawSvg();
      bind();
      if (sel) select(sel);
    });
    wrap.append(tog, info);
  }
  host.append(wrap);

  let selected = null;
  const svgEl = () => wrap.querySelector('svg');
  function select(part) {
    selected = part;
    svgEl().classList.toggle('has-sel', !!part);
    svgEl().querySelectorAll('[data-part]').forEach((g) => g.classList.toggle('is-sel', g.dataset.part === part));
    if (!quiz && part) {
      const p = d.parts[part];
      const drill = spec.drills?.[part];
      info.innerHTML = String(html`<span class="part-info__name">${p.name}</span><dl><dt>Does</dt><dd>${p.does}</dd><dt>Connects</dt><dd>${p.connects}</dd><dt>Lives</dt><dd>${p.where}</dd></dl>
        ${drill || p.lesson ? html`<div class="part-info__go">${drill ? html`<a class="btn btn--primary" href="#/explore/${drill}">Drill in ›</a>` : ''}${p.lesson ? html`<a class="btn btn--ghost" href="#/lesson/${p.lesson}">Lesson ›</a>` : ''}</div>` : ''}`);
    }
    spec.onPick?.(part);
  }
  function bind() {
    svgEl().querySelectorAll('[data-part]').forEach((g) => {
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', d.parts[g.dataset.part]?.name || g.dataset.part);
      g.addEventListener('click', (e) => { e.stopPropagation(); if (!wrap.classList.contains('is-locked')) select(g.dataset.part); });
    });
  }
  bind();

  return {
    destroy() {},
    value: () => selected,
    name: (part) => d.parts[part]?.name || part,
    mark(right, wrong) {
      wrap.classList.add('is-locked');
      svgEl().classList.add('has-sel');
      svgEl().querySelectorAll('[data-part]').forEach((g) => {
        g.classList.remove('is-sel');
        g.classList.toggle('is-right', g.dataset.part === right);
        g.classList.toggle('is-wrong', g.dataset.part === wrong && wrong !== right);
      });
    },
  };
}
