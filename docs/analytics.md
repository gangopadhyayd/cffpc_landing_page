# Analytics & Conversion Tracking — persistentCartApp.com

How analytics and conversion events are wired. Two principles govern everything here:

1. **Env-var-gated** — analytics only loads when its id is present. No id → no script → the site
   ships clean and key-free at handoff (see `docs/tooling-and-accounts.md` §3).
2. **Consent-gated** — GA4 only fires after the visitor accepts analytics in the **Klaro** consent
   banner (Consent Mode v2). Plausible is cookieless and needs no consent.

The whole stack is **dark by default and harmless** until the owner adds ids; adding an id is the
only step needed to turn it on.

---

## 1. What's wired where

| Concern | Mechanism | Location |
|---------|-----------|----------|
| GA4 loader (gtag) | Loads only if `PUBLIC_GA4_MEASUREMENT_ID` set; **consent-gated** by Klaro | `src/layouts/Base.astro` (head/body) |
| Plausible loader | Loads only if `PUBLIC_PLAUSIBLE_DOMAIN` set; cookieless, no consent gate | `src/layouts/Base.astro` |
| Consent manager (Klaro) | Always on; controls the GA4 gate | `src/layouts/Base.astro` |
| Search verification meta | `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` | `src/components/SEOHead.astro` |
| Event delegation | One small island reads `data-event` clicks + custom events, forwards to GA4/Plausible | `src/layouts/Base.astro` (analytics island) |
| Click events | `data-event` / `data-source` / `data-form` attributes on CTAs & buttons | components (see §2) |
| Form + calculator signals | `CustomEvent`s on `window` | `LeadForm.astro`, `LostCartCalculator.astro` |

A single **analytics island** (vanilla TS, `client:idle`) does the work: it delegates clicks on any
`[data-event]` element and listens for the custom events below, then forwards each to whichever
providers are enabled. One code path, provider-agnostic — so GA4 and Plausible receive the same
event names, and adding a third provider later is a one-file change.

---

## 2. Event catalog

Events are emitted two ways: **declaratively** via `data-event` attributes (no JS per component),
and **imperatively** via `CustomEvent` for richer interactions. All event names are stable and
shared across GA4 + Plausible.

### 2a. Declarative `data-event` clicks (verified in components)

| Event | Fires on | `data-source` examples | Where (components) |
|-------|----------|------------------------|--------------------|
| `install_click` | Click on any **"Add Persistent Cart" / App Store** outbound link (`→ apps.shopify.com/cart-persistify`, `target=_blank`) | `hero`, `mobile`, `home_pricing`, `calculator` | `Hero`, `Header`, `Footer`, `PricingTable`, `HomePage`, `LostCartCalculator` |
| `audit_cta` | Click on a **"Get a free store audit"** CTA (navigates to the audit page) | `hero`, `calculator` | `Hero`, `LostCartCalculator` |
| `partner_cta` | Click on a **partner/affiliate** CTA (navigates to `/partners`) | `home` | `HomePage` (via `CTABand` `event` prop) |
| `calculator_cta` | Click on the **"try the calculator"** CTA | `home` | `HomePage` |
| `form_submit` | Click on a **lead-form submit button**; carries `data-form` = the form name (`audit` / `partner`) | — | `LeadForm` |

`data-source` distinguishes which placement drove the click (e.g. hero vs. footer vs. pricing) and
is forwarded as an event parameter. `data-form` distinguishes audit vs. partner submissions.

### 2b. Imperative custom events (verified in components)

| Custom event | Dispatched when | Detail payload | Source |
|--------------|-----------------|----------------|--------|
| `lead:submitted` | A lead form successfully submits (after the Netlify POST resolves; fired on the inline-success path) | `{ form: 'audit' \| 'partner' }` | `LeadForm.astro` |
| Calculator usage | The Lost-Cart Calculator recomputes; the result is exposed for analytics via `root.dataset.calcMonthly` (the analytics island samples/debounces it into a `calculator_used` event) | monthly figure (string) | `LostCartCalculator.astro` |

> Note on the calculator: the component computes an **illustrative range** and writes the midpoint
> to `data-calc-monthly` rather than firing on every keystroke. The analytics island should
> **debounce** this into a single `calculator_used` event per meaningful interaction (e.g. on
> `change`/blur), so a slider drag is one event, not fifty.

> `lead:submitted` is the **authoritative conversion** for a lead (it only fires on a real
> successful submit), whereas `form_submit` (the button click) is the funnel-top intent signal.
> Count conversions on `lead:submitted`.

---

## 3. Success metric per goal

