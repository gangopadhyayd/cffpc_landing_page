// Generates public/og/default.png (1200x630) from an inline SVG using sharp.
// Run once: `node scripts/gen-og.mjs`. Re-run if the brand/copy changes.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/og/default.png');

const PAPER = '#F7F4EE';
const INK = '#1C1815';
const INK2 = '#5C544B';
const ACCENT = '#D8541E';
const NAVY = '#14233A';
const EVERGREEN = '#1E5B45';
const CARD = '#FFFFFF';

function deviceCard(x, y, w, h, label) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${CARD}" stroke="rgba(28,24,21,0.12)"/>
      <rect x="${x}" y="${y}" width="${w}" height="34" rx="16" fill="#FCFBF8"/>
      <circle cx="${x + 18}" cy="${y + 17}" r="3.5" fill="rgba(28,24,21,0.25)"/>
      <circle cx="${x + 30}" cy="${y + 17}" r="3.5" fill="rgba(28,24,21,0.25)"/>
      <text x="${x + w - 16}" y="${y + 21}" text-anchor="end" font-family="monospace" font-size="11" letter-spacing="1.5" fill="#8A8077">${label}</text>
      <text x="${x + 18}" y="${y + 64}" font-family="Georgia, serif" font-size="20" fill="${INK}">Your cart</text>
      ${
        w >= 220
          ? `<g transform="translate(${x + w - 110}, ${y + 50})">
        <rect width="96" height="22" rx="11" fill="#E3EFE9"/>
        <text x="14" y="15" font-family="sans-serif" font-size="12" font-weight="700" fill="${EVERGREEN}">Synced</text>
        <path d="M78 11l4 4 6-7" stroke="${EVERGREEN}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`
          : `<g transform="translate(${x + w - 36}, ${y + 50})">
        <circle cx="11" cy="11" r="11" fill="#E3EFE9"/>
        <path d="M6 11l3 3 6-6" stroke="${EVERGREEN}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`
      }
      ${[ACCENT, NAVY, EVERGREEN]
        .map(
          (c, i) => `
        <rect x="${x + 18}" y="${y + 86 + i * 40}" width="28" height="28" rx="6" fill="${c}"/>
        <rect x="${x + 56}" y="${y + 92 + i * 40}" width="${w - 130}" height="9" rx="4" fill="rgba(28,24,21,0.16)"/>
        <rect x="${x + w - 60}" y="${y + 92 + i * 40}" width="42" height="9" rx="4" fill="rgba(28,24,21,0.28)"/>`
        )
        .join('')}
    </g>`;
}

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${ACCENT}"/>

  <!-- brand mark -->
  <g transform="translate(80, 70)">
    <path d="M50 19a22 22 0 1 0 4.4 16.4" stroke="${ACCENT}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M51 9v10h-10" stroke="${ACCENT}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 22h23l-2.6 13a3 3 0 0 1-3 2.4h-12a3 3 0 0 1-3-2.4L16 16h-4" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="78" y="34" font-family="Georgia, serif" font-size="30" font-weight="600" fill="${INK}">Persistent Cart</text>
  </g>

  <!-- headline -->
  <text x="80" y="250" font-family="Georgia, serif" font-size="58" font-weight="500" fill="${INK}">Big retailers keep a</text>
  <text x="80" y="316" font-family="Georgia, serif" font-size="58" font-weight="500" fill="${INK}">signed-in cart on</text>
  <text x="80" y="382" font-family="Georgia, serif" font-size="58" font-weight="500" fill="${INK}">every device.</text>
  <text x="80" y="452" font-family="Georgia, serif" font-size="46" font-weight="500" fill="${ACCENT}">Shopify doesn't — by default.</text>

  <!-- trust line -->
  <text x="80" y="545" font-family="sans-serif" font-size="22" fill="${INK2}">Cross-device cart sync for Shopify  ·  Built for Shopify  ·  4.8★  ·  since 2016</text>

  <!-- device cards -->
  ${deviceCard(770, 110, 150, 250, 'PHONE')}
  ${deviceCard(770, 380, 340, 150, 'LAPTOP')}
  <path d="M935 235 h70" stroke="${ACCENT}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
</svg>`;

await mkdir(resolve(__dirname, '../public/og'), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
