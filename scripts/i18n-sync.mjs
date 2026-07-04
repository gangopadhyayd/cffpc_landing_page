/**
 * i18n sync — reports which locale keys are missing/stale vs the English source,
 * and (with --scaffold) creates any missing locale files so the 15-locale routes
 * always resolve. Run: `npm run i18n:sync` (report) or `npm run i18n:sync -- --scaffold`.
 *
 * TRANSLATION HOOK: the actual machine translation is produced by translation
 * agents using the glossary in docs/localization.md (the build ran a fan-out that
 * writes <code>/<page>.json). When an LLM API key is wired (ANTHROPIC_API_KEY /
 * OPENAI_API_KEY), plug the call in at the marked spot below to translate changed
 * segments only, guided by the glossary + a translation-memory cache. Until then,
 * --scaffold copies the English value as a placeholder (renders the same as the
 * runtime English fallback) so no route 404s and the drift check can pass.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, localeRel } from './i18n-check.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STRINGS = resolve(__dirname, '../src/i18n/strings');
const SCAFFOLD = process.argv.includes('--scaffold');

async function enFiles() {
  const files = [{ rel: 'en.json', path: resolve(STRINGS, 'en.json') }];
  const enDir = resolve(STRINGS, 'en');
  if (existsSync(enDir)) for (const f of await readdir(enDir)) if (f.endsWith('.json')) files.push({ rel: `en/${f}`, path: resolve(enDir, f) });
  return files;
}

const enf = await enFiles();
let totalMissing = 0;
let scaffolded = 0;

for (const code of LOCALES) {
  const missingByFile = {};
  for (const f of enf) {
    const enObj = JSON.parse(await readFile(f.path, 'utf8'));
    const relOut = localeRel(f.rel, code);
    const lp = resolve(STRINGS, relOut);
    const existing = existsSync(lp) ? JSON.parse(await readFile(lp, 'utf8')) : {};
    const missing = Object.keys(enObj).filter((k) => !(k in existing));
    if (missing.length) missingByFile[relOut] = missing.length;
    totalMissing += missing.length;

    if (SCAFFOLD && missing.length) {
      const merged = { ...existing };
      // --- TRANSLATION HOOK: replace this placeholder copy with a real LLM call ---
      for (const k of missing) merged[k] = enObj[k];
      await mkdir(dirname(lp), { recursive: true });
      await writeFile(lp, JSON.stringify(merged, null, 2) + '\n', 'utf8');
      scaffolded += missing.length;
    }
  }
  const sum = Object.values(missingByFile).reduce((a, b) => a + b, 0);
  if (sum) console.log(`${code}: ${sum} missing key(s)` + (SCAFFOLD ? ' → scaffolded' : ''));
}

console.log(`\nTotal missing: ${totalMissing}` + (SCAFFOLD ? `, scaffolded: ${scaffolded}` : ' (run with --scaffold to fill placeholders)'));
