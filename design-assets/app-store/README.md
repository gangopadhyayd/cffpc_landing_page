# App Store listing assets — Persistent Cart

Design + render pipeline for the Shopify App Store listing images
(strategy: `docs/app-store-assets-plan.md`; craft rules + prompting kit:
`docs/asset-craft-playbook.md`; listing pipeline lives in the analysis repo
at `docs/persistent_cart_listing/`).

## Layout

- `frames/*.html` — one file per listing image, pixel-exact 1600×900 canvas
  (icon: 1200×1200). Shared tokens/components in `frames/base.css`; fonts +
  the official BFS badge (website use only — NOT for listing images) in
  `frames/assets/`.
- `frames/archive/` — superseded explorations (hero rounds 1–8, retired
  frames 1, 3, 5). Not rendered: the script only picks up `frames/*.html` at
  the root. Restore by moving a file back up one level.
- `renders/*.png` — upload-ready files at exact Shopify spec (1600×900 / icon
  1200×1200, PNG). `renders/2x/` keeps @2x masters for reuse on the website.
  `renders/variants/` holds owner-toggle variants (see below).

## Re-render

```bash
npm i -D playwright-core   # once (not yet a repo dependency)
node scripts/render-app-store-frames.mjs
```

Uses the Playwright Chromium already in `~/Library/Caches/ms-playwright`
(`chromium-1223`), renders at `deviceScaleFactor: 2`, then `sips`-downscales
to exact spec size.

## Where each asset appears (verified on live App Store DOM, 2026-07-07)

- **Search & category cards:** icon + name + subtitle + rating ONLY — no
  promotional image, no screenshots (verified: zero `promotional_image` /
  `desktop_screenshot` references in apps.shopify.com search-results HTML).
  The ICON is the only visual in discovery; og:image (social share) = icon.
- **Listing page:** ONE media carousel at the top. Slide 1 = the feature
  image (`promotional_image` in the CDN URLs — the Partner editor's "Feature
  media" field), default-visible at full size; the screenshots
  (`desktop_screenshot`) follow as subsequent slides/thumbnails. The feature
  image is the primary in-listing asset — NOT "featuring-only" (that was the
  pre-2022 app-banner era). Both use the same 1600×900 spec.
- Practical hierarchy of eyeballs: icon (discovery) → feature image (slide 1)
  → screenshot 1 → the rest.

## Feature image decision (2026-07-08, round 9)

`hero-feature.html` ("Carts leak between devices. Yours won't."), the
symmetric fork with the ACCOUNT added as the mechanism's visible middle.
Round 9 executes the owner's wording + mechanism notes on round 8
(archived as `archive/hero-round8-symmetric.html`):

1. **"It's not exactly clear what the leak is"** → headline names it
   plainly: "Carts leak between devices." (ink) + "Yours won't." (marigold
   accent) — 6 words, second-person no-brainer turn. Alternates drafted and
   rejected: "The silent cart leak — fixed at log-in." (re-brands the leak
   without locating it; mechanism crowds the headline) and "Shoppers switch
   devices. Carts follow, silently." (never states the loss, so the fix
   reads nice-to-have). "Silent" survives in the sub where it describes the
   mechanism: "Persistent Cart silently saves every signed-in cart to the
   customer's account. When they log in on another device, it's already
   there." — log-in is the hinge word (owner: "logging in could be an
   important component to explain"; don't lead with "automatic").
2. **"Show the cart saved to the customer account, transferred on log-in"**
   → an account node now sits ON the marigold path: 54px card-white circle,
   3px marigold ring, ink person glyph, mono evergreen caption "SAVED TO
   THEIR ACCOUNT" above it (was "…HER ACCOUNT" until the 2026-07-13
   de-gendering pass — see QA gate below). The WITH monitor gained a storefront account row
   ("amelia@example.com · Signed in") above the cart title, and the phone's
   pill changed "Saved automatically" → "Saved to your account" — origin,
   middle and arrival now all speak the account/log-in mechanism.
3. **Layout** → stage compressed ~70px (monitors at stage-x 635, arcs
   shortened) to widen the copy column to 500px for the longer headline
   (72px, 3 lines). Line labels shifted to keep clear runway before the
   bezels. Everything else — fork geometry, believable monitors, muted
   WITHOUT fate, condensed 2-card value panel — carried over from round 8.

