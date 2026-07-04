/**
 * Render config for pages handled by the generic ContentPage template.
 * Pages with a dedicated component (home, pricing, free-audit, partners,
 * affiliates, calculator, faq, big-retailers, vs-recovery, compare-email) are
 * dispatched in the router's CUSTOM map and are NOT listed here.
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
  cornerstone: { sectionCount: 5, faqCount: 4, related: ['how-it-works', 'cross-device', 'big-retailers', 'cart-disappears'] },
  'how-it-works': { sectionCount: 5, faqCount: 3, related: ['cornerstone', 'cross-device', 'cart-disappears'] },
  'cross-device': { sectionCount: 5, faqCount: 3, related: ['cornerstone', 'cart-disappears', 'big-retailers'] },
  'cart-disappears': { sectionCount: 4, faqCount: 4, related: ['cornerstone', 'how-it-works', 'cross-device'] },
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
  privacy: { sectionCount: 7, related: ['support', 'contact'] },
};
