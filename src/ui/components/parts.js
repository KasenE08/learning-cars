// Small shared view pieces.
import { html } from '../dom.js';
import { icons } from '../icons.js';
import { trackById, lessonCode, isAvailable } from '../../core/course.js';
import { isDone } from '../../core/progress.js';

export const pageHead = (kicker, title, sub = '') => html`<header class="page-head">
  <span class="kicker">${kicker}</span>
  <h1 class="h1">${title}</h1>
  ${sub ? html`<p class="page-head__sub">${sub}</p>` : ''}
</header>`;

export const trackTag = (trackId) => html`<span class="tag tag--${trackId}">${trackById(trackId).code}</span>`;

export const plannedTape = (phase) => html`<span class="tape" title="Content arrives in build phase ${phase}">Phase ${phase}</span>`;

/** One lesson row: tick, code, title, minutes. */
export function lessonRow(p, l, { current = false } = {}) {
  const done = isDone(p, l.id);
  return html`<a class="lrow ${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${isAvailable(l) ? '' : 'is-planned'}" href="#/lesson/${l.id}">
    <span class="tick" aria-label="${done ? 'Done' : 'Not done'}">${done ? icons.check : ''}</span>
    <span class="lrow__main">
      <span class="lrow__code mono">${lessonCode(l)}</span>
      <span class="lrow__title">${l.title}</span>
    </span>
    <span class="lrow__min mono">${l.min} min</span>
  </a>`;
}
