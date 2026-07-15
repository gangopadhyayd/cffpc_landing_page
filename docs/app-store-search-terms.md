# App Store search terms — all 11 locales (2026-07-08)

The dedicated discovery/keyword field ("App store search terms" under **App
discovery content**) for the Persistent Cart listing, per locale. Records the
final terms, why, and exactly how they were set.

## The hard constraint (why we can't just "add more")

The field is **capped at 5 terms** — editor guidance: *"Add a minimum of 1
term, maximum of 5."* Every locale (English + 10 translated) is at the full 5,
so there is **no headroom to add a 6th** anywhere. The only lever is choosing
the best 5. Other rules enforced: each term ≤20 chars, complete words, one idea
per term, **no "Shopify"**, no competitor names.

This is the ONLY free-keyword field. Other indexed surfaces are content, not
keyword slots: app name (30), app-card subtitle (62, currently full), intro
(100), description (500). SEO **Title tag (60) + Meta description (160) are
primary-listing-only** — translated listings render no such inputs, so
localized pages inherit the English meta (a Shopify platform limitation, not
fixable per-locale).

## Selection principle (CORRECTED 2026-07-08)

**Spend the 5 slots on keywords the listing is NOT already indexed for
elsewhere.** Shopify indexes the app name and app-card subtitle (and the
intro/description) for search, so a search term that merely repeats a word
already in the name/subtitle is largely wasted — you already rank for it. The
scarce slots should cover NEW territory.

Verified English coverage (name + subtitle + intro): **"sync" appears 3×,
"save" and "devices/across devices" are present** → so `cart sync`,
`save cart`, and most of `cross-device` are already covered by:
- name: *"Persistent Cart - Sync Devices"*
- subtitle: *"Automatically save and sync carts when shoppers switch devices"*
- intro: *"Syncs carts automatically for logged-in users across devices…"*

Whereas **abandoned, recovery, b2b, customer/accounts** appear nowhere in those
fields — so those are the high-value additive terms.

⚠️ **This applies to every locale.** The localized subtitles also contain their
language's save/sync/cross-device words (e.g. de subtitle *"Speichert und
synchronisiert Warenkörbe geräteübergreifend"* already has save + sync +
cross-device), so localized search terms built around save/sync/cross-device
are partly redundant with the subtitle. The higher-value localized terms
emphasize **abandoned · recovery · lost · wholesale/B2B · customer-account**
concepts and avoid repeating the subtitle's save/sync/device words. Terms use
in-market phrasing (カゴ落ち, 弃购挽回, 장바구니 이탈, Warenkorbabbruch, övergiven
varukorg), not literal translation.

## Final terms

All 11 re-optimized for **unique coverage** (2026-07-08): terms avoid repeating
the name/subtitle's save/sync/cross-device words and cover additive concepts —
**abandoned · recovery · lost · B2B · customer-account**.

| Locale | Search terms (max 5) |
|--------|----------------------|
| **en** | cart recovery · abandoned cart · b2b cart · cross-device cart · customer accounts |
| fr | panier abandonné · récupération panier · panier B2B · panier perdu · compte client |
| es | carrito abandonado · recuperar carrito · carrito B2B · carrito perdido · cuenta cliente |
| pt-BR | carrinho abandonado · recuperar carrinho · carrinho B2B · carrinho perdido · conta de cliente |
| zh-CN | 弃购挽回 · 购物车丢失 · 批发购物车 · B2B购物车 · 客户账户 |
| ja | カゴ落ち · カート復元 · カート紛失 · 卸売カート · 顧客アカウント |
| ko | 장바구니 이탈 · 장바구니 복구 · 장바구니 분실 · 도매 장바구니 · 고객 계정 |
| de | warenkorb abbruch · warenkorb rettung · warenkorb verloren · b2b warenkorb · kundenkonto |
| nl | verlaten winkelwagen · winkelwagen herstel · winkelwagen kwijt · b2b winkelwagen · klantaccount |
| sv | övergiven varukorg · återställ varukorg · förlorad varukorg · b2b varukorg · kundkonto |
| da | forladt kurv · gendan kurv · mistet kurv · b2b kurv · kundekonto |

*(en note: "cross-device cart" kept — its exact compound isn't in the English
copy, so it's still additive; the localized subtitles DO contain their
cross-device word, so localized sets drop it in favor of "lost".)*

## What changed / correction trail

- **English (final, corrected):** `cart recovery · abandoned cart · b2b cart ·
  cross-device cart · customer accounts`. This maximizes unique coverage:
  recovery / abandoned / b2b / customer+accounts are all absent from the
  name/subtitle/intro; cross-device is the one positioning term kept (its exact
  compound isn't in the copy). Dropped **"save cart"** (redundant — "save" is in
  the subtitle).
  - *Mistake made and reverted mid-session:* an interim edit added "cart sync"
    and removed "customer accounts". That was wrong — "cart sync" is already
    covered 3× (name "Sync Devices" + subtitle "sync carts" + intro "Syncs
    carts"), so it wasted a slot, while "customer accounts" covered unique
    ground. Reverted per the coverage principle above.
- **10 localized locales — re-optimized (DONE 2026-07-08).** Each dropped the
  subtitle-redundant save/sync/cross-device terms and swapped in additive ones:
  kept the already-additive abandoned/recovery/lost terms and added B2B +
  customer-account per locale. All verified at exactly 5 via fresh editor
  reload, then independently re-confirmed in a fresh browser session.

## How they were set (method)

The visible input + "Add" button **cannot be driven by automation** — no
synthetic or real event (native value-setter, synthetic/real Enter, real
clipboard paste, CDP click, direct React prop calls) commits a tag. The working
path is the component's own react-hook-form field-array callbacks:

1. Walk the React fiber up from the search `input[maxlength="20"]`
   (`el[__reactFiber$…]`, follow `.return`) to the component whose
   `memoizedProps` expose `onAddTag: async f => i.append({content:f})` and
   `onRemoveTag: f => i.remove(idx)`. Call those directly.
2. Read current terms from the `memoizedState` hook whose value is an array of
   `{content}` objects.
3. remove-all (descending index) → add each target term → **dedupe/trim** loop
   (remove any duplicate / non-target / >5) → top-up any missing → dedupe again
   → click the top-bar **Save**.
4. **Verify by fresh reload** and re-reading the array hook — in-session reads
   lag React state badly, so never trust them; the add/remove race over/under-
   shoots and only a reload confirms persistence.

Full mechanics live in the session memory note *partner-editor-react-fields*.

## Note / correction

An earlier pass misreported localized search terms as "blank" — that was a bad
verification selector (`.Polaris-Tag` / "Remove X" chips). The terms were
present all along (the original automation had committed them); this round
read the true state via the array hook and upgraded the values.
