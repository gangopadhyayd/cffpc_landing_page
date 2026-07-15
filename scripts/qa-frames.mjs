#!/usr/bin/env node
/**
 * qa-frames.mjs — automated QA gate for the App Store listing frames.
 * Run AFTER build-localized-frames.mjs, BEFORE (re)rendering / uploading:
 *
 *   node scripts/build-localized-frames.mjs
 *   node scripts/qa-frames.mjs [locale ...]      # default: en + all built
 *   node scripts/qa-frames.mjs --file <x.html>   # ad-hoc geometry run on one file
 *
 * Exists because the 2026-07-13 hero shipped with (a) the dashed fork line
 * striking through "WITHOUT PERSISTENT CART" and (b) an arbitrarily gendered
 * shopper ("SAVED TO HER ACCOUNT") — both across 11 languages. Eyeballing 44
 * renders misses things; these checks don't. First run also caught frame6's
 * laptop base painting 20px past the canvas edge in every shipped locale.
 *
 * Static checks (no browser):
 *   1. gendered-shopper lint — the shopper is never gendered in listing copy.
 *      EN: any third-person gendered pronoun is an error. Locales: explicitly
 *      feminine-marked forms (Kundin / clienta / dela / 她 / 彼女 / 그녀 …)
 *      are errors; the language's unmarked generic ("der Kunde", "le client",
 *      "el cliente", subject-drop, suffixed definites) is the expected form.
 *      Escape hatch: "_lint.allow": ["substring", …] in the locale JSON for
 *      grammatically forced cases — use sparingly.
 *   2. alt-text length ≤64 (also enforced by the build; kept here so QA is
 *      self-contained).
 *
 * Geometry checks (headless Chromium, EN frames + every built locale frame):
 *   3. line-through-text — sample points along every stroked SVG path; any
 *      sample inside a text glyph box (+6px clearance) whose element has no
 *      opaque background between itself and the line is an error. Labels that
 *      ride the fork lines carry a paper halo (bg + padding) — the line
 *      breaking behind the halo is the intended design and passes; naked text
 *      on the line fails. (Assumes bg-bearing elements paint above the SVGs,
 *      true for these frames: paths are z-index 1, labels/cards 2-3.)
 *   4. label-over-artwork / label-over-label — stage labels (.line-label /
 *      .acct-caption / .moment) must not overlap devices, panels or each
 *      other (a halo would mask a bezel sliver; naked text would collide).
 *   5. clipped-text — text glyphs cut by an overflow-clipping ancestor or by
 *      the canvas edge (translation too long for its fixed box). Decorative
 *      box bleed is fine; cut glyphs are not.
 *   6. art-off-canvas — painted boxes (background/border) or SVG strokes
 *      crossing the canvas edge. Opt out per element with
 *      data-qa-allow="bleed" if a bleed is ever intentional.
 *   7. headline ≤3 lines (craft-playbook squint rule).
 *   8. mono small labels never marigold (small mono fails contrast on accent).
 *
 * Also writes renders/contact-sheet.html (every render, grouped per frame,
 * EN + locales side by side) for the final human squint pass.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/debgangopadhyay/dev/cffpc_landing_page/design-assets/app-store';
const FRAMES = path.join(ROOT, 'frames');
const I18N = path.join(FRAMES, 'i18n');
const BUILD = path.join(FRAMES, 'build');
const RENDERS = path.join(ROOT, 'renders');

const adhocFiles = [];
const wanted = [];
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file') adhocFiles.push(path.resolve(argv[++i]));
    else wanted.push(argv[i]);
  }
}

const findings = [];
const flag = (where, kind, detail) => findings.push({ where, kind, detail });

/* ---------------- 1+2: static copy lint ---------------- */

// EN: any third-person gendered pronoun in listing copy is arbitrary — reword.
const EN_PRONOUNS = /\b(she|her|hers|herself|he|him|his|himself)\b/i;
// Locales: explicitly feminine-marked shopper forms. Generic unmarked forms
// (der Kunde, le client, el cliente, o cliente, kunden, subject-drop) pass.
const LOCALE_FEMININE = {
  de: /\bKundin\b/,
  fr: /\b[Ee]lles?\b|\bcliente\b/,
  es: /\b[Ee]llas?\b|\bclienta\b/,
  nl: /\bhaar\b|\bZe\b/,
  sv: /\b[Hh]on\b|\bhennes\b/,
  da: /\b[Hh]un\b|\bhendes\b/,
  'pt-BR': /\b[Ee]la\b|\bdela\b|\bdele\b|\ba cliente\b/,
  'zh-CN': /她/,
  ja: /彼女/,
  ko: /그녀/,
};

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const textValues = (dict) =>
  Object.entries(dict).filter(([k, v]) => !k.startsWith('_') && typeof v === 'string');

