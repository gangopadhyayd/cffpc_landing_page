/**
 * SINGLE SOURCE OF TRUTH for localization.
 *
 * The site ships in the top 15 Shopify languages. English is canonical and
 * launch-quality. Every other locale is generated (author-once-in-English +
 * auto-translate) and `hreflang`-wired, but renders `noindex` until it passes
 * native review (`reviewed: true`). This file drives astro.config.ts (i18n +
 * sitemap), <SEOHead> (hreflang/x-default/canonical), the language switcher,
 * and the `i18n:sync` drift check — so adding/maintaining a locale never means
 * editing pages by hand.
 *
 * See docs/localization.md for the standing 15-locale rule + pipeline.
 */

export interface LocaleDef {
  /** BCP-47 code used for <html lang> and hreflang. */
  code: string;
  /** URL path segment (lowercase, clean). Default locale is served at root. */
  path: string;
  /** Native autonym shown in the language switcher. */
  label: string;
  /** English name (for docs/admin). */
  englishLabel: string;
  /** Text direction. */
  dir: 'ltr' | 'rtl';
  /** True once a native reviewer has signed off → page becomes indexable. */
  reviewed: boolean;
}

/** Ordered by rollout priority. All 15 are required; en is canonical. */
export const LOCALES: LocaleDef[] = [
  { code: 'en',    path: 'en',    label: 'English',    englishLabel: 'English',              dir: 'ltr', reviewed: true  },
  { code: 'de',    path: 'de',    label: 'Deutsch',    englishLabel: 'German',               dir: 'ltr', reviewed: false },
  { code: 'fr',    path: 'fr',    label: 'Français',   englishLabel: 'French',               dir: 'ltr', reviewed: false },
  { code: 'es',    path: 'es',    label: 'Español',    englishLabel: 'Spanish',              dir: 'ltr', reviewed: false },
  { code: 'it',    path: 'it',    label: 'Italiano',   englishLabel: 'Italian',              dir: 'ltr', reviewed: false },
  { code: 'pt-BR', path: 'pt-br', label: 'Português',  englishLabel: 'Portuguese (Brazil)',  dir: 'ltr', reviewed: false },
  { code: 'nl',    path: 'nl',    label: 'Nederlands', englishLabel: 'Dutch',                dir: 'ltr', reviewed: false },
  { code: 'ja',    path: 'ja',    label: '日本語',      englishLabel: 'Japanese',             dir: 'ltr', reviewed: false },
  { code: 'zh-CN', path: 'zh-cn', label: '简体中文',     englishLabel: 'Chinese (Simplified)', dir: 'ltr', reviewed: false },
  { code: 'ko',    path: 'ko',    label: '한국어',       englishLabel: 'Korean',               dir: 'ltr', reviewed: false },
  { code: 'sv',    path: 'sv',    label: 'Svenska',    englishLabel: 'Swedish',              dir: 'ltr', reviewed: false },
  { code: 'da',    path: 'da',    label: 'Dansk',      englishLabel: 'Danish',               dir: 'ltr', reviewed: false },
  { code: 'pl',    path: 'pl',    label: 'Polski',     englishLabel: 'Polish',               dir: 'ltr', reviewed: false },
  { code: 'nb',    path: 'nb',    label: 'Norsk',      englishLabel: 'Norwegian (Bokmål)',   dir: 'ltr', reviewed: false },
  { code: 'fi',    path: 'fi',    label: 'Suomi',      englishLabel: 'Finnish',              dir: 'ltr', reviewed: false },
];

export const DEFAULT_LOCALE = 'en';
export const DEFAULT_LOCALE_PATH = 'en';

export const LOCALE_CODES = LOCALES.map((l) => l.code);
export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE);

export function getLocale(code: string): LocaleDef | undefined {
  return LOCALES.find((l) => l.code === code);
}

/** Astro i18n `locales` entries: string when path === code, object otherwise. */
export const ASTRO_I18N_LOCALES = LOCALES.map((l) =>
  l.path === l.code ? l.code : { path: l.path, codes: [l.code] as [string] }
);

/** Sitemap integration i18n map: path segment → hreflang code. */
export const SITEMAP_LOCALE_MAP: Record<string, string> = Object.fromEntries(
  LOCALES.map((l) => [l.path, l.code])
);

/** A locale is indexable once reviewed (English always is). */
export function isIndexable(code: string): boolean {
  const l = getLocale(code);
  return !!l && (l.code === DEFAULT_LOCALE || l.reviewed);
}
