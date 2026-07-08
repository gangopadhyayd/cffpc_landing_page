import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FRAMES = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store/frames';
const OUT = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store/renders';
const OUT2X = path.join(OUT, '2x');
fs.mkdirSync(OUT2X, { recursive: true });

const exe = process.env.HOME + '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe });

const jobs = fs.readdirSync(FRAMES)
  .filter(f => f.endsWith('.html'))
  .map(f => ({
    file: path.join(FRAMES, f),
    name: f.replace('.html', ''),
    w: f.startsWith('icon') ? 1200 : 1600,
    h: f.startsWith('icon') ? 1200 : 900,
  }));

async function render(job, { extraCss, outName } = {}) {
  const page = await browser.newPage({ viewport: { width: job.w, height: job.h }, deviceScaleFactor: 2 });
  await page.goto('file://' + job.file);
  if (extraCss) await page.addStyleTag({ content: extraCss });
  await page.waitForTimeout(350); // fonts
  const name = outName || job.name;
  const big = path.join(OUT2X, name.replace(/\//g, '--') + '@2x.png');
  const final = path.join(OUT, name + '.png');
  fs.mkdirSync(path.dirname(final), { recursive: true });
  await page.screenshot({ path: big });
  execSync(`sips -z ${job.h} ${job.w} "${big}" --out "${final}" >/dev/null 2>&1`);
  console.log('rendered', name);
  await page.close();
}

for (const j of jobs) await render(j);

// Owner-toggleable variant: feature image without "· since 2016" (.since span).
// To ship it, upload variants/hero-feature--no-since-2016.png instead.
const hero = jobs.find(j => j.name === 'hero-feature');
if (hero) await render(hero, { extraCss: '.since { display: none; }', outName: 'variants/hero-feature--no-since-2016' });

await browser.close();