function lintDict(name, dict, re, allow = []) {
  for (const [k, v] of textValues(dict)) {
    const m = v.match(re);
    if (m && !allow.some((a) => v.includes(a)))
      flag(name, 'gendered-copy', `${k}: "${m[0]}" in ${JSON.stringify(v)}`);
  }
}

if (!adhocFiles.length) {
  const en = readJson(path.join(I18N, 'en.json'));
  lintDict('en.json', en, EN_PRONOUNS);

  // EN frames: lint the visible text too (frames are canonical, not en.json)
  for (const f of fs.readdirSync(FRAMES).filter((f) => f.endsWith('.html'))) {
    const visible = fs
      .readFileSync(path.join(FRAMES, f), 'utf8')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(style|script)[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    const m = visible.match(EN_PRONOUNS);
    if (m) flag(`frames/${f}`, 'gendered-copy', `"${m[0]}" in visible text`);
  }

  const altsFile = path.join(I18N, 'alts.json');
  const alts = fs.existsSync(altsFile) ? readJson(altsFile) : {};
  for (const [loc, arr] of Object.entries(alts)) {
    if (loc.startsWith('_')) continue;
    const re = loc === 'en' ? EN_PRONOUNS : LOCALE_FEMININE[loc];
    for (const a of arr) {
      if ([...a].length > 64) flag(`alts.${loc}`, 'alt-too-long', `${[...a].length} chars: "${a}"`);
      const m = re && a.match(re);
      if (m) flag(`alts.${loc}`, 'gendered-copy', `"${m[0]}" in "${a}"`);
    }
  }

  for (const [loc, re] of Object.entries(LOCALE_FEMININE)) {
    const file = path.join(I18N, `${loc}.json`);
    if (!fs.existsSync(file)) continue;
    const dict = readJson(file);
    lintDict(`${loc}.json`, dict, re, dict['_lint.allow'] ?? []);
  }
}

/* ---------------- 3-8: geometry checks ---------------- */

const builtLocales = fs.existsSync(BUILD)
  ? fs.readdirSync(BUILD).filter((d) => fs.statSync(path.join(BUILD, d)).isDirectory())
  : [];
const locales = (wanted.length ? wanted.filter((l) => l !== 'en') : builtLocales).sort();

const pages = [];
if (adhocFiles.length) {
  for (const f of adhocFiles) pages.push({ where: `file:${path.basename(f)}`, file: f, icon: false });
} else {
  if (!wanted.length || wanted.includes('en'))
    for (const f of fs.readdirSync(FRAMES).filter((f) => f.endsWith('.html')))
      pages.push({ where: `en/${f.replace('.html', '')}`, file: path.join(FRAMES, f), icon: f.startsWith('icon') });
  for (const loc of locales)
    for (const f of fs.readdirSync(path.join(BUILD, loc)).filter((f) => f.endsWith('.html')))
      pages.push({ where: `${loc}/${f.replace('.html', '')}`, file: path.join(BUILD, loc, f), icon: false });
}

const CHECKS = `(() => {
  const out = [];
  const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight;
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const alpha = (el) => {
    const m = getComputedStyle(el).backgroundColor.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return 0;
    const p = m[1].split(',').map(parseFloat);
    return p.length === 4 ? p[3] : 1;
  };
  const snip = (el) => (el.textContent || el.className || el.tagName).trim().replace(/\\s+/g, ' ').slice(0, 48);
  const tag = (el) => '<' + el.tagName.toLowerCase() + (el.className ? ' class="' + el.className + '"' : '') + '>';

  // sampled points along every stroked svg geometry
  const pts = [];
  for (const g of document.querySelectorAll('path, line, polyline')) {
    if (getComputedStyle(g).stroke === 'none' || !g.getTotalLength) continue;
    let len; try { len = g.getTotalLength(); } catch { continue; }
    const ctm = g.getScreenCTM();
    if (!len || !ctm) continue;
    const n = Math.max(24, Math.min(400, Math.round(len / 5)));
    for (let i = 0; i <= n; i++) {
      const p = g.getPointAtLength((len * i) / n);
      const d = new DOMPoint(p.x, p.y).matrixTransform(ctm);
      pts.push({ x: d.x, y: d.y, svg: g.ownerSVGElement, g });
    }
  }

  // visible text glyph boxes
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || !vis(el)) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (rects.length) texts.push({ el, rects, s: node.textContent.trim().replace(/\\s+/g, ' ').slice(0, 48) });
  }

  // is there an opaque background between this text and lines below it?
  // (bg on a shared ancestor of text AND svg paints UNDER the svg — no mask)
  const masked = (el, svg) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (svg && e.contains(svg)) return false;
      if (alpha(e) > 0.5) return true;
    }
    return false;
  };

  // 3. line-through-text (6px clearance)
  const CLEAR = 6;
  const seen = new Set();
  for (const t of texts) {
    for (const p of pts) {
      if (p.svg.contains(t.el) || t.el.contains(p.svg)) continue;
      const hit = t.rects.some((r) =>
        p.x > r.left - CLEAR && p.x < r.right + CLEAR && p.y > r.top - CLEAR && p.y < r.bottom + CLEAR);
      if (!hit) continue;
      if (masked(t.el, p.svg)) continue;
      const key = t.s + '|' + (p.g.getAttribute('d') || p.g.tagName).slice(0, 24);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ kind: 'line-through-text', detail: 'path crosses "' + t.s + '" at ' + Math.round(p.x) + ',' + Math.round(p.y) });
    }
  }

  // 4. stage labels never overlap artwork or each other
  const labels = [...document.querySelectorAll('.line-label, .acct-caption, .moment')];
  const art = [...document.querySelectorAll('.monitor, .phone, .panel, .acct-node, .link')];
  for (const l of labels) {
    const lr = l.getBoundingClientRect();
    for (const a of art) {
      if (a.contains(l) || l.contains(a)) continue;
      const ar = a.getBoundingClientRect();
      const ox = Math.min(lr.right, ar.right) - Math.max(lr.left, ar.left);
      const oy = Math.min(lr.bottom, ar.bottom) - Math.max(lr.top, ar.top);
      if (ox > 1 && oy > 1)
        out.push({ kind: 'label-over-artwork', detail: '"' + snip(l) + '" overlaps ' + tag(a) + ' by ' + Math.round(ox) + 'x' + Math.round(oy) + 'px' });
    }
    for (const l2 of labels) {
      if (l2 === l || l2.compareDocumentPosition(l) & Node.DOCUMENT_POSITION_FOLLOWING) continue;
      const r2 = l2.getBoundingClientRect();
      const ox = Math.min(lr.right, r2.right) - Math.max(lr.left, r2.left);
      const oy = Math.min(lr.bottom, r2.bottom) - Math.max(lr.top, r2.top);
      if (ox > 1 && oy > 1) out.push({ kind: 'label-over-label', detail: '"' + snip(l) + '" overlaps "' + snip(l2) + '"' });
    }
  }

  // 5. clipped-text — glyph INK cut by a clipping ancestor or the canvas
  //    edge. Uses canvas font metrics because line boxes carry leading: a
  //    line box may poke a few px past a clip while every glyph stays
  //    visible (frame6 subtotal, 4.5px of pure leading). Vertical ink bounds
  //    come from actualBoundingBoxAscent/Descent; horizontal keeps the rect.
  const mctx = document.createElement('canvas').getContext('2d');
  const inkSpan = (el, r, s) => {
    try {
      const cs = getComputedStyle(el);
      mctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      const m = mctx.measureText(s);
      const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
      if (!(fa >= 0 && fd >= 0)) throw 0;
      const baseline = r.top + (r.height - (fa + fd)) / 2 + fa;
      return { top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent };
    } catch {
      return { top: r.top + 2, bottom: r.bottom - 2 }; // fallback: modest leading allowance
    }
  };
  for (const t of texts) {
    const raw = t.el.textContent.trim();
    let cutBy = null;
    for (const r of t.rects) {
      const ink = inkSpan(t.el, r, raw);
      if (r.left < -0.75 || ink.top < -0.75 || r.right > W + 0.75 || ink.bottom > H + 0.75) {
        cutBy = 'the canvas edge';
        break;
      }
      for (let a = t.el; a && a !== document.body; a = a.parentElement) {
        const st = getComputedStyle(a);
        const clipX = st.overflowX !== 'visible', clipY = st.overflowY !== 'visible';
        if (!clipX && !clipY) continue;
        const ar = a.getBoundingClientRect();
        const box = { left: ar.left + a.clientLeft, top: ar.top + a.clientTop };
        box.right = box.left + a.clientWidth;
        box.bottom = box.top + a.clientHeight;
        if (
          (clipX && (r.left < box.left - 1 || r.right > box.right + 1)) ||
          (clipY && (ink.top < box.top - 0.75 || ink.bottom > box.bottom + 0.75))
        ) {
          cutBy = tag(a);
          break;
        }
      }
      if (cutBy) break;
    }
    if (cutBy) out.push({ kind: 'clipped-text', detail: '"' + t.s + '" cut by ' + cutBy });
  }

  // 6. art-off-canvas — painted boxes or svg strokes crossing the canvas edge
  for (const el of document.body.querySelectorAll('*')) {
    if (!vis(el) || el.dataset.qaAllow === 'bleed') continue;
    if (el.namespaceURI && el.namespaceURI.includes('svg')) continue; // strokes checked via pts
    const st = getComputedStyle(el);
    const painted =
      alpha(el) > 0.05 ||
      ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(st['border' + s + 'Width']) > 0);
    if (!painted) continue;
    const r = el.getBoundingClientRect();
    if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1)
      out.push({ kind: 'art-off-canvas', detail: tag(el) + ' at ' + Math.round(r.left) + ',' + Math.round(r.top) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) });
  }
  for (const p of pts) {
    if (p.x < -1 || p.y < -1 || p.x > W + 1 || p.y > H + 1) {
      out.push({ kind: 'art-off-canvas', detail: 'svg stroke at ' + Math.round(p.x) + ',' + Math.round(p.y) });
      break;
    }
  }

  // 7. headline ≤3 lines
  for (const h of document.querySelectorAll('h1')) {
    const lh = parseFloat(getComputedStyle(h).lineHeight);
    const lines = Math.round(h.getBoundingClientRect().height / lh);
    if (lines > 3) out.push({ kind: 'headline-lines', detail: lines + ' lines: "' + snip(h) + '"' });
  }

  // 8. mono small labels never marigold
  for (const el of document.querySelectorAll('.line-label, .acct-caption, .moment')) {
    if (getComputedStyle(el).color === 'rgb(216, 84, 30)')
      out.push({ kind: 'accent-mono-label', detail: '"' + snip(el) + '" is marigold' });
  }

  return out;
})()`;

const exe =
  process.env.HOME +
  '/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const iconPage = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

for (const job of pages) {
  const p = job.icon ? iconPage : page;
  await p.goto('file://' + job.file);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(60);
  for (const f of await p.evaluate(CHECKS)) flag(job.where, f.kind, f.detail);
}
await browser.close();

/* ---------------- contact sheet for the human squint pass ---------------- */

if (!adhocFiles.length) {
  const frameNames = ['hero-feature', 'frame2-the-receipts', 'frame4-mechanism', 'frame6-b2b'];
  const cols = ['en', ...(locales.length ? locales : builtLocales)];
  const cell = (loc, name) => {
    const rel = loc === 'en' ? `${name}.png` : `l10n/${loc}/${name}.png`;
    const ok = fs.existsSync(path.join(RENDERS, rel));
    return `<figure class="${ok ? '' : 'missing'}"><a href="${rel}" target="_blank"><img src="${rel}" loading="lazy"></a><figcaption>${loc}${ok ? '' : ' — MISSING'}</figcaption></figure>`;
  };
  const sections = frameNames
    .map((n) => `<h2>${n}</h2><div class="grid">${cols.map((l) => cell(l, n)).join('')}</div>`)
    .join('\n');
  fs.writeFileSync(
    path.join(RENDERS, 'contact-sheet.html'),
    `<!doctype html><meta charset="utf-8"><title>Listing frames — contact sheet</title>
<style>
  body { font: 14px/1.4 system-ui; margin: 24px; background: #eee; }
  h2 { margin: 28px 0 10px; font-size: 17px; }
  .grid { display: flex; flex-wrap: wrap; gap: 12px; }
  figure { margin: 0; width: 380px; }
  img { width: 100%; display: block; border: 1px solid #ccc; background: #fff; }
  figcaption { font-family: ui-monospace, monospace; font-size: 12px; padding: 3px 1px; }
  .missing figcaption { color: #b00020; font-weight: 700; }
</style>
<p>Squint pass: no collisions, nothing clipped, headlines ≤3 lines, labels readable at this width.
Generated by scripts/qa-frames.mjs — regenerate after every render.</p>
${sections}`
  );
}

/* ---------------- report ---------------- */

if (findings.length) {
  console.error(`✗ ${findings.length} finding(s):\n`);
  for (const f of findings) console.error(`  [${f.kind}] ${f.where}: ${f.detail}`);
  process.exit(1);
}
console.log(
  `✓ QA clean — ${pages.length} frame(s) checked` +
    (adhocFiles.length ? '' : ' (static lint + geometry). Contact sheet: renders/contact-sheet.html')
);
