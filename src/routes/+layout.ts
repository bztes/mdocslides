import '../app.css';
import type { Article, ArticleTree, Slug } from '$lib/articles.js';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseTrees = await fetch('/api/articles/tree');
  const responseMap = await fetch('/api/articles/map');

  return {
    articleTrees: (await responseTrees.json()) as ArticleTree[],
    articleMap: (await responseMap.json()) as Record<Slug, Article>,
  };
};
