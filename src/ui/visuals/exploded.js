// Exploded views. An assembly = parts drawn in their assembled position, each with an
// exploded offset and a teardown step. The slider (or Take apart / Put back) moves parts in
// teardown order; the camera zooms out as things spread. Every part is tappable.
// assembly module: { title, box: [x,y,w,h], boxOut: [x,y,w,h], info: { key: { name, does } }, parts: [...], note? }
// part: { id, info?: key (defaults to id), step: 1..n, dx, dy, art: svgString, label?: [x, y] }
import { html, el } from '../dom.js';
import { slider } from './controls.js';

const loaders = {
  engine: () => import('./assemblies/engine.js'),
  gearbox: () => import('./assemblies/gearbox.js'),
  diff: () => import('./assemblies/diff.js'),
  turbo: () => import('./assemblies/turbo.js'),
  clutch: () => import('./assemblies/clutch.js'),
  wetclutch: () => import('./assemblies/wetclutch.js'),
};
export const assemblyNames = Object.keys(loaders);
export const loadAssembly = (name) => loaders[name]().then((m) => m.default);

const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const clamp = (v) => Math.max(0, Math.min(1, v));

/** Offset fraction for one part at explode amount e (0..1), given its step out of n steps. */
export function partProgress(e, step, n) {
  const span = 0.45;
  const start = n > 1 ? ((step - 1) / (n - 1)) * (1 - span) : 0;
  return ease(clamp((e - start) / span));
}

export function mount(host, spec) {
  const wrap = el(html`<figure class="vis vis--exploded" data-noswipe><div class="xv__stage"><svg class="d" role="img" aria-label="Exploded view"></svg></div>
    <div class="ctl"></div><div class="part-info" aria-live="polite"><p class="part-info__hint">Drag the slider or tap Take apart. Tap any part.</p></div>
    <ol class="xv__steps"></ol></figure>`);
  host.append(wrap);
  let destroyed = false, raf = 0, e = spec.start ?? 0;

  loadAssembly(spec.assembly).then((A) => {
    if (destroyed) return;
    const svg = wrap.querySelector('svg');
    const stage = wrap.querySelector('.xv__stage');
    stage.style.setProperty('--ar', `${A.boxOut[2]} / ${A.boxOut[3]}`);
    stage.style.maxWidth = `calc(min(62vh, 560px) * ${A.boxOut[2] / A.boxOut[3]})`;
    const n = Math.max(...A.parts.map((p) => p.step));
    svg.innerHTML = `<defs><pattern id="xhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" class="d-cut-bg"/><line x1="0" y1="0" x2="0" y2="6" class="d-hatch"/></pattern></defs>` + A.parts.map((p) => `<g class="xp" data-part="${p.info || p.id}" data-id="${p.id}">${p.art}${p.label ? `<text class="xp__lbl" x="${p.label[0]}" y="${p.label[1]}" text-anchor="${p.label[2] || 'middle'}">${A.info[p.info || p.id].short || A.info[p.info || p.id].name}</text>` : ''}</g>`).join('');
    const groups = [...svg.querySelectorAll('.xp')].map((g) => ({ g, p: A.parts.find((x) => x.id === g.dataset.id) }));
    const info = wrap.querySelector('.part-info');

    // teardown list (one line per info key, in step order)
    const seen = new Set();
    const steps = A.parts.slice().sort((a, b) => a.step - b.step).filter((p) => { const k = p.info || p.id; if (seen.has(k)) return false; seen.add(k); return true; });
    wrap.querySelector('.xv__steps').innerHTML = String(html`<li class="xv__steps-h kicker">Teardown order (reassembly = reverse)</li>${steps.map((p) => html`<li><button type="button" data-pick="${p.info || p.id}"><span class="mono">${p.step}</span>${A.info[p.info || p.id].name}</button></li>`)}`);

    const draw = () => {
      for (const { g, p } of groups) {
        const k = partProgress(e, p.step, n);
        g.setAttribute('transform', `translate(${(p.dx * k).toFixed(1)} ${(p.dy * k).toFixed(1)})`);
      }
      const [x0, y0, w0, h0] = A.box, [x1, y1, w1, h1] = A.boxOut;
      const z = ease(clamp(e * 1.15));
      const vw = w0 + (w1 - w0) * z, vh = h0 + (h1 - h0) * z;
      svg.setAttribute('viewBox', `${x0 + (x1 - x0) * z} ${y0 + (y1 - y0) * z} ${vw} ${vh}`);
      svg.style.setProperty('--lbl', clamp((e - 0.55) / 0.3));
      // keep labels ~11 px on screen whatever the zoom
      const r = svg.getBoundingClientRect();
      const ppu = r.width && r.height ? Math.min(r.width / vw, r.height / vh) : 1;
      svg.style.setProperty('--fs', `${11 / ppu}px`);
      s.set(Math.round(e * 100));
      btn.textContent = e > 0.5 ? 'Put back together' : 'Take apart';
    };
    const select = (key) => {
      svg.classList.toggle('has-sel', !!key);
      groups.forEach(({ g }) => g.classList.toggle('is-sel', g.dataset.part === key));
      wrap.querySelectorAll('[data-pick]').forEach((b) => b.classList.toggle('is-on', b.dataset.pick === key));
      const it = A.info[key];
      if (it) info.innerHTML = String(html`<span class="part-info__name">${it.name}</span><p class="part-info__does">${it.does}</p>`);
    };
    const animate = (to) => {
      cancelAnimationFrame(raf);
      const from = e, t0 = performance.now(), dur = 2200 * Math.abs(to - from) + 200;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tick = (now) => {
        const k = reduced ? 1 : Math.min(1, (now - t0) / dur);
        e = from + (to - from) * k;
        draw();
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const ctl = wrap.querySelector('.ctl');
    const s = slider({ label: 'Explode', min: 0, max: 100, step: 1, value: Math.round(e * 100), fmt: (v) => `${v}%`, onInput(v) { cancelAnimationFrame(raf); e = v / 100; draw(); } });
    const btn = el(html`<button type="button" class="btn btn--primary">Take apart</button>`);
    btn.addEventListener('click', () => animate(e > 0.5 ? 0 : 1));
    ctl.append(btn, s.el);
    if (A.note) wrap.append(el(html`<p class="vis__note">${A.note}</p>`));

    svg.addEventListener('click', (ev) => { const g = ev.target.closest('[data-part]'); if (g) select(g.dataset.part); });
    wrap.querySelector('.xv__steps').addEventListener('click', (ev) => { const b = ev.target.closest('[data-pick]'); if (b) select(b.dataset.pick); });
    draw();
  });
  return { destroy() { destroyed = true; cancelAnimationFrame(raf); } };
}
