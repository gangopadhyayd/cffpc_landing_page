# Localization — persistentCartApp.com

How the site ships, maintains, and reviews **15 languages**. English is authored by hand;
every other locale is generated from English and kept in sync automatically. This document is
the operating manual for the standing 15-locale rule. Facts feeding the glossary live in
`docs/research-notes.md` §5; the locale list is defined in `src/config/locales.ts` (the single
source of truth — never hard-code locales anywhere else).

---

## 1. The standing 15-locale rule

**The site ships in all 15 top Shopify languages, always. No page is "done" until it exists in
all 15.**

- **English is canonical and launch-quality.** All content is authored once in English (see
  `docs/content-authoring-guide.md`). English is the only hand-written locale; it is always
  indexable and is the `x-default`.
- **The other 14 are generated**, never authored by hand — author once in English, fan out via
  `npm run i18n:sync` (glossary-aware machine translation + translation memory).
- **Only indexable (reviewed) locales are `hreflang`-wired.** `alternates()` in
  `src/i18n/routing.ts` filters by `isIndexable`, so unreviewed (`noindex`) locales are never
  advertised to search engines — Google discards `noindex` hreflang targets anyway, and pointing
  at them wastes crawl budget and floods Search Console with "Excluded by 'noindex'" reports
  (GSC alert, 2026-07-18). The language switcher still lists all 15 for humans. Flipping a
  locale's `reviewed` flag adds it to the hreflang graph site-wide on the next build.
- **Machine-translated locales render `noindex` until native review.** Each locale carries a
  `reviewed` flag in `locales.ts`. While `reviewed: false`, that locale's pages emit
  `<meta name="robots" content="noindex">` (and stay out of hreflang + sitemap) and show an
  in-page review banner. A native reviewer flips `reviewed: true` → the locale becomes indexable.
  This is enforced by `isIndexable(code)` in `locales.ts`, consumed by `Base.astro`,
  `SEOHead.astro`, and `src/i18n/routing.ts`.
- **A page is not shippable until its English source exists AND `i18n:sync` has fanned it out to
  all 15.** CI fails otherwise (see §5).

Why: the category is low-awareness and near-empty in every market, and **no competitor has a
marketing site in any language**. Shipping all 15 (even machine-quality, `noindex`) keeps every
locale usable by humans today and lets us flip locales indexable one native review at a time,
claim-heavy pages first — without ever re-touching the page components. Search engines only hear
about a locale once it's flipped (hreflang + sitemap are both gated on `isIndexable`).

---

## 2. The 15 locales

Source of truth: `src/config/locales.ts` (`LOCALES`, ordered by rollout priority). English is
canonical/indexable; all others start `reviewed: false` (machine-translated, `noindex`) until a
native reviewer signs off.

| #  | Code    | Path     | Native label | English name           | Dir | Indexable at handoff |
|----|---------|----------|--------------|------------------------|-----|----------------------|
| 1  | `en`    | `/en`*   | English      | English                | ltr | ✅ canonical          |
| 2  | `de`    | `/de`    | Deutsch      | German                 | ltr | ✅ agent-reviewed 2026-07-20 |
| 3  | `fr`    | `/fr`    | Français     | French                 | ltr | ✅ agent-reviewed 2026-07-20 |
| 4  | `es`    | `/es`    | Español      | Spanish                | ltr | ✅ agent-reviewed 2026-07-20 |
| 5  | `it`    | `/it`    | Italiano     | Italian                | ltr | ✅ agent-reviewed 2026-07-20 |
| 6  | `pt-BR` | `/pt-br` | Português    | Portuguese (Brazil)    | ltr | ✅ agent-reviewed 2026-07-20 |
| 7  | `nl`    | `/nl`    | Nederlands   | Dutch                  | ltr | ✅ agent-reviewed 2026-07-20 |
| 8  | `ja`    | `/ja`    | 日本語        | Japanese               | ltr | ✅ agent-reviewed 2026-07-20 |
| 9  | `zh-CN` | `/zh-cn` | 简体中文       | Chinese (Simplified)   | ltr | ✅ agent-reviewed 2026-07-20 |
| 10 | `ko`    | `/ko`    | 한국어         | Korean                 | ltr | ✅ agent-reviewed 2026-07-20 |
| 11 | `sv`    | `/sv`    | Svenska      | Swedish                | ltr | ✅ agent-reviewed 2026-07-20 |
| 12 | `da`    | `/da`    | Dansk        | Danish                 | ltr | ✅ agent-reviewed 2026-07-20 |
| 13 | `pl`    | `/pl`    | Polski       | Polish                 | ltr | ✅ agent-reviewed 2026-07-20 |
| 14 | `nb`    | `/nb`    | Norsk        | Norwegian (Bokmål)     | ltr | ✅ agent-reviewed 2026-07-20 |
| 15 | `fi`    | `/fi`    | Suomi        | Finnish                | ltr | ✅ agent-reviewed 2026-07-20 |

