// Flashcard deck: adding cards when a lesson is finished, the due queue, and per-lesson recall.
import { getCards } from './store.js';
import { newCard, recall } from './fsrs.js';

export const cardKey = (lessonId, cardId) => `${lessonId}:${cardId}`;

export function dueCards(now = Date.now(), cards = getCards()) {
  return Object.values(cards).filter((c) => c?.s && c.s.due <= now).sort((a, b) => a.s.due - b.s.due);
}

export const dueCount = (now) => dueCards(now).length;

/** Adds any of the lesson's cards that aren't in the deck yet. Returns { cards, added }. */
export function addLessonCards(cards, lessonId, lessonCards, now = Date.now()) {
  const next = { ...cards };
  let added = 0;
  for (const c of lessonCards) {
    const key = cardKey(lessonId, c.id);
    if (!next[key]) { next[key] = newCard(key, lessonId, now); added++; }
  }
  return { cards: next, added };
}

/** lessonId → average recall probability of its cards. */
export function retentionByLesson(now = Date.now(), cards = getCards()) {
  const sums = {};
  for (const c of Object.values(cards)) {
    if (!c?.s) continue;
    const r = (sums[c.lesson] ||= [0, 0]);
    r[0] += recall(c, now);
    r[1]++;
  }
  return Object.fromEntries(Object.entries(sums).map(([k, [s, n]]) => [k, s / n]));
}
