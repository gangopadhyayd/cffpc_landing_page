/**
 * CENTRAL SITE CONFIG — edit facts here, not in components.
 *
 * VERIFIED facts are confirmed (re-verify time-sensitive ones vs the live listing
 * before publish). Fields marked `REQUEST FROM OWNER` use a safe qualitative
 * placeholder until the owner supplies a value (see docs/owner-inputs-needed.md).
 * Never invent specific numbers — where a proof value is null, render the
 * qualitative fallback string.
 */

export const site = {
  // --- Identity (fixed real-world destinations) ---
  domain: 'persistentcartapp.com',
  url: 'https://persistentcartapp.com',
  appStoreUrl: 'https://apps.shopify.com/cart-persistify', // FIXED — install destination
  demoStoreUrl: 'https://cff-demo-store.myshopify.com',

  name: 'Persistent Cart',
  fullName: 'Persistent Cart — Sync Devices',
  developer: 'Customer First focus',
  developerLocation: 'San Francisco, CA',

  // --- Social / entity signals (sameAs) — REQUEST: confirm/extend ---
  social: {
    // REQUEST FROM OWNER: real profile URLs strengthen `sameAs` entity signal.
    x: '', // e.g. https://x.com/persistentcart
    linkedin: '',
    youtube: '',
  },

  // --- Contact / support (REQUEST: confirm addresses) ---
  contactEmail: 'support@persistentcartapp.com', // REQUEST FROM OWNER: confirm
  supportEmail: 'support@persistentcartapp.com', // REQUEST FROM OWNER: confirm
  founderName: 'Dave', // VERIFIED voice (engagement repo); REQUEST: confirm public use

  // --- OG / social card defaults ---
  ogImage: '/og/default.png', // PlaceholderVisual generates this; swap with final
  twitterHandle: '', // REQUEST FROM OWNER

  // --- Privacy policy ---
  // Current heroku URL looks unpolished; default to hosting a clean copy on-domain.
  privacyUrl: '/privacy', // REQUEST FROM OWNER: keep heroku copy or use on-domain text
} as const;

/**
 * PROOF object — separates VERIFIED facts from owner placeholders.
 * Re-verify reviewRating + pricing vs the live listing before publish.
 * Real internal proof numbers exist (see docs/research-notes.md §2) but are the
 * owner's internal data → keep null here and render qualitative text; the real
 * figures are surfaced in docs/owner-inputs-needed.md for sign-off.
 */
export const proof = {
  reviewRating: 4.9, // VERIFIED 2026-07-06 (live listing)
  reviewCount: 47, // VERIFIED 2026-07-06; text + listing link only, never headline, no self-review schema
  launchedYear: 2016, // VERIFIED (May 2, 2016)
  yearsActive: 2026 - 2016, // derived (~10 yrs)
  builtForShopify: true, // VERIFIED (badge renders on listing)

  hasFreePlan: true, // VERIFIED 2026-06-30 — NEW "Free Starter" (≤10 cart syncs)
  freeTrialDays: 30, // VERIFIED (paid plans)
  pricingFrom: '$4.99/mo', // VERIFIED — presentation open (priced to Shopify plan)

  // Owner placeholders — render qualitative fallback when null.
  storesServed: null as number | null, // owner-approved wording: "thousands of Shopify stores" (qualitative)
  plusStoresServed: null as number | null, // owner-approved wording: "hundreds of Shopify Plus stores" (qualitative)
  // OWNER-APPROVED 2026-07-06: "$60M USD in order value from synced carts in the last 90 days."
  syncedCartRevenue: '$60M+' as string | null,
  cartsTransferred: null as string | null, // REQUEST — real: ~8–12k syncs/day (internal)
  namedMerchantLogos: [] as string[], // REQUEST — permission needed
} as const;

/** Safe qualitative fallbacks used wherever a proof number is null. */
export const proofFallback = {
  storesServed: 'thousands of Shopify stores',
  plusStoresServed: 'hundreds of Shopify Plus stores',
  syncedCartRevenue: 'millions of dollars in cross-device carts',
  cartsTransferred: 'thousands of carts a day',
} as const;

/**
 * Pricing tiers — framed "priced to your Shopify plan, every feature included"
 * (code truth: all tiers are "Unlimited", auto-selected by the merchant's plan).
 * Re-verify vs the live listing before publish; Advanced $24.99 is in code but
 * not currently surfaced on the live listing (flagged for owner).
 */
export const pricingTiers = [
  // No tier is "highlighted": the plan is auto-selected by the merchant's own
  // Shopify subscription, so visually recommending one would contradict that.
  { id: 'free', shopifyPlan: 'Try it', price: 'Free', cadence: '', note: 'Free Starter — test all features, up to 10 cart syncs', highlight: false },
  { id: 'basic', shopifyPlan: 'Shopify Basic', price: '$4.99', cadence: '/mo', note: '', highlight: false },
  { id: 'grow', shopifyPlan: 'Shopify Grow', price: '$8.99', cadence: '/mo', note: 'Formerly the "Shopify" plan', highlight: false },
  // The Advanced ($24.99) tier exists in code but is NOT surfaced on the live App
  // Store listing — hidden here to match the listing until the owner confirms.
  // To show it (website-leads-listing), uncomment + add it to the listing. See
  // docs/owner-inputs-needed.md §5.
  // { id: 'advanced', shopifyPlan: 'Shopify Advanced', price: '$24.99', cadence: '/mo', note: '', highlight: false },
  { id: 'plus', shopifyPlan: 'Shopify Plus', price: '$99.99', cadence: '/mo', note: '', highlight: false },
] as const;

/**
 * Partner / affiliate program terms — PROVISIONAL defaults (defensible 2026 SaaS
 * norms); marked provisional on-page, pending owner confirmation.
 */
export const partnerProgram = {
  commissionPct: 30, // PROVISIONAL — 2026 SaaS norm 20–30%
  recurringMonths: 12, // PROVISIONAL — "12-month recurring" (more generous than one-time, cheaper than lifetime)
  cookieWindowDays: 90, // PROVISIONAL — most common SaaS attribution window
  platform: 'FirstPromoter', // selected (server-side Tracking API fits Shopify Billing API)
  provisional: true,
} as const;

/**
 * App Store link with UTM attribution for UI clicks. `content` identifies the
 * on-site placement (mirrors the data-source analytics attribute). Schema.org
 * and llms.txt keep the CLEAN base URL (site.appStoreUrl) — canonical only.
 */
export function appStoreLink(content: string): string {
  const u = new URL(site.appStoreUrl);
  u.searchParams.set('utm_source', 'persistentcartapp.com');
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', 'site');
  u.searchParams.set('utm_content', content);
  return u.toString();
}

/** Build-stable "last updated" stamp shown on content pages (edit on refresh). */
export const SITE_UPDATED = '2026-07-06';

export type PricingTier = (typeof pricingTiers)[number];
