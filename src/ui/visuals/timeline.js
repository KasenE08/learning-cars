// Shared animation controller: play/pause, scrub, speed. Pauses when off screen or the app is hidden.
import { html, el } from '../dom.js';
import { icons } from '../icons.js';

const SPEEDS = [0.25, 0.5, 1];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function timeline(host, { period = 720, cycleMs = 4000, start = 0, autoplay = true, onFrame, label = 'Crank angle', unit = '°' }) {
  const bar = el(html`<div class="tl">
    <button class="tl__play" aria-label="Play">${icons.play}</button>
    <input class="tl__scrub" type="range" min="0" max="${period}" step="1" value="${start}" aria-label="${label}">
    <button class="tl__speed mono" aria-label="Speed">1×</button>
  </div>`);
  host.append(bar);
  const play = bar.querySelector('.tl__play');
  const scrub = bar.querySelector('.tl__scrub');
  const speedBtn = bar.querySelector('.tl__speed');

  let t = start;
  let speed = 1;
  let playing = false;
  let visible = true;
  let raf = 0;
  let last = 0;

  const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  const draw = () => {
    scrub.value = Math.round(t);
    scrub.style.setProperty('--p', `${(t / period) * 100}%`);
    onFrame(t);
  };
  const loop = (now) => {
    const dt = Math.min(64, now - (last || now));
    last = now;
    t = (t + (dt / cycleMs) * period * speed) % period;
    draw();
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    cancelAnimationFrame(raf);
    if (playing && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); }
  };
  const setPlaying = (p) => {
    playing = p;
    play.innerHTML = p ? PAUSE : String(icons.play);
    play.setAttribute('aria-label', p ? 'Pause' : 'Play');
    play.classList.toggle('is-on', p);
    run();
  };

  play.addEventListener('click', () => setPlaying(!playing));
  scrub.addEventListener('input', () => { t = Number(scrub.value); setPlaying(false); draw(); });
  speedBtn.addEventListener('click', () => {
    speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    speedBtn.textContent = `${speed}×`;
  });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); });
  io.observe(host);
  const onVis = () => run();
  document.addEventListener('visibilitychange', onVis);

  draw();
  setPlaying(autoplay && !reduced());

  return {
    get: () => t,
    set(v) { t = ((v % period) + period) % period; draw(); },
    pause: () => setPlaying(false),
    play: () => setPlaying(true),
    destroy() { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', onVis); },
  };
}
