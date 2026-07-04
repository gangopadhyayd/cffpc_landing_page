# Legal & Claims Review — persistentCartApp.com (v1)

**Reviewer stance:** pragmatic product-marketing claims review. Goal is honest, defensible copy — not zero-risk paranoia. Severity = practical exposure (trademark, advertising/consumer-protection, privacy/GDPR, false-claim).

**Scope reviewed:** `src/i18n/strings/en.json`; `src/i18n/strings/en/{privacy,audit,pricing,big-retailers,vs-recovery,compare-email,summary}.json`; `docs/research-notes.md`; `src/lib/schema.ts`.

**Date:** 2026-06-30. Source of truth for facts below: `docs/research-notes.md` (treat PRODUCT TRUTH + PROOF NUMBERS as canonical; re-verify time-sensitive web facts at publish).

**Headline counts:** 1 high · 6 medium · 13 low.

The single high item is the partner-program commission stated as a live, firm offer (§5.7). Everything else is medium/low and mostly about precision, re-verification, and disclaimer coverage. The privacy and schema work is notably careful and largely passes as-is.

---

## 1. Retailer & competitor mentions — trademark + disclaimer + fair comparison

**Retailer mentions (Walmart, Amazon, eBay):**
- `en.json` `hero.sub`, `page.home.desc`, `home.parity.*` (Walmart + Amazon quotes, sourced), `announce.text`.
- `en/big-retailers.json` `s1.b` (Amazon, Walmart, **eBay**), `s2.b`, `s3.b`.

**Target:** NOT present in any published EN string (only discussed in research-notes as a counter-example). This is correct — research-notes §8 cautions Target's *list* syncs but there's no first-party "cart doesn't sync" statement. Keep Target out. (No action — informational.)

**Competitor (software) mentions (Klaviyo, Omnisend, Recart):**
- `en/vs-recovery.json` `s4.b`, `faq.q2.a`; `en/compare-email.json` `s3.b`, `faq.q2.a`.

**Footer disclaimer (`en.json` `footer.notAffiliated`):**
> "Persistent Cart is an independent app. Shopify is a trademark of Shopify Inc. Amazon, Walmart, and other retailer names are trademarks of their respective owners, referenced for comparison only."

| # | Severity | Location | Risk | Action |
|---|---|---|---|---|
| 1.1 | **Low** | Walmart/Amazon nominative use + `footer.notAffiliated` | Naming retailers to describe their documented behavior, with sourced quotes and a non-affiliation + trademark-attribution line, is textbook nominative fair use. Disclaimer is global (footer renders on all pages incl. comparison pages). | Adequate. Keep the disclaimer global. No change needed. |
| 1.2 | **Medium** | `big-retailers.json` `s1.b`: "eBay takes a similar account-level approach, with a single cart tied to your sign-in" | Research-notes §8 rates eBay **partial**: the explicit cross-device/single-cart statement exists only in eBay **Community** (member, not staff), not first-party. The copy asserts it as fact. | Soften to clearly-hedged language ("eBay also appears to use a single account-level cart") or drop the eBay sentence. Don't hang a factual cross-device claim on eBay. |
| 1.3 | **Medium** | `footer.notAffiliated` covers only "retailer names" | Klaviyo, Omnisend, and Recart are **trademarks of software companies, not retailers**, so the current disclaimer does not cover them. They're used in a non-disparaging "runs alongside, no conflict" framing (good), but trademark attribution is missing. | Extend the disclaimer: add "Other product and company names — including Klaviyo, Omnisend, and Recart — are trademarks of their respective owners, used for identification and comparison only." |

**Fair-comparison framing — verdict:** Strong. The named-competitor copy positions *with* them ("won't conflict with… runs alongside"), not against — no disparagement. The category comparison tables (`home.compare.*`, `vs-recovery`, `compare-email`) compare against the generic category ("abandoned-cart email/SMS"), not a named rival, and the recovery-rate stats are labeled "industry estimate, 2024–25." Defensible.

