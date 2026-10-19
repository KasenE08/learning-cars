import { html, el } from '../dom.js';
import { meter, pct } from '../components/meter.js';
import { pageHead, trackTag } from '../components/parts.js';
import { getProgress } from '../../core/store.js';
import { overallSummary, unitSummary } from '../../core/progress.js';
import { unitsOfTrack } from '../../core/course.js';
import { retentionByLesson } from '../../core/review.js';

export const tab = 'progress';

export function render(view) {
  const p = getProgress();
  const ret = retentionByLesson();
  const all = overallSummary(p, ret);
  const solved = Object.values(p.exercises || {}).filter((e) => e?.solved).length;
  view.append(el(html`<div class="screen progress">
    ${pageHead('Readout', 'Progress', 'Lessons done and mastery. Mastery = finished + quiz score + how well you remember the cards.')}
    <div class="home__row">
      <div class="plate stat"><span class="kicker">Lessons done</span><span class="stat__num mono">${all.done}<small>/${all.total}</small></span>${meter(all.done / all.total)}</div>
      <div class="plate stat"><span class="kicker">Mastery</span><span class="stat__num mono">${pct(all.mastery)}</span>${meter(all.mastery, { tone: 'yellow' })}</div>
      <a class="plate stat" href="#/lab/python" style="grid-column:1/-1;text-decoration:none;color:inherit"><span class="kicker">Python exercises solved</span><span class="stat__num mono">${solved}</span><span class="muted" style="font-size:12px">See all on the Python bench →</span></a>
    </div>
    ${all.tracks.map((t) => html`<section class="plate ptrack">
      <header class="ptrack__head">${trackTag(t.track.id)}<h2 class="h3">${t.track.title}</h2><span class="mono muted">${t.done}/${t.total} · ${pct(t.mastery)}</span></header>
      <ul class="punits">
        ${unitsOfTrack(t.track.id).map((u) => {
          const s = unitSummary(p, u, ret);
          return html`<li><span class="punits__t">${u.title}</span><span class="mono muted">${s.done}/${s.total}</span>${meter(s.mastery, { segs: u.lessons.length })}</li>`;
        })}
      </ul>
    </section>`)}
  </div>`));
}
