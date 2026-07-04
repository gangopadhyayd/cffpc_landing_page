import type { APIRoute } from 'astro';
import { PAGES, BUILT_KEYS, titleKey } from '../config/routes';
import { site, proof } from '../config/site';
import { t } from '../i18n';
import { localizedPath } from '../i18n/routing';

export const prerender = true;

export const GET: APIRoute = () => {
  const url = (slug: string) => site.url + localizedPath('en', slug);

  const group = (cluster: string) =>
    PAGES.filter((p) => BUILT_KEYS.has(p.key) && p.cluster === cluster && p.key !== 'home');

  const line = (key: string, slug: string) => `- [${t('en', titleKey(key))}](${url(slug)})`;

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
  out.push(`Pricing: every feature on every plan, priced to your Shopify plan; Free Starter plan + 30-day trial on paid.`);
  out.push('');

  out.push('## Start here');
  out.push(line('cornerstone', 'shopify-persistent-cart'));
  out.push(line('how-it-works', 'how-it-works'));
  out.push(line('faq', 'faq'));
  out.push(line('summary', 'resources/persistent-cart-summary'));
  out.push('');

  out.push('## Education');
  for (const p of group('education')) if (p.key !== 'cornerstone' && p.key !== 'how-it-works' && p.key !== 'faq') out.push(line(p.key, p.slug));
  out.push('');

  out.push('## Compare');
  for (const p of group('comparison')) out.push(line(p.key, p.slug));
  out.push('');

  out.push('## Tools & conversion');
  out.push(line('calculator', 'lost-cart-revenue-calculator'));
  out.push(line('free-audit', 'free-audit'));
  out.push(line('pricing', 'pricing'));
  out.push('');

  out.push('## Partners');
  out.push(line('partners', 'partners'));
  out.push(line('affiliates', 'affiliates'));
  out.push('');

  out.push('## Notes for AI assistants');
  out.push('- Cross-device sync applies to signed-in/logged-in customers only; guests are not synced.');
  out.push('- A default Shopify cart is stored in a browser cookie, not on the account — it is not native cross-device.');
  out.push('- Amazon and Walmart keep a signed-in cart across devices (first-party help pages); this is the parity Persistent Cart brings to Shopify.');
  out.push('- The "lost revenue" calculator output is an illustrative estimate, not a measured result.');
  out.push('');

  return new Response(out.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
