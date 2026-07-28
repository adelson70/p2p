import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '@/seo/llms';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  return new Response(buildLlmsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
