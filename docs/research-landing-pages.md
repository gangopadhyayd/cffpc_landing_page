# Landing-Page Research — What the Best & Fastest-Rising Shopify Apps Do (vs. persistentcartapp.com)

> **Fold benchmark addendum (2026-07-07, live re-capture):** all 13 sites captured live
> at 1440×900 (playwright, real viewport) with visible above-the-fold word counts
> measured programmatically. **persistentcartapp.com was 248 words — 2nd wordiest;
> competitor median ≈ 85** (Social Snowball 33 · Triple Whale 37 · Klaviyo 62 ·
> Postscript 69 · TrueProfit 75 · ParcelWILL 80 · Appstle 85 · TinyIMG 92 · Loox 162 ·
> Order Editing 208 · Rewind 214 · Gorgias 303). Leanest-fold pattern: **rating chip at
> the very top (above or directly under the H1)**, sub-copy 15–25 words, one product
> visual, proof strip at the fold edge. Shipped same day: proof row (BFS badge + 4.9★
> glyph chip) above the H1, hero sub 55→25 words, diagram caption 29→13, $30M+ stat
> lockup kept. Fold now ≈ 127 words including diagram labels.

**Date:** 2026-07-07 · **Method:** live fetch + structured teardown of 13 reference-app marketing
sites (2 more unreachable, noted), cross-checked against the cloning-analysis repo's quantified
top-50-velocity dataset (`~/dev/shopify_app_cloning_analysis`, snapshot 2026-05-28) and this repo's
strategy/honesty rules (`docs/site-strategy.md`, `docs/research-notes.md`). All reference-app claims
below are what was actually observed on their pages on 2026-07-07 (or explicitly sourced from the
repo dataset). Persistent Cart facts use only verified/owner-approved numbers: **4.9★ / 47 reviews
(verified 2026-07-06)**, **"$60M+ USD order value from synced carts in the last 90 days"
(owner-approved 2026-07-06)**, **"thousands of Shopify stores, hundreds on Shopify Plus"
(owner-approved qualitative)**.

