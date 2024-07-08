<script lang="ts">
  import type { Article, ArticleTree, Slug } from '$lib/articles';
  import { page } from '$app/stores';

  type Props = {
    trees: ArticleTree[];
    map: Record<Slug, Article>;
    base: string;
  };

  let { trees, map, base }: Props = $props();
</script>

<ul>
  {#each trees as tree}
    {@const href = `/${base}/${tree.slug}`}
    {@const article = map[tree.slug]}
    <li>
      {#if tree.children.length > 0}
        <span class="section">{article.metadata.title}</span>
        <svelte:self trees={tree.children} {map} {base} />
      {:else}
        <a {href} class="article" class:active={$page.url.pathname === href}>
          {article.metadata.title}
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

  .article {
    font-weight: normal;
    display: block;
    padding: 0.4rem 0.6rem;
    border-radius: 0.25rem;
  }

  .active {
    background-color: var(--primary);
    color: var(--primary-content);
  }

  .article:not(.active):hover {
    background-color: var(--base-200);
  }
</style>
