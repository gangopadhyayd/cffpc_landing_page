# Customer Logo Manifest

Sourced 2026-07-07 for the persistentcartapp.com "stores using Persistent Cart" strip.
Rule: every file is exactly what the brand itself serves (own site header/footer or own CDN). No third-party redraws.
All SVGs verified: well-formed XML, `xmlns` present, standalone (no external refs, no `<use>`, no embedded rasters). All logos visually verified against the brand.

Quality grades: **A** = official SVG wordmark · **B** = high-res PNG wordmark · **C** = icon-only/low-res · **F** = missing.

| Brand | File | Source URL | Format | Native size | Wordmark/Icon | Grade | Notes |
|---|---|---|---|---|---|---|---|
| Public Goods | `public-goods.svg` | https://www.publicgoods.com/cdn/shop/files/Logo_1.svg?v=1771579595 (site header) | SVG (vector) | viewBox 55×24 | Wordmark (stacked "PUBLIC GOODS") | A | Black fill. Small viewBox but pure vector — scales cleanly. |
| StewMac | `stewmac.svg` | https://www.stewmac.com/globalassets/reusable-content/stewmac-logo-lowercase-white-footer.svg (site footer) | SVG (vector, 24 paths) | viewBox 213×30 | Full lockup (bridge mark + "stewmac" + ®) | A | Fills are WHITE + red (footer variant) — recolor fills or place on dark bg. The site's *header* SVG (`/contentassets/9d37b19e.../stewmac-logo-lowercase-black.svg`) is an SVG wrapper around an embedded 600×83 PNG — avoided in favor of this true vector. |
| FASHIONPHILE | `fashionphile.png` | https://www.fashionphile.com/cdn/shop/files/content-image-fashionphile-logo.png?v=1743119499 (site header) | PNG RGBA | 535×73 | Wordmark | B | Largest size their CDN serves (params only downscale). Dark charcoal on transparent. |
| Magnolia | `magnolia.png` | https://magnolia.com/cdn/shop/files/checkout_logo_29.png?v=1749538780 (site header, alt="Magnolia") | PNG RGBA | 1269×235 | Wordmark ("MAGNOLIA" serif, letterspaced) | B | High-res. Black on transparent. |
| Swanson Vitamins | `swanson-vitamins.svg` | https://www.swansonvitamins.com/cdn/shop/files/SVG-Swanson-Vitamins-horiz-2c-blk-logo-ada_1.svg?v=1777495067 (site header, desktop) | SVG (vector) | viewBox 461×100 | Full lockup (leaf mark + "SWANSON VITAMINS") | A | 2-color: near-black `#1a1c16` + green `#8ab71c`. `<title>Swanson Vitamins Logo</title>` present. A cream variant exists for dark bg (`...-cream-logo-ada.svg`). |
| Todd Snyder | `todd-snyder.svg` | https://cdn.shopify.com/s/files/1/0186/1574/files/TS_LOGO2.svg?v=1741875261 (site header asset; toddsnyder.com itself is Cloudflare-challenged — asset URL confirmed via Wayback snapshot of the live homepage, file fetched from the brand's own Shopify CDN) | SVG (vector) | viewBox 1320×402 | Wordmark ("TODD SNYDER / NEW YORK") | A | Fill `#231f20`. |
| Ksubi | `ksubi.svg` | https://ksubi.com/cdn/shop/files/ksubi_dark_logo.svg?v=1778049252 (site header, dark variant) | SVG (vector) | viewBox 79×35 | Wordmark (handwritten "ksubi" with strikethrough) | A | Black fill. 114 KB (dense paths) — fine for build-time use; consider SVGO if inlining. Light variant exists (`ksubi_light_logo.svg`). |
| Green Mountain Diapers | `green-mountain-diapers.png` | https://www.greenmountaindiapers.com/cdn/shop/files/gmd-logo-2022estlightgreen-a-01.png?v=1674790367 (site header) | PNG RGBA | 855×209 | Full lockup (green arc + "Est. 1998" + wordmark + ®) | B | Color logo (greens); will need the strip's grayscale filter. |
| Tannico | `tannico.svg` | https://www.tannico.it/cdn/shop/files/footer-logo.svg?v=1731682000 (site footer) | SVG (vector) | viewBox 187×25.8 | Wordmark ("TANNICO") | A | Fill is gray `#979a9c` (footer variant) — fine for a grayscale strip, or recolor. Header serves a huge PNG alternative: `https://www.tannico.it/cdn/shop/files/Logo-blue.png?v=1731681867` (3722×512, blue). |
| momox fashion | `momox-fashion.svg` | https://momox-fashion.myshopify.com/cdn/shop/files/mf-logo-header-desktop.svg?v=1758528560 (site header; momoxfashion.com is Cloudflare-challenged for bots — same asset fetched via the shop's own myshopify.com alias, confirmed via Wayback snapshot of momoxfashion.com/de) | SVG (vector) | viewBox 117×40 | Wordmark ("momox FASHION" stacked) | A | Current domain confirmed: momoxfashion.com (rebranded from "ubup"). Dark fill. |
| Shoebacca | `shoebacca.png` | https://www.shoebacca.com/cdn/shop/files/sb-shopify-logo.png?v=1687294699 (site header) | PNG RGBA | 400×68 | Full lockup (box-E mark + "SHOEBACCA") | B− | Largest horizontal asset the brand serves; exactly 400 px wide (threshold). Red+black on transparent. A larger *vertical* lockup exists only as JPEG (`sb-logo-vertical.jpg`, no transparency). Weakest file of the set — fine at strip size (~150 px), revisit if a hero-size render is ever needed. |

