// Challenge ladder shown above the CAN bench. Progress is saved (and included in backups).
import { html, el } from '../dom.js';
import { rich } from '../rich.js';
import { icons } from '../icons.js';
import { CHALLENGES, gradeChallenge, answerOf } from '../../content/challenges.js';
import { getProgress, saveProgress } from '../../core/store.js';

const recOf = (id) => getProgress().challenges?.[id] || {};
async function saveRec(id, patch) {
  const p = getProgress();
  await saveProgress({ ...p, challenges: { ...(p.challenges || {}), [id]: { ...(p.challenges?.[id] || {}), ...patch } } });
}

export function mountChallenges(host, _bench, { start } = {}) {
  const want = start || new URLSearchParams(location.hash.split('?')[1] || '').get('c');
  const firstOpen = CHALLENGES.findIndex((c) => !recOf(c.id).solved);
  const S = { i: Math.max(0, CHALLENGES.findIndex((c) => c.id === want)), hints: 0, open: !!want };
  if (!want) S.i = firstOpen < 0 ? 0 : firstOpen;
  const wrap = el(html`<section class="ch">
    <button type="button" class="ch__head" aria-expanded="false"><span class="kicker">Challenges</span><span class="ch__count mono"></span><span class="ch__chev">${icons.chevron}</span></button>
    <div class="ch__body" hidden></div>
  </section>`);
  host.append(wrap);
  const body = wrap.querySelector('.ch__body'), head = wrap.querySelector('.ch__head');

  function paintCount() {
    const n = CHALLENGES.filter((c) => recOf(c.id).solved).length;
    wrap.querySelector('.ch__count').textContent = `${n} / ${CHALLENGES.length} solved`;
  }
  function setOpen(o) { S.open = o; body.hidden = !o; head.setAttribute('aria-expanded', String(o)); wrap.classList.toggle('is-open', o); if (o) draw(); }

  function draw() {
    const ch = CHALLENGES[S.i], rec = recOf(ch.id);
    body.replaceChildren(el(html`<div>
      <div class="ch__nav">${CHALLENGES.map((c, k) => html`<button type="button" class="ch__dot ${k === S.i ? 'is-now' : ''} ${recOf(c.id).solved ? 'is-solved' : ''}" data-k="${k}" aria-label="${c.title}">${k + 1}</button>`)}</div>
      <article class="ch__card ${rec.solved ? 'is-solved' : ''}">
        <span class="kicker kicker--accent">Level ${ch.level}${rec.solved ? ' · solved' : ''}</span>
        <h3 class="h3">${ch.title}</h3>
        <p class="ch__goal">${rich(ch.goal)}</p>
        ${ch.steps?.length ? html`<ol class="ch__steps">${ch.steps.map((s) => html`<li>${rich(s)}</li>`)}</ol>` : ''}
        <form class="ch__form">${ch.fields.map((f) => html`<label><span>${f.label}</span><input name="${f.key}" class="mono" autocomplete="off" spellcheck="false" autocapitalize="characters" inputmode="${f.kind === 'int' || f.kind === 'num' ? 'decimal' : 'text'}" value="${rec.answers?.[f.key] ?? ''}"></label>`)}
          <div class="ch__btns"><button class="btn btn--primary ex__small">Check</button><button type="button" class="btn btn--ghost ex__small" data-hint>Hint</button><button type="button" class="btn btn--ghost ex__small" data-ans>Answer</button></div>
        </form>
        <div class="ch__hints"></div>
        <div class="ch__fb"></div>
      </article>
      <div class="ch__pn"><button type="button" class="btn btn--ghost ex__small" data-prev ${S.i === 0 ? 'disabled' : ''}>${icons.back}<span>Prev</span></button><button type="button" class="btn btn--ghost ex__small" data-next2 ${S.i === CHALLENGES.length - 1 ? 'disabled' : ''}><span>Next</span>${icons.chevron}</button></div>
    </div>`));
    const form = body.querySelector('form'), fb = body.querySelector('.ch__fb');
    if (rec.solved) fb.append(el(html`<div class="fb fb--ok"><b class="fb__head">Solved.</b><p>${rich(ch.reveal())}</p></div>`));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const answers = Object.fromEntries(new FormData(form));
      const g = gradeChallenge(ch, answers);
      form.querySelectorAll('input').forEach((inp) => { inp.classList.toggle('is-bad', g.fields[inp.name] === false); inp.classList.toggle('is-ok', g.fields[inp.name] === true); });
      const r = recOf(ch.id);
      await saveRec(ch.id, { answers, attempts: (r.attempts || 0) + 1, ...(g.ok && !r.solved ? { solved: true, solvedAt: Date.now() } : {}) });
      fb.replaceChildren(el(g.ok
        ? html`<div class="fb fb--ok"><b class="fb__head">Correct.</b><p>${rich(ch.reveal())}</p></div>`
        : html`<div class="fb fb--bad"><b class="fb__head">Not yet.</b><p>${Object.values(g.fields).filter(Boolean).length} of ${ch.fields.length} right. The red fields are off; the green ones are correct.</p></div>`));
      paintCount();
      if (g.ok) body.querySelector('.ch__card').classList.add('is-solved'), body.querySelectorAll('.ch__dot')[S.i].classList.add('is-solved');
    });
    body.querySelector('[data-hint]').onclick = (e) => {
      if (S.hints >= ch.hints.length) return;
      body.querySelector('.ch__hints').append(el(html`<p class="ex__hint"><b>Hint ${S.hints + 1}.</b> ${rich(ch.hints[S.hints])}</p>`));
      S.hints++;
      if (S.hints >= ch.hints.length) e.currentTarget.disabled = true;
    };
    body.querySelector('[data-ans]').onclick = () => {
      if (!confirm('Show the answer? You can still work out why it’s right on the bench.')) return;
      ch.fields.forEach((f) => { form.querySelector(`[name="${f.key}"]`).value = answerOf(f); });
      fb.replaceChildren(el(html`<div class="fb fb--ok"><b class="fb__head">Answer filled in.</b><p>${rich(ch.reveal())} Press Check to record it.</p></div>`));
    };
    body.querySelector('.ch__nav').onclick = (e) => { const b = e.target.closest('[data-k]'); if (b) { S.i = Number(b.dataset.k); S.hints = 0; draw(); } };
    body.querySelector('[data-prev]').onclick = () => { S.i--; S.hints = 0; draw(); };
    body.querySelector('[data-next2]').onclick = () => { S.i++; S.hints = 0; draw(); };
  }
  head.onclick = () => setOpen(!S.open);
  paintCount();
  setOpen(S.open);
  return { destroy() {} };
}
