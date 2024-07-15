<script lang="ts">
  import type { Post, PostTree, Slug } from '$lib/articles';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { getContext } from 'svelte';

  type Props = {
    trees: PostTree[];
    map: Record<Slug, Post>;
    view: string;
  };

  let { trees, map }: Props = $props();

  let view = getContext('view');
</script>

<ul>
  {#each trees as tree}
    {@const href = `${base}/${view}/${tree.slug}`}
    {@const post = map[tree.slug]}
    <li>
      {#if tree.children.length > 0}
        <span class="section">{post.metadata.title}</span>
        <svelte:self trees={tree.children} {map} {view} />
      {:else}
        <a {href} class="post" class:active={$page.url.pathname === href}>
          {post.metadata.title}
        </a>
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    margin: 0 0 2rem 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  span.section {
    display: block;
    font-weight: bold;
    padding: 0.4rem 0.6rem;
  }

  .post {
    font-weight: normal;
    display: block;
    padding: 0.4rem 0.6rem;
    border-radius: 0.25rem;
  }

  .active {
    background-color: var(--primary);
    color: var(--primary-content);
  }

  .post:not(.active):hover {
    background-color: var(--base-200);
  }
</style>
