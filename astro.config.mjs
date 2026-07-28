// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/site.ts';
import { sitemapXmlAlias } from './src/integrations/sitemapXmlAlias.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const useCloudflareAdapter =
  process.env.npm_lifecycle_event === 'build' || process.env.CF_PAGES === '1';

const isDevServer = process.env.npm_lifecycle_event === 'dev';

const reactJsx = /** @type {const} */ ({
  runtime: 'automatic',
  importSource: 'react',
  development: isDevServer,
});

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          pt: 'pt-BR',
          es: 'es',
          fr: 'fr',
          zh: 'zh-Hans',
        },
      },
      customPages: [`${SITE}/llms.txt`, `${SITE}/llms-full.txt`, `${SITE}/rss.xml`],
    }),
    sitemapXmlAlias(),
    mdx(),
  ],
  adapter: useCloudflareAdapter
    ? cloudflare({
        imageService: 'compile',
      })
    : undefined,
  vite: {
    oxc: {
      jsx: reactJsx,
    },
    plugins: [
      tailwindcss(),
      ...(isDevServer
        ? []
        : [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['favicon.svg', 'icons/*.png'],
              manifest: {
                name: 'Private Tools',
                short_name: 'PrivateTools',
                description:
                  'Privacy-first browser tools. Your data stays on your device.',
                theme_color: '#0a0a0b',
                background_color: '#0a0a0b',
                display: 'standalone',
                start_url: '/en/',
                icons: [
                  {
                    src: '/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                  },
                  {
                    src: '/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                  },
                ],
              },
              workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: '/en/index.html',
              },
            }),
          ]),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
