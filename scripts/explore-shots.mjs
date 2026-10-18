// Screenshot explorer nodes / exploded views. node scripts/explore-shots.mjs out
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const [out = 'screenshots/explore'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const server = await createServer({ server: { port: 5184, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
const page = await ctx.newPage();
let errs = 0;
page.on('pageerror', (e) => { errs++; console.error('pageerror', e.message); });
page.on('console', (m) => { if (m.type() === 'error') { errs++; console.error('console', m.text()); } });
const go = async (hash) => { await page.goto(`http://localhost:5184/learning-cars/#${hash}`); await page.waitForSelector(hash === '/lab' ? '.lab' : '.vis'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500); };
const shot = async (name, full = true) => { await page.waitForTimeout(300); await page.screenshot({ path: `${out}/${name}.png`, fullPage: full }); console.log('shot', name); };
await go('/lab'); await shot('lab');
await go('/explore/car'); await shot('car-top');
await page.locator('[data-part="rdu"]').first().dispatchEvent('click'); await shot('car-top-rdu');
await page.click('.pchip:has-text("Labels")'); await shot('car-top-labels');
await page.click('.pchip:has-text("Side")'); await page.waitForTimeout(300); await shot('car-side');
await go('/explore/moto'); await page.locator('[data-part="clutch"]').first().dispatchEvent('click'); await shot('moto');
await go('/explore/drivetrain'); await shot('awd');
await page.click('.pchip:has-text("Rear-right in the air")'); await page.click('.pchip:has-text("Rock Crawl")'); await page.click('.pchip:has-text("Rear diff lock")'); await shot('awd-air-lock');
await page.click('.pchip:has-text("Front-left on ice")'); await shot('awd-ice');
await go('/explore/rdu'); await shot('rdu');
for (const [name, hash] of [['x-engine', '/explore/engine?v=2'], ['x-gearbox', '/explore/drivetrain?v=2'], ['x-diff', '/explore/drivetrain?v=1'], ['x-turbo', '/explore/turbo'], ['x-clutch', '/explore/drivetrain?v=3'], ['x-wetclutch', '/explore/moto-clutch']]) {
  await go(hash);
  await page.waitForSelector('.xp');
  await shot(`${name}-0`, false);
  await page.evaluate(() => { const s = document.querySelector('.vis--exploded .rng'); s.value = 100; s.dispatchEvent(new Event('input')); });
  await page.locator('.xp').nth(2).dispatchEvent('click');
  await shot(`${name}-1`, false);
}
await go('/explore/head'); await shot('head');
console.log('errors', errs);
await browser.close();
await server.close();
