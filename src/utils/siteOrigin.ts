/** Canonical site origin without trailing slash (matches `astro.config` `site`). */
export function siteOrigin(site: URL | string | undefined): string {
  const raw = typeof site === 'string' ? site : site?.href;
  return (raw ?? 'https://p2ptools.abjr.dev').replace(/\/$/, '');
}
