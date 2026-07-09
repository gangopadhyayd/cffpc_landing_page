# QA process — how changes get verified before (and after) they go live

Written 2026-07-09 after the `footer.link.*` incident (below). This is the
standing process; the one-time deep audit methodology lives in
docs/audit-plan.md and is complementary (run it quarterly or after redesigns).

## The incident that forced this

2026-07-08: an SEO round re-enabled five deferred pages (`cross-device`,
`vs-recovery`, `b2b`, `uc-wholesale`, `compare-email`) and gave them footer
slots in `src/config/routes.ts`. The footer renders labels via a dynamically
constructed key — `t(locale, `footer.link.${p.key}`)` — and four of those keys
existed in **no catalog, not even English**, so `t()`'s last-resort fallback
(the key itself) rendered on every page of the site in all 15 locales:
`footer.link.cross-device` etc., visible in production for ~a day until the
owner spotted it.

Why nothing caught it:
- `npm run i18n:check` only verifies **en → locale parity**. A key missing from
  English itself is invisible to it.
- Dynamic key construction (`` `footer.link.${p.key}` ``) defeats any
  source-level "is this literal key in the catalog" check.
- `astro check` (types) passes — `t()` returns a string either way.
- Nothing ever looked at the **built output**, and no human browsed the site
  between push and production.

The durable lesson: **the only reliable place to catch what visitors see is the
rendered dist/, checked by machine, on every build.**

## Defense layers (what runs now, and when)

### Layer 1 — static gate on every build: `scripts/qa-gate.mjs`
Wired into `npm run build` (`astro build && node scripts/qa-gate.mjs`), which
is also Netlify's build command — so **it runs in CI on every push and a
failure fails the deploy** (the previous production version stays live).
Checks, all against the built `dist/`:

1. **Leaked i18n keys** — raw `x.y.z` key tokens in rendered text, meta
   description/OG copy, or alt/aria/placeholder attributes. Catches the entire
   incident class regardless of how the key was constructed in source.
2. **Broken internal links & assets** — every `href`/`src`/`srcset`/`poster`/
   OG image/CSS `url()` must resolve to a real file in dist (clean-URL aware),
   **case-sensitively** — macOS's case-insensitive filesystem hides case bugs
   that 404 on Netlify's CDN. `netlify.toml` redirect sources count as valid.
3. **Sitemap integrity** — every sitemap URL resolves to a page; emitted pages
   absent from the sitemap are reported (the 14 noindex machine locales are
   expected).
4. **i18n locale drift** — delegates to `scripts/i18n-check.mjs` (en → locale
   parity), so the gate is a superset of the old check.

Run standalone: `npm run qa:gate` (needs a prior build).

### Layer 2 — real-browser sweep before pushing: `scripts/qa-browse.mjs`
`npm run qa:browser` serves `dist/` locally with Netlify-style clean URLs and
loads **every page at 4 viewports** (390 phone / 768 tablet / 1440 laptop /
2560 wide — the wide tier exists because a fold-gap bug only showed ≥2000px)
in headless Chromium. Per page×viewport it asserts:

- zero console errors / uncaught page errors,
- zero failed same-origin requests (external analytics failures are reported
  but don't gate — ad-block/consent make them flaky),
- no document-level horizontal overflow (the "mystery sideways scroll" class),
- no broken `<img>` at runtime, exactly one `h1`, no empty/`#` hrefs,
  non-empty `<title>`.

It writes screenshots + `qa-browse-results.json` to `qa-report/` (gitignored):
a sample set by default (all EN pages at all viewports + every locale home at
mobile — ~75 shots), every failing combination always, `--screens all` for
everything. **Machine checks catch breakage; the screenshots exist so a human
can catch ugliness.** Flick through them before a significant push.

Full local pre-push suite: **`npm run qa`** = typecheck → build (incl. gate) →
browser sweep.

### Layer 3 — post-deploy verification of production
The same browser sweep runs against prod:

```sh
node scripts/qa-browse.mjs --base https://persistentcartapp.com            # full
node scripts/qa-browse.mjs --base https://persistentcartapp.com --filter es # subset
```

plus a 10-second confirmation that the deploy actually happened (a push is NOT
always a deploy — netlify.toml skips docs-only commits):

```sh
curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  https://api.netlify.com/api/v1/sites/7a932313-d7bf-4877-85bd-d7944c207fb4 \
  | jq -r '.published_deploy | .created_at + " " + .commit_ref[0:8] + " " + .title'
```

(The CLI token lives in `~/Library/Preferences/netlify/config.json`; the site
is repo-linked to `gangopadhyayd/cffpc_landing_page@main`, build command
`npm run build`.)

## The release checklist

For any change that touches `src/`, `public/`, or config affecting output:

1. **Author** — if you added/re-enabled a page or a nav/footer slot, the deal
   is: registry entry + `page.<key>.title/desc/crumb` + `footer.link.<key>` /
   nav label + per-page content catalog, in `en` first, then
   `npm run i18n:sync` and real translations for the 14 locales (glossary in
   docs/localization.md). The gate will catch a miss, but catch it yourself first.
2. **`npm run qa`** — typecheck, build+gate, full browser sweep. Zero findings.
3. **Eyeball `qa-report/`** — flick the sample screenshots (mobile EN + the
   pages you touched at all four widths). Machines don't see "ugly".
4. **Push** to `main` → Netlify builds with the same gate.
5. **Verify prod**: confirm the published deploy is your commit (curl above),
   then spot-sweep prod (`--base … --filter <what you changed>`), or minimum
   `curl -s https://persistentcartapp.com/ | grep -c 'footer\.link\.'` → must be 0.

For docs-only commits: nothing to do (Netlify skips the build via the
`ignore` rule in netlify.toml).

## Cadence

- **Every push**: layers 1 (automatic in CI) — the floor that stops incident-class bugs.
- **Before every push that changes output**: layer 2 + screenshot flick.
- **After every deploy**: layer 3 spot check on what changed.
- **Quarterly / after redesigns**: the full 7-lens audit in docs/audit-plan.md
  (visual, copy/claims, technical SEO, CWV, functional, i18n quality, a11y).

## Known gaps → next investments (in value order)

1. **Visual regression diffs** — qa-browse already produces deterministic
   screenshots (reduced motion, fixed viewports); adding a baseline dir + pixel
   diff (odiff/pixelmatch) would catch layout drift automatically instead of
   relying on human flicks. ~half-day.
2. **Accessibility pass** — inject axe-core in qa-browse (page.addScriptTag on
   the local sweep) and gate on serious/critical violations. ~half-day.
3. **External link checker** — `qa:links` HEADing the ~25 distinct external
   URLs weekly (App Store links with UTMs, Walmart/Amazon help articles rot).
   Cheap cron candidate. ~1 hour.
4. **Lighthouse budget** — LCP/CLS/perf budget on home+pricing at mobile in CI;
   the site is currently very fast (no external JS, inlined islands), a budget
   keeps it that way. ~half-day.
5. **hreflang reciprocity validator** — every locale page must reference all 15
   alternates + x-default reciprocally; gate currently only checks the URLs
   resolve. ~2 hours in qa-gate.
6. **Deploy Previews** — Netlify Pro includes them; opening a PR instead of
   pushing straight to main gives a full prod-like preview URL to sweep before
   merge. Process change, zero code. Worth adopting once changes get riskier
   than solo pushes.
