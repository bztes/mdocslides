import { postComponents } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
  const parentData = await parent();

  const component = postComponents[params.slug];
  const post = parentData.postsMap[params.slug];
  const postSections = parentData.postSectionsMap[params.slug];
  if (!post || !component || !postSections) {
    error(404, `Could not find ${params.slug}`);
  }

  return {
    component,
    post,
    postSections,
  };
};
