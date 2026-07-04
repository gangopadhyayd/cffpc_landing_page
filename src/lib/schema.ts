/**
 * JSON-LD builders — an @id-linked graph for entity comprehension + AI search.
 * NOTE: we deliberately do NOT emit aggregateRating/review on our own product
 * (Google treats self-controlled reviews as self-serving; risks a manual action
 * and won't earn star snippets). The 4.8★ is shown as plain text linking to the
 * App Store listing instead. See docs/research-notes.md §5 / brief §13.
 */
import { site, proof } from '../config/site';

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const APP_ID = `${site.url}/#app`;

export function organizationSchema() {
  const sameAs = [site.appStoreUrl, site.social.x, site.social.linkedin, site.social.youtube].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.developer,
    url: site.url,
    description: `Maker of ${site.fullName}, the cross-device cart sync app for Shopify.`,
    sameAs,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    publisher: { '@id': ORG_ID },
  };
}

export function softwareApplicationSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: site.fullName,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Shopify App',
    operatingSystem: 'Shopify',
    url: site.url,
    downloadUrl: site.appStoreUrl,
    datePublished: '2016-05-02',
    description,
    publisher: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: `Free Starter plan; paid plans from ${proof.pricingFrom} with a ${proof.freeTrialDays}-day free trial.`,
    },
    // No aggregateRating by design (self-serving). 4.8★ shown as text → listing.
  };
}

export function webPageSchema(opts: { url: string; name: string; description: string; locale: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.locale,
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
