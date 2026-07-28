import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/pages/[locale]');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.astro')) patch(p);
  }
}

function patch(file) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('buildLocalePaths')) return;

  const hasRedirectOnly =
    s.includes('return Astro.redirect') && !s.includes('<HubLayout') && !s.includes('<MarketingLayout');

  if (!s.includes("const locale = 'en' as Locale") && !s.includes("const locale = 'pt' as Locale")) {
    console.warn('skip', file);
    return;
  }

  const importBlock = `import { buildLocalePaths, resolvePageLocale } from '@/i18n/astro';
export function getStaticPaths() {
  return buildLocalePaths();
}
`;

  s = s.replace(
    /import type \{ Locale \} from '@\/i18n\/config';\n\nconst locale = '(en|pt)' as Locale;\n/,
    `import type { Locale } from '@/i18n/config';\n\n${importBlock}const locale = resolvePageLocale(Astro.params.locale);\nif (!locale) return Astro.redirect('/en/');\n`,
  );

  if (!s.includes('resolvePageLocale')) {
    console.warn('failed', file);
    return;
  }

  fs.writeFileSync(file, s);
  console.log('patched', path.relative(root, file), hasRedirectOnly ? '(redirect)' : '');
}

walk(root);
