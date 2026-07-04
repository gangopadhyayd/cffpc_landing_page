# Asset & Animation Research — non-generic visuals + sourcing proof

Tools used/recommended to build distinctive (non-stock, non-AI-generic) visuals,
the first visuals to build, and how to source retailer proof legally. Source:
research-notes §6 (design system), §8 (parity evidence), site-strategy §7.

> **Design intent (locked).** Light, warm, **editorial** — paper + ink + ONE
> surgical accent (burnt-marigold `#D8541E`). Anti dark-AI-SaaS. The product is
> the hero: real "Your cart" UI, with motion that *explains* the sync.

---

## 1. Tools & techniques

### Cross-device sync animation
- **Inline SVG + CSS / Web Animations API (WAAPI)** for the cross-device sync
  animation. **Avoid SMIL** (`<animate>`) — poor support/maintainability; drive
  motion with CSS `offset-path`/`stroke-dashoffset` + WAAPI instead.
- Carts rendered as **real HTML/CSS DOM** "Your cart" line-item lists (phone
  left, laptop right); a **"data packet" dot travels an inline-SVG `<path>`**
  between them, then the laptop cart matches and the subtotal counts up with a
  `Synced ✓` tick.
- Driven by `IntersectionObserver` (animate on view).
- **`prefers-reduced-motion` → render the end state** (both carts synced, static
  ✓) — never force motion.

### Richer animation options (only if warranted)
- **Lottie** or **Rive** as richer alternatives for complex sequences.
  **Verify licenses** before adopting (both the runtime and any template/asset
  used). Default remains hand-rolled SVG+WAAPI for license-cleanliness and tiny
  JS; reach for Lottie/Rive only where it clearly beats hand-rolling.

### Icons & fonts
- **Icons: Lucide (MIT)** — license-clean, consistent line style.
- **Fonts: self-hosted via Fontsource** (all OFL/MIT): Display **Fraunces**
  (variable editorial serif), Text/UI **Hanken Grotesk** (warm humanist
  grotesque, not Inter), Mono **IBM Plex Mono** (cart SKUs / prices / totals).
  Self-host (no third-party font CDN).

### Build context
- Static-first islands; Tailwind v4 `@theme` tokens; interactive bits as
  **minimal vanilla-TS islands** (no React/shadcn — perf/license/simplicity).
- No glows/blobs/gradients; hairline borders + two-tier low-opacity shadows.

---

## 2. First visuals to build / polish (priority order)

1. **Hero cross-device sync animation** — the phone→laptop "same cart" loop with
   the **data-packet motion-path** dot, subtotal count-up, and `Synced ✓` tick.
   The signature, load-bearing visual.
2. **Parity diagram** — our **own** diagram illustrating "big retailers keep the
   cart on every device; default Shopify doesn't." Pairs with the cited
   Walmart/Amazon quotes (NOT their UI — see §3).
3. **Silent auto-merge demo** — show the default behavior: log in → carts merge
   **silently/additively**, no popup, no email (research-notes §1). Differentiates
   vs popup/loader-heavy rivals.
4. **Before/after cart-lost-vs-kept** — one clean WITH-vs-WITHOUT frame
   (green/red framing works — research-notes §4); switch device → cart lost
   (without) vs cart kept (with). Keep it to a single frame.
5. **Calculator result visualization** — a clear, honest viz of the Lost-Cart
   Calculator output (transparent formula, illustrative range; no invented
   uplift %).
6. **New App Store icon + screenshot concepts** — the cleaner single-subject
   icon and win-led/mobile screenshot concepts requested in
   `docs/app-store-optimization.md`, in the new brand system.

---

## 3. How to source retailer proof (IP/ToS)

**Policy: owner-supplied-or-skip.** If we want any real retailer footage/screens,
the **owner must supply assets they have the right to use** — otherwise **skip
it**. Do not scrape, screenshot, or record third-party retailer UI.

> **IP / ToS rule (hard constraint):** we must **NOT embed third-party retailer
> UI screenshots or footage** (Amazon, Walmart, eBay, Target, etc.) — license/
> ToS risk (research-notes §6/§8).

What IS allowed and load-bearing:
- **The original cited parity cards** — first-party **text quotes** with full
  source + accessed-date (research-notes §8): Walmart *"access your cart across
  multiple devices"* and Amazon *"available from any compatible web browser or
  Amazon Mobile app… signed in to your account."* The **claim and the quote**
  may be used; the retailer's **visual UI may not**.
- **Our own diagram** (the parity diagram, §2.2) — the substitute for their UI.

So the **load-bearing visuals are: the original cited cards + our own diagram.**
Treat any actual retailer screenshot/video as owner-supplied-or-skip, never
self-sourced.
