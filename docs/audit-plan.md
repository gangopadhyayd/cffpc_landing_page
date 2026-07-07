# Site Audit Plan — persistentcartapp.com (owner-requested 2026-07-07)

Why now: the wide-viewport fold gap, the doubled "4.9★ 4.9★" in 9 locales, and the
never-applied font pin all shipped past per-change verification. Each was caught by the
owner or by accident, not by process. Per-change screenshots verify the component you
just touched; nothing currently verifies the whole visitor experience. This plan does.

## Scope

- **Surface:** live production (https://persistentcartapp.com), not preview. 10 built
  page types ×15 locales = 151 pages + 404 + llms.txt + sitemap + OG images.
- **Depth:** EN = every page, every lens. Locales = de, ja, fr, es fully + a 10-point
  spot-check on the other 10 (fold, nav, footer, dashboard section, FAQ accordion).
- **Viewports:** 2560 and 2000 (wide — today's gap only showed here), 1440, 768
  (tablet/mid), true-390 via the iframe method. Never trust a clamped headless window.

## Lenses (one sub-agent each, run in parallel)

1. **Visual/layout QA** — full-page screenshots of every page×viewport; hunt dead
   bands, overflow, orphaned separators, wrap breaks, blend-mode artifacts in the logo
   strip, device-frame fidelity. Output: annotated crops.
2. **Copy/marketing/UX** — claims vs research-notes honesty rules (exact approved
   numbers only), message hierarchy per page, CTA paths and dead ends, trust-signal
   placement/duplication, cross-link graph (orphan pages, missing related-links).
3. **Technical SEO** — canonical + hreflang ×15 reciprocity, structured data
   (validator on every schema type we emit), sitemap-index vs actual routes, robots +
   noindex on machine locales, OG/Twitter images (KNOWN STALE: OG still shows the old
   3-item fork + old headline — refresh during this round), title/desc lengths,
   Lighthouse SEO pass on key pages.
4. **Performance/CWV** — Lighthouse on home, how-it-works, pricing, faq at mobile +
   desktop: LCP element (plate SVG? fonts?), CLS (hero animation reserve fix should
   hold it at 0 — verify), font payload after the full-axes Fraunces swap (121KB —
   consider subsetting if LCP suffers), image formats/lazy-loading, render-blocking.
5. **Functional QA** — every internal link (build a crawler over dist, then spot-check
   live), every external link (App Store UTM params per placement source), locale
   switcher round-trips, FAQ accordions, consent banner accept/decline → GA4 events
   actually firing (Network tab), llms.txt validity, 404 behavior.
6. **i18n quality** — per-locale render checks (long-word overflow in de/fi, CJK line
   breaks), no EN leakage in localized chrome, dash.ui.* keys still EN-verbatim (by
   design), privacy-policy EN-only exception intact, number/currency formats.
7. **Accessibility** — axe-core pass per page type, contrast (ink-faint on paper is
   borderline — measure), focus visibility/order, alt text on all marks/logos,
   prefers-reduced-motion behavior, heading hierarchy (h1→h2→h3 without skips).

## Method (4 phases)

- **Phase 0 — inventory (scripted, cheap):** crawl live sitemap-index, diff against
  routes.ts registry, emit the page×locale×viewport matrix as the work list.
- **Phase 1 — evidence capture (scripted):** screenshots + HTML + headers for the full
  matrix into a local evidence dir; Lighthouse JSON for the key pages. No judgment yet.
- **Phase 2 — lens passes (parallel sub-agents):** each lens reads the evidence and
  returns findings as {page, locale, viewport, severity, description, crop/repro}.
- **Phase 3 — adversarial verification:** every finding independently re-checked
  against the LIVE site by a skeptic pass before it enters the report; false positives
  die here. (Same discipline as the brief demands: verify before reporting.)
- **Phase 4 — report + fix:** single prioritized punch list — P0 broken/wrong,
  P1 conversion-hurting, P2 polish. Fix P0+P1 immediately (one commit per theme,
  verify-locally-then-live each), park P2s with effort notes. Owner reviews the report
  and the P2 queue.

## Ground rules

- Findings must carry evidence (crop or repro command) — no vibes.
- Honesty rules and owner-approved numbers are the reference for copy claims.
- Brand-kit guidelines are soft (owner directive 2026-07-07) — flag conflicts as
  notes, never as blockers.
- No fixes during evidence/lens phases — capture first, change after the report, so
  findings aren't invalidated mid-audit.
- Live-site checks are read-only; nothing deploys until Phase 4.

## Estimated shape

Phase 0–1 ≈ scripted, minutes. Phase 2–3 ≈ 7 lens agents + verification sweep — the
expensive part (multi-agent; needs owner green-light per session rules). Phase 4 =
normal iteration. First full run produces the baseline; reruns after future cycles
only re-capture + diff, which is much cheaper.
