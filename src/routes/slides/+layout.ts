import { base } from '$app/paths';
import type { PostSectionsMap } from '../api/posts/sections/+server';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const response = await fetch(`${base}/api/posts/sections`);

  return {
    postSectionsMap: (await response.json()) as PostSectionsMap,
  };
};
