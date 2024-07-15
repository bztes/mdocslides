import { base } from '$app/paths';
import type { PostTocs } from '../api/posts/toc/+server';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseToc = await fetch(`${base}/api/posts/toc`);

  return {
    postTocs: (await responseToc.json()) as PostTocs,
  };
};
