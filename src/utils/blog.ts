import type { CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/config';

export type BlogEntry = CollectionEntry<'blog'>;

/** Collection id is `{locale}/{slug}` (no extension). */
export function blogSlugFromId(id: string): string {
  const slash = id.indexOf('/');
  return slash === -1 ? id : id.slice(slash + 1);
}

export function blogLocaleFromEntry(entry: BlogEntry): Locale {
  return entry.data.locale;
}

export function sortBlogByDateDesc(a: BlogEntry, b: BlogEntry): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function isPublished(entry: BlogEntry): boolean {
  return entry.data.draft !== true;
}
