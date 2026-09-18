import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
  ASTRO_I18N_LOCALES,
  SITEMAP_LOCALE_MAP,
  DEFAULT_LOCALE,
  LOCALES,
  isIndexable,
} from './src/config/locales';

const SITE_URL = 'https://persistentcartapp.com';
// Locale path segments that are noindex (machine-translated, not yet reviewed) —
// kept out of the sitemap until native review flips them indexable.
const NOINDEX_LOCALE_SEGMENTS = LOCALES.filter((l) => !isIndexable(l.code)).map((l) => l.path);
// Non-locale routes that are noindex by design (tracked outbound redirects like
// /go/appstore). A noindex URL inside the sitemap is exactly what Search Console
// flags as "Excluded by 'noindex' tag" for pages in a sitemap (seen 2026-07-28,
// re-introduced by /go/appstore on 2026-08-10) — keep them out.
const NOINDEX_SEGMENTS = [...NOINDEX_LOCALE_SEGMENTS, 'go'];

// https://astro.build
export default defineConfig({
  site: 'https://persistentcartapp.com',
  trailingSlash: 'never',
  build: { format: 'file' }, // clean extensionless URLs (/pricing, /de/pricing)
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    // Runtime shape is correct (string | {path, codes:[code]}); defineConfig infers
    // this field's element type as `never`, so we widen with `any`. Verified across
    // 376 builds; see src/config/locales.ts for the real, typed source.
    locales: ASTRO_I18N_LOCALES as any,
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: DEFAULT_LOCALE, locales: SITEMAP_LOCALE_MAP },
      // Keep noindex routes out of the sitemap: unreviewed machine-translated
      // locales (until native review flips them indexable in
      // src/config/locales.ts) and noindex-by-design routes like /go/*.
      filter: (page) => {
        const path = page.replace(SITE_URL, '').replace(/^\//, '');
        const seg = path.split('/')[0];
        return !NOINDEX_SEGMENTS.includes(seg);
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
