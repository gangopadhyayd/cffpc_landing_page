/**
 * Verifies per-lead outreach-token forwarding (src/components/LeadToken.astro).
 *
 * Serves the built dist/ locally and drives headless Chromium (playwright-core,
 * same local binary qa-browse.mjs uses) through the four spec cases:
 *   (a) tokened visit → header CTA carries the lead's UTMs + utm_term=header
 *       (asserted on the anchor href AND on the real click navigation)
 *   (b) navigate to /pricing with no params → CTA still tokenized (localStorage)
 *   (c) fresh profile, plain visit → CTAs unchanged static
 *   (d) expired token → behaves like organic (token cleared, CTAs static)
 *   (+) first-touch-wins: a second tokened visit does NOT overwrite the stored one
 *
 * Usage: node scripts/verify-lead-token.mjs   (run `npx astro build` first)
 * Exit 0 = all pass, 1 = any failure.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const CHROMIUM =
  process.env.HOME +
  '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

function startServer() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0]);
    const cands =
      path === '/'
        ? ['index.html']
        : [path.slice(1), path.slice(1) + '.html', `${path.slice(1)}/index.html`];
    for (const c of cands) {
      const fp = resolve(DIST, c);
      if (existsSync(fp) && fp.startsWith(DIST)) {
        res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' });
        res.end(await readFile(fp));
        return;
      }
    }
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end('not found');
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

// --- assertions ------------------------------------------------------------
let failures = 0;
function check(name, cond, detail) {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n          ${detail}` : ''}`);
}
function params(href) {
  try {
    return Object.fromEntries(new URL(href).searchParams.entries());
  } catch {
    return {};
  }
}
async function headerCtaHref(page) {
  return page.getAttribute('a[data-source="header"]', 'href');
}

// --- run -------------------------------------------------------------------
const server = await startServer();
const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: CHROMIUM, headless: true });
const TOKEN_Q = 'utm_source=outreach&utm_medium=email&utm_campaign=pcv2&utm_content=test-store.com';

try {
  // ===== (a) tokened visit → tokened header CTA (href + real click) =====
  console.log('\n(a) tokened visit → header CTA carries the lead UTMs');
  const ctxA = await browser.newContext();
  const a = await ctxA.newPage();
  const clicked = [];
  await ctxA.route(/apps\.shopify\.com/, (route) => {
    clicked.push(route.request().url());
    route.abort();
  });
  await a.goto(`${BASE}/?${TOKEN_Q}`, { waitUntil: 'domcontentloaded' });
  const hrefA = await headerCtaHref(a);
  const pA = params(hrefA);
  check('header CTA href host is apps.shopify.com', /apps\.shopify\.com\/cart-persistify/.test(hrefA), hrefA);
  check('utm_source=outreach', pA.utm_source === 'outreach', `got ${pA.utm_source}`);
  check('utm_medium=email', pA.utm_medium === 'email', `got ${pA.utm_medium}`);
  check('utm_campaign=pcv2', pA.utm_campaign === 'pcv2', `got ${pA.utm_campaign}`);
  check('utm_content=test-store.com (the lead token)', pA.utm_content === 'test-store.com', `got ${pA.utm_content}`);
  check('utm_term=header (original placement kept)', pA.utm_term === 'header', `got ${pA.utm_term}`);
  // real click on the target=_blank CTA → capture the navigation URL
  const [popup] = await Promise.all([
    ctxA.waitForEvent('page').catch(() => null),
    a.click('a[data-source="header"]'),
  ]);
  await a.waitForTimeout(400);
  if (popup) await popup.close().catch(() => {});
  const clickUrl = clicked[0] || '';
  const pc = params(clickUrl);
  check(
    'click navigation URL carries the lead UTMs',
    pc.utm_source === 'outreach' && pc.utm_content === 'test-store.com' && pc.utm_term === 'header',
    clickUrl || '(no navigation captured)'
  );

  // first-touch-wins: a SECOND tokened visit must not overwrite the stored token
  console.log('\n(+) first-touch-wins on a second, different tokened visit');
  await a.goto(`${BASE}/?utm_source=outreach&utm_medium=email&utm_campaign=pcv2&utm_content=other-store.com`, {
    waitUntil: 'domcontentloaded',
  });
  const stored = await a.evaluate(() => JSON.parse(localStorage.getItem('pc-lead-token') || 'null'));
  check(
    'stored token still test-store.com (not overwritten)',
    stored && stored.params && stored.params.utm_content === 'test-store.com',
    JSON.stringify(stored && stored.params)
  );
  const pAfter = params(await headerCtaHref(a));
  check('header CTA still points at test-store.com', pAfter.utm_content === 'test-store.com', `got ${pAfter.utm_content}`);

  // ===== (b) cross-navigation: /pricing with no params, token from localStorage =====
  console.log('\n(b) navigate to /pricing (no params) → CTA still tokenized');
  const b = await ctxA.newPage(); // same context = same localStorage
  await b.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded' });
  const pB = params(await headerCtaHref(b));
  check('no token in the /pricing URL itself', !new URL(`${BASE}/pricing`).search, `${BASE}/pricing`);
  check('header CTA utm_source=outreach (carried via localStorage)', pB.utm_source === 'outreach', `got ${pB.utm_source}`);
  check('header CTA utm_content=test-store.com', pB.utm_content === 'test-store.com', `got ${pB.utm_content}`);
  check('header CTA utm_term=header', pB.utm_term === 'header', `got ${pB.utm_term}`);
  await b.close();
  await ctxA.close();

  // ===== (c) fresh profile, plain visit → CTAs unchanged static =====
  console.log('\n(c) fresh profile, plain visit → CTAs unchanged (organic)');
  const ctxC = await browser.newContext();
  const c = await ctxC.newPage();
  await c.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const hrefC = await headerCtaHref(c);
  const pC = params(hrefC);
  check('utm_source=persistentcartapp.com (static)', pC.utm_source === 'persistentcartapp.com', `got ${pC.utm_source}`);
  check('utm_medium=referral (static)', pC.utm_medium === 'referral', `got ${pC.utm_medium}`);
  check('utm_campaign=site (static)', pC.utm_campaign === 'site', `got ${pC.utm_campaign}`);
  check('utm_content=header (static placement)', pC.utm_content === 'header', `got ${pC.utm_content}`);
  check('no utm_term added', pC.utm_term === undefined, `got ${pC.utm_term}`);
  const taggedC = await c.getAttribute('a[data-source="header"]', 'data-pc-tokenized');
  check('anchor NOT marked data-pc-tokenized', taggedC === null, `got ${taggedC}`);
  await ctxC.close();

  // ===== (d) expired token → behaves like organic =====
  console.log('\n(d) expired token → cleared, CTAs revert to static');
  const ctxD = await browser.newContext();
  const d = await ctxD.newPage();
  await d.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' }); // reach the origin first
  await d.evaluate(() => {
    localStorage.setItem(
      'pc-lead-token',
      JSON.stringify({ v: 1, exp: Date.now() - 1000, params: { utm_source: 'outreach', utm_content: 'expired-store.com' } })
    );
  });
  await d.reload({ waitUntil: 'domcontentloaded' });
  const pD = params(await headerCtaHref(d));
  check('CTA static again — utm_source=persistentcartapp.com', pD.utm_source === 'persistentcartapp.com', `got ${pD.utm_source}`);
  check('CTA static again — utm_content=header', pD.utm_content === 'header', `got ${pD.utm_content}`);
  check('no utm_term', pD.utm_term === undefined, `got ${pD.utm_term}`);
  const clearedD = await d.evaluate(() => localStorage.getItem('pc-lead-token'));
  check('expired token removed from localStorage', clearedD === null, `got ${clearedD}`);
  console.log('      (absent-token case is identical to (c) above)');
  await ctxD.close();
} finally {
  await browser.close();
  server.close();
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
