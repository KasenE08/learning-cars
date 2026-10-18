// Pure progress logic. No DOM, no storage.
// progress = { version, lessons: { [id]: { done, completedAt, quiz: { best, attempts } } }, createdAt }
import { pathLessons, units, tracks, unitsOfTrack } from './course.js';

export const PROGRESS_VERSION = 1;

export function newProgress(now = Date.now()) {
  return { version: PROGRESS_VERSION, lessons: {}, createdAt: now };
}

export const isDone = (p, id) => !!p.lessons[id]?.done;

export function markDone(p, id, now = Date.now()) {
  const prev = p.lessons[id] || {};
  return { ...p, lessons: { ...p.lessons, [id]: { ...prev, done: true, completedAt: prev.completedAt ?? now } } };
}

export function markUndone(p, id) {
  if (!p.lessons[id]) return p;
  const { done, completedAt, ...rest } = p.lessons[id];
  const lessons = { ...p.lessons };
  if (Object.keys(rest).length) lessons[id] = rest;
  else delete lessons[id];
  return { ...p, lessons };
}

/** First not-done lesson in the recommended order, or null when everything is done. */
export function nextUp(p) {
  return pathLessons().find((l) => !isDone(p, l.id)) || null;
}

/**
 * Mastery of one lesson, 0..1. Completing it is half; the other half comes from the best
 * quiz score and (from Phase 2) how well its flashcards are retained.
 * `retention` maps lessonId → 0..1 (average recall probability of its cards).
 */
export function lessonMastery(p, l, retention = {}) {
  const r = p.lessons[l.id];
  if (!r?.done) return 0;
  const quiz = r.quiz?.best ?? null;
  const keep = retention[l.id] ?? null;
  const parts = [quiz, keep].filter((x) => x != null);
  const extra = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 1;
  return 0.5 + 0.5 * extra;
}

const summarize = (p, lessons, retention) => {
  const done = lessons.filter((l) => isDone(p, l.id)).length;
  const mastery = lessons.length ? lessons.reduce((a, l) => a + lessonMastery(p, l, retention), 0) / lessons.length : 0;
  return { done, total: lessons.length, mastery };
};

export const unitSummary = (p, u, retention) => summarize(p, u.lessons, retention);

export function trackSummary(p, trackId, retention) {
  return summarize(p, unitsOfTrack(trackId).flatMap((u) => u.lessons), retention);
}

export function overallSummary(p, retention) {
  return {
    ...summarize(p, units.flatMap((u) => u.lessons), retention),
    tracks: tracks.map((t) => ({ track: t, ...trackSummary(p, t.id, retention) })),
  };
}

/** Drops lesson ids that no longer exist (course edits) and bad records. */
export function cleanProgress(p, knownIds) {
  const lessons = {};
  for (const [id, r] of Object.entries(p?.lessons || {})) {
    if (knownIds.has(id) && r && typeof r === 'object') lessons[id] = r;
  }
  return { ...newProgress(p?.createdAt), ...p, lessons };
}
