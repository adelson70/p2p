/**
 * Builds fr.json and zh.json from en.json using MyMemory cache.
 * Run: node scripts/translate-mymemory.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import en from '../src/i18n/en.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18nDir = path.join(__dirname, '../src/i18n');
const cachePath = path.join(__dirname, 'translations/mymemory-cache.json');

const cache = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  : {};

function fromCache(text, target) {
  const raw = cache[`${target}::${text}`] ?? text;
  return raw.replace(/&#10;/g, '\n').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

async function translate(text, target) {
  if (!text.trim()) return text;
  const key = `${target}::${text}`;
  if (cache[key]) return cache[key];

  const pair = target === 'zh' ? 'en|zh-CN' : `en|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const out = data.responseData?.translatedText ?? text;
  cache[key] = out;
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  await new Promise((r) => setTimeout(r, 350));
  return out;
}

async function walkAsync(obj, target) {
  if (typeof obj === 'string') {
    return translate(obj, target);
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = await walkAsync(v, target);
  }
  return out;
}

function walkSync(obj, target) {
  if (typeof obj === 'string') return fromCache(obj, target);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = walkSync(v, target);
  }
  return out;
}

const rebuildOnly = process.argv.includes('--cache-only');
const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const list = targets.length ? targets : ['fr', 'zh'];

for (const target of list) {
  console.log(rebuildOnly ? 'Rebuilding from cache' : 'Translating to', target);
  const built = rebuildOnly ? walkSync(en, target) : await walkAsync(en, target);
  fs.writeFileSync(path.join(i18nDir, `${target}.json`), `${JSON.stringify(built, null, 2)}\n`);
  console.log('Wrote', target);
}
