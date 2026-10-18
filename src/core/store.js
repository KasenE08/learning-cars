// App state (progress, flashcards, settings), loaded from IndexedDB, with change listeners.
import * as db from './db.js';
import { newProgress, cleanProgress } from './progress.js';
import { allLessons } from './course.js';

const DEFAULT_SETTINGS = { units: 'auto' };
const known = new Set(allLessons().map((l) => l.id));

const state = { progress: newProgress(), cards: {}, settings: { ...DEFAULT_SETTINGS } };
const listeners = new Set();

export const getProgress = () => state.progress;
export const getCards = () => state.cards;
export const getSettings = () => state.settings;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const emit = () => listeners.forEach((fn) => fn(state));

export async function load() {
  const [p, c, s] = await Promise.all([db.get('progress'), db.get('cards'), db.get('settings')]);
  if (p) state.progress = cleanProgress(p, known);
  if (c) state.cards = c;
  if (s) state.settings = { ...DEFAULT_SETTINGS, ...s };
  emit();
}

export async function saveProgress(next) {
  state.progress = next;
  emit();
  await db.set('progress', next);
}

export async function saveCards(next) {
  state.cards = next;
  emit();
  await db.set('cards', next);
}

export async function saveSettings(patch) {
  state.settings = { ...state.settings, ...patch };
  emit();
  await db.set('settings', state.settings);
}

/** Replace everything (backup import). */
export async function replaceAll({ progress, cards, settings }) {
  state.progress = cleanProgress(progress, known);
  state.cards = cards || {};
  state.settings = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  emit();
  await Promise.all([db.set('progress', state.progress), db.set('cards', state.cards), db.set('settings', state.settings)]);
}

export async function resetAll() {
  await db.clear();
  state.progress = newProgress();
  state.cards = {};
  state.settings = { ...DEFAULT_SETTINGS };
  emit();
}

/** Dev only: use sample progress without saving it (for screenshots). */
export function useTransient(p) {
  state.progress = p;
  emit();
}
