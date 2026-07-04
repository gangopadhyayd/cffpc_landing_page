# persistentCartApp.com

Premium, multilingual, SEO/GEO-optimized marketing site for the Shopify app
**Persistent Cart — Sync Devices** (cross-device cart sync for signed-in customers).

Goals, in priority order: **(1)** attract paid partners & affiliates, **(2)** drive merchant
installs, **(3)** build trust with merchants, partners, and search/AI engines.

Built with **Astro 7 + Tailwind v4 + TypeScript + Astro i18n**. Static output, ~zero runtime JS
except small interactive islands (calculator, nav, language switcher, forms, consent).

---

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # static build → dist/
npm run preview    # serve the production build
npm run check      # astro check (types)
npm run i18n:check # fail if any locale is missing English keys (CI drift guard)
```

Node 22+ recommended (works on 24).

## Deploy
Connect the Git repo to **Netlify** (config in `netlify.toml`). Build `npm run build`, publish `dist/`.
Native **Netlify Forms** capture the audit/partner leads with zero credentials. Add env keys (below)
to activate analytics, confirmation emails, CRM, and partner tracking — each degrades gracefully until then.
See `docs/tooling-and-accounts.md` for the full register/billing list and `docs/owner-inputs-needed.md`
for everything the owner still needs to supply.

## Project structure

```
src/
  config/
    site.ts          # central facts, proof numbers (verified vs REQUEST), pricing, partner terms
    locales.ts       # the 15-locale source of truth (en canonical; reviewed→indexable)
    routes.ts        # page registry (slug, nav, footer, cluster) + BUILT_KEYS + breadcrumbs
    pageRender.ts    # ContentPage config (section/faq counts) for generic content pages
  i18n/
    index.ts         # catalog loader + t() (glob-merges strings/**/*.json)
    routing.ts       # localizedPath / alternates / canonical helpers
    strings/
      en.json        # chrome + homepage copy (canonical)
      en/<page>.json # per-page copy (canonical)
      <code>.json, <code>/<page>.json   # generated translations (14 locales)
  layouts/Base.astro # html shell: fonts, SEOHead, Header, Footer, Analytics, Consent
  components/         # design-system components (Hero, CartCard, ComparisonTable, FAQ, LeadForm, …)
    pages/           # page components (HomePage, PricingPage, ContentPage, …)
  pages/
    [...slug].astro  # catch-all router → emits every page × 15 locales from one component tree
    llms.txt.ts      # generated llms.txt
    404.astro
  lib/schema.ts      # JSON-LD builders (Organization/WebSite/SoftwareApplication/FAQ/Breadcrumb)
  data/              # demo cart + shared proof blocks
netlify/functions/submission-created.mjs  # enriches form leads (Resend/HubSpot) when keys exist
scripts/             # gen-og.mjs, i18n-check.mjs, i18n-sync.mjs
docs/                # strategy, research, localization, tooling, partners, ASO, legal, owner-inputs …
```

## How content & i18n work
- **All display copy lives in the i18n catalog** — components carry zero hard-coded strings. Author once
  in English (`strings/en.json` + `strings/en/<page>.json`); the loader glob-merges everything.
- **One shared component tree** renders every page for all 15 locales via the catch-all router; English
  is served at `/`, other locales under `/<path>/` (e.g. `/de/pricing`).
- **Translations** are generated into `strings/<code>.json` + `strings/<code>/<page>.json`. Unreviewed
  locales render `noindex` (hreflang still wired) until marked `reviewed: true` in `locales.ts`.
- Run `npm run i18n:check` to verify coverage; `npm run i18n:sync -- --scaffold` to fill gaps.
  Full rules + glossary in **`docs/localization.md`**.

## Common edits
| Task | Where |
|---|---|
| Change a stat / rating / price | `src/config/site.ts` (`proof`, `pricingTiers`) |
| Edit page copy | `src/i18n/strings/en/<page>.json` (then re-run translations) |
| Edit homepage copy | `src/i18n/strings/en.json` (`home.*` keys) |
| Add/edit a testimonial | `home.testimonial.*` in `en.json` |
| Add a page | add to `src/config/routes.ts` (+ `BUILT_KEYS`), add `en/<key>.json`, and either a `pageRender.ts` entry (generic) or a component in the router's `CUSTOM` map |
| Add a locale | add to `src/config/locales.ts`; everything else (routes, hreflang, sitemap, switcher) follows automatically |
| Mark a locale review-complete | set `reviewed: true` in `locales.ts` → it becomes indexable + enters the sitemap |
| Regenerate the OG image | edit + run `node scripts/gen-og.mjs` |

## Where keys go
All integrations are env-var-gated and documented in `docs/tooling-and-accounts.md` and `docs/analytics.md`.
Public (build-time) vars are prefixed `PUBLIC_`; server secrets (Resend/HubSpot) live in Netlify function env.
Nothing breaks if a key is absent — the related feature simply stays dormant.

## Honesty & quality notes
- Facts are sourced in `docs/research-notes.md`; time-sensitive ones (rating, pricing, retailer quotes)
  should be re-verified before publishing.
- We deliberately **do not** emit self-review (`aggregateRating`) schema; the 4.8★ links to the App Store.
- The lost-cart calculator shows an **illustrative range**, never a measured result.
- See `docs/legal-review.md` for the post-build claims review.
