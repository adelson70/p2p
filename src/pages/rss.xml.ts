import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { localePath } from '@/i18n/config';
import { blogSlugFromId, isPublished, sortBlogByDateDesc } from '@/utils/blog';
import { escapeXml } from '@/seo/llms';
import { siteOrigin } from '@/utils/siteOrigin';

export const prerender = true;

const FEED_LIMIT = 40;

export const GET: APIRoute = async ({ site }) => {
  const base = siteOrigin(site);
  const posts = (await getCollection('blog')).filter(isPublished).sort(sortBlogByDateDesc).slice(0, FEED_LIMIT);

  const items = posts
    .map((post) => {
      const slug = blogSlugFromId(post.id);
      const loc = post.data.locale;
      const link = `${base}${localePath(loc, `/blog/${slug}`)}`;
      const pubDate = post.data.pubDate.toUTCString();
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Private Tools — Privacy blog</title>
    <link>${base}/en/blog</link>
    <description>Peer-to-peer privacy, WebRTC, and browser-local tools (all locales).</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
