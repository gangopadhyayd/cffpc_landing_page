/**
 * IndexNow ping — tells Bing/Seznam/Yandex (and anyone on the protocol) which
 * URLs changed, straight after a deploy. No Webmaster Tools account needed:
 * the key file served at /<key>.txt proves domain ownership per request.
 * Runs automatically at the end of `npm run deploy`; safe to re-run anytime.
 */
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = 'd6c77449536f5b2313ac1378e65d1423';
const HOST = 'persistentcartapp.com';
const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const xml = await readFile(resolve(DIST, 'sitemap-0.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) { console.error('indexnow: no URLs found in sitemap'); process.exit(1); }

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`indexnow: submitted ${urls.length} URLs — HTTP ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