Round 8 ("A silent leak. A silent fix.") context, still the structural base:

1. **"Built on her phone is weird"** → the mono caption is gone; the phone's
   own UI ("Your cart", "Saved automatically") carries the origin story.
2. **Symmetry, labels as part of the lines** → the stage is a fork: phone at
   left, vertically centered on the fork origin; two mirror-image arcs (same
   curvature, one up-right, one down-right) run from the phone's right edge
   to two identical monitors stacked in a right-aligned column (upper =
   WITHOUT, muted frame; lower = WITH, full ink). Both lines fully CONNECT —
   no more dying mid-flight; the journey happens either way, what differs is
   what arrives. Upper line: grey dashed, no arrival dot, mono ink-faint
   "WITHOUT PERSISTENT CART" riding above its flat approach. Lower line:
   marigold dotted, arrival dot tangent on the bezel, mono evergreen "WITH
   PERSISTENT CART" riding below (evergreen, not marigold — small text fails
   contrast on marigold). The separate fate labels above the bezels are gone;
   the lines carry them. Screens unchanged in content except the WITH
   screen's "Restored automatically…" footnote was dropped for room (the
   line label + "Synced just now" pill carry that meaning).
3. **Condensed value panel (owner-directed)** → the 🎉 banner duplicated the
   $452,098 card and the Orders card was redundant; both removed. Panel is
   now "Cart Transfer Value" + two cards (Cart Transfers 8,041 · Revenue
   from Cart Transfers $452,098, hints kept) + "Last updated just now."
   footer — still system-ui on #f6f6f7 so it reads as product UI; owner
   accepted it need not mirror the in-app dashboard 1:1 (frame 2 remains the
   faithful full recreation). The freed height is what lets the two monitors
   stack (319×204 bezels, believable at 360px).

Round 7 (side-by-side monitors, grey path dying mid-flight) is archived as
`archive/hero-round7-twomonitors.html`; round 6 (the one-screen split
monitor it replaced — "being in one screen is a little weird") as
`archive/hero-round6-splitscreen.html`. What round 6 established, still true:

- **Believable devices** (the round-5 killer): monitors are 16:9-ish screens
  + ink neck + foot stand, never flat slabs. Phone + monitors all read as
  real hardware at 360px.
- **Few elements**: phone, monitor pair, stats panel + headline = 4 elements,
  3 hierarchy levels (round-3 crowding stays dead; the muted WITHOUT frame
  keeps the pair reading as one before/after unit, not two competing devices).
- Round-6 alternates, archived: `heroG-phones` (label/arc collisions,
  repetitive cart UIs) and `heroH-pair` (two-monitor diptych; cleanest squint
  read but no origin device, no accent moment — round 7 is effectively heroH
  with the phone origin + marigold arc restored).

The monitor drawing style (3.5px ink bezel, solid ink neck + foot; muted
0.5-alpha frame for a de-emphasized state) is the device vocabulary to reuse
if other frames ever need a desktop.

## The set — condensed to feature + 3 (owner, round 9) + alt text (≤64 chars)

Partner-editor capacity check (2026-07-08): 3 desktop screenshots uploaded,
"Add" button still present; official max is 6 desktop (+ optional mobile /
POS slots). Owner chose a condensed set — feature image + exactly 3
screenshots — so there is headroom if a frame is ever added back.

| Order | File | Role | Alt text |
|---|------|------|----------|
| Feature | `hero-feature` | leak → account → log-in story + value proof | Cart saved to their account, restored at log-in, plus stats |
| 1 | `frame2-the-receipts` | analytics proof | Analytics dashboard of cart transfers, orders, revenue |
| 2 | `frame4-mechanism` | mechanism (log-in → restored) + one-click install | Two screens: customer logs in, their cart is already there |
| 3 | `frame6-b2b` | differentiator | Large wholesale cart synced across devices |
| — | `icon` | app icon | (no alt field; square corners, padded, no text) |

Round-9 cuts + rename (2026-07-08, owner-directed):

