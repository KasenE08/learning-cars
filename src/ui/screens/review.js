import { html, el } from '../dom.js';
import { pageHead } from '../components/parts.js';
import { dueCount } from '../../core/review.js';
import { getCards } from '../../core/store.js';

export const tab = 'review';

export function render(view) {
  const due = dueCount();
  const total = Object.keys(getCards()).length;
  view.append(el(html`<div class="screen review">
    ${pageHead('Spaced repetition', 'Review', 'Only what’s due. Cards are made for you from lessons you finish.')}
    <div class="plate plate--bolted empty">
      <span class="stat__num mono">${due}</span>
      <span class="h3">${due ? 'cards due' : 'Nothing due'}</span>
      <p class="muted">${total ? `${total} cards in your deck.` : 'Finish a lesson and its flashcards show up here on a schedule.'}</p>
      <span class="tape">FSRS scheduler · Phase 2</span>
    </div>
  </div>`));
}
