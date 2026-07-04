# Research Notes — persistentCartApp.com

Synthesized from 8 research sub-agents (4 local repos + 4 web). This is the **factual
reference** for all content. Treat **PRODUCT TRUTH** + **PROOF NUMBERS** as canonical;
re-verify time-sensitive web facts (§Parity, §Listing) at publish. Last synthesized 2026-06-30.

> Honesty rule (brief §4): never misstate current behavior, never fabricate. Where a number
> is internal/sensitive it is marked **[INTERNAL — owner sign-off]** and must NOT be published
> as-is; the site renders a qualitative placeholder until the owner approves a figure.

---

## 1. PRODUCT TRUTH (source: `~/Desktop/cff_projects/cff_pc`) — canonical

**What it does**
- Syncs a **logged-in (identified) customer's** cart across devices/browsers/return-visits. Runs on
  storefront page load via a **theme app extension**; a login/restore flow + an `AjaxCartObserver`
  that POSTs the cart to the server on every cart mutation (add/update/change/clear).
- **Scope = logged-in customers only.** `window.cffCustomer` is defined only inside Liquid
  `{% if customer %}`. Carts keyed by `customerID-shopifyDomain`. **Guests get no cross-device sync**
  (standard Shopify session only). State this plainly — it's an honesty + trust lever.
- **Default = silent auto-merge (CONFIRMED in code).** `popUpOn` defaults false, `emptyCartOnLogout`
  defaults true → login fires a silent **additive** merge, no popup/email/opt-in.
- **Optional conflict prompt** (merchant sets `popUpOn=true`): shopper sees a modal to **combine** carts
  or **load the saved cart**. Not the default.
- Attribute-only differences sync **quietly** (no loader/reload) since 2026-06-10.

**Install / onboarding**
- Theme app extension (app embed), `target: head`. **No Liquid/theme-code editing.**
- **NOT fully zero-touch:** 1-click install, but activation needs the merchant to **enable the app embed
  in the Theme Editor**. Admin shows a 3-step setup guide (Activate → notifications email → free audit).
  ~14% of paying stores lose activation on a theme change (real friction). → On-site copy: "one click +
  flip one switch," don't over-claim "zero setup."

**Pricing — MAJOR CORRECTION (drives `/pricing`)**
- **Tiers do NOT gate features.** Every tier is labelled "(Unlimited)" with the **identical feature set**.
  The tier is **auto-selected by the merchant's own Shopify subscription plan**, not usage/features/size:
  - Shopify **Plus** → **$99.99** · **Advanced** → **$24.99** · **Grow** (formerly "Shopify") → **$8.99**
    · Basic/other → **$4.99**. 30-day trial (confirmed `trial_days: 30`).
- Frame as **"priced to your Shopify plan — every feature included on every plan."** NOT feature tiers.
- Charges lock at creation price for life; **71% of current payers are grandfathered at a legacy flat
  $3.99** → published prices apply to **new** installs. No free plan today (competitors mostly have one).

**Data handling / trust** (for the homepage "data handling" section)
- Stores the customer's cart (items, qty, note, attributes, cart token) keyed by customer ID + shop domain
  in Redis/KV; plus a cart-token→customer pairing. `window.cffCustomer` exposes the logged-in customer's
  name/email/id to the storefront script. Writes a `persistent_cart` order tag (`write_orders` scope).
- **GDPR CAUTION:** the 3 mandatory webhooks exist but are **acknowledgment stubs (log + 200), no automated
  redaction logic visible.** → **Do NOT claim automated GDPR erasure/redaction.** Safe copy: "we access only
  what's needed to sync the cart; data requests are handled per Shopify's required flows" (no automation claim).

**B2B / Plus**
- Handles large carts (observed 78 variants / 136 items). Shared B2B workstations safe (no cross-account
  cart leakage). **Limitation:** restore uses an anonymous Storefront API token → buyer-specific B2B
  catalogs/quantity-ruled lines may not restore (captured as warnings). **Draft-orders / wholesale =
  admin roadmap, NOT a shipped storefront feature** → do not market draft-orders as current core capability.

