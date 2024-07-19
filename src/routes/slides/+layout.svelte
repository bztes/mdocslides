<script lang="ts">
  import SlidesOverlay from './SlidesOverlay.svelte';
  import Search from '$lib/ui/Search.svelte';
  import { setContext } from 'svelte';

  let { children } = $props();

  setContext('view', 'slides');

  let searchVisible = $state(false);

  function handleSearchClick() {
    searchVisible = !searchVisible;
  }
</script>

<Search bind:visible={searchVisible}></Search>

<main>
  {@render children()}
</main>

<SlidesOverlay position="top-right">
  <button
    onclick={handleSearchClick}
    class="icon"
    class:active={searchVisible}
    title="Search"
  >
    search
  </button>
</SlidesOverlay>
