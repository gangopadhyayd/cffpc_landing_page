# App Store asset plan — screenshots + icon (execution round 1)

Turning `app-store-optimization.md` §2–3 + proposal v3's image table into finished
assets. Evidence base: 195 vision-scored winner frames + Casper teardown
(analysis repo), live-listing audit 2026-05-28, real value-analytics dashboard
(operator preview, magnoliamom store, pulled 2026-07-07).

## What the evidence says (design contract)

- **85% of winner frames show real UI**; illustration-only frames are garnish.
- **69% of winner captions are outcome-led**; headlines 3–7 words, sentence case.
- Winner median = **6 desktop frames** (we have 3); 44% ship a mobile set (we have 0).
- Casper's lead frame = counter cards ("1428 carts saved / 30 days"). We beat it
  with **real dashboard UI**: $452,098 revenue / 8,041 transfers / 1,968 orders
  in 30 days (one live store).
- Recurring winner layout: **split canvas** — headline panel ~38%, real UI in a
  floating rounded card bleeding off the opposite edge; one owned accent color;
  small category pill above the headline; logo small in a corner.
- Frame-role sequence: outcome+proof → mechanism → differentiator/education →
  setup → trust.

## Brand system (locked, from the site)

Paper `#F7F4EE` · card `#FFFFFF` · ink `#1C1815` / soft `#5C544B` / faint `#8A8077`
· accent burnt-marigold `#D8541E` (ONE accent) · evergreen `#1E5B45` for
"synced/kept" states · navy `#14233A` only as a deep flat band. Fraunces
(display) / Hanken Grotesk (text) / IBM Plex Mono (numbers, SKUs, prices).
Hairline borders, two-tier soft shadows, **no gradients/glows/blobs**, flat color
fields only. Devices drawn as ink-outline mockups (matches the site's Logo mark).

## The set (desktop 1600×900)

> **Compliance pivot (2026 rules, verified 2026-07-07).** Shopify App Store
> requirements now ban IN IMAGES: any statistics or data "verifiable and
> unverifiable" (4.3.4), reviews/testimonials/ratings (4.3.6), pricing (4.2.2),
> Shopify trademarks incl. the BFS badge (4.4.3), browser chrome/desktop
> backgrounds/logo-only frames (4.4.4, enforced 2026-03-26), duplicate frames
> (4.4.5). Superlatives ("the first/best/only" — incl. "the original") are
> called out under 4.3.3. **The one compliant vehicle for strong real numbers
> is a faithful screenshot of the app's actual analytics UI** — the numbers are
> the feature, not a marketing overlay (how every analytics app lists). The
> planned trust frame (BFS badge + 4.9★ + store counts + $60M) is not
> compliant in images → replaced with a B2B/large-carts feature frame; trust
> proof stays in listing copy fields where allowed ("since 2016") and on the
> website (badge, $60M+, ratings).

> **Superseded by the round-6 hero (2026-07-07).** The table below is the
> round-1 plan kept for history. Current shipping set, order and alt text:
> `design-assets/app-store/README.md` (feature image = `hero-feature.html`,
> split-monitor leak/fix story; frame 3 retired into it).

| # | Slot | Working title | Job | Key elements |
|---|------|---------------|-----|--------------|
| 1 | Feature image | **The win** | outcome + real product proof | Pill `Cross-device cart sync · since 2016`; headline "Recover carts automatically, on every device"; phone+laptop with the SAME "Your cart" (Trail Runners $128 / Rain Shell Jacket $96 / Merino Socks $24 → $248.00); phone `Saved automatically`, laptop `Synced just now`; marigold packet path phone→laptop |
| 2 | SS1 | **The receipts** | quantified value, Casper-beater | Faithful recreation of the real dashboard UI (magnoliamom, 2026-07-07): 🎉 "You've generated $452,098 from cart transfers in the last 30 days" banner + Cart Transfer Value (Beta) + 7d/30d toggle + 3 stat cards (8,041 / 1,968 / $452,098) + "Last updated just now." All numbers INSIDE product UI; no chart invented (real UI has none) |
| 3 | SS2 | **The leak** (only negative frame) | problem education, shown-then-resolved | Two laptops: `Default store` → "Your cart is empty / The phone cart stayed behind" (dashed, muted) vs `With Persistent Cart` → full cart `Synced just now`; mono origin chips "Cart built on her phone — $248.00" |
| 4 | SS3 | **Silent by design** | mechanism contrast | "No emails. No pop-ups. No opt-ins." ✕/✓ contrast lines; laptop split-screen: sign-in form → cart `Restored at sign-in` |
| 5 | SS4 | **Setup** | kill the text-wall objection | 3 step cards: Install (1 click) → APP EMBEDS toggle mockup (theme editor) → "Running in the background"; honest scope (one click + one switch) |
| 6 | SS5 | **Large carts / B2B** | differentiator (Casper's wedge, matched) | Laptop with 8-line wholesale cart (402 units, $11,238.00 subtotal) + `Synced just now`; copy from approved draft features ("no cart-storage time limit") |

Mobile set (portrait) = frames 1, 2, 3 recomposed after desktop sign-off.
**Note:** mobile screenshots also use 1600×900 landscape since Nov 2022 — a
"mobile set" = landscape frames showing the mobile experience.

## Icon (1200×1200)

Evolve the site brand mark (Logo.astro): ink laptop behind, ink phone in front,
**one marigold cart spanning the seam** with paper halo — single subject, flat,
reads at 40px. Paper background, generous margins, no text.

## Stats policy (the line we walk)

- **In-UI numbers = product truth**: real dashboard numbers appear only *inside
  the recreated app UI* (the analytics feature is a real, shipping feature).
  No numbers as overlays, chips, or captions anywhere — that's a 4.3.4 stat.
- Store is never named. **Owner approved (2026-07-07): real unattributed
  numbers are fine.** Fallback if App Review flags them: swap in modest
  representative numbers — the frame design doesn't change.
- **"since 2016" approved (2026-07-07), kept removable** via the `.since` span
  in the feature image (`hero-feature.html`, since round 6) — the render
  script always emits a no-2016 variant alongside (`renders/variants/`).
- $60M+/ratings/store counts/BFS badge: **website + external marketing only**,
  never in listing images.
- Residual review risk (accepted, monitor on submission): flat ink-outline
  device frames (not photoreal/environmental — ubiquitous post-March-2026, but
  4.4.4 is enforced at reviewer discretion) and the big dollar figure inside
  the recreated dashboard UI.

## Pipeline

HTML/CSS templates at exact 1600×900 (`design-assets/app-store/frames/*.html`),
self-hosted woff2 from node_modules, rendered via Playwright (chromium,
`deviceScaleFactor: 2`, downscaled to exact spec size) →
`design-assets/app-store/renders/`. Re-render: see
`design-assets/app-store/README.md` (includes per-frame alt text). Final files
staged into the analysis repo's `2_working_next/screenshots/` when approved.