- **frame1-the-win cut** ("seems a little redundant" next to the hero) —
  archived as `archive/frame1-the-win.html`, PNGs deleted.
- **frame5-setup cut** — owner corrected the product fact: enabling the app
  embed is JUST ONE CLICK, so there is no 3-step story to tell. Folded into
  the mechanism frame as the "One-click install — nothing to configure."
  chip. Archived as `archive/frame5-setup.html`, PNGs deleted.
- **frame4-silent → frame4-mechanism** (renamed with the redesign): owner
  liked the "No emails. No pop-ups. No opt-ins." message but flagged the
  one-screen split (log-in and cart on the same laptop screen) as weird —
  same complaint that killed hero round 6. Now two same-size monitors in
  sequence, joined by the hero's marigold dotted hand-off + circled arrow:
  beat 1 "1 · THE CUSTOMER LOGS IN" (storefront log-in screen), beat 2
  "2 · THEIR CART IS ALREADY THERE" (restored cart, "Restored at log-in"
  pill; both beats de-gendered 2026-07-13). Moment labels are mono —
  ink-soft for 1, evergreen for the payoff 2.

Notes for the next editor:

- **frame3-the-leak is retired** (archived): the feature image absorbed the
  with/without leak story, and shipping both would tread on req. 4.4.5
  (every frame visually distinct). Its mono chip also carried "$248.00"
  outside product UI — don't resurrect it as-is.
- File numbering has gaps (no frame1/3/5) on purpose — filenames are stable
  IDs, the table above is the listing order.
- Pills are one-per-frame and unique: hero "Cross-device cart sync · since
  2016", f2 "Built-in value analytics", f4 "Runs silently in the
  background", f6 "Wholesale & B2B ready".
- frame2's dashboard is the deep-dive of the hero's panel (full-size, with
  the real 7d/30d period toggle; Beta pill removed everywhere per owner).
  Since round 8 the hero's panel is a condensed 2-card subset (no banner,
  no Orders card) — keep frame2 the faithful full recreation.
