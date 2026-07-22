# Next-Iteration Brief — persistentcartapp.com (v1.0 LIVE, 2026-07-08)

**v1.0 is the owner-accepted first live version** (git tag `v1.0.0`). You are a fresh
agent iterating on a LIVE production site. Read this, then `docs/iteration-log.md`
(cycles 1–8, every decision + scar), `docs/audit-report-2026-07-07.md` (verified audit +
the owner queue), `docs/improvement-plan-2026-07-08.md` (the copy/figure/SEO round),
`docs/research-landing-pages.md` (13-app teardown + live fold benchmark),
`docs/research-notes.md` (honesty rules), `docs/owner-inputs-needed.md`.

## ⚠️ Standing rules (owner-set; all still binding)

1. ~~Pushes to `main` deploy production~~ **UPDATE (commit 33b1783): CI builds are
   STOPPED to save Netlify credits — a push no longer deploys. Deploy ONLY via
   `npm run deploy`** (build + qa-gate + `netlify-cli deploy --prod`) →
   https://persistentcartapp.com (Netlify project `persistentcartapp`, team `cffpc`,
   Pro plan since 2026-07-08). Verify locally first: `npm run check` + `npm run i18n:check` +
   `PUBLIC_GA4_MEASUREMENT_ID=G-B0XL737D3K npm run build && npm run preview`, screenshot
   (see gotchas), then push — and **verify the deploy actually landed** (the CLI is
   authed on the owner's machine: `npx netlify-cli api listSiteDeploys --data
   '{"site_id":"persistentcartapp.netlify.app","per_page":3}'` → newest `state:"ready"`).
2. **Honesty rules are absolute** (research-notes). Current approved claims, exactly:
   **"$30 Million+ · in the last 30 days · order value from carts auto-transferred
   across devices"** (hero lockup wording; other locales keep "$30M+"), **4.9★** (plain
   text; **never show or mention the review COUNT** — owner 2026-07-08; the localized
   `home.testimonial.cta` string with `{count}` is parked for when the count is
   bigger), "thousands of Shopify stores, hundreds on Shopify Plus" (qualitative),
   since 2016, "one click + one theme-editor switch". Review quotes must be verbatim
   from the live listing. Never name the dashboard-snapshot store.
3. **Brand/kit guidelines are SOFT** (owner 2026-07-07): never hard-block a marketing
   ask on a third-party usage kit without asking. Honesty rules are NOT covered by this.
4. **i18n discipline:** 15 locales; EN canonical/indexed, 14 machine-noindex. Change an
   EN value's meaning → re-author ×14 by hand (patch-script pattern, respect register +
   established terminology; log cycles have per-locale extracts). New key → ×15.
   `dash.ui.*` keys and the how-it-works dashboard figures stay EN/US verbatim by
   design. `/privacy-policy` content is EN-only (legal).
5. **support@customerfirstfocus.com** everywhere; never @persistentcartapp.com.
6. **Cloudflare DNS: never re-enable the proxy** (grey-cloud only; breaks Netlify SSL;
   an old redirect Worker still exists in the account). The 5 eforward MX + SPF/DMARC
   records run mail forwarding — don't touch.

## State snapshot (what's live)

- **226 pages** = 15 page types × 15 locales + privacy-policy + 404. Re-enabled
  2026-07-08: cross-device, vs-recovery (top-nav "Vs. email recovery"), b2b,
  uc-wholesale, compare-email. Still in `V1_DEFERRED`: calculator, free-audit,
  partners, affiliates, big-retailers, plus, uc-high-aov, uc-repeat, resources,
  summary, changelog.
- **Display font: Source Serif 4** (owner pick; self-hosted `public/fonts/`,
  @font-face in global.css, headings wght 560). Fraunces is fully removed — its
  swash-f saga is in iteration-log; don't reintroduce.
- **Hero**: proof row (BFS badge + 4.9★ glyph chip) above H1 → 25-word sub → CTAs →
  "$30 Million+ / in the last 30 days" co-equal lockup → the FORK figure — desktop
  ≥980px is HORIZONTAL (phone | account-node paths | stacked outcomes; from the
  app-store export), mobile stacks. Both laptop screens are FIXED equal height
  (10.6rem) — min-height drifted twice; if cart content changes, re-measure and reset
  the fixed height (playwright measure pattern in iteration-log part 3). Demo cart:
  DEMO_ITEMS = 2 base items + the animated beanie = 3 rows in the live variant
  ($242 resting / $224 wound-back).
- **Homepage flow**: hero → TrustStrip (lead + "Available for [Shopify] | Shopify
  Plus" + BFS 40px + 11 customer logos) → problem → benefits ("One-click setup — then
  it works silently in the background.") → parity (Amazon citation points at the live
  amazon.sg help node — .com node is dead; swap if a working .com URL is found in a
  real browser) → navy metric band → testimonial + 3 verbatim review cards
  (SupplementSource.ca, Public Goods, Nest; NO reviews link) → pricing → FAQ (8) →
  CTA band. /how-it-works carries the Cart Transfer Value dashboard snapshot
  (8,069 / 1,974 / $452,836 — static, never live-framed).
- **Analytics: geo-gated consent** (owner decision): EU/EEA/UK/CH (timezone heuristic,
  fail-safe) see the banner, GA4 after Accept; everyone else gets GA automatically,
  no banner; stored Decline wins everywhere. Plausible still unwired.
- **A11y**: WCAG AA contrast tokens shipped (ink-faint #6e6459 etc.); announce bar is
  a labelled region. Design tokens otherwise per global.css @theme.
- **App Store listing assets** (parallel workstream, committed at v1.0): frames +
  renders in `design-assets/app-store/`. **UPDATE 2026-07-20: the EN listing IS live
  with these frames** (visually verified — live hero = `renders/hero-feature.png`).
  The old "NOT yet uploaded" note was stale. Still open: whether the 10 localized
  listings + app icon carry their `renders/l10n` variants (not checked).

## Gotchas (hard-won; trust these)

- **Screenshots**: headless-Chrome CLI clamps window width ~500px — for mobile truth
  use playwright-core (channel:'chrome', real viewport; capture script pattern in
  scratchpad-era `capture.mjs`, recorded in iteration-log) or the dist-iframe trick.
  Playwright is now a devDependency.
- **Measure, don't eyeball, figure geometry** — the owner catches pixel drift.
- Verify deploys via the Netlify CLI (above); a push is NOT a deploy. GitHub gets no
  commit statuses from this Netlify site.
- A PARALLEL session may work this repo — stage explicit paths, never `git add -A`.
- Cloudflare dashboard hangs for agent navigations; ask the owner to open it.
- macOS Desktop is TCC-blocked; ask for files via design-assets/.
- Astro-scoped selectors don't grep-match in built CSS (data-attr suffixes); verify
  styling visually or via computed styles.
- amazon.com bot-walls all automation (curl, WebFetch, headless) — verify Amazon
  pages via search engines or ask the owner.

## Backlog (owner queue first — each needs their call)

1. **Privacy-policy revision (P1)**: formal policy says carts are stored "anonymous…"
   which contradicts the product (account-keyed carts). Legal text; owner edits, then
   port formatting-only. (owner-inputs §4 has the full revision list.)
2. ✅ RESOLVED 2026-07-22 — full charge-on-install revert COMPLETE on all surfaces:
   testing phase over, Free Starter retired, 4 paid tiers (Basic $4.99 · Grow $8.99 ·
   Advanced $24.99 · "Shopify Plus" $99.99), 30-day trial on every plan, charge approved
   at install. Registry + listings live in 11 languages (verified via public curls);
   site ×15 locales deployed and live-verified; **app-side pricing confirmed done by the
   owner same day** (install charge + `shopify-advanced` mapping + free-path retirement).
   Pre-revert safekeeping: tag `pre-charge-revert-2026-07-22`; full record in the
   iteration-log 2026-07-22 entries. Frames needed no change (no pricing text in
   screenshots). The 2026-07-15 "Advanced & Plus" fold-in and its mapping task are
   fully superseded.
3. **GMD logo** in the strip is illegible at 26px — swap asset, drop, or accept.
4. **signed-in vs logged-in** terminology sweep ×15 (recommend "signed-in").
5. **SERP trims**: home title 72 chars / desc 202 (drafts on request).
6. **How-it-works step-strip diagram** (save → sign-in → merge) — designed, unbuilt;
   the next diagrams-over-text move (improvement-plan §Diagrams).
7. ~~**App Store listing upload**~~ ✅ DONE — EN listing is live with the new frames
   (verified 2026-07-20). Only remaining: confirm the 10 localized listings + icon
   carry their `renders/l10n` variants (owner can check in Partner dashboard).
8. Re-enable next pages when wanted: calculator (needs QA pass), big-retailers, plus,
   resources/summary/changelog. (plus + summary copy needs an Advanced-aware re-read
   first — the bare $99.99→$99 price swap is done, the prose is still Plus-only.)
9. **Schema `sameAs` — entity corroboration (owner-gated) [added 2026-07-20].**
   The `Organization` JSON-LD `sameAs` (in `src/config/site.ts`) currently lists
   ONLY the App Store URL. That is the last thin spot in the site's entity
   footprint: Google's Knowledge Graph and AI answer engines corroborate "who
   Persistent Cart is" from consistent references across independent authoritative
   profiles, and there's only one. **Blocked on the owner creating the profiles —
   there's nothing to link to yet; do NOT invent/placeholder them.** When any of
   LinkedIn (company page), X, YouTube, Facebook, or Crunchbase exist for the app,
   add the URL(s) to `site.ts` `sameAs` (one-line change, then rebuild) — a ~2-min
   dev task. Tracked in `docs/distribution-checklist.md` item 10. Low urgency,
   compounding value for AI-search visibility (see `docs/seo-growth-plan.md` §E1).

Parked P2 polish (no decisions needed): FAQPage schema dedupe across home/faq;
hreflang→noindex tension (resolve at native review); Source Serif 4 subsetting +
size-adjust fallback (CLS 0.03–0.07 is font-swap); oversized customer-logo PNGs
(~84KB waste); CJK line-break polish (bundle with native review); `cta.partner`
translations refresh when partners page returns; hero 'fork'/'plate'/'real' variants
un-exercised since the horizontal rework — re-verify before switching `heroVariant`.

## Analytics to watch (first data)

GSC (domain property verified, sitemap submitted — now 15 EN URLs), Bing, GA4
(`G-B0XL737D3K`, geo-gated), Shopify Partner analytics for install-click UTMs
(`utm_content` = placement: hero / footer / pricing_table / home_final / …). The
fold benchmark and audit baseline (Lighthouse 98–100) are the reference points.
