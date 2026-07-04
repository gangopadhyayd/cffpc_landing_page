# App Store Optimization — bringing the listing up to the website

Recommendations to update the **Shopify App Store listing** so it matches the
(stronger) marketing site. Source: research-notes §3 (competitors/ASO), §2
(funnel/keywords), §8b (verified listing facts), site-strategy §8–9.

> **Why this matters.** ASO is the **only proven install lever** to date
> (research-notes §2). The listing funnel is healthy (view→install ≈14%); the
> gap is **discovery/traffic, not conversion**. So the job is to make every
> listing field earn more search visibility and carry the same proof the new
> site does.

Install destination is fixed: `apps.shopify.com/cart-persistify`.

---

## 1. Subtitle — the weakest field, highest leverage

The subtitle is the **weakest and highest-leverage** listing field
(research-notes §3). It is prime keyword real estate.

- **Lead with an outcome verb + searchable keywords.** Front-load the terms
  merchants actually search: **"cart sync"** (top search term, ~28),
  **cross-device**, mobile↔desktop, "keep cart after login" (research-notes
  §2/§5).
- Pattern: *outcome verb → cross-device cart sync → for logged-in shoppers*.
  Keep the honest scope qualifier (logged-in/signed-in) that the site uses.
- Cover the **"persistant" misspelling** (~22 searches) somewhere indexable.

---

## 2. Icon — the worst asset

The icon is the **worst current asset** (research-notes §3).

- Propose a **cleaner, single-subject concept** that matches the **new brand
  mark** (warm editorial system — research-notes §6: paper/ink + the one
  burnt-marigold accent `#D8541E`).
- One clear subject (a cart that visibly "follows"/syncs), high contrast,
  legible at small sizes — not a busy multi-element icon. The concept is
  produced as part of the asset work (see `docs/asset-animation-research.md`).

---

## 3. Screenshots

- **Lead with the win + a quantified counter.** First frame = the outcome (the
  same cart on both devices) with a quantified proof number, mirroring how the
  rival Casper leads with "1428 carts saved / 30d" (research-notes §3). Use an
  owner-approved real figure or a qualitative placeholder until sign-off
  (numbers are internal — research-notes §1/§2).
- **Add MOBILE screenshots** — currently a gap; cross-device is a mobile story,
  so show the phone (research-notes §3).
- **Keep the "loss" to ONE before/after frame.** A single cart-lost-vs-kept
  before/after is enough; don't dwell on the negative — lead with the win.
- Follow the same IP rules as the site: **no third-party retailer UI**; use the
  product's own "Your cart" UI and our own diagrams (see asset-animation doc).

---

## 4. Localize the listing

The live listing is **English-only** (verified 2026-06-30, research-notes §8b),
even though the app UI may support more languages.

- **Localize the listing to the 15 site locales** (en + de, fr, es, nl, it, ja,
  zh-CN, ko, sv, da, pl, nb, fi — site-strategy §4).
- Use the **in-market per-locale phrasing**, not literal translation
  (research-notes §5): DE `geräteübergreifend`, JA `カゴ落ち` (never literal),
  KO `장바구니` (not 카트), ZH-CN `购物车`/`弃购`, etc.
- This is doubly worth it because **no competitor listing is localized** — easy
  differentiation.

---

## 5. Pricing presentation crossover

Bring the site's pricing reframe (site-strategy §8) onto the listing:

- **"Every feature on every plan, priced to your Shopify plan."** Tiers do NOT
  gate features — every tier is the identical (Unlimited) feature set,
  auto-selected by the merchant's own Shopify plan (research-notes §1). Stop
  presenting it as feature tiers.
- **Surface the new Free Starter plan** ("Test All Features Up to 10 Cart
  Syncs"), now live (research-notes §8b). This **neutralizes the "no free tier"
  competitive gap** → the listing can say **"Start free."**
- Live listing prices: Free Starter → Basic **$4.99** → Grow **$8.99** → Plus
  **$99.99**. **Flag to owner:** Advanced **$24.99** exists in code/site but is
  **not surfaced on the live listing** — reconcile.

---

## 6. Naming / brand-confusion note (name-twin)

There is a **character-identical name-twin**: **"Persistent Cart"** by **Appify
Creations**, handle `persistent-cart-abandoned-cart`, launched **2025-01**, 5.0★
/ ~5 reviews, $9.99 (research-notes §3).

- **Irony to exploit:** the name-twin actually ships **email reminders + exit
  popups** — exactly the recovery-by-interruption pattern we market *against*.
- **Brand-confusion risk** is real. Defend with what we have and they don't:
  **tenure (since 2016) + review volume (4.8★ / 45, ~52% of category reviews)**.
  Make incumbency unmistakable in the listing title/subtitle/first screenshot so
  a searcher can tell the original from the 2025 name-twin.
- Keep our name "Persistent Cart — Sync Devices" (equity + exact-match search —
  site-strategy §9); differentiate on proof, not by renaming.

---

## 7. What CAN and CANNOT cross from site → listing

**CAN cross (do it):**
- Subtitle keyword/outcome framing; the new icon concept; the win-led +
  quantified screenshots and mobile frames; the localized listing copy; the
  "priced to your Shopify plan / every feature included" pricing frame and
  "start free"; the incumbency-since-2016 positioning; honest scope language.

**CANNOT cross (do not):**
- **Internal/unapproved numbers** (syncs/day, sync-tied GMV, MRR, store counts)
  — owner sign-off required before any appear anywhere (research-notes §1/§2).
- **Third-party retailer UI screenshots/footage** (Amazon/Walmart) — IP/ToS
  risk; the parity *claim* (with cited quotes) can cross, the *visuals* cannot
  (research-notes §6/§8; see `docs/asset-animation-research.md`).
- **Automated-GDPR-erasure claims** — handlers are ack-stubs (research-notes
  §1); don't introduce the claim on the listing either.
- **Over-claims** the listing must also avoid: "zero setup" (it's one click +
  one switch / Theme Editor embed), draft-orders/wholesale as a current core
  feature (roadmap), "Shopify doesn't save carts" (say "across devices and
  browsers"), "coined the term" (Magento prior art).
