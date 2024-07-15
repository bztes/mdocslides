import { mdFiles, type ArticleToc, type Slug } from '$lib/articles';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export type ArticleTocs = Record<Slug, ArticleToc>;

const articleTocs: ArticleTocs = {};

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  articleTocs[slug] = mdFile.toc;
}

export const GET: RequestHandler = () => json(articleTocs);