- Narrator copy says "log in / log-in" (owner's mechanism word); storefront
  UI buttons say "Log in" (Dawn convention); the hero's account row says
  "Signed in" (owner's verbatim example). Don't flatten these to one form
  inside product UI if it stops reading native.

## Compliance guardrails baked into these designs

Per App Store requirements (verified 2026-07-07; changelog "Clearer standards
for app listing images", enforced 2026-03-26):

- **No stats/data outside product UI** (4.3.3/4.3.4 ban even true numbers in
  listing copy AND images) — real dashboard numbers appear only inside the
  faithful recreation of the app's actual analytics UI (4.4.4 wants actual
  UI); the struck-through $248.00 and cart subtotals live inside storefront
  UI. Mono captions/labels never carry numbers — the ban is on stats/data;
  bare sequence ordinals ("1 ·", "2 ·", "STEP 01") are fine.
- **No ratings/reviews/testimonials** (4.3.6), **no pricing** (4.2.2 — also
  why no "free plan / 30-day trial" text in images), **no Shopify trademarks
  or BFS badge in images** (4.4.3 — Shopify auto-applies the BFS badge to the
  app card).
- **No browser chrome / desktop backgrounds / logo-only frames** (4.4.4);
  every frame is unique (4.4.5).
- Avoid "the original / first / best / only" in image copy (4.3.3) — seniority
  is expressed as the factual "since 2016".
- No `myshopify.com` URLs, no PII; demo data only ("Fieldnote Supply Co.",
  amelia@example.com).

## Owner decisions (2026-07-07)

- **Real unattributed numbers: approved.** The hero panel and frame 2 ship
  the real dashboard values (store never named) — anything unattributed is
  fine. Fallback if App Review flags them: swap modest representative
  numbers; the frame design doesn't change.
- **"since 2016": approved, kept removable.** The phrase lives in a `.since`
  span in the feature image's pill (`hero-feature.html`). Every render also
  produces `renders/variants/hero-feature--no-since-2016.png` — to drop the
  phrase, upload the variant instead. (If it's ever removed for good, delete
  the span and the variant block in `scripts/render-app-store-frames.mjs`.)
- **Beta pill: removed** from every recreation of the dashboard.

## Owner decisions (2026-07-08, round 9)

- **Wording**: log-in is the mechanism — make it visible; keep "silent" as
  a word; "silently saves and restores on log-in"; name the leak plainly
  ("it's not exactly clear what the leak is"); make it feel important and
  a no-brainer; don't lead with "automatic/automatically" (generic
  marketing-automation vibe) — mechanism words beat it.
- **Account in the visual story**: cart is saved to the shopper's ACCOUNT;
  show it (account node on the marigold path) and show the transfer landing
  at log-in on the other device (signed-in row in the WITH monitor).
- **Set condensed** to feature + 3 screenshots (frame2, frame4-mechanism,
  frame6). frame1 and frame5 cut (see round-9 cuts above).
- **One-click install** is the accurate setup claim (embed enable = one
  click); no multi-step setup story anywhere.
- **Display font**: Source Serif 4 Variable (weight 560), matching the
  website; Fraunces axis-pinning stripped from `base.css`. All four live
  frames re-verified for reflow after the swap.

Still open before submission: the flat device-outline style is accepted
practice but subject to 4.4.4 reviewer discretion — see plan doc.

## Localization (2026-07-08)

Per-locale renders of the 4 live frames for the listing's published
languages. Locales: `de fr es nl sv da pt-BR zh-CN ja ko` (zh-CN/fr/ja/ko/
pt-BR/es are live on the listing; de/nl/sv/da staged for a later expansion).

### Pipeline

```bash
node scripts/build-localized-frames.mjs   # frames/i18n/<locale>.json → frames/build/<locale>/*.html
node scripts/qa-frames.mjs                # QA GATE — must pass before rendering/uploading
node scripts/render-l10n-frames.mjs       # frames/build → renders/l10n/<locale>/<frame>.png (1600×900)
```

npm aliases: `npm run frames` (build → qa → render), or the individual
`frames:build` / `frames:qa` / `frames:render`.

Both scripts take optional locale args (`… de ja`) to do a subset. Renders
land in `renders/l10n/<locale>/` (upload-ready) + `renders/l10n/2x/<locale>/`
(@2x masters). The EN `.since` variant is not produced for locales.

- **English frames stay canonical** — no tokens in them. `frames/i18n/en.json`
  mirrors every user-visible string as an exact raw-HTML fragment; the build
  replaces those fragments (single pass, longest-first) with the same key from
  `frames/i18n/<locale>.json`. If English frame copy drifts from en.json the
  build fails loudly — update en.json AND all 10 locale files together.
- Locale values are raw-HTML fragments: keep `&amp;`/`&nbsp;`/`&shy;`, the
  `<span class="accent">`/`<b>`/`<br>` markup, real ’. CJK headlines set
  explicit `<br>` breaks (CJK wraps per glyph; kinsoku is enforced for ja via
  injected `line-break: strict`).
- Numbers/prices are product-data recreations and NEVER localized ($ and
  figures identical in every locale) — the build validates every digit/amount
  in an English value survives translation, plus alt-text lengths (≤64).
- Per-locale layout overrides live in the locale JSON under `"_css"`
  (`{"<frame-name>"|"*": css}`), injected as a `<style>` at the end of head —
  used for headline step-downs (es/pt-BR/zh/ja/ko), the es/nl 2-line account
  caption lift, de phone-subtotal size, fr f4 pill, ja f6 line-height.
- Localized alt texts: `frames/i18n/alts.json` (locale → [feature, s1, s2,
  s3]) for the Partner Dashboard's per-language media alt fields.

### CJK fonts (no font files added)

Source Serif 4 / Hanken Grotesk / IBM Plex Mono cover latin + latin-1
(de/fr/es/nl/sv/da/pt-BR ship on the brand faces). For zh-CN/ja/ko the build
injects macOS system fallbacks AFTER the latin families, so latin glyphs
($ amounts, digits, the lockup) keep the brand faces and only CJK falls back:
zh-CN → Songti SC (display) + PingFang SC; ja → Hiragino Mincho ProN (display)
+ Hiragino Sans; ko → Apple SD Gothic Neo (display stays gothic — Myungjo
renders poorly at display weights). Headless Chromium on macOS renders these;
all three verified tofu-free. Rendering on non-mac CI would need real font
files instead.

### Per-locale caveats hit during QC (fix = translation first, then _css)

- **de**: staccato headline ("Geräte wechseln. Warenkorb weg.") to hold 3
  lines at full size; "Zwischensumme" needs 10.5px in the phone subtotal;
  f4 pill is "Wiederhergestellt" (bare) — "Bei Anmeldung wiederhergestellt"
  doesn't fit next to "Ihr Warenkorb".
- **fr**: f4 "Restauré à la connexion" needs the smaller pill (_css);
  3-pack item is "(×3)" — "(lot de 3)" wraps with an orphan "3)".
- **es/nl**: (obsolete 2026-07-13) the account caption used to run 2 lines →
  lifted via _css. The caption box is now 260px wide and every locale's
  caption fits one line; the lifts were removed.
- **nl/pt-BR/sv**: hero headline shortened ("lekken weg" / "somem" /
  "försvinner på vägen") — the full "between devices" clause forces 4 lines;
  the fork visual carries the device story.
- **zh-CN**: 您-register per site; explicit `<br>` in all headlines.
- **ja**: カート / カゴ落ち vocabulary (never literal); `line-break: strict`
  injected (small-kana was landing at line starts); jacket item is
  レインウェア (ジャケット orphans ト in the phone column); f6 needs row/title
  line-height overrides (Hiragino's tall line boxes clipped the subtotal).
- **ko**: 장바구니 (never 카트), 이전 for "transfer" (site vocabulary);
  positive-turn headline ("기기를 바꿔도 장바구니는 그대로.") — the
  leak+negation form doesn't fit hangul metrics at display size.

## QA gate (2026-07-13)

The manual "review all renders" step above failed us: the hero shipped in 11
languages with the dashed fork line striking straight through "WITHOUT
PERSISTENT CART", the dotted line clipping the account caption, and an
arbitrarily gendered shopper ("SAVED TO HER ACCOUNT" / "She rebuilds" /
"SHE LOGS IN"). The first automated run also caught two latent defects in
shipped frames: frame6's laptop base painted 20px past the canvas (flat-cut
right end) and its subtotal's $/comma descenders were shaved ~1.4px by the
screen clip. All fixed; QA is now a script, not an eyeball:

```bash
node scripts/qa-frames.mjs             # after every build, before render/upload
node scripts/qa-frames.mjs --file x.html   # ad-hoc geometry check on one file
```

Checks (details in the script header): line-through-text via sampled SVG
path points vs glyph boxes, label-over-artwork/label, clipped-text via
canvas font metrics (glyph INK vs clip boxes — line-box leading doesn't
false-positive), art-off-canvas, headline ≤3 lines, mono-labels-never-
marigold, alt lengths, and a gendered-copy lint. It also regenerates
`renders/contact-sheet.html` — the human squint pass over every render,
which stays part of the process (the gate catches geometry and copy rules,
not taste).

**Copy register rule — never gender the shopper.** EN uses they/their or
"the customer" (lint = error on she/her/he/his). Locales use their unmarked
generic form: der Kunde / le client / el cliente / kunden / subject-drop
(es, pt-BR, zh) / no-subject verb forms (ja, ko). Explicitly feminine-marked
forms (Kundin, clienta, la cliente, dela, haar, hon/hennes, hun/hendes, 她,
彼女, 그녀) are lint errors; a grammatically forced case can be allowlisted
via `"_lint.allow": ["…"]` in the locale JSON. French "son panier" stays —
son agrees with the noun, not the owner. Named demo data (amelia@example.com)
is fine; it's account data, not narrative voice.

**Line-riding labels wear paper halos.** `.line-label` and `.acct-caption`
carry `background: var(--paper)` + padding, so a fork line passes BEHIND the
text and visibly breaks around it instead of striking through — locale-proof
at any translation length. Don't remove the halo to "clean up" the CSS; the
QA gate's line-through-text check is what enforces the result.

The detector is self-tested: reverting the halo + caption fixes on a scratch
copy of the hero must produce exactly the two original line-through-text
findings (this was validated when the gate was built).
