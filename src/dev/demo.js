// Dev-only sample progress for screenshots (?demo). Never saved.
import { newProgress, markDone } from '../core/progress.js';
import { pathLessons } from '../core/course.js';

export function demoProgress() {
  let p = newProgress(0);
  pathLessons().slice(0, 23).forEach((l, i) => { p = markDone(p, l.id, i); });
  return p;
}
