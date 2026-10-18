import { raw } from './dom.js';

const s = (body, vb = '0 0 24 24') => raw(`<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`);

export const icons = {
  // garage door
  home: s('<path d="M3 10.5L12 4l9 6.5V20H3z"/><path d="M7 20v-7h10v7M7 15.5h10M7 18h10"/>'),
  // route with stops
  course: s('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 5h7a3.5 3.5 0 010 7H9a3.5 3.5 0 000 7h7"/>'),
  // oscilloscope trace
  lab: s('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M6 13h2.5l1.5-4 2.5 7 2-5 1 2H18M9 21h6"/>'),
  // card stack
  review: s('<rect x="6" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/><path d="M10 13.5l2 2 3.5-4"/>'),
  // book with A
  glossary: s('<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/><path d="M9.5 11l2-5 2 5M10.2 9.4h2.6"/>'),
  // gauge
  progress: s('<path d="M4 17a8 8 0 1116 0"/><path d="M12 17l4-5"/><path d="M6.5 13.5l1 .5M12 9v1M17.5 13.5l-1 .5"/>'),
  // wrench
  settings: s('<path d="M14.5 6.5a4 4 0 00-5.2 5.2L4 17l3 3 5.3-5.3a4 4 0 005.2-5.2l-2.6 2.6-2.6-.6-.6-2.6z"/>'),
  check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>', '0 0 24 24'),
  chevron: s('<path d="M9 5l7 7-7 7"/>'),
  back: s('<path d="M15 5l-7 7 7 7"/>'),
  search: s('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'),
  clock: s('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
  download: s('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
  upload: s('<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>'),
  close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
  play: raw('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>'),
  car: s('<path d="M3 15.5v-3l2-5h11l3.5 5H21v3"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><path d="M9 16h6M5 12.5h14"/>'),
  bike: s('<circle cx="5.5" cy="16" r="3.5"/><circle cx="18.5" cy="16" r="3.5"/><path d="M5.5 16l4-6h5l4 6M9.5 10l-1-2.5H6M14.5 10l1.5-3h2.5M11 16l3.5-6"/>'),
};
