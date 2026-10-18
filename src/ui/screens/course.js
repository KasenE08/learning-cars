import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { meter } from '../components/meter.js';
import { pageHead, trackTag, plannedTape, lessonRow } from '../components/parts.js';
import { getProgress } from '../../core/store.js';
import { nextUp, unitSummary } from '../../core/progress.js';
import { units, path, tracks, unitById, unitsOfTrack, allLessons, BUILT_PHASE } from '../../core/course.js';

export const tab = 'course';

function unitBlock(p, u, n, openId, nextId) {
  const s = unitSummary(p, u);
  const open = u.id === openId;
  return html`<section class="unit ${open ? 'is-open' : ''} ${s.done === s.total ? 'is-done' : ''}" data-unit="${u.id}">
    <button class="unit__head" aria-expanded="${open}" data-toggle="${u.id}">
      <span class="unit__n mono">${n}</span>
      <span class="unit__main">
        <span class="unit__meta">${trackTag(u.track)}${u.phase > BUILT_PHASE ? plannedTape(u.phase) : ''}</span>
        <span class="unit__title h3">${u.title}</span>
        <span class="unit__bar">${meter(s.done / s.total, { segs: u.lessons.length })}<span class="mono">${s.done}/${s.total}</span></span>
      </span>
      <span class="unit__chev">${icons.chevron}</span>
    </button>
    <div class="unit__lessons">${u.lessons.map((l) => lessonRow(p, l, { current: l.id === nextId }))}</div>
  </section>`;
}

export function render(view, { view: mode = 'path' }) {
  const p = getProgress();
  const next = nextUp(p);
  const openId = next?.unit ?? path[0];
  const total = allLessons().length;

  const body = mode === 'tracks'
    ? tracks.map((t) => html`<div class="track-block" id="${t.id}">
        <div class="track-block__head">${trackTag(t.id)}<h2 class="h2">${t.title}</h2><p class="muted">${t.blurb}</p></div>
        ${unitsOfTrack(t.id).map((u) => unitBlock(p, u, String(path.indexOf(u.id) + 1).padStart(2, '0'), openId, next?.id))}
      </div>`)
    : html`<div class="line">${path.map((id, i) => unitBlock(p, unitById(id), String(i + 1).padStart(2, '0'), openId, next?.id))}</div>`;

  const screen = el(html`<div class="screen course">
    ${pageHead(`${total} lessons · ${units.length} units`, 'Course', 'Recommended order, but everything is open. Jump in anywhere.')}
    <div class="seg" role="tablist">
      <a class="seg__btn ${mode === 'path' ? 'is-on' : ''}" role="tab" href="#/course/path" aria-selected="${mode === 'path'}">Path</a>
      <a class="seg__btn ${mode === 'tracks' ? 'is-on' : ''}" role="tab" href="#/course/tracks" aria-selected="${mode === 'tracks'}">By track</a>
    </div>
    ${body}
  </div>`);

  screen.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toggle]');
    if (!b) return;
    const sec = b.closest('.unit');
    const open = !sec.classList.contains('is-open');
    sec.classList.toggle('is-open', open);
    b.setAttribute('aria-expanded', open);
  });
  view.append(screen);

  // "#/course/tracks#mech" style deep links scroll to a track.
  const anchor = location.hash.split('#')[2];
  if (mode === 'tracks' && anchor) requestAnimationFrame(() => screen.querySelector(`#${CSS.escape(anchor)}`)?.scrollIntoView({ block: 'start' }));
}
