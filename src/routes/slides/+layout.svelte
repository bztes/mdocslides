<script lang="ts">
  import { setContext } from 'svelte';

  let { children } = $props();

  setContext('view', 'slides');
</script>

<main>
  {@render children()}
</main>
