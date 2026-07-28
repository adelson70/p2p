import type { APIRoute } from 'astro';
import { siteOrigin } from '@/utils/siteOrigin';

export const prerender = true;

/**
 * Alias for `/sitemap-index.xml` (common Google Search Console URL).
 * At build time, `sitemapXmlAlias` integration overwrites this with the real index file.
 */
export const GET: APIRoute = ({ site }) => {
  const base = siteOrigin(site);
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `<sitemap><loc>${base}/sitemap-0.xml</loc></sitemap>` +
    '</sitemapindex>';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
