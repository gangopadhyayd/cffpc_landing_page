/**
 * PAGE REGISTRY — single source for every page. The catch-all router
 * (src/pages/[...slug].astro) emits each page × all 15 locales from this list;
 * nav, footer, and sitemap are also derived here. `key` maps to a component in
 * the router's COMPONENTS map. Title/description come from the i18n catalog
 * (keys `page.<key>.title` / `page.<key>.desc`).
 */

export type FooterGroup = 'product' | 'learn' | 'programs' | 'company';

export interface PageDef {
  key: string;
  /** URL slug; '' = home. May contain '/' for nested pages. */
  slug: string;
  /** Show in primary header nav (+ optional dropdown group + order). */
  nav?: { label: string; group?: 'product' | 'why' | 'learn'; order: number };
  /** Show in footer under this group. */
  footer?: { group: FooterGroup; order: number };
  /** Cornerstone cluster membership (for internal linking). */
  cluster?: 'core' | 'education' | 'comparison' | 'usecase' | 'program' | 'legal';
  /** Slug of the parent for breadcrumbs (omit for top-level). */
  parent?: string;
  /** JSON-LD type hint. */
  schema?: 'WebPage' | 'FAQPage' | 'SoftwareApplication';
}

export const PAGES: PageDef[] = [
  // --- Core / conversion ---
  { key: 'home', slug: '', cluster: 'core', schema: 'SoftwareApplication' },
  { key: 'how-it-works', slug: 'how-it-works', cluster: 'education', nav: { label: 'nav.product', order: 1 } },
  { key: 'cross-device', slug: 'shopify-cross-device-cart-sync', cluster: 'education', nav: { label: 'nav.whyItMatters', order: 2 } },
  { key: 'pricing', slug: 'pricing', cluster: 'core', nav: { label: 'nav.pricing', order: 4 }, footer: { group: 'product', order: 2 } },
  { key: 'calculator', slug: 'lost-cart-revenue-calculator', cluster: 'core', nav: { label: 'nav.calculator', order: 3 }, footer: { group: 'product', order: 3 } },
  { key: 'free-audit', slug: 'free-audit', cluster: 'core', footer: { group: 'product', order: 4 } },
  { key: 'partners', slug: 'partners', cluster: 'program', nav: { label: 'nav.partners', order: 5 }, footer: { group: 'programs', order: 1 } },
  { key: 'affiliates', slug: 'affiliates', cluster: 'program', footer: { group: 'programs', order: 2 } },

  // --- Education + SEO/GEO (cornerstone + cluster) ---
  { key: 'cornerstone', slug: 'shopify-persistent-cart', cluster: 'education', footer: { group: 'learn', order: 1 } },
  { key: 'cart-disappears', slug: 'shopify-cart-disappears-after-login', cluster: 'education', parent: 'shopify-persistent-cart', footer: { group: 'learn', order: 3 } },
  { key: 'big-retailers', slug: 'how-big-retailers-persist-carts', cluster: 'education', parent: 'shopify-persistent-cart', footer: { group: 'learn', order: 4 } },
  { key: 'vs-recovery', slug: 'persistent-cart-vs-abandoned-cart-recovery', cluster: 'comparison', footer: { group: 'learn', order: 5 } },
  { key: 'b2b', slug: 'shopify-b2b-cart-persistence', cluster: 'education', parent: 'shopify-persistent-cart' },
  { key: 'plus', slug: 'shopify-plus', cluster: 'education', parent: 'shopify-persistent-cart' },

  // --- Use cases ---
  { key: 'uc-high-aov', slug: 'use-cases/high-aov-stores', cluster: 'usecase', parent: 'shopify-persistent-cart' },
  { key: 'uc-repeat', slug: 'use-cases/repeat-customers', cluster: 'usecase', parent: 'shopify-persistent-cart' },
  { key: 'uc-wholesale', slug: 'use-cases/wholesale-b2b', cluster: 'usecase', parent: 'shopify-persistent-cart' },

  // --- Comparisons ---
  { key: 'compare-email', slug: 'compare/abandoned-cart-email', cluster: 'comparison', parent: 'persistent-cart-vs-abandoned-cart-recovery' },

  // --- Answer hubs / resources ---
  { key: 'faq', slug: 'faq', cluster: 'education', schema: 'FAQPage', nav: { label: 'nav.resources', order: 6 }, footer: { group: 'learn', order: 2 } },
  { key: 'resources', slug: 'resources', cluster: 'core', footer: { group: 'learn', order: 6 } },
  { key: 'summary', slug: 'resources/persistent-cart-summary', cluster: 'core', parent: 'resources' },
  { key: 'changelog', slug: 'changelog', cluster: 'core', footer: { group: 'company', order: 3 } },

  // --- Company / legal ---
  { key: 'contact', slug: 'contact', cluster: 'core', footer: { group: 'company', order: 1 } },
  { key: 'support', slug: 'support', cluster: 'core', footer: { group: 'company', order: 2 } },
  { key: 'privacy', slug: 'privacy', cluster: 'legal', footer: { group: 'company', order: 4 } },
];

/**
 * Keys that have a page component wired in the router's COMPONENTS map.
 * getStaticPaths reads THIS (plain data — safe in Astro's prerender chunk) to
 * decide which routes to emit; keep it in sync with COMPONENTS as pages are built.
 */
export const BUILT_KEYS = new Set<string>([
  'home',
  'how-it-works',
  'cross-device',
  'pricing',
  'calculator',
  'free-audit',
  'partners',
  'affiliates',
  'cornerstone',
  'cart-disappears',
  'big-retailers',
  'vs-recovery',
  'b2b',
  'plus',
  'uc-high-aov',
  'uc-repeat',
  'uc-wholesale',
  'compare-email',
  'faq',
  'resources',
  'summary',
  'changelog',
  'contact',
  'support',
  'privacy',
]);

export const PAGE_BY_KEY: Record<string, PageDef> = Object.fromEntries(PAGES.map((p) => [p.key, p]));
export const PAGE_BY_SLUG: Record<string, PageDef> = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

export function getPage(key: string): PageDef | undefined {
  return PAGE_BY_KEY[key];
}

/** Ordered ancestor chain (root → … → page), following `parent` slugs. */
export function breadcrumbChain(key: string): PageDef[] {
  const chain: PageDef[] = [];
  const guard = new Set<string>();
  let cur: PageDef | undefined = PAGE_BY_KEY[key];
  while (cur && !guard.has(cur.key)) {
    guard.add(cur.key);
    chain.unshift(cur);
    cur = cur.parent ? PAGE_BY_SLUG[cur.parent] : undefined;
  }
  return chain;
}

/** Title / description i18n keys for a page. */
export function titleKey(key: string): string {
  return `page.${key}.title`;
}
export function descKey(key: string): string {
  return `page.${key}.desc`;
}
