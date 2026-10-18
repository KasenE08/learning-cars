import { describe, it, expect } from 'vitest';
import { units, path, tracks, allLessons, lessonById, pathLessons, lessonCode } from '../src/core/course.js';
import { glossary } from '../src/content/glossary.js';

describe('course map', () => {
  it('has unique unit and lesson ids', () => {
    const ids = allLessons().map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(units.map((u) => u.id)).size).toBe(units.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z]+-\d{2}$/));
  });
  it('path covers every unit exactly once', () => {
    expect([...path].sort()).toEqual(units.map((u) => u.id).sort());
    expect(pathLessons().length).toBe(allLessons().length);
  });
  it('every unit belongs to a real track and lessons fit in 3–7 minutes', () => {
    const t = new Set(tracks.map((x) => x.id));
    for (const u of units) {
      expect(t.has(u.track)).toBe(true);
      for (const l of u.lessons) expect(l.min >= 3 && l.min <= 7).toBe(true);
    }
  });
  it('builds readable codes', () => {
    expect(lessonCode(lessonById('engine-02'))).toBe('T1·ENGINE·02');
  });
});

describe('glossary', () => {
  it('has unique ids and links only to real lessons', () => {
    expect(new Set(glossary.map((g) => g.id)).size).toBe(glossary.length);
    for (const g of glossary) {
      expect(g.term && g.def).toBeTruthy();
      for (const id of g.lessons || []) expect(lessonById(id), `${g.id} → ${id}`).toBeTruthy();
    }
  });
});