**Real app-backend metrics found [INTERNAL — owner sign-off before publishing]**
- 978 stores actively billing (2026-06-03); 299 current-Plus-plan stores billing; 9,171 lifetime
  token-bearing install docs. 968 activated (789 paying + 179 free). 39,745 Partner lifecycle events 2016→26.
- **~8–12k true cross-device item-transfer syncs/day.** Sync-tied merchant order value (30d) **$26.0M**
  (7.2% of all order value); ~$2,874 sync-tied GMV per $1 billed; 63% of paying stores have sync-tied revenue.
- **MRR $9,947.22/mo** and aggregate merchant GMV $358.6M/30d — **internal, never an app claim.**

---

## 2. PROOF NUMBERS for config (source: `~/dev/CFFPC_Growth_Claude_Project`, install-source analytics)

| Field | Value | Source / caveat | Publish? |
|---|---|---|---|
| Active installs (live) | **1,486** | Partner dashboard ~2026-06-02 (`docs/ANALYTICS.md:39`) | qualitative placeholder; surface real to owner |
| Distinct stores ever served | **5,445** | distinct shop_domain 2016→2026-06 (`processed/installs_*.csv`) | supports "thousands of stores since 2016" |
| First-time installs (events) | **~11,8xx** | re-installs counted; ≠ distinct stores | internal |
| Distinct paying stores (all-time) | **4,071** (74.8% install→paid) | `app_plans_*.csv` | strong "paid-utility" proof |
| Plus stores | **130–299** | 137 all-time-on-Plus (growth repo) vs 299 current-billing (app repo) — reconcile w/ owner | supports "hundreds of Plus stores" |
| Advanced-tier stores | **34** | both repos agree | — |
| Rating | **4.8★** (live 2026-06-30; was 4.9 in brief) | use live listing only | yes (re-verify) |
| Reviews | **45** (live 2026-06-30; was 46) | don't headline; link to listing | yes (as link) |
| Pricing from | **Free Starter** (≤10 syncs) then **$4.99/mo**, 30-day trial | NEW free plan live 2026-06-30 → "Start free" | yes |
| **NOT FOUND in growth repo** | carts-transferred count, revenue-influenced, AOV/CR lift | the app repo (§1) HAS syncs/day + sync-tied GMV, but **internal** | owner sign-off |

**Net:** placeholders `storesServed`/`plusStoresServed`/`syncedCartRevenue`/`cartsTransferred` can be backed by
REAL measured data, but it's the **owner's internal data → render qualitative text, list real figures in
owner-inputs for sign-off.** "Hundreds of Plus stores" and "thousands of stores since 2016" are now **known true**.

**Channel truth (load-bearing):** cold email drove **0 attributable installs** (478 sends → 0). **Organic App
Store discovery/ASO is the only proven install lever** to date; the **partner/affiliate channel is the new bet.**
→ Site reinforces ASO (educational/keyword pages) + makes the partner program excellent. Don't replicate cold email.

**Listing funnel:** real-view→install ≈14% (healthy). Gap is **discovery/traffic, not conversion.** Reviews show
no measurable install lift (rating = table-stakes). ASO search terms: top = **"cart sync"** (~28); cross-device
cluster highest-intent; "persistant" misspelling ~22 (cover it).

---

## 3. COMPETITORS (source: `~/dev/shopify_app_cloning_analysis`, verified vs parquet)

