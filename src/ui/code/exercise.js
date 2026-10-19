// A Python exercise: prompt, editor, Run / Check, hints, answer, output and test results.
// Your code is saved as you type; solving it is recorded in progress (and in backups).
import { html, el } from '../dom.js';
import { rich } from '../rich.js';
import { icons } from '../icons.js';
import { editor } from './editor.js';
import { runPython, warmUp, pyState, onPyState } from '../../core/py/runner.js';
import { getProgress, saveProgress } from '../../core/store.js';

const getRec = (id) => getProgress().exercises?.[id] || {};
async function saveRec(id, patch) {
  const p = getProgress();
  const ex = { ...(p.exercises || {}) };
  ex[id] = { ...(ex[id] || {}), ...patch };
  await saveProgress({ ...p, exercises: ex });
}

const STATE_TEXT = {
  idle: 'Python loads when you press Run (first time ≈ 13 MB, then it works offline).',
  loading: 'Loading Python…',
  ready: 'Python ready.',
  error: 'Python failed to load. Check your connection and try again.',
};

/**
 * spec: { id, prompt?, starter, setup?, files?, tests?, hints?, solution? }
 * With no tests it is a free scratchpad (Run only).
 */
export function mountExercise(host, spec) {
  const rec = getRec(spec.id);
  const isFree = !spec.tests?.length;
  let hintsShown = 0, saveTimer = 0, busy = false, unsaved = null;

  const wrap = el(html`<section class="ex ${rec.solved ? 'is-solved' : ''}" data-noswipe>
    <header class="ex__head"><span class="kicker">${isFree ? 'Python scratchpad' : 'Exercise'}</span>${!isFree ? html`<span class="ex__badge">${icons.check}Solved</span>` : ''}</header>
    ${spec.prompt ? html`<div class="ex__prompt">${rich(spec.prompt)}</div>` : ''}
    <div class="ex__ed"></div>
    <div class="ex__bar">
      <button class="btn ${isFree ? 'btn--primary' : ''}" data-run>${icons.play}<span>Run</span></button>
      ${!isFree ? html`<button class="btn btn--primary" data-check>${icons.check}<span>Check</span></button>` : ''}
      ${spec.hints?.length ? html`<button class="btn btn--ghost" data-hint>Hint</button>` : ''}
      <span class="ex__spacer"></span>
      <button class="btn btn--ghost ex__small" data-reset>Reset</button>
      ${spec.solution ? html`<button class="btn btn--ghost ex__small" data-sol>Answer</button>` : ''}
    </div>
    <p class="ex__state mono"></p>
    <div class="ex__hints"></div>
    <div class="ex__out" hidden><span class="kicker">Output</span><pre class="ex__console"></pre></div>
    <div class="ex__tests"></div>
  </section>`);
  host.append(wrap);

  const ed = editor({
    value: rec.code ?? spec.starter ?? '',
    onChange(v) { unsaved = v; clearTimeout(saveTimer); saveTimer = setTimeout(() => { saveRec(spec.id, { code: v }); unsaved = null; }, 600); },
  });
  wrap.querySelector('.ex__ed').append(ed.el);
  const $ = (s) => wrap.querySelector(s);
  const stateEl = $('.ex__state'), out = $('.ex__out'), con = $('.ex__console'), testsEl = $('.ex__tests');
  const paintState = (s = pyState()) => { stateEl.textContent = STATE_TEXT[s] || ''; stateEl.dataset.s = s; };
  const off = onPyState((s) => paintState(s));
  paintState();

  // Start the download once the exercise is actually on screen.
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { warmUp(); io.disconnect(); } }) : null;
  io?.observe(wrap);

  const setBusy = (b) => { busy = b; wrap.querySelectorAll('[data-run],[data-check]').forEach((x) => { x.disabled = b; }); };

  async function go(withTests) {
    if (busy) return;
    setBusy(true);
    con.textContent = '';
    out.hidden = true;
    testsEl.replaceChildren();
    ed.markLine(null);
    const print = (t) => { out.hidden = false; con.textContent += t; };
    const res = await runPython({ code: ed.value, setup: spec.setup, files: spec.files, tests: withTests ? spec.tests : [] }, { onOut: print });
    setBusy(false);
    paintState();
    if (res.bootFailed) { testsEl.append(el(html`<div class="fb fb--bad"><b class="fb__head">Python didn’t load.</b><p>The first run needs internet to download it. After that it works offline.</p></div>`)); return; }
    if (res.timeout) { testsEl.append(el(html`<div class="fb fb--bad"><b class="fb__head">Stopped after 8 seconds.</b><p>Your code was still running, which usually means a loop that never ends. Python restarts on the next run.</p></div>`)); return; }
    if (res.error) {
      ed.markLine(res.error.line);
      testsEl.append(el(html`<div class="fb fb--bad"><b class="fb__head">${res.error.line ? `Line ${res.error.line}: ` : ''}error</b><p class="mono ex__err">${res.error.text}</p>${res.error.friendly ? html`<p>${res.error.friendly}</p>` : ''}</div>`));
      return;
    }
    if (!withTests) {
      if (!con.textContent) print('(ran with no output: use print() to see values)\n');
      return;
    }
    const passed = res.tests.filter((t) => t.ok).length;
    testsEl.append(el(html`<div class="fb ${res.ok ? 'fb--ok' : 'fb--bad'}" role="status">
      <b class="fb__head">${res.ok ? 'All checks pass.' : `${passed} of ${res.tests.length} checks pass.`}</b>
      <ul class="ex__checks">${res.tests.map((t) => html`<li class="${t.ok ? 'is-ok' : 'is-bad'}"><span class="tick">${t.ok ? icons.check : icons.close}</span><span>${rich(t.name)}${!t.ok && t.msg ? html`<br><span class="mono ex__err">${t.msg}</span>` : ''}${!t.ok && t.friendly ? html`<br><span class="muted">${t.friendly}</span>` : ''}</span></li>`)}</ul>
    </div>`));
    const r = getRec(spec.id);
    await saveRec(spec.id, { code: ed.value, attempts: (r.attempts || 0) + 1, ...(res.ok && !r.solved ? { solved: true, solvedAt: Date.now() } : {}) });
    if (res.ok) wrap.classList.add('is-solved');
  }

  $('[data-run]').addEventListener('click', () => go(false));
  $('[data-check]')?.addEventListener('click', () => go(true));
  wrap.addEventListener('run-code', () => go(!isFree));
  $('[data-hint]')?.addEventListener('click', (e) => {
    if (hintsShown >= spec.hints.length) return;
    $('.ex__hints').append(el(html`<p class="ex__hint"><b>Hint ${hintsShown + 1}.</b> ${rich(spec.hints[hintsShown])}</p>`));
    hintsShown++;
    if (hintsShown >= spec.hints.length) e.currentTarget.disabled = true;
  });
  $('[data-reset]').addEventListener('click', () => {
    if (ed.value !== (spec.starter ?? '') && !confirm('Reset to the starter code? Your version will be replaced.')) return;
    ed.set(spec.starter ?? '');
    testsEl.replaceChildren(); out.hidden = true; ed.markLine(null);
  });
  $('[data-sol]')?.addEventListener('click', () => {
    if (!confirm('Show the answer? It replaces your code in the editor. Trying first sticks better, but there’s no penalty.')) return;
    ed.set(spec.solution);
    testsEl.replaceChildren(); ed.markLine(null);
  });

  return { destroy() { off(); io?.disconnect(); clearTimeout(saveTimer); if (unsaved != null) saveRec(spec.id, { code: unsaved }); } };
}

