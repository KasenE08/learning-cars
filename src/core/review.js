// Flashcard review queue. The FSRS scheduler lands in Phase 2; until then nothing is due.
import { getCards } from './store.js';

export function dueCards(now = Date.now()) {
  return Object.values(getCards()).filter((c) => c?.due != null && c.due <= now);
}

export const dueCount = (now) => dueCards(now).length;