Reference set — best-in-class: Klaviyo, Postscript, Gorgias, Loox, Triple Whale, Rewind.
Fast-rising (top-50 velocity per repo data and/or ≤3-yr-old breakouts): Appstle (#1 velocity,
549 reviews/90d), Kaching (#2, 542), Loox (#3, 534), Judge.me (#5, 512 — site partially blocked),
TinySEO/TinyIMG, TrueProfit, Order Editing, Social Snowball, ParcelPanel (now "ParcelWILL").
Unreachable: AfterShip (403), Judge.me homepage (403). Direct rival check: **Casper (cross-device-cart)
still has no marketing site at all** — the category's education lane remains 100% ours.

---

## 1. TL;DR — Top 10 improvements, ranked by expected conversion impact ÷ effort

| # | Improvement | Demonstrated by | Impact | Effort |
|---|---|---|---|---|
| 1 | **Put the $60M+ stat in the hero trust strip** (proof above the fold, not in section 8) | Gorgias ("$500M+ revenue driven" high on page), Order Editing (six-figure revenue claims at hero level), Kaching ("$600M+ additional revenue" as a top stat), Postscript (stats bar directly after hero) | High | XS |
| 2 | **Add a named-merchant proof strip** — the logo-wall equivalent. PC is the only site of 14 with zero named-customer row | All 13 observed sites (9–30 logos each; Loox shows Urban Outfitters/Miami Heat; Order Editing shows TOMS/Ridge) | High | S |
| 3 | **One per-store ROI mini-case, $ figure vs. plan price** (pending owner sign-off; anonymized OK) | Order Editing's live Nakie dashboard ("$573K annual upsell revenue, 423 orders edited/30d, 35.25 hours saved"), Loox case cards ("BlendJet $7.5M"), Social Snowball ("$1.5M+ incremental") | High | M |
| 4 | **Re-enable the Lost-Cart Calculator (v2)** — component already built, currently in `V1_DEFERRED` | Rewind's e-commerce downtime cost calculator (exact analog: pricing an invisible risk), Gorgias ROI calculator, Klaviyo ROI calculator, Social Snowball calculator, TrueProfit's 8 free tools | Med-High | S |
| 5 | **Say the anti-billing-shock line out loud on /pricing** ("no usage fees, no per-order charges, no surprises") | Postscript's pricing H1 is literally "Flexible pricing, no hidden fees"; Appstle repeats "0% Transaction Fee & No Hidden Charges"; repo data: billing shock = the market's #1 complaint (25–30% of all 1★ reviews), winners use this wedge 8–12× more than stalled apps | Med-High | XS |
| 6 | **Turn the rating into a linked Shopify-listing chip** (bag glyph + "4.9★ · 47 reviews · Shopify App Store"), always paired with "since 2016" | Order Editing (Shopify glyph + "5.0, 300 reviews, Shopify Reviews"), Social Snowball (Shopify 4.9/5 badge in hero), TrueProfit (Shopify badge inside its CTA button) | Med | XS |
| 7 | **Give the secondary CTA something to *show*** — a "test it on your own store in 90 seconds" block (free plan = the demo), and longer-term an unwalled demo store | TrueProfit ("View demo store" as hero secondary CTA), Loox (public demo store), Gorgias ("3-minute product tour"), Order Editing (product demo video on a real store) | Med | S |
| 8 | **Re-enable the prevention-vs-recovery comparison page (v2)** — the "vs. the status quo" comparison is a proven device | TrueProfit ships "vs Spreadsheets" alongside "vs Triple Whale"; Klaviyo (vs Mailchimp/Postscript), Gorgias (10+ compare pages), Appstle (23+ footer comparison links), Loox (vs Judge.me, vs Yotpo) | Med | S |
| 9 | **Elevate "hundreds on Shopify Plus" to its own stat tile** (and consider re-enabling /shopify-plus in v2) | Loox headlines "3,000 Shopify Plus stores"; Appstle hero says "Shopify Plus and Shopify brands"; ParcelWILL repeats "Available for: Shopify / Shopify Plus"; TinySEO has a top-nav "Shopify plus" item | Med | XS |
| 10 | **Footer trust block: official Shopify App Store badge + rating chip** next to the non-affiliation line | TrueProfit, Order Editing, Social Snowball (App Store badge in footer); ParcelWILL (footer ratings row: Shopify 5.0 · G2 5.0 · Trustpilot 4.9) | Low-Med | XS |

Explicit non-recommendations (evidence-backed): **don't** add a demo video for its own sake (repo
v2 analysis: `Spearman(video, velocity)=0.00`; 34% of winners vs 38% of stalled apps have one),
**don't** grow the nav (3 items is right for 9 pages; winners' 6–8-item navs mirror 50+-page sites),
**don't** add fake compliance badges (Order Editing/ParcelWILL show SOC 2/ISO — PC must not, per
GDPR-stub honesty rule), and **don't** buy a press strip (Appstle's Forbes/Bloomberg row isn't
replicable honestly today).

---

## 2. Pattern table — 13 observed reference sites

