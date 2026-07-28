import type { APIRoute } from 'astro';
import { siteOrigin } from '@/utils/siteOrigin';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = siteOrigin(site);

  const body = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Static build assets (no need to crawl)
Disallow: /_astro/

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

# LLM-readable site summary: /llms.txt

Sitemap: ${base}/sitemap.xml
Sitemap: ${base}/sitemap-index.xml
`;

  return new Response(body.trim() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
