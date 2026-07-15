#!/usr/bin/env node
/**
 * build-localized-frames.mjs — emit per-locale copies of the App Store frames.
 *
 * Approach (documented in design-assets/app-store/README.md → Localization):
 * the ENGLISH frames in frames/*.html stay the canonical, pixel-approved
 * templates — no tokens in them. frames/i18n/en.json holds every user-visible
 * string as an EXACT raw-HTML fragment (entities and inline markup included).
 * This script uses those values as search needles and swaps each for the same
 * key's value from frames/i18n/<locale>.json in ONE regex pass (alternation,
 * longest needle first — so "Your cart is empty" wins over "Your cart", and a
 * replacement can never be re-matched). If the English copy in a frame drifts
 * from en.json, the needle stops matching and the build FAILS LOUDLY instead
 * of silently shipping half-translated art.
 *
 * Locale JSON contract:
 *   - same keys as en.json (missing key = build error; keys starting with "_"
 *     are metadata and ignored);
 *   - values are raw-HTML fragments: use &amp; / &nbsp; / &shy; entities,
 *     keep <span class="accent">…</span> / <b>…</b> / <br> markup, real ’;
 *   - every number/price in the English value must appear unchanged in the
 *     translation ($ figures are product-data recreations — never localized);
 *   - optional "_css": { "<frame-name>"|"*": "css" } — per-locale overrides
 *     (font step-downs etc.) injected as a <style> at the end of <head>.
 *
 * Output: frames/build/<locale>/<frame>.html (stylesheet href rewritten to
 * ../../base.css; HTML comments stripped; <html lang> set; CJK locales get a
 * system-font fallback stack — macOS fonts, rendered by headless Chromium).
 *
 * Usage: node scripts/build-localized-frames.mjs [locale ...]  (default: all)
 */
import fs from 'node:fs';
import path from 'node:path';

const FRAMES = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store/frames';
const I18N = path.join(FRAMES, 'i18n');
const OUT = path.join(FRAMES, 'build');

const FRAME_FILES = [
  'hero-feature.html',
  'frame2-the-receipts.html',
  'frame4-mechanism.html',
  'frame6-b2b.html',
];

// CJK fallback stacks (system fonts; latin webfonts stay primary so digits,
// $ amounts and the lockup keep the brand faces — only CJK glyphs fall back).
const FONT_FALLBACKS = {
  'zh-CN': `:root {
  --display: 'Source Serif 4 Variable', 'Songti SC', Georgia, serif;
  --sans: 'Hanken Grotesk Variable', 'PingFang SC', 'Hiragino Sans GB', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', 'PingFang SC', ui-monospace, monospace;
}
.display { line-height: 1.24; letter-spacing: 0; }`,
  ja: `:root {
  --display: 'Source Serif 4 Variable', 'Hiragino Mincho ProN', Georgia, serif;
  --sans: 'Hanken Grotesk Variable', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', 'Hiragino Sans', ui-monospace, monospace;
}
.display { line-height: 1.24; letter-spacing: 0; }
body { line-break: strict; } /* kinsoku: no small-kana/ー at line start */`,
  ko: `:root {
  --display: 'Source Serif 4 Variable', 'Apple SD Gothic Neo', Georgia, serif;
  --sans: 'Hanken Grotesk Variable', 'Apple SD Gothic Neo', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', 'Apple SD Gothic Neo', ui-monospace, monospace;
}
.display { line-height: 1.24; letter-spacing: 0; }`,
};

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const fail = (msg) => { console.error('✗ ' + msg); process.exitCode = 1; };

const en = readJson(path.join(I18N, 'en.json'));
const keys = Object.keys(en).filter((k) => !k.startsWith('_'));

// needle uniqueness (two keys with the same English value would be ambiguous)
{
  const seen = new Map();
  for (const k of keys) {
    if (seen.has(en[k])) fail(`en.json: duplicate value for "${k}" and "${seen.get(en[k])}"`);
    seen.set(en[k], k);
  }
}

const keyByNeedle = new Map(keys.map((k) => [en[k], k]));
const needleRe = new RegExp(
  keys.map((k) => en[k]).sort((a, b) => b.length - a.length).map(esc).join('|'),
  'g'
);

// numbers/prices that must survive translation untouched
const numTokens = (s) => s.match(/\$[\d,.]+|\d[\d,.]*/g) ?? [];

const wanted = process.argv.slice(2);
const locales = (wanted.length
  ? wanted
  : fs.readdirSync(I18N).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
    .filter((l) => l !== 'en' && l !== 'alts')).sort();

// validate alt texts while we're here (≤64 chars, 4 per locale)
{
  const altsFile = path.join(I18N, 'alts.json');
  if (fs.existsSync(altsFile)) {
    const alts = readJson(altsFile);
    for (const [loc, arr] of Object.entries(alts)) {
      if (loc.startsWith('_')) continue;
      if (!Array.isArray(arr) || arr.length !== 4) fail(`alts.json ${loc}: expected 4 entries`);
      for (const a of arr) if ([...a].length > 64) fail(`alts.json ${loc}: alt >64 chars: "${a}"`);
    }
  }
}

const templates = FRAME_FILES.map((f) => {
  let html = fs.readFileSync(path.join(FRAMES, f), 'utf8');
  html = html.replace(/<!--[\s\S]*?-->\n?/g, ''); // comments: hazard class + noise
  return { name: f.replace('.html', ''), file: f, html };
});

// drift gate: every en.json needle must still exist somewhere in the frames
{
  const found = new Set();
  for (const t of templates) for (const m of t.html.matchAll(needleRe)) found.add(keyByNeedle.get(m[0]));
  const missing = keys.filter((k) => !found.has(k));
  if (missing.length) fail(`en.json values not found in any frame (English copy drifted?): ${missing.join(', ')}`);
}

for (const locale of locales) {
  const dict = readJson(path.join(I18N, `${locale}.json`));
  const missing = keys.filter((k) => dict[k] === undefined);
  if (missing.length) { fail(`${locale}.json missing keys: ${missing.join(', ')}`); continue; }

  for (const k of keys) {
    const v = dict[k];
    for (const n of numTokens(en[k])) if (!v.includes(n)) fail(`${locale}.json ${k}: number "${n}" from English value missing/changed`);
    const loneAmp = v.replace(/&(amp|nbsp|shy|lt|gt|#\d+);/g, '').includes('&');
    if (loneAmp) fail(`${locale}.json ${k}: raw "&" — use &amp;`);
  }
  if (process.exitCode) continue;

  const dir = path.join(OUT, locale);
  fs.mkdirSync(dir, { recursive: true });

  for (const t of templates) {
    let html = t.html
      .replace('<html lang="en">', `<html lang="${locale}">`)
      .replace('href="base.css"', 'href="../../base.css"')
      .replace(needleRe, (m) => dict[keyByNeedle.get(m)]);

    const extras = [];
    if (FONT_FALLBACKS[locale]) extras.push(FONT_FALLBACKS[locale]);
    const css = dict._css ?? {};
    if (css['*']) extras.push(css['*']);
    if (css[t.name]) extras.push(css[t.name]);
    if (extras.length) {
      html = html.replace('</head>', `<style data-l10n="${locale}">\n${extras.join('\n')}\n</style>\n</head>`);
    }
    fs.writeFileSync(path.join(dir, t.file), html);
  }
  console.log(`built ${locale} (${templates.length} frames)`);
}

if (process.exitCode) { console.error('BUILD FAILED'); process.exit(1); }