**Is the disclaimer adequate?** Adequate for the retailer trademarks; **not complete** — it omits the software-competitor marks (1.3). With the 1.3 edit it becomes adequate. It is correctly placed (global footer → appears on every comparison page).

---

## 2. Review / rating presentation

**4.8★ appears as plain text** in: `common.rating`, `announce.text`, `hero.trust.rating`, `home.trust.stat.rating`, `home.metrics.2.value`, `page.home.desc`, `home.final.trust`, `summary.json` `s6.b`. Review-reading CTAs link to the App Store: `cta.readReviews`, `home.testimonial.cta` ("Read all {count} reviews on the App Store").

**Schema check (`src/lib/schema.ts`) — CONFIRMED in code:**
- `softwareApplicationSchema()` emits `@type: SoftwareApplication` with `offers` only. **No `aggregateRating`, no `review` property.** Explicit code comment documents the choice: "we deliberately do NOT emit aggregateRating/review on our own product … The 4.8★ is shown as plain text linking to the App Store listing instead." Inline comment at the offers block repeats it.
- No other builder (`organizationSchema`, `websiteSchema`, `faqPageSchema`, `webPageSchema`, `breadcrumbSchema`) emits rating/review either.

| # | Severity | Location | Risk | Action |
|---|---|---|---|---|
| 2.1 | **Low** | `schema.ts` + plain-text rating | Correctly avoids self-serving structured review markup (no manual-action / star-snippet risk). 4.8★ is presented as a claim that links to the verifiable source. | None — this is the right pattern. Keep `aggregateRating` out of all schema. |
| 2.2 | **Low** | `{count}` in `home.trust.stat.rating`, `trustbar.reviews`, `home.testimonial.cta` | If the rendered review count drifts from the live listing it becomes an inaccurate stat. Research-notes §8b: live = **4.8★ / 45 reviews** (was 4.9/46 in brief). | Confirm `{count}` resolves to the live count (45) and rating is 4.8 everywhere at publish; both move over time. |

**Verdict:** Compliant. 4.8★ is plain text linking to the App Store, and schema emits no aggregateRating/review on our own product.

---

## 3. Privacy & data handling

**Sources:** `en/privacy.json` (full /privacy explainer) and `en.json` `home.data.*`.

**Automated-GDPR-erasure claim — CONFIRMED ABSENT.** This is the key honesty guardrail (research-notes §1: the 3 mandatory webhooks are acknowledgment stubs — log + 200, no automated redaction logic — so do NOT claim automated erasure). The copy holds the line:
- `privacy.json` `s7.b`: "Data requests are **routed through** Shopify's required data-protection flows. As a Shopify app, Persistent Cart **receives** Shopify's required data-request webhooks… the most reliable way to start a request… is through the store on Shopify… For the precise legal commitments, timelines, and **how data deletion is carried out, see the formal privacy policy**." → matches the approved safe-copy pattern; defers deletion mechanics to the formal policy.
- `home.data.body`: "We're Built for Shopify and **follow Shopify's required data-protection flows.**" — no automation claim.

| # | Severity | Location | Risk | Action |
|---|---|---|---|---|
| 3.1 | **Low** | `privacy.json` `s7.b`, `home.data.*` | No automated-erasure overclaim; formal policy is named as governing. Scope claims (cart contents only, customer ID to key the cart, order tag, no payment data, guests not tracked, store-scoped) all match PRODUCT TRUTH in research-notes §1. | None — copy is careful. Keep the formal policy as the controlling document and ensure it is actually live + linked. |
| 3.2 | **Medium** | `privacy.json` `s7.b`: "receives Shopify's required data-request webhooks — for data access, **customer redaction**, and **shop redaction**" | Literally true (the app does receive these webhooks). But a reader can infer the app *performs* redaction, while research-notes §1 says the handlers are currently **stubs with no redaction logic**. The gap between "receives webhook" and "actually deletes data" is the exposure if a regulator/merchant probes. | Two options: (a) ensure the formal privacy policy (which governs) accurately states how/when deletion actually happens and does not overstate automation; **and/or** (b) implement real redaction before relying on this line. At minimum keep the wording at "receives… and handles per Shopify's flows" and never escalate to "automatically deletes." |
| 3.3 | **Low** | `home.data.point.1/2/3`, `privacy.json` `s2–s6` | "Works only for logged-in customers / no guest tracking / stores cart contents scoped to your store / no emails, no contacts, no consent prompts" all match code truth. "Not pooled into a cross-merchant dataset" matches keying by customer+domain. | None — accurate. |

