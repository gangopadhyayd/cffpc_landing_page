# Asset craft playbook — hero images & creative prompting

Distilled from a verified research pass (2026-07-07: 5 search agents, 15+
sources, 3 adversarial verifiers; full citations in the session brief).
Companion to `app-store-assets-plan.md` and `design-assets/app-store/README.md`.

## Why the first image gets the investment

- **84.7% of store visitors see the full first screenshot; only 15.15% see the
  full second** (Storemaven iOS behavior study, archived — the strongest
  defensible number; the viral "70% never scroll" line is folklore).
- Vendor-reported creative A/B lifts: +32% conversion from a screenshot
  redesign (SplitMetrics/ZiMAD); +19.7% from caption/contrast iteration.
- All mobile-app-store data — no Shopify-specific study exists — but Shopify's
  own docs treat the feature image as the primary conversion asset.

## Compliance posture for stats in the hero (refined)

Shopify req. 4.3.4's body text never actually mentions images (copy-paste bug
in their docs) — so numbers inside genuine product UI are a gray area, not a
hard ban. Safe path (what we do): revenue figures live **inside the app's UI
frame** as plausible product data; never as marketing overlay; never
superlative ("recover 25% more!"), never guarantee-framed. Product-UI
analytics is effectively **the one legitimate proof device left** on Shopify
(ratings/reviews/pricing/Shopify marks are all banned in images).

## Composition rules (the ones we design against)

1. One dominant element; dominance needs contrast, not just size (Smashing).
2. Max three hierarchy levels: payoff → headline → everything else.
3. Squint test is the acceptance gate (Kennedy / NN/g).
4. Z-path: headline top-left, payoff/resolution at the bottom-right terminal.
5. Headline 2–6 words, benefit-verb phrasing; subhead ≤ 12 words.
6. Text ≤ ~20% of canvas (Google Play's hard number, transferred).
   Headline ≈ 72–90px on a 1600px canvas → legible at the 350px thumbnail.
7. Minimum viable UI: crop hard, oversize the key element, let it break frame.
8. De-emphasize the "before" state with a warm low-contrast ink tint
   (closer-to-background), not grey; weight extremes not weight steps.
9. Contrast math for our palette: ink/paper ≈ 16:1 (fine); marigold/paper ≈
   **3.7:1 — large display elements only, never small text**; small text is
   always ink.
10. One hero metric max, ~3 supporting; color functional only.
11. Test in competitive context: paste the candidate among real rival cards
    (Casper = orange radial; old ours = navy) and check color collision; view
    at 25% zoom / 350px before shipping.

## One-frame before/after devices, by simplicity

1. **Implied before/after** — one UI, one delta metric ("↗ +$1,840"); before is
   implicit. Most thumbnail-proof, most compliant.
2. **Two-state pair** — same object twice, color-coded, identical geometry;
   dash (not red ✕) for the lost state.
3. **Split canvas / diptych** — ONE continuous background, split only the
   subject; label states specifically ("The phone cart stayed behind"), never
   generic Before/After; panels share exact geometry. ← *heroB uses this.*
4. Crossed-out state inside the UI (strikethrough thins at 350px — test).
5. Ghosted before behind solid after (undocumented device; risky at thumbnail).
6. Arrow strip before→after (three elements = clutter; only if the arrow IS the
   sync metaphor).

## Creative-prompting kit (for future asset generations)

Why defaults are generic: models sample the high-probability center of design
training data — push off-center explicitly (Anthropic).

- **Constraint-first**: lock hexes, type pair, grid, spacing as hard rules.
- **Reference-anchor by structure, not vibe**: "split-screen, all-caps sans
  headers paired with serif body" beats "modern and clean".
- **Typography extremes**: 100/200 vs 800/900 weights, ≥3× size jumps.
- **Color commitment**: sea of paper + ONE marigold moment.
- **Negative constraints with replacements**: "no gradients → hairline ink
  borders; no Inter → Hanken Grotesk".

**House style block (paste into any asset brief):**
> Warm editorial print, magazine-infographic register. Field: paper #F7F4EE.
> Ink #1C1815 for all text. Exactly one accent: burnt marigold #D8541E,
> reserved for the single payoff element. Fraunces for the display line;
> Hanken Grotesk for everything else; size jump ≥3×. Flat color, hairline ink
> borders, generous margins, one focal point, max three hierarchy levels.
> NEVER: gradients, shadows, purple/teal SaaS palette, three-box icon layouts,
> Inter/Roboto, more than one accent moment.

**Iteration loop:** keep this playbook in context → generate 3 divergent
directions before refining → render + screenshot at full size AND 350px →
score against the checklist → refine ONE dimension per pass (type, then color,
then composition). Expect convergence in 1–2 critique passes.

**Per-iteration checklist:** payoff reads first when squinting; headline
legible at 350px; focal points = 1; hierarchy ≤ 3; accent zones = 1; colors
≤ 3; small text ≥ 4.5:1, large ≥ 3:1; text ≤ 20% of canvas; headline 2–6
benefit words; real UI dominant; no pricing/reviews/marketing-stats/Shopify
marks; doesn't duplicate the app-card subtitle; wouldn't be mistaken for a
generic SaaS banner.

## Reconciliation with the shipped hero round (2026-07-07)

heroB-diptych passes the framework: device #3 executed per craft (specific
state labels, shared geometry, warm-tint de-emphasis), Z-path with the real
$452,098 banner at the terminal, marigold only in display-size elements,
verified at 360px. The 7-word headline ("A device switch shouldn't empty the
cart") sits one word over the 2–6 guide — acceptable (source is weak-tier);
tightening option if ever wanted: "Don't lose carts to device switches" (6).
Device #1 (single UI + delta metric) remains the fallback if App Review ever
pushes back on the diptych.
