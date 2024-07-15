import '../app.css';
import type { Post, PostTree, Slug } from '$lib/articles';
import type { LayoutLoad } from './$types';
import { base } from '$app/paths';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseTrees = await fetch(`${base}/api/articles/tree`);
  const responseMap = await fetch(`${base}/api/articles/map`);

  return {
    postTrees: (await responseTrees.json()) as PostTree[],
    postMap: (await responseMap.json()) as Record<Slug, Post>,
  };
};