Each primary goal has one headline metric and a defined measurement. (All three goals map to the
site's audience priority in `site-strategy.md` §2.)

| Goal (priority) | Success metric | How it's measured | Notes |
|-----------------|----------------|-------------------|-------|
| **Partner sign-ups (#1)** | **Completed partner-apply submissions** | `lead:submitted` with `detail.form = 'partner'` (authoritative). Funnel: `partner_cta` clicks → partner-page views → `lead:submitted(partner)`. | True payout conversion (install → commission) is attributed in **FirstPromoter / the app backend**, not on-site; the site measures intent + apply. |
| **Install-outbound clicks (#2)** | **`install_click` events** to `apps.shopify.com/cart-persistify` | Sum of `install_click` (segment by `data-source` to see which placement converts). This is an **outbound** proxy — actual installs live in the Shopify Partner dashboard (no cross-domain join). | Pair with Partner-dashboard installs to estimate click→install rate. |
| **Audit leads (#3)** | **Completed audit-form submissions** | `lead:submitted` with `detail.form = 'audit'`. Funnel: `audit_cta` clicks → audit-page views → `lead:submitted(audit)`. | The audit is the on-ramp for unaware merchants. |
| Supporting: **calculator engagement** | `calculator_used` events / sessions reaching the calculator | Debounced custom event (§2b). | Leading indicator of education-funnel depth; correlate with downstream `audit_cta`/`install_click`. |

**Mark these as GA4 conversions / key events:** `lead:submitted` (split by `form`), `install_click`.
In Plausible, register the same names as **goals** (and `install_click` as an outbound-link goal).

---

## 4. Provider wiring

### 4.1 GA4 — `PUBLIC_GA4_MEASUREMENT_ID`
- Loads gtag.js **only if** `PUBLIC_GA4_MEASUREMENT_ID` is set (e.g. `G-XXXXXXX`).
- **Consent-gated:** gtag boots with Consent Mode v2 defaults **denied**; Klaro flips
  `analytics_storage` to `granted` only after the visitor accepts. No acceptance → no GA4 cookies,
  no hits.
- The analytics island forwards each event as a GA4 event with its `data-source` / `data-form` as
  parameters.

### 4.2 Plausible — `PUBLIC_PLAUSIBLE_DOMAIN` (optional)
- Loads the Plausible script **only if** `PUBLIC_PLAUSIBLE_DOMAIN` is set.
- **Cookieless** → no consent gate required; safe to load for all visitors.
- The same event names are sent as Plausible custom events/goals (enable outbound-link tracking for
  `install_click`).

### 4.3 Klaro consent gate (for GA4)
- Klaro renders the consent banner in every locale (full i18n — fits the 15-locale rule), no key.
- GA4 is registered as a Klaro **app/service** behind the `analytics` purpose. Until consent:
  GA4 stays in denied/consent-mode-default state. Plausible is **not** gated (cookieless).
- This keeps the site GDPR-clean by default and is why GA4 is "dark" without consent even when the
  measurement id is present.

### 4.4 Search Console verification
- `PUBLIC_GOOGLE_SITE_VERIFICATION` and `PUBLIC_BING_SITE_VERIFICATION` render verification
  `<meta>` tags in `SEOHead.astro` (alternatively verify via DNS TXT). After verifying, **submit the
  sitemap** (`/sitemap-index.xml`). Search Console/Bing measure impressions, clicks, and query/AEO
  performance — the top-of-funnel counterpart to the on-site conversion events above.

---

## 5. Hooks for future A/B testing

The architecture is ready for experimentation without a vendor today:

- **Stable event names + `data-source`** already let you compare placements (e.g. hero vs. pricing
  `install_click` rates) — a zero-tool "which CTA converts" analysis out of the box.
- **Variant attribute convention:** add a `data-variant` attribute alongside `data-event` (and/or a
  `body[data-exp="..."]`); the analytics island forwards it as an event parameter so any event can
  be sliced by variant in GA4/Plausible.
- **Assignment:** a tiny vanilla-TS island can bucket a visitor (cookie/localStorage hash) and set
  `data-variant` / a `body` class — consistent with the no-React, minimal-island approach
  (`site-strategy.md` §6). No third-party A/B SDK needed for v1.
- **GA4-native:** experiments can also be run via GA4 + Google Optimize-style audiences using the
  events already emitted; partner/audit `lead:submitted` and `install_click` are the conversion
  metrics any test should optimize.
- Keep experiments **consent-aware** — variant assignment may run pre-consent (no PII), but GA4
  reporting of results still respects the Klaro gate.