\* `en` is the default locale; whether it is also served at the site root is controlled by Astro
i18n config derived from `locales.ts`. All locales are `ltr` today; the `dir` field exists so an
RTL locale can be added without code changes.

**Rollout priority (for native review, not for shipping — all 15 ship together):**
Western-EU first (de, fr, es, it, pt-BR, nl) where review and search signal concentrate → CJK
(ja, zh-CN, ko) → Nordic + Polish (sv, da, pl, nb, fi).

---

## 3. Glossary / termbase

`i18n:sync` consults a glossary before translating so brand terms and in-market phrasing are never
mangled by the machine engine. Maintain it as the project's terminology contract. (Until the
glossary file is wired, keep these rules here as the spec; the sync script reads them.)

### 3a. DO-NOT-TRANSLATE list (verbatim in every locale)

These render identically in all 15 locales — never translated, transliterated, or case-changed:

- **Persistent Cart** (the product name — and "Persistent Cart — Sync Devices", the full name)
- **Shopify**
- **Built for Shopify** (the program/badge — exact casing)
- **Shopify Plus**, **Shopify Basic**, **Shopify Grow**, **Shopify Advanced** (plan names)
- **Customer First focus** (developer name)
- Other brand/product/proper names: **Casper**, **Firecart**, **FirstPromoter**, **Netlify**,
  **Amazon**, **Walmart**, **eBay**, **Klaro**, app handles (e.g. `cart-persistify`), URLs, and
  email addresses.

> Interpolation tokens like `{name}` and `{count}` are also never translated — keep the braces and
> token name exactly; only the surrounding words are localized.

### 3b. Per-locale phrasing notes (in-market, NOT literal)

Translate for how merchants/shoppers actually search and speak in each market — not word-for-word.
Source: `docs/research-notes.md` §5. These are the highest-risk terms; reviewers must confirm them.

| Locale | "Cart" / core term | Use this phrasing | Avoid (literal-translation trap) |
|--------|--------------------|-------------------|----------------------------------|
| `de` | **Warenkorb** | cross-device → **`geräteübergreifend`**; "Warenkorb speichern/merken"; pain: "Warenkorb wird nicht gespeichert / verschwindet" | "persistent" (unnatural); generic "Gerät" phrasing instead of `geräteübergreifend` |
| `fr` | **panier** | "synchroniser le panier entre appareils"; "**sauvegarder/enregistrer** le panier"; pain: "panier vidé après connexion" | over-using "panier **persistant**" (less natural than sauvegarder/enregistrer) |
| `es` | **carrito** | "sincronizar carrito entre dispositivos"; "**guardar** carrito"; "carrito persistente"; pain: "se borra/pierde el carrito al iniciar sesión" | stiff literal translations of "persistent" |
| `it` | **carrello** | abandoned → "**carrello abbandonato**" | — |
| `pt-BR` | **carrinho** | abandoned → "**carrinho abandonado**" | — |
| `nl` | **winkelwagen** | — | "winkelmandje"/"kar" as the primary term |
| `ja` | **カート** | "デバイス間でカート同期"; pain: "ログインするとカートが消える" | abandonment must be **`カゴ落ち` (kago-ochi)** — **never** a literal translation |
| `zh-CN` | **购物车** | "跨设备同步购物车"; abandonment → **`弃购`** | literal renderings of "abandoned cart" |
| `ko` | **장바구니** (basket) | abandonment → **`장바구니 이탈`** | **`카트`** ("cart") as the primary term — biggest trap; use **장바구니** |
| `sv` | **varukorg** | — | — |
| `da` | **indkøbskurv** | — | — |
| `nb` | **handlekurv** | — | — |
| `fi` | **ostoskori** | — | — |

