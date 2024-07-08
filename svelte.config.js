import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteMarkdown } from './markdown-preprocess.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), svelteMarkdown()],
  kit: {
    adapter: adapter(),
  },
};

export default config;
