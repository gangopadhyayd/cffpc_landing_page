/**
 * QA gate — post-build static audit of dist/. Fails (exit 1) on defects that
 * would ship broken UX, so it runs as part of `npm run build` and blocks any
 * Netlify deploy that regresses. Run standalone: `npm run qa:gate`.
 *
 * Hard failures:
 *   1. Leaked i18n keys — raw catalog keys (e.g. "footer.link.b2b") visible in
 *      rendered text, meta copy, or alt/aria attributes. Catches keys referenced
 *      in code (incl. dynamic `t(locale, `x.${key}`)` constructions) that are
 *      missing from src/i18n/strings/en.json — the class of bug that shipped
 *      2026-07-08 when re-enabled pages got footer slots without footer strings.
 *   2. Broken internal links/assets — href/src/srcset/og-image/CSS url() that
 *      resolve to no file in dist. Case-SENSITIVE match (macOS hides case bugs
 *      that 404 on Netlify). netlify.toml redirect sources count as valid.
 *   3. Sitemap rot — sitemap URLs with no corresponding file.
 *   4. i18n locale drift — any English key missing from a locale catalog
 *      (delegates to scripts/i18n-check.mjs).
 *
 * Warnings (reported, never fail): emitted pages absent from the sitemap.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCheck as runI18nDriftCheck } from './i18n-check.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SITE_ORIGINS = ['https://persistentcartapp.com', 'https://www.persistentcartapp.com'];

// ---------------------------------------------------------------------------
// Inventory: every file in dist, exact (case-sensitive) relative posix paths.
// ---------------------------------------------------------------------------
async function walk(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = resolve(dir, e.name);
    if (e.isDirectory()) await walk(p, base, out);
    else out.push(posix.join(...relative(base, p).split(/[\\/]/)));
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. Leaked i18n keys in rendered copy
// ---------------------------------------------------------------------------
// A leak looks like `word.word.word` (3+ dot segments, starts lowercase).
const KEY_TOKEN = /(?<![\w@/.:#-])[a-z][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9_-]+){2,}(?![\w/])/g;
// Tokens whose final segment is a TLD or file extension are URLs/files, not keys.
const NOT_A_KEY_TAIL = new Set([
  'com', 'net', 'org', 'io', 'dev', 'app', 'co', 'ai', 'uk', 'eu',
  'html', 'css', 'js', 'mjs', 'json', 'xml', 'txt', 'svg', 'png', 'jpg',
  'jpeg', 'webp', 'avif', 'gif', 'ico', 'woff', 'woff2', 'pdf', 'md',
]);

function stripToVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ');
}

function copyAttributes(html) {
  const out = [];
  const attrRe = /\b(?:alt|title|aria-label|placeholder)="([^"]*)"/g;
  for (const m of html.matchAll(attrRe)) out.push(m[1]);
  const metaRe = /<meta[^>]+(?:name|property)="(?:description|og:[a-z:]+|twitter:[a-z:]+)"[^>]*content="([^"]*)"[^>]*>/g;
  for (const m of html.matchAll(metaRe)) out.push(m[1]);
  return out.join('\n');
}

function findLeakedKeys(html) {
  const haystack = stripToVisibleText(html) + '\n' + copyAttributes(html);
  const leaks = new Set();
  for (const m of haystack.matchAll(KEY_TOKEN)) {
    const token = m[0];
    const tail = token.split('.').pop().toLowerCase();
    if (NOT_A_KEY_TAIL.has(tail)) continue;
    leaks.add(token);
  }
  return [...leaks];
}

// ---------------------------------------------------------------------------
// 2. Internal link + asset resolution
// ---------------------------------------------------------------------------
function parseRedirectSources(toml) {
  const sources = new Set();
  for (const m of toml.matchAll(/^\s*from\s*=\s*"([^"]+)"/gm)) sources.add(m[1]);
  return sources;
}

function extractRefs(html) {
  const refs = [];
  for (const m of html.matchAll(/\b(?:href|src|poster|action)="([^"]*)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/\bsrcset="([^"]*)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|og:video|twitter:image)"[^>]*content="([^"]*)"[^>]*>/g)) {
    refs.push(m[1]);
  }
  return refs;
}

function extractCssRefs(css) {
  const refs = [];
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) refs.push(m[1]);
  return refs;
}

/** Normalize a raw ref to a site-absolute path, or null if external/ignorable. */
function toInternalPath(ref, fromDirPosix) {
  if (!ref) return null;
  let r = ref.trim();
  if (/^(?:#|mailto:|tel:|javascript:|data:|blob:)/i.test(r)) return null;
  for (const origin of SITE_ORIGINS) if (r.startsWith(origin)) r = r.slice(origin.length) || '/';
  if (/^[a-z][a-z0-9+.-]*:/i.test(r) || r.startsWith('//')) return null; // other origins
  r = r.split('#')[0].split('?')[0];
  if (r === '') return null; // pure fragment/query
  try {
    r = decodeURI(r);
  } catch {
    /* keep raw */
  }
  if (!r.startsWith('/')) r = '/' + posix.normalize(posix.join(fromDirPosix, r));
  return posix.normalize(r);
}

function resolvesInDist(path, fileSet, redirectSources) {
  if (redirectSources.has(path)) return true;
  const p = path.replace(/^\//, '');
  if (p === '') return fileSet.has('index.html');
  if (fileSet.has(p)) return true;
  if (fileSet.has(p + '.html')) return true;
  if (fileSet.has(posix.join(p, 'index.html'))) return true;
  if (path.endsWith('/') && fileSet.has(p.replace(/\/$/, '') + '.html')) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
const files = await walk(DIST).catch(() => null);
if (!files) {
  console.error('qa-gate: dist/ not found — run `astro build` first.');
  process.exit(1);
}
const fileSet = new Set(files);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));

let redirectSources = new Set();
try {
  redirectSources = parseRedirectSources(await readFile(resolve(ROOT, 'netlify.toml'), 'utf8'));
} catch {
  /* no netlify.toml — no redirect allowances */
}

const leakFindings = [];
const brokenRefs = [];
const externalRefs = new Set();

for (const f of htmlFiles) {
  const html = await readFile(resolve(DIST, f), 'utf8');
  for (const key of findLeakedKeys(html)) leakFindings.push({ file: f, key });
  const fromDir = posix.dirname('/' + f);
  for (const ref of extractRefs(html)) {
    if (/^https?:\/\//i.test(ref) && !SITE_ORIGINS.some((o) => ref.startsWith(o))) {
      externalRefs.add(ref.split('#')[0]);
      continue;
    }
    const path = toInternalPath(ref, fromDir);
    if (path && !resolvesInDist(path, fileSet, redirectSources)) brokenRefs.push({ file: f, ref });
  }
}

for (const f of cssFiles) {
  const css = await readFile(resolve(DIST, f), 'utf8');
  const fromDir = posix.dirname('/' + f);
  for (const ref of extractCssRefs(css)) {
    const path = toInternalPath(ref, fromDir);
    if (path && !resolvesInDist(path, fileSet, redirectSources)) brokenRefs.push({ file: f, ref });
  }
}

// 3. Sitemap URLs must exist; emitted pages missing from sitemap = warning.
const sitemapBroken = [];
const sitemapMissing = [];
const sitemapFiles = files.filter((f) => /^sitemap-\d+\.xml$/.test(f));
const sitemapPaths = new Set();
for (const f of sitemapFiles) {
  const xml = await readFile(resolve(DIST, f), 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    let loc = m[1].trim();
    for (const origin of SITE_ORIGINS) if (loc.startsWith(origin)) loc = loc.slice(origin.length) || '/';
    sitemapPaths.add(loc);
    if (!resolvesInDist(loc.split('?')[0], fileSet, redirectSources)) sitemapBroken.push({ file: f, loc: m[1] });
  }
}
for (const f of htmlFiles) {
  if (f === '404.html') continue;
  const asPath = '/' + f.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1');
  const normalized = asPath === '/index' ? '/' : asPath;
  if (!sitemapPaths.has(normalized) && !sitemapPaths.has(normalized + '/') && !sitemapPaths.has('/' + f)) {
    sitemapMissing.push(normalized);
  }
}

// 4. Analytics baked in — deploys are local-first (CI builds stopped
// 2026-07-09 to save credits), so a missing .env would silently strip GA4
// from production. If the env declares an ID, the built home page must
// contain it; if no ID is configured at all, scream.
let ga4Problem = null;
let ga4Id = process.env.PUBLIC_GA4_MEASUREMENT_ID;
if (!ga4Id) {
  try {
    const env = await readFile(resolve(ROOT, '.env'), 'utf8');
    ga4Id = env.match(/^PUBLIC_GA4_MEASUREMENT_ID=(.+)$/m)?.[1]?.trim();
  } catch {
    /* no .env */
  }
}
if (ga4Id) {
  const home = await readFile(resolve(DIST, 'index.html'), 'utf8');
  if (!home.includes(ga4Id)) ga4Problem = `PUBLIC_GA4_MEASUREMENT_ID=${ga4Id} is configured but absent from dist/index.html — rebuild so Astro bakes it in`;
} else {
  ga4Problem = 'PUBLIC_GA4_MEASUREMENT_ID not set (.env missing?) — this dist has NO analytics; deploying it would strip GA4 from production';
}

// 5. i18n locale drift (en → locales).
const i18nOk = await runI18nDriftCheck();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`\nqa-gate — ${htmlFiles.length} pages, ${cssFiles.length} stylesheets, ${externalRefs.size} distinct external URLs (not fetched; run qa:links for that)`);

let failed = !i18nOk;

if (leakFindings.length) {
  failed = true;
  console.error(`\n✗ LEAKED I18N KEYS (${leakFindings.length}):`);
  const byKey = {};
  for (const { file, key } of leakFindings) (byKey[key] ??= []).push(file);
  for (const [key, where] of Object.entries(byKey)) {
    console.error(`    ${key}  — ${where.length} page(s), e.g. ${where.slice(0, 3).join(', ')}`);
  }
} else {
  console.log('  ✓ no raw i18n keys in rendered copy');
}

if (brokenRefs.length) {
  failed = true;
  console.error(`\n✗ BROKEN INTERNAL LINKS/ASSETS (${brokenRefs.length}):`);
  for (const { file, ref } of brokenRefs.slice(0, 40)) console.error(`    ${file} → ${ref}`);
  if (brokenRefs.length > 40) console.error(`    … and ${brokenRefs.length - 40} more`);
} else {
  console.log('  ✓ every internal link and asset resolves (case-sensitive)');
}

if (sitemapBroken.length) {
  failed = true;
  console.error(`\n✗ SITEMAP ENTRIES WITH NO PAGE (${sitemapBroken.length}):`);
  for (const { loc } of sitemapBroken.slice(0, 20)) console.error(`    ${loc}`);
} else {
  console.log(`  ✓ all ${sitemapPaths.size} sitemap URLs resolve`);
}

if (ga4Problem) {
  failed = true;
  console.error(`\n✗ ANALYTICS: ${ga4Problem}`);
} else {
  console.log(`  ✓ GA4 measurement id baked into the build`);
}

if (sitemapMissing.length) {
  const nonLocale = sitemapMissing.filter((p) => !/^\/(?:de|fr|es|it|pt-br|nl|ja|zh-cn|ko|sv|da|pl|nb|fi)(?:\/|$)/.test(p));
  if (nonLocale.length) {
    console.log(`  ⚠ ${nonLocale.length} non-locale page(s) missing from sitemap:`);
    for (const p of nonLocale.slice(0, 10)) console.log(`      ${p}`);
    console.log(`    (+ ${sitemapMissing.length - nonLocale.length} noindex machine-locale pages, expected)`);
  } else {
    console.log(`  ⚠ ${sitemapMissing.length} page(s) not in sitemap — all noindex machine locales, expected`);
  }
}

if (failed) {
  console.error('\nqa-gate: FAIL — fix the defects above before deploying.');
  process.exit(1);
}
console.log('\nqa-gate: PASS');
