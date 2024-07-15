import { postsMap } from '$lib/articles';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => json(postsMap);
