import { describe, it, expect } from 'vitest';
import { newCard, grade, preview, recall, fmtInterval, Rating } from '../src/core/fsrs.js';
import { addLessonCards, dueCards, retentionByLesson } from '../src/core/review.js';

const T0 = Date.parse('2026-10-18T10:00:00Z');
const DAY = 86400000;

describe('fsrs wrapper', () => {
  it('new cards are due now and have zero recall', () => {
    const c = newCard('engine-01:a', 'engine-01', T0);
    expect(c.s.due).toBe(T0);
    expect(recall(c, T0)).toBe(0);
  });
  it('grades push the due date out, Easy furthest', () => {
    const c = newCard('x:a', 'x', T0);
    const p = preview(c, T0);
    expect(p[Rating.Again]).toBeLessThan(p[Rating.Good]);
    expect(p[Rating.Good]).toBeLessThan(p[Rating.Easy]);
    const g = grade(c, Rating.Easy, T0);
    expect(g.s.due).toBeGreaterThan(T0 + DAY);
    expect(g.s.reps).toBe(1);
    expect(typeof g.s.due).toBe('number');
  });
  it('recall decays over time', () => {
    const g = grade(newCard('x:a', 'x', T0), Rating.Easy, T0);
    expect(recall(g, T0 + DAY)).toBeGreaterThan(recall(g, T0 + 60 * DAY));
  });
  it('survives a JSON round trip (backup)', () => {
    const g = grade(newCard('x:a', 'x', T0), Rating.Good, T0);
    const back = JSON.parse(JSON.stringify(g));
    expect(() => grade(back, Rating.Good, T0 + DAY)).not.toThrow();
  });
  it('formats intervals', () => {
    expect(fmtInterval(10 * 60000)).toBe('10m');
    expect(fmtInterval(3 * DAY)).toBe('3d');
    expect(fmtInterval(90 * DAY)).toBe('3mo');
  });
});

describe('deck', () => {
  it('adds only missing cards, and due/retention work', () => {
    let { cards, added } = addLessonCards({}, 'engine-01', [{ id: 'a' }, { id: 'b' }], T0);
    expect(added).toBe(2);
    ({ cards, added } = addLessonCards(cards, 'engine-01', [{ id: 'a' }, { id: 'c' }], T0));
    expect(added).toBe(1);
    expect(Object.keys(cards).sort()).toEqual(['engine-01:a', 'engine-01:b', 'engine-01:c']);
    expect(dueCards(T0, cards).length).toBe(3);
    cards['engine-01:a'] = grade(cards['engine-01:a'], Rating.Easy, T0);
    expect(dueCards(T0 + 1000, cards).length).toBe(2);
    const r = retentionByLesson(T0 + DAY, cards);
    expect(r['engine-01']).toBeGreaterThan(0);
    expect(r['engine-01']).toBeLessThan(1);
  });
});
