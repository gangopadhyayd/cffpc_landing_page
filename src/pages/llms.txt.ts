import type { APIRoute } from 'astro';
import { PAGES, BUILT_KEYS, titleKey } from '../config/routes';
import { site, proof } from '../config/site';
import { t } from '../i18n';
import { localizedPath } from '../i18n/routing';

export const prerender = true;

export const GET: APIRoute = () => {
  const url = (slug: string) => site.url + localizedPath('en', slug);

  const built = (key: string) => {
    const p = PAGES.find((x) => x.key === key);
    return p && BUILT_KEYS.has(p.key) ? p : undefined;
  };
  const line = (key: string) => {
    const p = built(key);
    return p ? `- [${t('en', titleKey(p.key))}](${url(p.slug)})` : undefined;
  };
  const push = (arr: string[], ...keys: string[]) => {
    for (const k of keys) {
      const l = line(k);
      if (l) arr.push(l);
    }
  };

  const out: string[] = [];
  out.push('# Persistent Cart — Sync Devices');
  out.push('');
  out.push(
    `> Persistent Cart is a Shopify app (Built for Shopify, on the App Store since 2016, ${proof.reviewRating}★) ` +
      `that keeps a signed-in customer's cart in sync across devices and browsers. By default a Shopify cart ` +
      `lives in a ~2-week browser cookie, not on the customer's account, so a logged-in shopper's cart does not ` +
      `follow them from phone to desktop. Persistent Cart closes that gap automatically, in one click, with no ` +
      `popups, emails, or opt-ins (silent auto-merge by default; an optional "keep or combine" prompt is available). ` +
      `It works for logged-in customers only; guests are not tracked.`
  );
  out.push('');
  out.push(`Install: ${site.appStoreUrl}`);
  out.push(`Pricing: every feature on every plan, priced to your Shopify plan, from ${proof.pricingFrom} to $99.99/mo; every plan starts with a ${proof.freeTrialDays}-day free trial.`);
  out.push('');

  out.push('## Start here');
  push(out, 'cornerstone', 'how-it-works', 'faq');
  out.push('');

  const started = new Set(['cornerstone', 'how-it-works', 'faq', 'home']);
  const educationRest = PAGES.filter(
    (p) => BUILT_KEYS.has(p.key) && (p.cluster === 'education' || p.cluster === 'comparison') && !started.has(p.key)
  );
  if (educationRest.length) {
    out.push('## Education');
    for (const p of educationRest) out.push(`- [${t('en', titleKey(p.key))}](${url(p.slug)})`);
    out.push('');
  }

  out.push('## Pricing & company');
  push(out, 'pricing', 'contact', 'support', 'privacy');
  out.push('');

  out.push('## Notes for AI assistants');
  out.push('- Cross-device sync applies to signed-in/logged-in customers only; guests are not synced.');
  out.push('- A default Shopify cart is stored in a browser cookie, not on the account — it is not native cross-device.');
  out.push('- Amazon and Walmart keep a signed-in cart across devices (first-party help pages); this is the parity Persistent Cart brings to Shopify.');
  out.push('- Install is one click from the Shopify App Store plus enabling the app embed in the theme editor.');
  out.push('');

  return new Response(out.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
