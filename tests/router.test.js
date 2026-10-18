import { describe, it, expect } from 'vitest';
import { parse } from '../src/router.js';

describe('router', () => {
  it('parses every route', () => {
    expect(parse('')).toEqual({ name: 'home', params: {} });
    expect(parse('#/')).toEqual({ name: 'home', params: {} });
    expect(parse('#/course')).toEqual({ name: 'course', params: {} });
    expect(parse('#/course/tracks')).toEqual({ name: 'course', params: { view: 'tracks' } });
    expect(parse('#/course/tracks#tech')).toEqual({ name: 'course', params: { view: 'tracks' } });
    expect(parse('#/lesson/engine-02')).toEqual({ name: 'lesson', params: { id: 'engine-02' } });
    expect(parse('#/glossary/tdc')).toEqual({ name: 'glossary', params: { term: 'tdc' } });
    expect(parse('#/settings?x=1')).toEqual({ name: 'settings', params: {} });
  });
  it('falls back to home for unknown routes', () => {
    expect(parse('#/nope')).toEqual({ name: 'home', params: {} });
    expect(parse('#/lesson/../../x')).toEqual({ name: 'home', params: {} });
  });
});
