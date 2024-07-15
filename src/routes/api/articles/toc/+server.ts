import { mdFiles, type PostToc, type Slug } from '$lib/articles';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export type PostTocs = Record<Slug, PostToc>;

const postTocs: PostTocs = {};

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  postTocs[slug] = mdFile.toc;
}

export const GET: RequestHandler = () => json(postTocs);
