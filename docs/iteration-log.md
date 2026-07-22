# Iteration Log — lean-v1 pass (branch `iterate-v1-simplification`)

Independent review-and-iterate pass toward a lean, launch-fast v1. Each cycle:
review → prioritize → implement → verify (build/check/i18n:check + screenshots).
The simplify-vs-restart call and final v1 shape live in `docs/v1-recommendation.md`.

---

## Cycle 1 — core message + hard scope cut (2026-07-04)

### Review findings (against the "no-brainer in 5 seconds" test, desktop 1440×900)
1. **FAIL: install CTA below the fold** — the old hero H1 (16 long words) + 52-word sub pushed
   both buttons off screen 1.
2. **FAIL: two-step-inference headline** — the parity lead ("Big retailers keep… Shopify doesn't")
   makes the merchant derive the loss themselves; the leak is never stated on screen 1.
3. **FAIL: hero visual shows only the happy end-state** — two near-identical white cards, both
   labeled "Synced across devices"; nothing shows a cart being LOST, and the "devices" don't look
   like devices (the owner's exact complaint). Same visual repeated 3× down the page.
4. Homepage: 17 sections, 5 competing CTA types (install / audit / calculator / partner / B2B).
5. Site: 25 page types × 15 locales for a v1 that needs ~9; partner/calculator are good but deferred
   per owner; free-audit creates a fulfillment promise (1–2 business days) no one can honor yet.

### Changes
**A. Message — leak first, parity as proof (owner-favored framing won the 5-second test):**
- H1: *"Shoppers switch devices constantly. On a default Shopify store, their cart doesn't follow."*
- Sub: phone→laptop story, "No error, no email, just a lost sale," one-click fix (+honest
  theme-editor switch), Amazon/Walmart as expectation-setting, "nothing for shoppers to do."
- Hero eyebrow removed (announce bar already carries Built for Shopify · since 2016 · 4.8★).
- Secondary CTA: free-audit → **"See how it works"** (removes the 🔴 audit-fulfillment dependency).
- Added a cited device-switching stat strip to the problem section (Google/Ipsos 2012 ·
  Bazaarvoice SXI Nov 2024 — both from the verified stat bank, dated inline).
- Meta description re-led with the leak (SERP/AI answer alignment). Title kept (keyword-stable).

**B. Scope — 25 → 9 page types (376 → 136 pages), code all kept:**
- New `V1_DEFERRED` set in `src/config/routes.ts` gates emission + nav/footer/sitemap/llms.txt.
  Re-enable by deleting a key from the set.
- **v1 pages:** home, how-it-works, pricing, faq, cornerstone (`/shopify-persistent-cart`),
  pain page (`/shopify-cart-disappears-after-login`), contact, support, privacy.
- **Deferred:** calculator, free-audit, partners, affiliates, cross-device, big-retailers,
  vs-recovery, b2b, plus, 3 use-cases, compare-email, resources, summary, changelog.
- Homepage 17 → 10 sections. Cut: motion demo (duplicate of hero visual), comparison table (FAQ q6
  covers it), calculator teaser, audit band, B2B section, partner band, data section (folded into a
  new FAQ item q8 "What does it do with my customers' data?" — also more FAQPage schema surface).
- Nav: 8 items + 2 buttons → **How it works · Pricing · FAQ · [Start free]**.
- All internal links to deferred pages retargeted (hero, header, footer, 404, ContentPage/FAQ/
  Pricing CTA bands, related-reading lists, llms.txt now registry-driven). Verified zero
  deferred-slug hrefs across all 136 built pages.

**C. Honesty/legal wins while editing copy:**
- Legal-review **HIGH 5.7** (firm "30% recurring" partner offer) leaves v1 with the partner surfaces.
- Legal-review **5.2**: homepage Shopify cookie-cart card no longer renders as a `<blockquote>` —
  new `kind: 'paraphrase'` renders plain text, source relabeled "Our summary — based on Shopify's
  cookie policy + community."
- FAQ/pricing "is it worth it" answers rewritten without calculator/audit references (Free Starter +
  30-day trial carry the try-before-you-pay proof).

**D. i18n kept coherent (not just green):** the 16 changed/new root keys + `faq.q13.a` +
`pricing.s3.b` were re-authored in all 14 machine locales (glossary + per-locale register respected;
`nav.faq` mirrors each locale's existing FAQ label). `npm run i18n:check` green.

### Verify
- `npm run check` 0 errors · `npm run build` green, **136 pages** · `i18n:check` green.
- Desktop screenshot: H1 + leak + fix + both CTAs + trust line all on screen 1 at 1440×900. ✓
- Deferred-slug link sweep across dist: **0 hits**. Sitemap = 9 EN URLs. llms.txt matches v1 scope.

### Still open (next cycles)
- Hero visual still the old "two identical synced cards" — Cycle 2 rebuilds it as a real
  lost-vs-kept story with distinct device silhouettes (frontend-design skill).
- Icon/favicon not yet multi-device. OG image still generated from the old headline.
- Mobile-width screenshot verification (Chrome window wouldn't shrink below ~1372px; will use a
  headless viewport screenshot in Cycle 3).

---

## Cycle 2 — the fork hero + multi-device mark (2026-07-04, frontend-design skill)

### Design decisions
- **Signature element: THE FORK.** The hero visual is now a decision-tree of the same shopper's
  two futures: phone cart at top → two paths → left: dashed ink path ending in an ✕, chip
  "Default Shopify", laptop showing *"Your cart is empty / The phone cart stayed behind"* →
  right: solid marigold path with arrow, chip "With Persistent Cart", laptop showing the SAME
  3-item cart + a "Synced" badge. Heroes almost never show the failure state first-class — that's
  the deliberate aesthetic risk, and it is literally the product's pitch. Drawing style is
  patent-diagram: fine-ink hand-rolled device silhouettes (portrait phone with camera + home bar;
  landscape laptops with bases) and IBM Plex Mono figure labels (`— PHONE —`).
- **Motion discipline:** first draft staggered everything in and looked broken mid-sequence
  (screenshot-verified). Final: the diagram is COMPLETE at rest; the only motion is a marigold
  cart-dot riding the kept path (rAF + getPointAtLength, IntersectionObserver-gated, re-runs
  every 6.5s while visible) + one badge pop. Reduced-motion/no-JS = identical still story.
- **Brand mark:** 3 concepts built and screenshot-compared at 128/64/30/16px. Winner: phone
  (front, paper-filled) + laptop (back) sharing ONE marigold cart drawn across the seam with a
  paper halo. Reads down to 16px. Applied to `Logo.astro` (invert-aware) + `favicon.svg`.
- **OG image** regenerated: new leak headline + the fork motif (phone → ✕-empty vs synced laptop).
- Consistency: added a real `cart` glyph to the icon set (ParityDiagram's cart chip no longer
  uses the storefront icon); phone mini-cart drops its price column (no more truncated names —
  the $248 subtotal is the payoff line anyway).
- Mobile plan for the fork: below 540px the connector SVG steps aside and the outcomes stack
  under their labeled chips (verified in Cycle 3).

### Verify
- build 136 pages green · typecheck 0 errors · i18n:check green (4 new/changed keys —
  synced badge, empty state ×2, caption — hand-authored in all 14 locales).
- Desktop screenshots: fork + full CTA stack above the fold at 1440×900; mark legible in header
  zoom; problem/parity/stat sections verified in place.

---

## Cycle 3 — QA, mobile truth, and launch docs (2026-07-04)

### Findings & fixes
- **Mobile "overflow" was a tooling artifact, not a bug.** Direct headless-Chrome screenshots at
  `--window-size=390` showed the page cut off; a measured in-iframe scan at a true 390px viewport
  (production build) proved `scrollWidth=390`, media queries applying, zero offenders — headless
  Chrome clamps its window to ~500px and crops the capture. Real finding from the scan: the
  laptop-base bars poked 2px past exact-390 viewports → base width 114%→110%. Mobile re-verified
  visually via the iframe method: announce wraps, CTAs stack, the fork stacks phone → lost →
  kept with chips carrying the branching.
- **Link integrity sweep (all 136 pages):** one broken href — `/apple-touch-icon.png` was
  referenced by SEOHead since the original build but never existed. Generated (180px, new mark).
  After fix: 141 unique internal hrefs, zero broken.
- **Structure sweep:** exactly one `<h1>` per page ✓ · `og:image` on every page ✓ · German
  sample locale renders the new hero and stays `noindex` ✓.
- **A11y:** stat citation line bumped ink-faint→ink-soft (small-text contrast); fork is a
  `figure` with real DOM text in story order (screen readers get phone cart → empty → synced);
  decorative SVGs `aria-hidden`; global `:focus-visible` + reduced-motion reset already in place,
  fork motion additionally gated behind `prefers-reduced-motion: no-preference` + no-JS-safe.
- Subpages (how-it-works, pricing, faq) visually reviewed at desktop — clean, on-message.

### Deliverables
- `docs/v1-recommendation.md` — simplify-vs-restart call (simplify), final v1 page set,
  re-enable instructions, the ≤3 owner inputs, pre-publish checklist, v2 order.
- `docs/owner-inputs-needed.md` — top-3-asks banner added.
- Final state: **build 136 pages · typecheck 0 errors · i18n:check green · 0 broken links.**

---

## Cycle 4 — owner feedback round + pre-deploy fixes (2026-07-06)

Owner reviewed the running site and green-lit deployment. Changes, all owner-directed:

- **Rating corrected to 4.9★ / 47 reviews** — re-verified live on the listing 2026-07-06;
  config + every hardcoded 4.8★/4,8★ string across all 15 locale catalogs + OG image.
- **$60M proof stat published (owner-approved):** metric band now leads with
  **"$60M+ · Order value from synced carts · in the last 90 days, across stores using the app"**;
  "thousands of stores · hundreds on Shopify Plus" moved into the since-2016 metric note
  (owner-approved qualitative wording). Wired via `proof.syncedCartRevenue`.
- **Official Built for Shopify badge** (diamond glyph as rendered on our own listing —
  certification granted Dec 2024 per Shopify support thread) added at hero trust row +
  homepage trust bar via new `BfsBadge.astro`. Footer disclaimer already covers attribution.
- **Pricing "recommended tier" contradiction removed:** no tier is highlighted anywhere
  (auto-selected by the merchant's Shopify plan, so highlighting one was wrong).
- **UTM attribution on every install link:** new `appStoreLink(content)` helper —
  `utm_source=persistentcartapp.com&utm_medium=referral&utm_campaign=site&utm_content=<placement>`
  on all 14 UI links; schema.org + llms.txt keep the clean canonical URL.
- **Bug fixed:** footer rendered raw key `footer.link.how-it-works` (key was never added when
  the page joined the footer in cycle 1) — added in EN + programmatically mirrored from each
  locale's `nav.product`.
- **Hero devices now unmistakable** (owner: "the phone doesn't look like a phone"):
  phone = tall 10:15.5 aspect, dynamic-island, side button, home bar; laptops = webcam dot +
  trapezoid deck with thumb scoop. Verified desktop + true-390px mobile (no overflow).
- **App Store icon deliverable:** `design-assets/app-store-icon-1200.png` (1200×1200, mark on
  paper) for the listing refresh.
- Locale patch: metric-band strings hand-translated ×14; `home.metrics.3.label` reuses each
  locale's existing "On the App Store since" translation.

Verify: build 136 pages · typecheck 0 errors · i18n green.

## Cycle 5 — owner feedback round 2 + go-live finishers (2026-07-07)

- **"Weird f" fixed:** Fraunces' auto optical sizing swaps in old-style swash letterforms at
  display sizes (descender lowercase f). Headings now pin `font-optical-sizing: none` +
  `font-variation-settings: "opsz" 20, "SOFT" 0, "WONK" 0` — conventional f, same typeface.
- **Review count removed everywhere** (undersells the product): trust bar uses the plain
  "4.9★ on the Shopify App Store" string; testimonial CTA now "Read the reviews".
- **Impact stat elevated:** "$60M+ in orders from synced carts — last 90 days" now leads the
  hero trust row AND the trust bar (bold, first position); metric band still reinforces it.
  (Independently validated same-day by the landing-page research: money-proof above the fold
  is the #1 pattern across winning Shopify app sites.)
- **Official BFS badge on top:** announce bar renders the official diamond + label; also in
  hero trust + trust bar. (Owner's Desktop asset kit was macOS-TCC-blocked for the agent; the
  glyph used is the official one extracted from our own listing. Kit files can be dropped into
  design-assets/ to swap.)
- **Trusted-by line restored:** trust bar lead = "Trusted by thousands of Shopify stores —
  including hundreds on Shopify Plus." ("Shopify Plus" as text; official Plus logo pending
  brand-kit files.)
- Locales: announce prefix stripped mechanically ×14; trustbar.lead + trust.impact
  hand-translated ×14. i18n green; build 136 pages; typecheck 0 errors.
- **Search engines (browser session):** Cloudflare — GSC TXT + DMARC (p=quarantine,
  rua=dgangopa@gmail.com) added; GSC domain property auto-verified; sitemap submitted (GSC +
  Bing); Bing site imported from GSC (read-only webmasters scope, dgangopa@gmail.com).
- **Research:** docs/research-landing-pages.md — 13 reference sites analyzed; top asks:
  money-proof in hero (done this cycle), named-customer strip (needs owner permission),
  pricing "no usage fees" line, re-enable calculator + vs-email pages for v2.

## Post-launch tweaks (2026-07-07, owner-directed)

- **Formal privacy policy hosted on-domain:** `/privacy-policy` — verbatim port from
  persistify.herokuapp.com/privacy (formatting only). EN-only content across locales
  (canonical legal text). Footer + `/privacy` explainer cross-link it; old netlify
  `/privacy-policy→/privacy` redirect removed. Build 136→151 pages.
- **Single support address (owner decision):** support@customerfirstfocus.com everywhere —
  removed all @persistentcartapp.com addresses (site config + contact/support/privacy copy in
  all 15 locales + deferred Resend sender defaults). Matches the formal policy's contact.
- **Privacy-policy improvement backlog documented** in owner-inputs §4 (anonymous-cart wording,
  sub-processors, effective date, deletion mechanics) — for the owner's next policy revision.

## Cycle 6 — trust hierarchy · customer-logo strip · hero "live" (2026-07-07)

Owner batch-answered the session questions up front: logo strip = **Extended 11**;
impact stat = **"$30M+ — last 30 days"** (supersedes $60M/90d; ⚠️ internal 2026-06-03
measurement was $26.0M/30d — owner owns the delta); all 3 claims approved ("Works with
Shop" = works with new customer accounts, Shop login ties cart to account, **Shop does
NOT move carts across devices itself**); dashboard via debug preview URL (token — never
commit/screenshot it).

### Trust-signal hierarchy (each signal exactly once above the fold, placed by nature)
- **Announce bar = positioning claim only:** "The original cross-device cart app for
  Shopify — since 2016." No badge, no rating. Announce is now a *sibling* of the sticky
  header — it scrolls away (fold gets ~30px back); nav alone sticks. (First attempt
  nested a sticky div inside the header — sticky can't escape its parent's box; fixed.)
- **Hero trust row = the numbers:** $30M+/30d (bold, first) + 4.9★ listing link.
- **TrustStrip (new component, replaces the trust bar) = who vouches:** trustbar.lead +
  the page's **single** official BFS badge + 11 ink-duotone customer logos + mono
  footnote "A few of the stores syncing carts with Persistent Cart."
- **BFS media-kit compliance (read the usage PDF):** "one badge instance per webpage",
  ≥30px tall, clear space ≥ half height, never altered. The announce bar's redrawn
  diamond+label pseudo-badge violated "don't alter" and doubled the instance → removed
  everywhere; `BfsBadge` inline variant now unused on marketing surfaces.

### Customer-logo strip (owner-approved; "Extended 11")
- `proof.namedMerchantLogos` (now `MerchantLogo[]`: name/domain/src/href?/w/h) +
  `showCustomerLogos` master switch; strip renders logos only when flag && non-empty,
  falls back to the slim lead+badge bar when off.
- Logos: StewMac, Public Goods, Magnolia, Ksubi, FASHIONPHILE, Todd Snyder, Swanson
  Vitamins, Tannico, momox fashion, Shoebacca, Green Mountain Diapers — all fetched
  from each brand's own site (sources + grades in design-assets/customer-logos/
  MANIFEST.md); masters in design-assets/, web copies in public/customer-logos/
  (StewMac + Tannico recolored to ink — white/light-gray fills vanish on paper; Ksubi
  svgo'd 114→42KB). Treatment: `mix-blend-mode: multiply` + grayscale (white PNG
  backgrounds fall into the paper). Excluded as trademark-sensitive: Levi's Korea,
  LINE FRIENDS, Phoebe Philo (owner can override).
- **Shopify Plus wordmark: no official public lockup exists** — shopify.com/brand-assets
  ships only the main Shopify logo; the Plus partner badge is gated to qualified
  partner tiers. "Shopify Plus" stays text (guideline-safe); 6 official Shopify SVGs
  saved to design-assets/shopify-plus/ with usage notes.

### Hero round 2 — 4 variants built, owner picked "live"
- `heroVariant` in src/config/site.ts: 'fork' (cycle-2 baseline) · 'plate' (editorial
  patent-plate: FIG. 1 mono header, faint dot-grid paper, plate border, SIGNED-IN
  SHOPPER annotation w/ leader line, bolder paths + origin ring) · **'live' (SHIPPED:
  plate + sync choreography — a 4th item pops into the phone cart every ~8s, the dot
  carries it, the laptop cart receives it, subtotals count up $248→$266)** · 'real'
  (product thumbs, qty steppers, Check out button).
- Motion discipline holds: markup always encodes the finished 4-item story; JS only
  winds carts *back* temporarily (IntersectionObserver-gated, prefers-reduced-motion
  → static complete state). Cycle-2 lesson re-hit and re-fixed in 'real': price column
  on the phone truncates names — phone rows carry no prices in any variant.
- Compare method: built each variant, held `dist/index.html` per variant +
  union of hashed `_astro` assets, served all four at /_compare/ off one preview —
  owner experienced the motion live instead of picking from static screenshots.
- Verified desktop 1440 + true-390 (iframe method) for plate/live/real + strip.

### Owner copy wired (×15 locales, hand-authored per register)
- Stat 90d→30d (mechanical numeral swap preserves native phrasing: trust.impact,
  home.metrics.1.note), announce.text re-authored, + new keys: trustbar.note,
  hero.fig.label, hero.annot.signedIn, demo.cart.item.beanie, demo.cart.checkout,
  pricing.feesNote ("flat monthly — no usage fees, no per-order charges"; also
  appended to home trialNote), faq.q14 (Works with Shop — states Shop alone doesn't
  transfer carts), faq.q15 (saved until checkout — no time limit). FAQ page 13→15 Qs.
- ⚠️ Process scar: a sloppy nested `open(p,'w')` truncated site.ts mid-session —
  restored from git HEAD + re-applied edits. Scripted config toggles now assert
  substitution + size and never write the file they're reading.

Verify: build 151 pages · typecheck 0 errors · i18n:check green · dist greps confirm
q14/q15 (EN+DE), fees line, 30-day stat, single badge instance, zero pseudo-badges.

### Deployment state (2026-07-06)
- **Live:** https://persistentcartapp.netlify.app — Netlify project `persistentcartapp`
  (team dgangopa), continuous deploys from `main` of
  github.com/gangopadhyayd/cffpc_landing_page (netlify.toml auto-config).
- **GA4:** account "Persistent Cart" → property "persistentcartapp.com" → web stream
  `G-B0XL737D3K`; set as `PUBLIC_GA4_MEASUREMENT_ID` in Netlify env (consent-gated loader
  already in `Analytics.astro`). GDPR Data Processing Terms accepted.
- **Custom domain:** persistentcartapp.com + www added in Netlify (pending DNS). The domain's
  DNS lives on **Cloudflare** (colin/magdalena.ns.cloudflare.com), which currently 302-redirects
  the apex to the App Store listing via a redirect rule, and carries Namecheap email-forwarding
  MX records (`eforward*.registrar-servers.com`) that must be preserved. Remaining manual step:
  in Cloudflare — delete the redirect rule, set apex CNAME(flattened) → apex-loadbalancer.netlify.com
  and www CNAME → persistentcartapp.netlify.app, both DNS-only (grey cloud); keep MX/TXT.
  SSL auto-provisions once DNS points; then GSC/Bing verification + sitemap submission.

---

## Cycle 7 — dashboard "Cart Transfer Value" snapshot on /how-it-works (2026-07-07)

Backlog #4 (owner's top priority, fully specified in next-iteration-brief) shipped.

- **New section on /how-it-works**, after the five mechanism sections, before the
  FAQ/CTA: eyebrow "From the dashboard" → question-style H2 ("What does the dashboard
  show you?") → 2-paragraph intro → framed snapshot → honesty figcaption.
- **Faithful DOM recreation, STATIC by design** (owner directive): zero JS, no
  count-ups, no IntersectionObserver, no 7d/30d toggle (in-frame "Last 30 days" text
  carries the window), no "live/real-time" framing, no Beta chip. The figcaption
  reads "One store's last 30 days — snapshot captured July 2026."
- **Real figures, anonymized** (owner-approved 2026-07-07): 8,069 transfers ·
  1,974 orders · $452,836 revenue — one unnamed store's actual last 30 days. The
  store is never named in code, copy, commits, or docs. Figures + module labels are
  part of the recreated (English) product UI, so they keep US formatting in all
  locales. No preview URL or token was needed or used.
- **Polaris-like styling** inside a browser-chrome frame: mono site-side title bar
  ("Persistent Cart · Dashboard"), admin-gray #f1f1f1 canvas, three white stat cards
  (#e3e3e3 border, 12px radius, Inter/system stack, #303030/#616161 text) — hex is
  deliberately the recreated product's palette, not site tokens. Cards go 3-up ≥640px,
  stack below.
- **Structure:** new `DashboardSnapshot.astro` + `HowItWorksPage.astro` (thin wrapper:
  ContentPage + slotted snapshot — ContentPage's existing `<slot />` sits exactly
  "after the mechanism, before the FAQ/CTA"). how-it-works moved from CONTENT_CONFIG
  to the router's CUSTOM map; its sectionCount/faqCount/related now live in the
  wrapper.
- **i18n: 13 new keys ×15** (`page.how-it-works.dash.*`). 4 marketing keys (eyebrow/
  h/b/caption) hand-authored per locale register + terminology (de en-dash + „…“,
  fr « » + espace before ?, ja のか？ headings, es tú / de Sie, per-locale dashboard
  word: tableau de bord/panel/pulpit/kojelauta/instrumentpanel/仪表盘/대시보드 etc.).
  9 `dash.ui.*` keys are the app's own UI copy — **EN verbatim in every locale by
  owner directive; native reviewers must NOT translate them** (they exist ×15 only so
  i18n:check stays green).

Verify: typecheck 0 errors · i18n:check green · build 151 pages · preview screenshots
desktop 1440 + true-390 iframe method + ja spot-check (module intact, localized copy
around EN-verbatim UI) · dist grep: figures present EN+DE, 1 script tag = GA4 loader
only (component contributes none).

### Cycle 7 addendum — owner-feedback fixes (same day)

Owner flagged three things on the live homepage; root causes + fixes:

1. **Swash/descender f STILL live despite the cycle-6 opsz pin.** Root cause: the
   Fontsource default import (`@fontsource-variable/fraunces`) ships the **wght-only**
   instance — no opsz/SOFT/WONK axes — so `font-variation-settings: "opsz" 20, "SOFT" 0,
   "WONK" 0` was a silent no-op, and the instance bakes WONK at its default of **1**
   (the wonky descender f). Fix: import `@fontsource-variable/fraunces/full.css`
   (all axes; latin woff2 37→121 KB, subset-gated) and move the pin from h1–h4 to
   `html` so ledes/metric values (also Fraunces) are pinned too; h1–h4 rule kept.
   Verified by pixel comparison: f now terminates at the baseline. ⚠️ Lesson: a
   font-variation pin proves nothing unless the font FILE carries the axis — check
   `fvar` (fontTools) not just the CSS.
2. **"The animation moves the text around":** the live-hero wind-back collapsed the
   4th cart row (`max-height:0` + negative margin), reflowing the subtotal line in
   both carts every 8s beat. Fix: the row's slot stays reserved; only opacity/
   transform animate. Choreography, resting markup, reduced-motion behavior unchanged.
3. **Under-signaled "this is a Shopify app":** hero rating line said "4.9★ rating on
   the App Store" (reads as Apple). Re-authored `hero.trust.rating` ×15 to name the
   **Shopify** App Store — which also fixed a real cycle-6 bug: 9 locales
   (de/fr/it/nl/zh-CN/ko/da/pl/nb) embedded "4.9★" in the string while Hero.astro
   prepends the number, so those homepages rendered "4.9★ 4.9★ im App Store".
   Bigger trust-hierarchy moves (badge prominence, official app-store badge near the
   CTA) parked as owner decisions — see the report in owner-inputs.

### Cycle 7 addendum 2 — full Shopify branding round (owner-directed, same day)

Owner picked "real Shopify logos and branding" and issued a standing directive:
**brand/kit usage guidelines are soft preferences — never hard-block on one without
asking** (e.g. the BFS one-instance-per-page kit rule is released; honesty rules stay
absolute). Composition shipped (research recs #6/#9/#10; competitor patterns: Order
Editing glyph chip, ParcelWILL "Available for", TrueProfit/Loox footer badges):

- **Hero:** rating link is now a listing chip — official color bag glyph (18px) +
  "4.9★ rating on the Shopify App Store". Trust row deliberately stacked into two
  rows (chip no longer shares a line; a wrapped dot separator dangled).
- **TrustStrip:** new platform cluster — mono "AVAILABLE FOR" label over
  [official Shopify wordmark 25px | hairline | "Shopify Plus" bold text] — mirrors
  how Shopify itself renders Plus today (shopify.com/plus header = main logo, Plus
  as adjacent text; verified live — no distinct Plus lockup exists to fetch). BFS
  badge 32→40px.
- **Footer:** ecosystem block in the brand column — white Shopify wordmark (24px),
  "Available for Shopify and Shopify Plus." (localized), linked rating chip
  (reuses hero.trust.rating + proof.reviewRating), and a SECOND BFS badge (dark
  tone, 36px) — multiple instances now owner-approved. Sits above the existing
  not-affiliated trademark disclaimer, which covers the marks.
- **Assets:** official SVGs copied design-assets/shopify-plus/ → public/badges/
  (shopify-glyph.svg color, shopify-logo.svg mono-black, shopify-logo-white.svg).
  Unaltered files; no constructed lockups.
- **i18n:** +2 keys ×15 hand-authored (trustbar.availableFor, footer.availablePlatforms);
  brand names untranslated; fi uses "Toimii Shopifyssa ja Shopify Plusissa".

Verify: typecheck 0 errors · i18n:check green · 151 pages · screenshots desktop +
true-390 iframe (hero chip, strip cluster, footer block) + de spot-check.

### Cycle 7 addendum 3 — fold fix + BFS badge tops the hero (owner note, same day)

Owner screenshot (~2000px viewport) showed a dead band above the H1: `.hero-grid`
was `align-items: center`, so the shorter copy column floated against the tall
plate. Fixed with `align-items: start` + the official BFS badge (34px, light) as
the hero eyebrow above the H1 — Shopify banner at the top of the fold (owner ask;
TinySEO precedent) and the former gap now carries content. Third BFS instance on
the homepage (hero/strip/footer) — fine per the owner's soft-guidelines directive.
Verified at 2000/1440/true-390.

### Cycle 7 addendum 4 — display font → Source Serif 4 · stat reframed ~$1M/day

- **Fraunces is OUT entirely (owner: "I really don't like this font"), replaced by
  Source Serif 4** — picked from a six-candidate sheet (Fraunces current/opsz-9,
  SS4, Lora, Newsreader, PT Serif) rendered as the real H1. Self-hosted woff2
  (latin + latin-ext, opsz+wght variable) in public/fonts/ with @font-face in
  global.css — deliberately NOT via npm to avoid touching package.json, which the
  parallel App-Store-assets session holds dirty. Fontsource import removed; all
  Fraunces axis pins removed; headings wght 460→560 (SS4 runs lighter). ⚠️ U+2248
  (≈) is outside both SS4 subsets — the approx marker site-wide is ASCII "~".
- **Impact stat reframed to daily (owner pick: "approx framing") after the required
  $26.0M/30d internal-measurement flag was surfaced in the decision question.**
  Hero: "~$1M a day in orders from synced carts — $30M+ in the last 30 days"
  (trust.impact now takes {daily}+{amount}). Metric band: value ~$1M (new config
  proof.syncedCartRevenueDaily) · label "...every day" · note "{amount} in the last
  30 days, across stores using the app" — note interpolates so the figure lives in
  config, not in 15 strings. All three keys hand re-authored ×15.

Verify: i18n:check green · typecheck 0 errors · 151 pages · screenshots: hero,
how-it-works lede/headings, navy metric band (reads "~$1M / every day / $30M+ 30d").

**Same-day owner iteration — FINAL stat form (supersedes ~$1M/day above):** back to
**$30M+ as the headline value with the 30-day window PROMINENT**: hero trust row is
now a stat lockup (`.impact-value` at display size + "in orders from synced carts —
**in the last 30 days**" bolded), metric band label carries the window ("In orders
from synced carts — last 30 days"), note is just "Across stores using the app".
`trust.impact` split into `trust.impact.qualifier` + `trust.impact.window` (old key
deleted ×15); `syncedCartRevenueDaily` removed from config. Re-authored ×15.

## Cycle 8 — owner feedback round (2026-07-08): clarity, mechanism, SEO expansion

Plan: docs/improvement-plan-2026-07-08.md (general classes + specifics). One deploy.

- **Stat final wording** ×15: value now localized key `trust.impact.value` (EN
  "$30 Million+", others keep numeral form); reading order value → **window bold**
  → "order value from carts auto-transferred across devices"; metric band label
  leads with the window.
- **Figure mechanism**: both laptops now equal (live-variant screen min-height
  12.1rem — synced content had made one taller, "oddly shaped"); new evergreen
  mono note under the synced laptop "RESTORED AT SIGN-IN — AUTOMATIC"
  (`demo.cart.restoredNote` ×15); caption extended: "Restored automatically at
  sign-in: no popups, no emails."
- **Clarity rewrites** ×15: benefits heading → "One-click setup — then it works
  silently in the background." (owner's model line); benefit 3 → "No interruptions
  for shoppers"; eyebrow → "What you get"; how-it-works s4 meta-sentence
  ("worth doing this deliberately…") → direct activation note.
- **Worth-it FAQ answer** (home q7 + faq q13, ×15): dashboard-measured order value
  + owner's "1,000×+ the subscription" framing; plan prices and the 10-sync
  free-tier mechanics removed (volatile details).
- **SEO/AI expansion**: V1_DEFERRED shrunk — **cross-device, vs-recovery, b2b,
  uc-wholesale, compare-email re-enabled** (already built ×15; build 151→226
  pages). vs-recovery joins the top nav ("Vs. email recovery", `nav.vsEmail` ×15);
  footer learn column + related links restored (missing keys filter safely).
  **Two new FAQs ×15**: cart-as-wishlist; phone-ads → desktop checkout (FAQ page
  15→17, home schema untouched).
- Diagrams-vs-text evaluation in the plan doc; how-it-works step-strip is the
  next build item (parked for the next deploy window).

### Cycle 8 addendum — geo-gated analytics consent (owner decision 2026-07-08)

GA4 consent is now geo-gated: visitors in consent-required regions (EU/EEA/UK/CH —
client-side timezone heuristic `Europe/*` + EU Atlantic zones, deliberate superset,
fail-safe to needs-consent) keep the banner + GA-after-Accept; everyone else gets
GA automatically with NO banner. A stored Decline wins everywhere. consent.text
re-authored ×15 (the old "cookieless analytics by default" claim was inaccurate —
Plausible was never wired). Verified both paths via TZ-override headless Chrome:
US = no banner + gtag injected; Berlin = banner + no gtag until Accept.
⚠️ NOT YET DEPLOYED: Netlify account froze 2026-07-08 ("Skipped due to account
credit usage exceeded", Free plan, created 07-06, manual CLI deploys also 403) —
cycles 8+this ship on the first build after the owner upgrades or credits reset.

### Cycle 8 part 2 — figure mechanism v2, co-equal window, real reviews, accuracy sweep

- **Stat**: value + window now co-equal display size on one line ("$30 Million+
  in the last 30 days", window in accent-ink), qualifier beneath ("order value
  from carts auto-transferred across devices"). Kept "in the last 30 days"
  wording — a measured recent window; "every 30 days" would claim an unverified
  recurring rate.
- **Figure v2** (borrowed from the app-store hero export): account node (circled
  person) ON the kept path + evergreen "SAVED TO THE ACCOUNT" label; "✓ Saved to
  your account" chip on the phone; "Signed in" row in the synced laptop; cart
  internals compressed (rows/gaps/screen heights) so both laptops match and the
  figure is shorter. 3 new keys ×15.
- **Real review cards** (verbatim from the live listing, extracted + verified
  2026-07-08): SupplementSource.ca (Canada, 2+ yrs), Public Goods (US, ~4 yrs),
  Nest (Canada, 5+ yrs) under the featured GMD testimonial. Quotes translated
  ×14 per the existing testimonial precedent; store names verbatim.
- **Accuracy sweep fixes ×15**: testimonial CTA names the SHOPIFY App Store;
  /contact lede no longer promises "free audit" (page is deferred);
  staff-attribution de-personified on cart-disappears + cornerstone ("Shopify's
  own community answers say…" / "community answers, which note…") — the
  paraphrases read as official staff statements. Pricing "matches your Shopify
  subscription" left as-is (accurate — the hidden Advanced tier exists in config
  at $24.99; showing its card remains an owner decision).

### Cycle 8 part 3 — horizontal fork (owner: laptops unequal again + figure too tall)

- **Laptops now provably equal**: fixed `height: 10.6rem` on BOTH live-variant
  screens (min-height let the synced side drift every time content changed —
  twice now). Equality asserted programmatically (playwright measure: 170/170).
- **Figure de-heightened 891→~704px** and rebalanced against the copy column:
  demo cart slimmed to 3 resting rows (socks item removed from DEMO_ITEMS;
  subtotal derives → $242 rest / $224 pre), phone aspect tightened, paths block
  shortened, plate/caption spacing compressed.
- **Desktop ≥980px: HORIZONTAL composition** (the app-store export's layout):
  grid phone | switch | stacked outcomes; new horizontal paths SVG (vertical one
  keeps the stacked mobile layout); dot animation picks the visible path at
  runtime; phone-side leader annotation hidden in horizontal mode.
- **Reviews link/count removed** (owner: 47 reads low): testimonial renders
  without CTA; no "read all reviews" link or review-count mention anywhere.

---

## v1.0 MILESTONE — first owner-accepted live version (2026-07-08, tag v1.0.0)

Cycles 1–8 complete. Shipped across the arc: lean scope + leak-first message → the
fork hero (now horizontal on desktop, account-node mechanism, measured-equal
laptops) → Source Serif 4 → full Shopify branding (badge/glyph/wordmark/platform
row) → benchmark-driven fold (248→~127 words, proof row on top) → "$30 Million+ /
in the last 30 days" co-equal stat → dashboard Cart Transfer Value snapshot on
/how-it-works → verified 8-lens audit (P1s + a11y AA fixed) → geo-gated analytics
consent → 5 SEO pages re-enabled + 2 new FAQs → 3 verbatim review cards (no count,
no reviews link) → accuracy sweep. Netlify upgraded to Pro after the free-tier
credit freeze. App-store listing assets committed (not yet uploaded).
Forward state + backlog: docs/next-iteration-brief.md (rewritten at this tag).

---

## Post-v1.0 hotfix + QA hardening (2026-07-09)

Owner spotted raw i18n keys in the live footer (`footer.link.cross-device` etc.).
Root cause: the 2026-07-08 SEO round gave 5 re-enabled pages footer slots, but 4
of the dynamically-constructed `footer.link.*` keys existed in no catalog — not
even en — so `t()`'s key-fallback rendered on every page ×15 locales, and no
check looked at built output. Fixed: 60 strings (4 keys ×15 locales, terminology
mirrored from each locale's reviewed page titles). A 900-load browser sweep also
caught `/da/pricing` overflowing at 768px (plain-`1fr` grid + Danish compound
"kurvsynkroniseringer") — fixed with `minmax(0,1fr)` + hyphenation.

New standing QA (docs/qa-process.md): `qa-gate.mjs` post-build scanner (leaked
keys in rendered copy, case-sensitive internal link/asset resolution, sitemap,
i18n drift) now runs inside `npm run build`, so Netlify CI blocks regressing
deploys; `qa-browse.mjs` sweeps every page ×4 viewports in headless Chromium
(console errors, overflow, broken imgs, h1/title) locally via `npm run qa` and
against prod via `--base`.

## Pricing: Advanced folded into "Advanced & Plus" @ $99 (2026-07-15)

The App Store caps public plans at 4 (verified: the Partner pricing page shows
"Public plans (4/4)", Add disabled), so Shopify Advanced stores had no visible
plan anywhere — and the app's billing currently does nothing for them (no
`shopify-advanced` handle exists; owner is in a testing phase and not charging
stores upfront). Owner decision (temporary fix): reposition the top card as
**"Advanced & Plus" at $99/mo** (was "Shopify Plus" $99.99).

Listing side (each save verified by fresh reload): plan-registry `shopify-plus`
monthly charge $99.99 → $99 (handle unchanged — app code keeps referencing it);
EN pricing card display name → "Advanced & Plus" (the display-name field caps at
18 chars, killing "Shopify Advanced & Plus" at 23) + first feature line "For
Shopify Advanced & Plus stores" (34/40); display names updated on all 10
localized listings (EN verbatim per glossary). Translated plus feature lines
existed only on es/fr/ja/ko/pt-BR/zh-CN — updated in each locale's own house
style (ko/zh use their established "plan or higher" pattern: 어드밴스드 요금제
이상 / 高级套餐及以上, which covers Advanced+Plus exactly). da/de/nl/sv listings
carry no feature lines at all. Editing method: native-setter + input/change on
the React fields, Save via the contextual bar (JS `button.click()` works here,
unlike the search-terms tag component).

Site side: `pricingTiers` plus tier → 'Advanced & Plus' / '$99' (the commented
`advanced` tier stays as the revert path); `pricing.tier.plus.note` re-authored
×15 mirroring each locale's basic-note pattern; deferred `plus.json` +
`summary.json` got the mechanical $99.99→$99 swap ×15 (a full Advanced-aware
re-read is owed if those pages ship); proof re-verified 4.9★ / 51 reviews
(2026-07-15).

⚠️ Open app-side dependency (owner): map Advanced-tier shops → `shopify-plus`
and charge $99.00, so the display matches billing once charging starts.

---

## GSC indexing alert → hreflang gated on indexability (2026-07-20)

Search Console emailed (2026-07-18) two new "pages not indexed" reasons. Diagnosed
against live site + source; one real defect found and fixed.

- **"Excluded by 'noindex' tag"** = the 14 unreviewed machine locales (~210 pages),
  noindex **by design** — but every page's head advertised all 15 locales via
  `<link rel="alternate" hreflang>` ("wired even for unreviewed"), inviting Google
  to crawl them. Google drops noindex targets from hreflang clusters anyway
  (zero upside), so the wiring only burned crawl budget and generated the alert.
- **"Page with redirect"** = intentional 301s (www→apex, http→https, trailing
  slash, `/sitemap.xml`→`/sitemap-index.xml`, `/privacy.html`→`/privacy`).
  Correct as-is; no action.

**Change:** `alternates()` (`src/i18n/routing.ts`) now filters to `isIndexable`
locales + `x-default`; SEOHead comment + `docs/localization.md` updated to match.
Nothing else touched: sitemap was already gated, language switcher still lists all
15 for humans (anchor `hreflang` attrs are not an indexing signal), and a locale
still joins the graph site-wide the moment `reviewed: true` flips.

**Verify:** `astro check` 0 errors; build + qa-gate PASS (226 pages, i18n drift
clean). dist spot-check: EN pages emit exactly `en` + `x-default` and stay
`index, follow`; `/de` stays `noindex, follow` with no locale hreflang in head.
Expectation in GSC: "Excluded by 'noindex'" decays as Google recrawls (residual
entries via switcher-anchor discovery are normal and harmless); "Page with
redirect" persists and is fine.

---

## 14-locale release review -> all locales indexable (2026-07-20)

Owner has no native speakers; directed an agent-based release review instead.
Method: 3 full MQM reviews (es/fr/zh-CN — the deep pass; 169-311 strings each)
+ deterministic guard scripts (dash.ui reset to EN, trust.impact revert, rating
format, key-parity/JSON validation) + 11 budget "checklist" reviews (sonnet)
for the rest, driven by the systematic-defect list the deep pass surfaced.

Systematic MT defects found and fixed across locales: dropped footer legal
disclaimer; dropped partner terms (30%/12mo); invented "live real-time update"
demo claim; "industry benchmarks" overclaim (EN says illustrative defaults);
lost "original since 2016" seniority claim; privacy s7.b missing the three
Shopify webhook types (ko/da/fi/nb/nl); compare-email "different buyer"
misread as shopper (pt-BR/nb/fr/es/zh); metas over SERP budgets (rewritten,
query-front-loaded, CJK budgets ~half). Registers enforced: de=du, es=tu,
it=tu, pt-BR=voce, nl=je, fr=vous, ja=desu/masu, ko=hamnida, zh=nin,
sv/da/nb=du, pl=ty, fi=sinuttelu.

Ship: reviewed:true x14 in locales.ts -> sitemap 15 -> 225 URLs, hreflang
cluster 15+x-default on every page, review banners gone. ko got
word-break:keep-all in global.css (heading mid-word wraps — the parked CJK
P2). QA: i18n:check + astro check + build/qa-gate PASS; qa:browser 900
page-loads PASS; owner-side visual inspection of all 14 locale homepages.
Deployed via npm run deploy; live-verified (/de /ja index,follow; 225 sitemap).

Known follow-ups: deferred de pages still use Sie (fix at un-defer); nl
app-embed terminology split across deferred files; fi long titles on 9
low-traffic pages (bundle with EN SERP-trim owner queue #5); EN-source issues
reported by multiple reviewers (pricing tier.advanced/plus note overlap,
faq "every plan starts with a free trial" vs paid-only trial wording,
2012 Google/Ipsos stat, en home.compare.col.feature="" tripping validators,
EN metas over budget — owner queue). Review quotes on locale pages are
translations of the verbatim EN quotes — owner may prefer verbatim-EN.

Ops scar: first attempt ran 14 full reviews in parallel on the session model
(fable) — ~200k+ tokens each, hit the session cap mid-run. Recovery pattern
(deterministic guards + checklist fan-out on sonnet) cost ~45% of the failed
attempt and finished the job. Standing rule: set model per agent; warn owner
before >200k-token fan-outs.

## Pricing revert: charge-on-install returns, Free Starter retired (2026-07-22)

Owner decision — the no-upfront-charging testing phase is over. The app goes
back to requiring the application charge at install (approve to launch;
`trial_days: 30` still gives every plan a 30-day free trial before billing),
and the plan grid goes back to the pre-testing four paid tiers:
Basic **$4.99** · Grow **$8.99** · Advanced **$24.99** · **Shopify Plus $99.99**.
Retiring Free Starter frees the 4th public-plan slot, which is what lets the
dedicated Advanced plan return within the listing's 4-plan cap — this
supersedes the 2026-07-15 "Advanced & Plus $99" fold-in AND its owed app-side
mapping (Advanced shops now get their own plan, not `shopify-plus`).

**Safekeeping**: full pre-revert state tagged `pre-charge-revert-2026-07-22`
(pushed to origin; restore any file via
`git checkout pre-charge-revert-2026-07-22 -- <path>`).

**Done this entry (EN only — locales ×14 queued for after owner check):**
- `site.ts`: free tier removed, `advanced` restored, plus → "Shopify Plus"
  $99.99; `hasFreePlan: false`; SITE_UPDATED bump.
- `PricingTable` + `HomePage` chips: dead Free/"Try it" branches removed
  (would fail `astro check` against the new literal union).
- `schema.ts`: SoftwareApplication offer was `price: '0'` → `AggregateOffer`
  $4.99–$99.99 ×4, derived from `pricingTiers` so it can't drift.
- `llms.txt`: pricing line now "$4.99–$99.99, 30-day free trial".
- EN strings: en.json (CTAs "start free" → "free for 30 days" / header
  "Start free trial", pricing intro/trust lines), pricing.json (lede/desc,
  plus-tier note → "For Shopify Plus stores", new s2 "Approve on install, pay
  after 30 days", FAQ "free plan?" → "Do I pay the moment I install?"),
  faq.json q9, and deferred pages plus/summary/calculator/affiliates.
- Dormant keys kept for i18n parity (prune ×15 in the locale pass):
  `pricing.tier.free.note`, `pricing.chip.tryIt`, `pricing.chip.free`.

**Sequencing (honesty gate)**: the live listing still shows the 2026-07-15
state. Do NOT `npm run deploy` until (1) owner re-enables the install charge +
Advanced mapping in the app, (2) the Partner Dashboard listing is flipped
(remove Free Starter, add Advanced $24.99, top card → "Shopify Plus" $99.99,
en + 10 locales), and (3) the site locale pass lands. Also re-check
`design-assets/app-store` frame copy for free-plan claims before any re-upload.

## App Store listing flip: EN live with charge-on-install pricing (2026-07-22)

Partner Dashboard work (browser session; org Customer First focus → Persistent
Cart → Distribution → App Store listing). Plan registry ("Manual pricing",
Public plans 4/4 → edits update the live listing automatically, no re-review):

1. **Deleted `starter` (Free)** — dialog confirmed existing subscribers stay
   subscribed; freed the 4th public-plan slot.
2. **`shopify-plus`: $99 → $99.99** (30-day trial unchanged).
3. **Created `shopify-advanced`** — Monthly recurring, **$24.99**, 30-day
   trial. Handle chosen to match the handle the app code already references
   (iteration-log 2026-07-15). New-plan banner: descriptions required per
   language before the plan displays on that language's listing.
4. **EN listing cards**: advanced display name "Shopify Advanced" + the 8
   house-style feature lines ("For stores on Shopify Advanced plan" + 7
   shared); plus card display name "Advanced & Plus" → "Shopify Plus" and
   feature 1 → "For Shopify Plus stores". Text set via native-setter + input/
   change events, saved via the contextual Save bar (same mechanics as
   [[partner-editor-react-fields]] — worked again).

**Verified on the public listing (curl, fresh fetch):** Basic $4.99 · Grow
$8.99 · Advanced $24.99 · Plus $99.99, "30-day free trial" ×4, zero hits for
"Free Starter" / "Advanced &amp; Plus"; header meta now "Free trial
available". The two "Free plan available" strings on the page belong to
similar-app recommendation cards (keep-on-hold, nlde-save-for-later), not us.

**Known mid-stage state (10 localized listings)**: registry price is global,
so they already show **$99.99 with the old localized "Advanced & Plus" display
name**, and the new Advanced plan is hidden there until each language gets a
plan description. Name/price mismatch mildly overprices Advanced stores → do
the localized-listing pass promptly (display names + feature lines per
language; ko transliterates, see 2026-07-15 entry for per-locale rules).

Still owed (owner, app side): enforce the install-time charge, map Advanced
shops → `shopify-advanced` @ $24.99, retire the free-tier code path.

## Multilingual completion: site x14 deployed + 10 localized listings flipped (2026-07-22)

Executed per owner instruction with NO session-model (fable) tokens on the bulk
work: 14 parallel sonnet agents (one per site locale, shared brief) + 1 sonnet
browser agent (localized listings), orchestration + deterministic verification
only in the main session.

**Site (commit dd25f2e, 100 files)**: all 14 locales mirror the EN revert —
CTAs, "Approve on install, pay after 30 days" section, reworked FAQs, pre-fold
$99.99 prose restored verbatim from 5b69919^ where EN was unchanged, Free
Starter gone; dormant free-tier keys pruned x15. Notable per-locale calls in
the commit message. Verified: 378-instance key matrix vs HEAD all changed;
zero "Free Starter"/bare-$99 in catalogs and dist; build 226 pages + qa-gate
PASS. **Deployed via npm run deploy** (one credit; IndexNow 225 URLs, HTTP
200). Live-verified on /pricing x en/de/ja/fr/pl: $24.99 + $99.99 present,
Free Starter absent.

**Listings (10 languages, browser agent)**: per-language Advanced display
name added (mostly "Shopify Advanced"; ko "Shopify 어드밴스드" — fits 18) and
plus card renamed to the language's "Shopify Plus" form; feature lines fixed
where they exist. **Correction to the 2026-07-15 note**: localized cards
carry exactly ONE feature line each (the "8" in the editor is capacity, not
content) — only EN has 8. zh-CN plus line rebuilt as Plus-only (适用于"Plus
套餐"及以上商店的无限制使用); ko advanced line reuses the old "요금제 이상"
line verbatim; ko Basic card has a pre-existing leading-space typo (left
alone). Public-listing curls x10 (zh-CN da nl fr de ja ko pt-BR es sv): all
four prices present, old names (incl. 어드밴스드 & 플러스) zero, free-plan
mentions zero.

**State: the revert is COMPLETE on site (15 locales, live) and App Store
listing (11 languages, live).** Sole remaining item (owner, app code):
enforce the install-time charge, map Advanced shops → `shopify-advanced`
@ $24.99, retire the free-tier path. Until that lands, the app itself is the
only piece not matching the published pricing.
