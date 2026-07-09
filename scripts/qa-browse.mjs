/**
 * QA browse — real-browser sweep of every built page at phone/tablet/laptop/wide
 * viewports. The deep half of the QA process (qa-gate.mjs is the static half):
 * catches what only a rendering engine sees — console errors, failed requests,
 * layout overflow, runtime-broken images, heading structure.
 *
 * Usage:
 *   npm run qa:browser                      # sweep local dist/ (build first)
 *   node scripts/qa-browse.mjs --base https://persistentcartapp.com   # sweep prod
 *   node scripts/qa-browse.mjs --filter es --screens all              # subset + shots
 *
 * Hard findings (exit 1): console errors, pageerrors, failed same-origin
 * requests, document-level horizontal overflow, broken <img>, h1 count ≠ 1.
 * Screenshots: sample set by default (EN pages all viewports + every locale home
 * at mobile), every failing page×viewport always, --screens all for everything.
 * Output dir: qa-report/ (gitignored).
 */
import { createServer } from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative, dirname, posix, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const OUT = resolve(ROOT, 'qa-report');

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = flag('base'); // e.g. https://persistentcartapp.com — omit to serve dist/
const FILTER = flag('filter'); // substring match on page path
const SCREENS = flag('screens') ?? 'sample'; // sample | all | failures
const CONCURRENCY = Number(flag('concurrency') ?? 6);

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'laptop', width: 1440, height: 900, deviceScaleFactor: 2 },
  { name: 'wide', width: 2560, height: 1440, deviceScaleFactor: 1 },
];

const CHROMIUM = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

// ---------------------------------------------------------------------------
// Page inventory from dist/ (works for --base runs too: prod mirrors dist)
// ---------------------------------------------------------------------------
async function walk(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) await walk(p, base, out);
    else out.push(posix.join(...relative(base, p).split(/[\\/]/)));
  }
  return out;
}

function toRoute(htmlFile) {
  if (htmlFile === 'index.html') return '/';
  return '/' + htmlFile.replace(/\.html$/, '');
}

// ---------------------------------------------------------------------------
// Minimal Netlify-style static server for dist/ (clean URLs, 404 page)
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURI(new URL(req.url, 'http://x').pathname);
      const candidates = path === '/'
        ? ['index.html']
        : [path.slice(1), path.slice(1) + '.html', posix.join(path.slice(1), 'index.html')];
      for (const c of candidates) {
        const fp = resolve(DIST, c);
        if (fp.startsWith(DIST) && existsSync(fp) && extname(fp)) {
          res.writeHead(200, { 'content-type': MIME[extname(fp)] ?? 'application/octet-stream' });
          res.end(await readFile(fp));
          return;
        }
      }
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(existsSync(resolve(DIST, '404.html')) ? await readFile(resolve(DIST, '404.html')) : 'not found');
    } catch (e) {
      res.writeHead(500);
      res.end(String(e));
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

// ---------------------------------------------------------------------------
// Audit one page in one viewport
// ---------------------------------------------------------------------------
async function auditPage(context, base, route, vp) {
  const page = await context.newPage();
  const finding = { route, viewport: vp.name, consoleErrors: [], pageErrors: [], failedRequests: [], layout: [] };
  page.on('console', (m) => {
    if (m.type() === 'error') finding.consoleErrors.push(m.text().slice(0, 300));
  });
  page.on('pageerror', (e) => finding.pageErrors.push(String(e).slice(0, 300)));
  page.on('requestfailed', (r) => {
    const url = r.url();
    const sameOrigin = url.startsWith(base) || url.startsWith('http://127.0.0.1');
    finding.failedRequests.push({ url: url.slice(0, 200), sameOrigin, reason: r.failure()?.errorText });
  });
  try {
    const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 30_000 });
    finding.status = resp?.status();
    await page.waitForTimeout(350); // settle islands/animations
    const layout = await page.evaluate(() => {
      const issues = [];
      const doc = document.documentElement;
      if (doc.scrollWidth > window.innerWidth + 1) {
        issues.push(`horizontal overflow: scrollWidth ${doc.scrollWidth} > viewport ${window.innerWidth}`);
      }
      const brokenImgs = [...document.querySelectorAll('img')]
        .filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith('data:'))
        .map((i) => i.getAttribute('src'));
      if (brokenImgs.length) issues.push(`broken img: ${brokenImgs.join(', ')}`);
      const h1s = document.querySelectorAll('h1').length;
      if (h1s !== 1) issues.push(`h1 count = ${h1s}`);
      const emptyLinks = [...document.querySelectorAll('a')].filter(
        (a) => !a.getAttribute('href') || a.getAttribute('href') === '#'
      ).length;
      if (emptyLinks) issues.push(`${emptyLinks} link(s) with empty/# href`);
      if (!document.title.trim()) issues.push('empty <title>');
      return issues;
    });
    finding.layout = layout;
  } catch (e) {
    finding.pageErrors.push('NAVIGATION: ' + String(e).slice(0, 200));
  }
  // Only same-origin request failures are hard findings (ad-blockers / consent
  // gating make external calls flaky and they're not our deploy's defect).
  finding.hard =
    finding.consoleErrors.length > 0 ||
    finding.pageErrors.length > 0 ||
    finding.layout.length > 0 ||
    (finding.status !== undefined && finding.status >= 400) ||
    finding.failedRequests.some((r) => r.sameOrigin);
  finding.shotWanted =
    SCREENS === 'all' ||
    finding.hard ||
    (SCREENS === 'sample' &&
      (!/^\/(?:de|fr|es|it|pt-br|nl|ja|zh-cn|ko|sv|da|pl|nb|fi)(?:\/|$)/.test(route) ||
        (vp.name === 'mobile' && /^\/(?:de|fr|es|it|pt-br|nl|ja|zh-cn|ko|sv|da|pl|nb|fi)$/.test(route))));
  if (finding.shotWanted) {
    const slug = (route === '/' ? 'home' : route.slice(1).replace(/\//g, '--')) + '@' + vp.name;
    finding.screenshot = `qa-report/${slug}.png`;
    await page.screenshot({ path: resolve(ROOT, finding.screenshot), fullPage: true }).catch(() => {});
  }
  await page.close();
  return finding;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const htmlFiles = (await walk(DIST)).filter((f) => f.endsWith('.html') && f !== '404.html');
let routes = htmlFiles.map(toRoute).sort();
if (FILTER) routes = routes.filter((r) => r.includes(FILTER));

const server = BASE ? null : await startServer();
const base = BASE ?? `http://127.0.0.1:${server.address().port}`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROMIUM });

