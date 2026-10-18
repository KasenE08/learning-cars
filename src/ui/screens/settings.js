import { html, el } from '../dom.js';
import { icons } from '../icons.js';
import { pageHead } from '../components/parts.js';
import { message, confirmSheet } from '../components/sheet.js';
import { getProgress, getCards, getSettings, replaceAll, resetAll } from '../../core/store.js';
import { makeBackup, backupFileName, parseBackup, describeBackup } from '../../core/backup.js';

export const tab = 'settings';

async function exportBackup() {
  const data = makeBackup({ progress: getProgress(), cards: getCards(), settings: getSettings() });
  const name = backupFileName();
  const file = new File([JSON.stringify(data, null, 2)], name, { type: 'application/json' });
  // iPhone: the share sheet lets you save to Files / iCloud / AirDrop.
  try {
    if (navigator.canShare?.({ files: [file] }) && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ files: [file], title: 'Learning Cars backup' });
      return;
    }
  } catch (e) {
    if (e?.name === 'AbortError') return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

async function storageStatus() {
  try {
    if (!navigator.storage?.persisted) return 'Unknown on this browser.';
    return (await navigator.storage.persisted()) ? 'Persistent: the browser won’t clear it on its own.' : 'Best effort: the browser may clear it if space runs low. Export a backup now and then.';
  } catch { return 'Unknown on this browser.'; }
}

export function render(view) {
  const screen = el(html`<div class="screen settings">
    ${pageHead('Config', 'Settings')}
    <section class="plate setgroup">
      <h2 class="h3">Backup</h2>
      <p class="muted">Progress lives on this device only. Save a backup file to keep it safe or move it to another device.</p>
      <p class="mono setgroup__now" data-now></p>
      <div class="btn-row">
        <button class="btn btn--primary" data-export>${icons.download}Export backup</button>
        <button class="btn" data-import>${icons.upload}Import backup</button>
      </div>
      <input type="file" accept="application/json,.json" data-file hidden>
    </section>
    <section class="plate setgroup">
      <h2 class="h3">Storage</h2>
      <p class="muted" data-storage>Checking…</p>
    </section>
    <section class="plate setgroup">
      <h2 class="h3">Reset</h2>
      <p class="muted">Erase all progress and flashcards on this device. Can’t be undone (unless you have a backup).</p>
      <div class="btn-row"><button class="btn btn--danger" data-reset>Reset everything</button></div>
    </section>
    <section class="plate setgroup">
      <h2 class="h3">About</h2>
      <p class="muted">Learning Cars v${__APP_VERSION__}. Free, no accounts, no tracking. Everything runs in your browser.</p>
      <p class="muted">Fonts: Big Shoulders Stencil, Barlow, JetBrains Mono (SIL Open Font License). All diagrams are original.</p>
    </section>
  </div>`);

  const now = screen.querySelector('[data-now]');
  now.textContent = `On this device: ${describeBackup({ progress: getProgress(), cards: getCards() })}`;
  storageStatus().then((t) => { screen.querySelector('[data-storage]').textContent = t; });

  screen.querySelector('[data-export]').addEventListener('click', exportBackup);
  const file = screen.querySelector('[data-file]');
  screen.querySelector('[data-import]').addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    file.value = '';
    if (!f) return;
    let b;
    try { b = parseBackup(await f.text()); } catch (e) { message('Can’t import', e.message); return; }
    const ok = await confirmSheet({
      kicker: `Import backup${b.exportedAt ? ` · saved ${new Date(b.exportedAt).toLocaleDateString()}` : ''}`,
      title: 'Replace your progress?',
      text: `Backup: ${describeBackup(b)}. On this device: ${describeBackup({ progress: getProgress(), cards: getCards() })}. The backup replaces what’s here.`,
      yes: 'Replace',
    });
    if (!ok) return;
    await replaceAll(b);
    location.hash = '#/';
  });
  screen.querySelector('[data-reset]').addEventListener('click', async () => {
    const ok = await confirmSheet({ title: 'Reset everything?', text: 'All lessons, quiz scores and flashcards on this device are erased.', yes: 'Erase', danger: true });
    if (!ok) return;
    await resetAll();
    location.hash = '#/';
  });
  view.append(screen);
}