| App (handle) | Rating/Rev | Launched | BFS | Pricing | Notes |
|---|---|---|---|---|---|
| **Ours** `cart-persistify` | 4.9★ / 46 | 2016-05 | ✅ | $4.99–$99.99, no free, 30-day trial | Original, most-reviewed. Own ~52% of category reviews. |
| **Casper – Cart Sync** `cross-device-cart` | 4.7★ / 28 | 2022-06 | ✅ | Free(dev-only)→$15→$35, 5-day trial | **THE rival.** Outcome-led, "no pop-ups", ghost mascot, B2B/draft-orders wedge, named support (Clément). We out-rate + out-volume. |
| **Name-twin** `persistent-cart-abandoned-cart` (Appify) | 5.0★ / ~5 | 2025-01 | ✅ | $9.99 | ⚠️ Character-identical name. Ironically ships email-reminders + exit popups (what we market against). Brand-confusion risk. |
| Firecart `firecart` (Uptek) | 4.9★ / 5 | 2025-01 | ❌ (NOT BFS — corrects brief) | Free / $9.99 | "Install & forget", partner-friendly. Credible newcomer. |
| CartSaver `addify-persistent-cart` | – / 0 | 2024-12 | ✅ | — | No traction. (≠ `cart-saver`=PluralCart 3.8★/15.) |
| Tihomak Cart Sync Pro | – / 0 | 2026-05 | ✅ | — | Brand new, no traction. |
| Persistent & Share Cart (Hubify) | – / 0 | 2021 | ✅ | $6.99 | Share-cart (send link to friend) is its distinct feature. |
| Clone swarm (9) | 0–4 each | 2025–26 | mixed | mostly free | Commodity "real-time sync", no traction. |

- **Market:** 16 dedicated apps share **89 all-time reviews**; we own **52%** (we+Casper = 83%). <0.5% store
  penetration despite >50% of shoppers cross-device. **Low-awareness, near-empty category** (not crowded).
- ⚠️ **Correction:** "Cartbite" (brief) = a back-in-stock app, **NOT** a cart-sync competitor. Drop it.
- **Indirect** (Klaviyo/Omnisend/Recart/PushOwl/Amplified): threat LOW; different buyer; bundled "free cart"
  is frozen bait. **Position WITH not against:** "Recover the carts your email flows never see." Email/SMS fires
  *after* the cart is gone and only reaches opt-ins; we restore instantly for 100% of logged-in shoppers.
- **No dedicated persistent-cart competitor has a marketing site at all** → a strong educational site
  leapfrogs the whole niche. Winning landing pattern: outcome hero w/ review/brand count in H1, big-number
  proof triplet, named testimonials, pillar deep-dives, repeated low-friction CTA, explicit pricing + FAQ.
- **Differentiation (ranked):** (1) **incumbency/trust moat** — "the original Shopify cross-device cart app,
  trusted since 2016, most-reviewed (4.9★)." Defensible as *Shopify-first-by-~6-years*; **NOT "coined the term"**
  (Magento prior art). (2) Problem-education (wide-open lane). (3) Structural fix vs lossy recovery. (4) Focused
  no-bloat specialist. (5) Comparison pages vs Casper (cheaper, longer trial, higher rating, since 2016 — concede
  its B2B/named-support edges) and vs the name-twin (tenure + review volume).
- **ASO:** subtitle is weakest/highest-leverage (lead w/ outcome verb + keywords); icon is worst asset; add
  mobile screenshots; lead screenshots with the win + a quantified counter (Casper shows "1428 carts saved/30d").

---

## 4. VOICE, VALUE-PROPS & OBJECTIONS (source: `cff_pc/engagement` + `email-templates`)

- **Voice:** founder-personal — signed **"Dave, Founder, Persistent Cart (Customer First focus)"**, warm,
  reply-driven ("I read every one"), "Thanks for using Persistent Cart." Plain, small-team, trustworthy.
- **Signature frame:** carts **"grow and follow them across every device — no more lost items, no more
  frustrated shoppers starting over."** Amazon-parity already used: "match what shoppers already expect from
  major stores like Amazon." WITH-vs-WITHOUT (green/red) framing works.
- **Real per-store ROI anecdotes [owner permission to feature]:** techbino ~$264k/30d on a $4.99 plan;
  vdbparts ~€94k/30d from 268 orders. (Anonymized case-study potential.)