**Verdict:** Strong. No automated-GDPR-erasure claim. Only watch item: the redaction-webhook line (3.2) must stay "receives/routes," and the formal policy must match real deletion practice given the handlers are stubs today.

---

## 4. Audit form — data handling

**What `en/audit.json` collects:** store URL (`form.storeUrl`), name (`form.name`), email (`form.email`), Shopify plan (`form.plan`, optional), monthly orders (`form.orders`, optional).

**Privacy note (`audit.form.privacy`):** "We use these details only to prepare your audit and reply. No spam, no sharing. See our privacy approach." (links to /privacy).

| # | Severity | Location | Risk | Action |
|---|---|---|---|---|
| 4.1 | **Low** | `audit.form.*` fields + `audit.form.privacy` | Minimal, proportionate collection (no sensitive data), purpose-limited ("only to prepare your audit and reply"), with a privacy link at point of collection. Adequate for a B2B lead form. | None required. |
| 4.2 | **Low** | `audit.form.privacy`: "No spam, **no sharing**" | Absolute "no sharing," but research-notes §7 routes form data through processors/CRM (Netlify Forms, optionally Resend for confirmation, HubSpot). Standard processor use is not "sharing" in the consumer sense, but the absolute phrasing plus undisclosed sub-processors is a small honesty gap. | Keep the friendly line, but (a) ensure the **formal privacy policy discloses sub-processors** (Netlify/Resend/HubSpot/analytics), and (b) optionally soften to "we don't sell your details or share them with third parties for their own marketing." |
| 4.3 | **Low** | `audit.form.success.body`, `audit.expectations`: "within 1–2 business days … genuinely free … no obligation" | Operational promise (turnaround) and "free." Low risk as long as it's honored; "free/no obligation" is true (no install required). | Ensure the team can actually deliver within 1–2 business days, or widen the window. Link the formal privacy policy (not only the plain-language explainer) near the submit button. |

**Verdict:** The privacy note is adequate for the data collected. Main improvement is sub-processor disclosure in the formal policy and slightly less-absolute "no sharing" wording.

---

## 5. Claim defensibility

