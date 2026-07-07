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

1. **Hero diagram, creative round 2.** The fork concept is validated (see research §2 —
   Rewind runs the same problem-led genre) and devices are now recognizable, but the owner
   wants something *more impactful, creative, polished — still trustworthy, not salesy*.
   Invoke the `frontend-design` skill; build 2–3 real variants; screenshot-compare desktop +
   390px mobile; let the owner pick. Candidate directions: real product-UI screenshot
   treatment (pairs with backlog #3), richer device illustration, motion-first storytelling
   (reduced-motion safe, resting state complete — see cycle 2's lesson: no entrance-stagger
   that leaves the diagram half-drawn).
2. **Official Shopify assets.** Owner has a Built-for-Shopify asset kit (and wants a Shopify
   Plus logo next to "hundreds on Shopify Plus"). Blocked on files → owner drops them into
   `design-assets/`. Then swap `BfsBadge.astro`'s extracted glyph for the official lockup
   where appropriate, and add the Plus logo to the trust bar (mind Shopify brand guidelines —
   only use owner-provided/licensed artwork).
3. **Dashboard "value-add" section.** cff_pc app dashboard shows recovered-revenue analytics.
   Flow: owner runs the dashboard preview locally (`/Users/debgangopadhyay/Desktop/cff_projects/cff_pc`
   — has live tokens in .env files; NEVER read/copy/expose them), agent screenshots the
   value views (crop chrome, no tokens visible), add a "see what it recovers" section to
   /how-it-works (or homepage) with real product UI.
4. **Implement the research report's ranked list** (docs/research-landing-pages.md §1) —
   after owner unblocks each: named-customer strip (owner must approve store names; public
   review names are the honest source), pricing "no usage fees / no per-order charges" line
   (confirm truth: paid plans are flat; Free Starter caps at 10 syncs), FAQ adds "Works with
   Shop" + "carts saved until checkout — no time limit" (both stated on the owner's live
   listing; confirm exact behavior with owner first), re-enable calculator + vs-email pages
   (V1_DEFERRED deletions + restore related-links + re-add homepage teasers if wanted).
5. **The thorough live audit the owner asked for** — QA, Marketing/UX, SEO, across the LIVE
   site (all 9 pages × key locales, mobile + desktop, Lighthouse/CWV, structured-data
   validation, GSC coverage once crawling starts). Owner said they want this "much more
   thorough" pass now that it's live. Consider parallel sub-agents per lens; verify findings
   before reporting (adversarial check), then fix in priority order.

## Owner inputs to request at session start (batch them once)

1. Green Mountain Diapers testimonial — confirm featuring it (LAST remaining v1 input).
2. Drop the Shopify badge/Plus asset kit files into `design-assets/`.
3. Store names approved for a "trusted by" strip (from public reviews).
4. Confirm facts: "Works with Shop" meaning; "no time limit" cart retention; "no usage fees
   on paid plans" phrasing.
5. $60M/90d vs a 30-day figure for the impact stat (owner hinted "last 30 days" once).
6. (When ready) run the cff_pc dashboard preview for the screenshot session.

## State snapshot

- Repo `main` = production. Branch `iterate-v1-simplification` preserved historical cycles.
- 151 pages build (9 v1 page types + /privacy-policy, ×15 locales, +404). All checks green.
- Docs current: iteration-log (cycles 1–5 + tweaks), v1-recommendation, owner-inputs,
  research-landing-pages, legal-review (pre-publish list mostly cleared; §5.7 partner risk
  parked with deferred pages).
- Design system: paper #F7F4EE / ink #1C1815 / marigold #D8541E accent, navy #14233A bands,
  evergreen success; Fraunces (opsz pinned to 20 — do NOT restore auto optical sizing, it
  brings back the swash f the owner rejected) + Hanken Grotesk + IBM Plex Mono; ink primary
  buttons; no gradients/glows. One signature element per page; restraint elsewhere.
