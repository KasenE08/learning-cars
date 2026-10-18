import { describe, it, expect } from 'vitest';
import { newProgress, markDone, markUndone, isDone, nextUp, lessonMastery, overallSummary, cleanProgress } from '../src/core/progress.js';
import { lessonById, pathLessons } from '../src/core/course.js';

describe('progress', () => {
  it('marks lessons done and undone', () => {
    let p = markDone(newProgress(0), 'engine-01', 5);
    expect(isDone(p, 'engine-01')).toBe(true);
    expect(p.lessons['engine-01'].completedAt).toBe(5);
    p = markDone(p, 'engine-01', 9);
    expect(p.lessons['engine-01'].completedAt).toBe(5);
    p = markUndone(p, 'engine-01');
    expect(isDone(p, 'engine-01')).toBe(false);
    expect(p.lessons['engine-01']).toBeUndefined();
  });
  it('keeps quiz scores when un-marking', () => {
    let p = markDone(newProgress(0), 'engine-01');
    p = { ...p, lessons: { 'engine-01': { ...p.lessons['engine-01'], quiz: { best: 0.8, attempts: 1 } } } };
    p = markUndone(p, 'engine-01');
    expect(p.lessons['engine-01']).toEqual({ quiz: { best: 0.8, attempts: 1 } });
  });
  it('next up follows the recommended path', () => {
    const order = pathLessons();
    let p = newProgress(0);
    expect(nextUp(p).id).toBe(order[0].id);
    p = markDone(p, order[0].id);
    expect(nextUp(p).id).toBe(order[1].id);
    order.forEach((l) => { p = markDone(p, l.id); });
    expect(nextUp(p)).toBeNull();
  });
  it('mastery: done = half, quiz/retention fill the rest', () => {
    const l = lessonById('engine-01');
    let p = newProgress(0);
    expect(lessonMastery(p, l)).toBe(0);
    p = markDone(p, l.id);
    expect(lessonMastery(p, l)).toBe(1);
    p.lessons[l.id].quiz = { best: 0.6, attempts: 1 };
    expect(lessonMastery(p, l)).toBeCloseTo(0.8);
    expect(lessonMastery(p, l, { [l.id]: 1 })).toBeCloseTo(0.9);
  });
  it('summaries add up', () => {
    const s = overallSummary(markDone(newProgress(0), 'engine-01'));
    expect(s.done).toBe(1);
    expect(s.tracks.find((t) => t.track.id === 'mech').done).toBe(1);
    expect(s.tracks.reduce((a, t) => a + t.total, 0)).toBe(s.total);
  });
  it('drops unknown lesson ids', () => {
    const p = cleanProgress({ lessons: { 'engine-01': { done: true }, 'gone-99': { done: true } } }, new Set(['engine-01']));
    expect(Object.keys(p.lessons)).toEqual(['engine-01']);
  });
});