| # | Severity | Location | Claim / wording | Risk | Action |
|---|---|---|---|---|---|
| 5.1 | **Medium** | `home.parity.walmart.quote` / `home.parity.amazon.quote` (+ sources `home.parity.*.source`) | Walmart "access your cart across multiple devices"; Amazon "Items added to your Shopping Cart will be available from any compatible web browser or Amazon Mobile app…" | Time-sensitive third-party quotes. Research-notes §8 verified both 2026-06-30 but: Walmart source shows no date; **Amazon quote was captured from the SG-locale help page** (the .com node was 503-blocked). If either help page changes wording, the quotation becomes inaccurate. | **Re-verify both verbatim quotes at publish** and screenshot/date them. For Amazon, keep the locale note ready ("Amazon help; behavior identical across locales") in case challenged. |
| 5.2 | **Medium** | `home.parity.shopify.quote`: "The cart is stored in a browser cookie, so a signed-in customer's cart doesn't follow them to another device or browser." (source label: "Shopify cookie policy + community") | This is a **synthesized statement presented in the same quotation-styled slot as the two real first-party quotes**, attributed to Shopify. Shopify's cookie policy literally says the "cart" cookie "Contains information related to the user's cart" (2-week duration) — the "doesn't follow them to another device" part is our inference, not a Shopify quote. Putting it in quote marks risks reading as misattribution. (The `big-retailers.json` pillar handles this correctly — it quotes the real cookie-policy fragment and attributes the "custom code" line to Community separately.) | Either (a) drop the quotation marks for the Shopify card and present it as a paraphrase/our description, or (b) replace with the verbatim cookie-policy fragment + duration, matching the pillar page. Don't style an inference as a Shopify quote. |
| 5.3 | **Low** | `home.problem.intro`, `big-retailers.json` `s2.b`, `summary.json` `s2.b`, `home.faq.q1.a` | Browser-cookie / ~2-week / "would require custom code" / "still not native as of 2026" | Well-handled. Copy consistently says "across devices **and browsers**" and explicitly states the same-browser cart *does* persist ~2 weeks ("…persist for the same shopper in the same browser for about two weeks — but it has no way to appear on a second device"), and frames the new-customer-accounts point as "still not native," not "Shopify says it doesn't." Matches research-notes §8 honesty rules. | None. Re-verify the cookie name/duration on `shopify.com/legal/cookies` at publish (Shopify can change it). Keep "Never say 'Shopify doesn't save carts.'" |
| 5.4 | **Low** | `home.calc.intro` ("illustrative defaults … transparent, illustrative range. We show the formula; nothing is a black box"); `audit.checks.2.body` ("transparent, illustrative estimate … never a borrowed stat") | Calculator/audit estimate framing | Good — labeled illustrative/estimate, formula shown, no borrowed stat. Supports research-notes §9 caution that the device-switch→lost-sale chain is a reasoned inference, not a published finding. | Verify the **calculator component itself** (not in the files reviewed) carries the same "illustrative estimate, not measured/guaranteed" label and actually displays the formula. Don't let the output read as a promised dollar figure. |
| 5.5 | **Low** | `home.pricing.heading`, `pricing.json` `h1/lede/s1.b/faq.q1`, `summary.json` `s5.b` | "Every feature, on every plan. Priced to your Shopify plan." | **True per code** (research-notes §1: tiers do not gate features; identical feature set; tier auto-selected by the merchant's Shopify subscription). Defensible as written. | None for the core claim. See 5.6 for the price-figure reconciliation. |
| 5.6 | **Medium** | `pricing.json` `tier.advanced.note` + `$4.99`/`$99.99` figures (`pricing.tier.*`, `home.faq.q7.a`, `summary.json` `s5.b`); `page.pricing.desc` "From $4.99/mo" | Specific dollar amounts and an **Advanced ($24.99) tier** | Research-notes §8b: the **live App Store listing shows Free Starter, Basic $4.99, Grow $8.99, Plus $99.99 — Advanced $24.99 is in code but NOT surfaced on the live listing (flagged to owner).** Also §1: 71% of payers are grandfathered at legacy $3.99, so published prices apply to **new installs**. Site prices that disagree with the listing are a mismatch risk. | Reconcile every displayed price against the **live listing** before publish; decide whether to show the Advanced tier at all. Consider a small note that prices are for new installs. |
| 5.7 | **High** | `en.json` `home.partner.heading` ("Earn 30% recurring for 12 months on every store you refer"), `cta.partner` ("Become a partner — earn 30% recurring"), `home.partner.cta` ("See partner terms & apply") | Specific recurring-commission offer stated as live fact | Research-notes §4: **"No partner/affiliate program exists yet → all partner copy is greenfield."** §7: the 30%/12-month/90-day terms are **"provisional — pending owner confirmation."** The homepage advertises a specific commission as a firm, current offer and "apply," with no "provisional/launching" qualifier. Advertising a commission a program can't yet honor is the clearest false-offer/consumer-protection exposure on the site. | Before publish, do one of: (a) finalize the program + terms page so the offer is real; or (b) mark it clearly provisional / "early access — join the waitlist," and add "Program and terms are provisional and subject to final confirmation" on the partner page. Don't state a firm commission until it's backable. |
| 5.8 | **Low** | `en.json` `home.b2b.body`; `summary.json` `s4.b` | "keeps large signed-in carts intact across devices … handles shared workstations without leaking one buyer's cart to another" | Both halves are confirmed in code (large carts observed; shared-workstation isolation). Copy correctly **avoids** marketing draft-orders/wholesale as shipped (research-notes §1 says that's roadmap only). Minor: research-notes flags B2B **buyer-specific catalogs / quantity-ruled lines may not restore** via the anonymous Storefront token. | Keep avoiding any draft-orders/wholesale-catalog capability claim. Optionally add a soft caveat for B2B custom-catalog edge cases so "intact" isn't read as absolute. |
| 5.9 | **Low** | `hero.eyebrow`, `home.trust.lead`, `trustbar.lead`, `summary.json` `s6.b` ("the original… and the most-reviewed in its category") | Incumbency / category-leadership claims | Defensible per research-notes §3 (Shopify-first by ~6 years; ~52% of category reviews). But "most-reviewed" shifts as competitors accrue reviews, and "original" must **not** become "invented/coined the term" (Magento prior art). | Re-verify the "most-reviewed in its category" lead at publish. Keep "original… for Shopify"; never claim to have coined/invented the term. |

---

## Pre-publish checklist

**High**
- [ ] **Partner terms (5.7):** Either finalize the program + terms page, or mark all partner copy "provisional / early-access / waitlist" and add a "terms provisional, subject to confirmation" line. Do not publish a firm 30%/12-month commission until backable.

**Medium**
- [ ] **Disclaimer coverage (1.3):** Add software-competitor trademark attribution (Klaviyo, Omnisend, Recart) to `footer.notAffiliated`.
- [ ] **eBay claim (1.2):** Soften or drop "single cart tied to your sign-in" in `big-retailers.json` `s1.b` (first-party evidence is only partial).
- [ ] **Redaction wording (3.2):** Confirm the formal privacy policy describes real deletion practice and that the on-site line stays "receives/routes," never "automatically deletes."
- [ ] **Parity quotes (5.1):** Re-verify Walmart + Amazon verbatim quotes live; date/screenshot them; keep Amazon locale note on hand.
- [ ] **Homepage Shopify "quote" (5.2):** Remove quotation marks (it's a paraphrase) or swap in the verbatim cookie-policy fragment.
- [ ] **Pricing reconciliation (5.6):** Match every displayed price to the live App Store listing; resolve the Advanced $24.99 tier; consider a "new installs" note.

**Low (confirm / monitor)**
- [ ] Schema still emits **no** `aggregateRating`/`review` (currently correct in `schema.ts`) — keep it that way (2.1).
- [ ] `{count}` review counts and the 4.8★ figure match the live listing at publish (2.2).
- [ ] Formal privacy policy is **live, linked, and stated to govern**; sub-processors disclosed (3.1, 4.2).
- [ ] Audit turnaround ("1–2 business days") is operationally deliverable; link the formal policy near the form (4.3).
- [ ] Calculator component carries the "illustrative estimate, not measured/guaranteed" label and shows its formula (5.4).
- [ ] Keep "across devices **and browsers**" phrasing; re-verify Shopify cookie name/duration; never say "Shopify doesn't save carts" (5.3).
- [ ] Confirm "Built for Shopify" badge is still current (it's Shopify's designation — remove if it ever lapses).
- [ ] Keep "original… for Shopify"; re-verify "most-reviewed in its category"; never claim to have coined/invented the term (5.9).
- [ ] Internal proof numbers (stores served, Plus stores, syncs/day, GMV) stay as **qualitative placeholders** until owner sign-off — verify none leaked into published copy as hard figures.
