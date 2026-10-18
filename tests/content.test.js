import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { lessonById } from '../src/core/course.js';
import { glossary } from '../src/content/glossary.js';
import { facts } from '../src/content/vehicles.js';
import { grade } from '../src/core/quiz.js';

const TAGS = ['metaphor', 'how', 'see', 'math', 'bronco', 'bikes', 'key', 'why'];
const VISUALS = ['cylinder', 'parts', 'displacement', 'crank', 'valvetrain', 'timing', 'compression'];
const terms = new Set(glossary.map((g) => g.id));
const files = readdirSync('src/content/lessons').filter((f) => f.endsWith('.js'));

// parts drawings are plain modules; load their part ids
const drawings = {};
for (const d of ['piston', 'head', 'engine-section']) drawings[d] = Object.keys((await import(`../src/ui/visuals/drawings/${d}.js`)).parts);

const textsOf = (lesson) => [
  ...lesson.steps.flatMap((s) => [s.title, ...(s.body || []), s.note || '']),
  ...lesson.quiz.flatMap((q) => [q.q, q.why, ...(q.options || []), ...(q.items || []), ...Object.values(q.wrong || {})]),
  ...lesson.cards.flatMap((c) => [c.front, c.back]),
];

describe.each(files)('lesson %s', async (file) => {
  const id = file.replace('.js', '');
  const lesson = (await import(`../src/content/lessons/${file}`)).default;

  it('is in the course map', () => expect(lessonById(id)).toBeTruthy());
  it('has 4–8 steps with known tags', () => {
    expect(lesson.steps.length).toBeGreaterThanOrEqual(4);
    expect(lesson.steps.length).toBeLessThanOrEqual(8);
    for (const s of lesson.steps) {
      expect(TAGS).toContain(s.tag);
      expect(s.title).toBeTruthy();
      if (s.visual) {
        expect(VISUALS).toContain(s.visual.type);
        if (s.visual.type === 'parts') expect(drawings[s.visual.drawing]).toBeTruthy();
      }
      for (const f of s.facts || []) expect(facts[f], f).toBeTruthy();
    }
  });
  it('has at least one visual (every concept gets a picture)', () => {
    expect(lesson.steps.some((s) => s.visual)).toBe(true);
  });
  it('has a metaphor first', () => expect(lesson.steps[0].tag).toBe('metaphor'));
  it('quiz has 3–5 valid questions, each with an explanation', () => {
    expect(lesson.quiz.length).toBeGreaterThanOrEqual(3);
    expect(lesson.quiz.length).toBeLessThanOrEqual(5);
    for (const q of lesson.quiz) {
      expect(q.why, q.q).toBeTruthy();
      if (q.type === 'mc') { expect(q.answer).toBeLessThan(q.options.length); expect(grade(q, q.answer)).toBe(true); }
      if (q.type === 'order') expect(grade(q, q.items.map((_, i) => i))).toBe(true);
      if (q.type === 'num') { expect(grade(q, String(q.answer))).toBe(true); expect(Number.isFinite(q.answer)).toBe(true); }
      if (q.type === 'tap') { expect(drawings[q.visual.drawing]).toContain(q.answer); for (const k of Object.keys(q.wrong || {})) expect(drawings[q.visual.drawing]).toContain(k); }
    }
  });
  it('has 3–6 flashcards with unique ids', () => {
    expect(lesson.cards.length).toBeGreaterThanOrEqual(3);
    expect(lesson.cards.length).toBeLessThanOrEqual(6);
    expect(new Set(lesson.cards.map((c) => c.id)).size).toBe(lesson.cards.length);
  });
  it('only links to real glossary terms', () => {
    for (const t of textsOf(lesson)) {
      for (const m of String(t).matchAll(/\[\[([\w-]+)(?:\|[^\]]+)?\]\]/g)) expect(terms.has(m[1]), `${id}: [[${m[1]}]]`).toBe(true);
    }
  });
});

describe('Engine Fundamentals unit', () => {
  it('has all 11 lessons built', () => {
    for (let i = 1; i <= 11; i++) expect(files).toContain(`engine-${String(i).padStart(2, '0')}.js`);
  });
});
