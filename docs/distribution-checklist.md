# Distribution-Surfaces Checklist — persistentcartapp.com

*The standing audit that catches "registered nowhere / set up but undocumented"
gaps (the Bing WMT class of miss, found 2026-07-20). Run the full list
**quarterly**, or after any launch that changes the page set. ~10 minutes; all
checks are curl/browser-level — no agent fan-out needed. Update the Status
column in place; anything ❌/❓ becomes a task.*

| # | Surface | What "good" is | Status 2026-07-20 |
|---|---------|----------------|-------------------|
| 1 | Google Search Console | Domain property verified; sitemap-index submitted; Page-indexing tracking ~225 | ✅ (verified; watch locale-flip pickup) |
| 2 | Bing Webmaster Tools | Site verified under dgangopa@gmail.com; sitemap Success; **AI Performance** baseline logged | ✅ verified; sitemap re-submitted for 225-URL state; AI baseline = 2 Copilot citations (~Jul 14) |
| 3 | IndexNow | Key file live at /d6c77449536f5b2313ac1378e65d1423.txt; ping runs in `npm run deploy` | ✅ automated (HTTP 200, 225 URLs) |
| 4 | robots.txt AI crawlers | GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot allowed | ✅ |
| 5 | llms.txt | Live, route-derived, matches emitted pages | ✅ (auto-updates on un-defer) |
| 6 | Sitemap ↔ reality | sitemap-index → sitemap-0 lists every emitted indexable page | ✅ 225 (qa-gate enforces) |
| 7 | hreflang | Head cluster = indexable locales + x-default only | ✅ (gated on `isIndexable`) |
| 8 | Structured data | Organization(+sameAs,logo), WebSite, SoftwareApplication(+offers), FAQPage, BreadcrumbList | ✅ · open: aggregateRating (owner call), FAQPage home/faq dedupe (P2) |
| 9 | Entity loop | Site schema ↔ App Store listing cross-link both ways | ✅ (listing → site ×3; sameAs → listing) |
| 10 | Entity profiles | sameAs carries real social/company profiles | ⚠️ only the App Store link — no LinkedIn/X/YouTube/Crunchbase exist (owner: create when convenient, then add to `site.ts` sameAs) |
| 11 | Analytics | GA4 live (geo-gated consent), install_click on every CTA w/ placement source | ✅ · Plausible still unwired (optional) |
| 12 | App Store listing | Current assets uploaded; links to site intact | ✅ EN listing shows the new designed frames — visually verified 2026-07-20 (live hero = repo `renders/hero-feature.png` pixel-match; thumbnails = the-receipts/mechanism/b2b). Docs saying "not uploaded" were stale doc-drift. Open: whether the 10 localized listings + icon got their `renders/l10n` variants (not individually checked) |
| 13 | Shopify editorial pitch | "Get featured" form submitted | ✅ submitted (owner, ≤2026-07-20). Shopify replies only if moving forward — no follow-up channel |
| 14 | Per-market engines | Only if a market shows traction: Naver Search Advisor (ko), Baidu (zh; needs ICP — likely never). Yandex/Seznam/Naver already receive IndexNow pings | ➖ not yet warranted |
| 15 | AI-answer spot-check | Monthly: ask ChatGPT/Perplexity/Claude/Gemini the 6 money queries; log who's cited; compare Bing WMT AI Performance | 🔁 baseline set; first check ~2026-08-20 |

## How to run this audit
Ask Claude Code: *"run the distribution checklist"* — items 1–2 need the
browser (logged-in GSC/BWT), 3–9 are curl/grep one-liners, 10–14 are
lookups, 15 is the monthly AI-answer loop. Keep total cost trivial: no
sub-agents, no full-site crawls.

## Why this exists
Bing WMT was registered during the 2026-07-07 audit but never recorded in
.env or docs, so the 2026-07-20 SEO review re-flagged it as missing. Rule:
**every external registration lands in this file the day it's made** (what,
which account, where the credential/token lives).
