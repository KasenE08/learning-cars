// Copies the Pyodide runtime from node_modules into public/pyodide (not committed).
// Served from our own site so exercises work offline after the first load.
import { mkdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const src = dirname(require.resolve('pyodide/package.json'));
const out = new URL('../public/pyodide/', import.meta.url).pathname;
const FILES = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
mkdirSync(out, { recursive: true });
for (const f of FILES) {
  const from = join(src, f), to = join(out, f);
  if (existsSync(to) && statSync(to).size === statSync(from).size) continue;
  copyFileSync(from, to);
}
console.log('pyodide →', out);
