// Web Worker that hosts Pyodide, so Python never freezes the page.
// The main thread kills and restarts this worker if code runs too long (infinite loops).
import { runExercise } from './harness.js';

let py = null;
let booting = null;

function boot(base) {
  booting ??= (async () => {
    const { loadPyodide } = await import(/* @vite-ignore */ `${base}pyodide/pyodide.mjs`);
    py = await loadPyodide({ indexURL: `${base}pyodide/` });
    self.postMessage({ type: 'ready', version: py.version });
  })().catch((e) => { booting = null; self.postMessage({ type: 'boot-error', message: String(e?.message || e) }); throw e; });
  return booting;
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === 'boot') { boot(msg.base).catch(() => {}); return; }
  if (msg.type === 'run') {
    try { await boot(msg.base); } catch { self.postMessage({ type: 'result', id: msg.id, bootFailed: true }); return; }
    self.postMessage({ type: 'started', id: msg.id });
    const res = await runExercise(py, msg.exercise, (text) => self.postMessage({ type: 'out', id: msg.id, text }));
    self.postMessage({ type: 'result', id: msg.id, ...res });
  }
};
