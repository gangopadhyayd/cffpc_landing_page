# Site Audit Report — persistentcartapp.com (2026-07-07)

Method: docs/audit-plan.md executed same day. Evidence = 92 full-page live captures
(10 EN pages × 5 viewports incl. 2560/2000; de/ja/fr/es key pages; 10 locale spot
checks; re-captured after the font and stat deploys) + rendered HTML + Lighthouse ×6
+ competitor fold benchmark. 8 lens agents in parallel; findings adversarially
verified. Caveat: the verification fan-out hit the session usage limit partway — 8
findings carry independent agent verification; the rest were verified inline by the
main session before any fix shipped (nothing was fixed on an unreproduced claim).
The a11y lens died on a server error mid-run and was re-run standalone.

## Baseline health (verified passes — no action needed)

- **Lighthouse: performance 98–100 mobile / 99–100 desktop** on home, how-it-works,
  pricing; TBT 0ms on all six runs; zero external requests.
- **Technical SEO fundamentals all pass:** exactly one H1 per page, self-referencing
  canonicals, correct noindex on the 14 machine locales, sitemap matches routes,
  robots.txt correct, JSON-LD parses everywhere, **no aggregateRating anywhere**
  (honesty rule holds).
- **The OG image is current** — the "stale OG" note in the brief no longer
  reproduces; headline and diagram match today's live hero.
- Fold word count now ≈127 (was 248; competitor median ≈85 — remaining bulk is the
  diagram's own labels, which is the intended graphics-over-prose direction).

## Fixed and live (commits f33e4fb, ac37f6a, earlier today)

**P1 — conversion/trust:**
1. Navy CTA bands had unreadable buttons on every homepage + pricing page (all 15
   locales, all viewports): ink-on-navy at 1.12:1. On-dark overrides added; verified
   live. (Two independent agent confirmations + pixel sampling.)
2. FAQ question "How do I know it's worth it for my store?" rendered raw English on
   6 localized homepages + FAQ pages (fr/it/zh-CN/ko/da/pl) — hand-translated.
3. Dead Amazon citation under the parity quote (US help node soft-404s; no Wayback
   snapshot exists). Re-pointed to the live amazon.sg copy of the same node — the
   only URL that verifiably serves the quoted sentence. ⚠️ Owner: if you can find a
   working amazon.com equivalent in a real browser (automation is bot-walled), swap
   it in src/data/proofBlocks.ts + HomePage.astro.

**P2 — mechanical batch (all live-verified):** privacy-policy "to to:" typo +
missing space before the support email; pricing plan-card CTAs pinned to one
baseline; header CTA pill no longer wraps (was 3 lines in fr at 390); footer 4-col
grid deferred to ≥1020px (word-per-line squeeze at tablet); tap-target padding
(llms.txt, footer rating); /sitemap.xml → 301 → sitemap-index.xml; Organization
schema logo; og:image width/height/alt + og:locale territory format; pricing
BreadcrumbList; hard-coded EN chips localized ×15 ("Customer account" diagram label,
"Try it"/"Free"/"/mo" price chips — Shopify plan names stay EN as brand terms);
stale cta.installShort re-authored in 9 locales ("Add to Shopify" → "start free"
phrasing); ko footer.rights localized; "signed-in" non-breaking hyphen in the CTA
heading; demo cart item names shortened in ja/it/fr/es/fi/pt-BR (overflowed the
mock cart).

## Owner queue (decisions — nothing here ships without you)

1. **Privacy policy vs product truth (P1, unverified-judgment).** The formal
   /privacy-policy (verbatim port) says the app stores "anonymous shopping cart
   information for logged in customers"; the /privacy explainer and FAQ say carts
   are saved *against the customer's account* (not anonymous). Legal text — needs
   your revision pass (already on the owner-inputs backlog §4; this strengthens the
   case for doing it soon).
2. **Shopify Advanced-plan gap on /pricing.** Copy promises "your price matches
   your Shopify plan" but no Advanced tier is listed — deliberate (mirrors the App
   Store listing; see site.ts comment). Either surface the $24.99 Advanced tier on
   both listing + site, or soften the "every plan" phrasing.
3. **"Shopify staff have said…" attribution** on the two learn pages paraphrases a
   community post as staff statement — recommend re-attributing to "Shopify
   community/staff responses" wording or linking the exact thread. (Copy nuance ×15
   once you pick wording.)
4. **Green Mountain Diapers logo is illegible at strip size** — swap for a larger
   asset, drop it, or accept.
5. **How-it-works install section meta-sentence** ("It's worth doing this
   deliberately rather than calling it zero-setup…") reads as notes-to-self;
   propose rewrite (×15 re-author on approval).
6. **SERP snippet lengths**: home title 72 chars / description 202 (truncates in
   Google). Trimming changes your indexed identity — propose drafts on request.
7. **Signed-in vs logged-in** used interchangeably across pages — pick one
   (recommend "signed-in"); it's a ×15 sweep.
8. **More diagrams (your ask):** proposal — numbered save→login→merge mechanism
   strip on /how-it-works; a mini "cookie vs account" split diagram for the
   cornerstone; the problem section already carries cards + fork. Say go and which.

## Deferred P2 polish (no decision needed, low stakes — next quiet cycle)

- FAQPage JSON-LD duplicated questions across home/faq (Google mostly ignores FAQ
  rich results now; dedupe when convenient).
- hreflang alternates point at noindex locale pages (inherent to the deliberate
  pre-native-review design; Google copes; revisit at native review).
- Font payload: Source Serif 4 ships wght+opsz axes (119.7KB latin); an instanced
  subset could halve it — CLS 0.03–0.07 is font-swap reflow; size-adjust fallback
  metrics would zero it.
- Customer-logo PNGs oversized (~84KB waste; Lighthouse flags magnolia.png et al).
- CJK line-breaking polish (ja mid-katakana breaks, ko keep-all) — bundle with
  native review.
- cta.partner translations are stale but the key is unused (partners page is
  V1-deferred) — refresh when that page returns.

## Accessibility (standalone lens re-run; axe-core 4 on home/how-it-works/pricing/faq)

**Passed cleanly:** heading order (single first h1, no level skips, all 4 pages);
all images carry alt text (the one empty-alt Shopify glyph is correctly decorative);
landmark structure correct with exactly one `main` per page.

**Fixed and live (commit ac5e9e4):**
- **P1 — 52 color-contrast failures in 4 token patterns** (axe `color-contrast`,
  serious): ink-faint `#8a8077` measured 3.5:1 on paper (breadcrumbs, strip labels,
  price cadence, citation links, testimonial meta, etc.) → now `#6e6459` (5.27:1);
  navy footer secondary text 3.8–4.4:1 → lightened to 5.7–6.1:1; `.btn-accent`
  white-on-`#d8541e` 4.03:1 → background one step darker `#c74a15` (4.75:1, visually
  identical); worst case — the homepage navy-section eyebrow rendered accent-ink on
  navy at **1.64:1** (near-invisible) → light accent `#e0895c` (5.94:1). All
  replacement ratios computed before shipping.
- **P2 — announce bar sat outside every landmark** (axe `region`): now
  `role="region"` with a localized `aria-label` ×15 (kept outside `<header>` on
  purpose — it must scroll away while the nav sticks).

Note: `--color-ink-faint` darkening is a subtle sitewide visual change to all faint
text; flag if you want it tuned differently — any value ≥ `#6e6459`-dark passes.
