#!/usr/bin/env node
/**
 * render-l10n-frames.mjs — render the localized frames built by
 * scripts/build-localized-frames.mjs.
 *
 *   frames/build/<locale>/<frame>.html
 *     → renders/l10n/<locale>/<frame>.png        (exact 1600×900, upload-ready)
 *     → renders/l10n/2x/<locale>/<frame>@2x.png  (master, website reuse)
 *
 * Same recipe as render-app-store-frames.mjs: Playwright Chromium at
 * deviceScaleFactor 2, then sips-downscale to exact spec. The English-only
 * ".since" variant is not produced for locales (owner toggle is EN-only).
 *
 * Usage: node scripts/render-l10n-frames.mjs [locale ...]   (default: all built)
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BUILD = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store/frames/build';
const OUT = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store/renders/l10n';

const wanted = process.argv.slice(2);
const locales = (wanted.length ? wanted : fs.readdirSync(BUILD).filter((d) => fs.statSync(path.join(BUILD, d)).isDirectory())).sort();

const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });

for (const locale of locales) {
  const dir = path.join(BUILD, locale);
  const finalDir = path.join(OUT, locale);
  const bigDir = path.join(OUT, '2x', locale);
  fs.mkdirSync(finalDir, { recursive: true });
  fs.mkdirSync(bigDir, { recursive: true });

  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort()) {
    const name = f.replace('.html', '');
    await page.goto('file://' + path.join(dir, f));
    await page.waitForTimeout(350); // fonts
    const big = path.join(bigDir, `${name}@2x.png`);
    const final = path.join(finalDir, `${name}.png`);
    await page.screenshot({ path: big });
    execSync(`sips -z 900 1600 "${big}" --out "${final}" >/dev/null 2>&1`);
    console.log('rendered', `${locale}/${name}`);
  }
}

await browser.close();
