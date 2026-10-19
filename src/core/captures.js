// Saved CAN captures (candump text) in IndexedDB, newest first. Kept on this device only:
// they're big, so they are not part of the progress backup file.
import * as db from './db.js';

const KEY = 'captures';
const MAX = 10;
const listeners = new Set();

export async function listCaptures() { return (await db.get(KEY)) || []; }
export function onCaptures(fn) { listeners.add(fn); return () => listeners.delete(fn); }
const emit = (list) => listeners.forEach((fn) => fn(list));

export async function saveCapture({ name, text, seconds, count, source = 'bench' }) {
  const list = await listCaptures();
  const item = { id: `cap-${Date.now().toString(36)}`, name, text, seconds, count, source, at: Date.now() };
  const next = [item, ...list].slice(0, MAX);
  await db.set(KEY, next);
  emit(next);
  return item;
}

export async function deleteCapture(id) {
  const next = (await listCaptures()).filter((c) => c.id !== id);
  await db.set(KEY, next);
  emit(next);
}

export async function renameCapture(id, name) {
  const next = (await listCaptures()).map((c) => (c.id === id ? { ...c, name } : c));
  await db.set(KEY, next);
  emit(next);
}

/** File-safe name for the Python bench: "Blinker test" → "blinker-test.log" */
export const fileNameOf = (c) => `${(c.name || c.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'capture'}.log`;
