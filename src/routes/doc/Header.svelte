<script lang="ts">
  import { base } from '$app/paths';
  import Search from '../../lib/ui/Search.svelte';

  let searchVisible = $state(false);
  function handleSearchClick() {
    searchVisible = true;
  }

  let isScrolled = $state();
  function handleScroll() {
    isScrolled = window.scrollY > 20;
  }
</script>

<svelte:window onscroll={handleScroll} onload={handleScroll} />

<Search bind:visible={searchVisible}></Search>

<header class:scrolled={isScrolled}>
  <div class="title">
    <a href={`${base}/doc`}>MDocSlides</a>
  </div>
  <div>
    <button onclick={handleSearchClick} class="icon" title="Search">
      search
    </button>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    left: 0;
    height: var(--header-height);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }

  header.scrolled {
    background-color: var(--base-200);
    border-bottom: 1px solid var(--base-300);
  }

  .title {
    overflow: hidden;
  }
</style>
