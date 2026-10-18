// Thin wrapper around ts-fsrs (FSRS v6 defaults, 90% target recall).
// Stored card = { id, lesson, added, s: { due, stability, difficulty, elapsed_days, scheduled_days,
//                 learning_steps, reps, lapses, state, last_review } } with times as epoch ms.
import { fsrs, generatorParameters, createEmptyCard, Rating } from 'ts-fsrs';

export { Rating };
export const GRADES = [
  { rating: Rating.Again, key: 'again', label: 'Again', hint: 'Forgot it' },
  { rating: Rating.Hard, key: 'hard', label: 'Hard', hint: 'Got it, with effort' },
  { rating: Rating.Good, key: 'good', label: 'Good', hint: 'Got it' },
  { rating: Rating.Easy, key: 'easy', label: 'Easy', hint: 'Instant' },
];

const scheduler = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }));

const toStored = (c) => ({
  ...c,
  due: +c.due,
  last_review: c.last_review ? +c.last_review : null,
});
const fromStored = (s) => ({
  ...s,
  due: new Date(s.due),
  last_review: s.last_review ? new Date(s.last_review) : undefined,
});

export function newCard(id, lesson, now = Date.now()) {
  return { id, lesson, added: now, s: toStored(createEmptyCard(new Date(now))) };
}

export function grade(card, rating, now = Date.now()) {
  const r = scheduler.next(fromStored(card.s), new Date(now), rating);
  return { ...card, s: toStored(r.card) };
}

/** Next due time for each grade, for the button labels. */
export function preview(card, now = Date.now()) {
  const out = {};
  const r = scheduler.repeat(fromStored(card.s), new Date(now));
  for (const g of GRADES) out[g.rating] = +r[g.rating].card.due;
  return out;
}

/** Probability (0..1) you'd recall the card right now. New cards count as 0. */
export function recall(card, now = Date.now()) {
  if (!card.s.reps) return 0;
  return scheduler.get_retrievability(fromStored(card.s), new Date(now), false);
}

/** "10m", "3d", "2mo", "1.4y" */
export function fmtInterval(ms) {
  const m = ms / 60000;
  if (m < 60) return `${Math.max(1, Math.round(m))}m`;
  const h = m / 60;
  if (h < 24) return `${Math.round(h)}h`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)}d`;
  if (d < 365) return `${Math.round(d / 30)}mo`;
  return `${(d / 365).toFixed(1)}y`;
}
