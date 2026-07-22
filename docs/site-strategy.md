# Site Strategy — persistentCartApp.com

Decisions that govern the build. Facts live in `docs/research-notes.md`; this is the *why* and *what*.
Owner asks are in `docs/owner-inputs-needed.md`. Status in `docs/build-log.md`.

## 1. Positioning (locked)

**Two-part thesis — demand then preference:**
1. **Parity gap (the hook, manufactures demand):** *The biggest stores keep a signed-in shopper's cart on
   every device. By default, your Shopify store doesn't — and most owners have no idea.* Verifiable: Walmart
   ("access your cart across multiple devices") + Amazon ("available from any compatible web browser or Amazon
   Mobile app… signed in to your account") vs. Shopify's browser `cart` cookie (2-week, device-bound).
2. **Incumbency moat (why us, stops a cheaper clone harvesting the demand):** *the persistent-cart app Shopify
   stores have trusted since 2016 — Built for Shopify, most-reviewed (4.8★), vs. 2025–26 clones with 0–5 reviews.*
   Put incumbency in the hero trust line + as the headline answer at problem→solution + the primary differentiator
   on every comparison page.

**Why this is the right call (evidence):** the category is **low-awareness, near-empty** (16 apps, 89 total
reviews, <0.5% penetration) and **no competitor has a marketing site at all** — an educational site that *teaches
the problem* leapfrogs the niche. Cold email proved dead (0 installs); organic discovery + a partner channel are
the levers. "Educate first, then convert" is not a nicety here — it's the whole game.

**Hero (default H1)** — accuracy-tuned from brief option A:
> **Big retailers keep a signed-in shopper's cart on every device. By default, Shopify doesn't.**
> Sub: *Amazon and Walmart keep a logged-in shopper's cart on every device. Persistent Cart brings that same
> cross-device sync to Shopify — one click, nothing for your customers to do, no emails or popups.*
- Primary CTA: **"Add Persistent Cart — free for 30 days"** (Free Starter retired 2026-07-22 — charge approved at install; lead with the 30-day trial every plan starts with).
- Secondary CTA: **"Get a free store audit."**
- Trust strip: 4.8★ (links to listing) · Built for Shopify · Since 2016.
- Keep the "signed-in/logged-in" qualifier in the headline (it's what makes the claim true). Avoid never/always.

## 2. Audiences (priority order)
1. **Partners & affiliates (#1).** Greenfield — no prior program. Make `/partners` + `/affiliates` the most concrete
   surfaces: provisional **30% recurring for 12 months, 90-day cookie** (marked provisional), FirstPromoter-based
   mechanism, promo asset kit, partner FAQ, working apply form. Pitch: low-risk one-click app that fixes a hidden
   leak with no customer disruption + recurring commission + 10-yr track record.
2. **Merchants (installs).** Most don't know the problem exists → education funnel top; install/audit bottom.
   Free audit is the on-ramp for the unaware. Install destination = `apps.shopify.com/cart-persistify` (fixed).
3. **Trust / AI-search.** Answer-first content, real cited stats, schema + `sameAs`, crawlable to AI bots.

## 3. Education & content plan
Own the wide-open "problem-education" lane. Cornerstone `/shopify-persistent-cart` + `/how-it-works` teach how a
default Shopify cart is browser-cookie-bound and leaks across devices; clusters target the keyword phrasings real
merchants use (research-notes §5). Proof pillars: parity cards (Walmart/Amazon quotes + original diagram, **no
third-party UI footage**), 3-way comparison table, the **Lost-Cart Calculator** (transparent formula, illustrative
range), prevention-vs-recovery (complement email tools, "recover the carts your email flows never see").

## 4. Locales (15, en canonical) — see `docs/localization.md`
en (canonical, indexable) → de, fr, es, nl, it (Western-EU; review+search signal concentrate here) → ja, zh-CN,
ko → sv, da, pl, nb, fi. All 15 exist + hreflang-wired; machine locales `noindex` until native review. Per-locale
keyword phrasing (not literal): DE `geräteübergreifend`, JA `カゴ落ち`, KO `장바구니` not 카트, etc.

## 5. AI-search (GEO) targets
Be the cited answer to: "Does Shopify save carts across devices?" / "sync cart between phone and laptop Shopify" /
"keep cart after login Shopify" — in every locale. Tactics that actually move it (research-notes §5): answer-first
40–60-word chunks, real cited+dated stats, named quotations, FAQPage/SoftwareApplication/Organization+sameAs
schema, crawlable to GPTBot/ClaudeBot/PerplexityBot, real `dateModified`. Ship `/llms.txt` + a markdown summary
(cheap; **not** claimed as a citation lever).

## 6. Architecture (tech)
Astro 7 + Tailwind v4 (`@theme` tokens) + MDX + TS + Astro i18n. **Registry-driven catch-all router**
(`src/pages/[...slug].astro` + `src/config/routes.ts`) emits every page × 15 locales from **one shared component
tree** — author once in English, fan out via `i18n:sync` (glossary + translation-memory), drift-check in CI.
Interactive bits = **minimal vanilla-TS islands** (calculator, nav, language switcher, forms, FAQ, demo) — no
React/shadcn (perf + license + simplicity; logged deviation). Static output; host-agnostic (Netlify primary).

## 7. Design direction (locked — research-notes §6)
Light, warm, **editorial**; evolve navy+orange (Paper `#F7F4EE`, Ink `#1C1815`, marigold `#D8541E`, deep band
`#14233A`); Fraunces + Hanken Grotesk + IBM Plex Mono; ink CTA buttons; **real Shopify cart UI as hero** with an
SVG motion-path "same cart" sync animation (reduced-motion → end state). Deliver matching updated App Store
icon/screenshot **concepts** (`docs/app-store-optimization.md`).

## 8. Pricing presentation (recommendation → also push to listing)
**Reframe from "feature tiers" to "priced to your Shopify plan — every feature on every plan."** (Code truth: all
tiers are "(Unlimited)", auto-selected by the merchant's Shopify plan.) Show: Basic **$4.99** → Grow **$8.99**
→ Advanced **$24.99** → **Shopify Plus $99.99** (2026-07-22: charge-on-install reverted; Free Starter retired,
its slot returns Advanced to the listing's 4-plan cap), 30-day trial on every plan. Don't price-fight Casper; win on value (ROI ≫ price; calculator) + proof + incumbency. No invented uplift %.

## 9. Brand decision
**Keep the name** "Persistent Cart — Sync Devices" (equity + incumbency + exact-match search). **Evolve the visual
identity** (drop gradient; warm editorial system above). Recommend the App Store listing adopt the same identity
(icon/screenshots/subtitle) — captured in `docs/app-store-optimization.md`, incl. the name-twin confusion note.

## 10. Roadmaps (build clean now, flag for later)
- Free-audit "instant check" automation (v1 = lead capture + promised assisted audit).
- Partner payout backend glue (Shopify Billing webhook → FirstPromoter) lives in the *app*, not this site.
- Per-store anonymized case studies (techbino/vdbparts) pending owner permission.

## 11. Deviations from the brief (logged)
1. **Rating/reviews 4.8 / 45** (brief said 4.9 / 46) — browser-verified 2026-06-30; config updated.
2. **NEW Free Starter plan exists** → "start free" positioning; the "no free tier" competitive gap is closed.
3. **Pricing is NOT feature-tiered** → `/pricing` reframed as "priced to your Shopify plan, all features included."
4. **Parity proof leads with Walmart + Amazon** (explicit first-party quotes); **eBay demoted to soft support**
   (first-party wording only implicit); **Target counter-example softened** (only lists-sync is first-party).
5. **No automated-GDPR-erasure claims** (handlers are ack-stubs).
6. **Install = "one click + one switch"** (Theme Editor embed needed; not zero-touch).
7. **Draft-orders/wholesale not marketed as current** (roadmap).
8. **Vanilla-TS islands instead of React/shadcn** (perf/license/simplicity).
9. **"Cartbite" dropped** from competitors (it's a back-in-stock app, not cart-sync).
10. **Real proof numbers exist but are internal** → qualitative placeholders on-site; real figures to owner for sign-off.
11. **Tooling:** Netlify + FirstPromoter (not Rewardful) + Resend + Plausible + Klaro.
12. **No self-review schema** by default (brief-aligned; final call in legal pass).
