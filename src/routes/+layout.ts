import '../app.css';
import type { PostsMap, PostsTree } from '$lib/posts';
import type { LayoutLoad } from './$types';
import { base } from '$app/paths';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseTree = await fetch(`${base}/api/posts/tree`);
  const responseMap = await fetch(`${base}/api/posts/map`);

  return {
    postsTree: (await responseTree.json()) as PostsTree,
    postsMap: (await responseMap.json()) as PostsMap,
  };
};
