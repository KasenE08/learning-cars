// Lesson player: steps (swipe or Next) → quiz → results. Finishing marks the lesson done,
// saves the quiz score (for mastery) and adds the lesson's flashcards to the deck.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { rich, termById } from '../rich.js';
import { trackTag } from '../components/parts.js';
import { openSheet } from '../components/sheet.js';
import { factBlock } from '../components/fact.js';
import { renderQuestion } from '../quiz/question.js';
import { mountVisual } from '../visuals/index.js';
import { getProgress, saveProgress, getCards, saveCards } from '../../core/store.js';
import { markDone, isDone } from '../../core/progress.js';
import { grade } from '../../core/quiz.js';
import { addLessonCards } from '../../core/review.js';
import { loadLesson } from '../../core/lessons.js';
import { lessonById, unitById, trackById, lessonCode, pathLessons } from '../../core/course.js';

export const tab = 'course';

const TAGS = { metaphor: 'Metaphor', how: 'How it works', see: 'See it', math: 'The math', bronco: 'On your Bronco', bikes: 'On the bikes', key: 'Key point', why: 'Why it matters', code: 'Try it in Python', law: 'The law', safety: 'Read-only rule' };

function placeholder(view, l) {
  view.append(el(html`<div class="screen lesson">
    <a class="backlink" href="#/course">${icons.back}Course</a>
    <header class="page-head"><span class="kicker mono">${lessonCode(l)}</span><h1 class="h1">${l.title}</h1>
      <p class="lesson__meta">${trackTag(l.track)}<span>${trackById(l.track).title} · ${unitById(l.unit).title}</span></p></header>
    <div class="plate plate--bolted placeholder"><span class="tape tape--wide">Under construction</span>
      <p>This lesson arrives in build phase ${l.phase}.</p></div>
  </div>`));
}

export function render(view, { id }) {
  const l = lessonById(id);
  if (!l) {
    view.append(el(html`<div class="screen"><p class="muted">No lesson called “${id}”.</p><a class="btn" href="#/course">Back to course</a></div>`));
    return;
  }
  let alive = true;
  let cleanup = () => {};
  document.body.classList.add('focus-mode');
  view.append(el(html`<div class="screen lesson-loading"><span class="kicker">Loading ${lessonCode(l)}…</span></div>`));
  loadLesson(id).then((content) => {
    if (!alive) return;
    view.replaceChildren();
    if (!content) { document.body.classList.remove('focus-mode'); placeholder(view, l); return; }
    cleanup = run(view, l, content);
  });
  return () => { alive = false; cleanup(); document.body.classList.remove('focus-mode'); };
}