- **Objections → answers:** "worth the price?" ($99 churn "not worth $99") → ROI ≫ price; "does it actually
  work?" → measurable syncs + 90-second test; **popup/loader friction** → **auto-merge default, no popup, faster
  sync**; merge safety ("cart dropped 20→6") → safe additive merge + settings; "setup hassle" → one click + one switch.
- **Verbatim problem language (copy-mine):** "carts go empty switching desktop/mobile", "cart disappears
  randomly", "this should not happen anymore." **Benefit:** "yours is the only one that works", "install and forget."
- **Verticals:** wholesale/B2B/parts (high AOV) = the core pain. International base; multi-currency matters.
- **No partner/affiliate program exists yet → all partner copy is greenfield (create from scratch).**
- ⚠️ Cold-outbound deliverability note: in COLD email, avoid "Shopify bug"/"revenue leak"/"broken checkout".
  On our OWNED educational site the "silent leak" framing (brief §5) is fine — but keep it precise and verifiable.

---

## 5. KEYWORDS & GEO (web)

**English clusters** (primary → long-tail; intent I/C/T/P):
- **Cornerstone:** `persistent cart Shopify` (C) · save/remember cart Shopify · keep cart after logout (P) · Shopify cart not saving (P)
- **Cross-device:** `cross-device cart sync Shopify` (C) · sync cart across devices · mobile↔desktop · cart not syncing across devices (P)
- **Pain:** `Shopify cart disappears after login` (P) · cart empties when I log in · lost cart after signing in · cart cleared on different device
- **Prevention vs recovery:** `cart abandonment prevention Shopify` · prevent abandoned carts without emails · recovery vs prevention
- **B2B/Plus:** `Shopify Plus persistent cart` · B2B cart save · wholesale cart sync
- **Comparisons:** `best persistent cart app Shopify` · vs abandoned-cart email app · Casper/Firecart alternative
- **GEO/FAQ gold (definitive yes/no):** "Does Shopify save carts across devices?" → **No** (cookie/session-based;
  guest carts single-browser; ~14-day cart cookie). Answer flatly, then the fix.

**Per-locale phrasing (in-market, not literal) — feed the glossary:**
- **DE:** `Warenkorb`; key compound **`geräteübergreifend`**; colloquial "Warenkorb speichern/merken" > "persistent";
  pain "Warenkorb wird nicht gespeichert / verschwindet".
- **FR:** `panier`; "panier persistant", "synchroniser le panier entre appareils", "sauvegarder/enregistrer le
  panier" (more natural than "persistant"); pain "panier vidé après connexion".
- **ES:** `carrito`; "carrito persistente", "sincronizar carrito entre dispositivos", "guardar carrito"; pain
  "se borra/pierde el carrito al iniciar sesión".
- **JA:** `カート`; **abandonment = `カゴ落ち` (kago-ochi), never literal**; "デバイス間でカート同期", pain "ログインするとカートが消える".
- **KO:** dominant term **`장바구니` (basket), not 카트**; abandonment `장바구니 이탈` (biggest literal-translation trap).
- **ZH-CN:** `购物车`; abandonment `弃购`; "跨设备同步购物车". **NL:** `winkelwagen`. **IT/PT:** `carrello`/`carrinho` + abandoned
  `carrello/carrinho abbandonado`. **SV/DA/NB:** `varukorg`/`indkøbskurv`/`handlekurv`. **FI:** `ostoskori`.

