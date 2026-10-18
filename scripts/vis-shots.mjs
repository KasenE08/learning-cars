// Screenshot visuals on the bench at given crank angles: node scripts/vis-shots.mjs out type '{"mode":"cycle"}' t1,t2,...
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [out, type, spec = '{}', times = '0', width = '390'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const server = await createServer({ server: { port: 5182, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('console', m.text()); });
await page.goto(`http://localhost:5182/learning-cars/#/vis/${type}?${encodeURIComponent(spec)}`);
await page.waitForSelector('.vis');
await page.evaluate(() => document.fonts.ready);
for (const t of times.split(',')) {
  if (t !== '-') {
    await page.evaluate((v) => { const s = document.querySelector('.tl__scrub'); if (s) { s.value = v; s.dispatchEvent(new Event('input')); } }, t);
  }
  await page.waitForTimeout(150);
  const box = await page.locator('.host').boundingBox();
  await page.screenshot({ path: `${out}/${type}-${t}.png`, clip: { x: 0, y: 0, width: Number(width), height: Math.ceil(box.y + box.height + 10) } });
  console.log('shot', `${type}-${t}`);
}
await browser.close();
await server.close();
