// Screenshots at iPhone (390×844 @3x) and laptop (1440×900) sizes.
// Usage: npm run shots -- [outDir] [name ...]   (outDir defaults to screenshots/)
// Uses the Vite dev server; ?demo loads sample mid-course progress (never saved).
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [outDir = 'screenshots', ...only] = process.argv.slice(2);
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const LAPTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

const SHOTS = [
  ['home', '#/', true], ['home-new', '#/', false], ['course', '#/course', true], ['course-tracks', '#/course/tracks', true],
  ['lesson', '#/lesson/engine-02', true], ['lesson-planned', '#/lesson/boost-02', true], ['explore-car', '#/explore/car', false], ['explore-awd', '#/explore/drivetrain', false], ['explore-x', '#/explore/engine?v=2', false], ['vis-head', '#/vis/parts?' + encodeURIComponent('{"drawing":"head"}'), false], ['lab', '#/lab', false], ['review', '#/review', false],
  ['glossary', '#/glossary', false], ['glossary-term', '#/glossary/stroke', false], ['progress', '#/progress', true], ['settings', '#/settings', false],
];

mkdirSync(outDir, { recursive: true });
const server = await createServer({ server: { port: 5181, strictPort: true }, logLevel: 'error' });
await server.listen();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe });
let errors = 0;
for (const [dev, opts] of [['phone', PHONE], ['laptop', LAPTOP]]) {
  for (const [name, hash, demo] of SHOTS.filter(([n]) => !only.length || only.includes(n))) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => { errors++; console.error(`[${dev}/${name}] pageerror:`, e.message); });
    page.on('console', (m) => { if (m.type() === 'error') { errors++; console.error(`[${dev}/${name}] console:`, m.text()); } });
    await page.goto(`http://localhost:5181/learning-cars/${demo ? '?demo' : ''}${hash}`);
    await page.waitForSelector('#view > *');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${outDir}/${dev}-${name}.png`, fullPage: name.startsWith('course') || name === 'progress' });
    // No sideways scrolling, ever.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) { errors++; console.error(`[${dev}/${name}] horizontal overflow: ${overflow}px`); }
    console.log('shot', `${dev}-${name}`);
    await ctx.close();
  }
}
await browser.close();
await server.close();
if (errors) { console.error(`${errors} problem(s)`); process.exit(1); }
