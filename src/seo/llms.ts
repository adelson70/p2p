import { getCollection } from 'astro:content';
import type { Locale } from '@/i18n/config';
import { defaultLocale, localePath, locales } from '@/i18n/config';
import { blogSlugFromId, isPublished, sortBlogByDateDesc } from '@/utils/blog';
import { siteOrigin } from '@/utils/siteOrigin';

const BLOG_SLUGS_EN = [
  'why-peer-to-peer-protects-privacy',
  'what-cloud-file-sharing-collects',
  'webrtc-explained-for-everyone',
  'browser-local-first-your-data-stays',
  'no-accounts-no-tracking',
  'end-to-end-encryption-in-the-browser',
  'qr-code-pairing-security',
  'what-p2p-does-and-does-not-protect',
  'gdpr-lgpd-without-collecting-data',
  'corporate-networks-and-p2p',
  'metadata-minimization-file-transfers',
  'privacy-first-alternatives-to-wetransfer',
] as const;

function abs(site: URL | undefined, locale: Locale, path: string): string {
  return `${siteOrigin(site)}${localePath(locale, path)}`;
}

function line(title: string, url: string, note?: string): string {
  return note ? `- [${title}](${url}): ${note}` : `- [${title}](${url})`;
}

/** Short llms.txt (https://llmstxt.org/) */
export function buildLlmsTxt(site: URL | undefined): string {
  const base = siteOrigin(site);
  const en = (path: string) => abs(site, 'en', path);

  const localeLines = locales.map((loc) => line(`Home (${loc})`, abs(site, loc, '/')));

  const blogLines = BLOG_SLUGS_EN.map((slug) =>
    line(slug.replace(/-/g, ' '), en(`/blog/${slug}`), 'Privacy article (also available in pt, es, fr, zh)'),
  );

  return `# Private Tools

> Privacy-first browser utilities. Files, chat, and collaboration run in your browser; payloads are not stored on our servers.

Private Tools (PrivateDrop, PrivateChat, PrivateCall, whiteboard) use WebRTC for peer-to-peer sessions after manual QR or copy/paste pairing. No accounts required. Site languages: en, pt, es, fr, zh.

## Primary entry points

${localeLines.join('\n')}
${line('Tools directory', en('/tools'), 'All live utilities')}
${line('PrivateDrop transfer', en('/transfer'), 'P2P file send/receive')}
${line('PrivateChat', en('/communication/privatechat'))}
${line('PrivateCall', en('/communication/privatecall'))}
${line('Whiteboard', en('/collaboration/whiteboard'))}

## SEO landings

${line('Send large files (no upload)', en('/send-large-files'))}
${line('WeTransfer alternative', en('/we-transfer-alternative'))}

## Privacy blog (English URLs; localized paths use /{locale}/blog/…)

${line('Blog index', en('/blog'))}
${blogLines.join('\n')}

## Machine-readable

- [Full llms index](${base}/llms-full.txt): all blog posts with titles and descriptions per locale
- [RSS feed](${base}/rss.xml): latest blog posts
- [Sitemap](${base}/sitemap-index.xml)

## Optional

- Canonical base URL: ${base}
- Default locale: ${defaultLocale}
`;
}

/** Expanded index for crawlers and assistants */
export async function buildLlmsFullTxt(site: URL | undefined): Promise<string> {
  const base = siteOrigin(site);
  const posts = (await getCollection('blog')).filter(isPublished).sort(sortBlogByDateDesc);

  const bySlug = new Map<string, typeof posts>();
  for (const post of posts) {
    const slug = blogSlugFromId(post.id);
    const list = bySlug.get(slug) ?? [];
    list.push(post);
    bySlug.set(slug, list);
  }

  const sections: string[] = [
    `# Private Tools — full llms index`,
    ``,
    `> Generated from content collection. Base: ${base}`,
    ``,
    `## Blog posts by slug`,
    ``,
  ];

  for (const slug of [...bySlug.keys()].sort()) {
    sections.push(`### ${slug}`);
    sections.push(``);
    for (const post of bySlug.get(slug) ?? []) {
      const loc = post.data.locale;
      const url = abs(site, loc, `/blog/${slug}`);
      sections.push(`- **${loc}**: [${post.data.title}](${url}) — ${post.data.description}`);
    }
    sections.push(``);
  }

  sections.push(`## Static routes (all locales)`);
  sections.push(``);
  const paths = [
    '/',
    '/tools',
    '/transfer',
    '/communication',
    '/collaboration',
    '/history',
    '/settings',
    '/blog',
    '/send-large-files',
    '/we-transfer-alternative',
  ];
  for (const path of paths) {
    sections.push(`- \`${path}\` → ${locales.map((l) => abs(site, l, path)).join(', ')}`);
  }

  return sections.join('\n');
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