**GEO/AEO best practice (2025–26):** Princeton GEO findings hold *directionally* — **adding statistics, citing
sources, adding quotations** drive the biggest citation lift; keyword-stuffing hurts. Highest leverage:
1. **Answer-first chunks** (40–60-word direct answer opening each page/section).
2. **Citation-worthy substance** (real stats, named quotes) — least fakeable.
3. **Crawlability** — DON'T block GPTBot/ClaudeBot/PerplexityBot (the #1 silent killer).
4. **Entity signals** — `Organization`/`SoftwareApplication` + **`sameAs`** to verified profiles.
5. **Extraction schema** — FAQPage/HowTo/Breadcrumb (aids extraction; not a gate).
6. **Freshness** — real `dateModified`; refresh cornerstone when content changes (not on a timer).
- **Cargo-cult (ship but don't expect lift):** `llms.txt` — no major LLM crawler requests it; Google declined
  support. Harmless. Don't claim it drives citations. Schema/FAQ stuffing ≈ keyword-stuffing penalty.

---

## 6. DESIGN SYSTEM (web) — locked direction

**Direction:** light, warm, **editorial** — paper + ink + ONE surgical accent. Anti dark-AI-SaaS. **Evolve**
navy+orange (keep equity, kill the gradient). Real Shopify "Your cart" UI as the hero; animate sync with DOM+SVG.

**Palette (tokens):** Paper bg `#F7F4EE` · Card `#FFFFFF`/`#FCFBF8` · Ink `#1C1815` · Secondary `#5C544B`
· Hairline `rgba(28,24,21,0.10)` · **Accent (the ONE)** burnt-marigold `#D8541E` (hover `#B8430F`, tint `#F6E6D8`)
· Optional deep band (footer/proof) ink-navy **`#14233A`** (flat, never gradient) · Evergreen alt `#1E5B45`.
- **Primary CTA = ink button** (`#1C1815`, paper text); orange reserved for accents/underlines/active + sync states
  (white-on-orange fails body contrast).

**Type (all OFL/MIT, self-host via Fontsource):** Display **Fraunces** (variable serif, editorial). Text/UI
**Hanken Grotesk** (warm humanist grotesque, not Inter). Mono **IBM Plex Mono** (cart SKUs/prices/totals).

**Spacing/shape:** 4/8px grid (Polaris-native), content max ~1200px, section padding 96–160px. Radius 8px
default / 12px large containers / full for tags. Hairline borders first; two-tier low-opacity shadows
(`0 1px 2px rgba(28,24,21,.04), 0 8px 24px rgba(28,24,21,.06)`); **no glows/blobs/gradients**.

**Motion (explains the product):** phone (left) + laptop (right), each a realistic "Your cart" line-item list as
**real HTML/CSS DOM**. Loop: change qty / new line item in phone → a "data packet" dot travels an inline-SVG
`<path>` (offset-path / stroke-dashoffset) → laptop cart matches, subtotal **counts up**, `Synced ✓` ticks.
Tech: **CSS + Web Animations API + IntersectionObserver**. Avoid SMIL. `prefers-reduced-motion` → render the
**end state** (both carts synced, static ✓). No third-party retailer screenshots/footage (license risk).

**Build foundation:** static-first islands; Tailwind **v4 `@theme`** CSS tokens; **hand-roll** marketing
components to tokens. Interactive bits (FAQ accordion, mobile nav, language switcher, calculator, pricing toggle,
tabbed demo) as **minimal vanilla TS islands** (`client:visible`/`idle`) — decision: skip React/shadcn to keep
JS tiny + license-clean + avoid island-context pitfalls (log as deviation: perf + simplicity). Icons **Lucide**
(MIT). References to borrow from: Anthropic (warm light base), Linear (feature-row rhythm/micro-motion), Stripe
(each feature a crafted module w/ bespoke diagram), Resend (hairline borders + big serif), Vercel (type density),
Raycast (product-as-hero in frames), Shopify Polaris (native-feeling cart → instant merchant trust).

---

## 7. TOOLING & INFRA (web) — selected stack

- **Hosting: Netlify** (primary). Native **Netlify Forms** = zero-credential lead capture at handoff (honeypot +
  spam filter; 100 subs/mo free; commercial OK). Cloudflare Pages = scale fallback (no native forms → needs Worker).
  Env: `PUBLIC_SITE_URL`; optional CI `NETLIFY_AUTH_TOKEN`,`NETLIFY_SITE_ID`.
- **Partner payout: FirstPromoter** (primary; server-side **Tracking API** fits Shopify **Billing API** — there's
  no Stripe webhook for app installs; flow = `?via=CODE` cookie → OAuth `state` → app backend `APP_SUBSCRIPTIONS_UPDATE`
  webhook → server-side conversion to FirstPromoter). 0% txn fee, $49/mo. **Fallback: Rewardful** ($49). Provisional
  terms (defensible 2026 SaaS norm): **30% recurring for 12 months, 90-day cookie window** (mark "provisional —
  pending owner confirmation"). Env: `PUBLIC_FIRSTPROMOTER_CID` (client), `FIRSTPROMOTER_API_KEY` (server/app).
  ⚠️ Payout itself needs **Shopify-app backend** glue (out of scope for static site; site only sets `?via=` cookie).
- **Analytics: GA4** (`PUBLIC_GA4_MEASUREMENT_ID`) + **Plausible** (cookieless, no-consent, `PUBLIC_PLAUSIBLE_DOMAIN`,
  ~€9/mo). Skip PostHog v1. Track: install-outbound clicks, audit submits, partner submits, calculator usage.
- **Search Console + Bing:** DNS TXT or `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION`; submit sitemap.
- **Forms:** Astro form → Netlify Function: (1) always capture via native Netlify Forms + email owner
  (`LEAD_NOTIFY_EMAIL`); (2) if `RESEND_API_KEY` → confirmation email; (3) if HubSpot keys → CRM push. Honeypot +
  submission-time trap + edge rate-limit. CRM upgrade = **HubSpot Free** (`HUBSPOT_PORTAL_ID`,
  `HUBSPOT_FORM_GUID_AUDIT`,`HUBSPOT_FORM_GUID_PARTNER`).
- **Transactional email: Resend** (3,000/mo free; `RESEND_API_KEY`, `EMAIL_FROM=noreply@persistentcartapp.com`;
  owner adds DKIM/SPF/DMARC DNS).
- **Cookie consent: Klaro!** (open-source, free, full i18n, Consent Mode v2, no key) gating GA4.
- **Cost:** $0 to launch; ~$58/mo once FirstPromoter + Plausible switch on.

---

## 8. PARITY EVIDENCE & SHOPIFY GAP — VERIFIED 2026-06-30 (R5, live browser); re-verify at publish

**Anchor on Walmart + Amazon (both first-party, explicit quotes). eBay = supporting/implicit. Target = use carefully.**

- **WALMART** [HIGH, first-party]: *"A Walmart account makes shopping easier… You can track and manage your orders,
  save addresses for faster checkout, **access your cart across multiple devices**, view your order history…"*
  — Help Center, "Create or Edit an Account", `walmart.com/help/article/create-or-edit-an-account/147a20c9cada4d75b8e0128b16fb6fda`
  (no date shown; accessed 2026-06-30). **Strongest single quote — lead with it.**
- **AMAZON** [HIGH, first-party — REAL quote, not fabricated]: *"Items added to your Shopping Cart will be available
  from any compatible web browser or Amazon Mobile app that has been signed in to your account."* — "About the Shopping
  Basket", Amazon Customer Service, `amazon.sg/gp/help/customer/display.html?nodeId=GU235AYZNKC6PDGQ`. ⚠️ SG-locale page
  (.com node was 503-blocked); behavior identical across locales — cite as Amazon help, note locale if challenged.
- **EBAY** [MEDIUM/PARTIAL]: first-party "Your shopping cart" page implies a single per-account cart across sites but
  has **no explicit "syncs across devices/app" sentence**; the explicit statement exists only in eBay **Community**
  (member, not staff). → Use eBay as soft support ("a single account-level cart"), don't hang a hard claim on it.
- **TARGET** [counter-example, PARTIAL]: first-party confirms **lists** sync ("Your list lives in your Target account
  so it syncs across all your devices") but no first-party statement the **cart** doesn't sync. → Either drop Target or
  frame precisely ("Target syncs your *list* to your account") — don't assert "cart doesn't sync" as first-party fact.

**Shopify gap (Appendix C — now well-supported):**
- Shopify **cookie policy** [first-party HIGH]: cookie **name "cart"**, *"Contains information related to the user's
  cart"*, **duration 2w** → cart held in a first-party browser cookie. `shopify.com/legal/cookies`.
- shopify.dev **changelog** [first-party HIGH, 2024-05-06]: *"The cart cookie value for the Online Store now includes a
  key param."* → browser cart cookie is current. `shopify.dev/changelog/cart-cookie-value-now-includes-key-param`.
- Shopify **Community** [MEDIUM]: 2026-04-21 *"Cart data is still tied to a specific session based on the device and
  browser the customer uses."*; 2023-11-22 cross-device cart *"would require custom code."*
- **New customer accounts did NOT close the gap** [MEDIUM — inferred from architecture + 2026 community + a 2026-05-11
  merchant review noting it "surprisingly doesn't come 'standard' with Shopify"]. No explicit Shopify denial exists →
  phrase as "still not native as of 2026", not "Shopify says it doesn't."
- **Always say "across devices and browsers"** (same-browser cart *does* persist ~2 weeks). Never "Shopify doesn't save carts."

## 8b. LISTING CORRECTIONS — VERIFIED 2026-06-30 (supersede brief baseline)
- **Rating = 4.8** (brief said 4.9) · **Reviews = 45** (brief said 46): 5★×36 / 4★×7 / 3★×1 / 1★×1. → config `reviewRating:4.8`, `reviewCount:45`.
- **A FREE plan now exists:** "**Free Starter** — Test All Features Up to 10 Cart Syncs". Then **Basic $4.99 · Grow
  $8.99 · Plus $99.99** on the live listing. (Code/R1 also has **Advanced $24.99**; not surfaced on the live listing —
  flag to owner.) **This neutralizes the "no free tier" competitive gap → site can say "Start free."**
- Listing is **English-only** (app UI may support more, but the *listing* is EN-only) → strengthens "localize the listing".
- Listing already says: *"Shoppers browse across devices, but Shopify carts don't follow when they switch devices."*
- Green Mountain Diapers review dated **2025-10-29**; a **2026-05-11** review calls cross-device "surprisingly not standard".
- **Casper** re-verified: **4.7 / 29 reviews**, Standard $15 / Plus $35, 5-day trial, dev Outis (Lons-le-Saunier FR), 2022-06-28.
- Aggregators estimate ~1,540 installs (declining) — loosely corroborates the **~1,486 active** figure; aggregators unreliable, don't cite.

---

## 9. STAT BANK (brief Appendix A — cite source + date; measured vs modeled)
- ~**70%** avg cart abandonment — Baymard, Sep 2025 (measured; anchor).
- ~**$260B** recoverable US+EU via better checkout — Baymard, Sep 2025 (use; not the inflated $4.6T).
- **88%** want seamless omnichannel — Bazaarvoice SXI Vol.18, Nov 2024.
- Mobile abandonment **80.0%** vs desktop **66.4%** — Baymard, Sep 2025 (supports cross-device).
- **90%** move between devices / **98%** switch devices in a day — Google/Ipsos, **2012 (label old)**.
- **41%** who bought on smartphone started on another device — Barilliance, **2014 data (label old)**.
- Omnichannel shoppers spend **4% more in-store / 10% more online** — HBR/Medallia, 2017.
- Abandoned-cart emails convert ~**10%**; recovery tools recover ~**3–5%** of carts — industry, 2024–25 (estimate).
- **AVOID:** "saving carts cuts abandonment ~20%", "cross-device convert 27% more", "$4.6T abandoned". The
  device-switch→lost-sale chain is a **reasoned inference, not a published finding** — present it as such.
