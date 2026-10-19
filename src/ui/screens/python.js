// Lab → Python bench: a free scratchpad plus every exercise in the course, with solved state.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';
import { lessonsOfTrack, lessonCode } from '../../core/course.js';
import { loadLesson, hasContent } from '../../core/lessons.js';
import { getProgress } from '../../core/store.js';

export const tab = 'lab';

const SCRATCH = {
  id: 'scratchpad',
  starter: `# Scratchpad: try anything. Nothing here is graded.
# A SIMULATED drive log (real Ford message layouts,
# made-up values) is in the file drive.log.

with open("drive.log") as f:
    lines = f.read().splitlines()

print(len(lines), "frames")
for line in lines[:5]:
    print(line)
`,
  files: { 'drive.log': 'sim:drive' },
};

export function render(view) {
  let alive = true, ex = null;
  const screen = el(html`<div class="screen">
    <a class="backlink" href="#/lab">${icons.back}Lab</a>
    ${pageHead('Lab', 'Python bench', 'Python running inside the app (Pyodide). The first run downloads it once (≈ 13 MB); after that it works offline.')}
    <section class="section"><div class="py-scratch"></div></section>
    <section class="section"><h2 class="h4">Exercises</h2><div class="py-list"><p class="muted">Loading…</p></div></section>
  </div>`);
  view.append(screen);
  import('../code/exercise.js').then(({ mountExercise }) => { if (alive) ex = mountExercise(screen.querySelector('.py-scratch'), SCRATCH); });

  (async () => {
    const lessons = lessonsOfTrack('tech').filter((l) => hasContent(l.id));
    const rows = [];
    for (const l of lessons) {
      const c = await loadLesson(l.id);
      c?.steps.forEach((st, i) => { if (st.code?.tests?.length) rows.push({ l, i, st }); });
    }
    if (!alive) return;
    const done = getProgress().exercises || {};
    const box = screen.querySelector('.py-list');
    if (!rows.length) { box.innerHTML = '<p class="muted">Exercises arrive with the Track 4 lessons.</p>'; return; }
    const solved = rows.filter((r) => done[r.st.code.id]?.solved).length;
    box.replaceChildren(el(html`<div>
      <p class="mono muted py-count">${solved} of ${rows.length} solved</p>
      <ul class="py-rows">${rows.map((r) => html`<li><a class="plate py-row ${done[r.st.code.id]?.solved ? 'is-solved' : ''}" href="#/lesson/${r.l.id}?s=${r.i + 1}">
        <span class="tick">${done[r.st.code.id]?.solved ? icons.check : ''}</span>
        <span class="py-row__text"><span class="mono muted">${lessonCode(r.l)}</span><b>${r.st.title}</b></span>${icons.chevron}</a></li>`)}</ul>
    </div>`));
  })();

  return () => { alive = false; ex?.destroy(); };
}
