// SVG helpers shared by the diagrams.
export const NS = 'http://www.w3.org/2000/svg';

/** Common defs: section hatching (cut metal), metal gradient, flame gradient. */
export const defs = (id) => `<defs>
  <pattern id="${id}-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="6" height="6" class="d-cut-bg"/><line x1="0" y1="0" x2="0" y2="6" class="d-hatch"/>
  </pattern>
  <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" class="d-metal-a"/><stop offset="0.45" class="d-metal-b"/><stop offset="1" class="d-metal-a"/>
  </linearGradient>
  <radialGradient id="${id}-flame" cx="50%" cy="0%" r="100%">
    <stop offset="0" stop-color="#fff3b0"/><stop offset="0.35" stop-color="#ffc21a"/><stop offset="1" stop-color="#ff6b1a"/>
  </radialGradient>
</defs>`;

let n = 0;
export const uid = (p = 'v') => `${p}${++n}`;

/** Leader-line label: text at (x,y), line to target (tx,ty). anchor 'start'|'end'. */
export const label = (text, x, y, tx, ty, anchor = 'start', cls = '') =>
  `<g class="d-label ${cls}"><path d="M${tx},${ty} L${x + (anchor === 'end' ? 4 : -4)},${y - 4}" class="d-leader"/><circle cx="${tx}" cy="${ty}" r="2" class="d-dot"/><text x="${x}" y="${y}" text-anchor="${anchor}">${text}</text></g>`;

export const set = (node, attrs) => { for (const k in attrs) node.setAttribute(k, attrs[k]); };
