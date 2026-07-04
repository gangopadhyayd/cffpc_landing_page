# Content Authoring Guide (English canonical)

How to write page content for persistentCartApp.com. Author **once in English**; translations
are generated later. Components carry zero hard-coded copy — everything lives in the catalog.

## File + key convention
Write a JSON file at `src/i18n/strings/en/<key>.json` — a **flat object of string → string**.
For a page with key `<key>` and `sectionCount` N (+ optional `faqCount` M), provide exactly:

- `"page.<key>.title"` — SEO `<title>`, ~50–60 chars, include "Persistent Cart" and/or "Shopify".
- `"page.<key>.desc"` — meta description, ~150–160 chars, answer-first (the answer in the first clause).
- `"page.<key>.crumb"` — 2–4 word breadcrumb label.
- `"page.<key>.h1"` — the page H1: specific and concrete, not generic.
- `"page.<key>.lede"` — an **answer-first 40–60 word** intro that directly answers the page's core question.
- For i = 1..N: `"page.<key>.s<i>.h"` (an H2 — phrase as a real question or a clear claim) and
  `"page.<key>.s<i>.b"` (body, ~80–180 words; open with a direct answer; use `\n\n` to split two paragraphs).
- For j = 1..M (if faqCount given): `"page.<key>.faq.q<j>.q"` and `"page.<key>.faq.q<j>.a"`
  (answer-first, 40–90 words; the Q phrased exactly as a merchant would search it).

Use plain strings. Interpolation tokens look like `{name}`. No HTML except inline — keep prose clean.

## Facts — use ONLY what's verified
Read `docs/research-notes.md` for the canonical facts. Never fabricate numbers, quotes, or stats.
- Cross-device sync is for **signed-in / logged-in customers** — always keep that qualifier (it's what makes
  the claim true). Guests are not synced.
- **Default = silent auto-merge** (no popups, emails, or opt-ins). An **optional** "keep or combine" prompt exists.
- **Install** = one click from the App Store, then enable the app embed in the theme editor (no theme code).
  Don't say "zero setup" — say "one click and one switch."
- **Pricing**: every feature on every plan, **priced to your Shopify plan**; Free Starter plan + 30-day trial on paid.
- **Parity**: Amazon and Walmart keep a signed-in cart across devices (verified first-party quotes in
  research-notes §8). A default Shopify cart lives in a **2-week browser cookie**, not on the account, so it's
  **not native cross-device**. Always say "across devices **and browsers**" (same browser does persist).
- **Don't claim automated GDPR erasure** (handlers are acknowledgment stubs). **Don't** market draft-orders /
  wholesale as a current shipped feature — it's on the roadmap.
- **Stats** (research-notes §9): cite source + date; label old ones (2012/2014). Never use the banned/unverifiable
  stats. The device-switch → lost-sale chain is a **reasoned inference, not a measured rate** — say so.
- Real proof numbers are **internal** → don't publish specific counts; the site uses qualitative phrasing
  ("thousands of stores", "since 2016", "4.8★").

## Voice
Direct, specific, confident, merchant-friendly. Educate the unaware without condescending. Concrete mechanism
over adjectives. Founder-credible, not salesy.

**Banned buzzwords:** unlock growth, powerful, innovative, supercharge, next-generation, revolutionize,
game-changer, cutting-edge, effortless, "take your store to the next level." Use "seamless" only literally.

## GEO / answer-engine optimization
- Open every page and section with a **direct answer** (40–60 words) before elaborating.
- Where a page targets a yes/no question, answer it flatly first: e.g. *"Does Shopify sync carts across devices?
  No — by default it doesn't, and here's why."*
- Make sections self-contained (200–500 words of value), with real, cited, dated statistics where used.

## Output
Write the file(s) with the Write tool. Return ONLY a short list — each file path + key count. Do NOT paste content back.
