import { articlesComponent } from '$lib/articles.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  const parentData = await parent();

  const component = articlesComponent[params.slug];
  const article = parentData.articleMap[params.slug];
  const articleToc = parentData.articleTocs[params.slug];
  if (!article || !component || !articleToc) {
    error(404, `Could not find ${params.slug}`);
  }

  return {
    component,
    article,
    articleToc,
  };
};
