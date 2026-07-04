# Tooling & Accounts — persistentCartApp.com

The recommended v1 stack: what each tool is, why it was chosen, rough monthly cost, the exact
env-var names, and **what the owner must register**. Source of record: `docs/research-notes.md` §7.

**Design principle:** the site is **live and useful at handoff with zero credentials** (lead
capture, crawlability, consent all work key-free). Every paid/keyed integration is **env-var-gated
and dark until its key is added** — adding a key lights it up with no code change. See the matrix in
§3.

---

## 1. The stack at a glance

| Layer | Tool (v1) | Why | Rough cost | Key required to function? |
|-------|-----------|-----|------------|---------------------------|
| Hosting | **Netlify** | Native Netlify Forms = zero-credential lead capture; static-host-agnostic | **$0** (Starter) | No — live at handoff |
| Lead capture | **Netlify Forms** | Honeypot + spam filter built in; 100 submissions/mo free; commercial OK | $0 | No — live at handoff |
| Partner payout | **FirstPromoter** | Server-side Tracking API fits Shopify **Billing API** (no Stripe webhook for app installs) | **$49/mo** | Yes — dark until key (and app backend) |
| Analytics | **GA4** + **Plausible** | GA4 free + rich; Plausible cookieless/no-consent | $0 + **~€9/mo** | Yes — dark until ID added |
| Search | **Google Search Console** + **Bing Webmaster** | Indexing, sitemap, AEO signal | $0 | Verification key or DNS TXT |
| Transactional email | **Resend** | 3,000 emails/mo free; clean DKIM/SPF/DMARC | $0 (free tier) | Yes — dark until key |
| CRM (upgrade) | **HubSpot Free** | Optional CRM push from forms | $0 | Yes — dark until keys |
| Consent | **Klaro!** | Open-source, full i18n, Consent Mode v2, gates GA4 | $0 (no key) | No — live at handoff |

**Total cost:** **$0 to launch.** **~$58/mo** once FirstPromoter ($49) + Plausible (~€9/$10) are
switched on. Everything else stays on a free tier at this scale.

---

## 2. Per-tool detail (rationale · cost · env vars · owner action)

### 2.1 Hosting — Netlify (primary)
- **Why:** native **Netlify Forms** gives zero-credential lead capture at handoff (honeypot +
  built-in spam filter; 100 submissions/mo free; commercial use OK). Static output is
  host-agnostic, so **Cloudflare Pages is the scale fallback** — but Cloudflare has no native forms,
  so it would need a Worker. Stay on Netlify for v1.
- **Cost:** $0 (Starter tier).
- **Env vars:**
  - `PUBLIC_SITE_URL` — canonical site origin (e.g. `https://persistentcartapp.com`); used for
    canonicals/sitemap/OG. *(Build-time, public.)*
  - `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` — optional, **CI only** (for CLI deploys); not needed if
    deploying via the Netlify Git integration.
- **Owner registers:** Netlify account; connect the repo; point **`persistentcartapp.com` DNS** at
  Netlify. (Forms work the moment the site is deployed — no extra setup.)

### 2.2 Lead capture & form pipeline — Netlify Forms (+ Function)
- **Why / how it flows:** the Astro `LeadForm` posts to native **Netlify Forms** (works without JS
  via native POST; progressive-enhanced to inline success). A Netlify Function on the
  `submission-created` event then **layers on extras only if their keys exist**:
  1. **Always:** capture in Netlify Forms + email the owner (if `LEAD_NOTIFY_EMAIL` set).
  2. If `RESEND_API_KEY` set → send the lead a confirmation email.
  3. If HubSpot keys set → push the lead to CRM.
  - Spam defense: hidden **honeypot** field + **submission-time trap** + edge rate-limit.
- **Cost:** $0 (within Netlify Forms free tier).
- **Env vars:** `LEAD_NOTIFY_EMAIL` — owner address that receives every new lead. *(Server-only, in
  the Netlify Function env.)*
- **Owner registers:** nothing extra; set `LEAD_NOTIFY_EMAIL` to the inbox that should get leads.
  Without it, leads are still captured in the Netlify dashboard (just no email push).

### 2.3 Partner payout — FirstPromoter (primary)
- **Why:** the partner/affiliate program needs server-side attribution because **Shopify app
  billing has no Stripe webhook** — FirstPromoter's **server-side Tracking API** fits Shopify's
  **Billing API**. Flow: `?via=CODE` sets a cookie on **this site** → carried into App Store install
  → OAuth `state` → the **Shopify app backend** receives the `APP_SUBSCRIPTIONS_UPDATE` webhook →
  server-side conversion posted to FirstPromoter. **Fallback: Rewardful** (also $49/mo). Provisional
  program terms (defensible 2026 SaaS norm, **marked "provisional — pending owner confirmation"** on
  page): **30% recurring for 12 months, 90-day cookie window.**
