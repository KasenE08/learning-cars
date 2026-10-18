import { describe, it, expect } from 'vitest';
import { nodes, trail } from '../src/content/explorer.js';
import { facts } from '../src/content/vehicles.js';
import { lessonById } from '../src/core/course.js';
import { compute, MODES, SCENES } from '../src/ui/visuals/awd.js';

const DRAWINGS = ['piston', 'head', 'engine-section', 'car-top', 'car-side', 'moto-side', 'rdu'];
const drawings = {};
for (const d of DRAWINGS) drawings[d] = await import(`../src/ui/visuals/drawings/${d}.js`);
const ASSEMBLIES = ['engine', 'gearbox', 'diff', 'turbo', 'clutch', 'wetclutch'];
const assemblies = {};
for (const a of ASSEMBLIES) assemblies[a] = (await import(`../src/ui/visuals/assemblies/${a}.js`)).default;

describe('explorer nodes', () => {
  for (const [id, n] of Object.entries(nodes)) {
    it(`${id} is well-formed`, () => {
      if (n.parent) expect(nodes[n.parent], `${id}.parent`).toBeTruthy();
      expect(trail(id).at(-1)).toBe(id);
      expect(n.views.length).toBeGreaterThan(0);
      const partIds = new Set();
      for (const v of n.views) {
        if (v.visual.type === 'parts') { expect(drawings[v.visual.drawing], v.visual.drawing).toBeTruthy(); Object.keys(drawings[v.visual.drawing].parts).forEach((p) => partIds.add(p)); }
        if (v.visual.type === 'exploded') expect(assemblies[v.visual.assembly], v.visual.assembly).toBeTruthy();
      }
      for (const [part, target] of Object.entries(n.drills || {})) {
        expect(nodes[target], `${id} drill → ${target}`).toBeTruthy();
        expect(partIds.has(part), `${id}: drill part ${part} not in any drawing`).toBe(true);
      }
      for (const f of n.facts || []) expect(facts[f], f).toBeTruthy();
    });
  }
});

describe('drawings', () => {
  for (const [name, d] of Object.entries(drawings)) {
    it(`${name}: every part has name/does/connects/where, and appears in the SVG`, () => {
      const src = d.svg('t', { labels: true });
      for (const [k, p] of Object.entries(d.parts)) {
        expect(p.name && p.does && p.connects && p.where, `${name}.${k}`).toBeTruthy();
        expect(src.includes(`data-part="${k}"`), `${name}: ${k} not drawn`).toBe(true);
        if (p.lesson) expect(lessonById(p.lesson)).toBeTruthy();
      }
      for (const m of src.matchAll(/data-part="([\w-]+)"/g)) expect(d.parts[m[1]], `${name}: drawn part ${m[1]} has no info`).toBeTruthy();
    });
  }
});

describe('exploded assemblies', async () => {
  const { partProgress } = await import('../src/ui/visuals/exploded.js');
  for (const [name, A] of Object.entries(assemblies)) {
    it(`${name}: info keys exist, steps are 1..n`, () => {
      const steps = new Set();
      for (const p of A.parts) { expect(A.info[p.info || p.id], `${name}.${p.id}`).toBeTruthy(); steps.add(p.step); }
      const n = Math.max(...steps);
      for (let s = 1; s <= n; s++) expect(steps.has(s), `${name} missing step ${s}`).toBe(true);
      expect(A.box).toHaveLength(4); expect(A.boxOut).toHaveLength(4);
    });
  }
  it('parts start assembled and end fully exploded', () => {
    for (let step = 1; step <= 6; step++) {
      expect(partProgress(0, step, 6)).toBe(0);
      expect(partProgress(1, step, 6)).toBeCloseTo(1);
    }
    expect(partProgress(0.3, 1, 6)).toBeGreaterThan(partProgress(0.3, 6, 6));
  });
});

describe('4x4 torque model', () => {
  it('never creates torque: wheels + lost = 100% in every mode and situation', () => {
    for (const m of MODES) for (const s of SCENES) for (const lock of [false, true]) {
      const r = compute(m.value, s.value, lock);
      const sum = r.W.fl + r.W.fr + r.W.rl + r.W.rr + r.lost;
      expect(sum, `${m.value}/${s.value}/${lock}`).toBeCloseTo(1, 5);
      expect(r.W.rl + r.W.rr).toBeLessThanOrEqual(0.5 + 1e-9);
      expect(r.text.length).toBeGreaterThan(20);
    }
  });
  it('locked with a rear wheel in the air sends the rear half to the grounded wheel', () => {
    const r = compute('rock', 'air', true);
    expect(r.W.rr).toBe(0);
    expect(r.W.rl).toBeCloseTo(0.5);
  });
  it('torque vectoring favors the outside rear wheel in a right turn', () => {
    const r = compute('normal', 'turn', false);
    expect(r.W.rl).toBeGreaterThan(r.W.rr);
  });
});
