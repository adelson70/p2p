import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

/** Copy `sitemap-index.xml` → `sitemap.xml` after @astrojs/sitemap runs (GSC default URL). */
export function sitemapXmlAlias(): AstroIntegration {
  return {
    name: 'sitemap-xml-alias',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const clientDir = fileURLToPath(dir);
        const indexPath = path.join(clientDir, 'sitemap-index.xml');
        const aliasPath = path.join(clientDir, 'sitemap.xml');

        try {
          await fs.access(indexPath);
          await fs.copyFile(indexPath, aliasPath);
          logger.info('`sitemap.xml` created (copy of `sitemap-index.xml`)');
        } catch {
          logger.warn('`sitemap-index.xml` not found; `sitemap.xml` alias skipped');
        }
      },
    },
  };
}
