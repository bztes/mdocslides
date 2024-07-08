<script lang="ts">
  let { children } = $props();
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