**No brands missing.** Weakest files (flag for design review): `shoebacca.png` (400 px, B−), `fashionphile.png` (535 px, B). Everything else is vector or ≥855 px.

## Grayscale-strip prep notes

- Color originals that need the CSS `filter: grayscale(1)` (or manual recolor): `swanson-vitamins.svg` (green leaf), `green-mountain-diapers.png` (green), `shoebacca.png` (red mark), `stewmac.svg` (red mark, WHITE wordmark — must recolor fills or it disappears on light bg), `tannico.svg` (light gray — may need darkening for contrast).
- Already near-black on transparent: `public-goods.svg`, `fashionphile.png`, `magnolia.png`, `todd-snyder.svg`, `ksubi.svg`, `momox-fashion.svg`.

---

# Shopify Plus — outcome (assets in `../shopify-plus/`)

**There is NO official public "Shopify Plus" logo/wordmark lockup.** Findings:

- https://www.shopify.com/brand-assets offers only the main **Shopify** logo: primary (color, white-bg + dark-bg variants), monotone (black/white), and the Shopping Bag glyph. The downloadable zips contain **no Plus lockup** (verified full zip listing).
- https://brandfolder.shopify.com/ returns **404**.
- "Shopify Plus®" is a registered trademark (shopify.com/legal/trademarks) but has no public asset.
- A **"Shopify Plus Partner" tier badge** exists but is gated: downloadable only from the Partner Dashboard (Business Overview → Track and Tier → Resources → Download Badge) by partners holding that tier. Not publicly fetchable; do not fabricate.

Saved (official, from `https://cdn.shopify.com/static/brand-assets/shopify-brand-assets.zip`):

| File | What |
|---|---|
| `logo-color-white-bg.svg` | Primary logo (green bag + black wordmark) for light backgrounds — Shopify's preferred form |
| `logo-color-dark-bg.svg` | Primary logo, white wordmark, for dark backgrounds |
| `logo-mono-black.svg` / `logo-mono-white.svg` | Monotone variants (note: bag has a gap in monotone) |
| `glyph-black.svg` / `glyph-color.svg` | Shopping Bag brandmark alone (restricted use) |

## Shopify usage guidelines (from shopify.com/brand-assets + legal/trademarks + partner branding help)

- **License**: using the assets = acceptance of Shopify's Trademark Usage Guidelines; violations terminate the license. Broadly, "any use of Shopify's brand assets generally requires express written authorization" — truthful referential statements (e.g. "built for Shopify Plus stores") are the safe pattern; don't imply endorsement.
- **Preferred form**: full-color primary logo; the "S" on the bag is always white. Use inverted variant on dark/busy backgrounds; monotone only when full color isn't possible.
- **Minimum size**: 80 px wide (digital), 28 mm (print).
- **Clear space**: X = x-height of the wordmark around the logo; ½ bag-width around the standalone glyph.
- **Prohibited**: wordmark alone (i.e., a text-only "Shopify"/"Shopify Plus" render is against their rules), stretching/rotating/stacking, gradients/shadows, recoloring, recreating your own version, old logo, busy/low-contrast backgrounds.
- **Web use**: logo should hyperlink to shopify.com when used on webpages.
- **Partners**: partnership may be stated in marketing without permission if guidelines are followed; **paid ads** using Shopify trademarks need written permission. Tier badges (incl. Shopify Plus Partner) must not be altered or translated and must be updated within 48 h of a tier change.
- **Implication for our site**: to reference Plus, use the official Shopify logo + the words "Shopify Plus" in our own site typography, or obtain the Plus Partner badge via the Partner Dashboard if the business qualifies. Do not build a Plus lockup from the wordmark.