- **⚠️ Scope boundary:** this static site only **sets the `?via=` cookie**. The actual payout/glue
  (webhook → conversion) lives in the **Shopify app backend**, not here. `FIRSTPROMOTER_API_KEY`
  belongs in the **app**, not this site.
- **Cost:** **$49/mo** (0% transaction fee).
- **Env vars:**
  - `PUBLIC_FIRSTPROMOTER_CID` — client/campaign id, loads the client tracking script on this site.
    *(Build-time, public.)*
  - `FIRSTPROMOTER_API_KEY` — server-side conversion key. **Lives in the Shopify APP backend**, not
    in this site's env.
- **Owner registers:** FirstPromoter account (when the partner program goes live); confirm the
  commission terms; the app backend glue is a separate engineering task (tracked in
  `site-strategy.md` §10 roadmap).

### 2.4 Analytics — GA4 + Plausible
- **Why:** **GA4** (free, rich funnels/events) for depth; **Plausible** (cookieless, no consent
  needed, lightweight) for clean top-line traffic. Skip PostHog for v1. Both are **consent/env
  gated**. See `docs/analytics.md` for full event wiring.
- **Cost:** GA4 $0; Plausible **~€9/mo (~$10)**.
- **Env vars:**
  - `PUBLIC_GA4_MEASUREMENT_ID` — GA4 measurement id (`G-XXXXXXX`). Loads gtag, **gated behind Klaro
    consent**. *(Build-time, public.)*
  - `PUBLIC_PLAUSIBLE_DOMAIN` — the domain registered in Plausible; loads the cookieless script (no
    consent gate needed). *(Build-time, public.)*
- **Owner registers:** GA4 property → copy measurement id; (optional) Plausible account + add the
  domain.

### 2.5 Search — Google Search Console + Bing Webmaster
- **Why:** indexing coverage, sitemap submission, and AEO/search signal. Verify both.
- **Cost:** $0.
- **Env vars** (meta-tag verification; or use DNS TXT instead):
  - `PUBLIC_GOOGLE_SITE_VERIFICATION` — Google verification token (rendered in `<head>` by
    `SEOHead.astro`).
  - `PUBLIC_BING_SITE_VERIFICATION` — Bing verification token (rendered in `<head>`).
- **Owner registers:** Search Console + Bing Webmaster properties; verify (paste token into env, or
  add DNS TXT); **submit the sitemap** (`/sitemap-index.xml`).

### 2.6 Transactional email — Resend
- **Why:** confirmation emails to leads; 3,000 emails/mo free; straightforward DKIM/SPF/DMARC.
- **Cost:** $0 (free tier covers v1 volume).
- **Env vars:**
  - `RESEND_API_KEY` — server-only (Netlify Function). Presence enables confirmation emails.
  - `EMAIL_FROM` — sender, e.g. `noreply@persistentcartapp.com`.
- **Owner registers:** Resend account; **add DKIM / SPF / DMARC DNS records** for
  `persistentcartapp.com` (so confirmation mail authenticates); create the API key.

### 2.7 CRM upgrade — HubSpot Free (optional)
- **Why:** optional CRM push from the forms when the owner wants pipeline management; free tier.
- **Cost:** $0.
- **Env vars** (server-only, in the Netlify Function env):
  - `HUBSPOT_PORTAL_ID`
  - `HUBSPOT_FORM_GUID_AUDIT` — maps audit leads to a HubSpot form.
  - `HUBSPOT_FORM_GUID_PARTNER` — maps partner leads to a HubSpot form.
- **Owner registers:** HubSpot Free account; create an "Audit" form and a "Partner" form; copy the
  portal id + both form GUIDs. Until set, leads still flow to Netlify Forms + email.

### 2.8 Consent — Klaro!
- **Why:** open-source cookie-consent manager, full i18n (fits the 15-locale rule), Google **Consent
  Mode v2** support, **no account/key**. It **gates GA4** (Plausible is cookieless and needs no
  consent). Live at handoff.
- **Cost:** $0.
- **Env vars:** none.
- **Owner registers:** nothing.

---

## 3. LIVE at handoff vs DARK until key — matrix

