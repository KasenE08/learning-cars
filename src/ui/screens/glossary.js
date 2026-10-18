import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';
import { glossary } from '../../content/glossary.js';
import { lessonById } from '../../core/course.js';

export const tab = 'glossary';

const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w ]/g, '');
const haystack = new Map(sorted.map((g) => [g.id, norm([g.term, ...(g.aka || []), g.def].join(' '))]));

function item(g, hot) {
  return html`<article class="gterm ${hot ? 'is-hot' : ''}" id="g-${g.id}" data-id="${g.id}">
    <h3 class="gterm__term">${g.term}${g.aka?.length ? html` <span class="gterm__aka">${g.aka.join(' · ')}</span>` : ''}</h3>
    <p class="gterm__def">${g.def}</p>
    ${g.lessons?.length ? html`<p class="gterm__links">${g.lessons.map(lessonById).filter(Boolean).map((l) => html`<a class="chip" href="#/lesson/${l.id}">${l.title}</a>`)}</p>` : ''}
  </article>`;
}

export function render(view, { term }) {
  const screen = el(html`<div class="screen glossary">
    ${pageHead(`${glossary.length} terms`, 'Glossary', 'Every term in the course. Lessons link here.')}
    <label class="search">${icons.search}<input type="search" placeholder="Search terms, e.g. stroke, TDC, CAN" autocomplete="off" spellcheck="false" aria-label="Search glossary"></label>
    <div class="glist">${sorted.map((g) => item(g, g.id === term))}</div>
    <p class="muted glist__none" hidden>No matching terms.</p>
  </div>`);
  const input = screen.querySelector('input');
  const none = screen.querySelector('.glist__none');
  input.addEventListener('input', () => {
    const q = norm(input.value.trim());
    let shown = 0;
    screen.querySelectorAll('.gterm').forEach((a) => {
      const hit = !q || haystack.get(a.dataset.id).includes(q);
      a.hidden = !hit;
      shown += hit;
    });
    none.hidden = shown > 0;
  });
  view.append(screen);
  if (term) requestAnimationFrame(() => screen.querySelector(`#g-${CSS.escape(term)}`)?.scrollIntoView({ block: 'center' }));
}
