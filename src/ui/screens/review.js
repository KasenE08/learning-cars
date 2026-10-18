import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { rich } from '../rich.js';
import { pageHead } from '../components/parts.js';
import { getCards, saveCards } from '../../core/store.js';
import { dueCards } from '../../core/review.js';
import { grade, preview, fmtInterval, GRADES } from '../../core/fsrs.js';
import { loadLesson } from '../../core/lessons.js';
import { lessonById, lessonCode } from '../../core/course.js';

export const tab = 'review';
const SOON = 15 * 60 * 1000; // cards due again within 15 min come back in this session

async function cardText(card) {
  const [lessonId, cardId] = card.id.split(':');
  const content = await loadLesson(lessonId);
  return content?.cards?.find((c) => c.id === cardId) || null;
}

function stats(cards, now = Date.now()) {
  const all = Object.values(cards);
  const next = all.filter((c) => c.s.due > now).sort((a, b) => a.s.due - b.s.due)[0];
  return {
    total: all.length,
    fresh: all.filter((c) => c.s.state === 0).length,
    learning: all.filter((c) => c.s.state === 1 || c.s.state === 3).length,
    review: all.filter((c) => c.s.state === 2).length,
    next: next ? next.s.due - now : null,
  };
}

export function render(view) {
  let queue = dueCards().map((c) => c.id);
  let done = 0;
  const screen = el(html`<div class="screen review">${pageHead('Spaced repetition · FSRS', 'Review', 'Only what’s due. Grade honestly: it sets when you see each card again.')}<div class="rv"></div></div>`);
  const box = screen.querySelector('.rv');
  view.append(screen);

  const empty = () => {
    const s = stats(getCards());
    box.innerHTML = String(html`<div class="plate plate--bolted empty">
      <span class="stat__num mono">0</span>
      <span class="h3">${done ? `Done · ${done} reviewed` : 'Nothing due'}</span>
      <p class="muted">${s.total ? (s.next != null ? `Next card due in ${fmtInterval(s.next)}.` : '') : 'Finish a lesson and its flashcards show up here.'}</p>
      ${s.total ? html`<p class="mono muted" style="font-size:12px">${s.total} cards · ${s.fresh} new · ${s.learning} learning · ${s.review} in review</p>` : ''}
    </div>`);
  };

  async function show() {
    if (!queue.length) {
      // pull in anything that became due during the session
      queue = dueCards(Date.now() + 1000).map((c) => c.id);
      if (!queue.length) return empty();
    }
    const card = getCards()[queue[0]];
    const text = card && (await cardText(card));
    if (!text) { queue.shift(); return show(); }
    const l = lessonById(card.lesson);
    const prev = preview(card);
    const now = Date.now();
    box.innerHTML = String(html`
      <div class="rv__meta mono"><span>${queue.length} due</span><span>${l ? lessonCode(l) : ''}</span></div>
      <div class="plate plate--bolted rv__card">
        <span class="kicker kicker--accent">${card.s.state === 0 ? 'New card' : 'Review'}</span>
        <p class="rv__front">${rich(text.front)}</p>
        <div class="rv__back" hidden>${rich(text.back)}</div>
      </div>
      <button class="btn btn--primary" data-show style="min-height:52px">Show answer</button>
      <div class="grades" hidden>${GRADES.map((g) => html`<button class="grade grade--${g.key}" data-r="${g.rating}" title="${g.hint}"><b>${g.label}</b><small>${fmtInterval(prev[g.rating] - now)}</small></button>`)}</div>
      ${l ? html`<a class="backlink" href="#/lesson/${l.id}">${icons.course}Open lesson: ${l.title}</a>` : ''}`);
    box.querySelector('[data-show]').addEventListener('click', (e) => {
      e.currentTarget.hidden = true;
      box.querySelector('.rv__back').hidden = false;
      box.querySelector('.grades').hidden = false;
    });
    box.querySelector('.grades').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      const t = Date.now();
      const next = grade(card, Number(b.dataset.r), t);
      await saveCards({ ...getCards(), [card.id]: next });
      done++;
      queue.shift();
      if (next.s.due - t < SOON) queue.push(card.id);
      show();
    });
  }
  show();
}
