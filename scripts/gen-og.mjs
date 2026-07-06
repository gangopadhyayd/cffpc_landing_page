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
const FAINT = '#8A8077';
const ACCENT = '#D8541E';
const EVERGREEN = '#1E5B45';
const CARD = '#FFFFFF';
const HAIR = 'rgba(28,24,21,0.82)';

/** Brand mark (phone front + laptop back sharing one marigold cart), scaled. */
function mark(x, y, s) {
  return `
  <g transform="translate(${x},${y}) scale(${s})">
    <rect x="10.5" y="6.5" width="17" height="12" rx="1.8" stroke="${INK}" stroke-width="2" fill="none"/>
    <rect x="8" y="20.2" width="22" height="2.6" rx="1.3" fill="${INK}"/>
    <rect x="2.6" y="9.5" width="9.6" height="16.5" rx="2.6" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
    <line x1="6" y1="23.2" x2="8.8" y2="23.2" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M11 12.2h9.8l-1.15 5.2a1.3 1.3 0 0 1-1.27 1.02h-4.9a1.3 1.3 0 0 1-1.27-1.02L10.2 10h-1.7"
      stroke="${PAPER}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 12.2h9.8l-1.15 5.2a1.3 1.3 0 0 1-1.27 1.02h-4.9a1.3 1.3 0 0 1-1.27-1.02L10.2 10h-1.7"
      stroke="${ACCENT}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="13.1" cy="21.4" r="1.35" fill="${ACCENT}"/>
    <circle cx="18.2" cy="21.4" r="1.35" fill="${ACCENT}"/>
  </g>`;
}

/** Compact cart rows (swatch + line + price bar). */
function rows(x, y, w, n) {
  const colors = [ACCENT, '#14233A', EVERGREEN];
  let s = '';
  for (let i = 0; i < n; i++) {
    s += `
      <rect x="${x}" y="${y + i * 30}" width="20" height="20" rx="5" fill="${colors[i % 3]}"/>
      <rect x="${x + 28}" y="${y + 5 + i * 30}" width="${w - 92}" height="8" rx="4" fill="rgba(28,24,21,0.16)"/>
      <rect x="${x + w - 52}" y="${y + 5 + i * 30}" width="38" height="8" rx="4" fill="rgba(28,24,21,0.28)"/>`;
  }
  return s;
}

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${ACCENT}"/>

  <!-- brand -->
  ${mark(80, 62, 1.6)}
  <text x="142" y="97" font-family="Georgia, serif" font-size="30" font-weight="600" fill="${INK}">Persistent Cart</text>

  <!-- headline: the leak, then the turn -->
  <text x="80" y="240" font-family="Georgia, serif" font-size="60" font-weight="500" fill="${INK}">Shoppers switch</text>
  <text x="80" y="308" font-family="Georgia, serif" font-size="60" font-weight="500" fill="${INK}">devices constantly.</text>
  <text x="80" y="388" font-family="Georgia, serif" font-size="44" font-weight="500" fill="#7A2C0E">On a default Shopify store,</text>
  <text x="80" y="440" font-family="Georgia, serif" font-size="44" font-weight="500" fill="#7A2C0E">their cart doesn't follow.</text>

  <!-- trust line -->
  <text x="80" y="588" font-family="sans-serif" font-size="22" fill="${INK2}">Cross-device cart sync for Shopify  ·  Built for Shopify  ·  4.9★  ·  since 2016</text>

  <!-- THE FORK (right): phone → lost (x) / kept (synced) -->
  <!-- phone -->
  <g>
    <rect x="815" y="70" width="170" height="200" rx="18" fill="${CARD}" stroke="${HAIR}" stroke-width="3"/>
    <rect x="880" y="82" width="40" height="6" rx="3" fill="${HAIR}"/>
    <text x="835" y="122" font-family="Georgia, serif" font-size="19" fill="${INK}">Your cart</text>
    ${rows(835, 140, 130, 3)}
    <rect x="878" y="252" width="44" height="4" rx="2" fill="rgba(28,24,21,0.3)"/>
    <text x="900" y="292" text-anchor="middle" font-family="monospace" font-size="12" letter-spacing="2" fill="${FAINT}">PHONE</text>
  </g>

  <!-- paths -->
  <path d="M900 300 C 900 345, 795 330, 795 358" stroke="rgba(28,24,21,0.45)" stroke-width="3" stroke-dasharray="6 8" fill="none" stroke-linecap="round"/>
  <line x1="786" y1="368" x2="804" y2="386" stroke="rgba(28,24,21,0.55)" stroke-width="4" stroke-linecap="round"/>
  <line x1="804" y1="368" x2="786" y2="386" stroke="rgba(28,24,21,0.55)" stroke-width="4" stroke-linecap="round"/>
  <path d="M900 300 C 900 345, 1010 330, 1010 372" stroke="${ACCENT}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M1001 362 L1010 375 L1019 362" stroke="${ACCENT}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- lost laptop -->
  <g>
    <rect x="700" y="400" width="190" height="120" rx="10" fill="${CARD}" stroke="${HAIR}" stroke-width="3"/>
    <rect x="686" y="522" width="218" height="9" rx="4" fill="${HAIR}"/>
    <path d="M775 440 h36 l-5 20 h-24 l-7 -28 h-8" stroke="${FAINT}" stroke-width="2.4" stroke-dasharray="4 4" fill="none" stroke-linecap="round"/>
    <text x="795" y="492" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="600" fill="${INK2}">Your cart is empty</text>
    <text x="795" y="562" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="2" fill="${FAINT}">DEFAULT SHOPIFY</text>
  </g>

  <!-- kept laptop -->
  <g>
    <rect x="930" y="392" width="190" height="128" rx="10" fill="${CARD}" stroke="${HAIR}" stroke-width="3"/>
    <rect x="916" y="522" width="218" height="9" rx="4" fill="${HAIR}"/>
    <text x="948" y="424" font-family="Georgia, serif" font-size="17" fill="${INK}">Your cart</text>
    <g transform="translate(1042, 408)">
      <rect width="64" height="20" rx="10" fill="#E3EFE9"/>
      <path d="M10 10l3.5 3.5 6-6.5" stroke="${EVERGREEN}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="24" y="14.5" font-family="sans-serif" font-size="11" font-weight="700" fill="${EVERGREEN}">Synced</text>
    </g>
    ${rows(948, 438, 156, 2)}
    <text x="1025" y="562" text-anchor="middle" font-family="monospace" font-size="11" letter-spacing="2" fill="${FAINT}">WITH PERSISTENT CART</text>
  </g>
</svg>`;

await mkdir(resolve(__dirname, '../public/og'), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
