# Native-Review Punch-List (machine translations)

The 14 non-English locales are **machine-translated and shipped `noindex`** (hreflang wired) until a
native speaker reviews them and you set `reviewed: true` in `src/config/locales.ts`. This file is the
input for that review — spot-checked findings from an automated localization QA pass (German + Japanese),
plus the known content-drift items. Prioritize the **claim-heavy + high-traffic** pages first: home,
`/partners`, `/pricing`, the parity/comparison pages.

## Overall quality (spot-check)
- **Japanese (ja): A−** — faithful to current English, no mapping bugs; `カート` + `カゴ落ち` (the real
  abandonment idiom) used correctly. Polish only: trim over-explicit あなた pronouns; a few literal calques
  (e.g. 束 for "a book of stores" → ポートフォリオ); clarify `home.compare.row.action.recovery` ("戻るをクリック" reads
  like a browser Back button).
- **German (de): B+** — fluent, correct in-market terms (`Warenkorb`, `geräteübergreifend`), correct German
  typography. Needs a native pass for the items below.

## Known issues to fix in native review
1. **"Vertraut von … seit 2016" (de) is a calque** of "trusted by" — `vertraut` means "familiar." Appears in
   `announce.text`, `common.since`, `trustbar.lead`, `home.trust.stat.stores`, `home.final.trust`. Replace with
   "Genutzt von / Im Einsatz bei / Bewährt bei."
2. **Content drift in early-finishing locales.** During the final review pass several English strings were
   revised AFTER translation. The 3 highest-value files (`partners.json`, `affiliates.json`, `pricing.json`)
   were **re-translated** to fix this (partner headline now leads with 30%; pricing badge = "Every feature
   included", not "Most popular"; FirstPromoter retained). The following **lower-visibility** keys may still be
   translated from the older English in some locales — refresh during native review or by running
   `npm run i18n:sync` with an LLM key:
   - `hero.sub`, `home.motion.intro`, `home.calc.intro`, `calc.intro`, `calc.input.loggedIn.help`
   - `footer.notAffiliated` (expanded disclaimer), `privacy` s7 (GDPR wording), `uc-repeat` (seamless→consistent),
     `big-retailers` s1 (eBay softened), `faq.q13` / `home.faq.q7` (ROI question).
3. **Scaffolded keys (English placeholder in ~7 locales):** `partners.earnings.*`, `affiliates.terms`/`how`,
   `faq.q13`, `home.faq.q7` — these render English until the next sync/native review. (de + ja already have them
   translated.)

## Pipeline reminder
- `npm run i18n:check` — fails if any English key lacks a locale value (CI guard).
- `npm run i18n:sync` / `-- --scaffold` — report / fill gaps. The LLM translation hook is documented in the
  script for when an API key is wired.
- Glossary + do-not-translate list + per-locale phrasing: `docs/localization.md`.
