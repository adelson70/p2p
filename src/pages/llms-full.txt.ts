import type { APIRoute } from 'astro';
import { buildLlmsFullTxt } from '@/seo/llms';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const body = await buildLlmsFullTxt(site);
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
