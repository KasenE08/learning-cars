// Hash router (GitHub Pages has no SPA fallback, so routes live after the #).
// Each screen module exports { tab, render(view, params) }; render may return a cleanup function.

const routes = [
  { re: /^\/?$/, name: 'home' },
  { re: /^\/course(?:\/(path|tracks))?$/, name: 'course', keys: ['view'] },
  { re: /^\/lesson\/([a-z]+-\d{2})$/, name: 'lesson', keys: ['id'] },
  { re: /^\/lab$/, name: 'lab' },
  { re: /^\/review$/, name: 'review' },
  { re: /^\/glossary(?:\/([\w-]+))?$/, name: 'glossary', keys: ['term'] },
  { re: /^\/progress$/, name: 'progress' },
  { re: /^\/settings$/, name: 'settings' },
];

export function parse(hash) {
  const path = (hash || '').replace(/^#/, '').split(/[?#]/)[0] || '/';
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      (r.keys || []).forEach((k, i) => { if (m[i + 1] !== undefined) params[k] = m[i + 1]; });
      return { name: r.name, params };
    }
  }
  return { name: 'home', params: {} };
}

export const go = (path) => { location.hash = path; };

export function start(screens, onRoute) {
  let cleanup = null;
  let last = null;
  const run = () => {
    const { name, params } = parse(location.hash);
    const screen = screens[name];
    if (cleanup) cleanup();
    const view = onRoute(screen, name, params);
    view.replaceChildren();
    view.dataset.screen = name;
    // Keep scroll when only a sub-view changes (e.g. course path ↔ tracks), else start at the top.
    if (last !== name) window.scrollTo(0, 0);
    last = name;
    cleanup = screen.render(view, params) || null;
  };
  window.addEventListener('hashchange', run);
  run();
  return { rerender: run };
}
