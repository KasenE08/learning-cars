// Every Python exercise is run for real (Pyodide in Node): the answer must pass all checks,
// the starter must not, and the exercise must be well-formed.
import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync } from 'node:fs';
import { loadPyodide } from 'pyodide';
import { runExercise } from '../src/core/py/harness.js';
import { simFile, SCENARIOS } from '../src/core/can/sim.js';

const dir = new URL('../src/content/lessons/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
const all = [];
for (const f of files) {
  const mod = await import(new URL(f, dir).href);
  mod.default.steps.forEach((st, i) => { if (st.code) all.push({ lesson: f.replace('.js', ''), step: i + 1, ex: st.code, st }); });
}

const resolve = (filesSpec = {}) => Object.fromEntries(Object.entries(filesSpec).map(([k, v]) => [k, v.startsWith('sim:') ? simFile(v) : v]));

let py;
beforeAll(async () => { py = await loadPyodide(); }, 60000);

describe('python exercises', () => {
  it('exercise ids are unique and well-formed', () => {
    const ids = all.map((a) => a.ex.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, ex, st } of all) {
      const where = `${lesson}: ${ex.id}`;
      expect(ex.id, where).toMatch(new RegExp(`^${lesson}-[a-z0-9-]+$`));
      expect(st.tag, where).toBe('code');
      expect(typeof ex.starter, where).toBe('string');
      expect(typeof ex.solution, where).toBe('string');
      expect(Array.isArray(ex.tests) && ex.tests.length >= 1, `${where} needs tests`).toBe(true);
      for (const t of ex.tests) { expect(typeof t.name, where).toBe('string'); expect(typeof t.code, where).toBe('string'); }
      expect(Array.isArray(ex.hints) && ex.hints.length >= 1, `${where} needs hints`).toBe(true);
      for (const [name, ref] of Object.entries(ex.files || {})) {
        expect(name, where).toMatch(/^[\w.-]+$/);
        if (ref.startsWith('sim:')) expect(SCENARIOS[ref.slice(4).split('?')[0]], `${where} unknown scenario ${ref}`).toBeTruthy();
      }
      expect(/\b(import\s+(js|pyodide|micropip)|input\()/.test(ex.solution + ex.starter), `${where}: no js/pyodide/micropip/input`).toBe(false);
    }
  });

  for (const { lesson, step, ex } of all) {
    it(`${lesson} step ${step} (${ex.id}): answer passes, starter does not`, async () => {
      const files = resolve(ex.files);
      const good = await runExercise(py, { code: ex.solution, setup: ex.setup, files, tests: ex.tests });
      expect(good.error, `answer raised: ${good.error?.text}`).toBeNull();
      const failed = good.tests.filter((t) => !t.ok).map((t) => `${t.name}: ${t.msg}`);
      expect(failed, 'answer failed checks').toEqual([]);
      const bad = await runExercise(py, { code: ex.starter, setup: ex.setup, files, tests: ex.tests });
      expect(bad.ok, 'starter code already passes, so the checks test nothing').toBe(false);
    }, 30000);
  }
});
