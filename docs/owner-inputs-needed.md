# Owner Inputs Needed — persistentCartApp.com

> **LEAN-V1 UPDATE (2026-07-04): only 3 inputs matter for the v1 launch.**
> 1. ~~Proof numbers~~ **RESOLVED 2026-07-06**: owner approved "$60M+ synced-cart order value /
>    90 days" + qualitative "thousands of stores, hundreds on Shopify Plus" — live on site.
> 2. ~~Privacy policy decision~~ **RESOLVED 2026-07-07**: formal policy ported verbatim from
>    persistify.herokuapp.com/privacy to **/privacy-policy** on-domain; /privacy explainer
>    links it. ⚠️ Two follow-ups flagged for the owner in §4 below.
> 3. ~~Green Mountain Diapers review~~ **RESOLVED 2026-07-07**: owner confirmed featuring it.
>
> **All three v1 launch inputs are now resolved.** The 2026-07-07 owner directives are also
> ✅ SHIPPED (cycle 6): customer-logo strip live (Extended 11, toggleable via
> `showCustomerLogos`), impact stat now **"$30M+ — last 30 days"** (owner-approved; internal
> June measurement was $26.0M/30d — the number is the owner's), FAQ adds ("Works with Shop",
> "no time limit") + pricing "no usage fees" line live in all 15 locales. Shopify Plus logo:
> **no official public lockup exists** — "Shopify Plus" stays text (see brief backlog #5).
>
> **NEW (2026-07-07, cycle 7): dashboard "Cart Transfer Value" snapshot is LIVE on
> /how-it-works** — static recreation, real anonymized figures (8,069 · 1,974 · $452,836,
> one unnamed store's last 30 days, captioned "snapshot captured July 2026"). ⚠️ Awaiting
> your content sign-off on the live section — copy, framing, and figures are exactly per
> your 2026-07-07 batch answers, so this is confirm-or-tweak, not a blocker.
>
> **OPEN — Shopify trust visibility (owner note 2026-07-07: "not even clear this is a
> Shopify app").** Already shipped same day: hero rating line now reads "4.9★ rating on the
> **Shopify** App Store" ×15 (also fixed 9 locales that doubled the "4.9★"). What exists
> today: announce-bar positioning line, "thousands of Shopify stores … hundreds on Shopify
> Plus" strip lead, official BFS badge at 32px (kit min 30). Your call on going louder:
> **(a)** enlarge the BFS badge to 40–44px and/or move it left, ahead of the lead
> (kit-safe, cheap — recommended); **(b)** add Shopify's official dark "Shopify App Store"
> badge next to the primary hero CTA (different mark from BFS so the one-per-page kit rule
> doesn't collide; we'd fetch it from Shopify brand assets + read its usage terms —
> recommended); **(c)** bold "Shopify Plus" inside the strip lead (Plus has no official
> public lockup — text is the guideline-correct ceiling, cycle-5 finding); **(d)** leave
> as is. Say the letters and it ships.
>
> Everything else below belongs to deferred v2 features (partner terms, audit fulfillment,
> calculator) or optional integrations — see `docs/v1-recommendation.md`. The v1 site launches
> safely on placeholders without any of it.

**The single place to finish the site.** The site is built and launch-ready *except* for the
items below, which only you can supply. Each item says: what's needed, why, where it plugs in,
the placeholder in use, and whether launch is safe without it. Nothing here blocks a soft launch
in English — most items make the site richer or activate a paid integration.

Legend: 🟢 = launch-safe without it (placeholder in place) · 🔴 = needed before that feature works.

---

## 1. Proof numbers 🟢 (qualitative placeholders are live; real figures need your sign-off to publish)
We found **real, measured numbers** in your own analytics repos, but they're internal — the site
currently shows safe qualitative text ("thousands of stores", "since 2016", "4.8★"). Tell us which,
if any, to publish as specific figures, and we'll wire them into `src/config/site.ts → proof`.

| Config field | Safe placeholder shown now | Real figure we found (internal — confirm before publishing) |
|---|---|---|
| `storesServed` | "thousands of Shopify stores" | ~**1,486 active installs** / **5,445 distinct stores all-time** (since 2016) |
| `plusStoresServed` | "hundreds of Shopify Plus stores" | **~130–299** Plus stores (reconcile: 137 all-time-on-Plus vs 299 current-billing) |
| `syncedCartRevenue` | "millions of dollars in cross-device carts" | ~**$26M / 30 days** in sync-tied merchant order value |
| `cartsTransferred` | "thousands of carts a day" | ~**8–12k** true cross-device cart syncs/day |

*Recommendation: publishing "trusted by 5,000+ Shopify stores since 2016" and "hundreds of Plus stores"
would be true and far stronger than the placeholders. Round however you're comfortable. We will not
publish any specific number without your explicit OK.*

## 2. Permissions to feature merchants 🟢
- **Green Mountain Diapers** testimonial (their review states our entire thesis) — currently quoted from
  the public App Store listing with attribution. Confirm you're comfortable featuring it prominently.
- Optional case studies we can build if you get permission: **techbino** (~$264k/30d on a $4.99 plan),
  **vdbparts** (~€94k/30d) — anonymized or named. 🔴 to publish.
- `namedMerchantLogos` is empty — supply logos + permission to show a "trusted by" logo bar.

## 3. Brand & assets 🟢
- Confirm or adjust the proposed visual identity (warm paper + ink + burnt-marigold accent; Fraunces +
  Hanken Grotesk + IBM Plex Mono). It's live across the site.
- Provide final **logo files** if you have them (current mark is an original SVG we made).
- Approve the proposed **new App Store icon + screenshot concepts** (see `docs/app-store-optimization.md`).
- A default **OG share image** is generated at `public/og/default.png` — replace if you want a custom one.

## 4. Privacy policy ✅ RESOLVED (2026-07-07)
The formal policy was ported **verbatim** from persistify.herokuapp.com/privacy to
**persistentcartapp.com/privacy-policy** (formatting only; no wording changed). The `/privacy`
explainer and footer link to it.
- ✅ **Contact address aligned (owner decision 2026-07-07):** the site now uses
  **support@customerfirstfocus.com everywhere** (no @persistentcartapp.com addresses),
  matching the policy. The deferred Resend sender examples were updated to
  noreply@customerfirstfocus.com (DKIM/SPF for customerfirstfocus.com needed when activated).

### Privacy-policy improvements — documented for a future revision (owner-approved backlog)
When you next revise the policy text (any wording change needs your sign-off):
1. **"Anonymous cart" wording:** the policy says cart data is "anonymous … without personally
   identifiable information," while the app keys carts to the customer ID and the site
   explainer says carts are stored "against the customer's account." Align the policy with
   the more precise explainer language (legal-review §3.2).
2. **Sub-processor disclosure:** name the processors behind the site/app (Netlify hosting,
   Google Analytics — consent-gated; plus Redis/hosting for the app backend) per
   legal-review §4.2.
3. **Effective/updated date:** the policy carries no date; add one at the next revision.
4. **Deletion mechanics:** describe how/when deletion actually happens once the GDPR webhook
   handlers perform real redaction (currently acknowledgment-only — research-notes §1).

## 5. Pricing 🟢 (confirm)
- Confirm the tiers shown: **Free Starter** (≤10 syncs) · Basic **$4.99** · Grow **$8.99** · Advanced
  **$24.99** · Plus **$99.99**, 30-day trial on paid. **Note:** the live listing currently shows Free /
  $4.99 / $8.99 / $99.99 — the **$24.99 Advanced** tier is in code but not surfaced on the listing.
  Tell us whether to show Advanced on the site (currently shown) or hide it to match the listing.
- Approve the framing: **"every feature on every plan, priced to your Shopify plan."**

## 6. Partner & affiliate program 🔴 (to finalize terms) / 🟢 (forms capture now)
Provisional terms are shown on `/partners` + `/affiliates`, marked *provisional*: **30% recurring for
12 months, 90-day cookie**, via **FirstPromoter**. Confirm/replace:
- Commission rate(s) and payout terms · attribution/cookie window · approval criteria.
- Where partner/affiliate applications should go (email / CRM / FirstPromoter).
- Any existing partner relationships to feature.
- ⚠️ The payout *tracking* needs backend work in the **Shopify app itself** (Billing webhook →
  FirstPromoter); the marketing site only sets the `?via=` referral cookie. See `docs/partners.md`.

## 7. Free audit 🔴 (fulfillment) / 🟢 (capture now)
The `/free-audit` form captures leads at handoff (Netlify Forms, zero setup). Tell us:
- Where audit leads should go (`LEAD_NOTIFY_EMAIL`, and/or HubSpot).
- Who fulfills the audit + turnaround (page currently promises "1–2 business days").
- Confirmation-email copy/sender (a default goes out via Resend once `RESEND_API_KEY` is added).

## 8. Localization 🟢
- The locale count is fixed at **15** (English canonical + 14 machine-translated, shipped `noindex`
  until native review). Tell us which locales to prioritize for **native review** so they flip to
  indexable (recommend: German, French, Spanish first — your review/search signal concentrates there).
- See `docs/localization.md` for the standing rule + how review works.
- *Minor:* a handful of keys added during the final review pass (partner earnings example, affiliate terms,
  the ROI FAQ) are currently English placeholders in ~7 locales — they'll be replaced on the next
  `npm run i18n:sync` with an LLM key, or during native review. Harmless (those locales are noindex).

## 9. Accounts & billing to register 🔴 (you register; we've scaffolded the integration)
You said "just tell me what to register." Full detail + env-var names in `docs/tooling-and-accounts.md`.
**Live at handoff with NO keys:** Netlify (hosting + form capture), the consent banner, the whole English site.
**Activate by adding a key (each degrades gracefully until then):**

| Register | Unlocks | Key(s) → where |
|---|---|---|
| **Netlify** (+ point DNS) | hosting, deploy, lead capture | connect the Git repo; no key |
| **GA4** | analytics | `PUBLIC_GA4_MEASUREMENT_ID` → Netlify build env |
| **Plausible** (optional) | cookieless stats | `PUBLIC_PLAUSIBLE_DOMAIN` → build env |
| **Search Console + Bing** | indexing | DNS TXT or `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` |
| **Resend** | confirmation + lead emails | `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_EMAIL` (+ DKIM/SPF/DMARC DNS) |
| **HubSpot Free** (optional) | CRM sync | `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID_AUDIT`, `HUBSPOT_FORM_GUID_PARTNER` |
| **FirstPromoter** (~$49/mo) | partner tracking/payouts | `PUBLIC_FIRSTPROMOTER_CID` (+ app-backend glue) |

Rough cost: **$0 to launch**; ~**$58/mo** once FirstPromoter + Plausible are on.

---

## Assumptions made (flag if wrong)
- Rating **4.8★ / 45 reviews** and the **Free Starter** plan were verified on the live listing 2026-06-30
  (the brief said 4.9★/46 and "no free plan" — we updated to match reality).
- Plans are **not** feature-tiered (every plan includes the full app); `/pricing` is framed accordingly.
- Default behavior is **silent auto-merge**; install is **one click + enabling the app embed** (not zero-touch).
- We do **not** claim automated GDPR erasure, and do **not** market draft-orders/wholesale as shipped (roadmap).

## Claims to verify before publishing (also covered in `docs/legal-review.md`)
- Re-confirm rating + pricing vs the live listing at publish time.
- The Walmart/Amazon parity quotes (cited + linked) — re-check the source pages are unchanged.
- The Shopify "browser-cookie cart" gap wording (cited to Shopify's cookie policy + community).
- Calculator output is labeled an **illustrative estimate**, not a measured result — keep that framing.
