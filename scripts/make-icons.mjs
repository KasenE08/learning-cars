// Renders the app icon SVG to the PNG sizes the manifest and iOS need.
// Icon: an orange piston + connecting rod on dark steel, with a hazard-stripe base.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const art = (scale) => `
  <g transform="translate(50 50) scale(${scale}) translate(-50 -50)">
    <!-- rod -->
    <path d="M44 52 L40 78 a10 10 0 0 0 20 0 L56 52 z" fill="#c24a07"/>
    <circle cx="50" cy="78" r="5" fill="#16191d"/>
    <!-- piston -->
    <rect x="28" y="18" width="44" height="36" rx="3" fill="#ff6b1a"/>
    <rect x="28" y="24" width="44" height="2.6" fill="#16191d"/>
    <rect x="28" y="29.5" width="44" height="2.6" fill="#16191d"/>
    <rect x="28" y="35" width="44" height="2.6" fill="#16191d"/>
    <circle cx="50" cy="46" r="4.5" fill="#16191d"/>
  </g>`;
const icon = (scale, size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#262b31"/><stop offset="1" stop-color="#0d0f12"/></linearGradient>
    <pattern id="h" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="#ffc21a"/><rect x="5" width="5" height="10" fill="#15130c"/></pattern>
  </defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <rect y="${scale < 1 ? 86 : 90}" width="100" height="14" fill="url(#h)"/>
  ${art(scale)}
</svg>`;

const out = [
  ['public/icons/icon-192.png', 192, 1],
  ['public/icons/icon-512.png', 512, 1],
  ['public/icons/apple-touch-icon.png', 180, 1],
  ['public/icons/icon-maskable-512.png', 512, 0.72],
  ['public/favicon.png', 64, 1],
];
writeFileSync('public/icon.svg', icon(1, 512));
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe });
for (const [path, size, scale] of out) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0">${icon(scale, size)}</body>`);
  await page.screenshot({ path });
  await page.close();
  console.log('wrote', path);
}
await browser.close();
