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
