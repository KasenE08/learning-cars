import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { meter, pct } from '../components/meter.js';
import { pageHead, trackTag } from '../components/parts.js';
import { getProgress } from '../../core/store.js';
import { nextUp, overallSummary } from '../../core/progress.js';
import { unitById, lessonCode } from '../../core/course.js';
import { dueCount, retentionByLesson } from '../../core/review.js';

export const tab = 'home';

export function render(view) {
  const p = getProgress();
  const next = nextUp(p);
  const all = overallSummary(p, retentionByLesson());
  const due = dueCount();

  view.append(el(html`<div class="screen home">
    ${pageHead('Shop floor', 'Learning Cars', 'Pistons to packets. One short lesson whenever you’re bored.')}

    ${next ? html`<a class="plate plate--bolted upnext" href="#/lesson/${next.id}">
      <span class="upnext__label kicker kicker--accent">Up next</span>
      <span class="upnext__code mono">${lessonCode(next)}</span>
      <span class="upnext__title h2">${next.title}</span>
      <span class="upnext__meta">${trackTag(next.track)} <span>${unitById(next.unit).title}</span><span class="dot"></span><span class="mono">${icons.clock}${next.min} min</span></span>
      <span class="btn btn--primary upnext__go">${icons.play}Start</span>
    </a>` : html`<div class="plate plate--bolted upnext"><span class="kicker kicker--accent">Course complete</span><span class="h2">Every lesson done.</span><span class="muted">Reviews keep it fresh.</span></div>`}

    <div class="home__row">
      <a class="plate stat" href="#/review">
        <span class="kicker">Review</span>
        <span class="stat__num mono ${due ? 'is-hot' : ''}">${due}</span>
        <span class="stat__sub">${due ? `card${due === 1 ? '' : 's'} due` : 'nothing due'}</span>
      </a>
      <a class="plate stat" href="#/progress">
        <span class="kicker">Lessons</span>
        <span class="stat__num mono">${all.done}<small>/${all.total}</small></span>
        <span class="stat__sub">${pct(all.mastery)} mastery</span>
      </a>
    </div>

    <section class="section">
      <h2 class="h4">Tracks</h2>
      <div class="track-grid">
        ${all.tracks.map((t) => html`<a class="plate track-card" href="#/course/tracks#${t.track.id}">
          <span class="track-card__top">${trackTag(t.track.id)}<span class="mono muted">${t.done}/${t.total}</span></span>
          <span class="h3">${t.track.title}</span>
          ${meter(t.mastery)}
        </a>`)}
      </div>
    </section>

    <section class="section">
      <h2 class="h4">Reference vehicles</h2>
      <div class="vehicles">
        <div class="plate vehicle">${icons.car}<span><b>2024 Ford Bronco Sport Badlands</b><small>Yours. Used across every track.</small></span></div>
        <div class="plate vehicle">${icons.bike}<span><b>Kawasaki Ninja 500 · Aprilia RS 457</b><small>The two bikes you’re choosing between.</small></span></div>
      </div>
    </section>
  </div>`));
}
