# Build Log — persistentCartApp.com

Running state, decisions, and handoff notes. Newest entries at top of each section.
This file is the source of continuity — if the orchestrator's context fills, a fresh
orchestrator continues from here + the repo.

## Project
Marketing site for the Shopify app **Persistent Cart — Sync Devices** (dev: Customer First focus, SF).
Goals, in priority order: (1) attract paid partners/affiliates, (2) drive merchant installs, (3) build trust.
Stack target: Astro + Tailwind + MDX + TypeScript + Astro i18n. 15 locales (en canonical).

## Status board
- [x] Phase 0 — Environment survey (Node 24, npm 11.9, git 2.51; repo init'd; 4 research dirs confirmed)
- [x] Phase 1 — Research (8 sub-agents complete; synthesized → docs/research-notes.md)
- [x] Phase 2 — Strategy doc (docs/site-strategy.md) ✔ + direction note posted
- [x] Phase 3 — Design system + tooling scaffold (tokens in global.css; i18n catalog+loader; registry-driven
      catch-all router; Base/SEOHead/Header/Footer/LanguageSwitcher/Logo/Hero/CartCard built; **build is GREEN —
      16 pages across 15 locales generate, hreflang/noindex/canonical/sitemap all verified**)
- [x] Phase 4 — Build: ALL 25 page types built (home + pricing + free-audit + partners + affiliates +
      calculator + faq + cornerstone/how-it-works/cross-device/cart-disappears/big-retailers/vs-recovery/
      b2b/plus/3 use-cases/compare-email/resources/summary/changelog/contact/support/privacy). 376 pages ×
      15 locales compile. Calculator + 3 lead forms (Netlify, honeypot+time-trap) + consent + analytics built.
      English content: Tier-1 by me, Tier-2/3 by 4 content sub-agents. Every page has exactly one <h1>.
- [x] Phase 5 — SEO/GEO/schema: JSON-LD graph (Org/WebSite/SoftwareApplication/FAQ/Breadcrumb, NO self-review),
      hreflang+x-default+canonical, sitemap (excludes noindex locales), robots.txt (AI bots allowed), llms.txt
      endpoint, OG image (generated PNG), netlify.toml redirects+headers, i18n drift scripts.
- [x] Phase 5b — Localization: 14-locale translation workflow COMPLETE (0 failures). All 15 locales × 25 catalog
      files valid; drift check passes. German + Japanese spot-verified in-browser (review banner, geräteübergreifend,
      do-not-translate terms + tokens preserved). 52 review-fix keys scaffolded EN-placeholder (pending next sync).
- [x] Phase 6 — Adversarial review: fact/claims checker + conversion critic ran (English); findings integrated
      (hero double-star fixed, partner H1/earnings, "Start free" CTAs, ROI FAQ, GDPR wording, Advanced tier hidden,
      banned "seamless" fixed, calc hedging). Design verified via screenshots (premium). Perf: 0 external JS, no
      on-page raster images → CWV targets very achievable. Localization reviewer running.
- [x] Phase 7 — Legal/claims pass: docs/legal-review.md written (1 high, 6 medium, 13 low). HIGH (partner
      "firm 30%" offer) + key mediums (footer disclaimer scope, eBay over-claim, GDPR wording) FIXED in copy;
      rest are owner pre-publish actions. Localization QA (de B+/ja A−) → docs/native-review-punchlist.md;
      goal-#1 partner/affiliate/pricing files re-translated across 14 locales (German fixes verified).
- [x] Phase 8 — Final report delivered; owner-inputs-needed.md, README, .env.example complete.

## FINAL STATE (2026-06-30)
- 376 pages (25 page types × 15 locales + 404). typecheck 0 errors, build green, i18n drift green.
- English launch-quality + indexed; 14 machine locales noindex pending native review (punch-list documented).
- 0 external JS bundles (inlined islands), no on-page raster images → strong CWV outlook.
- All review findings integrated; owner pre-publish actions in owner-inputs-needed.md + legal-review.md.

## Docs status
Written: build-log, research-notes, site-strategy, content-authoring-guide, localization, tooling-and-accounts,
analytics, partners, app-store-optimization, asset-animation-research, future-roadmap, owner-inputs-needed,
README, .env.example. TODO: legal-review.md (post-build pass), final report.

## Key facts locked (see research-notes.md)
- Rating **4.8 / 45 reviews** (verified 2026-06-30, supersedes brief's 4.9/46).
- **NEW Free Starter plan** (≤10 syncs) → "start free". Pricing NOT feature-tiered (priced to Shopify plan).
- Parity proof: **Walmart + Amazon** first-party quotes (eBay soft, Target partial). Shopify cart = 2-week browser cookie.
- Real internal proof: ~1,486 active / 5,445 all-time stores / 130–299 Plus / ~$26M-30d sync-tied GMV — INTERNAL, owner sign-off.
- GDPR handlers = ack-stubs (no auto-erasure claims). Install needs Theme-Editor toggle. Draft-orders = roadmap.
- Tooling: Netlify + FirstPromoter(30%/12mo/90d) + Resend + Plausible + Klaro. Vanilla-TS islands (no React).
- Architecture: registry-driven catch-all router emits page×15 locales from one shared tree.

## Decisions log
- 2026-06-30: Repo at /Users/debgangopadhyay/dev/cffpc_landing_page, git initialized, .gitignore added.
- 2026-06-30: Research delegated to 8 sub-agents (R1 product truth, R2 messaging, R3 competitors/ASO,
  R4 growth/SEO, R5 live-listing+parity verification, R6 keywords/GEO, R7 partner/tooling, R8 design refs).
  Agents instructed to ignore all secret/credential files and return concise structured briefs.

## Open questions / owner inputs
- Tracked in docs/owner-inputs-needed.md (created in Phase 2+).

## Next action
- Collect 8 research briefs → synthesize into docs/research-notes.md → write docs/site-strategy.md.
