/**
 * Locale-aware URL helpers. Default locale (en) is served at root (no /en prefix);
 * every other locale lives under /<path>/. These feed the router, language
 * switcher, hreflang alternates, and canonical generation.
 */
import { LOCALES, DEFAULT_LOCALE, getLocale } from '../config/locales';
import { site } from '../config/site';

/** Clean a slug: no leading/trailing slashes. '' = home. */
export function cleanSlug(slug = ''): string {
  return slug.replace(/^\/+|\/+$/g, '');
}

/** Path (leading slash, no trailing) for a locale + page slug. '' = home. */
export function localizedPath(localeCode: string, slug = ''): string {
  const l = getLocale(localeCode) ?? getLocale(DEFAULT_LOCALE)!;
  const clean = cleanSlug(slug);
  const prefix = l.code === DEFAULT_LOCALE ? '' : '/' + l.path;
  const path = prefix + (clean ? '/' + clean : '');
  return path === '' ? '/' : path;
}

/** Absolute URL for a locale + page slug. */
export function localizedUrl(localeCode: string, slug = ''): string {
  return site.url + localizedPath(localeCode, slug);
}

/** hreflang alternates for a page slug across all locales (+ x-default = en). */
export function alternates(slug = ''): { hreflang: string; href: string }[] {
  const list = LOCALES.map((l) => ({ hreflang: l.code, href: localizedUrl(l.code, slug) }));
  list.push({ hreflang: 'x-default', href: localizedUrl(DEFAULT_LOCALE, slug) });
  return list;
}

/** Self-referencing canonical for a locale + page slug. */
export function canonical(localeCode: string, slug = ''): string {
  return localizedUrl(localeCode, slug);
}

/** Switcher targets: every locale's URL for the current page slug. */
export function languageLinks(slug = '') {
  return LOCALES.map((l) => ({
    code: l.code,
    label: l.label,
    englishLabel: l.englishLabel,
    href: localizedPath(l.code, slug),
    dir: l.dir,
  }));
}
