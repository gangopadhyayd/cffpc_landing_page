/// <reference path="../.astro/types.d.ts" />

// Fontsource packages ship CSS with no TS types — declare them so `astro check`
// doesn't flag the side-effect imports in Base.astro. The build handles them fine.
declare module '@fontsource/*';
declare module '@fontsource-variable/*';

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_GA4_MEASUREMENT_ID?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly PUBLIC_BING_SITE_VERIFICATION?: string;
  readonly PUBLIC_FIRSTPROMOTER_CID?: string;
  readonly PUBLIC_STAGING?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
