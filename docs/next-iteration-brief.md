# Next-Iteration Brief — persistentcartapp.com (post-launch audit + design round)

You are a FRESH agent taking over a LIVE, deployed marketing site. Read this file, then
`docs/iteration-log.md` (what happened, cycle by cycle), `docs/research-landing-pages.md`
(13-site competitive analysis with ranked recommendations), `docs/owner-inputs-needed.md`
(what only the owner can decide), and `docs/research-notes.md` (verified facts + honesty rules).
Everything below is current as of 2026-07-07.

## ⚠️ Read before touching anything

1. **Pushes to `main` deploy to production.** github.com/gangopadhyayd/cffpc_landing_page →
   Netlify project `persistentcartapp` (team dgangopa) → **https://persistentcartapp.com**.
   Verify locally first, always: `npm run build && npm run preview` (serves dist on :4321),
   screenshot, then push. `npm run check` + `npm run i18n:check` must stay green.
2. **Honesty rules are absolute** (research-notes §top): never fabricate stats/quotes; owner-
   approved published numbers are exactly: **4.9★** (plain text, no aggregateRating schema),
   **"$60M+ in orders from synced carts — last 90 days"**, **"thousands of Shopify stores,
   hundreds on Shopify Plus"** (qualitative). Say "across devices AND browsers"; never
   "Shopify doesn't save carts"; install = "one click + one theme-editor switch".
3. **i18n discipline:** all copy lives in `src/i18n/strings/<locale>.json` (+ per-page
   subfiles). 15 locales; EN is canonical/indexed, 14 are machine-noindex. `i18n:check` only
   catches MISSING keys — if you change an EN value's meaning, re-author that key in all 14
   locales (see scratchpad patch-script pattern in iteration-log cycles 1/2/4/5); if you add a
   key, add it ×15. Exception: `/privacy-policy` content is deliberately EN-only (legal text).
4. **The email address everywhere is support@customerfirstfocus.com** (owner decision
   2026-07-07). Never introduce @persistentcartapp.com addresses.
5. **V1 scope gate:** `V1_DEFERRED` in `src/config/routes.ts` parks 16 built pages
   (calculator, partners, big-retailers, etc.). Delete a key from the set to re-enable a page;
   nav/footer/sitemap/llms.txt follow automatically; restore its `related` links in
   `src/config/pageRender.ts`.

## Infrastructure map (all live)

- **DNS: Cloudflare** (account Dave@customerfirstfocus.com), zone persistentcartapp.com:
  apex CNAME→apex-loadbalancer.netlify.com and www CNAME→persistentcartapp.netlify.app, both
  **DNS-only (grey cloud) — never re-enable the proxy** (breaks Netlify SSL; and the old
  App-Store-redirect Worker `persistent-cart-app-redirect` still exists in the account with
  its routes removed — proxying could tempt someone to re-add them). The 5 eforward MX + SPF
  TXT records run Namecheap email forwarding — do not touch. DMARC TXT exists (p=quarantine).
- **GA4:** account "Persistent Cart" → property "persistentcartapp.com", Measurement ID
  `G-B0XL737D3K`, set as `PUBLIC_GA4_MEASUREMENT_ID` in Netlify env. Consent-gated loader in
  `Analytics.astro`; events: install_click (with placement source), etc.
- **Search:** GSC domain property verified (DNS TXT); sitemap-index.xml submitted. Bing
  Webmaster imported from GSC (Google sign-in dgangopa@gmail.com); sitemap submitted.
- **UTM:** all UI install links use `appStoreLink(content)` from `src/config/site.ts`
  (utm_source=persistentcartapp.com&utm_medium=referral&utm_campaign=site&utm_content=<placement>).
  Schema.org + llms.txt keep the clean URL. Check Shopify Partner analytics for the data.

## Browser/automation gotchas (hard-won; trust these)

- **Headless Chrome clamps its window to ~500px** — a `--window-size=390` screenshot is a
  CROP of a wider layout and looks falsely broken. For mobile truth: write a scratch page
  into `dist/` that iframes "/" at 390px width, screenshot THAT (iframe media queries evaluate
  at iframe size). Pattern in iteration-log cycle 3. Remove scratch files before committing.
- **Cloudflare's dashboard only finishes booting on user-initiated page loads** — agent
  navigations hang on the spinner forever. Ask the owner to open the page, then drive it.
