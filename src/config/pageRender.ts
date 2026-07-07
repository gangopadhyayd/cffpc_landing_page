/**
 * Render config for pages handled by the generic ContentPage template.
 * Pages with a dedicated component (home, how-it-works, pricing, free-audit,
 * partners, affiliates, calculator, faq, big-retailers, vs-recovery,
 * compare-email) are dispatched in the router's CUSTOM map and are NOT listed
 * here — how-it-works carries its ContentPage config inside HowItWorksPage.
 *
 * `sectionCount` = number of `page.<key>.s{n}.h/.b` blocks the content provides.
 * Keep in sync with the en/<key>.json content file.
 */
export interface ContentRender {
  sectionCount: number;
  faqCount?: number;
  related?: string[];
}

export const CONTENT_CONFIG: Record<string, ContentRender> = {
  // NOTE (v1 scope): `related` lists reference only pages in the v1 build.
  // When re-enabling deferred pages (routes.ts V1_DEFERRED), restore the richer
  // cross-links: cornerstone ↔ cross-device/big-retailers, etc.
  cornerstone: { sectionCount: 5, faqCount: 4, related: ['how-it-works', 'cart-disappears', 'faq'] },
  'cross-device': { sectionCount: 5, faqCount: 3, related: ['cornerstone', 'cart-disappears'] },
  'cart-disappears': { sectionCount: 4, faqCount: 4, related: ['cornerstone', 'how-it-works', 'faq'] },
  b2b: { sectionCount: 5, faqCount: 3, related: ['plus', 'uc-wholesale', 'cornerstone'] },
  plus: { sectionCount: 5, faqCount: 3, related: ['b2b', 'uc-high-aov', 'cornerstone'] },
  'uc-high-aov': { sectionCount: 4, faqCount: 2, related: ['uc-repeat', 'uc-wholesale', 'cornerstone'] },
  'uc-repeat': { sectionCount: 4, faqCount: 2, related: ['uc-high-aov', 'uc-wholesale', 'cornerstone'] },
  'uc-wholesale': { sectionCount: 4, faqCount: 2, related: ['b2b', 'plus', 'uc-high-aov'] },
  resources: { sectionCount: 3, related: ['cornerstone', 'how-it-works', 'faq'] },
  summary: { sectionCount: 6, related: ['cornerstone', 'how-it-works'] },
  changelog: { sectionCount: 4, related: ['cornerstone', 'how-it-works'] },
  contact: { sectionCount: 2, related: ['support', 'faq'] },
  support: { sectionCount: 3, faqCount: 3, related: ['faq', 'how-it-works'] },
  privacy: { sectionCount: 7, related: ['privacy-policy', 'support', 'contact'] },
};
