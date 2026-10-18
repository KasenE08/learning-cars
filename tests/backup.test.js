import { describe, it, expect } from 'vitest';
import { makeBackup, parseBackup, describeBackup, backupFileName } from '../src/core/backup.js';
import { newProgress, markDone } from '../src/core/progress.js';

describe('backup', () => {
  const progress = markDone(newProgress(0), 'engine-01', 1);
  it('round-trips', () => {
    const b = makeBackup({ progress, cards: { c1: { due: 1 } }, settings: { a: 1 } }, new Date('2026-10-18T00:00:00Z'));
    const back = parseBackup(JSON.stringify(b));
    expect(back.progress.lessons).toEqual(progress.lessons);
    expect(back.cards).toEqual({ c1: { due: 1 } });
    expect(back.exportedAt).toBe('2026-10-18T00:00:00.000Z');
    expect(describeBackup(back)).toBe('1 lesson done · 1 flashcard');
  });
  it('rejects bad files with clear messages', () => {
    expect(() => parseBackup('nope')).toThrow(/valid JSON/);
    expect(() => parseBackup('{"app":"learning-piano"}')).toThrow(/Learning Cars backup/);
    expect(() => parseBackup('{"app":"learning-cars","version":99}')).toThrow(/newer version/);
    expect(() => parseBackup('{"app":"learning-cars","version":1}')).toThrow(/progress/);
    expect(() => parseBackup('{"app":"learning-cars","version":1,"progress":{"lessons":{"x":1}}}')).toThrow(/lesson x/);
  });
  it('names files by date', () => {
    expect(backupFileName(new Date('2026-10-18T12:00:00Z'))).toBe('learning-cars-backup-2026-10-18.json');
  });
});