| App | Hero headline (exact) | Formula | CTA pattern | Proof near hero | Shopify-asset usage | Pricing | Distinctive devices | Nav |
|---|---|---|---|---|---|---|---|---|
| **Klaviyo** | "the AUTONOMOUS B2C CRM" | Category ownership | "Sign up" (single) | 196,000+ brands; 10 logos; G2 badges; 6 metric case cards | Shopify only as 1 of 350+ integrations | Linked; free plan noted in FAQ | ROI calculator, subject-line generator, comparison pages (vs Mailchimp, vs Postscript) | 5 top + ~60 sub |
| **Postscript** | "Make More Money From Every Message" | Money outcome | "Book a Demo" + "Start Free Trial" | Stats bar: 34x ROI, +22% revenue, 50% CR lift; 12+ logos; hero logo carousel ends on "Your Brand" placeholder | "Shopify stores have more success here than anywhere else" (copy only, no badge) | /pricing H1 "Flexible pricing, no hidden fees"; $0/$100/$500/Enterprise by brand maturity; 30-day trial + $100 credit | Free SMS audit tool (/audit), /compare, case-study hub (/results) | 5 top + ~20 sub |
| **Gorgias** | "Conversations that drive revenue, not just resolutions." | Outcome contrast | "Discover pricing" + "Book a demo" | "40% of Shopify brands"; "$500M+" revenue driven; 17,000+ brands; 4.2x ROI; 12+ logos; per-brand ROI (8.83×, 19.2×) | Heaviest: "Built into Shopify's DNA", "Shopify-invested", Shopify logo in backed-by section | Linked only | ROI calculator, 3-min product tour, 10+ comparison pages, video case studies | 6 top |
| **Loox** | "Stunning reviews that make you shine" | Emotional outcome | "Start free" (single) | "Join 130,000+ brands"; "+20% Revenue"; "3,000 Shopify Plus stores"; "180+ countries"; 9 recognizable logos | Built for Shopify noted in nav; **Shopify Plus partner badge in footer**; "works seamlessly with any theme… or Shopify app" | /pricing: 3 tiers $14.99/$49.99/$299.99 framed by brand stage; no free plan, free trial | **Public demo store**, case cards ("BlendJet $7.5M", "Volant $0→$2M in 1 year"), vs Judge.me / vs Yotpo pages | 7 top + dropdowns |
| **Triple Whale** | "The AI operating system built for modern ecommerce." | Category ownership | "See it in action" + "Start for Free" | 60,000+ brands; 9B+ events/day; "#1 in marketing measurement, 55% adoption"; 16+ logos; 8 named quotes; G2 badges | One passing Shopify mention; no badges | Linked only | Free performance-benchmarks dashboard, creative audit tool, "TW vs Competition" page | 7 top + 2 actions |
| **Rewind** | "Your SaaS data has no safety net" | **Problem/fear-led** (the utility-app pattern) | "Start my free trial" + "Request a demo" | 25,000+ orgs; 7 PB safeguarded; G2 badges; case studies with headshots; Dr. Martens/Olaplex logos | Dedicated Shopify product page; install link straight to apps.shopify.com; **displays Shopify's own ToS liability excerpt as proof of the gap** | Linked only | **Interactive widget flipping through each platform's ToS disclaimer**; e-commerce downtime cost calculator | 8 top |
| **Appstle** (#1 velocity) | "Grow ecommerce revenue with retention focused experiences" | Outcome verb | Per-product "Get started with…" ×4 | "Rated 5 out of 5", "10,000+ reviews", "40,000+ merchants", 12+ logos, press row (Business Insider, Forbes, Bloomberg…) | Shopify + Shopify Plus logos in hero; deep-links to each App Store listing | Linked per product | **23+ comparison pages in the footer**, migration guides ("Migrating to Appstle"), "<2 minute avg. reply" support claim | 8 top |
| **Order Editing** (new breakout) | "Order Editing for Shopify — Eliminate customer service tickets and make six figures in upsell revenue" | Platform + double outcome, **number in H1** | "Book a demo →" + "See Shopify app listing" | 5.0★/300 reviews **with Shopify glyph**; brand-specific revenue (Nakie $500K+, Koh $418K+); 30+ logos; SOC 2/GDPR/ISO badges | Shopify in H1; glyph on rating; App Store badge in footer; "Shopify Reviews" label | Linked ("step away easily at any time") | **Live customer dashboard as proof** ($573K upsell, 423 orders edited/30d, 35.25 hrs saved), demo video on a real store, regional account-manager matching | 7 top |
| **TrueProfit** (rising) | "The #1 Net Profit Analytics Platform for Shopify Sellers" | #1-category claim + platform in H1 | "Start free trial" (**Shopify badge inside button**) + "View demo store" | 70,000+ Shopify brands; "+20.59% net margin in 90 days"; 5/5 (750+ reviews); 185+ countries; 10 logos; 14 quoted reviews | Shopify named in H1; App Store badge in footer; Shopify-specific tools | Linked; "14-day free trial. Cancel anytime" | **8 free calculators/detectors** (profit, ROAS, fees, app detector), 4 comparison pages incl. **"vs Spreadsheets"**, demo store, MCP/Claude+ChatGPT integration callout, language selector | 6 top |
| **Social Snowball** (rising) | "Scale your affiliate revenue with creators & ambassadors" | Outcome verb | "Get a Demo" + "Start Now" | 3,000+ brands; **Shopify 4.9/5 badge in hero**; 25+ logos; case stats ($1.5M+, $10 CPA, 22.86x ROI); 8 named quotes with headshots | Shopify rating badge in hero; App Store badge in footer; "Start Now" = Shopify signup flow | Linked only | Commission calculator (calc.socialsnowball.io), 4 metric case studies, Academy | 6 top |
| **TinySEO/TinyIMG** (velocity winner) | "Get your Shopify store discovered with TinySEO" | Outcome + platform in H1 | "Install TinySEO" + "See features" | "5/5 on Shopify", "2,000+ reviews", "Trusted by 60,000+ merchants"; 5 quoted merchants with countries | **Built for Shopify badge with diamond icon at hero level**; "Shopify plus" nav item | **3-tier cards on the homepage** ($14/$23/$49, "Most popular" flag) | Free tools suite (metadata checker etc.), Chrome extension, success stories | 6 top |
| **Kaching** (#2 velocity) | "Kaching Bundle Quantity Breaks" / sub "Boost Your Sales with Smart Product Bundles" | Name + benefit sub | "Install Now" → App Store (single) | "40,000+ brands", "$600M+ additional revenue generated", "1,400+ 5-star reviews"; testimonials with € figures ("made me over €20K") | CTA goes straight to apps.shopify.com; no badge | **None on site** — defers entirely to the listing | Interactive 4-tab feature previews; case-studies nav item; suite cross-sell footer | 6 top |
| **ParcelWILL** (ParcelPanel rebrand) | "Post-purchase solution for DTC brands" | Audience definition | "Try ParcelWILL Free" + "Book a Demo" | "Trusted by 16,000+ Shopify & DTC brands"; testimonial metrics; 16+ logos; **footer ratings row: Shopify 5.0 / G2 5.0 / Trustpilot 4.9** | "Available for: Shopify / Shopify Plus / WooCommerce" repeated under every product | Linked only | Case-study carousel, 1,625-carrier integration showcase, uptime claim | 6 top + 2 CTAs |
| *Judge.me* (#5 velocity) | *(homepage 403-blocked — partially observed)* Own funnel page: "free forever" + 15-day Awesome-plan trial | Free-first | Install-led | Repo data: 512 reviews/90d; generous free tier + single $15 upgrade | Shopify-first review app | Free forever + $15 | — | — |

**Cross-site patterns that matter for PC:**
- **Hero formula:** 11 of 13 are outcome-led; the one true problem-led hero is **Rewind — a
  utility/insurance product, exactly PC's class** — and it immediately pairs fear with scale proof
  (25,000+ orgs). Lesson: leak-first is right for PC, but the *proof must sit inside the hero
  viewport*, not five sections down.
- **Numbers in H1 are rare** (repo: only 6% of top-50 listings) — Order Editing is the exception
  that works because the number is the offer. PC shouldn't force one into the H1; the trust strip
  is the right slot.
- **Every site has a named-customer row.** Median ~12 logos. This is the single most universal
  element PC lacks.
- **Proof repeats 2–3×** down the page (hero strip → stats band → case/testimonial) on all sites.
- **Pricing on the homepage is rare** (only TinySEO) — PC showing its table is a differentiator,
  not a defect, *because* PC's story is price-transparency.
- **Self-serve apps use install-first CTAs** (Loox "Start free", TinySEO "Install", Kaching
  "Install Now"); sales-led platforms use demo-first. PC's "Add Persistent Cart — start free"
  matches its motion correctly. Order Editing's "See Shopify app listing" secondary is a nice
  pattern PC already effectively has.
- **Built for Shopify badge on the marketing site** is used by the merchant-utility tier (TinySEO
  at hero level; Loox in nav) — PC already does this (announce bar + hero) and is ahead here.

---

## 3. What persistentcartapp.com already does BETTER than most (keep list)

1. **Only marketing site in its category.** Verified again 2026-07-07: Casper (`cross-device-cart`)
   has no site — the listing is its whole funnel. PC's education-first site is a category moat, not
   a catch-up exercise. Keep investing here.
2. **Problem-led hero with a falsifiable, precise claim** ("Shoppers switch devices constantly. On
   a default Shopify store, their cart doesn't follow."). Rewind proves this is the right genre for
   an invisible-risk utility; PC's version is more specific and honest than Rewind's "no safety net."
3. **The fork diagram showing the failure state first-class.** None of the 13 sites visualize the
   *loss*; they all show happy dashboards. This is a genuine signature — keep it.
4. **First-party platform quotes as proof** (Walmart/Amazon help-page quotes + Shopify cookie-policy
   paraphrase). Same device as Rewind's ToS-excerpt widget — PC's execution (dated, sourced,
   paraphrase-not-blockquote for Shopify) is *more* rigorous. Keep.
5. **Cited, dated statistics** ("Google/Ipsos, 2012 · Bazaarvoice SXI, Nov 2024"). No reference site
   dates its stats inline. Strong GEO/AI-answer surface and a credibility differentiator.
6. **Transparent homepage pricing + all-features-on-every-plan framing.** 11 of 13 winners hide
   pricing behind a link; the repo's review-mining shows billing shock is the market's #1 complaint.
   PC's "Every feature, on every plan" page is the structurally correct answer — just say the
   "no surprises" part explicitly (see §1.5).
7. **Single-primary-CTA discipline and a 3-item nav.** Right-sized for a 9-page site and a
   low-awareness category; resist growing it to look like the big platforms.
8. **15-locale site.** The repo's highest-confidence winner signal is localization (winners median
   7 languages vs 1; survives all controls). Most *reference sites* are English-only — PC's site is
   ahead of even the winners here. (TrueProfit is the only observed site with a language selector.)
9. **Honesty affordances**: footer non-affiliation line, "one click + one switch" install honesty,
   guests-not-covered plainly stated in FAQ. None of the reference sites hedge this carefully —
   it reads as trustworthy in a category where the buyer has been burned by billing surprises.
10. **Answer-first FAQ with schema** (12–13 real questions, including the "Doesn't Shopify already
    do this?" objection). Better GEO surface than most reference sites' thin marketing FAQs.

---

## 4. Specific copy & layout suggestions (honesty-safe, design-system-native)

All suggestions use existing tokens (Paper/Ink/marigold, Fraunces/Hanken/IBM Plex Mono, hairline
borders, ink primary buttons) and existing i18n keys where possible. Nothing below invents a stat;
items marked **[OWNER]** need sign-off per `docs/owner-inputs-needed.md` conventions.

### 4.1 Hero trust strip — hoist the $60M (Top-10 #1, #6)
Current (`hero.trust.*`): "4.9★ rating on the App Store · Built for Shopify · On the App Store since 2016".
The announce bar already repeats BFS + since-2016, so the strip has a free slot.

- **Change to:** `4.9★ · 47 reviews on the Shopify App Store` (linked chip, Shopify bag glyph,
  IBM Plex Mono) ` · Built for Shopify · $60M+ in synced-cart order value — last 90 days`
- Keep the owner-approved wording intact; the 90-day qualifier must stay attached. If the strip
  gets crowded at 360px, drop "Built for Shopify" from the strip (announce bar keeps it), never
  the qualifier.
- Keep the $60M+ tile in the metrics band too — reference sites repeat their hero number 2–3×.

### 4.2 Named-merchant proof strip (Top-10 #2) **[OWNER]**
New thin section directly under the hero (or under the problem section), replacing nothing.
Editorial version of the logo wall — mono type, hairline top/bottom rules, no grey logo soup:

> `IN PRODUCTION AT` — Green Mountain Diapers *(9+ years)* · *(3–5 more named stores)* — `and
> thousands more Shopify stores · hundreds on Shopify Plus`

- Source names only from public App Store reviews (store names are public) or owner-provided
  permissions (techbino, vdbparts are candidates per research-notes §4). Flag the name-usage
  question to the legal pass either way.
- Until permissions land, ship the compliant fallback: category strip —
  "Trusted by parts retailers, apparel brands, and wholesale stores in {n} countries" only if a
  country count can be verified from review metadata; otherwise omit the count.

### 4.3 ROI mini-case in the metrics band (Top-10 #3) **[OWNER]**
Order Editing's single most persuasive device is a real store's dashboard with real numbers next
to the price. PC's honest analog (data exists internally, research-notes §1/§4):

> **"One auto-parts store on the $4.99 plan saw ~$264,000 of synced-cart order value in 30 days."**
> `— internal measurement, {month year}; store name on file`

- Placement: fourth tile or a caption row in the existing `MetricBand`, or a one-card
  "customer math" module directly after the testimonial.
- Rules: publish only after owner sign-off; keep "order value" (never "revenue the app generated");
  anonymize if permission isn't granted; date it.

### 4.4 Pricing — say the anti-surprise wedge explicitly (Top-10 #5)
Add one line under the table on `/pricing` and under the homepage pricing section
(`pricing.planHint` area):

> "Flat monthly price. No usage fees, no per-order charges, no surprise bills — billing runs
> through Shopify and you can cancel anytime from your admin."

- Every clause is code-verified truth (flat tiers, Shopify Billing, cancel-anytime).
- **Do not** add "your price is locked for life" until the owner confirms it as a public promise
  (grandfathering is code truth but a forward commitment is a business decision).
- Optional FAQ addition (`pricing.faq.q5`): "Are there usage fees or per-order charges?" → "No.
  Your plan is a single flat monthly price. The Free Starter plan is free; paid plans start after
  a 30-day trial."

### 4.5 "Test it yourself in 90 seconds" block (Top-10 #7)
On `/how-it-works` after the install section, and as the target of a homepage text link. Converts
the Free Starter plan into the interactive demo the winners ship:

> **See it on your own store in 90 seconds.**
> 1. Install free (10 syncs included — no card).
> 2. Flip the app-embed switch in your theme editor.
> 3. Log in as a test customer on your phone, add an item, then open your store on your laptop
>    and log in. The cart is already there.

- CTA under it: existing `cta.install`. This also pre-answers "does it actually work?" — the
  #2 objection in the engagement corpus.
- Longer-term **[OWNER/app-side]**: unwall the register-gated demo store and link it as
  "View the demo store" (TrueProfit/Loox pattern).

### 4.6 Shopify Plus tile (Top-10 #9)
In `MetricBand`, split the buried note into its own tile so the band reads:
`$60M+ synced-cart order value (90d)` · `4.9★ Built for Shopify` · `Since 2016 — thousands of
stores` · `Hundreds on Shopify Plus`. Copy for the Plus tile note: "including B2B and wholesale
stores" (true per research-notes §1/§4). Re-enable `/shopify-plus` from `V1_DEFERRED` in v2 and
link the tile to it.

### 4.7 v2 re-enables, in order (Top-10 #4, #8)
Components/content already exist; each is one key deleted from `V1_DEFERRED` plus QA:
1. `calculator` (`/lost-cart-revenue-calculator`) — keep the transparent-formula framing; add the
   Rewind-style caption "illustrative, not a promise — here's the formula."
2. `vs-recovery` + `compare-email` — the TrueProfit-"vs Spreadsheets" analog; footnote copy already
   exists ("recovers the carts your flows never see").
3. `big-retailers` — deepens the strongest proof asset (parity quotes).
4. `partners`/`affiliates` — per strategy §2 when the owner confirms terms.

### 4.8 Footer trust block (Top-10 #10)
Left of the non-affiliation line: official **Shopify App Store badge** (per Shopify's brand
guidelines) + mono chip "4.9★ on the Shopify App Store" linking to the listing. Keeps the last
scroll-stop honest and recognizable. (ParcelWILL's footer-ratings row is the model; PC has only
one platform to show, which is fine.)

### 4.9 Micro-copy polish (free, observed gaps)
- `home.testimonial.cta` "Read all 47 reviews on the App Store" — good; add the bag glyph so it
  visually matches the new hero chip.
- `home.final.trust` already stacks the right tokens; append the $60M+ clause there too if it
  survives 360px: "4.9★ · Built for Shopify · $60M+ synced in the last 90 days · 30-day free trial".
- Keep the "across devices **and browsers**" phrasing rule everywhere (never "Shopify doesn't save
  carts") — verified still respected in current strings; hold that line in any new copy above.

---

## 5. Sources

**Live site (fetched 2026-07-07):**
- https://persistentcartapp.com · /how-it-works · /pricing · /faq

**Reference sites (fetched 2026-07-07):**
- Klaviyo — https://www.klaviyo.com
- Postscript — https://postscript.io · https://postscript.io/pricing
- Gorgias — https://www.gorgias.com
- Loox — https://loox.app · https://loox.app/pricing
- Triple Whale — https://www.triplewhale.com
- Rewind — https://rewind.com
- Appstle — https://appstle.com
- Order Editing — https://www.orderediting.com
- TrueProfit — https://trueprofit.io
- Social Snowball — https://socialsnowball.io
- TinySEO (TinyIMG) — https://tiny-img.com → redirects to https://tinyseo.com
- Kaching — https://www.kachingappz.com/apps/kaching-bundle-quantity-breaks
- ParcelWILL (formerly ParcelPanel) — https://www.parcelpanel.com

**Unreachable / partial (noted honestly):**
- Judge.me — homepage + /pricing returned HTTP 403 to our fetcher; "free forever + 15-day Awesome
  trial" observed via its own funnel page (https://app.judge.me/free-trial/article_home_15); velocity
  and free-tier facts from the repo dataset.
- AfterShip — https://www.aftership.com returned HTTP 403; excluded from the pattern table.
- Casper — no marketing site found (App Store listing only: https://apps.shopify.com/cross-device-cart),
  re-confirmed via web search 2026-07-07.

**Local corpus:**
- `~/dev/shopify_app_cloning_analysis` — `notebooks/marketing_deepdive_v2.md` (top-50 velocity
  cohort vs 584-app control; localization/free-tier/billing-shock findings),
  `notebooks/marketing_deepdive_v3.md` (listing content/image teardown), `docs/LEARNINGS.md`,
  `data/top50_velocity_refined.txt` (velocity list: Appstle 549 / Kaching 542 / Loox 534 /
  Fast Bundle 515 / Judge.me 512 reviews per 90d, snapshot 2026-05-28).
- This repo — `docs/site-strategy.md`, `docs/research-notes.md` (honesty rules, stat bank, verified
  parity quotes), `docs/iteration-log.md` (lean-v1 cuts), `src/config/routes.ts` (`V1_DEFERRED`),
  `src/config/site.ts` (verified 4.9/47, owner-approved $60M+), `src/i18n/strings/en.json`
  (current live copy quoted in §4).

**Web searches (2026-07-07):** "fastest growing Shopify apps 2025 2026" (roundups: privy.com,
wisepops.com, referralcandy.com — used only for category orientation, no stats cited); Kaching
site discovery; Casper site check; Judge.me positioning check.
