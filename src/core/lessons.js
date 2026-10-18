// Lazy loader for lesson content (each lesson is its own small chunk, all precached).
const modules = import.meta.glob('../content/lessons/*.js');

const pathFor = (id) => `../content/lessons/${id}.js`;
export const hasContent = (id) => pathFor(id) in modules;
export const builtIds = () => Object.keys(modules).map((p) => p.match(/([a-z]+-\d{2})\.js$/)[1]);

const cache = new Map();
export async function loadLesson(id) {
  if (!hasContent(id)) return null;
  if (!cache.has(id)) cache.set(id, modules[pathFor(id)]().then((m) => m.default));
  return cache.get(id);
}
