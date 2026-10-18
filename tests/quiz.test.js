import { describe, it, expect } from 'vitest';
import { grade, parseNumber, shuffledOrder } from '../src/core/quiz.js';

describe('quiz grading', () => {
  it('mc and tap', () => {
    expect(grade({ type: 'mc', answer: 2 }, 2)).toBe(true);
    expect(grade({ type: 'mc', answer: 2 }, 1)).toBe(false);
    expect(grade({ type: 'tap', answer: 'crank' }, 'crank')).toBe(true);
    expect(grade({ type: 'tap', answer: 'crank' }, 'rod')).toBe(false);
  });
  it('order', () => {
    const q = { type: 'order', items: ['a', 'b', 'c'] };
    expect(grade(q, [0, 1, 2])).toBe(true);
    expect(grade(q, [1, 0, 2])).toBe(false);
    expect(grade(q, [0, 1])).toBe(false);
  });
  it('num with tolerance, commas, junk', () => {
    const q = { type: 'num', answer: 1809.6, tol: 6 };
    expect(grade(q, '1,810')).toBe(true);
    expect(grade(q, '1800')).toBe(false);
    expect(grade(q, 'abc')).toBe(false);
    expect(grade({ type: 'num', answer: 50, tol: 0 }, '50')).toBe(true);
    expect(grade({ type: 'num', answer: 50, tol: 0 }, '50.1')).toBe(false);
    expect(parseNumber(' 15.2 ')).toBe(15.2);
    expect(Number.isNaN(parseNumber('1.2.3'))).toBe(true);
  });
  it('shuffled order is never already solved', () => {
    for (let s = 1; s < 200; s++) {
      const o = shuffledOrder(4, s);
      expect(o.slice().sort()).toEqual([0, 1, 2, 3]);
      expect(o.every((v, i) => v === i)).toBe(false);
    }
  });
});
