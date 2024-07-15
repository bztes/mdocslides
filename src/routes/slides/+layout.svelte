<script lang="ts">
  import { setContext } from 'svelte';

  let { children } = $props();

  setContext('view', 'slides');
</script>

<div class="page light-theme">
  <main>
    {@render children()}
  </main>
</div>

<style>
  main {
    padding: 4rem;
  }
</style>