const jobs = [];
for (const vp of VIEWPORTS) for (const route of routes) jobs.push({ route, vp });
console.log(`qa-browse — ${routes.length} pages × ${VIEWPORTS.length} viewports = ${jobs.length} loads against ${base}`);

const results = [];
let done = 0;
async function worker() {
  while (jobs.length) {
    const { route, vp } = jobs.shift();
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
      reducedMotion: 'reduce',
    });
    results.push(await auditPage(ctx, base, route, vp));
    await ctx.close();
    done++;
    if (done % 50 === 0) console.log(`  … ${done}/${results.length + jobs.length} loads`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();
server?.close();

const hard = results.filter((r) => r.hard);
await writeFile(resolve(OUT, 'qa-browse-results.json'), JSON.stringify(results, null, 1));

console.log(`\nqa-browse — ${results.length} page-loads audited, ${results.filter((r) => r.screenshot).length} screenshots in qa-report/`);
if (hard.length) {
  console.error(`\n✗ ${hard.length} page×viewport combination(s) with findings:`);
  for (const f of hard.slice(0, 30)) {
    console.error(`  ${f.route} [${f.viewport}]${f.status >= 400 ? ` HTTP ${f.status}` : ''}`);
    for (const c of f.consoleErrors.slice(0, 3)) console.error(`      console: ${c}`);
    for (const p of f.pageErrors.slice(0, 3)) console.error(`      pageerror: ${p}`);
    for (const l of f.layout) console.error(`      layout: ${l}`);
    for (const r of f.failedRequests.filter((x) => x.sameOrigin).slice(0, 3)) console.error(`      failed: ${r.url} (${r.reason})`);
  }
  if (hard.length > 30) console.error(`  … and ${hard.length - 30} more (see qa-report/qa-browse-results.json)`);
  console.error('\nqa-browse: FAIL');
  process.exit(1);
}
const extFails = new Set(results.flatMap((r) => r.failedRequests.filter((x) => !x.sameOrigin).map((x) => x.url)));
if (extFails.size) console.log(`  ℹ external requests that failed (not a defect gate): ${[...extFails].slice(0, 5).join(', ')}`);
console.log('\nqa-browse: PASS');
