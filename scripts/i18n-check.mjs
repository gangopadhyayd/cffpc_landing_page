/**
 * i18n drift guard (CI). Fails (exit 1) if any English source key is missing from
 * any locale catalog — enforcing the standing rule that every page exists in all 15
 * locales. Run: `npm run i18n:check`.
 *
 * Source of truth = src/i18n/strings/en.json + src/i18n/strings/en/*.json.
 * Locale files mirror those as <code>.json + <code>/<page>.json.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STRINGS = resolve(__dirname, '../src/i18n/strings');

// Keep in sync with src/config/locales.ts (non-default locale codes).
export const LOCALES = ['de', 'fr', 'es', 'it', 'pt-BR', 'nl', 'ja', 'zh-CN', 'ko', 'sv', 'da', 'pl', 'nb', 'fi'];

export async function enFiles() {
  const files = [{ rel: 'en.json', path: resolve(STRINGS, 'en.json') }];
  const enDir = resolve(STRINGS, 'en');
  if (existsSync(enDir)) {
    for (const f of await readdir(enDir)) if (f.endsWith('.json')) files.push({ rel: `en/${f}`, path: resolve(enDir, f) });
  }
  return files;
}

export function localeRel(rel, code) {
  return rel === 'en.json' ? `${code}.json` : rel.replace(/^en\//, `${code}/`);
}

export async function runCheck() {
  const enf = await enFiles();
  let missingTotal = 0;
  const problems = [];

  for (const code of LOCALES) {
    let missingFiles = 0;
    let missingKeys = 0;
    for (const f of enf) {
      const enObj = JSON.parse(await readFile(f.path, 'utf8'));
      const lp = resolve(STRINGS, localeRel(f.rel, code));
      if (!existsSync(lp)) {
        missingFiles++;
        missingKeys += Object.keys(enObj).length;
        continue;
      }
      const locObj = JSON.parse(await readFile(lp, 'utf8'));
      for (const k of Object.keys(enObj)) if (!(k in locObj)) missingKeys++;
    }
    if (missingFiles || missingKeys) problems.push(`  ✗ ${code}: ${missingFiles} missing file(s), ${missingKeys} missing key(s)`);
    missingTotal += missingKeys;
  }

  console.log(`i18n drift check — ${LOCALES.length} locales × ${enf.length} source files`);
  if (problems.length) {
    problems.forEach((p) => console.log(p));
    console.error(`\nDRIFT: ${missingTotal} untranslated key(s). Run "npm run i18n:sync" (or --scaffold) to fill them.`);
    return false;
  }
  console.log('  ✓ every locale covers every English key');
  return true;
}

// Run only when invoked directly (not when imported by i18n-sync.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ok = await runCheck();
  if (!ok) process.exit(1);
}