function run(view, l, content) {
  const steps = content.steps;
  const quiz = content.quiz || [];
  const order = pathLessons();
  const next = order[order.findIndex((x) => x.id === l.id) + 1];
  const seed = Date.now() % 100000;

  const S = { phase: 'steps', i: 0, q: 0, answers: [], checked: false };
  // deep link to a step: #/lesson/<id>?s=3
  const sParam = Number(new URLSearchParams(location.hash.split('?')[1] || '').get('s'));
  if (sParam >= 1 && sParam <= steps.length) S.i = sParam - 1;
  let disposeVisual = () => {};
  let current = null;

  const shell = el(html`<div class="lr">
    <header class="lr__top">
      <a class="icon-btn lr__close" href="#/course" aria-label="Close lesson">${icons.close}</a>
      <div class="lr__prog" aria-hidden="true">${steps.map(() => html`<i></i>`)}<i class="is-quiz"></i></div>
      <span class="lr__count mono"></span>
    </header>
    <div class="lr__body"></div>
    <footer class="lr__foot"><button class="btn btn--ghost" data-back>${icons.back}<span>Back</span></button><button class="btn btn--primary" data-next><span>Next</span>${icons.chevron}</button></footer>
  </div>`);
  view.append(shell);
  const body = shell.querySelector('.lr__body');
  const back = shell.querySelector('[data-back]');
  const nextBtn = shell.querySelector('[data-next]');
  const bars = [...shell.querySelectorAll('.lr__prog i')];
  const count = shell.querySelector('.lr__count');

  const setNext = (label, { primary = true, disabled = false, icon = icons.chevron } = {}) => {
    nextBtn.innerHTML = `<span>${label}</span>${icon || ''}`;
    nextBtn.className = `btn ${primary ? 'btn--primary' : ''}`;
    nextBtn.disabled = disabled;
  };

  const paintProgress = () => {
    bars.forEach((b, k) => {
      const isQuiz = k === steps.length;
      b.classList.toggle('is-done', S.phase !== 'steps' ? !isQuiz || S.phase === 'done' : k < S.i);
      b.classList.toggle('is-now', S.phase === 'steps' ? k === S.i : isQuiz && S.phase === 'quiz');
      if (isQuiz && S.phase === 'quiz') b.style.setProperty('--q', `${(S.q / quiz.length) * 100}%`);
    });
  };

  function showStep() {
    disposeVisual();
    const st = steps[S.i];
    const v = st.visual ? html`<div class="step__vis"></div>` : '';
    const codeBox = st.code ? html`<div class="step__code"></div>` : '';
    const art = el(html`<article class="step">
      <span class="kicker kicker--accent step__tag">${TAGS[st.tag] || st.tag}</span>
      <h2 class="h2 step__title">${st.title}</h2>
      ${st.visualFirst ? v : ''}
      ${st.body?.length ? html`<ul class="bullets">${st.body.map((b) => html`<li>${rich(b)}</li>`)}</ul>` : ''}
      ${st.visualFirst ? '' : v}
      ${codeBox}
      ${st.facts?.length ? factBlock(st.facts) : ''}
      ${st.note ? html`<p class="step__note">${rich(st.note)}</p>` : ''}
    </article>`);
    body.replaceChildren(art);
    if (st.visual) {
      let api = null, dead = false;
      mountVisual(art.querySelector('.step__vis'), st.visual).then((a) => { if (dead) a.destroy?.(); else api = a; });
      disposeVisual = () => { dead = true; api?.destroy?.(); };
    } else disposeVisual = () => {};
    if (st.code) {
      const prev = disposeVisual;
      let ex = null, dead = false;
      import('../code/exercise.js').then(({ mountExercise }) => { if (!dead) ex = mountExercise(art.querySelector('.step__code'), st.code); });
      disposeVisual = () => { dead = true; prev(); ex?.destroy(); };
    }
    count.textContent = `${S.i + 1}/${steps.length}`;
    back.disabled = S.i === 0;
    setNext(S.i === steps.length - 1 ? (quiz.length ? 'Quiz' : 'Finish') : 'Next');
    paintProgress();
    window.scrollTo(0, 0);
  }

  function showQuestion() {
    disposeVisual();
    const q = quiz[S.q];
    S.checked = false;
    current = renderQuestion(q, { seed: seed + S.q, onChange: () => { if (!S.checked) setNext('Check', { disabled: !current.ready(), icon: '' }); } });
    const wrap = el(html`<article class="step step--quiz"><span class="kicker kicker--accent">Quiz · ${S.q + 1} of ${quiz.length}</span></article>`);
    wrap.append(current.el);
    wrap.addEventListener('submit-q', () => { if (!S.checked && current.ready()) check(); });
    body.replaceChildren(wrap);
    disposeVisual = () => current?.destroy?.();
    count.textContent = `Q${S.q + 1}/${quiz.length}`;
    back.disabled = true;
    setNext('Check', { disabled: true, icon: '' });
    paintProgress();
    window.scrollTo(0, 0);
  }

  function check() {
    const q = quiz[S.q];
    const value = current.value();
    const ok = grade(q, value);
    S.checked = true;
    S.answers[S.q] = { ok, given: current.describe(value) };
    current.lock();
    current.reveal(ok);
    const wrongWhy = !ok && q.wrong ? q.wrong[typeof value === 'number' || typeof value === 'string' ? value : ''] : null;
    const fb = el(html`<div class="fb ${ok ? 'fb--ok' : 'fb--bad'}" role="status">
      <b class="fb__head">${ok ? 'Correct.' : 'Wrong.'}</b>
      ${!ok ? html`<p><span class="muted">You said:</span> ${rich(current.describe(value))}${wrongWhy ? html` — ${rich(wrongWhy)}` : ''}</p><p><span class="muted">Answer:</span> <b>${rich(current.answerText())}</b></p>` : ''}
      <p>${rich(q.why)}</p>
    </div>`);
    body.querySelector('.step').append(fb);
    fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    setNext(S.q === quiz.length - 1 ? 'Results' : 'Next question');
  }

  async function finish() {
    disposeVisual();
    const correct = S.answers.filter((a) => a?.ok).length;
    const score = quiz.length ? correct / quiz.length : 1;
    const before = getProgress();
    const first = !isDone(before, l.id);
    let p = markDone(before, l.id);
    const prev = p.lessons[l.id].quiz;
    p = { ...p, lessons: { ...p.lessons, [l.id]: { ...p.lessons[l.id], quiz: { best: Math.max(prev?.best ?? 0, score), last: score, attempts: (prev?.attempts || 0) + 1 } } } };
    const { cards, added } = addLessonCards(getCards(), l.id, content.cards || []);
    await saveProgress(p);
    if (added) await saveCards(cards);
    S.phase = 'done';
    paintProgress();
    count.textContent = 'Done';
    const pct = Math.round(score * 100);
    body.replaceChildren(el(html`<article class="step results">
      <span class="kicker kicker--accent">${first ? 'Lesson complete' : 'Lesson reviewed'}</span>
      <h2 class="h2">${l.title}</h2>
      ${quiz.length ? html`<div class="results__score"><span class="mono results__num ${pct >= 75 ? 'is-good' : pct >= 50 ? '' : 'is-low'}">${correct}/${quiz.length}</span><span class="muted">${pct >= 100 ? 'Clean sweep.' : pct >= 75 ? 'Solid.' : pct >= 50 ? 'Getting there. The flashcards will drill the misses.' : 'Rough one. Worth a retake later.'}</span></div>
      <ul class="results__list">${quiz.map((q, k) => html`<li class="${S.answers[k]?.ok ? 'is-ok' : 'is-bad'}"><span class="tick">${S.answers[k]?.ok ? icons.check : icons.close}</span><span>${rich(q.q)}</span></li>`)}</ul>` : ''}
      <p class="results__cards mono">${added ? `+${added} flashcard${added === 1 ? '' : 's'} added to Review` : 'Flashcards already in your deck'}</p>
      <div class="btn-row">
        ${next ? html`<a class="btn btn--primary" href="#/lesson/${next.id}">Next: ${next.title}${icons.chevron}</a>` : ''}
        ${quiz.length ? html`<button class="btn" data-retake>Retake quiz</button>` : ''}
        <a class="btn btn--ghost" href="#/course">Course</a>
      </div>
    </article>`));
    body.querySelector('[data-retake]')?.addEventListener('click', () => { S.phase = 'quiz'; S.q = 0; S.answers = []; shell.classList.remove('is-done'); showQuestion(); });
    shell.classList.add('is-done');
    window.scrollTo(0, 0);
  }

  function forward() {
    if (S.phase === 'steps') {
      if (S.i < steps.length - 1) { S.i++; showStep(); }
      else if (quiz.length) { S.phase = 'quiz'; S.q = 0; showQuestion(); }
      else finish();
    } else if (S.phase === 'quiz') {
      if (!S.checked) { if (current.ready()) check(); return; }
      if (S.q < quiz.length - 1) { S.q++; showQuestion(); } else finish();
    }
  }
  function backward() {
    if (S.phase === 'steps' && S.i > 0) { S.i--; showStep(); }
  }
  nextBtn.addEventListener('click', forward);
  back.addEventListener('click', backward);

  // swipe between steps (not while touching a visual or during the quiz)
  let sx = 0, sy = 0, ok = false;
  body.addEventListener('touchstart', (e) => { ok = S.phase === 'steps' && !e.target.closest('[data-noswipe]'); sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  body.addEventListener('touchend', (e) => {
    if (!ok) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 50) (dx < 0 ? forward : backward)();
  }, { passive: true });
  const onKey = (e) => {
    if (e.target.closest?.('input, textarea')) return;
    if (e.key === 'ArrowRight') forward();
    if (e.key === 'ArrowLeft') backward();
  };
  document.addEventListener('keydown', onKey);

  // glossary links open a sheet instead of leaving the lesson
  body.addEventListener('click', (e) => {
    const a = e.target.closest('[data-gloss]');
    if (!a) return;
    e.preventDefault();
    const g = termById(a.dataset.gloss);
    if (!g) return;
    openSheet(el(html`<div class="dialog"><span class="kicker">Glossary</span><h3 class="h3">${g.term}</h3>${g.aka?.length ? html`<p class="mono muted" style="font-size:12px">${g.aka.join(' · ')}</p>` : ''}<p class="dialog__text">${g.def}</p></div>`));
  });

  showStep();
  return () => { disposeVisual(); document.removeEventListener('keydown', onKey); };
}
