/**
 * qa-locale-shots — per-locale visual-QA screenshots of the built site.
 * Complements qa-browse.mjs (which sweeps everything for hard failures but
 * only screenshots a sample): this shoots a REVIEW SET — the pages a human
 * (or agent) actually eyeballs when signing off a locale — at laptop + phone.
 *
 * Usage:  node scripts/qa-locale-shots.mjs            # all 15 locales
 *         node scripts/qa-locale-shots.mjs de fr ja   # subset
 * Output: qa-report/locale-shots/<locale>-<page>-<viewport>.png (gitignored)
 * Requires a fresh `npm run build` (serves dist/ itself; no preview needed).
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const OUT = resolve(ROOT, 'qa-report', 'locale-shots');

const LOCALE_PATHS = ['en', 'de', 'fr', 'es', 'it', 'pt-br', 'nl', 'ja', 'zh-cn', 'ko', 'sv', 'da', 'pl', 'nb', 'fi'];
const PAGES = ['', 'pricing', 'faq', 'shopify-persistent-cart']; // home + conversion + FAQ + long-form
const VIEWPORTS = [
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];

const only = process.argv.slice(2).map((s) => s.toLowerCase());
const locales = only.length ? LOCALE_PATHS.filter((l) => only.includes(l)) : LOCALE_PATHS;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };

function distPath(urlPath) {
  const clean = urlPath.replace(/^\/+|\/+$/g, '');
  const candidates = clean === '' ? ['index.html'] : [clean, `${clean}.html`, `${clean}/index.html`];
  for (const c of candidates) {
    const p = resolve(DIST, c);
    if (existsSync(p) && extname(p)) return p;
    if (existsSync(`${p}.html`)) return `${p}.html`;
  }
  return null;
}

const server = createServer(async (req, res) => {
  const p = distPath(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
  res.end(await readFile(p));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let shot = 0;
for (const loc of locales) {
  for (const page of PAGES) {
    const urlPath = loc === 'en' ? `/${page}` : `/${loc}${page ? '/' + page : ''}`;
    for (const vp of VIEWPORTS) {
      // Phone shots only for home — layout risk concentrates there; laptop covers the rest.
      if (vp.name === 'phone' && page !== '') continue;
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const p = await ctx.newPage();
      const resp = await p.goto(base + urlPath.replace(/\/$/, '') || base, { waitUntil: 'networkidle' });
      if (!resp || !resp.ok()) { console.error(`MISS ${urlPath} (${resp && resp.status()})`); await ctx.close(); continue; }
      const name = `${loc}-${page || 'home'}-${vp.name}.png`;
      await p.screenshot({ path: resolve(OUT, name), fullPage: true });
      await ctx.close();
      shot++;
    }
  }
  console.log(`${loc}: done`);
}
await browser.close();
server.close();
console.log(`\n${shot} screenshots → qa-report/locale-shots/`);
