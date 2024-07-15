import { postsTree } from '$lib/posts';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => json(postsTree);
