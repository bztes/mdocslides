import { base } from '$app/paths';
import type { ArticleTocs } from '../api/articles/toc/+server';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
  const responseToc = await fetch(`${base}/api/articles/toc`);

  return {
    articleTocs: (await responseToc.json()) as ArticleTocs,
  };
};
