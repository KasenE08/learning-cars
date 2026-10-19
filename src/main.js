import '@fontsource/big-shoulders-stencil-display/latin-700';
import '@fontsource/big-shoulders-stencil-display/latin-800';
import '@fontsource/barlow/latin-400';
import '@fontsource/barlow/latin-500';
import '@fontsource/barlow/latin-600';
import '@fontsource/barlow/latin-700';
import '@fontsource/jetbrains-mono/latin-400';
import '@fontsource/jetbrains-mono/latin-600';
import './ui/styles/tokens.css';
import './ui/styles/base.css';
import './ui/styles/app.css';
import './ui/styles/visuals.css';
import './ui/styles/lesson.css';
import './ui/styles/code.css';

import { start } from './router.js';
import { registerServiceWorker } from './core/sw.js';
import { requestPersistence } from './core/db.js';
import * as store from './core/store.js';
import { dueCount } from './core/review.js';
import { mountShell } from './ui/components/shell.js';
import * as home from './ui/screens/home.js';
import * as course from './ui/screens/course.js';
import * as lesson from './ui/screens/lesson.js';
import * as lab from './ui/screens/lab.js';
import * as python from './ui/screens/python.js';
import * as review from './ui/screens/review.js';
import * as glossary from './ui/screens/glossary.js';
import * as progress from './ui/screens/progress.js';
import * as settings from './ui/screens/settings.js';
import * as vis from './ui/screens/vis.js';
import * as explore from './ui/screens/explore.js';

const screens = { home, course, lesson, lab, python, review, glossary, progress, settings, vis, explore };

async function boot() {
  await store.load();
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('demo')) {
    const { demoProgress } = await import('./dev/demo.js');
    store.useTransient(demoProgress());
  }
  const shell = mountShell(document.getElementById('app'));
  const badge = () => shell.setBadge('review', dueCount());
  store.subscribe(badge);
  badge();
  start(screens, (screen) => {
    shell.setActive(screen.tab);
    return shell.view;
  });
  registerServiceWorker();
  requestPersistence();
}

boot();
