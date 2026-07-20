# SEO & AI-Search Growth Plan — persistentcartapp.com

*2026-07-20 · written after the GSC "pages not indexed" episode + the 14-locale
release review. This is the standing roadmap for **visibility and traffic**;
tactical execution details stay in the docs it links. Companion context:
`docs/next-iteration-brief.md` (site state + owner queue),
`docs/localization.md` (locale pipeline),
`../shopify_app_cloning_analysis/docs/affiliate_program/` (partner/affiliate
program, ready-to-launch proposal),
`../shopify_app_cloning_analysis/docs/persistent_cart_listing/` (App Store
listing workstream + editorial pitch).*

---

## 0. Mental model — where traffic for an app site actually comes from

Four engines, in rough order of expected volume for this category:

1. **Google organic** (classic SEO): pain queries ("shopify cart disappears
   after login"), category queries ("shopify persistent cart app"), comparison
   queries ("persistent cart vs abandoned cart email"). Won by content depth ×
   technical hygiene × **third-party authority** (links/mentions).
2. **AI answer engines** (ChatGPT, Perplexity, Claude, Gemini, Copilot — "GEO"):
   answers to "how do I keep carts synced across devices on Shopify?" are
   synthesized from *consensus across sources*. Your own site matters
   (crawlable, quotable, llms.txt), but **third-party corroboration** (listicles,
   forum answers, reviews, comparison posts) is what makes an AI name you.
   Note: ChatGPT browsing/Copilot lean on **Bing's index** — Bing is not
   optional in an AI-first plan.
3. **Shopify App Store internal search + featuring** — the other property.
   Largest install intent pool in the ecosystem; the site's job is to convert
   and to *feed* it (the listing itself is the
   `shopify_app_cloning_analysis` repo's listing-optimization track).
4. **Referral/partner traffic** — agencies installing for clients + content
   affiliates. Small volume, highest intent, compounding; also generates the
   links/mentions that power engines 1–2.

Everything below is organized to feed those four engines.

---

## 1. Verified current state (audited 2026-07-20)

### Strong (already done — don't redo)
- **Technical SEO is clean**: single-host 301s (www→apex, http→https, trailing
  slash), sitemap-index submitted to GSC (domain property verified), clean
  URLs, Lighthouse 98–100 baseline, WCAG AA tokens.
- **hreflang is now correct**: alternates emit only indexable locales
  (fixed 2026-07-20 after the GSC alert; `alternates()` gates on
  `isIndexable`).
- **Structured data**: Organization (+`sameAs`), WebSite, SoftwareApplication
  (+offers), FAQPage (17 Q&A on /faq), BreadcrumbList. GA4 wired with
  `install_click` events carrying placement source; UTMs flow to Shopify
  Partner analytics.
- **AI-crawler posture**: robots.txt explicitly allows GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, CCBot, etc.; `llms.txt` is live,
  curated, route-derived (deferred pages auto-excluded).
- **15 locales built** on one config switch each; **as of this round, all 14
  non-EN locales are agent-reviewed and being flipped indexable** — the site
  goes from 15 indexable pages to ~225 across 15 markets. No competitor in
  this niche has a marketing site in *any* language (localization.md).

### Gaps (the plan)
| # | Gap | Engine hit | Severity |
|---|-----|-----------|----------|
| G1 | **Bing Webmaster Tools never verified** (`PUBLIC_BING_SITE_VERIFICATION` empty) → weak/unknown Bing indexing → invisible to ChatGPT browsing + Copilot | AI, Google-alt | **High** |
| G2 | **No IndexNow** → Bing/Seznam/Yandex discover changes slowly | AI | Medium (cheap) |
| G3 | **Domain authority ≈ zero** — new domain, near-no backlinks; nothing ranks competitively without mentions | Google + AI | **Highest, slowest** |
| G4 | **High-intent pages still deferred**: calculator (linkable asset!), big-retailers, plus, uc-high-aov, uc-repeat, resources/summary | Google + AI | High |
| G5 | EN home **title 72 chars / desc 202** (SERP truncation; backlog #5, drafts on request) | Google | Medium |
| G6 | **FAQPage schema duplicated** (home + /faq both emit it; parked P2) | Google | Low |
| G7 | **No aggregateRating** in SoftwareApplication schema — blocked by the owner honesty rule "never show review count" (aggregateRating requires ratingCount). Needs an explicit owner call: machine-readable ≠ on-page display | Google rich results | Medium (owner) |
| G8 | **No video**: demo video would earn VideoObject schema + a YouTube surface (2nd-largest search engine; AI engines cite YT transcripts) | All | Medium |
| G9 | **Zero third-party citations to cite us by name in AI answers** (see G3 — same root) | AI | High |
| G10 | Affiliate/partner program **designed but not launched** (proposal awaiting owner approval on rates) | Referral + G3 | High |

---

## 2. Workstreams

### A. Engines & index plumbing (days; mostly one-time)
1. **Bing Webmaster Tools** (owner, ~15 min): create account, *import the
   verified site from GSC* (fastest path — no DNS edit), or set
   `PUBLIC_BING_SITE_VERIFICATION` in Netlify env + `.env` and redeploy;
   submit `sitemap-index.xml`. This is the single cheapest AI-visibility
   unlock we have.
2. **IndexNow** (agent, ~1h): add key file + a small post-deploy ping (Netlify
   deploy hook or a step in `npm run deploy`) submitting changed URLs.
   Bing/Copilot freshness for free.
3. **GSC after the locale flip**: expect Page-indexing counts to grow toward
   ~225; "Excluded by noindex" decays; watch International Targeting +
   per-country queries appear. No manual resubmission needed (sitemap already
   registered) — optional: Request Indexing on the 14 locale homepages to
   accelerate.
4. Keep watching the two alert types from the 2026-07-18 email — both are now
   understood (noindex = was-by-design, now mostly flipped; redirects =
   intentional 301s, permanent, fine).

### B. Content — close the intent map (weeks, iterative)
Priority order by (search volume × intent × build cost):
1. **Un-defer `calculator`** (`lost-cart-revenue-calculator`) after its QA
   pass — interactive tools earn links + AI citations ("how much revenue do
   abandoned carts cost?"), and it's already built. (Backlog #8; needs QA.)
2. **Un-defer `big-retailers`** ("how Amazon/Walmart persist carts") — the
   parity story is the brand's core argument; informational magnet, zero new
   build.
3. **Un-defer `plus` + `uc-high-aov` + `uc-repeat`** after the Advanced-aware
   copy re-read (backlog #8 caveat — prose is still Plus-only).
4. **`resources`/`summary` hub** — the "answer hub" pattern AI engines love
   (short, sourced, quotable summaries; summary.json already exists).
5. **New pain-query pages** (create in EN, fan out ×15 via the now-proven
   review pipeline): "cart not syncing between devices", "save cart for later
   Shopify", "Shopify cart expires / cookie lifetime". Mine exact phrasing
   from the 934k-review corpus in the analysis repo
   (`scripts/mine_review_channels.py` infra) — we have real merchant language
   no competitor has.
6. **SERP trims** (G5): draft ≤60-char home title + ≤155-char desc for owner
   sign-off (EN change → ×15 re-author per i18n discipline).
7. Keep FAQ growing from real support questions (each new Q&A = FAQPage
   schema + an AI-quotable answer, ×15 locales).

### C. On-page & schema polish (days)
1. Dedupe FAQPage markup (G6): keep the full set on /faq; home keeps its 8
   visible Q&A but drops the schema block (or narrows to non-overlapping).
2. **aggregateRating decision** (G7, owner): if approved, add
   `aggregateRating {ratingValue: 4.9, ratingCount: <live count>}` to the
   SoftwareApplication block — machine-readable only; the on-page "never show
   count" rule stays intact. Enables ★ rich results. If declined, document it
   as a standing exception.
3. Per-page OG images (currently one shared image) — nice-to-have for CTR on
   shares; low priority.
4. When the demo video exists (G8): VideoObject schema + YouTube upload with
   a transcript (AI engines read transcripts).

### D. Authority & citations — the actual bottleneck (ongoing; compounding)
Everything here produces the third-party corroboration that both Google and AI
answers require. Assets already built for this:
1. **Launch the affiliate/partner program** — proposal is finished and costed
   (`docs/affiliate_program/program_proposal.md`: content track 25% lifetime,
   founding-affiliate 40%×3 cycles boost, agency track; platform pick made;
   Mantle shutdown 2026-08-14 noted there). **Owner input: approve rates →
   launch.** Content affiliates monetize the currently-unmonetized cart-app
   listicle niche (research found 0 affiliate links in cart-recovery listicles)
   — i.e., we can *cause* the listicles that AI engines then cite.
2. **Send the Shopify editorial pitch** — BFS "Get featured" form answers are
   drafted (`docs/persistent_cart_listing/3_proposals/editorial_pitch_*`).
   A Shopify-owned-channel feature is the single highest-authority mention
   available to an app.
3. **Partner outreach** — the 112-agency tiered list
   (`docs/affiliate_program/partner_outreach.md`) with the perks+client-value
   pitch (cash-only fails at our ARPU — research finding).
4. **Community answers cadence** (owner or ghost-drafted, ~30 min/wk):
   Shopify Community forums + r/shopify threads about disappearing/unsynced
   carts — answer genuinely, link when on-topic. Reddit + forums are heavily
   weighted in AI training/retrieval. Track: which threads AI engines cite.
5. **Listicle/review-channel outreach**: the review-mining pass
   (`channel_*` parquets) identified where cart-app coverage lives; pitch
   inclusion of Persistent Cart in "best cart apps 2026" style posts
   (affiliate program gives writers a reason).
6. **Data-driven PR when ready**: the "$30M+/30 days" figure + device-switching
   stats make a citable data story ("X% of carts change devices before
   checkout") — publish as a stats page other sites cite (AI engines love
   sourced stat pages). Gate: owner sign-off on any new figures (honesty rules).

### E. AI-answer specifics (GEO hygiene, ~continuous)
1. **Entity consistency**: exactly "Persistent Cart — Sync Devices" +
   `cart-persistify` handle + same one-line description across site schema,
   llms.txt, App Store listing, and any directory profiles. (Already good;
   keep it that way when copy changes.)
2. **Quotable-first writing**: every page's first paragraph answers its query
   directly (the locale review enforced this in FAQ answers ×15).
3. **llms.txt maintenance**: it's route-derived; verify after every un-defer.
   Consider llms.txt per-locale sections only if AI referrals show non-EN
   demand (watch GA4).
4. **Monthly AI-answer audit** (15 min): ask ChatGPT/Perplexity/Claude/Gemini
   the 6 money questions ("best way to sync Shopify cart across devices",
   "why does my Shopify cart disappear after login", "persistent cart app
   Shopify", + 3 localized spot-checks de/fr/ja). Log who gets cited; adjust
   D-workstream targets accordingly.
5. **Referral telemetry**: GA4 already captures referrers; watch for
   chatgpt.com / perplexity.ai / copilot referrals as the leading indicator.

### F. Measurement loop
- **Weekly (5 min)**: GSC Performance (impressions by country after the locale
  flip), GA4 `install_click` by source/locale.
- **Monthly**: AI-answer audit (E4); GSC Page-indexing (expect ~225 indexed;
  investigate regressions); Bing WMT once verified; keyword movement on the
  6 money queries per market.
- **KPIs (90-day)**: indexed pages 15 → ~225; non-EN impressions > 0 → growing;
  first non-EN installs attributed (UTM); ≥ 2 third-party mentions/citations
  live; Bing indexed; ≥ 1 AI engine citing persistentcartapp.com for a money
  query.

---

## 3. Sequenced roadmap

**Now (this week)**
1. ✅ Locale review ×14 + flip indexable + deploy (2026-07-20).
2. ✅ Bing WMT verified (dgangopa@gmail.com; property existed since ~07-07 but
   was undocumented — see docs/distribution-checklist.md); sitemap re-submitted
   for the 225-URL state; **AI Performance baseline: 2 Copilot citations
   (~Jul 14)**. ✅ IndexNow automated in `npm run deploy` (2026-07-20).
3. ✅ Shopify editorial pitch submitted (owner, ≤2026-07-20).
4. Draft SERP-trim title/desc for owner sign-off (G5).
5. NEW: quarterly distribution-surfaces audit — docs/distribution-checklist.md.

**30 days**
5. Approve affiliate rates → launch program + first 20 founding affiliates
   (docs ready; platform picked).
6. Un-defer calculator (after QA) + big-retailers; verify llms.txt/sitemap
   pick them up (automatic).
7. FAQPage dedupe (G6); aggregateRating owner decision (G7).
8. Start community-answer cadence; first listicle outreach wave.

**60–90 days**
9. Un-defer plus/uc-* after Advanced-aware re-read; resources/summary hub.
10. New pain-query pages from review-corpus mining (EN → ×15).
11. Demo video + YouTube + VideoObject (G8).
12. Data/stats page for citation bait (owner-approved figures only).
13. First 90-day KPI review against §F; rebalance.

---

## 4. Owner-input dependencies (nothing else is blocked)
1. **Bing WMT account** (15 min; biggest cheap unlock).
2. **Affiliate rates approval** (proposal §Track 1/2 — then launch is mechanical).
3. **aggregateRating in schema: yes/no** (machine-readable rating+count vs.
   the on-page no-count rule).
4. **SERP trim sign-off** when drafts land (EN copy change → ×15 fan-out).
5. **Editorial pitch submission** (form is owner-auth'd; answers drafted).

## 5. Standing constraints honored by this plan
- **Honesty rules are absolute** (next-iteration-brief §rules): approved claims
  only, 4.9★ without count on-page, verbatim review quotes, no store naming.
- **i18n discipline**: EN meaning change → re-author ×14 (the reviewed locale
  catalogs are now hand-curated content, not disposable MT output —
  see localization.md update 2026-07-20).
- **Deploys are CLI-only** (`npm run deploy`); Netlify credits guarded.
- Budget posture unchanged: $0 scraping; paid spend only where the affiliate
  program's own economics justify it.

## 6. References (external)
- Google: hreflang requires indexable alternates; noindex targets are dropped
  from clusters (developers.google.com/search — localized-versions doc).
- Google June 2025 policy change: machine-translated pages judged on value,
  not method; unreviewed scaled MT = "scaled content abuse" risk — reviewed
  MT is compliant ([Slator](https://slator.com/google-flips-stance-on-automatic-ai-translations-requires-content-creators-to-opt-out/),
  [MultiLingual](https://multilingual.com/google-automated-translation-policy-update/),
  [search policy overview](https://seo.ai/blog/googles-position-policy-ai-text-content)).
- MQM quality dimensions used for the locale review: accuracy, fluency,
  terminology, style, locale conventions, audience appropriateness,
  design/markup ([Localazy MQM overview](https://localazy.com/dictionary/multidimensional-quality-metric-mqm),
  [LQA vs MQM](https://www.translatedright.com/blog/quality-assurance-models-in-translation-lqa-vs-mqm-vs-dqf-explained/)).
