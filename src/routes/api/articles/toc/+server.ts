import { mdFiles, type ArticleToc, type Slug } from '$lib/articles';
import { json } from '@sveltejs/kit';

export const prerender = true;

export type ArticleTocs = Record<Slug, ArticleToc>;

const articleTocs: ArticleTocs = {};

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  articleTocs[slug] = mdFile.toc;
}

export async function GET() {
  return json(articleTocs);
}
