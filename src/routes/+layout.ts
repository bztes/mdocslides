import '../app.css';
import type { Post, PostTree, Slug } from '$lib/posts';
import type { LayoutLoad } from './$types';
import { base } from '$app/paths';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseTrees = await fetch(`${base}/api/posts/tree`);
  const responseMap = await fetch(`${base}/api/posts/map`);

  return {
    postTrees: (await responseTrees.json()) as PostTree[],
    postMap: (await responseMap.json()) as Record<Slug, Post>,
  };
};