| Capability | Status with **no keys** | Lights up when you add… |
|------------|-------------------------|--------------------------|
| Site hosting & static pages | 🟢 **LIVE** | (set `PUBLIC_SITE_URL`) |
| Lead capture (audit + partner forms) | 🟢 **LIVE** (Netlify Forms dashboard) | — |
| Honeypot / spam protection | 🟢 **LIVE** | — |
| Cookie-consent banner (Klaro) | 🟢 **LIVE** | — |
| Crawlability, sitemap, hreflang, robots | 🟢 **LIVE** | — |
| Partner `?via=CODE` cookie capture (site side) | 🟢 **LIVE** | — |
| Owner email notification of new leads | ⚫ **DARK** | `LEAD_NOTIFY_EMAIL` |
| Lead confirmation emails | ⚫ **DARK** | `RESEND_API_KEY` + `EMAIL_FROM` |
| GA4 analytics & event tracking | ⚫ **DARK** | `PUBLIC_GA4_MEASUREMENT_ID` (+ consent) |
| Plausible analytics | ⚫ **DARK** | `PUBLIC_PLAUSIBLE_DOMAIN` |
| Google / Bing search verification | ⚫ **DARK** | `PUBLIC_GOOGLE_SITE_VERIFICATION` / `PUBLIC_BING_SITE_VERIFICATION` (or DNS TXT) |
| CRM push to HubSpot | ⚫ **DARK** | `HUBSPOT_PORTAL_ID` + `HUBSPOT_FORM_GUID_AUDIT` + `HUBSPOT_FORM_GUID_PARTNER` |
| FirstPromoter client tracking script | ⚫ **DARK** | `PUBLIC_FIRSTPROMOTER_CID` |
| FirstPromoter payout/conversion | ⚫ **DARK** | `FIRSTPROMOTER_API_KEY` **in the Shopify app backend** (not this site) + app webhook glue |

**Where keys go:**
- **`PUBLIC_*`** → Netlify **build-time site env vars**, exposed to the browser (Astro's
  `import.meta.env.PUBLIC_*`). Safe to be public (measurement ids, verification tokens, client ids).
- **Server-only** (`RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_EMAIL`, `HUBSPOT_*`) → Netlify
  **Function** environment, never shipped to the browser.
- **`FIRSTPROMOTER_API_KEY`** → the **Shopify app backend**, not this repo.

---

## 4. Prioritized owner registration list

Do these in order; each row notes the env var(s) and where the value goes.

| # | Register | Cost | Produces | Env var(s) → where |
|---|----------|------|----------|--------------------|
| 1 | **Domain DNS → Netlify** (point `persistentcartapp.com`) | $0 | Live site | `PUBLIC_SITE_URL` → Netlify build env |
| 2 | **Netlify account** + connect repo | $0 | Hosting + Forms | (CI optional) `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` |
| 3 | **Lead-notify inbox** | $0 | Owner gets every lead | `LEAD_NOTIFY_EMAIL` → Netlify Function env |
| 4 | **Google Search Console** + **Bing Webmaster** | $0 | Indexing + submit sitemap | `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_SITE_VERIFICATION` → build env (or DNS TXT) |
| 5 | **GA4 property** | $0 | Conversion analytics | `PUBLIC_GA4_MEASUREMENT_ID` → build env |
| 6 | **Resend** + domain DKIM/SPF/DMARC DNS | $0 | Lead confirmation email | `RESEND_API_KEY`, `EMAIL_FROM` → Function env |
| 7 | **Plausible** (optional) | ~€9/mo | Cookieless traffic | `PUBLIC_PLAUSIBLE_DOMAIN` → build env |
| 8 | **FirstPromoter** (at partner-program launch) | $49/mo | Affiliate tracking/payout | `PUBLIC_FIRSTPROMOTER_CID` → build env; `FIRSTPROMOTER_API_KEY` → **app backend** |
| 9 | **HubSpot Free** (optional CRM) | $0 | CRM pipeline | `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID_AUDIT`, `HUBSPOT_FORM_GUID_PARTNER` → Function env |
| 10 | **Social profiles** (X / LinkedIn / YouTube) | $0 | `sameAs` entity signal | set in `src/config/site.ts` `social` |

Rows 1–4 are the launch-critical set (site live, leads received, search indexing). Rows 5–7 add
measurement and polish. Row 8 unlocks the #1 audience (partners) and requires the separate app
backend glue. Rows 9–10 are nice-to-haves.

> Reminder (from research-notes §7 / site-strategy §10): the FirstPromoter **payout** depends on
> Shopify-app backend work that is **out of scope for this static site**. Registering the account
> and adding `PUBLIC_FIRSTPROMOTER_CID` here only lights up client-side referral tracking.
