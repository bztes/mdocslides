<script lang="ts">
  import { base } from '$app/paths';
  import { createArticlesIndex, searchArticlesIndex } from '$lib/search';
  import { onMount } from 'svelte';

  let { visible = $bindable('false') } = $props();

  let searchTerm = $state('');
  let status: 'loading' | 'ready' = $state('loading');
  let inputEl: HTMLElement | undefined = $state();

  onMount(async () => {
    const articleTocs = await fetch(`${base}/api/articles/toc`).then((res) =>
      res.json(),
    );
    createArticlesIndex(articleTocs);
    status = 'ready';
  });

  let results = $derived(
    status === 'loading' ? [] : searchArticlesIndex(searchTerm),
  );

  $effect(() => {
    if (visible) {
      const scrollbarWidth =
        window.innerWidth - document.body.clientWidth + 'px';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = scrollbarWidth;
      inputEl?.focus();
    } else {
      searchTerm = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  });

  function onBackgroundClick(e: Event) {
    if (e.target === e.currentTarget) {
      visible = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'k') {
      visible = true;
    } else if (e.key == 'Escape') {
      visible = false;
    } else {
      return;
    }

    e.preventDefault();
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="overlay" class:visible onclick={onBackgroundClick}>
  <div class="modal">
    <input
      bind:this={inputEl}
      bind:value={searchTerm}
      placeholder="Search"
      autocomplete="off"
      spellcheck="false"
      type="search"
    />

    <div class="results">
      {#if searchTerm === ''}
        <div class="info">Type to search</div>
      {:else if results.length === 0}
        <div class="info">Nothing found</div>
      {:else}
        <ul>
          {#each results as result}
            <li>
              <a
                href={`${result.slug}#${result.id}`}
                onclick={() => (visible = false)}
              >
                <h2>
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html result.title}
                </h2>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html result.excerpts.join(' ... ')}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff99;
    backdrop-filter: blur(4px);
    z-index: 200;
    display: grid;
    justify-content: center;
    align-content: start;
    visibility: hidden;
  }

  .visible {
    visibility: visible;
  }

  .modal {
    background-color: white;
    margin-top: 10vh;
    max-height: 80vh;
    width: 600px;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    border-radius: 0.6rem;
    filter: var(--filter-shadow);
    overflow: hidden;
  }

  input {
    background-color: var(--neutral);
    color: var(--neutral-content);
    border: 0;
    padding: 1rem;
    border-radius: 0;
  }

  .results {
    overflow-y: auto;
  }

  .info {
    display: flex;
    height: 5rem;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    text-align: justify;
    padding: 1rem;
    font-size: 0.9rem;
  }

  li:hover {
    background-color: var(--base-200);
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }
</style>
