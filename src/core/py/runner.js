// Main-thread side of the Python runner. Lazily starts the worker; enforces a time limit.
const BASE = import.meta.env.BASE_URL;

let worker = null;
let state = 'idle'; // idle | loading | ready | error
let seq = 0;
const pending = new Map();
const listeners = new Set();

const setState = (s, extra) => { state = s; listeners.forEach((fn) => fn(s, extra)); };
export const pyState = () => state;
export function onPyState(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** On a first visit the service worker may still be taking control. A worker created before that
 *  bypasses it, and Pyodide wouldn't be cached for offline use, so wait briefly for control. */
async function swReady() {
  const sw = navigator.serviceWorker;
  if (!import.meta.env.PROD || !sw || sw.controller) return;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await Promise.race([sw.ready, wait(6000)]);
  if (!sw.controller) await Promise.race([new Promise((r) => sw.addEventListener('controllerchange', r, { once: true })), wait(2000)]);
}

let spawning = null;
function spawn() {
  setState('loading');
  spawning = swReady().then(() => {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    attach();
    worker.postMessage({ type: 'boot', base: BASE });
  });
  return spawning;
}

function attach() {
  worker.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'ready') { setState('ready', m.version); return; }
    if (m.type === 'boot-error') { setState('error', m.message); return; }
    const p = pending.get(m.id);
    if (!p) return;
    if (m.type === 'started') p.started();
    else if (m.type === 'out') p.onOut?.(m.text);
    else if (m.type === 'result') { pending.delete(m.id); p.done(m); }
  };
  worker.onerror = () => setState('error', 'Python worker crashed.');
}

/** Start downloading Python early (e.g. when an exercise scrolls into view). */
export function warmUp() { if (!worker && !spawning) spawn(); }

async function resolveFiles(files = {}) {
  const out = {};
  const entries = Object.entries(files);
  if (entries.some(([, v]) => v.startsWith('sim:'))) {
    const { simFile } = await import('../can/sim.js');
    for (const [k, v] of entries) out[k] = v.startsWith('sim:') ? simFile(v) : v;
  } else Object.assign(out, files);
  return out;
}

/**
 * Run code (+ optional exercise setup/files/tests). Resolves with
 * { ok, ran, error, tests, timeout?, bootFailed? }.
 */
export async function runPython({ code, setup, files, tests }, { onOut, timeoutMs = 8000 } = {}) {
  if (!worker && !spawning) spawn();
  await spawning;
  const exercise = { code, setup, tests, files: await resolveFiles(files) };
  const id = ++seq;
  return new Promise((resolve) => {
    let timer = null;
    pending.set(id, {
      onOut,
      started() {
        timer = setTimeout(() => {
          pending.delete(id);
          worker.terminate();
          worker = null;
          spawning = null;
          setState('idle');
          resolve({ ok: false, timeout: true, tests: [] });
        }, timeoutMs);
      },
      done(m) { clearTimeout(timer); resolve(m); },
    });
    worker.postMessage({ type: 'run', id, base: BASE, exercise });
  });
}
