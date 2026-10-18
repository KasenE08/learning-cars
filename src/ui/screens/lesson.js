// Phase 1: lesson placeholder (metadata + a test toggle for progress). The lesson engine lands in Phase 2.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { trackTag } from '../components/parts.js';
import { getProgress, saveProgress } from '../../core/store.js';
import { isDone, markDone, markUndone } from '../../core/progress.js';
import { lessonById, unitById, trackById, lessonCode, pathLessons } from '../../core/course.js';

export const tab = 'course';

export function render(view, { id }) {
  const l = lessonById(id);
  if (!l) {
    view.append(el(html`<div class="screen"><p class="muted">No lesson called “${id}”.</p><a class="btn" href="#/course">Back to course</a></div>`));
    return;
  }
  const order = pathLessons();
  const i = order.findIndex((x) => x.id === id);
  const prev = order[i - 1];
  const next = order[i + 1];

  const draw = () => {
    const p = getProgress();
    const done = isDone(p, id);
    view.replaceChildren(el(html`<div class="screen lesson">
      <a class="backlink" href="#/course">${icons.back}Course</a>
      <header class="page-head">
        <span class="kicker mono">${lessonCode(l)}</span>
        <h1 class="h1">${l.title}</h1>
        <p class="lesson__meta">${trackTag(l.track)}<span>${trackById(l.track).title} · ${unitById(l.unit).title}</span><span class="dot"></span><span class="mono">${icons.clock}${l.min} min</span></p>
      </header>
      <div class="plate plate--bolted placeholder">
        <span class="tape tape--wide">Under construction</span>
        <p>This lesson’s content arrives in build phase ${l.phase}: metaphor first, then the mechanics, a diagram or animation, and a quiz.</p>
        <div class="placeholder__test">
          <span class="kicker">Test control (Phase 1 only)</span>
          <button class="btn ${done ? '' : 'btn--primary'}" data-toggle>${done ? 'Mark not done' : 'Mark done'}</button>
        </div>
      </div>
      <nav class="pager">
        ${prev ? html`<a class="plate pager__btn" href="#/lesson/${prev.id}"><span class="kicker">${icons.back} Previous</span><span>${prev.title}</span></a>` : html`<span></span>`}
        ${next ? html`<a class="plate pager__btn pager__btn--next" href="#/lesson/${next.id}"><span class="kicker">Next ${icons.chevron}</span><span>${next.title}</span></a>` : ''}
      </nav>
    </div>`));
    view.querySelector('[data-toggle]').addEventListener('click', async () => {
      const cur = getProgress();
      await saveProgress(isDone(cur, id) ? markUndone(cur, id) : markDone(cur, id));
      draw();
    });
  };
  draw();
}