If a reviewer changes a term here, update this table so the next `i18n:sync` carries the correction
into the translation memory for every page.

### 3c. Release-review terminology additions (2026-07-20, agent review round)

Confirmed against Shopify's own localized materials during the review; treat as termbase:

- **de**: "persistent" as a German adjective → **dauerhaft gespeichert**; register = **du** (matches Shopify DE).
- **fr**: plan = **forfait**; app embed = **intégration d'application**; toggle = **bouton** (never "interrupteur"); storefront = **boutique en ligne** (never "vitrine"); AOV = **panier moyen**; "Free Starter plan" = **forfait Starter gratuit**.
- **es**: Shopify admin = **panel de control**; draft orders = **pedidos preliminares**; the store = **la Shopify App Store** (EN name kept); popups = **pop-ups**; register = **tú**.
- **zh-CN**: theme = **模板** (Shopify zh official, not 主题); audit = **诊断**; abandonment = **弃购** (enforced); register = **您**.
- **ko**: `word-break: keep-all` now set for `html[lang='ko']` in global.css (heading wraps); 카트 count is zero site-wide.
- **Ratings**: hardcoded rating strings use **4.9 (dot)** in every locale for consistency with the `{rating}` token injected from `site.ts` — if number-format localization is ever wanted, do it at the token source, not per-string.
- **Stat lockup**: `trust.impact.*` stays the owner-approved short form (**$30M+**) in all locales (standing honesty rule); localized spellings proposed by reviewers were reverted.

---

## 4. Catalog file layout

All copy lives in JSON string catalogs under `src/i18n/strings/` — components carry **zero**
hard-coded copy (see `docs/content-authoring-guide.md`). Two scopes per locale:

```
src/i18n/strings/
  en.json              ← English GLOBAL strings (nav, CTAs, footer, a11y, meta) — authored
  en/                  ← English PER-PAGE strings, one file per page key — authored
    home.json
    pricing.json
    calculator.json
    …one file per route key in src/config/routes.ts
  de.json              ← German global — GENERATED by i18n:sync (do not hand-edit)
  de/                  ← German per-page — GENERATED
    home.json
    pricing.json
    …
  fr.json  fr/  es.json  es/  …  fi.json  fi/   ← same shape for all 14 non-English locales
```

- **You only ever author the `en.json` + `en/<page>.json` files.** Everything else is output.
- Each file is a **flat object of string → string**. Keys follow the
  `page.<key>.<section>` convention from the authoring guide (e.g. `page.pricing.h1`,
  `page.home.s2.b`, `page.home.faq.q1.a`).
- The set of keys in a translated `<locale>/<page>.json` must exactly match the English source —
  no missing keys, no extra keys. `i18n:check` enforces this (§5).
- Generated files should be treated as build artifacts: do not hand-edit them (a re-sync would
  overwrite changes). To fix a translation, fix the **glossary/termbase** (§3) or the **English
  source**, then re-run `i18n:sync`. (A reviewer-locked override mechanism can be added later; for
  now, corrections flow through the glossary + translation memory.)

---

## 5. Pipeline: `i18n:sync` and `i18n:check`

Two npm scripts (defined in `package.json`; implementations in `scripts/`) keep all 15 in lockstep.

### `npm run i18n:sync` — generate / fan-out
Reads every English catalog (`en.json` + `en/*.json`), and for each of the 14 non-English locales:
1. Loads the **glossary/termbase** (§3) — DO-NOT-TRANSLATE terms are frozen; per-locale phrasing is
   applied; `{tokens}` are protected.
2. Reuses the **translation memory** for unchanged strings (only new/changed English keys are
   re-translated — fast, stable, and cheap).
3. Writes `<locale>.json` + `<locale>/<page>.json` with the **identical key set** as English.

