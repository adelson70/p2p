import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from './blog-data/articles.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/content/blog');
const locales = ['en', 'pt', 'es', 'fr', 'zh'];

let written = 0;
for (const article of articles) {
  for (const locale of locales) {
    const content = article.locales[locale];
    if (!content) {
      console.warn('missing', article.slug, locale);
      continue;
    }
    const dir = path.join(root, locale);
    fs.mkdirSync(dir, { recursive: true });
    const tagsYaml = article.tags.map((t) => `"${t}"`).join(', ');
    const file = `---
title: ${JSON.stringify(content.title)}
description: ${JSON.stringify(content.description)}
pubDate: ${article.pubDate}
locale: ${locale}
tags: [${tagsYaml}]
draft: false
---

${content.body.trim()}
`;
    fs.writeFileSync(path.join(dir, `${article.slug}.md`), file, 'utf8');
    written += 1;
  }
}
console.log(`Wrote ${written} blog posts.`);