- **A password-manager extension overlays focused text inputs** and blocks screenshots/clicks
  with "Cannot access a chrome-extension:// URL". Avoid clicking into inputs; use the `find`
  tool + `form_input` (programmatic set) instead. If an input rejects form_input (Bing's did),
  click+type works — just expect capture failures until focus moves.
- **The owner's macOS Desktop is TCC-blocked to the shell** — you cannot read
  /Users/debgangopadhyay/Desktop. Ask the owner to drop files into the repo (design-assets/).
- Dev server: `npm run dev` daemonizes on :4321/:4322 (`astro dev stop` to stop). Preview
  (`npm run preview`) serves the last build — rebuild first.

## The owner's outstanding feedback = your backlog (in their priority order)

1. ~~Trust-signal hierarchy redesign~~ ✅ **SHIPPED cycle 6 (2026-07-07).** Each signal
   once above the fold, placed by nature: announce = positioning claim only ("The original
   … since 2016", text, non-sticky sibling of the sticky nav); hero row = $30M+/30d (bold)
   + 4.9★ link; TrustStrip (new component, absorbed the trust bar) = trusted-by lead + the
   page's SINGLE official BFS badge + customer logos. ⚠️ Kit rule enforced sitewide: ONE
   badge instance per page, ≥30px, never altered — the redrawn announce glyph is gone; do
   not reintroduce it.
2. ~~Customer-logo trust strip~~ ✅ **SHIPPED cycle 6** ("Extended 11" owner pick).
   Toggle: `showCustomerLogos` + `proof.namedMerchantLogos` in src/config/site.ts (flag
   off → slim lead+badge fallback). Assets: design-assets/customer-logos/MANIFEST.md
   (sources/grades) → web copies in public/customer-logos/ (StewMac + Tannico ink-recolored;
   treatment = multiply + grayscale). Excluded as trademark-sensitive: Levi's Korea,
   LINE FRIENDS, Phoebe Philo. techbino/vdbparts reserved for case studies, not logos.
3. ~~Hero diagram round 2~~ ✅ **SHIPPED cycle 6 — owner picked 'live'** (plate chrome +
   sync choreography). All four variants remain switchable via `heroVariant` in
   src/config/site.ts ('fork'|'plate'|'live'|'real'). Motion rules that survived review:
   resting markup = complete story; JS only winds back temporarily; no phone price column.
4. **Dashboard "value-add" section — NOW UNBLOCKED.** Owner supplied a debug
   dashboard-preview URL pattern (2026-07-07):
   `persistent-cart.customerfirstfocus.com/debug/dashboard-preview/<store>.myshopify.com?token=…`
   ⚠️ The token is a secret — never commit it, never show it in screenshots (crop the URL
   bar). ⚠️ The example store (magnoliamom) is a REAL merchant — real revenue figures need
   anonymization/owner sign-off, or try `cff-demo-store.myshopify.com` in the path first.
   Owner notes the views may be dimmed / say "beta" — may need cleanup before screenshots.
5. ~~Official Shopify assets~~ ✅ RESOLVED with a hard finding: **no official public
   Shopify Plus lockup exists** (brand-assets ships only the main Shopify logo; the Plus
   partner badge is gated to Plus-partner tiers). "Shopify Plus" stays as text — this is
   guideline-correct, stop hunting. 6 official Shopify SVGs + guideline notes in
   design-assets/shopify-plus/.
6. **Research ranked list — remaining:** ✅ pricing fees line + FAQ "Works with Shop" +
   "no time limit" shipped cycle 6 (owner confirmed all three; Shop nuance: Shop login
   ties the cart to the account, but Shop does NOT move carts between devices itself).
   STILL OPEN: re-enable calculator + vs-email pages (V1_DEFERRED deletions + restore
   related-links + homepage teasers if wanted).
7. **The thorough live audit the owner asked for** — QA, Marketing/UX, SEO, across the LIVE
   site (all pages × key locales, mobile + desktop, Lighthouse/CWV, structured-data
   validation, GSC coverage once crawling starts). Consider parallel sub-agents per lens;
   verify findings before reporting (adversarial check), then fix in priority order.
   NOTE: OG image still shows the old 3-item fork + old headline framing — refresh it
   during the audit round if the owner wants parity with the live hero.

## Owner inputs (all 2026-07-07 batch answers — resolved)

1. Logo strip = Extended 11 ✅ · 2. Claims: all three approved, Shop nuance captured ✅ ·
3. Impact stat = **"$30M+ — last 30 days"** ✅ ⚠️ standing flag: internal 2026-06-03
   measurement was $26.0M/30d — surface to the owner if they ever ask to re-verify; the
   number is theirs. · 4. Dashboard = debug preview URL (see backlog #4). Nothing is
   currently blocked on the owner except dashboard-content sign-off when that ships.

## State snapshot

- Repo `main` = production. Branch `iterate-v1-simplification` preserved historical cycles.
- 151 pages build (9 v1 page types + /privacy-policy, ×15 locales, +404). All checks green.
- Homepage above-the-fold (cycle 6): announce → sticky nav → hero (H1/sub/CTAs/numbers row)
  → live plate diagram → TrustStrip (lead + official badge + 11 logos) → problem section.
  FAQ = 15 questions; pricing carries the flat-fees line.
- Docs current: iteration-log (cycles 1–6), v1-recommendation, owner-inputs,
  research-landing-pages, legal-review (pre-publish list mostly cleared; §5.7 partner risk
  parked with deferred pages).
- Design system: paper #F7F4EE / ink #1C1815 / marigold #D8541E accent, navy #14233A bands,
  evergreen success; Fraunces (opsz pinned to 20 — do NOT restore auto optical sizing, it
  brings back the swash f the owner rejected) + Hanken Grotesk + IBM Plex Mono; ink primary
  buttons; no gradients/glows. One signature element per page; restraint elsewhere.
