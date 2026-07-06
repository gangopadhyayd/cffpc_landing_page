# v1 Recommendation — simplify, don't restart

**Verdict: keep and simplify the existing build. A from-scratch restart is not justified.**
The codebase's bones are genuinely good — a registry-driven router that emits every page × locale
from one component tree, all copy in an i18n catalog, honest verified facts wired through one
config file, zero-JS-by-default performance, and a complete SEO/GEO layer (schema, hreflang,
sitemap, llms.txt). None of that fights the lean-v1 goal; it's what made cutting scope a
config-level change instead of a rewrite. What was wrong was *editorial*: too many pages, too many
messages, too many CTAs, and a hero that showed the happy end-state instead of the problem. All of
that was fixable in place — three review→implement→verify cycles, each committed separately on
`iterate-v1-simplification` (see `docs/iteration-log.md`).

## The v1 in one line
A merchant landing cold sees, on the first screen: **the leak ("Shoppers switch devices
constantly. On a default Shopify store, their cart doesn't follow.") → the cost ("no error, no
email, just a lost sale") → the one-click fix → proof (4.8★ · Built for Shopify · since 2016) →
one primary CTA (Add Persistent Cart — start free)** — plus THE FORK, a diagram that shows the
same phone cart meeting two futures (lost vs kept). Verified by screenshot at desktop (1440×900)
and true-390px mobile viewport.

## Final v1 page set (9 page types × 15 locales = 136 pages)

| Page | Why it's in v1 |
|---|---|
| `/` home | The pitch: leak → fix → proof → pricing → FAQ → install |
| `/how-it-works` | The product page (nav); silent auto-merge + honest install story |
| `/pricing` | Conversion essential; "every feature on every plan" (matches live listing; Advanced hidden) |
| `/faq` | Answer-first GEO surface (FAQPage schema); merchants' pre-install objections |
| `/shopify-persistent-cart` | SEO cornerstone: the definitive explainer, cited |
| `/shopify-cart-disappears-after-login` | Highest-intent pain page |
| `/privacy` `/contact` `/support` | Trust + legal essentials |

**Indexable:** English only (unchanged); 14 machine locales build noindex with hreflang, pending
native review. Sitemap = 9 EN URLs. `llms.txt` matches scope automatically.

## Deferred (code kept, one-line re-enable)
calculator · free-audit · partners · affiliates · cross-device · big-retailers · vs-recovery ·
b2b · plus · use-cases ×3 · compare-email · resources · summary · changelog

Everything still compiles and its content/translations remain in the repo. To re-enable a page:
**delete its key from `V1_DEFERRED` in `src/config/routes.ts`**, re-add its nav/footer placement
in the same file, and restore its richer `related` links in `src/config/pageRender.ts` (noted
inline). Nav, footer, sitemap, and llms.txt all follow automatically. Two copy spots were
rewritten to remove calculator/audit references (`home.faq.q7.a`/`faq.q13.a`, `pricing.s3.b`) —
if the calculator/audit return, optionally reference them there again.

Deferring partners/affiliates also removes v1's only HIGH legal-review item (the firm "30%
recurring" offer, legal-review §5.7) — re-address it when the program is real.

## The ≤3 owner inputs still needed (everything else launches on safe placeholders)

1. **One proof number — approve "Trusted by 5,000+ Shopify stores since 2016."**
   Your own data shows 5,445 distinct stores served since 2016 (research-notes §2). One yes and
   we set `proof.storesServed` in `src/config/site.ts`; the trust bar and metric band upgrade
   from "thousands of Shopify stores" automatically. This is the single strongest trust upgrade
   available to v1.
2. **Privacy policy decision (one choice).** The site links `/privacy` (an honest data-handling
   explainer). Either confirm the existing formal policy URL to link as the governing document,
   or send its text and we host it on-domain. (owner-inputs §4 / legal-review §3.)
3. **Green-light the Green Mountain Diapers quote.** It's your public App Store review and it
   states the whole thesis; it's featured prominently on the homepage. Just confirm you're
   comfortable — or name a replacement review.

Not needed for launch: partner terms, audit fulfillment, calculator inputs, analytics keys,
merchant logos — all deferred with their features or env-gated.

## Pre-publish checklist (no owner input required, ~30 minutes)
- Re-verify vs the live listing: 4.8★/45 reviews, Free Starter + $4.99/$8.99/$99.99, Built for
  Shopify badge (config: `src/config/site.ts`).
- Re-verify the Walmart + Amazon help-page quotes verbatim (screenshot + date them), and the
  Shopify cookie-policy cart line (legal-review §5.1/§5.3).
- Point DNS/Netlify at the repo; `npm run build` publishes `dist/` (no keys needed for v1 —
  no forms remain in scope).

## What v2 adds back first (recommendation, in order)
1. **Free audit** (lead capture works with zero keys; needs a fulfillment owner + turnaround).
2. **Calculator** (the "put a number on it" step; already built with honest illustrative framing).
3. **Partners + affiliates** (once terms are confirmed; the payout glue lives in the app backend).
4. Native review for DE/FR/ES → flip locales indexable in `src/config/locales.ts`.
5. Remaining cluster pages (big-retailers, cross-device, vs-recovery, B2B/Plus, use-cases).
