# Future Roadmap — built clean now, flagged for later

Work intentionally deferred from the v1 static marketing site, so the build
stays clean and honest today while later phases are clearly scoped. Source:
site-strategy §10 (+ §2, §5) and research-notes (§1, §4, §7).

> **Principle:** ship what we can do honestly now; flag (don't fake) what needs
> backend work, owner permission, or native review.

---

## 1. Free-audit "instant check" automation
- **v1 (now): lead capture + a promised, assisted audit.** The free-audit form
  captures the store and the owner runs/returns an assisted audit. No automated
  scan yet.
- **Later:** an **"instant check" automation** that inspects a store and returns
  a cross-device-cart finding automatically, turning the on-ramp into a
  self-serve instant result. Build v1 cleanly so the form/CTA can later point at
  automation without a redesign.

## 2. Partner-payout backend glue
- **Out of scope for this static site.** The site only sets the `?via=` cookie
  and carries the referral id through OAuth `state` (see `docs/partners.md`).
- **Later (lives in the Shopify APP, not this repo):** the glue that listens to
  the **Shopify Billing webhook** (`APP_SUBSCRIPTIONS_UPDATE` / charge events)
  and fires a **server-side conversion to FirstPromoter** on each successful
  charge. Until this app-side work ships, referral links can be cookied but
  commissions are **not** auto-reported. Needs owner go-ahead + `FIRSTPROMOTER_
  API_KEY` in the app.

## 3. Per-store anonymized case studies
- **Pending owner permission.** Two strong candidates exist (research-notes §4):
  **techbino** (~$264k/30d on a $4.99 plan) and **vdbparts** (~€94k/30d from 268
  orders).
- **Later:** publish as **anonymized** case studies once the owner approves
  featuring them. Until then, no per-store numbers go live (internal — owner
  sign-off).

## 4. Animation / visual polish
- Iterate beyond the first-pass visuals (see `docs/asset-animation-research.md`):
  refine the hero sync animation, parity diagram, auto-merge demo,
  before/after, and calculator viz. Optionally evaluate **Lottie/Rive** for
  richer sequences (license-verify first). Ongoing polish, not a v1 gate.

## 5. Rolling native review of locales
- All 15 locales exist + hreflang-wired, but machine-translated locales are
  **`noindex` until native review** (site-strategy §4).
- **Roll out native review claim-heavy locales first** (the pages with the most
  factual/marketing claims and the concentrated review+search signal — Western
  EU: de, fr, es, nl, it), then the rest; flip each to indexable as it's
  verified. Use the per-locale in-market phrasing (research-notes §5).

## 6. A/B testing hooks
- **Later:** build in A/B testing hooks to optimize headlines, CTAs, and
  pricing presentation against the real conversion funnel (view→install ≈14%
  today). Not in v1; design components so variants can be slotted in later.

## 7. Localizing the App Store listing
- The live listing is **English-only** (research-notes §8b).
- **Later:** localize the App Store listing to the 15 site locales with
  in-market phrasing — full plan in `docs/app-store-optimization.md` §4. No
  competitor listing is localized, so this is durable differentiation.