Run it after any English copy change, after adding a page, or after adding a locale. It is
idempotent — running it with no English changes is a no-op.

### `npm run i18n:check` — drift check (CI gate)
Verifies the catalogs are in sync and **fails the build if any English key lacks an output in any
of the 15 locales** (or if a locale has stray keys, or a file is missing). This is what guarantees
"no page is done until it exists in all 15." Wire it into CI on every PR and before `astro build`.

```jsonc
// package.json (already present)
"scripts": {
  "i18n:sync":  "node scripts/i18n-sync.mjs",   // generate/fan-out all 14 from English
  "i18n:check": "node scripts/i18n-check.mjs"    // drift gate — fails on any missing key/locale
}
```

**Recommended CI step:** run `i18n:check` on every pull request and in the deploy pipeline before
`astro build`. A red `i18n:check` means someone added or changed English copy without re-running
`i18n:sync` — the fix is always `npm run i18n:sync && git add src/i18n/strings`.

---

## 6. How to add a locale

Adding a 16th (or replacing one) is a **config + sync** operation — never a page edit:

1. **Add one entry to `LOCALES` in `src/config/locales.ts`** with `code`, `path` (lowercase, clean),
   `label` (native autonym), `englishLabel`, `dir`, and `reviewed: false`. Place it in the array at
   its rollout-priority position. That single edit automatically updates Astro i18n config, the
   sitemap map, `<SEOHead>` hreflang/x-default, the language switcher, and the `i18n:check` matrix.
2. **Extend the glossary/termbase (§3)** with the new locale's core term, in-market phrasing, and
   any traps (mirror the research-notes §5 method).
3. **Run `npm run i18n:sync`** → generates `<locale>.json` + `<locale>/*.json` for every page.
4. **Run `npm run i18n:check`** → confirms zero drift. Commit the generated files.
5. The locale ships immediately as `noindex` (hreflang wired). When a native reviewer signs off,
   flip **`reviewed: true`** in `locales.ts` → it becomes indexable. No page or component changes at
   any step.

To **retire** a locale, remove its `LOCALES` entry and delete its generated catalogs; re-run
`i18n:check`.

---

## 7. Native-review priority (which pages to review first)

Flip locales indexable **page-cluster by page-cluster**, starting with the most claim-heavy pages
where a bad machine translation would misstate a fact or weaken trust. Priority order:

1. **Home** (`home`) — the hero parity claim, trust strip, and primary CTAs.
2. **Parity / big-retailers** (`big-retailers`, parity cards) — carries the Walmart/Amazon
   first-party quotes; mistranslation here is a factual-accuracy risk.
3. **Comparisons** (`vs-recovery`, `compare-email`, and any vs-competitor pages) — claim-dense,
   competitor-named, easy to get subtly wrong.
4. **Pricing** (`pricing`) — money, plan names, "every feature on every plan" framing, Free Starter.

Then the cornerstone/education cluster (`cornerstone`, `how-it-works`, `cross-device`,
`cart-disappears`), then use-case/B2B (`b2b`, `plus`, use-case pages), then long-tail. The
partner/affiliate pages (`partners`, `affiliates`) should be reviewed alongside pricing wherever the
partner program is being promoted in that market.

**Reviewer task per locale:** read the page in-market, confirm the §3 glossary terms render
correctly, fix any phrasing via the glossary (not the file), re-sync, then set `reviewed: true`.
Do this cluster-by-cluster — a locale can be partially reviewed by reviewing the high-priority
clusters first, but a locale only flips fully indexable once its whole page set passes.

---

## 8. Contributor checklist (keep all 15 in sync, automatically)

- Author/edit **English only** (`en.json`, `en/<page>.json`).
- Never hard-code a locale list — read from `src/config/locales.ts`.
- Never hand-edit a generated `<locale>` catalog; fix English or the glossary, then re-sync.
- After any copy change: `npm run i18n:sync` → commit the regenerated catalogs.
- Before opening a PR / before deploy: `npm run i18n:check` must pass.
- New page? Add its `en/<key>.json`, run `i18n:sync`, confirm `i18n:check` is green — it now exists
  in all 15.
- Flip `reviewed: true` only after a native reviewer signs off on that locale's priority clusters.
