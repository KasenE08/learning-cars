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

function spawn() {
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  setState('loading');
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
  worker.postMessage({ type: 'boot', base: BASE });
}

/** Start downloading Python early (e.g. when an exercise scrolls into view). */
export function warmUp() { if (!worker) spawn(); }

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
  if (!worker) spawn();
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
          setState('idle');
          resolve({ ok: false, timeout: true, tests: [] });
        }, timeoutMs);
      },
      done(m) { clearTimeout(timer); resolve(m); },
    });
    worker.postMessage({ type: 'run', id, base: BASE, exercise });
  });
}
