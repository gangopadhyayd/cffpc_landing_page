# Partner & Affiliate Program — persistentCartApp.com

How the partner/affiliate program is designed, who it targets, and the exact
mechanism that turns a referral link into a tracked, paid commission. Facts and
tooling decisions live in `docs/research-notes.md` (§7 tooling, §4 voice); this
file is the program design.

> **Greenfield.** No partner or affiliate program exists today (research-notes
> §4). Every term, asset, and flow below is created from scratch. All commercial
> terms are **PROVISIONAL — pending owner confirmation** and must be shown as
> such on-site until signed off.

---

## 1. Why a partner channel at all

Cold email is dead for this product: **478 sends → 0 attributable installs**
(research-notes §2). The only proven install lever to date is **organic App
Store discovery / ASO**. The **partner/affiliate channel is the new growth bet**
— a second engine alongside ASO. The pitch is strong:

- A **low-risk, one-click app** that fixes a hidden cross-device cart leak with
  **no customer disruption** (silent auto-merge default — research-notes §1).
- **Recurring commission** on a sticky, low-churn subscription.
- A **10-year track record** (Built for Shopify, since 2016, most-reviewed
  4.8★) — partners recommend an incumbent, not an unproven clone.

The static marketing site makes `/partners` (and `/affiliates`) the **most
concrete surfaces on the site** (audience #1 in site-strategy §2): provisional
terms, the mechanism, an asset kit, a partner FAQ, and a working apply form.

---

## 2. Audiences (who we recruit)

Three distinct partner types, each with its own angle:

### a. Shopify agencies & developers
Build/manage stores for clients. Angle: **add Persistent Cart to your standard
build/stack** — a one-switch install that recovers cross-device carts for every
client, earning recurring commission per managed store. Emphasize the no-theme-
edit install (app embed) and that it never touches checkout.

### b. Affiliates, creators & review sites
Shopify-app reviewers, YouTubers, newsletter authors, "best Shopify apps"
listicles, course creators. Angle: a **genuinely useful, well-rated app in a
near-empty category** with a clear before/after story and shareable proof tools
(calculator, audit). Easy to demo in 90 seconds.

### c. Consultants & educators
CRO consultants, Shopify coaches, fractional ecommerce leads. Angle: a
**measurable, structural fix** (not lossy email recovery) they can recommend to
clients with confidence, plus recurring income on every referral.

---

## 3. The payout mechanism (FirstPromoter)

**Primary tool: FirstPromoter** (fallback: Rewardful). Both ~$49/mo, 0%
transaction fee.

### Why this is not a normal Stripe affiliate setup
A Shopify app **does not bill through Stripe**. It bills through **Shopify's
Billing API** — merchants are charged on their Shopify invoice, and there is
**no Stripe webhook** for an app subscription or charge. Off-the-shelf affiliate
tools that "just listen to Stripe" therefore cannot see a single conversion.
FirstPromoter is chosen because its **server-side Tracking API** lets us report
conversions from our own backend, which is exactly what the Shopify Billing
model requires.

### The end-to-end flow
```
1. Marketing link:  persistentcartapp.com/...?via=CODE
                     └─ FirstPromoter snippet drops a first-party referral cookie
                        (referral id = CODE), within the attribution window.

2. Install click:   visitor clicks "Add Persistent Cart" → Shopify OAuth.
                     └─ the site passes the referral id through the OAuth
                        `state` parameter so it survives the redirect to Shopify
                        and back to the app.

3. App backend:     on install, the Shopify APP stores referral id ↔ shop.
                     └─ listens to Shopify webhooks APP_SUBSCRIPTIONS_UPDATE /
                        the recurring-charge events.

4. On each successful charge:
                     └─ the app fires a SERVER-SIDE conversion to FirstPromoter's
                        Tracking API (amount + referral id) → commission accrues.
```

### Division of responsibility (critical scope boundary)
- **The static marketing site (this repo) ONLY sets the `?via=` cookie** and
  carries the referral id into the OAuth `state`. That is the full extent of
  what the site does.
- **The payout itself — webhook listener, charge→FirstPromoter conversion,
  referral-id storage — is BACKEND WORK that lives in the Shopify APP, NOT in
  this static site.** It is **out of scope** for the marketing site and is
  tracked as roadmap glue (see `docs/future-roadmap.md`). Until that app-side
  glue ships, links can be cookied but conversions are **not** reported
  automatically.

### Environment variables
- `PUBLIC_FIRSTPROMOTER_CID` — client embed id (site).
- `FIRSTPROMOTER_API_KEY` — server/Tracking-API key (lives in the **app**, not
  the static site).

---

## 4. Provisional commercial terms

> **PROVISIONAL — pending owner confirmation.** Benchmarked to defensible 2026
> SaaS affiliate norms (research-notes §7). Render on-site with a visible
> "provisional" qualifier until the owner signs off.

| Term | Provisional value | Basis |
|---|---|---|
| Commission rate | **30% recurring** | 2026 SaaS norm |
| Duration | **for 12 months** per referred customer | 2026 SaaS norm |
| Attribution / cookie window | **90 days** | 2026 SaaS norm |
| Payout tooling | FirstPromoter | research-notes §7 |

These mirror the figures in site-strategy §2. Do **not** present them as final.

---

## 5. Asset kit (promo tools we give partners)

A downloadable/linkable kit so partners can promote without making their own
assets:

- **Logos & brand marks** — the new editorial brand mark (research-notes §6) in
  multiple formats/sizes, with clear-space and color rules.
- **Copy snippets** — ready-to-paste headlines, short descriptions, and
  email/social blurbs in the approved founder voice (research-notes §4), each
  honest about scope (logged-in cross-device sync; no over-claims).
- **The Lost-Cart Calculator and the free audit as shareable tools** — partners
  can link the calculator (transparent, illustrative formula) and the audit
  on-ramp directly; these double as lead magnets and proof devices.
- Banners / suggested screenshots that follow the same IP rules as the site (no
  third-party retailer UI — see `docs/asset-animation-research.md`).

---

## 6. Apply → approve → onboard flow

1. **Apply** — partner submits the apply form on `/partners` (working form,
   captured via Netlify Forms → owner notified; see research-notes §7 forms).
   Collect: name, company/site, audience type, audience size/channels, how they
   plan to promote.
2. **Approve** — owner reviews against approval criteria (to be defined — see
   §7). Approved partners are created in FirstPromoter and issued their unique
   `?via=CODE` link + dashboard access.
3. **Onboard** — send the asset kit, the program terms, and a short "how to
   promote honestly" primer; confirm payout details. Partner starts sharing
   their link.

---

## 7. Owner inputs needed

The program cannot go from provisional to live without these decisions from the
owner (cross-listed in `docs/owner-inputs-needed.md`):

- **Commission rate** — confirm/adjust the provisional **30% recurring**.
- **Payout terms** — confirm the **12-month** recurring duration; payout
  cadence, minimum payout threshold, and payout method.
- **Attribution window** — confirm the provisional **90-day** cookie window.
- **Approval criteria** — what qualifies a partner (audience size, relevance,
  quality bar); auto-approve vs manual review.
- **Where applications go** — the notification email / CRM destination for
  submitted applications (`LEAD_NOTIFY_EMAIL`, optional HubSpot
  `HUBSPOT_FORM_GUID_PARTNER`).
- **Go-ahead on the app-side backend glue** — confirm priority for the
  Shopify-app webhook→FirstPromoter work, without which conversions are not
  auto-reported.
