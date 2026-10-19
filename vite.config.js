import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json' with { type: 'json' };

const BASE = '/learning-cars/';

export default defineConfig({
  base: BASE,
  build: { target: 'es2020' },
  define: { __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || pkg.version) },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // registered manually in src/core/sw.js
      includeAssets: ['favicon.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Learning Cars',
        short_name: 'Cars',
        description: 'How cars and motorcycles work, from pistons to CAN bus. Free, no accounts.',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        orientation: 'any',
        background_color: '#0b0c0e',
        theme_color: '#0b0c0e',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell, fonts and lesson content are precached.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        // Pyodide (~13 MB) is not precached: it downloads the first time an exercise runs,
        // then lives in its own cache so Python works offline.
        globIgnores: ['**/pyodide/**'],
        runtimeCaching: [{
          urlPattern: new RegExp(`${BASE}pyodide/`), // a RegExp, because functions can't be serialized into the SW
          handler: 'CacheFirst',
          options: { cacheName: `pyodide-${pkg.dependencies.pyodide}`, cacheableResponse: { statuses: [200] } },
        }],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: `${BASE}index.html`,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
});
