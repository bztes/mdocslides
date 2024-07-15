import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mdFiles, type PostSections, type Slug } from '$lib/posts';

export const prerender = true;

export type PostSectionsMap = Record<Slug, PostSections>;

const postSectionsMap: PostSectionsMap = {};

for (const [slug, mdFile] of Object.entries(mdFiles)) {
  postSectionsMap[slug] = mdFile.sections;
}

export const GET: RequestHandler = () => json(postSectionsMap);
