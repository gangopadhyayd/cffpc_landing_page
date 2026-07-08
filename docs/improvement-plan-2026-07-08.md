# Improvement Plan — owner feedback round (2026-07-08)

Owner feedback (verbatim themes) + the general classes they represent, and what ships.
Principle: fix the class, not just the instance. Batched into ONE deploy (credits).

## The general classes behind the specifics

1. **Proof under-sells or is ambiguous** → every proof element must say WHAT the
   number is, WHEN it's from, and HOW it happened (auto-transfer), in that reading
   order, prominently.
2. **Clever-but-unclear copy** → headings must parse on first read with zero
   context. Sweep pattern: if a heading needs its body to make sense, rewrite it.
   The owner's model line: "One-click setup, works silently in the background."
3. **Answers anchored to volatile details** (prices, temporary free-tier mechanics)
   → anchor to durable value proof (the dashboard's measured order value; the
   1,000×+ vs subscription framing the owner approved) instead.
4. **The figure shows the outcome, not the mechanism** → the diagram must carry:
   cart is bound to the LOGIN, transfer is AUTOMATIC at sign-in, no
   popups/emails — and default Shopify lacks this.
5. **Built content parked while its query intent is real** → re-enable finished
   pages that answer big queries instead of writing new ones.
6. **Prose where a diagram would do** → evaluated per main section (see §Diagrams).

## Specifics shipping in this round

- **Stat**: "$30 Million+ · in the last 30 days (bold) · order value from carts
  auto-transferred across devices" — hero lockup reordered to exactly that reading
  order; metric band label leads with the window. EN spells "Million"; other
  locales keep their established numeral form. (Owner asked "more prominent with
  rating + BFS if it makes sense": proof row [BFS + 4.9★] tops the fold, stat sits
  at display size right under the CTAs — one proof voice per slot, no crowding.)
- **Figure**: both laptops now share one fixed screen height (the synced cart's
  content made its laptop taller = "one laptop bigger/oddly shaped"); caption +
  a new laptop annotation state the mechanism: restored automatically at sign-in,
  no popups, no emails.
- **FAQ "worth it" answer** (home q7 + faq q13, ×15): dashboard-measured order
  value + owner's 1,000×+ vs subscription framing; no plan prices, no 10-sync
  detail.
- **Benefits copy**: heading → "One-click setup — then it works silently in the
  background." · benefit 3 title → "No interruptions for shoppers".
- **How-it-works** meta-sentence ("worth doing this deliberately…") dropped for a
  direct activation note (same class as above; ×15).
- **SEO/AI expansion (owner's angles)**:
  - Re-enabled from V1_DEFERRED (already built + translated): **vs-recovery**
    (prevention vs abandoned-cart email — owner's exact example), **compare-email**,
    **b2b**, **uc-wholesale** (wholesale/multi-user carts), **cross-device**
    (phone-ad → desktop journey). Footer/sitemap/llms.txt follow automatically;
    related-links restored; **vs-recovery added to the top nav** ("link at the top").
  - New FAQ entries ×15: **cart-as-wishlist** ("your cart becomes the wishlist that
    follows the login — no separate wishlist app") and **phone-ads → desktop
    checkout** ("shoppers click ads on phones, buy on desktops; the cart must
    survive the switch"). FAQ page 15 → 17 questions.
  - Wholesale/B2B intent lands on the re-enabled b2b/uc-wholesale pages (FAQ q8
    already routes there).
- **Query list for future content** (not built this round): "shopify cart doesn't
  sync between devices", "shopify abandoned cart email alternative", "shopify
  wishlist without app", "cart recovery vs cart persistence", "shopify b2b shared
  cart", "shopify cart disappears on phone". First four are now covered by live
  pages/FAQs; track in GSC once crawled.

## Diagrams-vs-text evaluation (main surfaces)

- **Home/problem**: already card-pair + fork diagram — no change.
- **Home/benefits**: 3 icon cards — fine as is.
- **Home/parity**: quote cards + account diagram — the diagram the owner likes;
  no change.
- **/how-it-works**: 5 prose sections → START HERE next round: a numbered
  save → sign-in → merge strip (3 small panels, reuses the hero's device visual
  language) above the prose; prose then shortens. Deferred to next deploy window
  (needs ~6 new keys ×15 + a component; this round is already large).
- **/pricing**: plan cards already visual; fees line stays text.
- **/faq**: text by nature.

## Out of scope this round (parked)

Calculator re-enable (interactive; separate QA pass), the how-it-works step-strip
build, GMD logo swap, SERP title trims, signed-in/logged-in sweep — all remain on
the audit report's owner queue.
