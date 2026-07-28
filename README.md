# Private Tools

Privacy-first browser utility platform. **Your data stays on your device.**

No mandatory accounts, no cloud file storage, no analytics on your transfers. The hub is a static Astro app deployable to Cloudflare Pages; tools run as client-side islands using Web APIs (WebRTC, IndexedDB, Workers).

## Stack

- [Astro](https://astro.build) + React + TypeScript + Tailwind CSS
- [nanostores](https://github.com/nanostores/nanostores) for tool state
- [idb](https://github.com/jakearchibald/idb) for local history
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for offline assets
- WebRTC DataChannels for **PrivateDrop** (chunked transfer for any file size), **PrivateChat** (text + files on one channel), and **PrivateWhiteboard** (drawing sync on `privateboard` channel)

## PrivateChat

- **One data channel** per room: JSON for chat (`text`, `typing`, `leave`) and the same chunked file protocol as PrivateDrop for attachments.
- **Manual pairing** (invite/response via copy or QR); no message relay on our servers.
- **Transport security**: WebRTC encrypts the data channel with DTLS between peers; there is no separate app-layer E2EE in v1.
- Text messages for the current session live **only in memory** (not written to IndexedDB). Leaving the room clears them.

## PrivateWhiteboard

- **Dedicated data channel** (`privateboard`): JSON stroke commands (normalized coordinates), clear, undo, leave.
- **Same manual pairing** as PrivateChat/PrivateDrop (invite/response, QR).
- **Session-only state** in memory; optional **Export PNG** from the local canvas.
- Routes: `/en/collaboration/whiteboard`, `/pt/collaboration/whiteboard`.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:4321` (root redirects to `/en/`). Local dev uses the default Astro server (no Cloudflare Workers runtime); `npm run build` enables the Cloudflare adapter for Pages output.

### Internationalization

- Locales: **en**, **pt**, **es**, **fr**, **zh** (简体中文).
- Dictionaries live in `src/i18n/*.json`; `getDictionary()` deep-merges each locale onto English so missing keys still work.
- Routes use a single tree: `src/pages/[locale]/…` (no duplicated `en/` / `pt/` folders).
- Sidebar language menu + full grid in **Settings**.
- Tests in `src/i18n/i18n.test.ts` ensure every locale exposes the same keys as English.
- Refresh machine translations: `npm run i18n:rebuild` (from cache) or `npm run i18n:translate` (calls MyMemory API).

```bash
npm run check   # astro check
npm run build   # production build
npm run preview   # wrangler dev (run after build; astro preview is not used with the Cloudflare adapter)
```

## PrivateDrop & WebRTC limitations

- **Any file size**: transfers are chunked in a Web Worker with backpressure/ACK over the data channel—the same tool for small and large files.
- **Signaling is manual in v1**: peers exchange SDP/ICE as JSON (clipboard or QR). No signaling server processes your files.
- **STUN (multi-server)**: Google + Cloudflare public STUN for ICE/srflx candidates. Symmetric NAT or strict firewalls may still block direct P2P; optional TURN may be added later.
- **Both peers must be online** during the transfer.
- **WebRTC tools need network**; the PWA offline cache covers the hub shell and static assets.

## Deploy (Cloudflare Pages)

1. Connect the repository to Cloudflare Pages.
2. Build command: `npm run build`
3. Build output directory: `dist/client` (static HTML and assets; not the `dist/` root alone)

Canonical URL is hardcoded in `src/site.ts` (`https://p2ptools.abjr.dev`) for sitemap, `robots.txt`, `llms.txt`, and RSS.

### SEO & discovery

At build time (uses `site` in `astro.config.mjs` from `src/site.ts`):

| URL | Purpose |
|-----|---------|
| `/robots.txt` | Crawler rules + sitemap pointer |
| `/llms.txt` | Short site map for LLM crawlers ([llmstxt.org](https://llmstxt.org/)) |
| `/llms-full.txt` | All blog posts with titles/descriptions per locale |
| `/rss.xml` | Latest blog posts (RSS 2.0) |
| `/sitemap-index.xml` | Astro sitemap with `hreflang` |
| `/humans.txt` | Credits (static in `public/`) |

The project uses `@astrojs/cloudflare` with `output: 'static'`.

### Troubleshooting dev (rare)

If the browser shows stale scripts after you **used a production build** on the same origin, unregister the service worker once (DevTools → Application → Service Workers) and hard-refresh. Day-to-day work is just `npm run dev` — you do **not** need to delete `node_modules/.vite` unless you changed Vite/React config and HMR acts broken (one-time cache reset).

## Project layout

```
src/
  components/     Design system & shell
  features/       Connection layer, history, settings
  tools/          One folder per tool (e.g. privatedrop/)
  services/db/    IndexedDB
  pages/en|pt/    Localized routes + SEO landings
```

## Roadmap (product spec)

- Phase 3: PrivateCall, screen share (PrivateChat shipped)
- Phase 4: Whiteboard, shared notes
- Phase 5: SEO landings at scale, blog

## License

MIT (add license file if you publish).
