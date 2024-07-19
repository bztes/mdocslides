<script lang="ts">
  import Search from '$lib/ui/Search.svelte';
  import { setContext } from 'svelte';

  let { children } = $props();

  setContext('view', 'slides');
</script>

<Search></Search>

<main>
  {@render children()}
</main>
