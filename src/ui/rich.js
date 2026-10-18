// Tiny inline markup for lesson text:
//   **bold**   `mono`   [[glossary-id]]   [[glossary-id|shown text]]   ~~note~~ (muted aside)
import { esc, raw } from './dom.js';
import { glossary } from '../content/glossary.js';

const terms = new Map(glossary.map((g) => [g.id, g]));

export function rich(src) {
  let s = esc(src);
  s = s.replace(/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
    const g = terms.get(id);
    const text = label || g?.term || id;
    return g ? `<a class="gl" href="#/glossary/${id}" data-gloss="${id}">${text}</a>` : text;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  s = s.replace(/`(.+?)`/g, '<code>$1</code>');
  s = s.replace(/~~(.+?)~~/g, '<span class="aside">$1</span>');
  return raw(s);
}

export const termById = (id) => terms.get(id) || null;
